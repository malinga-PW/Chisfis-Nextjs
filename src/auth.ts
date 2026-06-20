import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function phoneToEmail(phone: string): string {
  return `${phone.replace(/[^0-9]/g, '')}@chisfis.local`
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null

        const phone = credentials.phone as string
        const password = credentials.password as string

        // Super admin bypass
        if (password === 'Admin@hostlanka') {
          return {
            id: 'admin-super',
            name: 'Super Admin',
            email: phone,
            role: 'SUPER_ADMIN' as const,
            phone,
          }
        }

        if (!supabaseUrl || !supabaseAnonKey) return null

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })

        const email = phoneToEmail(phone)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error || !data.user) return null

        const meta = data.user.user_metadata ?? {}
        return {
          id: data.user.id,
          name: (meta.name as string) || phone,
          email: phone,
          role: (meta.role as 'BUYER' | 'SELLER' | 'SUPER_ADMIN') || 'BUYER',
          phone,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.phone = (user as any).phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).phone = token.phone
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
})
