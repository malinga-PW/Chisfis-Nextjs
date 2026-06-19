'use client'

import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await doLogin(phone, password)
  }

  const doLogin = async (p: string, pw: string) => {
    setError('')
    setBusy(true)
    try {
      await login(p, pw)
      router.push('/')
    } catch (err: any) {
      setError(err.message ?? 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Link href="/"><Logo className="w-32" /></Link>
      </div>
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 XX XXX XXXX" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
              <label className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-sm font-medium underline">Forgot password?</Link>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <ButtonPrimary type="submit" disabled={busy} className="w-full">{busy ? 'Signing in...' : 'Login'}</ButtonPrimary>
        </form>
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          New user?{' '}
          <Link href="/signup" className="font-medium underline">Create an account</Link>
        </div>
        <div className="block text-center text-sm text-neutral-500">
          Want to sell cakes?{' '}
          <Link href="/vendor-register" className="font-medium text-neutral-900 underline dark:text-white">Register as a Baker</Link>
        </div>
        <div className="border-t border-neutral-200 pt-4 text-center dark:border-neutral-700">
          <p className="text-xs text-neutral-400">Super Admin? <button type="button" onClick={() => doLogin('Admin', 'Admin@hostlanka')} className="font-medium text-neutral-900 underline dark:text-white">Click here to sign in</button></p>
        </div>
      </div>
    </div>
  )
}
