'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'

interface Order {
  id: string; customer: string; item: string; weight: string; amount: string; status: string; date: string; address: string
}

const STATUS_FLOW = ['Pending', 'Baking', 'Out for Delivery', 'Delivered']

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

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
          {orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-200 p-10 text-center dark:border-neutral-700">
              <p className="text-sm text-neutral-500">No orders yet.</p>
            </div>
          )}
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
