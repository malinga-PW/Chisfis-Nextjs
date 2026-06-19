'use client'

import { DeliveryMap } from '@/components/DeliveryMap'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  fetchBuyersFromSupabase,
  fetchVendorsFromSupabase,
  updateVendorStatusInSupabase,
  upsertBuyerToSupabase,
  upsertVendorToSupabase,
} from '@/lib/supabase/adminUsers'
import { isSupabaseConfigured } from '@/lib/supabase/client'
import { useEffect, useState, type ChangeEvent } from 'react'

interface VendorProduct {
  id: string
  title: string
  description: string
  category: string
  price: number
  media: string | null
}

interface VendorVisibility {
  ownerName: boolean
  phone: boolean
  address: boolean
  deliveryInfo: boolean
  whatsapp: boolean
}

interface VendorRequest {
  id: string
  businessName: string
  owner: string
  email: string
  location: string
  phone: string
  logo: string
  ownerPhoto: string
  whatsappNumber: string
  whatsappAvailable: boolean
  address: string
  lat: number
  lng: number
  deliveryMode: 'areas' | 'radius'
  deliveryAreas: string[]
  deliveryRadiusKm: number
  visibility: VendorVisibility
  products: VendorProduct[]
  improvementNotes: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submitted: string
}

interface BuyerProfile {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  joined: string
}

const AREA_OPTIONS = [
  'Athurugiriya',
  'Malabe',
  'Kaduwela',
  'Battaramulla',
  'Kiribathgoda',
  'Mulleriyawa',
  'Rajanganaya',
  'Nugegoda',
  'Wattala',
  'Kelaniya',
  'Colombo 05',
  'Colombo 07',
]

const CATEGORY_OPTIONS = ['Cakes', 'Cupcakes', 'Desserts', 'Savouries', 'Rice & Curry', 'Short Eats']

