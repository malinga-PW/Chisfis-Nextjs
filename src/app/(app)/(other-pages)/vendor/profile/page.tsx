'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { DeliveryMap } from '@/components/DeliveryMap'
import { useAuth } from '@/contexts/AuthContext'
import { SRI_LANKA_LOCATIONS } from '@/data/sri-lanka-locations'
import {
  fetchVendorBusinessEmailInbox,
  fetchVendorBusinessEmailSettings,
  markVendorBusinessEmailAsRead,
  upsertVendorBusinessEmailSettings,
  type VendorBusinessEmailMessage,
} from '@/lib/supabase/vendorBusinessEmail'
import { fetchVendorProfile, upsertVendorProfile } from '@/lib/supabase/vendorProfile'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useSession } from 'next-auth/react'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'

/* ---------- Types ---------- */
interface ProductEntry {
  id: string
  title: string
  description: string
  category: string
  price: number
  images: string[]
}

interface VendorProfile {
  businessName: string
  logo: string | null
  ownerName: string
  ownerPhoto: string | null
  email: string
  phone: string
  whatsapp: string
  whatsappAvailable: boolean
  address: string
  location: { lat: number; lng: number }
  deliveryMethod: 'areas' | 'radius'
  deliveryAreas: string[]
  locationAreaName: string
  deliveryRadius: number
  temporarilyUnavailable: boolean
  showPhoneWhenUnavailable: boolean
  shortBio: string
  website: string
  instagram: string
  facebook: string
  businessEmailLocalPart: string
  businessEmailDomain: string
  businessEmailForwarding: string
  businessEmailNotifications: boolean
  showFields: {
    businessName: boolean
    ownerName: boolean
    phone: boolean
    address: boolean
    deliveryAreas: boolean
    whatsapp: boolean
    website: boolean
    socialMedia: boolean
  }
  products: ProductEntry[]
}

type ShowFieldKey = keyof VendorProfile['showFields']
type TabKey = 'business' | 'products' | 'address' | 'visibility' | 'email'

const CATEGORIES = ['Cakes', 'Cupcakes', 'Pastries', 'Savouries', 'Rice & Curry', 'Short Eats', 'Beverages', 'Desserts', 'Breads', 'Hoppers']

