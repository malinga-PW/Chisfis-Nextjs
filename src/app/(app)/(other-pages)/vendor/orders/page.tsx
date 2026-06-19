'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'

const INITIAL_ORDERS = [
  { id: 'ORD-001', customer: 'Eden Smith', item: '3-Tier Wedding Cake - Vanilla', weight: '5kg', amount: 'LKR 25,000', status: 'Out for Delivery', date: '2026-06-18', address: 'Colombo 07' },
  { id: 'ORD-002', customer: 'Jane Miller', item: 'Chocolate Birthday Cake', weight: '2kg', amount: 'LKR 6,800', status: 'Baking', date: '2026-06-19', address: 'Nugegoda' },
  { id: 'ORD-003', customer: 'John Doe', item: 'Cupcake Box (12 pcs)', weight: '1kg', amount: 'LKR 2,800', status: 'Pending', date: '2026-06-20', address: 'Kandy' },
  { id: 'ORD-004', customer: 'Alice Perera', item: 'Anniversary Cake - Red Velvet', weight: '3kg', amount: 'LKR 8,500', status: 'Pending', date: '2026-06-21', address: 'Galle' },
]

const STATUS_FLOW = ['Pending', 'Baking', 'Out for Delivery', 'Delivered']

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)

  const advanceStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const idx = STATUS_FLOW.indexOf(o.status)
        return idx < STATUS_FLOW.length - 1 ? { ...o, status: STATUS_FLOW[idx + 1] } : o
      })
    )
  }

  return (
    <ProtectedRoute roles={['SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <h1 className="text-3xl font-semibold">Order Management</h1>
        <p className="mt-2 text-neutral-500">View and update order statuses.</p>
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-400">{order.id}</p>
                  <p className="mt-1 font-medium">{order.item}</p>
                  <p className="text-sm text-neutral-500">{order.customer} &middot; {order.weight} &middot; {order.address}</p>
                  <p className="text-xs text-neutral-400">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold">{order.amount}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'Baking' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              {order.status !== 'Delivered' && (
                <button
                  onClick={() => advanceStatus(order.id)}
                  className="mt-3 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  Mark as {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