export default function AdminUsersPage() {
  const [vendors, setVendors] = useState<VendorRequest[]>([])
  const [buyers, setBuyers] = useState<BuyerProfile[]>([])
  const [tab, setTab] = useState<'vendors' | 'buyers'>('vendors')
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null)
  const [vendorForm, setVendorForm] = useState<VendorRequest | null>(null)
  const [editingBuyerId, setEditingBuyerId] = useState<string | null>(null)
  const [buyerForm, setBuyerForm] = useState<BuyerProfile | null>(null)

  const [productDraft, setProductDraft] = useState<Omit<VendorProduct, 'id'>>({
    title: '',
    description: '',
    category: 'Cakes',
    price: 0,
    media: null,
  })
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'ready' | 'saving' | 'error'>('idle')
  const [syncMessage, setSyncMessage] = useState('')

  useEffect(() => {
    let mounted = true

    const loadFromSupabase = async () => {
      if (!isSupabaseConfigured()) {
        setSyncState('idle')
        setSyncMessage('Supabase not configured.')
        return
      }

      try {
        setSyncState('loading')
        setSyncMessage('Loading users from Supabase...')
        const [supabaseVendors, supabaseBuyers] = await Promise.all([
          fetchVendorsFromSupabase(),
          fetchBuyersFromSupabase(),
        ])

        if (!mounted) return
        if (supabaseVendors && supabaseVendors.length > 0) setVendors(supabaseVendors)
        if (supabaseBuyers && supabaseBuyers.length > 0) setBuyers(supabaseBuyers)
        setSyncState('ready')
        setSyncMessage('Connected to Supabase')
      } catch (_error) {
        if (!mounted) return
        setSyncState('error')
        setSyncMessage('Supabase load failed.')
      }
    }

    loadFromSupabase()
    return () => {
      mounted = false
    }
  }, [])

  const updateStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status } : v))
    if (!isSupabaseConfigured()) return
    try {
      setSyncState('saving')
      setSyncMessage('Saving status to Supabase...')
      await updateVendorStatusInSupabase(id, status)
      setSyncState('ready')
      setSyncMessage('Status updated in Supabase')
    } catch (_error) {
      setSyncState('error')
      setSyncMessage('Failed to update status in Supabase')
    }
  }

  const beginVendorEdit = (vendor: VendorRequest) => {
    setEditingBuyerId(null)
    setBuyerForm(null)
    setEditingVendorId(vendor.id)
    setVendorForm({
      ...vendor,
      deliveryAreas: [...vendor.deliveryAreas],
      visibility: { ...vendor.visibility },
      products: vendor.products.map((p) => ({ ...p })),
    })
    setProductDraft({ title: '', description: '', category: 'Cakes', price: 0, media: null })
    setEditingProductId(null)
  }

  const saveVendor = async () => {
    if (!editingVendorId || !vendorForm) return
    setVendors((prev) => prev.map((v) => (v.id === editingVendorId ? vendorForm : v)))
    if (isSupabaseConfigured()) {
      try {
        setSyncState('saving')
        setSyncMessage('Saving vendor to Supabase...')
        await upsertVendorToSupabase(vendorForm)
        setSyncState('ready')
        setSyncMessage('Vendor saved to Supabase')
      } catch (_error) {
        setSyncState('error')
        setSyncMessage('Failed to save vendor to Supabase')
      }
    }
    setEditingVendorId(null)
    setVendorForm(null)
    setEditingProductId(null)
    setProductDraft({ title: '', description: '', category: 'Cakes', price: 0, media: null })
  }

  const beginBuyerEdit = (buyer: BuyerProfile) => {
    setEditingVendorId(null)
    setVendorForm(null)
    setEditingBuyerId(buyer.id)
    setBuyerForm({ ...buyer })
  }

  const saveBuyer = async () => {
    if (!editingBuyerId || !buyerForm) return
    setBuyers((prev) => prev.map((b) => (b.id === editingBuyerId ? buyerForm : b)))
    if (isSupabaseConfigured()) {
      try {
        setSyncState('saving')
        setSyncMessage('Saving buyer to Supabase...')
        await upsertBuyerToSupabase(buyerForm)
        setSyncState('ready')
        setSyncMessage('Buyer saved to Supabase')
      } catch (_error) {
        setSyncState('error')
        setSyncMessage('Failed to save buyer to Supabase')
      }
    }
    setEditingBuyerId(null)
    setBuyerForm(null)
  }

  const cancelEdit = () => {
    setEditingVendorId(null)
    setVendorForm(null)
    setEditingBuyerId(null)
    setBuyerForm(null)
    setEditingProductId(null)
    setProductDraft({ title: '', description: '', category: 'Cakes', price: 0, media: null })
  }

  const updateVendorField = <K extends keyof VendorRequest>(key: K, value: VendorRequest[K]) => {
    setVendorForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const toggleArea = (area: string) => {
    setVendorForm((prev) => {
      if (!prev) return prev
      const exists = prev.deliveryAreas.includes(area)
      return {
        ...prev,
        deliveryAreas: exists ? prev.deliveryAreas.filter((a) => a !== area) : [...prev.deliveryAreas, area],
      }
    })
  }

  const toggleVisibility = (key: keyof VendorVisibility) => {
    setVendorForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        visibility: { ...prev.visibility, [key]: !prev.visibility[key] },
      }
    })
  }

  const handleVendorImageUpload = (event: ChangeEvent<HTMLInputElement>, field: 'logo' | 'ownerPhoto') => {
    const file = event.target.files?.[0]
    if (!file) return
    updateVendorField(field, URL.createObjectURL(file))
  }

  const handleProductMediaUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setProductDraft((prev) => ({ ...prev, media: URL.createObjectURL(file) }))
  }

  const addOrUpdateProduct = () => {
    if (!vendorForm || !productDraft.title.trim() || productDraft.price <= 0) return
    if (editingProductId) {
      updateVendorField(
        'products',
        vendorForm.products.map((p) => (p.id === editingProductId ? { id: p.id, ...productDraft } : p)),
      )
    } else {
      updateVendorField('products', [...vendorForm.products, { id: `vp-${Date.now()}`, ...productDraft }])
    }
    setEditingProductId(null)
    setProductDraft({ title: '', description: '', category: 'Cakes', price: 0, media: null })
  }

  const editProduct = (product: VendorProduct) => {
    setEditingProductId(product.id)
    setProductDraft({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      media: product.media,
    })
  }

  const removeProduct = (id: string) => {
    if (!vendorForm) return
    updateVendorField(
      'products',
      vendorForm.products.filter((product) => product.id !== id),
    )
    if (editingProductId === id) {
      setEditingProductId(null)
      setProductDraft({ title: '', description: '', category: 'Cakes', price: 0, media: null })
    }
  }

  return (
    <ProtectedRoute roles={['SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <h1 className="text-3xl font-semibold">User Management</h1>
        <p className="mt-2 text-neutral-500">Manage buyers and approve, reject, or edit vendor registrations.</p>

        {syncMessage && (
          <div
            className={`mt-4 rounded-lg border px-3 py-2 text-xs font-medium ${
              syncState === 'error'
                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300'
                : syncState === 'saving' || syncState === 'loading'
                  ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300'
                  : 'border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300'
            }`}
          >
            {syncMessage}
          </div>
        )}

        <div className="mt-6 flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700 w-fit">
          {(['vendors', 'buyers'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow-sm dark:bg-neutral-600' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'}`}>
              {t === 'vendors' ? `Vendors (${vendors.length})` : `Buyers (${buyers.length})`}
            </button>
          ))}
        </div>

        {tab === 'vendors' && (
          <div className="mt-6 space-y-3">
            {vendors.map((v) => (
              <div key={v.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                {editingVendorId === v.id && vendorForm ? (
                  <div className="space-y-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">Advanced Vendor Edit Section</p>
                        <p className="text-xs text-neutral-500">Business, media, profile visibility, WhatsApp, address and delivery settings</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          vendorForm.status === 'Approved'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : vendorForm.status === 'Rejected'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        }`}
                      >
                        {vendorForm.status}
                      </span>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="text-sm font-semibold">Business Identity</h3>
                      <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <img src={vendorForm.logo} alt="Business logo" className="h-20 w-20 rounded-full border border-neutral-200 object-cover dark:border-neutral-700" />
                            <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-neutral-900 p-1.5 text-white dark:bg-neutral-100 dark:text-neutral-900" title="Edit logo">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                              </svg>
                              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleVendorImageUpload(event, 'logo')} />
                            </label>
                          </div>
                          <span className="text-xs text-neutral-500">Business Logo</span>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-neutral-500">Business Name</label>
                          <input
                            type="text"
                            value={vendorForm.businessName}
                            onChange={(event) => updateVendorField('businessName', event.target.value)}
                            className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-6 sm:flex-row">
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <img src={vendorForm.ownerPhoto} alt="Owner photo" className="h-16 w-16 rounded-full border border-neutral-200 object-cover dark:border-neutral-700" />
                            <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-neutral-900 p-1.5 text-white dark:bg-neutral-100 dark:text-neutral-900" title="Edit owner photo">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                              </svg>
                              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleVendorImageUpload(event, 'ownerPhoto')} />
                            </label>
                          </div>
                          <span className="text-xs text-neutral-500">Owner Photo</span>
                        </div>
                        <div className="grid flex-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="text-xs font-medium text-neutral-500">Owner Name</label>
                            <input
                              type="text"
                              value={vendorForm.owner}
                              onChange={(event) => updateVendorField('owner', event.target.value)}
                              className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-500">Email</label>
                            <input
                              type="email"
                              value={vendorForm.email}
                              onChange={(event) => updateVendorField('email', event.target.value)}
                              className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-500">Phone</label>
                            <input
                              type="text"
                              value={vendorForm.phone}
                              onChange={(event) => updateVendorField('phone', event.target.value)}
                              className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-neutral-500">Location</label>
                            <input
                              type="text"
                              value={vendorForm.location}
                              onChange={(event) => updateVendorField('location', event.target.value)}
                              className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="text-sm font-semibold">Products Descriptions & Media</h3>
                      <p className="mt-1 text-xs text-neutral-500">Manage product details and media from this edit section.</p>

                      <div className="mt-4 space-y-2">
                        {vendorForm.products.map((product) => (
                          <div key={product.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                            <div className="h-12 w-12 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                              {product.media ? (
                                <img src={product.media} alt="Product media" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-neutral-400">IMG</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{product.title}</p>
                              <p className="text-xs text-neutral-500">{product.category} &middot; LKR {product.price.toLocaleString()}</p>
                              <p className="truncate text-xs text-neutral-400">{product.description}</p>
                            </div>
                            <button onClick={() => editProduct(product)} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                            <button onClick={() => removeProduct(product.id)} className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Remove</button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 rounded-lg border border-dashed border-neutral-300 p-3 dark:border-neutral-600">
                        <p className="text-xs font-semibold">{editingProductId ? 'Edit Product' : 'Add Product'}</p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Product title"
                            value={productDraft.title}
                            onChange={(event) => setProductDraft((prev) => ({ ...prev, title: event.target.value }))}
                            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                          />
                          <select
                            value={productDraft.category}
                            onChange={(event) => setProductDraft((prev) => ({ ...prev, category: event.target.value }))}
                            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                          >
                            {CATEGORY_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            placeholder="Price (LKR)"
                            value={productDraft.price || ''}
                            onChange={(event) => setProductDraft((prev) => ({ ...prev, price: Number(event.target.value) }))}
                            className="rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProductMediaUpload}
                            className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-2 file:py-1 file:text-xs dark:file:bg-neutral-700"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Product description"
                          value={productDraft.description}
                          onChange={(event) => setProductDraft((prev) => ({ ...prev, description: event.target.value }))}
                          className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                        <div className="mt-2 flex gap-2">
                          <button onClick={addOrUpdateProduct} className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
                            {editingProductId ? 'Update Product' : 'Add Product'}
                          </button>
                          {editingProductId && (
                            <button
                              onClick={() => {
                                setEditingProductId(null)
                                setProductDraft({ title: '', description: '', category: 'Cakes', price: 0, media: null })
                              }}
                              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="text-sm font-semibold">Other Profile Data & WhatsApp</h3>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="text-xs font-medium text-neutral-500">WhatsApp Number</label>
                          <input
                            type="text"
                            value={vendorForm.whatsappNumber}
                            onChange={(event) => updateVendorField('whatsappNumber', event.target.value)}
                            className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                          />
                        </div>
                        <label className="flex items-center gap-2 self-end text-sm">
                          <input
                            type="checkbox"
                            checked={vendorForm.whatsappAvailable}
                            onChange={() => updateVendorField('whatsappAvailable', !vendorForm.whatsappAvailable)}
                            className="h-4 w-4 rounded border-neutral-300"
                          />
                          WhatsApp available
                        </label>
                      </div>

                      <p className="mt-4 text-xs font-semibold text-neutral-500">Public profile field visibility</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {([
                          ['ownerName', 'Owner name'],
                          ['phone', 'Phone number'],
                          ['address', 'Address'],
                          ['deliveryInfo', 'Delivery info'],
                          ['whatsapp', 'WhatsApp status'],
                        ] as [keyof VendorVisibility, string][]).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={vendorForm.visibility[key]}
                              onChange={() => toggleVisibility(key)}
                              className="h-4 w-4 rounded border-neutral-300"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="text-sm font-semibold">Address, Location Tag & Delivery</h3>
                      <label className="mt-3 block text-xs font-medium text-neutral-500">Address</label>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                          <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={vendorForm.address}
                          onChange={(event) => updateVendorField('address', event.target.value)}
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                      </div>

                      <div className="mt-3">
                        <DeliveryMap
                          height="h-60"
                          onLocationChange={(lat, lng) => {
                            updateVendorField('lat', lat)
                            updateVendorField('lng', lng)
                          }}
                        />
                        <p className="mt-1 text-xs text-neutral-400">
                          Pinned location: {vendorForm.lat.toFixed(4)}, {vendorForm.lng.toFixed(4)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-xs font-medium">
                          <input
                            type="radio"
                            name={`delivery-mode-${v.id}`}
                            checked={vendorForm.deliveryMode === 'areas'}
                            onChange={() => updateVendorField('deliveryMode', 'areas')}
                          />
                          Delivery area list
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium">
                          <input
                            type="radio"
                            name={`delivery-mode-${v.id}`}
                            checked={vendorForm.deliveryMode === 'radius'}
                            onChange={() => updateVendorField('deliveryMode', 'radius')}
                          />
                          Radius option
                        </label>
                      </div>

                      {vendorForm.deliveryMode === 'areas' ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {AREA_OPTIONS.map((area) => (
                            <button
                              key={area}
                              type="button"
                              onClick={() => toggleArea(area)}
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                vendorForm.deliveryAreas.includes(area)
                                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                  : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800'
                              }`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3">
                          <label className="text-xs font-medium text-neutral-500">Delivery radius (km)</label>
                          <div className="mt-1 flex items-center gap-3">
                            <input
                              type="range"
                              min={1}
                              max={50}
                              value={vendorForm.deliveryRadiusKm}
                              onChange={(event) => updateVendorField('deliveryRadiusKm', Number(event.target.value))}
                              className="w-full max-w-xs accent-neutral-900"
                            />
                            <span className="text-xs font-semibold">{vendorForm.deliveryRadiusKm} km</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                      <h3 className="text-sm font-semibold">Suggestions / Improvements</h3>
                      <textarea
                        rows={3}
                        placeholder="Add admin notes or improvement suggestions for this vendor profile"
                        value={vendorForm.improvementNotes}
                        onChange={(event) => updateVendorField('improvementNotes', event.target.value)}
                        className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button onClick={saveVendor} className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">Save</button>
                      <button onClick={cancelEdit} className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancel</button>
                      {vendorForm.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              updateVendorField('status', 'Approved')
                            }}
                            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              updateVendorField('status', 'Rejected')
                            }}
                            className="rounded-lg bg-red-500 px-4 py-2 text-xs font-medium text-white hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex flex-1 items-center gap-3">
                      <img src={v.logo} alt="Vendor logo" className="h-12 w-12 rounded-full border border-neutral-200 object-cover dark:border-neutral-700" />
                      <img src={v.ownerPhoto} alt="Owner photo" className="h-10 w-10 rounded-full border border-neutral-200 object-cover dark:border-neutral-700" />
                      <div className="min-w-0">
                        <p className="font-medium">{v.businessName}</p>
                        <p className="text-sm text-neutral-500">{v.owner} &middot; {v.email} &middot; {v.phone} &middot; {v.location}</p>
                      </div>
                      <p className="text-xs text-neutral-400">Submitted: {v.submitted}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        v.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        v.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                      }`}>{v.status}</span>
                      {v.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(v.id, 'Approved')} className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700">Approve</button>
                          <button onClick={() => updateStatus(v.id, 'Rejected')} className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600">Reject</button>
                        </>
                      )}
                      <button onClick={() => beginVendorEdit(v)} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'buyers' && (
          <div className="mt-6 space-y-3">
            {buyers.map((b) => (
              <div key={b.id} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                {editingBuyerId === b.id && buyerForm ? (
                  <div className="space-y-3">
                    {['name', 'email', 'phone'].map((field) => (
                      <div key={field}>
                        <label className="text-xs font-medium text-neutral-500 capitalize">{field}</label>
                        <input
                          type="text"
                          value={buyerForm[field as keyof BuyerProfile] as string}
                          onChange={(event) => setBuyerForm((prev) => (prev ? { ...prev, [field]: event.target.value } : prev))}
                          className="mt-0.5 w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveBuyer} className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">Save</button>
                      <button onClick={cancelEdit} className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{b.name}</p>
                      <p className="text-sm text-neutral-500">{b.email} &middot; {b.phone}</p>
                      <p className="text-xs text-neutral-400">Joined {b.joined} &middot; {b.orders} orders</p>
                    </div>
                    <button onClick={() => beginBuyerEdit(b)} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