const LOGO_FALLBACK = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B35&color=fff&size=256&bold=true&format=png`

const EMPTY_PROFILE = (uid: string): VendorProfile => ({
  businessName: '',
  logo: null,
  ownerName: '',
  ownerPhoto: null,
  email: '',
  phone: '',
  whatsapp: '',
  whatsappAvailable: false,
  address: '',
  location: { lat: 6.9271, lng: 79.8612 },
  deliveryMethod: 'areas',
  deliveryAreas: [],
  locationAreaName: '',
  deliveryRadius: 10,
  temporarilyUnavailable: false,
  showPhoneWhenUnavailable: true,
  shortBio: '',
  website: '',
  instagram: '',
  facebook: '',
  businessEmailLocalPart: '',
  businessEmailDomain: 'hostlanka.online',
  businessEmailForwarding: '',
  businessEmailNotifications: true,
  showFields: {
    businessName: true,
    ownerName: true,
    phone: true,
    address: true,
    deliveryAreas: true,
    whatsapp: true,
    website: false,
    socialMedia: false,
  },
  products: [],
})

/* -------- Sub-components -------- */

function CircleImageUpload({
  src,
  fallback,
  size = 'lg',
  onUpload,
  label,
}: {
  src: string | null
  fallback: string
  size?: 'sm' | 'lg'
  onUpload: (file: File) => void
  label: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dim = size === 'lg' ? 'h-28 w-28' : 'h-20 w-20'
  const btnDim = size === 'lg' ? 'h-9 w-9' : 'h-8 w-8'

  return (
    <div className="relative shrink-0 group">
      <div className={`${dim} overflow-hidden rounded-full border-[3px] border-white shadow-lg dark:border-neutral-700 ring-2 ring-neutral-200 dark:ring-neutral-600`}>
        <img src={src || fallback} alt={label} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
      </div>
      {/* Overlay on hover */}
      <div
        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={() => inputRef.current?.click()}
      >
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <span className="mt-1 text-[10px] font-semibold text-white">Upload</span>
      </div>
      {/* Edit badge */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`absolute -bottom-1 -right-1 ${btnDim} flex items-center justify-center rounded-full bg-neutral-900 text-white shadow-md ring-2 ring-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:ring-neutral-700 dark:hover:bg-neutral-100 transition-colors`}
        title={`Upload ${label}`}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onUpload(file)
        }}
      />
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean
  onChange: () => void
  label: string
  description?: string
  icon?: React.ReactNode
}) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
        checked
          ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950/30'
          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600'
      }`}
      onClick={onChange}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${checked ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'}`}>
            {icon}
          </span>
        )}
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>}
        </div>
      </div>
      {/* Custom toggle pill */}
      <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  prefix,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  prefix?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      <div className={`mt-1.5 flex overflow-hidden rounded-xl border border-neutral-200 transition-shadow focus-within:ring-2 focus-within:ring-neutral-900 dark:border-neutral-700 dark:focus-within:ring-neutral-100`}>
        {prefix && (
          <span className="flex items-center bg-neutral-50 px-3 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 border-r border-neutral-200 dark:border-neutral-700">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white px-4 py-2.5 text-sm outline-none dark:bg-neutral-900"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}

const TAB_ITEMS: { key: TabKey; label: string; icon: string }[] = [
  {
    key: 'business',
    label: 'Business Info',
    icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z',
  },
  {
    key: 'products',
    label: 'Products & Media',
    icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
  },
  {
    key: 'address',
    label: 'Address & Delivery',
    icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  },
  {
    key: 'visibility',
    label: 'Profile Visibility',
    icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    key: 'email',
    label: 'Business Email',
    icon: 'M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91A2.25 2.25 0 012.25 6.993V6.75',
  },
]

/* =========================================
   MAIN COMPONENT
   ========================================= */
export default function VendorProfilePage() {
  const { user } = useAuth()
  const { update } = useSession()
  const uid = user?.id ?? ''
  const [profile, setProfile] = useState<VendorProfile>(EMPTY_PROFILE(uid))
  const [activeTab, setActiveTab] = useState<TabKey>('business')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [emailSyncStatus, setEmailSyncStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [inbox, setInbox] = useState<VendorBusinessEmailMessage[]>([])

  const [newProduct, setNewProduct] = useState<ProductEntry>({ id: '', title: '', description: '', category: 'Cakes', price: 0, images: [] })
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [areaSearch, setAreaSearch] = useState('')
  const productImagesRef = useRef<HTMLInputElement>(null)

  const deliveryAreaGroups = useMemo(() => {
    const query = areaSearch.trim().toLowerCase()

    return SRI_LANKA_LOCATIONS
      .map((province) => {
        const towns = province.towns
          .map((town) => ({
            name: town.name,
            subAreas: town.subAreas
              .map((subArea) => subArea.name)
              .filter((subAreaName) => {
                if (!query) return true
                return (
                  subAreaName.toLowerCase().includes(query)
                  || town.name.toLowerCase().includes(query)
                  || province.name.toLowerCase().includes(query)
                )
              }),
          }))
          .filter((town) => town.subAreas.length > 0)

        return {
          name: province.name,
          towns,
        }
      })
      .filter((province) => province.towns.length > 0)
  }, [areaSearch])

  useEffect(() => {
    let mounted = true
    const vendorId = uid

    const loadBusinessEmail = async () => {
      if (!isSupabaseConfigured()) return
      try {
        setEmailSyncStatus('loading')
        const [settings, messages, dbProfile] = await Promise.all([
          fetchVendorBusinessEmailSettings(vendorId),
          fetchVendorBusinessEmailInbox(vendorId),
          fetchVendorProfile(vendorId),
        ])
        if (!mounted) return

        if (dbProfile) {
          setProfile((prev) => ({
            ...prev,
            ...dbProfile,
            businessEmailLocalPart: settings?.localPart ?? prev.businessEmailLocalPart,
            businessEmailDomain: settings?.domain ?? prev.businessEmailDomain,
            businessEmailForwarding: settings?.forwardingEmail ?? prev.businessEmailForwarding,
            businessEmailNotifications: settings?.notificationsEnabled ?? prev.businessEmailNotifications,
          }))
        } else if (settings) {
          setProfile((prev) => ({
            ...prev,
            businessEmailLocalPart: settings.localPart,
            businessEmailDomain: settings.domain,
            businessEmailForwarding: settings.forwardingEmail,
            businessEmailNotifications: settings.notificationsEnabled,
          }))
        }
        if (messages && messages.length > 0) setInbox(messages)
        setEmailSyncStatus('ready')
      } catch (_error) {
        if (!mounted) return
        setEmailSyncStatus('error')
      }
    }

    loadBusinessEmail()
    return () => {
      mounted = false
    }
  }, [uid])

  /* ------ Handlers ------ */
  const handleSave = async () => {
    setSaving(true)
    if (isSupabaseConfigured()) {
      try {
        await Promise.all([
          upsertVendorProfile(uid, profile),
          upsertVendorBusinessEmailSettings({
            vendorId: uid,
            localPart: profile.businessEmailLocalPart,
            domain: profile.businessEmailDomain,
            forwardingEmail: profile.businessEmailForwarding,
            notificationsEnabled: profile.businessEmailNotifications,
          }),
        ])
        // Update the session so the new avatar reflects in the navbar
        await update({ avatar: profile.ownerPhoto || profile.logo })
        setEmailSyncStatus('ready')
        
        await new Promise((r) => setTimeout(r, 700))
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2800)
      } catch (error) {
        console.error("Failed to save profile:", error)
        setEmailSyncStatus('error')
        setSaving(false)
        alert("Failed to save profile. Please check the console for details.")
      }
    }
  }

  const handleImageUpload = useCallback((file: File, key: 'logo' | 'ownerPhoto') => {
    const url = URL.createObjectURL(file)
    setProfile((prev) => ({ ...prev, [key]: url }))
  }, [])

  const toggleShowField = (field: ShowFieldKey) => {
    setProfile((prev) => ({ ...prev, showFields: { ...prev.showFields, [field]: !prev.showFields[field] } }))
  }

  const toggleDeliveryArea = (area: string) => {
    setProfile((prev) => ({
      ...prev,
      deliveryAreas: prev.deliveryAreas.includes(area)
        ? prev.deliveryAreas.filter((a) => a !== area)
        : [...prev.deliveryAreas, area],
    }))
  }

  /* ---- Product CRUD ---- */
  const addOrEditProduct = () => {
    if (!newProduct.title || newProduct.price <= 0) return
    if (editingProductId) {
      setProfile((prev) => ({
        ...prev,
        products: prev.products.map((p) => (p.id === editingProductId ? { ...newProduct } : p)),
      }))
    } else {
      setProfile((prev) => ({
        ...prev,
        products: [...prev.products, { ...newProduct, id: `p${Date.now()}` }],
      }))
    }
    setNewProduct({ id: '', title: '', description: '', category: 'Cakes', price: 0, images: [] })
    setEditingProductId(null)
  }

  const editProduct = (p: ProductEntry) => {
    setNewProduct({ ...p })
    setEditingProductId(p.id)
  }

  const deleteProduct = (id: string) => {
    if (confirm('Delete this product?')) {
      setProfile((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }))
    }
  }

  const removeProductImage = (idx: number) => {
    setNewProduct((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))
  }

  const unreadCount = inbox.filter((m) => !m.isRead).length

  const markMessageRead = async (messageId: string) => {
    setInbox((prev) => prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)))
    if (!isSupabaseConfigured()) return
    try {
      await markVendorBusinessEmailAsRead(messageId)
    } catch (_error) {
      setEmailSyncStatus('error')
    }
  }

  /* =========================================
     RENDER
     ========================================= */
  return (
    <ProtectedRoute roles={['SELLER', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* ─── Page header banner ─── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-10 pt-24 text-white lg:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FF6B35 0%, transparent 60%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%)' }} />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-400">Vendor Panel</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Profile Settings</h1>
              <p className="mt-1 text-sm text-neutral-400">Manage your store, products, and delivery coverage.</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold shadow-lg transition-all duration-300 ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-neutral-900 hover:bg-neutral-100 active:scale-95'
              } disabled:opacity-70`}
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="sticky top-0 z-20 bg-white shadow-sm dark:bg-neutral-900 dark:shadow-neutral-800/50">
          <div className="container">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TAB_ITEMS.map((t) => {
                const isActive = activeTab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex shrink-0 items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                        : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {t.icon.includes('M') && t.icon.split('M').length > 2
                        ? t.icon.split(' M').map((d, i) => (
                            <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i === 0 ? d : 'M' + d} />
                          ))
                        : <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                      }
                    </svg>
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ─── Tab Content ─── */}
        <div className="container py-10">

          {/* ======================================
              TAB: BUSINESS INFO
             ====================================== */}
          {activeTab === 'business' && (
            <div className="max-w-3xl space-y-6">

              {/* ── Business Identity Card ── */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Business Identity</h2>
                    <p className="text-sm text-neutral-500">Your logo and business name shown to all customers.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex flex-col items-center gap-2">
                    <CircleImageUpload
                      src={profile.logo}
                      fallback={LOGO_FALLBACK(profile.businessName)}
                      size="lg"
                      onUpload={(f) => handleImageUpload(f, 'logo')}
                      label="Business Logo"
                    />
                    <span className="text-xs text-neutral-400">Business Logo</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <FieldInput
                      label="Business Name"
                      value={profile.businessName}
                      onChange={(v) => setProfile((p) => ({ ...p, businessName: v }))}
                      placeholder="e.g. Hostlanka Business"
                    />
                    <FieldInput
                      label="Short Bio / Tagline"
                      value={profile.shortBio}
                      onChange={(v) => setProfile((p) => ({ ...p, shortBio: v }))}
                      placeholder="Describe your business in a few words..."
                    />
                  </div>
                </div>
              </div>

              {/* ── Owner Information Card ── */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Owner Information</h2>
                    <p className="text-sm text-neutral-500">Your name and profile photo shown to customers.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex flex-col items-center gap-2">
                    <CircleImageUpload
                      src={profile.ownerPhoto}
                      fallback={LOGO_FALLBACK(profile.ownerName)}
                      size="lg"
                      onUpload={(f) => handleImageUpload(f, 'ownerPhoto')}
                      label="Owner Photo"
                    />
                    <span className="text-xs text-neutral-400">Owner Photo</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <FieldInput
                      label="Owner / Contact Name"
                      value={profile.ownerName}
                      onChange={(v) => setProfile((p) => ({ ...p, ownerName: v }))}
                      placeholder="Your full name"
                    />
                    <FieldInput
                      label="Email Address"
                      value={profile.email}
                      type="email"
                      onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* ── Contact Details Card ── */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Contact Details</h2>
                    <p className="text-sm text-neutral-500">How customers can reach you.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <FieldInput
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
                    placeholder="+94 71 234 5678"
                    prefix="📞"
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      WhatsApp Number
                    </label>
                    <div className="mt-1.5 flex overflow-hidden rounded-xl border border-neutral-200 transition-shadow focus-within:ring-2 focus-within:ring-neutral-900 dark:border-neutral-700 dark:focus-within:ring-neutral-100">
                      <span className="flex items-center bg-neutral-50 px-3 text-sm border-r border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={profile.whatsapp}
                        onChange={(e) => setProfile((p) => ({ ...p, whatsapp: e.target.value }))}
                        placeholder="+94 71 234 5678"
                        className="flex-1 bg-white px-4 py-2.5 text-sm outline-none dark:bg-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp availability toggle */}
                <div className="mt-4">
                  <ToggleSwitch
                    checked={profile.whatsappAvailable}
                    onChange={() => setProfile((p) => ({ ...p, whatsappAvailable: !p.whatsappAvailable }))}
                    label="Available on WhatsApp"
                    description={profile.whatsappAvailable ? 'Customers can contact you via WhatsApp' : 'WhatsApp badge will be hidden from your profile'}
                    icon={
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    }
                  />
                </div>
              </div>

              {/* ── Social / Online Presence ── */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Online Presence</h2>
                    <p className="text-sm text-neutral-500">Optional links shown on your public profile.</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <FieldInput
                    label="Website"
                    value={profile.website}
                    onChange={(v) => setProfile((p) => ({ ...p, website: v }))}
                    placeholder="https://yourwebsite.com"
                    prefix="🌐"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldInput
                      label="Instagram"
                      value={profile.instagram}
                      onChange={(v) => setProfile((p) => ({ ...p, instagram: v }))}
                      placeholder="@yourusername"
                      prefix="📸"
                    />
                    <FieldInput
                      label="Facebook"
                      value={profile.facebook}
                      onChange={(v) => setProfile((p) => ({ ...p, facebook: v }))}
                      placeholder="facebook.com/yourpage"
                      prefix="👤"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================
              TAB: PRODUCTS & MEDIA
             ====================================== */}
          {activeTab === 'products' && (
            <div className="max-w-3xl space-y-6">

              {/* Product List */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">Your Products</h2>
                    <p className="text-sm text-neutral-500">{profile.products.length} product{profile.products.length !== 1 ? 's' : ''} listed</p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium dark:bg-neutral-800">
                    {profile.products.length} / ∞
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {profile.products.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center dark:border-neutral-700">
                      <svg className="h-10 w-10 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-neutral-500">No products yet</p>
                      <p className="text-xs text-neutral-400">Add your first product below</p>
                    </div>
                  )}
                  {profile.products.map((p) => (
                    <div key={p.id} className="group flex items-center gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:border-neutral-600">
                      {/* Thumbnail strip */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                        {p.images.length > 0 ? (
                          <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <svg className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                          </div>
                        )}
                        {p.images.length > 1 && (
                          <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[10px] text-white">+{p.images.length - 1}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{p.title}</p>
                        <p className="text-xs text-neutral-500">{p.category} &middot; LKR {p.price.toLocaleString()}</p>
                        {p.description && <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">{p.description}</p>}
                      </div>
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => { editProduct(p); document.getElementById('product-form')?.scrollIntoView({ behavior: 'smooth' }) }}
                          className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add / Edit Product Form */}
              <div id="product-form" className="rounded-2xl border-2 border-dashed border-neutral-300 bg-white p-6 dark:border-neutral-600 dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${editingProductId ? 'bg-amber-100 text-amber-600' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {editingProductId
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      }
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Product Title *</label>
                    <input type="text" value={newProduct.title} onChange={(e) => setNewProduct((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Chocolate Fudge Cake" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Category</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Price (LKR) *</label>
                    <input type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))} min={0} placeholder="0" className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Add Photos</label>
                    <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-2.5 text-sm text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <span>Choose images</span>
                      <input
                        ref={productImagesRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          const urls = files.map((f) => URL.createObjectURL(f))
                          setNewProduct((p) => ({ ...p, images: [...p.images, ...urls] }))
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Image previews */}
                {newProduct.images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {newProduct.images.map((img, i) => (
                      <div key={i} className="group relative">
                        <img src={img} alt="" className="h-20 w-20 rounded-lg object-cover ring-1 ring-neutral-200 dark:ring-neutral-700" />
                        <button
                          type="button"
                          onClick={() => removeProductImage(i)}
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-neutral-400 dark:border-neutral-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="mt-1 text-[10px]">Add more</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        const urls = files.map((f) => URL.createObjectURL(f))
                        setNewProduct((p) => ({ ...p, images: [...p.images, ...urls] }))
                      }} />
                    </label>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="Describe this product — ingredients, customisation options, servings..."
                    className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={addOrEditProduct}
                    className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 transition-all"
                  >
                    {editingProductId ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProductId && (
                    <button
                      onClick={() => { setNewProduct({ id: '', title: '', description: '', category: 'Cakes', price: 0, images: [] }); setEditingProductId(null) }}
                      className="rounded-xl border border-neutral-200 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================
              TAB: ADDRESS & DELIVERY
             ====================================== */}
          {activeTab === 'address' && (
            <div className="max-w-3xl space-y-6">

              {/* Address card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Business Address</h2>
                    <p className="text-sm text-neutral-500">Pin your location on the map. Customers use this to find you.</p>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium">Address</label>
                  <div className="mt-1.5 flex overflow-hidden rounded-xl border border-neutral-200 transition-shadow focus-within:ring-2 focus-within:ring-neutral-900 dark:border-neutral-700 dark:focus-within:ring-neutral-100">
                    <span className="flex items-center bg-neutral-50 px-3 text-neutral-500 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                      placeholder="No. 123, Main Street, City"
                      className="flex-1 bg-white px-4 py-2.5 text-sm outline-none dark:bg-neutral-900"
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="mt-5">
                  <DeliveryMap
                    height="h-72"
                    selectionMode="center"
                    radiusKm={profile.deliveryMethod === 'radius' ? profile.deliveryRadius : undefined}
                    highlightRadius={profile.deliveryMethod === 'radius'}
                    onLocationChange={(lat, lng) => setProfile((p) => ({ ...p, location: { lat, lng } }))}
                  />
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800">
                    <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <p className="text-xs text-neutral-400">
                      Keep the pin centered and move the map to set exact location · Lat: {profile.location.lat.toFixed(5)}, Lng: {profile.location.lng.toFixed(5)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Settings card */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Delivery Coverage</h2>
                    <p className="text-sm text-neutral-500">Choose between specific areas or a delivery radius.</p>
                  </div>
                </div>

                {/* Method selector */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { value: 'areas', label: 'Area by Name', desc: 'Pick named areas, optional custom area', icon: '🗺️' },
                    { value: 'radius', label: 'Radius Circle', desc: 'Coverage by distance from map pin', icon: '⭕' },
                  ].map((opt) => {
                    const active = profile.deliveryMethod === opt.value
                    return (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-colors ${
                          active
                            ? 'border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-800'
                            : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={opt.value}
                          checked={active}
                          onChange={() => setProfile((p) => ({ ...p, deliveryMethod: opt.value as 'areas' | 'radius' }))}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-2">
                          <span className={`h-5 w-5 rounded-full border-2 ${active ? 'border-neutral-900' : 'border-neutral-300 dark:border-neutral-600'} flex items-center justify-center`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-neutral-900 dark:bg-white' : 'bg-transparent'}`} />
                          </span>
                          <span className="text-sm font-semibold">{opt.label}</span>
                          <span className="ml-auto text-base">{opt.icon}</span>
                        </div>
                        <p className="text-xs text-neutral-500">{opt.desc}</p>
                      </label>
                    )
                  })}
                </div>

                {/* Areas selector */}
                {profile.deliveryMethod === 'areas' && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Select Delivery Areas (Province -&gt; Cities)</label>
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium dark:bg-neutral-800">
                        {profile.deliveryAreas.length} selected
                      </span>
                    </div>

                    <div className="mt-3">
                      <label className="text-xs font-medium text-neutral-500">Search city / area / province</label>
                      <input
                        type="text"
                        value={areaSearch}
                        onChange={(e) => setAreaSearch(e.target.value)}
                        placeholder="Type to filter locations"
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
                      />
                    </div>

                    <div className="mt-3 max-h-[420px] space-y-3 overflow-y-auto pr-1">
                      {deliveryAreaGroups.map((province) => (
                        <div key={province.name} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{province.name}</p>
                          <div className="mt-2 space-y-3">
                            {province.towns.map((town) => (
                              <div key={`${province.name}-${town.name}`}>
                                <p className="text-[11px] font-medium text-neutral-500">{town.name}</p>
                                <div className="mt-1.5 flex flex-wrap gap-2">
                                  {town.subAreas.map((area) => {
                                    const sel = profile.deliveryAreas.includes(area)
                                    return (
                                      <button
                                        key={`${province.name}-${town.name}-${area}`}
                                        type="button"
                                        onClick={() => toggleDeliveryArea(area)}
                                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 active:scale-95 ${
                                          sel
                                            ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                                            : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                        }`}
                                      >
                                        {sel && <span className="mr-1">✓</span>}
                                        {area}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {deliveryAreaGroups.length === 0 && (
                      <p className="mt-3 rounded-xl bg-neutral-50 px-4 py-2.5 text-sm text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                        No locations found for {areaSearch}.
                      </p>
                    )}

                    {profile.deliveryAreas.length > 0 && (
                      <div className="mt-4 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800">
                        <p className="text-xs font-medium text-neutral-500">Selected Areas:</p>
                        <p className="mt-1 text-sm">{profile.deliveryAreas.join(', ')}</p>
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="text-sm font-medium">Optional custom area name</label>
                      <input
                        type="text"
                        value={profile.locationAreaName}
                        onChange={(e) => setProfile((p) => ({ ...p, locationAreaName: e.target.value }))}
                        placeholder="e.g. Homagama / Kottawa"
                        className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-neutral-100"
                      />
                      {profile.locationAreaName.trim() && (
                        <p className="mt-1 text-xs text-neutral-500">Custom area: {profile.locationAreaName}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Radius selector */}
                {profile.deliveryMethod === 'radius' && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Delivery Radius</label>
                      <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-neutral-900">
                        {profile.deliveryRadius} km
                      </span>
                    </div>
                    <div className="mt-3">
                      <input
                        type="range"
                        min={1}
                        max={50}
                        value={profile.deliveryRadius}
                        onChange={(e) => setProfile((p) => ({ ...p, deliveryRadius: Number(e.target.value) }))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-neutral-900 dark:bg-neutral-700"
                      />
                      <div className="mt-1 flex justify-between text-xs text-neutral-400">
                        <span>1 km</span>
                        <span>25 km</span>
                        <span>50 km</span>
                      </div>
                    </div>
                    <p className="mt-3 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300">
                      📍 You deliver within <strong>{profile.deliveryRadius} km</strong> of your pinned location.
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold">Seller Availability</h3>
                      <p className="text-xs text-neutral-500">Pause orders temporarily and choose whether to keep contact visible.</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${profile.temporarilyUnavailable ? 'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                      {profile.temporarilyUnavailable ? 'Temporarily Unavailable' : 'Available for Orders'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, temporarilyUnavailable: !p.temporarilyUnavailable }))}
                    className={`mt-3 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${profile.temporarilyUnavailable ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                  >
                    {profile.temporarilyUnavailable ? 'Mark as Available Now' : 'Set as Temporarily Unavailable'}
                  </button>

                  {profile.temporarilyUnavailable && (
                    <div className="mt-3 space-y-3">
                      <ToggleSwitch
                        checked={profile.showPhoneWhenUnavailable}
                        onChange={() => setProfile((p) => ({ ...p, showPhoneWhenUnavailable: !p.showPhoneWhenUnavailable }))}
                        label="Show contact number while unavailable"
                        description={profile.showPhoneWhenUnavailable ? 'Customers can still call for urgent requests' : 'Contact number stays hidden until you become available'}
                      />
                      <p className="rounded-lg bg-white px-3 py-2 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        Customer preview: Temporarily unavailable for new orders.
                        {profile.showPhoneWhenUnavailable && profile.showFields.phone && profile.phone.trim()
                          ? ` Contact: ${profile.phone}`
                          : ' Contact number hidden.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================
              TAB: PROFILE VISIBILITY
             ====================================== */}
          {activeTab === 'visibility' && (
            <div className="max-w-2xl space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Public Profile Visibility</h2>
                    <p className="text-sm text-neutral-500">Choose which information is visible to customers on your public profile page.</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <ToggleSwitch
                    checked={profile.showFields.businessName}
                    onChange={() => toggleShowField('businessName')}
                    label="Business Name"
                    description="Show your store name on the public listing"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.ownerName}
                    onChange={() => toggleShowField('ownerName')}
                    label="Owner Name"
                    description="Display the owner or contact name"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.phone}
                    onChange={() => toggleShowField('phone')}
                    label="Phone Number"
                    description="Show your phone number to visitors"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.whatsapp}
                    onChange={() => toggleShowField('whatsapp')}
                    label="WhatsApp Availability"
                    description="Display the WhatsApp chat button"
                    icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.address}
                    onChange={() => toggleShowField('address')}
                    label="Business Address"
                    description="Show your physical address on the profile"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.deliveryAreas}
                    onChange={() => toggleShowField('deliveryAreas')}
                    label="Delivery Coverage"
                    description="Show delivery areas or radius on your profile"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.website}
                    onChange={() => toggleShowField('website')}
                    label="Website Link"
                    description="Show your website URL on the profile"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12a8.959 8.959 0 00.284 2.253" /></svg>}
                  />
                  <ToggleSwitch
                    checked={profile.showFields.socialMedia}
                    onChange={() => toggleShowField('socialMedia')}
                    label="Social Media Links"
                    description="Display Instagram and Facebook links"
                    icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>}
                  />
                </div>

                {/* Summary */}
                <div className="mt-6 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Visibility Summary</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(profile.showFields).map(([key, val]) => (
                      <span key={key} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${val ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-neutral-200 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400 line-through'}`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Profile preview hint */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/30">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Privacy Tip</p>
                  <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
                    Only fields you enable here will appear on your public vendor page. Hidden fields are still saved and can be re-enabled anytime.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="max-w-3xl space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5h-15A2.25 2.25 0 012.25 17.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91A2.25 2.25 0 012.25 6.993V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold">Business Email Management</h2>
                    <p className="text-sm text-neutral-500">Manage your free subdomain-based email inbox for seller communications.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FieldInput
                    label="Mailbox name"
                    value={profile.businessEmailLocalPart}
                    onChange={(v) => setProfile((p) => ({ ...p, businessEmailLocalPart: v.toLowerCase().replace(/[^a-z0-9._-]/g, '') }))}
                    placeholder="nimrucakes"
                    hint="Only lowercase letters, numbers, dot, dash and underscore"
                  />
                  <FieldInput
                    label="Domain"
                    value={profile.businessEmailDomain}
                    onChange={(v) => setProfile((p) => ({ ...p, businessEmailDomain: v }))}
                    placeholder="hostlanka.online"
                  />
                </div>

                <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                  <p className="text-xs text-neutral-500">Business Email Address</p>
                  <p className="mt-1 font-mono text-base font-semibold">
                    {profile.businessEmailLocalPart || 'yourbrand'}@{profile.businessEmailDomain || 'hostlanka.online'}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">Example: mybusiness@hostlanka.online</p>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <FieldInput
                    label="Forward to personal email (optional)"
                    value={profile.businessEmailForwarding}
                    onChange={(v) => setProfile((p) => ({ ...p, businessEmailForwarding: v }))}
                    type="email"
                    placeholder="you@gmail.com"
                  />
                  <div className="flex items-end">
                    <ToggleSwitch
                      checked={profile.businessEmailNotifications}
                      onChange={() => setProfile((p) => ({ ...p, businessEmailNotifications: !p.businessEmailNotifications }))}
                      label="Inbox notifications"
                      description="Notify seller on new business emails"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-lg border px-3 py-2 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                  Supabase email sync: {emailSyncStatus === 'ready' ? 'Connected' : emailSyncStatus === 'loading' ? 'Loading...' : emailSyncStatus === 'error' ? 'Error' : 'Local mode'}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Inbox</h3>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold dark:bg-neutral-800">
                    {unreadCount} unread
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {inbox.map((msg) => (
                    <button
                      key={msg.id}
                      type="button"
                      onClick={() => markMessageRead(msg.id)}
                      className={`w-full rounded-xl border p-3 text-left transition-colors ${
                        msg.isRead
                          ? 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                          : 'border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{msg.subject}</p>
                        <span className="text-[11px] text-neutral-500">{new Date(msg.receivedAt).toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">From: {msg.sender}</p>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">{msg.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold shadow-md transition-all duration-300 ${
                saved ? 'bg-emerald-500 text-white' : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100'
              } disabled:opacity-70 active:scale-95`}
            >
              {saving ? (
                <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
              ) : saved ? (
                <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>Saved!</>
              ) : (
                <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
