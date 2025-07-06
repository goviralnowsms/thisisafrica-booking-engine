import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  const envStatus = {
    // Tourplan API
    tourplan_api_url: process.env.TOURPLAN_API_URL ? "✅ Set" : "❌ Missing",
    tourplan_username: process.env.TOURPLAN_USERNAME ? "✅ Set" : "❌ Missing",
    tourplan_password: process.env.TOURPLAN_PASSWORD ? "✅ Set" : "❌ Missing",
    tourplan_agent_id: process.env.TOURPLAN_AGENT_ID ? "✅ Set" : "❌ Missing",
    tourplan_proxy_url: process.env.TOURPLAN_PROXY_URL ? "✅ Set" : "❌ Missing",
    use_tourplan_proxy: process.env.USE_TOURPLAN_PROXY ? "✅ Set" : "❌ Missing",

    // App URLs
    app_url: process.env.APP_URL ? "✅ Set" : "❌ Missing",
    next_public_app_url: process.env.NEXT_PUBLIC_APP_URL ? "✅ Set" : "❌ Missing",

    // Database
    neon_postgres_url: process.env.NEON_POSTGRES_URL ? "✅ Set" : "❌ Missing",
    database_url: process.env.NEON_DATABASE_URL ? "✅ Set" : "❌ Missing",

    // Email
    resend_api_key: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",

    // Stripe
    stripe_secret_key: process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing",
    next_public_stripe_publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing",

    // Supabase
    supabase_url: process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing",
    supabase_anon_key: process.env.SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
  }

  return NextResponse.json({
    message: "Environment Variables Status",
    environment: envStatus,
    timestamp: new Date().toISOString(),
  })
}
