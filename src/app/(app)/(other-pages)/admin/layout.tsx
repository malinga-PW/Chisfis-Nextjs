'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Manage Users', href: '/admin/users', icon: '👥' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (user?.role !== 'SUPER_ADMIN') {
    return <>{children}</>
  }

  return (
    <div className="container mt-10 mb-24">
      <div className="rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full shrink-0 border-b border-neutral-200 p-5 lg:w-64 lg:border-b-0 lg:border-r dark:border-neutral-700">
            <div className="mb-2 flex items-center gap-2 px-3">
              <span className="text-lg">🔒</span>
              <span className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Super Admin</span>
            </div>
            <nav className="mt-4 flex flex-col gap-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.label}
                    href={item.href}
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
          <div className="min-h-[60vh] flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
