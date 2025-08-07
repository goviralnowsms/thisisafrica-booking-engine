// ──────────────────────────────────────────────────────────────────────────
// NOTE: When third-party libraries that are only used on the server side
// (e.g. “resend”) internally require Node core modules like `fs`, Webpack
// will still try to bundle them for the client unless we tell it not to.
//
// Stubbing those modules out (setting them to false) prevents:
// “Module not found: Can't resolve 'fs'”
// ──────────────────────────────────────────────────────────────────────────
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: { serverComponentsExternalPackages: ['xml2js'] },
  webpack(config, { isServer }) {
    // Only add fallbacks for client bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }
    return config
  },
}

export default nextConfig
