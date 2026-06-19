'use client'

import { DeliveryMap } from '@/components/DeliveryMap'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useMemo, useState } from 'react'

type DeliveryMode = 'areas' | 'radius'

interface CakeProduct {
  id: string
  title: string
  category: string
  price: number
  weights: string[]
  deliveryAreas: string[]
  deliveryMode: DeliveryMode
  deliveryRadiusKm: number
  customAreaName: string
  lat: number
  lng: number
  mapTouchActive: boolean
  image: string
  salesCount: number
  ongoingOrders: number
  totalValue: number
  commentsCount: number
  asksCount: number
  lastComment: string
  lastAsk: string
}

type ProductForm = Omit<CakeProduct, 'id'>

const CATEGORIES = ['Birthday', 'Wedding', 'Anniversary', 'Corporate', 'Custom Design', 'Cupcakes', 'Desserts', 'Savouries']
const WEIGHT_OPTIONS = ['500g', '1kg', '2kg', '3kg', '5kg']
const AREA_OPTIONS = ['Colombo', 'Kandy', 'Galle', 'Nugegoda', 'Negombo', 'Jaffna', 'Batticaloa', 'Malabe', 'Kaduwela', 'Wattala']

const INITIAL_PRODUCTS: CakeProduct[] = [
  {
    id: 'p1',
    title: 'Classic Vanilla Wedding Cake',
    category: 'Wedding',
    price: 15000,
    weights: ['3kg', '5kg'],
    deliveryAreas: ['Colombo', 'Kandy'],
    deliveryMode: 'areas',
    deliveryRadiusKm: 12,
    customAreaName: '',
    lat: 6.9271,
    lng: 79.8612,
    mapTouchActive: false,
    image: '',
    salesCount: 42,
    ongoingOrders: 5,
    totalValue: 630000,
    commentsCount: 28,
    asksCount: 9,
    lastComment: 'Great design and taste! Delivered on time.',
    lastAsk: 'Can this be made eggless for Sunday?',
  },
  {
    id: 'p2',
    title: 'Chocolate Fudge Birthday Cake',
    category: 'Birthday',
    price: 6800,
    weights: ['1kg', '2kg', '3kg'],
    deliveryAreas: ['Colombo', 'Nugegoda'],
    deliveryMode: 'radius',
    deliveryRadiusKm: 15,
    customAreaName: '',
    lat: 6.9000,
    lng: 79.9500,
    mapTouchActive: false,
    image: '',
    salesCount: 75,
    ongoingOrders: 8,
    totalValue: 510000,
    commentsCount: 43,
    asksCount: 16,
    lastComment: 'Kids loved this chocolate flavor.',
    lastAsk: 'Available for same-day pickup?',
  },
]

