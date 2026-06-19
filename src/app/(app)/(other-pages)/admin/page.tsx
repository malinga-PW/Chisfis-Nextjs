'use client'

import { Divider } from '@/shared/divider'
import { useSearchParams } from 'next/navigation'

const MOCK_USER = { role: 'SUPER_ADMIN' }

function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-6xl">🔒</span>
      <h2 className="mt-4 text-2xl font-semibold">Access Denied</h2>
      <p className="mt-2 text-neutral-500">You do not have permission to access this area.</p>
      <p className="mt-1 text-sm text-neutral-400">Super Admin privileges required.</p>
    </div>
  )
}

function DashboardTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Platform Overview</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Products', value: '24', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
          { label: 'Active Vendors', value: '10', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
          { label: 'Total Buyers', value: '156', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
          { label: 'Pending Approvals', value: '3', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductsTab() {
  const products = [
    { name: 'Nimru Cakes', category: 'Wedding Cakes', status: 'Approved', date: '2026-06-15' },
    { name: 'Sweet Cravings', category: 'Cupcakes', status: 'Approved', date: '2026-06-14' },
    { name: 'Kandy Cake House', category: 'Traditional', status: 'Pending', date: '2026-06-13' },
  ]
  return (
    <div>
      <h2 className="text-xl font-semibold">Manage All Products</h2>
      <p className="mt-1 text-sm text-neutral-500">Approve or reject cake listings from vendors.</p>
      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <div key={p.name} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-neutral-500">{p.category} &middot; {p.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                p.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
              }`}>
                {p.status}
              </span>
              {p.status === 'Pending' && (
                <>
                  <button className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">Approve</button>
                  <button className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VendorsTab() {
  const vendors = [
    { name: 'Nimru Cakes', location: 'Colombo 07', verified: true },
    { name: 'Sweet Cravings', location: 'Nugegoda', verified: true },
    { name: 'Kandy Cake House', location: 'Kandy', verified: false },
  ]
  return (
    <div>
      <h2 className="text-xl font-semibold">Manage Vendors</h2>
      <p className="mt-1 text-sm text-neutral-500">Verify seller accounts and manage baker profiles.</p>
      <div className="mt-6 space-y-3">
        {vendors.map((v) => (
          <div key={v.name} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <div>
              <p className="font-medium">{v.name}</p>
              <p className="text-sm text-neutral-500">{v.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                v.verified ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
              }`}>
                {v.verified ? 'Verified' : 'Unverified'}
              </span>
              {!v.verified && (
                <button className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">Verify</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BuyersTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Manage Buyers</h2>
      <p className="mt-1 text-sm text-neutral-500">View and manage user accounts.</p>
      <div className="mt-6 space-y-3">
        {[
          { name: 'Eden Smith', email: 'eden@example.com', orders: 3, joined: '2026-01-15' },
          { name: 'John Doe', email: 'john@example.com', orders: 1, joined: '2026-03-20' },
          { name: 'Jane Miller', email: 'jane@example.com', orders: 5, joined: '2025-11-08' },
        ].map((b) => (
          <div key={b.email} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-neutral-500">{b.email} &middot; Joined {b.joined}</p>
            </div>
            <span className="text-sm text-neutral-500">{b.orders} orders</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Web Interface Settings</h2>
      <p className="mt-1 text-sm text-neutral-500">Customize platform appearance and behavior.</p>
      <div className="mt-6 space-y-4">
        {[
          { label: 'Maintenance Mode', desc: 'Disable public access during updates', value: 'Off' },
          { label: 'New Vendor Approvals', desc: 'Require admin approval for new sellers', value: 'Enabled' },
          { label: 'Commission Rate', desc: 'Platform fee on each order', value: '5%' },
          { label: 'Default Currency', desc: 'Display currency for all listings', value: 'LKR' },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <div>
              <p className="font-medium">{s.label}</p>
              <p className="text-sm text-neutral-500">{s.desc}</p>
            </div>
            <span className="rounded-lg bg-neutral-100 px-3 py-1 text-sm font-medium dark:bg-neutral-700">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  if (MOCK_USER.role !== 'SUPER_ADMIN') {
    return <Unauthorized />
  }

  const renderTab = () => {
    switch (tab) {
      case 'products': return <ProductsTab />
      case 'vendors': return <VendorsTab />
      case 'buyers': return <BuyersTab />
      case 'settings': return <SettingsTab />
      default: return <DashboardTab />
    }
  }

  return (
    <>
      {renderTab()}
      <Divider className="my-6" />
      <p className="text-xs text-neutral-400">
        Role: <span className="font-semibold text-neutral-600 dark:text-neutral-300">SUPER_ADMIN</span> &middot; 
        This dashboard is only accessible to platform owners.
      </p>
    </>
  )
}
