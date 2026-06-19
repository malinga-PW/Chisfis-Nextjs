'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'

interface VendorRequest {
  id: string
  businessName: string
  owner: string
  email: string
  location: string
  phone: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submitted: string
}

interface BuyerProfile {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  joined: string
}

const INITIAL_VENDORS: VendorRequest[] = [
  { id: 'v1', businessName: 'Nimru Cakes with Love', owner: 'Nimru', email: 'nimru@example.com', location: 'Athurugiriya', phone: '+94 71 234 5678', status: 'Approved', submitted: '2026-06-01' },
  { id: 'v2', businessName: 'KCCT Cakes', owner: 'Kumari', email: 'kcct@example.com', location: 'Kiribathgoda', phone: '+94 77 345 6789', status: 'Approved', submitted: '2026-06-05' },
  { id: 'v3', businessName: 'Kavi Happy Cakes', owner: 'Kavindi', email: 'kavi@example.com', location: 'Rajanganaya', phone: '+94 76 456 7890', status: 'Pending', submitted: '2026-06-12' },
  { id: 'v4', businessName: 'Perera & Sons - Mulleriyawa', owner: 'Saman Perera', email: 'perera@example.com', location: 'Mulleriyawa', phone: '+94 71 567 8901', status: 'Pending', submitted: '2026-06-15' },
  { id: 'v5', businessName: 'Perera & Sons - Malabe', owner: 'Saman Perera', email: 'perera.m@example.com', location: 'Malabe', phone: '+94 71 678 9012', status: 'Pending', submitted: '2026-06-16' },
]

const INITIAL_BUYERS: BuyerProfile[] = [
  { id: 'b1', name: 'Eden Smith', email: 'eden@example.com', phone: '+94 77 123 4567', orders: 3, joined: '2026-01-15' },
  { id: 'b2', name: 'John Doe', email: 'john@example.com', phone: '+94 71 234 5678', orders: 1, joined: '2026-03-20' },
  { id: 'b3', name: 'Jane Miller', email: 'jane@example.com', phone: '+94 76 345 6789', orders: 5, joined: '2025-11-08' },
  { id: 'b4', name: 'Alice Perera', email: 'alice@example.com', phone: '+94 77 456 7890', orders: 0, joined: '2026-06-14' },
  { id: 'b5', name: 'Nimal Fernando', email: 'nimal@example.com', phone: '+94 71 567 8901', orders: 2, joined: '2026-05-20' },
]

export default function AdminUsersPage() {
  const [vendors, setVendors] = useState<VendorRequest[]>(INITIAL_VENDORS)
  const [buyers, setBuyers] = useState<BuyerProfile[]>(INITIAL_BUYERS)
  const [tab, setTab] = useState<'vendors' | 'buyers'>('vendors')
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Record<string, string>>({})

  const updateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status } : v))
  }

  const startEdit = (id: string, fields: Record<string, string>) => {
    setEditing(id)
    setEditForm(fields)
  }

  const saveVendor = (id: string) => {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, ...editForm } : v))
    setEditing(null)
    setEditForm({})
  }

  const saveBuyer = (id: string) => {
    setBuyers((prev) => prev.map((b) => b.id === id ? { ...b, ...editForm } : b))
    setEditing(null)
    setEditForm({})
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditForm({})
  }

  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <h1 className="text-3xl font-semibold">User Management</h1>
        <p className="mt-2 text-neutral-500">Manage buyers and approve, reject, or edit vendor registrations.</p>

        <div className="mt-6 flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700 w-fit">
          {(['vendors', 'buyers'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow-sm dark:bg-neutral-600' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'}`}>
              {t === 'vendors' ? `Vendors (${vendors.length})` : `Buyers (${buyers.length})`}
            </button>
          ))}
        </div>

        {tab === 'vendors' && (
          <div className="mt-6 space-y-3">
            {vendors.map((v) => (
              <div key={v.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                {editing === v.id ? (
                  <div className="space-y-3">
                    {['businessName', 'owner', 'email', 'phone', 'location'].map((field) => (
                      <div key={field}>
                        <label className="text-xs font-medium text-neutral-500 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                          type="text"
                          value={editForm[field] || ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                          className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => saveVendor(v.id)} className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">Save</button>
                      <button onClick={cancelEdit} className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{v.businessName}</p>
                      <p className="text-sm text-neutral-500">{v.owner} &middot; {v.email} &middot; {v.phone} &middot; {v.location}</p>
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
                      <button onClick={() => startEdit(v.id, { businessName: v.businessName, owner: v.owner, email: v.email, phone: v.phone, location: v.location })} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'buyers' && (
          <div className="mt-6 space-y-3">
            {buyers.map((b) => (
              <div key={b.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                {editing === b.id ? (
                  <div className="space-y-3">
                    {['name', 'email', 'phone'].map((field) => (
                      <div key={field}>
                        <label className="text-xs font-medium text-neutral-500 capitalize">{field}</label>
                        <input
                          type="text"
                          value={editForm[field] || ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                          className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => saveBuyer(b.id)} className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">Save</button>
                      <button onClick={cancelEdit} className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-sm text-neutral-500">{b.email} &middot; {b.phone}</p>
                      <p className="text-xs text-neutral-400">Joined {b.joined} &middot; {b.orders} orders</p>
                    </div>
                    <button onClick={() => startEdit(b.id, { name: b.name, email: b.email, phone: b.phone })} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
