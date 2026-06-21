import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

function phoneToEmail(phone: string): string {
  return `${phone.replace(/[^0-9]/g, '')}@chisfis.local`
}

function safeJsonParse(text: string): { ok: true; data: any } | { ok: false; error: string } {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  const clean = start !== -1 && end !== -1 ? text.slice(start, end + 1) : text
  try {
    return { ok: true, data: JSON.parse(clean) }
  } catch {
    return { ok: false, error: `JSON parse failed. Clean length: ${clean.length}, raw: ${text.slice(0, 200)}` }
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.text()
    console.log('signup raw body:', raw)

    const parsed = safeJsonParse(raw)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { phone, password, name, role, businessName, location } = parsed.data

    if (!phone || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Supabase service key not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const email = phoneToEmail(phone)
    const emailForLog = email

    let authData: any
    try {
      const resp = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role, phone },
      })
      authData = resp
    } catch (supabaseErr: any) {
      console.error('Supabase createUser threw:', supabaseErr?.message)
      const hint = serviceKey.includes('dummy')
        ? 'SUPABASE_SERVICE_ROLE_KEY appears to be a placeholder (contains "dummy"). Set the real key in Vercel env vars.'
        : `Supabase connection error: ${supabaseErr?.message || 'unknown'}`
      return NextResponse.json({ error: hint, supabaseUrl, emailForLog }, { status: 500 })
    }

    if (authData.error || !authData.data?.user) {
      return NextResponse.json({ error: authData.error?.message || 'Failed to create user in Supabase' }, { status: 400 })
    }

    const userId = authData.data.user.id

    try {
      if (role === 'SELLER') {
        await supabase.from('hl_vendors').upsert({
          id: userId,
          business_name: businessName || name,
          owner_name: name,
          email: phone,
          location: location || '',
          phone,
          logo_url: '',
          owner_photo_url: '',
          whatsapp_number: phone,
          whatsapp_available: true,
          address: location ? `${location}, Sri Lanka` : '',
          lat: 6.9271,
          lng: 79.8612,
          delivery_mode: 'areas',
          delivery_areas: [],
          delivery_radius_km: 10,
          visibility: { ownerName: true, phone: true, address: true, deliveryInfo: true, whatsapp: true },
          products: [],
          improvement_notes: '',
          status: 'Pending',
          submitted_at: new Date().toISOString().slice(0, 10),
        })
      } else {
        await supabase.from('hl_buyers').upsert({
          id: userId,
          full_name: name,
          email: phone,
          phone,
          orders_count: 0,
          joined_at: new Date().toISOString().slice(0, 10),
        })
      }
    } catch (dbErr: any) {
      console.error('Supabase upsert threw:', dbErr?.message)
      return NextResponse.json({ error: `User created but failed to save profile: ${dbErr?.message}` }, { status: 500 })
    }

    // --- n8n Webhook Trigger (non-blocking) ---
    try {
      const N8N_WEBHOOK_URL =
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://n8n.pixelwave.lk/webhook/lankaonline-onboarding'

      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role,
          name,
          phone,
          businessName: businessName || 'N/A',
          location: location || 'N/A',
        }),
      }).catch((e) => console.log('n8n trigger failed, but user was created:', e))
    } catch (e) {
      console.log('Webhook execution error:', e)
    }
    // --- End n8n Webhook Trigger ---

    return NextResponse.json({ userId, error: null })
  } catch (err: any) {
    console.error('signup unexpected error:', err)
    return NextResponse.json({ error: err?.message || 'Signup failed' }, { status: 500 })
  }
}
