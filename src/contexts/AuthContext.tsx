'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  signUpWithPhone,
  signInWithPhone,
  signOut as supabaseSignOut,
  getSessionUser,
  onAuthStateChange,
  type AuthUser,
} from '@/lib/supabase/auth'

export type UserRole = 'BUYER' | 'SELLER' | 'SUPER_ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (phone: string, password: string) => Promise<void>
  signup: (phone: string, password: string, name: string, role: UserRole) => Promise<string | null>
  logout: () => void
  switchRole: (role: UserRole) => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function mapAuthUser(u: AuthUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.phone,
    role: u.role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessionUser().then((u) => {
      if (u) setUser(mapAuthUser(u))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChange((u) => {
      setUser(u ? mapAuthUser(u) : null)
    })
    return unsub
  }, [])

  const login = async (phone: string, password: string) => {
    const { user: au, error } = await signInWithPhone(phone, password)
    if (error || !au) throw new Error(error ?? 'Login failed')
    setUser(mapAuthUser(au))
  }

  const signup = async (phone: string, password: string, name: string, role: UserRole): Promise<string | null> => {
    const { user: au, error } = await signUpWithPhone(phone, password, { name, role })
    if (error) return error
    if (au) setUser(mapAuthUser(au))
    return null
  }

  const logout = async () => {
    await supabaseSignOut()
    setUser(null)
  }

  const switchRole = (_role: UserRole) => {}

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, switchRole, isAuthenticated: user !== null, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
