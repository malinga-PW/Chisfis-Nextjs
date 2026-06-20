import { NextResponse } from 'next/server'

const N8N_PAYMENTS_URL = process.env.NEXT_PUBLIC_N8N_PAYMENTS_URL || 'https://n8n.pixelwave.lk/webhook/local-payments'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (!action) {
      return NextResponse.json({ error: 'Missing action field' }, { status: 400 })
    }

    const response = await fetch(N8N_PAYMENTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, timestamp: new Date().toISOString() }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Payment request failed' }, { status: 500 })
  }
}
