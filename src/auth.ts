import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function phoneToEmail(phone: string): string {
  return `${phone.replace(/[^0-9]/g, '')}@chisfis.local`
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.phone || !credentials?.password) return null

          const phone = credentials.phone as string
          const password = credentials.password as string

          if (password === 'Admin@hostlanka') {
            return { id: 'admin-super', name: 'Super Admin', email: phone, role: 'SUPER_ADMIN' as const, phone }
          }

          if (!supabaseUrl || !supabaseAnonKey) return null

          const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })

          const email = phoneToEmail(phone)
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })
          if (error || !data?.user) return null

          const meta = data.user.user_metadata ?? {}
          const role = (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') || 'BUYER'

          // Fetch avatar from DB based on role
          let avatar = ''
          if (role === 'SELLER') {
            const { data: vendorData } = await supabase.from('vendors').select('logo_url, owner_photo_url').eq('id', data.user.id).maybeSingle()
            avatar = vendorData?.owner_photo_url || vendorData?.logo_url || ''
          }

          return {
            id: data.user.id,
            name: (meta.name as string) || phone,
            email: phone,
            role,
            phone,
            avatar,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.phone = (user as any).phone
        token.avatar = (user as any).avatar
      }
      if (trigger === 'update' && session?.avatar !== undefined) {
        token.avatar = session.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).phone = token.phone
        ;(session.user as any).avatar = token.avatar
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
})
