import { supabase, isSupabaseConfigured } from './client'

export interface AuthUser {
  id: string
  phone: string
  name: string
  role: 'BUYER' | 'SELLER' | 'SUPER_ADMIN'
  avatar?: string
}

const ADMIN_PASSWORD = 'Admin@hostlanka'

function adminLogin(phone: string, password: string): { user: AuthUser | null; error: string | null } {
  if (password !== ADMIN_PASSWORD) {
    return { user: null, error: 'Invalid admin credentials' }
  }
  return {
    user: {
      id: 'admin-super',
      phone,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
    error: null,
  }
}

export async function signUpWithPhone(
  phone: string,
  password: string,
  metadata: { name: string; role: 'BUYER' | 'SELLER' },
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (password === ADMIN_PASSWORD) {
    return { user: null, error: 'This password is reserved for admin login' }
  }

  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: { data: { name: metadata.name, role: metadata.role } },
  })

  if (error) return { user: null, error: error.message }
  if (!data.user) return { user: null, error: 'Signup failed' }

  return {
    user: {
      id: data.user.id,
      phone: data.user.phone ?? phone,
      name: metadata.name,
      role: metadata.role,
    },
    error: null,
  }
}

export async function signInWithPhone(
  phone: string,
  password: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Super admin login bypass
  if (password === ADMIN_PASSWORD) {
    return adminLogin(phone, password)
  }

  if (!isSupabaseConfigured || !supabase) {
    return { user: null, error: 'Supabase not configured' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ phone, password })
  if (error) return { user: null, error: error.message }
  if (!data.user) return { user: null, error: 'Login failed' }

  const meta = data.user.user_metadata ?? {}
  return {
    user: {
      id: data.user.id,
      phone: data.user.phone ?? phone,
      name: (meta.name as string) ?? phone,
      role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') ?? 'BUYER',
    },
    error: null,
  }
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  await supabase.auth.signOut()
}

export async function getSessionUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured || !supabase) return null

  const { data } = await supabase.auth.getSession()
  if (!data.session?.user) return null

  const u = data.session.user
  const meta = u.user_metadata ?? {}
  return {
    id: u.id,
    phone: u.phone ?? '',
    name: (meta.name as string) ?? u.phone ?? 'User',
    role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') ?? 'BUYER',
  }
}

export function onAuthStateChange(cb: (user: AuthUser | null) => void): () => void {
  if (!isSupabaseConfigured || !supabase) {
    return () => {}
  }

  const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      cb(null)
      return
    }
    const u = session.user
    const meta = u.user_metadata ?? {}
    cb({
      id: u.id,
      phone: u.phone ?? '',
      name: (meta.name as string) ?? u.phone ?? 'User',
      role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') ?? 'BUYER',
    })
  })

  return () => subscription?.subscription.unsubscribe()
}
