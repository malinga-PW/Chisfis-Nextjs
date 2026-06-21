'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'

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
  signup: (phone: string, password: string, name: string, role: 'BUYER' | 'SELLER') => Promise<{ error: string | null; userId: string | null }>
  logout: () => void
  switchRole: (role: UserRole) => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  const user: User | null = session?.user
    ? {
        id: session.user.id || '',
        name: session.user.name || '',
        email: (session.user as any).phone || session.user.email || '',
        role: (session.user as any).role || 'BUYER',
        avatar: (session.user as any).avatar,
      }
    : null

  const login = async (phone: string, password: string) => {
    const result = await signIn('credentials', {
      phone,
      password,
      redirect: false,
    })
    if (result?.error) throw new Error(result.error)
  }

  const signup = async (_phone: string, _password: string, _name: string, _role: 'BUYER' | 'SELLER') => {
    return { error: null, userId: null }
  }

  const logout = async () => {
    await signOut({ redirect: false })
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
