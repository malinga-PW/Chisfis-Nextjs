'use client'

import { DeliveryMap } from '@/components/DeliveryMap'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Divider } from '@/shared/divider'
import { useState } from 'react'

interface CakeProduct {
  id: string
  title: string
  category: string
  price: number
  weights: string[]
  deliveryAreas: string[]
  deliveryMode: 'areas' | 'radius'
  deliveryRadiusKm: number
  customAreaName: string
  lat: number
  lng: number
  image: string
}

const INITIAL_PRODUCTS: CakeProduct[] = [
  { id: 'p1', title: 'Classic Vanilla Wedding Cake', category: 'Wedding', price: 15000, weights: ['3kg', '5kg'], deliveryAreas: ['Colombo', 'Kandy'], deliveryMode: 'areas', deliveryRadiusKm: 12, customAreaName: '', lat: 6.9271, lng: 79.8612, image: '' },
  { id: 'p2', title: 'Chocolate Fudge Birthday Cake', category: 'Birthday', price: 6800, weights: ['1kg', '2kg', '3kg'], deliveryAreas: ['Colombo', 'Nugegoda'], deliveryMode: 'radius', deliveryRadiusKm: 15, customAreaName: '', lat: 6.9000, lng: 79.9500, image: '' },
  { id: 'p3', title: 'Red Velvet Anniversary Cake', category: 'Anniversary', price: 8500, weights: ['2kg', '3kg'], deliveryAreas: ['Colombo', 'Galle'], deliveryMode: 'areas', deliveryRadiusKm: 10, customAreaName: '', lat: 6.8800, lng: 79.9100, image: '' },
  { id: 'p4', title: 'Cupcake Box (12 pcs)', category: 'Cupcakes', price: 2800, weights: ['1kg'], deliveryAreas: ['Colombo', 'Kandy', 'Galle'], deliveryMode: 'areas', deliveryRadiusKm: 8, customAreaName: '', lat: 6.9400, lng: 79.8700, image: '' },
]

const CATEGORIES = ['Birthday', 'Wedding', 'Anniversary', 'Corporate', 'Custom Design', 'Cupcakes']
const WEIGHT_OPTIONS = ['500g', '1kg', '2kg', '3kg', '5kg']
const AREA_OPTIONS = ['Colombo', 'Kandy', 'Galle', 'Nugegoda', 'Negombo', 'Jaffna', 'Batticaloa']

