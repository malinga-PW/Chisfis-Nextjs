'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Notification {
  id: string
  name: string
  description: string
  time: string
  href: string
  avatar?: string
}

interface NotificationContextType {
  notifications: Notification[]
  dispatchNotification: (n: Omit<Notification, 'id'>) => void
  clearNotifications: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      name: 'John Doe',
      description: 'Measure actions your users take',
      time: '3 minutes ago',
      href: '#',
    },
    {
      id: '2',
      name: 'Jane Smith',
      description: 'Create your own targeted content',
      time: '1 minute ago',
      href: '#',
    },
    {
      id: '3',
      name: 'Alice Johnson',
      description: 'Keep track of your growth',
      time: '3 minutes ago',
      href: '#',
    },
  ])

  const dispatchNotification = (n: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    setNotifications((prev) => [{ id, ...n }, ...prev])
  }

  const clearNotifications = () => setNotifications([])

  return (
    <NotificationContext.Provider value={{ notifications, dispatchNotification, clearNotifications, unreadCount: notifications.length }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
