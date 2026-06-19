'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ReactNode, Suspense } from 'react'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', tab: null, icon: '📊' },
  { label: 'Manage Products', tab: 'products', icon: '🎂' },
  { label: 'Manage Vendors', tab: 'vendors', icon: '👨‍🍳' },
  { label: 'Manage Buyers', tab: 'buyers', icon: '👥' },
  { label: 'Settings', tab: 'settings', icon: '⚙️' },
]

function Sidebar() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab')

  return (
    <div className="w-full shrink-0 border-b border-neutral-200 p-5 lg:w-64 lg:border-b-0 lg:border-r dark:border-neutral-700">
      <div className="mb-2 flex items-center gap-2 px-3">
        <span className="text-lg">🔒</span>
        <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Super Admin</span>
      </div>
      <nav className="mt-4 flex flex-col gap-1">
        {SIDEBAR_ITEMS.map((item) => {
          const href = item.tab ? `/admin?tab=${item.tab}` : '/admin'
          const isActive = item.tab === activeTab || (!item.tab && !activeTab)
          return (
            <Link
              key={item.label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mt-10 mb-24">
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-col lg:flex-row">
          <Suspense fallback={
            <div className="w-full shrink-0 p-5 lg:w-64">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>
            </div>
          }>
            <Sidebar />
          </Suspense>
          <div className="min-h-[60vh] flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
