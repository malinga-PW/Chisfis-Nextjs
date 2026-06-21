import { getSupabaseClient } from '@/lib/supabase/client'

export interface ProductEntry {
  id: string
  title: string
  description: string
  category: string
  price: number
  images: string[]
}

export interface VendorProfile {
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

export async function fetchVendorProfile(vendorId: string): Promise<Partial<VendorProfile> | null> {
  const cl = getSupabaseClient()
  if (!cl) return null

  const { data, error } = await cl
    .from('hl_vendors')
    .select('*')
    .eq('id', vendorId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching vendor profile:', error)
    return null
  }

  if (!data) return null

  // Map from DB schema to frontend VendorProfile
  const profile: Partial<VendorProfile> = {
    businessName: data.business_name || '',
    ownerName: data.owner_name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    logo: data.logo_url || null,
    ownerPhoto: data.owner_photo_url || null,
    whatsapp: data.whatsapp_number || '',
    whatsappAvailable: data.whatsapp_available ?? true,
    location: { lat: data.lat || 6.9271, lng: data.lng || 79.8612 },
    deliveryMethod: data.delivery_mode || 'areas',
    deliveryAreas: data.delivery_areas || [],
    deliveryRadius: data.delivery_radius_km || 10,
    products: data.products || [],
  }

  // Parse extra fields from visibility JSON if they exist
  if (data.visibility) {
    profile.showFields = {
      businessName: data.visibility.businessName ?? true,
      ownerName: data.visibility.ownerName ?? true,
      phone: data.visibility.phone ?? true,
      address: data.visibility.address ?? true,
      deliveryAreas: data.visibility.deliveryAreas ?? true,
      whatsapp: data.visibility.whatsapp ?? true,
      website: data.visibility.website ?? false,
      socialMedia: data.visibility.socialMedia ?? false,
    }
    profile.shortBio = data.visibility.shortBio || ''
    profile.website = data.visibility.websiteUrl || ''
    profile.instagram = data.visibility.instagram || ''
    profile.facebook = data.visibility.facebook || ''
    profile.locationAreaName = data.visibility.locationAreaName || ''
    profile.temporarilyUnavailable = data.visibility.temporarilyUnavailable || false
    profile.showPhoneWhenUnavailable = data.visibility.showPhoneWhenUnavailable ?? true
  }

  return profile
}

export async function upsertVendorProfile(vendorId: string, profile: VendorProfile): Promise<void> {
  const cl = getSupabaseClient()
  if (!cl) return

  const visibilityData = {
    businessName: profile.showFields.businessName,
    ownerName: profile.showFields.ownerName,
    phone: profile.showFields.phone,
    address: profile.showFields.address,
    deliveryAreas: profile.showFields.deliveryAreas,
    whatsapp: profile.showFields.whatsapp,
    website: profile.showFields.website,
    socialMedia: profile.showFields.socialMedia,
    // Store extra profile fields here since they aren't strictly typed in the vendors table
    shortBio: profile.shortBio,
    websiteUrl: profile.website,
    instagram: profile.instagram,
    facebook: profile.facebook,
    locationAreaName: profile.locationAreaName,
    temporarilyUnavailable: profile.temporarilyUnavailable,
    showPhoneWhenUnavailable: profile.showPhoneWhenUnavailable,
  }

  const payload = {
    id: vendorId,
    business_name: profile.businessName,
    owner_name: profile.ownerName,
    email: profile.email,
    location: profile.locationAreaName || 'Colombo',
    phone: profile.phone,
    logo_url: profile.logo || '',
    owner_photo_url: profile.ownerPhoto || '',
    whatsapp_number: profile.whatsapp,
    whatsapp_available: profile.whatsappAvailable,
    address: profile.address,
    lat: profile.location.lat,
    lng: profile.location.lng,
    delivery_mode: profile.deliveryMethod,
    delivery_areas: profile.deliveryAreas,
    delivery_radius_km: profile.deliveryRadius,
    visibility: visibilityData,
    products: profile.products,
    status: 'Approved', // Defaulting to Approved for now
  }

  const { error } = await cl
    .from('hl_vendors')
    .upsert(payload, { onConflict: 'id' })

  if (error) {
    console.error('Error saving vendor profile:', error)
    throw error
  }
}
