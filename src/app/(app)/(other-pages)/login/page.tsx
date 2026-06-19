'use client'

import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    router.push('/')
  }

  return (
    <div className="container mt-20 mb-32 max-w-md">
      <h1 className="text-3xl font-semibold">Sign In</h1>
      <p className="mt-2 text-neutral-500">Welcome back to Nimru Cakes.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <ButtonPrimary type="submit" className="w-full">Sign In</ButtonPrimary>
        <p className="text-center text-sm text-neutral-500">
          Don&apos;t have an account? <a href="/register" className="font-medium text-neutral-900 underline dark:text-white">Register</a>
        </p>
        <p className="text-center text-xs text-neutral-400">
          Demo: eden@example.com (Buyer) / baker@example.com (Baker) / admin@nimru.com (Admin)
        </p>
      </form>
    </div>
  )
}
