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
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (roles && user && !roles.includes(user.role)) {
      router.push(fallback)
    }
  }, [isAuthenticated, user, roles, router, fallback])

  if (!isAuthenticated) return null
  if (roles && user && !roles.includes(user.role)) return null

  return <>{children}</>
}
