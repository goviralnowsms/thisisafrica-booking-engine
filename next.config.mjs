/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'book.thisisafrica.com.au',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  // Fix Jest worker issues in development
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RYzX3I7q377qvY08WDWHO5slz0a2Lua9lw8ibgNvAcAcmy1OFsiupYkjJSuiWEbubKcrXnx1xAsD3fVP8NPUTSm00isPspOLB',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_51RYzX3I7q377qvY0tV1r8zvaaFqc6VRpfJBSjKS8yLqwVncitScxUi03ZofSAdOpD4JsXuEQHc4apGKqj7cI6nBX00KKzvpGtZ',
  },
}

export default nextConfig
