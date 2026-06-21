'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Divider } from '@/shared/divider'

const MOCK_STATS = [
  { label: 'Total Sales (This Month)', value: 'LKR 156,000', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' },
  { label: 'Active Orders', value: '12', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  { label: 'Total Products', value: '8', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { label: 'Avg. Rating', value: '4.8 ★', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
]

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Eden Smith', item: 'Wedding Cake - 3 Tier', amount: 'LKR 25,000', status: 'Out for Delivery', date: '2026-06-18' },
  { id: 'ORD-002', customer: 'Jane Miller', item: 'Birthday Cake - Chocolate', amount: 'LKR 6,800', status: 'Baking', date: '2026-06-19' },
  { id: 'ORD-003', customer: 'John Doe', item: 'Cupcake Box (12 pcs)', amount: 'LKR 2,800', status: 'Pending', date: '2026-06-20' },
]

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Baking: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
}

export default function VendorDashboardPage() {
  return (
    <ProtectedRoute roles={['SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Vendor Dashboard</h1>
            <p className="mt-1 text-neutral-500">Welcome back, Hostlanka Business!</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_STATS.map((s) => (
            <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <Divider className="my-10" />

        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <p className="mt-1 text-sm text-neutral-500">Your most recent customer orders.</p>
        <div className="mt-4 space-y-3">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="min-w-0">
                <p className="text-xs text-neutral-400">{order.id}</p>
                <p className="font-medium">{order.item}</p>
                <p className="text-sm text-neutral-500">{order.customer} &middot; {order.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">{order.amount}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
