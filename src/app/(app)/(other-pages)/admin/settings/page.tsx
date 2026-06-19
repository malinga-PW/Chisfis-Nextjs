'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Divider } from '@/shared/divider'
import { useState } from 'react'

interface Setting {
  key: string
  label: string
  desc: string
  type: 'toggle' | 'text' | 'number'
  value: string | boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [saved, setSaved] = useState(false)

  const updateSetting = (key: string, val: string | boolean) => {
    setSettings((prev) => prev.map((s) => s.key === key ? { ...s, value: val } : s))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="container mt-20 mb-32 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Platform Settings</h1>
            <p className="mt-1 text-neutral-500">Manage global platform configuration.</p>
          </div>
          <button onClick={handleSave} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {settings.map((s) => (
            <div key={s.key} className="flex items-center justify-between rounded-xl border border-neutral-200 p-5 dark:border-neutral-700">
              <div>
                <p className="font-medium">{s.label}</p>
                <p className="text-sm text-neutral-500">{s.desc}</p>
              </div>
              {s.type === 'toggle' && (
                <button
                  onClick={() => updateSetting(s.key, !s.value)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${s.value ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${s.value ? 'translate-x-5' : ''}`} />
                </button>
              )}
              {s.type === 'number' && (
                <input type="number" value={s.value as string} onChange={(e) => updateSetting(s.key, e.target.value)} className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
              )}
              {s.type === 'text' && (
                <input type="text" value={s.value as string} onChange={(e) => updateSetting(s.key, e.target.value)} className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
              )}
            </div>
          ))}
        </div>

        <Divider className="my-8" />

        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-700">
          <h3 className="font-semibold">Category Management</h3>
          <p className="text-sm text-neutral-500">Active cake categories on the platform.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Birthday', 'Wedding', 'Anniversary', 'Corporate', 'Custom Design', 'Cupcakes', 'Traditional'].map((cat) => (
              <span key={cat} className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium dark:bg-neutral-700">{cat}</span>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
