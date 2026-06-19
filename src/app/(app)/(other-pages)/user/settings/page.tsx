'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useState } from 'react'

export default function UserSettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  return (
    <ProtectedRoute roles={['BUYER', 'SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32 max-w-lg">
        <h1 className="text-3xl font-semibold">Account Settings</h1>
        <p className="mt-2 text-neutral-500">Manage your personal information.</p>
        <div className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
          </div>
          <div>
            <label className="text-sm font-medium">Current Role</label>
            <p className="mt-1 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm dark:bg-neutral-800">{user?.role}</p>
          </div>
          <ButtonPrimary>Save Changes</ButtonPrimary>
        </div>
      </div>
    </ProtectedRoute>
  )
}
