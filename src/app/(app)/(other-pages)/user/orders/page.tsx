'use client'

import ProtectedRoute from '@/components/ProtectedRoute'

const MOCK_ORDERS = [
  { id: 'ORD-001', baker: 'Nimru Cakes', item: '3-Tier Wedding Cake', weight: '5kg', amount: 'LKR 25,000', status: 'Out for Delivery', date: '2026-06-18' },
  { id: 'ORD-002', baker: 'Sweet Cravings', item: 'Cupcake Box (24 pcs)', weight: '1kg', amount: 'LKR 4,500', status: 'Baking', date: '2026-06-20' },
  { id: 'ORD-003', baker: 'Kandy Cake House', item: 'Chocolate Birthday Cake', weight: '2kg', amount: 'LKR 6,800', status: 'Pending', date: '2026-06-22' },
]

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Baking: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  'Out for Delivery': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
}

export default function MyOrdersPage() {
  return (
    <ProtectedRoute roles={['BUYER', 'SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <h1 className="text-3xl font-semibold">My Orders</h1>
        <p className="mt-2 text-neutral-500">Track all your cake orders in one place.</p>
        <div className="mt-8 space-y-4">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
              <div className="min-w-0">
                <p className="text-xs text-neutral-400">{order.id}</p>
                <p className="mt-1 font-medium">{order.item}</p>
                <p className="text-sm text-neutral-500">{order.baker} &middot; {order.weight}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{order.amount}</p>
                <p className="text-xs text-neutral-400">{order.date}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
