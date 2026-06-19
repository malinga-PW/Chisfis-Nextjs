'use client'

import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Link from 'next/link'
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
    <div className="container">
      <div className="my-16 flex justify-center">
        <Link href="/"><Logo className="w-32" /></Link>
      </div>
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Sign In to Nimru Cakes</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
              <label className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-sm font-medium underline">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <ButtonPrimary type="submit">Login</ButtonPrimary>
        </form>
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          New user?{' '}
          <Link href="/signup" className="font-medium underline">Create an account</Link>
        </div>
        <div className="block text-center text-sm text-neutral-500">
          Want to sell cakes?{' '}
          <Link href="/vendor-register" className="font-medium text-neutral-900 underline dark:text-white">Register as a Baker</Link>
        </div>
        <p className="text-center text-xs text-neutral-400">
          Demo: eden@example.com (Buyer) / baker@example.com (Baker) / admin@nimru.com (Admin)
        </p>
      </div>
    </div>
  )
}
