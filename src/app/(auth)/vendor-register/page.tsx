'use client'

import { useAuth } from '@/contexts/AuthContext'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VendorRegisterPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'BAKER2026') {
      setCouponMessage({ type: 'success', text: 'Coupon applied! Enjoy 0% commission for your first month.' })
    } else if (couponCode.trim()) {
      setCouponMessage({ type: 'error', text: 'Invalid coupon code.' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
    router.push('/vendor/dashboard')
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Link href="/"><Logo className="w-32" /></Link>
      </div>
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold text-center">Register as a Baker</h1>
        <p className="text-center text-sm text-neutral-500">Start selling custom cakes on Nimru Cakes.</p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Business Name <span className="text-red-500">*</span></label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Nimru Cakes" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Email <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="baker@example.com" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Phone <span className="text-red-500">*</span></label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 XX XXX XXXX" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Business Location <span className="text-red-500">*</span></label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Colombo, Western Province" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Password <span className="text-red-500">*</span></label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Verification Document</label>
            <p className="text-xs text-neutral-400 mb-1">Upload business registration or ID (PDF, JPG, PNG)</p>
            <input type="file" accept=".pdf,.jpg,.png" className="w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200 dark:file:bg-neutral-700" />
          </div>
          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Promotional Coupon Code</label>
            <div className="mt-1 flex gap-2">
              <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponMessage(null) }} placeholder="BAKER2026" className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
              <button type="button" onClick={handleApplyCoupon} className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">Apply</button>
            </div>
            {couponMessage && (
              <p className={`mt-1 text-sm ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{couponMessage.text}</p>
            )}
          </div>
          <ButtonPrimary type="submit" className="w-full">Create Bakery Account</ButtonPrimary>
        </form>
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
