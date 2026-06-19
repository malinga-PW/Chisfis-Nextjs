import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey())
}

let _supabase: SupabaseClient | null | undefined

export function getSupabaseClient(): SupabaseClient | null {
  if (_supabase === undefined) {
    const url = getSupabaseUrl()
    const key = getSupabaseAnonKey()
    _supabase = url && key ? createClient(url, key) : null
  }
  return _supabase
}
