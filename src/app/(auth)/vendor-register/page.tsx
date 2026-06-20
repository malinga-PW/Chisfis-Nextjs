'use client'

import { useAuth } from '@/contexts/AuthContext'
import { upsertVendorToSupabase } from '@/lib/supabase/adminUsers'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VendorRegisterPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)

    let result: { error: string | null; userId: string | null }
    let cleanedPhone = phone.replace(/[^0-9]/g, '').replace(/^0+/, '')
    if (cleanedPhone.startsWith('94')) cleanedPhone = cleanedPhone.substring(2)
    const formattedPhone = '+94' + cleanedPhone
    try {
      result = await signup(formattedPhone, password, businessName, 'SELLER')
    } catch (ex: any) {
      setError(ex?.message ?? 'Registration failed')
      setBusy(false)
      return
    }
    if (result.error) {
      setError(result.error)
      setBusy(false)
      return
    }

    if (result.userId) {
      try {
        await upsertVendorToSupabase({
          id: result.userId,
          businessName,
          owner: businessName,
          email: formattedPhone,
          location,
          phone: formattedPhone,
          logo: '',
          ownerPhoto: '',
          whatsappNumber: formattedPhone,
          whatsappAvailable: true,
          address: `${location}, Sri Lanka`,
          lat: 6.9271,
          lng: 79.8612,
          deliveryMode: 'areas',
          deliveryAreas: [],
          deliveryRadiusKm: 10,
          visibility: { ownerName: true, phone: true, address: true, deliveryInfo: true, whatsapp: true },
          products: [],
          improvementNotes: '',
          status: 'Pending',
          submitted: new Date().toISOString(),
        })
      } catch {
        // vendor record best-effort
      }
    }

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
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Phone Number <span className="text-red-500">*</span></label>
            <div className="mt-1 flex">
              <span className="inline-flex items-center rounded-l-lg border border-r-0 border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                +94
              </span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} placeholder="7X XXX XXXX" required className="w-full min-w-0 flex-1 rounded-none rounded-r-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Business Location <span className="text-red-500">*</span></label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Colombo, Western Province" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Password <span className="text-red-500">*</span></label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required className="mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <ButtonPrimary type="submit" disabled={busy} className="w-full">{busy ? 'Creating account...' : 'Create Bakery Account'}</ButtonPrimary>
        </form>
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Already have an account?{' '}
          <Link href="/login" className="font-medium underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
