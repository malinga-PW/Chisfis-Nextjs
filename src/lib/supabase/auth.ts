import { getSupabaseClient } from './client'

export interface AuthUser {
  id: string
  phone: string
  name: string
  role: 'BUYER' | 'SELLER' | 'SUPER_ADMIN'
  avatar?: string
}

const ADMIN_PASSWORD = 'Admin@hostlanka'

function phoneToEmail(phone: string): string {
  return `${phone.replace(/[^0-9]/g, '')}@hostlanka.local`
}

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

function sb() {
  return getSupabaseClient()
}

export async function signUpWithPhone(
  phone: string,
  password: string,
  metadata: { name: string; role: 'BUYER' | 'SELLER' },
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (password === ADMIN_PASSWORD) {
    return { user: null, error: 'This password is reserved for admin login' }
  }

  const client = sb()
  if (!client) {
    return { user: null, error: 'Supabase not configured' }
  }

  const email = phoneToEmail(phone)

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { name: metadata.name, role: metadata.role, phone } },
  })

  if (error) return { user: null, error: error.message }
  if (!data.user) return { user: null, error: 'Signup failed' }

  return {
    user: {
      id: data.user.id,
      phone,
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
  if (password === ADMIN_PASSWORD) {
    return adminLogin(phone, password)
  }

  const client = sb()
  if (!client) {
    return { user: null, error: 'Supabase not configured - check .env.local' }
  }

  const email = phoneToEmail(phone)

  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) return { user: null, error: error.message }
  if (!data.user) return { user: null, error: 'Login failed' }

  const meta = data.user.user_metadata ?? {}
  const storedPhone = (meta.phone as string) ?? phone
  return {
    user: {
      id: data.user.id,
      phone: storedPhone,
      name: (meta.name as string) ?? phone,
      role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') ?? 'BUYER',
    },
    error: null,
  }
}

export async function signOut(): Promise<void> {
  const client = sb()
  if (!client) return
  await client.auth.signOut()
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const client = sb()
  if (!client) return null

  const { data } = await client.auth.getSession()
  if (!data.session?.user) return null

  const u = data.session.user
  const meta = u.user_metadata ?? {}
  return {
    id: u.id,
    phone: (meta.phone as string) ?? u.email ?? '',
    name: (meta.name as string) ?? u.email ?? 'User',
    role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') ?? 'BUYER',
  }
}

export function onAuthStateChange(cb: (user: AuthUser | null) => void): () => void {
  const client = sb()
  if (!client) {
    return () => {}
  }

  const { data: subscription } = client.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      cb(null)
      return
    }
    const u = session.user
    const meta = u.user_metadata ?? {}
    cb({
      id: u.id,
      phone: (meta.phone as string) ?? u.email ?? '',
      name: (meta.name as string) ?? u.email ?? 'User',
      role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') ?? 'BUYER',
    })
  })

  return () => subscription?.subscription.unsubscribe()
}
