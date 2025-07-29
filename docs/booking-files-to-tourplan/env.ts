import { z } from "zod"

const envSchema = z.object({
  // Database - Supabase
  SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Database - Neon
  NEON_NEON_DATABASE_URL: z.string().url().optional(),

  // Tourplan API
  TOURPLAN_API_URL: z.string().url().optional(),
  TOURPLAN_USERNAME: z.string().optional(),
  TOURPLAN_PASSWORD: z.string().optional(),
  TOURPLAN_AGENT_ID: z.string().optional(),
  TOURPLAN_PROXY_URL: z.string().url().optional(),
  USE_TOURPLAN_PROXY: z.string().optional(),

  // App URLs
  APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Payment providers
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Email - Resend
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Email - SMTP
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error("Environment validation failed:", error)
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join(".")).join(", ")
      throw new Error(`Missing or invalid environment variables: ${missingVars}`)
    }
    throw new Error("Invalid environment configuration")
  }
}

// Export individual environment variables for convenience
export const env = {
  // Database - Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Database - Neon
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL,

  // Tourplan API
  TOURPLAN_API_URL: process.env.TOURPLAN_API_URL,
  TOURPLAN_USERNAME: process.env.TOURPLAN_USERNAME,
  TOURPLAN_PASSWORD: process.env.TOURPLAN_PASSWORD,
  TOURPLAN_AGENT_ID: process.env.TOURPLAN_AGENT_ID,
  TOURPLAN_PROXY_URL: process.env.TOURPLAN_PROXY_URL,
  USE_TOURPLAN_PROXY: process.env.USE_TOURPLAN_PROXY === "true",

  // App URLs
  APP_URL: process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  // Payment
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
}

// Validation helper for required variables
export function validateRequiredEnv(requiredVars: string[]) {
  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Get environment info for debugging
export function getEnvInfo() {
  return {
    nodeEnv: env.NODE_ENV,
    hasDatabase: !!(env.SUPABASE_URL || env.NEON_DATABASE_URL),
    hasTourplan: !!(env.TOURPLAN_API_URL && env.TOURPLAN_USERNAME),
    hasStripe: !!env.STRIPE_SECRET_KEY,
    hasEmail: !!(env.RESEND_API_KEY || env.EMAIL_HOST),
    timestamp: new Date().toISOString(),
  }
}
