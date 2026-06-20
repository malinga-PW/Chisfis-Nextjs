import { NextResponse } from 'next/server'

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chisfis-events'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, password, name, role, businessName, location } = body

    if (!phone || !password || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: role === 'SELLER' ? 'vendor_signup' : 'buyer_signup',
        phone,
        password,
        name,
        role,
        businessName,
        location,
        timestamp: new Date().toISOString(),
      }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Signup failed' }, { status: 500 })
  }
}
