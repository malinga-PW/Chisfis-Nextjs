'use client'

import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  roles?: UserRole[]
  fallback?: string
}

export default function ProtectedRoute({ children, roles, fallback = '/' }: Props) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (roles && user && !roles.includes(user.role)) {
      router.push(fallback)
    }
  }, [loading, isAuthenticated, user, roles, router, fallback])

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-neutral-500">Loading...</div>
  if (!isAuthenticated) return null
  if (roles && user && !roles.includes(user.role)) return null

  return <>{children}</>
}
