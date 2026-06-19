import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

export interface VendorProductRecord {
  id: string
  title: string
  description: string
  category: string
  price: number
  media: string | null
}

export interface VendorVisibilityRecord {
  ownerName: boolean
  phone: boolean
  address: boolean
  deliveryInfo: boolean
  whatsapp: boolean
}

export interface VendorRecord {
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
  visibility: VendorVisibilityRecord
  products: VendorProductRecord[]
  improvementNotes: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submitted: string
}

export interface BuyerRecord {
  id: string
  name: string
  email: string
  phone: string
  orders: number
  joined: string
}

const DEFAULT_VISIBILITY: VendorVisibilityRecord = {
  ownerName: true,
  phone: true,
  address: true,
  deliveryInfo: true,
  whatsapp: true,
}

const mapVendorFromDb = (row: any): VendorRecord => ({
  id: row.id,
  businessName: row.business_name,
  owner: row.owner_name,
  email: row.email,
  location: row.location,
  phone: row.phone,
  logo: row.logo_url,
  ownerPhoto: row.owner_photo_url,
  whatsappNumber: row.whatsapp_number,
  whatsappAvailable: Boolean(row.whatsapp_available),
  address: row.address,
  lat: Number(row.lat ?? 6.9271),
  lng: Number(row.lng ?? 79.8612),
  deliveryMode: row.delivery_mode === 'radius' ? 'radius' : 'areas',
  deliveryAreas: Array.isArray(row.delivery_areas) ? row.delivery_areas : [],
  deliveryRadiusKm: Number(row.delivery_radius_km ?? 10),
  visibility: row.visibility && typeof row.visibility === 'object' ? row.visibility : DEFAULT_VISIBILITY,
  products: Array.isArray(row.products) ? row.products : [],
  improvementNotes: row.improvement_notes ?? '',
  status: row.status,
  submitted: String(row.submitted_at ?? '').slice(0, 10),
})

const mapVendorToDb = (vendor: VendorRecord) => ({
  id: vendor.id,
  business_name: vendor.businessName,
  owner_name: vendor.owner,
  email: vendor.email,
  location: vendor.location,
  phone: vendor.phone,
  logo_url: vendor.logo,
  owner_photo_url: vendor.ownerPhoto,
  whatsapp_number: vendor.whatsappNumber,
  whatsapp_available: vendor.whatsappAvailable,
  address: vendor.address,
  lat: vendor.lat,
  lng: vendor.lng,
  delivery_mode: vendor.deliveryMode,
  delivery_areas: vendor.deliveryAreas,
  delivery_radius_km: vendor.deliveryRadiusKm,
  visibility: vendor.visibility,
  products: vendor.products,
  improvement_notes: vendor.improvementNotes,
  status: vendor.status,
  submitted_at: vendor.submitted,
})

const mapBuyerFromDb = (row: any): BuyerRecord => ({
  id: row.id,
  name: row.full_name,
  email: row.email,
  phone: row.phone,
  orders: Number(row.orders_count ?? 0),
  joined: String(row.joined_at ?? '').slice(0, 10),
})

const mapBuyerToDb = (buyer: BuyerRecord) => ({
  id: buyer.id,
  full_name: buyer.name,
  email: buyer.email,
  phone: buyer.phone,
  orders_count: buyer.orders,
  joined_at: buyer.joined,
})

export async function fetchVendorsFromSupabase(): Promise<VendorRecord[] | null> {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase.from('vendors').select('*').order('submitted_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapVendorFromDb)
}

export async function fetchBuyersFromSupabase(): Promise<BuyerRecord[] | null> {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase.from('buyers').select('*').order('joined_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapBuyerFromDb)
}

export async function upsertVendorToSupabase(vendor: VendorRecord): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('vendors').upsert(mapVendorToDb(vendor), { onConflict: 'id' })
  if (error) throw error
}

export async function updateVendorStatusInSupabase(
  id: string,
  status: 'Approved' | 'Rejected',
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('vendors').update({ status }).eq('id', id)
  if (error) throw error
}

export async function upsertBuyerToSupabase(buyer: BuyerRecord): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase.from('buyers').upsert(mapBuyerToDb(buyer), { onConflict: 'id' })
  if (error) throw error
}
