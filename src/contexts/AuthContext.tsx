'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

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
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (role: UserRole) => void
  isAuthenticated: boolean
}

const DEMO_USERS: Record<string, User> = {
  buyer: { id: 'u1', name: 'Eden Smith', email: 'eden@example.com', role: 'BUYER' },
  seller: { id: 'u2', name: 'Nimru Cakes', email: 'baker@example.com', role: 'SELLER' },
  admin: { id: 'u3', name: 'Admin Nimru', email: 'admin@nimru.com', role: 'SUPER_ADMIN' },
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USERS.buyer)

  const login = async (email: string, _password: string) => {
    const found = Object.values(DEMO_USERS).find((u) => u.email === email)
    if (found) {
      setUser(found)
    } else {
      setUser({ id: 'u-new', name: email.split('@')[0], email, role: 'BUYER' })
    }
  }

  const logout = () => setUser(null)

  const switchRole = (role: UserRole) => {
    const match = Object.values(DEMO_USERS).find((u) => u.role === role)
    if (match) setUser(match)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isAuthenticated: user !== null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
