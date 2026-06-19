'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { DeliveryMap } from '@/components/DeliveryMap'
import { Divider } from '@/shared/divider'
import { useRef, useState } from 'react'

/* ---------- Types ---------- */

interface ProductEntry {
  id: string
  title: string
  description: string
  category: string
  price: number
  image: string | null
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
  deliveryRadius: number
  shortBio: string
  showFields: {
    businessName: boolean
    ownerName: boolean
    phone: boolean
    address: boolean
    deliveryAreas: boolean
    whatsapp: boolean
  }
  products: ProductEntry[]
}

type ShowFieldKey = keyof VendorProfile['showFields']

const AREA_OPTIONS = [
  'Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05',
  'Colombo 06', 'Colombo 07', 'Colombo 08', 'Colombo 09', 'Colombo 10',
  'Athurugiriya', 'Malabe', 'Kaduwela', 'Battaramulla', 'Nugegoda',
  'Kiribathgoda', 'Kelaniya', 'Wattala', 'Rajanganaya', 'Galle',
  'Kandy', 'Negombo', 'Anuradhapura', 'Jaffna',
]

const CATEGORIES = ['Cakes', 'Cupcakes', 'Pastries', 'Savouries', 'Rice & Curry', 'Short Eats', 'Beverages', 'Desserts', 'Breads', 'Hoppers']

