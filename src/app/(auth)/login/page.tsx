'use client'

import { signIn } from 'next-auth/react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const phoneRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      let phoneVal = phoneRef.current?.value ?? ''
      if (phoneVal && phoneVal !== 'Admin') {
        let cleanedPhone = phoneVal.replace(/[^0-9]/g, '').replace(/^0+/, '')
        if (cleanedPhone.startsWith('94')) cleanedPhone = cleanedPhone.substring(2)
        phoneVal = '+94' + cleanedPhone
      }
      const result = await signIn('credentials', {
        phone: phoneVal,
        password: passwordRef.current?.value ?? '',
        redirect: false,
      })
      if (result?.error) {
        setError('Login failed')
        setBusy(false)
        return
      }
      router.push('/')
      router.refresh()
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
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Phone Number</label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                +94
              </span>
              <input ref={phoneRef} type="tel" placeholder="7X XXX XXXX" required className="w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
              <label className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-sm font-medium underline">Forgot password?</Link>
            </div>
            <input ref={passwordRef} type="password" placeholder="••••••••" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
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
          <p className="text-xs text-neutral-400">Super Admin? <button type="button" onClick={() => { phoneRef.current && (phoneRef.current.value = 'Admin'); passwordRef.current && (passwordRef.current.value = 'Admin@hostlanka') }} className="font-medium text-neutral-900 underline dark:text-white">Click here to sign in</button></p>
        </div>
      </div>
    </div>
  )
}
