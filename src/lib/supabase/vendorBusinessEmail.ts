import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'

export interface VendorBusinessEmailSettings {
  vendorId: string
  localPart: string
  domain: string
  forwardingEmail: string
  notificationsEnabled: boolean
}

export interface VendorBusinessEmailMessage {
  id: string
  vendorId: string
  sender: string
  subject: string
  preview: string
  receivedAt: string
  isRead: boolean
}

const mapSettingsFromDb = (row: any): VendorBusinessEmailSettings => ({
  vendorId: row.vendor_id,
  localPart: row.local_part,
  domain: row.domain,
  forwardingEmail: row.forwarding_email ?? '',
  notificationsEnabled: Boolean(row.notifications_enabled),
})

const mapSettingsToDb = (settings: VendorBusinessEmailSettings) => ({
  vendor_id: settings.vendorId,
  local_part: settings.localPart,
  domain: settings.domain,
  forwarding_email: settings.forwardingEmail,
  notifications_enabled: settings.notificationsEnabled,
})

const mapMessageFromDb = (row: any): VendorBusinessEmailMessage => ({
  id: row.id,
  vendorId: row.vendor_id,
  sender: row.sender,
  subject: row.subject,
  preview: row.preview,
  receivedAt: row.received_at,
  isRead: Boolean(row.is_read),
})

export async function fetchVendorBusinessEmailSettings(vendorId: string): Promise<VendorBusinessEmailSettings | null> {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('hl_vendor_business_email_accounts')
    .select('*')
    .eq('vendor_id', vendorId)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return mapSettingsFromDb(data)
}

export async function upsertVendorBusinessEmailSettings(settings: VendorBusinessEmailSettings): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase
    .from('hl_vendor_business_email_accounts')
    .upsert(mapSettingsToDb(settings), { onConflict: 'vendor_id' })
  if (error) throw error
}

export async function fetchVendorBusinessEmailInbox(vendorId: string): Promise<VendorBusinessEmailMessage[] | null> {
  if (!isSupabaseConfigured || !supabase) return null
  const { data, error } = await supabase
    .from('hl_vendor_business_email_messages')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('received_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return (data ?? []).map(mapMessageFromDb)
}

export async function markVendorBusinessEmailAsRead(messageId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return
  const { error } = await supabase
    .from('hl_vendor_business_email_messages')
    .update({ is_read: true })
    .eq('id', messageId)
  if (error) throw error
}
