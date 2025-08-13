/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix Jest worker issues in development
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig
