import { createClient } from "@supabase/supabase-js"
import { neon } from "@neondatabase/serverless"
import { env } from "./env"

// Supabase client (singleton pattern)
let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  }
  return supabaseClient
}

// Server-side Supabase client with service role
export function getSupabaseServiceClient() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase service role configuration missing")
  }
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
}

// Neon database client
export function getNeonClient() {
  if (!env.NEON_NEON_DATABASE_URL) {
    throw new Error("Neon database URL not configured")
  }
  return neon(env.NEON_DATABASE_URL)
}

// Generic database query function
export async function executeQuery(query: string, params?: any[]) {
  try {
    // Try Neon first if available
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      return await sql(query, params)
    }

    // Fallback to Supabase
    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase.rpc("execute_sql", { query, params })
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  } catch (error) {
    console.error("Database query failed:", error)
    throw error
  }
}

// Health check for database connectivity
export async function checkDatabaseHealth() {
  try {
    // Test Neon connection
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      await sql`SELECT 1 as test`
      return { status: "healthy", provider: "neon" }
    }

    // Test Supabase connection
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      const supabase = getSupabaseClient()
      const { error } = await supabase!.from("health_check").select("*").limit(1)
      if (error && !error.message.includes("relation") && !error.message.includes("does not exist")) {
        throw error
      }
      return { status: "healthy", provider: "supabase" }
    }

    return { status: "warning", message: "No database configured" }
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Database schema types
export interface Booking {
  id: string
  booking_reference: string
  tour_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  tour_date: string
  adults: number
  children: number
  total_amount: number
  currency: string
  payment_status: "pending" | "paid" | "failed" | "refunded"
  booking_status: "confirmed" | "pending" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Tour {
  id: string
  tour_id: string
  name: string
  description: string
  duration: string
  price_adult: number
  price_child: number
  max_passengers: number
  location: string
  category: string
  available_dates: string[]
  images: string[]
  inclusions: string[]
  exclusions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

// Database operations
export const db = {
  // Bookings
  async createBooking(booking: Omit<Booking, "id" | "created_at" | "updated_at">) {
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      const result = await sql`
        INSERT INTO bookings (
          booking_reference, tour_id, customer_name, customer_email, customer_phone,
          tour_date, adults, children, total_amount, currency, payment_status, booking_status
        ) VALUES (
          ${booking.booking_reference}, ${booking.tour_id}, ${booking.customer_name}, 
          ${booking.customer_email}, ${booking.customer_phone}, ${booking.tour_date},
          ${booking.adults}, ${booking.children}, ${booking.total_amount}, ${booking.currency},
          ${booking.payment_status}, ${booking.booking_status}
        ) RETURNING *
      `
      return result[0]
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase.from("bookings").insert(booking).select().single()
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  },

  async getBooking(id: string) {
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      const result = await sql`SELECT * FROM bookings WHERE id = ${id}`
      return result[0] || null
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single()
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      const setClause = Object.keys(updates)
        .map((key) => `${key} = $${Object.keys(updates).indexOf(key) + 2}`)
        .join(", ")

      const values = [id, ...Object.values(updates)]
      const result = await sql(
        `
        UPDATE bookings 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
        values,
      )
      return result[0]
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  },

  // Tours
  async getTours() {
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      return await sql`SELECT * FROM tours WHERE is_active = true ORDER BY created_at DESC`
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  },

  async getTour(id: string) {
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      const result = await sql`SELECT * FROM tours WHERE id = ${id} AND is_active = true`
      return result[0] || null
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase.from("tours").select("*").eq("id", id).eq("is_active", true).single()
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  },

  // Get bookings that need payment reminders (2 weeks before tour date)
  async getBookingsNeedingPaymentReminders(startDate: string, endDate: string) {
    if (env.NEON_DATABASE_URL) {
      const sql = getNeonClient()
      const result = await sql`
        SELECT * FROM bookings 
        WHERE tour_date BETWEEN ${startDate} AND ${endDate}
        AND payment_status = 'pending'
        AND booking_status = 'confirmed'
        ORDER BY tour_date ASC
      `
      return result
    }

    const supabase = getSupabaseClient()
    if (supabase) {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("tour_date", startDate)
        .lte("tour_date", endDate)
        .eq("payment_status", "pending")
        .eq("booking_status", "confirmed")
        .order("tour_date", { ascending: true })
      if (error) throw error
      return data
    }

    throw new Error("No database connection available")
  },
}