const LOGO_FALLBACK = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B35&color=fff&size=256&bold=true&format=png`

const DEFAULT_PROFILE: VendorProfile = {
  businessName: 'Nimru Cakes with Love',
  logo: LOGO_FALLBACK('Nimru'),
  ownerName: 'Nimru',
  ownerPhoto: 'https://ui-avatars.com/api/?name=Nimru&background=6B7280&color=fff&size=256&bold=true&format=png',
  email: 'baker@example.com',
  phone: '+94 71 234 5678',
  whatsapp: '+94 71 234 5678',
  whatsappAvailable: true,
  address: 'No. 123, Main Street, Athurugiriya',
  location: { lat: 6.9271, lng: 79.8612 },
  deliveryMethod: 'areas',
  deliveryAreas: ['Athurugiriya', 'Malabe', 'Kaduwela', 'Colombo 05'],
  deliveryRadius: 10,
  shortBio: 'Handcrafted cakes made with love since 2015. Specialising in wedding, birthday and custom design cakes.',
  showFields: {
    businessName: true,
    ownerName: true,
    phone: true,
    address: true,
    deliveryAreas: true,
    whatsapp: true,
  },
  products: [
    { id: 'p1', title: 'Classic Vanilla Wedding Cake', description: '3-tier elegant vanilla sponge with buttercream frosting', category: 'Cakes', price: 15000, image: null },
    { id: 'p2', title: 'Chocolate Fudge Birthday', description: 'Rich chocolate fudge with ganache drip', category: 'Cakes', price: 6800, image: null },
  ],
}

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile>(DEFAULT_PROFILE)
  const [activeTab, setActiveTab] = useState<'business' | 'products' | 'address'>('business')
  const [saved, setSaved] = useState(false)
  const [newProduct, setNewProduct] = useState<ProductEntry>({ id: '', title: '', description: '', category: 'Cakes', price: 0, image: null })
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const productImageRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleImageUpload = (ref: React.RefObject<HTMLInputElement | null>, key: 'logo' | 'ownerPhoto') => {
    const file = ref.current?.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setProfile((prev) => ({ ...prev, [key]: url }))
  }

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
    setNewProduct({ id: '', title: '', description: '', category: 'Cakes', price: 0, image: null })
    setEditingProductId(null)
  }

  const editProduct = (p: ProductEntry) => {
    setNewProduct({ ...p })
    setEditingProductId(p.id)
  }

  const deleteProduct = (id: string) => {
    if (confirm('Delete this product?')) {
      setProfile((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }))
    }
  }

  return (
    <ProtectedRoute roles={['SELLER', 'SUPER_ADMIN']}>
      <div className="container mt-20 mb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Profile Settings</h1>
            <p className="mt-1 text-neutral-500">Manage your vendor profile, products, and delivery details.</p>
          </div>
          <button onClick={handleSave} className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Tab Nav */}
        <div className="mt-6 flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-700 w-fit">
          {([
            { key: 'business', label: 'Business Info' },
            { key: 'products', label: 'Products & Media' },
            { key: 'address', label: 'Address & Delivery' },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`rounded-md px-5 py-2 text-sm font-medium transition-colors ${
              activeTab === t.key ? 'bg-white shadow-sm dark:bg-neutral-600' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}>{t.label}</button>
          ))}
        </div>

        <Divider className="my-8" />

        {/* ======== TAB: BUSINESS INFO ======== */}
        {activeTab === 'business' && (
          <div className="max-w-3xl space-y-8">
            {/* Logo + Business Name */}
            <section>
              <h2 className="text-lg font-semibold">Business Identity</h2>
              <p className="text-sm text-neutral-500">Upload your business logo and set your business name.</p>
              <div className="mt-4 flex items-center gap-6">
                <div className="relative shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-700">
                    <img src={profile.logo || LOGO_FALLBACK(profile.businessName)} alt="Logo" className="h-full w-full object-cover" />
                  </div>
                  <button onClick={() => logoInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900" title="Upload logo">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                  </button>
                  <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={() => handleImageUpload(logoInputRef, 'logo')} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Business Name</label>
                  <input type="text" value={profile.businessName} onChange={(e) => setProfile((p) => ({ ...p, businessName: e.target.value }))} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>
              </div>
            </section>

            <Divider />

            {/* Owner */}
            <section>
              <h2 className="text-lg font-semibold">Owner Information</h2>
              <p className="text-sm text-neutral-500">Your name and profile photo shown to customers.</p>
              <div className="mt-4 flex items-center gap-6">
                <div className="relative shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-neutral-200 dark:border-neutral-700">
                    <img src={profile.ownerPhoto || LOGO_FALLBACK(profile.ownerName)} alt="Owner" className="h-full w-full object-cover" />
                  </div>
                  <button onClick={() => photoInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900" title="Upload photo">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                  </button>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={() => handleImageUpload(photoInputRef, 'ownerPhoto')} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Owner Name</label>
                  <input type="text" value={profile.ownerName} onChange={(e) => setProfile((p) => ({ ...p, ownerName: e.target.value }))} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>
              </div>
            </section>

            <Divider />

            {/* Contact */}
            <section>
              <h2 className="text-lg font-semibold">Contact Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input type="text" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">WhatsApp Number</label>
                <div className="mt-1 flex items-center gap-3">
                  <input type="text" value={profile.whatsapp} onChange={(e) => setProfile((p) => ({ ...p, whatsapp: e.target.value }))} className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={profile.whatsappAvailable} onChange={() => setProfile((p) => ({ ...p, whatsappAvailable: !p.whatsappAvailable }))} className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                    Available on WhatsApp
                  </label>
                </div>
                {profile.whatsappAvailable && (
                  <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Customers can reach you via WhatsApp
                  </p>
                )}
              </div>
            </section>

            <Divider />

            {/* Short Bio */}
            <section>
              <h2 className="text-lg font-semibold">Short Bio</h2>
              <p className="text-sm text-neutral-500">Appears on your public vendor profile page.</p>
              <textarea value={profile.shortBio} onChange={(e) => setProfile((p) => ({ ...p, shortBio: e.target.value }))} rows={3} className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
            </section>

            <Divider />

            {/* Visible Fields */}
            <section>
              <h2 className="text-lg font-semibold">Visible Profile Fields</h2>
              <p className="text-sm text-neutral-500">Toggle which details are shown on your public profile.</p>
              <div className="mt-3 space-y-3">
                {([
                  { key: 'businessName' as ShowFieldKey, label: 'Business Name' },
                  { key: 'ownerName' as ShowFieldKey, label: 'Owner Name' },
                  { key: 'phone' as ShowFieldKey, label: 'Phone Number' },
                  { key: 'address' as ShowFieldKey, label: 'Address' },
                  { key: 'deliveryAreas' as ShowFieldKey, label: 'Delivery Areas' },
                  { key: 'whatsapp' as ShowFieldKey, label: 'WhatsApp Availability' },
                ]).map((f) => (
                  <label key={f.key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={profile.showFields[f.key]} onChange={() => toggleShowField(f.key)} className="h-5 w-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                    <span className="text-sm font-medium">{f.label}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======== TAB: PRODUCTS & MEDIA ======== */}
        {activeTab === 'products' && (
          <div className="max-w-3xl space-y-8">
            <section>
              <h2 className="text-lg font-semibold">Your Products</h2>
              <p className="text-sm text-neutral-500">Add product descriptions and photos.</p>

              {/* Product List */}
              <div className="mt-4 space-y-3">
                {profile.products.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      {p.image ? (
                        <img src={p.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-neutral-500">{p.category} &middot; LKR {p.price.toLocaleString()}</p>
                      {p.description && <p className="mt-0.5 text-xs text-neutral-400 truncate">{p.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editProduct(p)} className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Edit</button>
                      <button onClick={() => deleteProduct(p.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add / Edit Product Form */}
              <div className="mt-6 rounded-xl border border-dashed border-neutral-300 p-5 dark:border-neutral-600">
                <h3 className="text-sm font-semibold">{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium">Title</label>
                    <input type="text" value={newProduct.title} onChange={(e) => setNewProduct((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Chocolate Cake" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Category</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Price (LKR)</label>
                    <input type="number" value={newProduct.price || ''} onChange={(e) => setNewProduct((p) => ({ ...p, price: Number(e.target.value) }))} min={0} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Photo</label>
                    <input ref={productImageRef} type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setNewProduct((p) => ({ ...p, image: URL.createObjectURL(file) }))
                    }} className="mt-1 w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium hover:file:bg-neutral-200 dark:file:bg-neutral-700" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-medium">Description</label>
                  <textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Describe your product..." className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>
                {newProduct.image && (
                  <div className="mt-2">
                    <img src={newProduct.image} alt="Preview" className="h-20 w-20 rounded-lg object-cover" />
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <button onClick={addOrEditProduct} className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900">
                    {editingProductId ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProductId && (
                    <button onClick={() => { setNewProduct({ id: '', title: '', description: '', category: 'Cakes', price: 0, image: null }); setEditingProductId(null) }} className="rounded-lg border border-neutral-200 px-4 py-2 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======== TAB: ADDRESS & DELIVERY ======== */}
        {activeTab === 'address' && (
          <div className="max-w-3xl space-y-8">
            <section>
              <h2 className="text-lg font-semibold">Business Address</h2>
              <p className="text-sm text-neutral-500">Pin your location on the map. Customers use this to find you.</p>
              <div className="mt-4">
                <label className="text-sm font-medium">Address</label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500 dark:bg-neutral-800">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </span>
                  <input type="text" value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} placeholder="No. 123, Main Street, City" className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
                </div>
              </div>
              <div className="mt-4">
                <DeliveryMap
                  height="h-64"
                  onLocationChange={(lat, lng) => setProfile((p) => ({ ...p, location: { lat, lng } }))}
                />
                <p className="mt-1 text-xs text-neutral-400">Drag the pin to set your exact location. Lat: {profile.location.lat.toFixed(4)}, Lng: {profile.location.lng.toFixed(4)}</p>
              </div>
            </section>

            <Divider />

            {/* Delivery Settings */}
            <section>
              <h2 className="text-lg font-semibold">Delivery Settings</h2>
              <p className="text-sm text-neutral-500">Choose how you deliver and which areas you serve.</p>

              <div className="mt-4 flex items-center gap-4">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${profile.deliveryMethod === 'areas' ? 'border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-700'}`}>
                  <input type="radio" name="deliveryMethod" value="areas" checked={profile.deliveryMethod === 'areas'} onChange={() => setProfile((p) => ({ ...p, deliveryMethod: 'areas' }))} className="h-4 w-4 text-neutral-900 focus:ring-neutral-900" />
                  <div>
                    <p className="text-sm font-medium">Delivery Areas</p>
                    <p className="text-xs text-neutral-500">Select specific areas you can deliver to</p>
                  </div>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${profile.deliveryMethod === 'radius' ? 'border-neutral-900 bg-neutral-50 dark:border-neutral-100 dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-700'}`}>
                  <input type="radio" name="deliveryMethod" value="radius" checked={profile.deliveryMethod === 'radius'} onChange={() => setProfile((p) => ({ ...p, deliveryMethod: 'radius' }))} className="h-4 w-4 text-neutral-900 focus:ring-neutral-900" />
                  <div>
                    <p className="text-sm font-medium">Delivery Radius</p>
                    <p className="text-xs text-neutral-500">Deliver within a radius around you</p>
                  </div>
                </label>
              </div>

              {profile.deliveryMethod === 'areas' ? (
                <div className="mt-4">
                  <label className="text-sm font-medium">Select Delivery Areas</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {AREA_OPTIONS.map((area) => (
                      <button key={area} type="button" onClick={() => toggleDeliveryArea(area)} className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                        profile.deliveryAreas.includes(area)
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                          : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400'
                      }`}>{area}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <label className="text-sm font-medium">Delivery Radius (km)</label>
                  <div className="mt-2 flex items-center gap-4">
                    <input type="range" min={1} max={50} value={profile.deliveryRadius} onChange={(e) => setProfile((p) => ({ ...p, deliveryRadius: Number(e.target.value) }))} className="w-full max-w-xs accent-neutral-900" />
                    <span className="min-w-[3rem] text-sm font-semibold">{profile.deliveryRadius} km</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">Deliver within {profile.deliveryRadius} km of your pinned location.</p>
                </div>
              )}
            </section>

            <Divider />

            {/* Suggestions / Improvement */}
            <section>
              <h2 className="text-lg font-semibold">Suggestions &amp; Improvements</h2>
              <p className="text-sm text-neutral-500">Help us improve your vendor experience.</p>
              <textarea rows={4} placeholder="Share your feedback, feature requests, or suggestions..." className="mt-3 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-900" />
            </section>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
