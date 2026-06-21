import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
          root: __dirname,
    },
    reactStrictMode: false,
    images: {
          minimumCacheTTL: 2678400 * 6, // 3 months
          remotePatterns: [
            {
                      protocol: 'https',
                      hostname: 'images.pexels.com',
                      port: '',
                      pathname: '/**',
            },
            {
                      protocol: 'https',
                      hostname: 'images.unsplash.com',
                      port: '',
                      pathname: '/**',
            },
            {
                      protocol: 'https',
                      hostname: 'a0.muscache.com',
                      port: '',
                      pathname: '/**',
            },
            {
                      protocol: 'https',
                      hostname: 'www.gstatic.com',
                      port: '',
                      pathname: '/**',
            },
                ],
    },
    async rewrites() {
          return [
            {
                      source: '/supabase-api/:path*',
                      destination: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/:path*`,
            },
                ]
    },
}

export default nextConfig
