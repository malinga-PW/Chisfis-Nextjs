'use client'

import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    router.push('/')
  }

  return (
    <div className="container mt-20 mb-32 max-w-md">
      <h1 className="text-3xl font-semibold">Create Account</h1>
      <p className="mt-2 text-neutral-500">Join Nimru Cakes as a buyer.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
        </div>
        <ButtonPrimary type="submit" className="w-full">Create Account</ButtonPrimary>
        <p className="text-center text-sm text-neutral-500">
          Already have an account? <a href="/login" className="font-medium text-neutral-900 underline dark:text-white">Sign in</a>
        </p>
        <p className="text-center text-sm text-neutral-500">
          Want to sell cakes? <a href="/vendor/register" className="font-medium text-neutral-900 underline dark:text-white">Register as a Baker</a>
        </p>
      </form>
    </div>
  )
}