const EMPTY_FORM: ProductForm = {
  title: '',
  category: 'Birthday',
  price: 0,
  weights: [],
  deliveryAreas: [],
  deliveryMode: 'areas',
  deliveryRadiusKm: 10,
  customAreaName: '',
  lat: 6.9271,
  lng: 79.8612,
  mapTouchActive: false,
  image: '',
  salesCount: 0,
  ongoingOrders: 0,
  totalValue: 0,
  commentsCount: 0,
  asksCount: 0,
  lastComment: '',
  lastAsk: '',
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<CakeProduct[]>(INITIAL_PRODUCTS)
  const [activeEditorId, setActiveEditorId] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<ProductForm>(EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [areaSearch, setAreaSearch] = useState('')

  const matchingAreas = useMemo(
    () => AREA_OPTIONS.filter((a) => a.toLowerCase().includes(areaSearch.toLowerCase())).slice(0, 6),
    [areaSearch],
  )

  const openNew = () => {
    setActiveEditorId('new')
    setDraft(EMPTY_FORM)
    setImagePreview(null)
    setAreaSearch('')
  }

  const openEdit = (product: CakeProduct) => {
    setActiveEditorId(product.id)
    setDraft({ ...product })
    setImagePreview(product.image || null)
    setAreaSearch('')
  }

  const cancelEditor = () => {
    setActiveEditorId(null)
    setDraft(EMPTY_FORM)
    setImagePreview(null)
    setAreaSearch('')
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
    if (activeEditorId === id) cancelEditor()
  }

  const toggleWeight = (weight: string) => {
    setDraft((prev) => ({
      ...prev,
      weights: prev.weights.includes(weight)
        ? prev.weights.filter((w) => w !== weight)
        : [...prev.weights, weight],
    }))
  }

  const toggleArea = (area: string) => {
    setDraft((prev) => ({
      ...prev,
      deliveryAreas: prev.deliveryAreas.includes(area)
        ? prev.deliveryAreas.filter((a) => a !== area)
        : [...prev.deliveryAreas, area],
    }))
  }

  const saveDraft = () => {
    if (!draft.title.trim() || draft.price <= 0) return

    const normalizedAreas = draft.customAreaName.trim()
      ? Array.from(new Set([...draft.deliveryAreas, draft.customAreaName.trim()]))
      : draft.deliveryAreas

    const nextData = { ...draft, deliveryAreas: normalizedAreas }

    if (activeEditorId === 'new') {
      setProducts((prev) => [{ ...nextData, id: `p${Date.now()}` }, ...prev])
    } else if (activeEditorId) {
      setProducts((prev) => prev.map((p) => (p.id === activeEditorId ? { ...p, ...nextData } : p)))
    }
    cancelEditor()
  }

  const renderEditor = (title: string) => (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">Update directly from normal product view</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Product Title *</label>
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category *</label>
          <select
            value={draft.category}
            onChange={(e) => setDraft((p) => ({ ...p, category: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Price (LKR) *</label>
          <input
            type="number"
            value={draft.price || ''}
            onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value) }))}
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const url = URL.createObjectURL(file)
              setImagePreview(url)
              setDraft((p) => ({ ...p, image: url }))
            }}
            className="mt-1 w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200 dark:file:bg-neutral-700"
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-20 w-20 rounded-xl object-cover" />}
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Available Weights</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {WEIGHT_OPTIONS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => toggleWeight(w)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                draft.weights.includes(w)
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
        <p className="text-sm font-semibold">Delivery Area Controls</p>
        <p className="mt-1 text-xs text-neutral-500">Select on map, radius circle, and search on map area names</p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {([
            { value: 'areas', label: 'Area by Name' },
            { value: 'radius', label: 'Radius Circle' },
          ] as const).map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => setDraft((p) => ({ ...p, deliveryMode: mode.value }))}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                draft.deliveryMode === mode.value
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'
              }`}
            >
              <span className={`h-3 w-3 rounded-full ${draft.deliveryMode === mode.value ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
              {mode.label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="text-xs font-medium text-neutral-500">Search on map (area/city)</label>
          <input
            type="text"
            value={areaSearch}
            onChange={(e) => setAreaSearch(e.target.value)}
            placeholder="Search area and tap to add"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
          />
          {areaSearch && matchingAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {matchingAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  className={`rounded-full px-3 py-1 text-xs ${draft.deliveryAreas.includes(area) ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'}`}
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>

        {draft.deliveryMode === 'areas' ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {AREA_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleArea(a)}
                  className={`rounded-full px-3 py-1 text-xs ${draft.deliveryAreas.includes(a) ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'}`}
                >
                  {a}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={draft.customAreaName}
              onChange={(e) => setDraft((p) => ({ ...p, customAreaName: e.target.value }))}
              placeholder="Optional area name (e.g. Homagama)"
              className="mt-3 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </>
        ) : (
          <div className="mt-3">
            <label className="text-sm font-medium">Radius Circle ({draft.deliveryRadiusKm} km)</label>
            <input
              type="range"
              min={1}
              max={50}
              value={draft.deliveryRadiusKm}
              onChange={(e) => setDraft((p) => ({ ...p, deliveryRadiusKm: Number(e.target.value) }))}
              className="mt-2 w-full accent-neutral-900"
            />
          </div>
        )}

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setDraft((p) => ({ ...p, mapTouchActive: !p.mapTouchActive }))}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${draft.mapTouchActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}
          >
            {draft.mapTouchActive ? 'Map touch select ACTIVE' : 'Activate map touch select'}
          </button>
          <p className="mt-1 text-xs text-neutral-500">When active, tap/drag marker on map to set delivery center.</p>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl">
          <DeliveryMap
            initialLat={draft.lat}
            initialLng={draft.lng}
            draggable={draft.mapTouchActive}
            onLocationChange={(lat, lng) => setDraft((p) => ({ ...p, lat, lng }))}
            height="h-52"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={saveDraft}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
        >
          Save Update
        </button>
        <button
          onClick={cancelEditor}
          className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0)
  const totalValue = products.reduce((sum, p) => sum + p.totalValue, 0)

  return (
    <ProtectedRoute roles={['SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Manage Products</h1>
            <p className="mt-1 text-neutral-500">Inline editing, map-based delivery control, and richer product performance tiles.</p>
          </div>
          <button
            onClick={openNew}
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            + Add New Product
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">Total Products</p>
            <p className="mt-1 text-xl font-semibold">{products.length}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">Total Item Sales</p>
            <p className="mt-1 text-xl font-semibold">{totalSales}</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-xs text-neutral-500">Total Sales Value</p>
            <p className="mt-1 text-xl font-semibold">LKR {totalValue.toLocaleString()}</p>
          </div>
        </div>

        {activeEditorId === 'new' && renderEditor('Add New Product')}

        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex flex-wrap items-start gap-4">
                <div className="h-28 w-28 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">No Image</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xl font-semibold">{product.title}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {product.category} &middot; LKR {product.price.toLocaleString()} &middot; {product.weights.join(', ')}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Delivery: {product.deliveryMode === 'radius' ? `${product.deliveryRadiusKm} km radius circle` : product.deliveryAreas.join(', ')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(product)}
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                  >
                    Quick Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-5">
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"><p className="text-[11px] text-neutral-500">Item Sales</p><p className="mt-1 text-lg font-semibold">{product.salesCount}</p></div>
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"><p className="text-[11px] text-neutral-500">Ongoing Orders</p><p className="mt-1 text-lg font-semibold">{product.ongoingOrders}</p></div>
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"><p className="text-[11px] text-neutral-500">Sales Value</p><p className="mt-1 text-lg font-semibold">LKR {product.totalValue.toLocaleString()}</p></div>
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"><p className="text-[11px] text-neutral-500">Comments</p><p className="mt-1 text-lg font-semibold">{product.commentsCount}</p></div>
                <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800"><p className="text-[11px] text-neutral-500">Asks</p><p className="mt-1 text-lg font-semibold">{product.asksCount}</p></div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                  <p className="text-xs font-medium text-neutral-500">Latest Comment Preview</p>
                  <p className="mt-1 text-sm">{product.lastComment || 'No comments yet'}</p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                  <p className="text-xs font-medium text-neutral-500">Latest Ask Preview</p>
                  <p className="mt-1 text-sm">{product.lastAsk || 'No asks yet'}</p>
                </div>
              </div>

              {activeEditorId === product.id && renderEditor(`Edit: ${product.title}`)}
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  )
}
