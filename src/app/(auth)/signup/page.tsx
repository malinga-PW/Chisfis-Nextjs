'use client'

import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
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
    <div className="container">
      <div className="my-16 flex justify-center">
        <Link href="/"><Logo className="w-32" /></Link>
      </div>
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <ButtonPrimary type="submit">Continue</ButtonPrimary>
        </form>
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">Sign in</Link>
        </div>
        <div className="block text-center text-sm text-neutral-500">
          Want to sell cakes?{' '}
          <Link href="/vendor-register" className="font-medium text-neutral-900 underline dark:text-white">Register as a Baker</Link>
        </div>
      </div>
    </div>
  )
}
