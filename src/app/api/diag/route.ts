import { NextResponse } from 'next/server'

export async function GET() {
  const results: Record<string, any> = {}

  // Check env vars (masked)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  results.env = {
    supabaseUrl: supabaseUrl || '(not set)',
    anonKeySet: !!anonKey,
    anonKeyLen: anonKey.length,
    serviceKeySet: !!serviceKey,
    serviceKeyLen: serviceKey.length,
    serviceKeyHasDummy: serviceKey.includes('dummy'),
    authSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    authUrl: process.env.AUTH_URL || process.env.NEXTAUTH_URL || '(not set)',
  }

  // Try to reach Supabase health endpoint
  if (supabaseUrl) {
    const urlsToTest = [
      `${supabaseUrl}/auth/v1/health`,
      `${supabaseUrl}/rest/v1/`,
      supabaseUrl,
    ]

    results.supabaseReachability = {}

    for (const url of urlsToTest) {
      try {
        const ctrl = new AbortController()
        const timeout = setTimeout(() => ctrl.abort(), 5000)
        const resp = await fetch(url, {
          headers: { apikey: anonKey },
          signal: ctrl.signal,
        })
        clearTimeout(timeout)
        const text = await resp.text().catch(() => '(could not read body)')
        results.supabaseReachability[url] = {
          status: resp.status,
          ok: resp.ok,
          bodyPreview: text.slice(0, 200),
        }
      } catch (e: any) {
        results.supabaseReachability[url] = { error: e.message }
      }
    }

    // Try alternate URLs
    const alternates = [
      'http://localhost:8000/auth/v1/health',
      'http://127.0.0.1:8000/auth/v1/health',
      'http://supabase-kong:8000/auth/v1/health',
      'http://kong:8000/auth/v1/health',
    ]

    results.alternateUrls = {}
    for (const url of alternates) {
      try {
        const ctrl = new AbortController()
        const timeout = setTimeout(() => ctrl.abort(), 3000)
        const resp = await fetch(url, {
          headers: { apikey: anonKey },
          signal: ctrl.signal,
        })
        clearTimeout(timeout)
        const text = await resp.text().catch(() => '')
        results.alternateUrls[url] = { status: resp.status, bodyPreview: text.slice(0, 100) }
      } catch (e: any) {
        results.alternateUrls[url] = { error: e.message }
      }
    }
  }

  // Server info
  results.server = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    hostname: process.env.HOSTNAME || '(unknown)',
  }

  return NextResponse.json(results, { status: 200 })
}
