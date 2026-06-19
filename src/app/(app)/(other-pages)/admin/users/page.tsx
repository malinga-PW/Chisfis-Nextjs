'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'

interface VendorRequest {
  id: string
  businessName: string
  owner: string
  email: string
  location: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submitted: string
}

const INITIAL_VENDORS: VendorRequest[] = [
  { id: 'v1', businessName: 'Nimru Cakes', owner: 'Nimru', email: 'nimru@example.com', location: 'Colombo 07', status: 'Approved', submitted: '2026-06-01' },
  { id: 'v2', businessName: 'Sweet Cravings', owner: 'Sarah Gomez', email: 'sarah@example.com', location: 'Nugegoda', status: 'Approved', submitted: '2026-06-05' },
  { id: 'v3', businessName: 'Kandy Cake House', owner: 'Kamal Perera', email: 'kamal@example.com', location: 'Kandy', status: 'Pending', submitted: '2026-06-12' },
  { id: 'v4', businessName: 'Galle Bakers', owner: 'Dinesh Silva', email: 'dinesh@example.com', location: 'Galle', status: 'Pending', submitted: '2026-06-15' },
  { id: 'v5', businessName: 'Jaffna Sweet Spot', owner: 'Raj Kumar', email: 'raj@example.com', location: 'Jaffna', status: 'Pending', submitted: '2026-06-16' },
]

const BUYERS = [
  { id: 'b1', name: 'Eden Smith', email: 'eden@example.com', orders: 3, joined: '2026-01-15' },
  { id: 'b2', name: 'John Doe', email: 'john@example.com', orders: 1, joined: '2026-03-20' },
  { id: 'b3', name: 'Jane Miller', email: 'jane@example.com', orders: 5, joined: '2025-11-08' },
  { id: 'b4', name: 'Alice Perera', email: 'alice@example.com', orders: 0, joined: '2026-06-14' },
]

export default function AdminUsersPage() {
  const [vendors, setVendors] = useState<VendorRequest[]>(INITIAL_VENDORS)
  const [tab, setTab] = useState<'vendors' | 'buyers'>('vendors')

  const updateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status } : v))
  }

  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <h1 className="text-3xl font-semibold">User Management</h1>
        <p className="mt-2 text-neutral-500">Manage buyers and approve or reject vendor registrations.</p>

        <div className="mt-6 flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700 w-fit">
          {(['vendors', 'buyers'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow-sm dark:bg-neutral-600' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'}`}>
              {t === 'vendors' ? 'Vendors' : 'Buyers'}
            </button>
          ))}
        </div>

        {tab === 'vendors' && (
          <div className="mt-6 space-y-3">
            {vendors.map((v) => (
              <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <div className="min-w-0">
                  <p className="font-medium">{v.businessName}</p>
                  <p className="text-sm text-neutral-500">{v.owner} &middot; {v.email} &middot; {v.location}</p>
                  <p className="text-xs text-neutral-400">Submitted: {v.submitted}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    v.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                    v.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>{v.status}</span>
                  {v.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(v.id, 'Approved')} className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">Approve</button>
                      <button onClick={() => updateStatus(v.id, 'Rejected')} className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'buyers' && (
          <div className="mt-6 space-y-3">
            {BUYERS.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-neutral-500">{b.email} &middot; Joined {b.joined}</p>
                </div>
                <span className="text-sm text-neutral-500">{b.orders} orders</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
