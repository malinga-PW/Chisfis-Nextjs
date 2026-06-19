import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/theme-provider'
import { DirectionProvider } from '@/components/ui/direction'
import { NotificationProvider } from '@/contexts/NotificationContext'
import FloatingActions from '@/components/FloatingActions'
import { cn } from '@/lib/utils'
import '@/styles/tailwind.css'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import 'rc-slider/assets/index.css'
import CustomizeControl from './customize-control'

const poppins = Poppins({ subsets: ['latin'], variable: '--font-sans', weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: {
    template: '%s - Nimru',
    default: 'Nimru - Local Food Marketplace',
  },
  description: 'Discover and order fresh homemade food from local vendors near you. Multi-vendor food marketplace.',
  keywords: ['Food Marketplace', 'Local Food', 'Homemade Food', 'Food Delivery', 'Sri Lanka', 'Order Food Online'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={process.env.NEXT_PUBLIC_THEME_DIR === 'rtl' ? 'ar' : 'en'}
      dir={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
      suppressHydrationWarning
      className={cn('font-sans', poppins.variable)}
    >
      <body className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <DirectionProvider
            dir={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
            direction={process.env.NEXT_PUBLIC_THEME_DIR || 'ltr'}
          >
            <AuthProvider>
            <NotificationProvider>
            <div>
              {children}
              <FloatingActions />
              <SpeedInsights />

              {/* For Chisfis's demo  -- you can remove it  */}
              <CustomizeControl />
            </div>
            </NotificationProvider>
            </AuthProvider>
          </DirectionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