type ProductForm = Omit<CakeProduct, 'id'>

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
  image: '',
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<CakeProduct[]>(INITIAL_PRODUCTS)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setImagePreview(null)
    setShowForm(false)
  }

  const openEdit = (product: CakeProduct) => {
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      weights: [...product.weights],
      deliveryAreas: [...product.deliveryAreas],
      deliveryMode: product.deliveryMode,
      deliveryRadiusKm: product.deliveryRadiusKm,
      customAreaName: product.customAreaName,
      lat: product.lat,
      lng: product.lng,
      image: product.image,
    })
    setEditingId(product.id)
    setImagePreview(product.image || null)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.title || form.price <= 0) return

    const normalizedAreas = form.customAreaName.trim()
      ? Array.from(new Set([...form.deliveryAreas, form.customAreaName.trim()]))
      : form.deliveryAreas

    const nextForm = { ...form, deliveryAreas: normalizedAreas }

    if (editingId) {
      setProducts((prev) => prev.map((p) => p.id === editingId ? { ...p, ...nextForm } : p))
    } else {
      setProducts((prev) => [...prev, { ...nextForm, id: `p${Date.now()}` }])
    }
    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const toggleWeight = (w: string) => {
    setForm((prev) => ({
      ...prev,
      weights: prev.weights.includes(w) ? prev.weights.filter((x) => x !== w) : [...prev.weights, w],
    }))
  }

  const toggleArea = (a: string) => {
    setForm((prev) => ({
      ...prev,
      deliveryAreas: prev.deliveryAreas.includes(a) ? prev.deliveryAreas.filter((x) => x !== a) : [...prev.deliveryAreas, a],
    }))
  }

  return (
    <ProtectedRoute roles={['SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Manage Products</h1>
            <p className="mt-1 text-neutral-500">Add, edit, or remove your cake listings.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
          >
            + Add New Cake
          </button>
        </div>

        {/* Product List */}
        <div className="mt-8 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{product.title}</p>
                <p className="text-sm text-neutral-500">{product.category} &middot; LKR {product.price.toLocaleString()} &middot; {product.weights.join(', ')}</p>
                <p className="text-xs text-neutral-400">
                  Delivery: {product.deliveryMode === 'radius' ? `${product.deliveryRadiusKm} km radius` : product.deliveryAreas.join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(product)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl dark:bg-neutral-800">
              <h3 className="text-xl font-semibold">{editingId ? 'Edit Cake' : 'Add New Cake'}</h3>
              <p className="mt-1 text-sm text-neutral-500">Fill in the details below.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium">Cake Title <span className="text-red-500">*</span></label>
                  <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Classic Vanilla Wedding Cake" className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>

                <div>
                  <label className="text-sm font-medium">Category <span className="text-red-500">*</span></label>
                  <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Price (LKR) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.price || ''} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} placeholder="e.g. 15000" min={0} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>

                <div>
                  <label className="text-sm font-medium">Available Weights</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {WEIGHT_OPTIONS.map((w) => (
                      <button key={w} type="button" onClick={() => toggleWeight(w)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${form.weights.includes(w) ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400'}`}>{w}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Location Mode</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, deliveryMode: 'areas' }))}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${form.deliveryMode === 'areas' ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900' : 'border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'}`}
                    >
                      <span className={`h-3 w-3 rounded-full ${form.deliveryMode === 'areas' ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                      Area by name
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, deliveryMode: 'radius' }))}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${form.deliveryMode === 'radius' ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900' : 'border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400'}`}
                    >
                      <span className={`h-3 w-3 rounded-full ${form.deliveryMode === 'radius' ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-300 dark:bg-neutral-600'}`} />
                      Radius circle
                    </button>
                  </div>
                </div>

                {form.deliveryMode === 'areas' ? (
                  <div>
                    <label className="text-sm font-medium">Delivery Areas</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {AREA_OPTIONS.map((a) => (
                        <button key={a} type="button" onClick={() => toggleArea(a)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${form.deliveryAreas.includes(a) ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400'}`}>{a}</button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={form.customAreaName}
                      onChange={(e) => setForm((p) => ({ ...p, customAreaName: e.target.value }))}
                      placeholder="Optional area name (e.g. Homagama)"
                      className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium">Delivery Radius ({form.deliveryRadiusKm} km)</label>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={form.deliveryRadiusKm}
                      onChange={(e) => setForm((p) => ({ ...p, deliveryRadiusKm: Number(e.target.value) }))}
                      className="mt-2 w-full accent-neutral-900"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Map Preview</label>
                  <div className="mt-2 overflow-hidden rounded-xl">
                    <DeliveryMap
                      initialLat={form.lat}
                      initialLng={form.lng}
                      onLocationChange={(latitude, longitude) => setForm((p) => ({ ...p, lat: latitude, lng: longitude }))}
                      height="h-48"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setImagePreview(URL.createObjectURL(file))
                      setForm((p) => ({ ...p, image: file.name }))
                    }
                  }} className="mt-1 w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-neutral-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-neutral-200 dark:file:bg-neutral-700" />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-32 rounded-xl object-cover" />}
                </div>
              </div>

              <Divider className="my-6" />

              <div className="flex gap-3">
                <button onClick={resetForm} className="flex-1 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancel</button>
                <button onClick={handleSave} className="flex-1 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">{editingId ? 'Save Changes' : 'Add Product'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
