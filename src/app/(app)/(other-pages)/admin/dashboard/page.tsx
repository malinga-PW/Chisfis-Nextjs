'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Divider } from '@/shared/divider'

const STATS = [
  { label: 'Total Products', value: '24', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  { label: 'Active Vendors', value: '10', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  { label: 'Total Buyers', value: '156', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { label: 'Pending Approvals', value: '3', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
  { label: 'Monthly Revenue', value: 'LKR 420,000', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
  { label: 'Avg Order Value', value: 'LKR 6,800', color: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400' },
]

const RECENT_ACTIVITY = [
  { action: 'New vendor registration', detail: 'Kandy Cake House', time: '2 hours ago' },
  { action: 'Order placed', detail: 'ORD-004 - 3-Tier Wedding Cake', time: '3 hours ago' },
  { action: 'Vendor verified', detail: 'Sweet Cravings', time: '1 day ago' },
  { action: 'Product approved', detail: 'Chocolate Fudge Cake by Hostlanka Business', time: '1 day ago' },
  { action: 'New buyer registered', detail: 'Alice Perera', time: '2 days ago' },
]

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <h1 className="text-3xl font-semibold">Super Admin Dashboard</h1>
        <p className="mt-2 text-neutral-500">Platform overview and key metrics.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <Divider className="my-10" />

        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <div>
                <p className="font-medium">{a.action}</p>
                <p className="text-sm text-neutral-500">{a.detail}</p>
              </div>
              <span className="text-xs text-neutral-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
