/**
 * TourPlan API Integration
 *
 * This file contains the functions to interact with the TourPlan API
 * for booking and managing tours, accommodations, and activities.
 */

// Types for TourPlan API
export interface TourPlanBooking {
  id: string
  reference: string
  status: "pending" | "confirmed" | "cancelled"
  customer: TourPlanCustomer
  itinerary: TourPlanItinerary
  payment: TourPlanPayment
  createdAt: string
  updatedAt: string
}

export interface TourPlanCustomer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  nationality: string
  passportNumber?: string
  passportExpiry?: string
}

export interface TourPlanItinerary {
  id: string
  name: string
  startDate: string
  endDate: string
  destinations: string[]
  activities: TourPlanActivity[]
  accommodations: TourPlanAccommodation[]
  transfers: TourPlanTransfer[]
}

export interface TourPlanActivity {
  id: string
  name: string
  description: string
  date: string
  duration: number
  location: string
  price: number
}

export interface TourPlanAccommodation {
  id: string
  name: string
  checkIn: string
  checkOut: string
  roomType: string
  mealPlan: string
  location: string
  price: number
}

export interface TourPlanTransfer {
  id: string
  type: "airport" | "intercity" | "local"
  date: string
  from: string
  to: string
  price: number
}

export interface TourPlanPayment {
  total: number
  currency: string
  deposit: number
  depositPaid: boolean
  depositDueDate: string
  balance: number
  balancePaid: boolean
  balanceDueDate: string
}

// ──────────────────────────────────────────────────────────
//  TOKEN CACHE
// ──────────────────────────────────────────
type TokenCache = { token: string; expiresAt: number } | null
let tokenCache: TokenCache = null
const TOKEN_TTL_MS = 25 * 60 * 1000 // refresh after 25 min (Tourplan tokens last 30 min)

// TourPlan API Configuration
const TOURPLAN_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_TOURPLAN_API_URL || "https://api.tourplan.com/v1",
  apiKey: process.env.TOURPLAN_API_KEY || "",
  agentId: process.env.TOURPLAN_AGENT_ID || "",
  username: process.env.TOURPLAN_USERNAME || "",
  password: process.env.TOURPLAN_PASSWORD || "",
}

// Customisable endpoint paths – override in env if your Tourplan instance differs
const ENDPOINTS = {
  searchTours: process.env.TOURPLAN_SEARCH_TOURS_PATH ?? "/products/search",
  tourDetails: process.env.TOURPLAN_TOUR_DETAILS_PATH ?? "/products", // will append /:id
  searchAccom: process.env.TOURPLAN_SEARCH_ACCOM_PATH ?? "/accommodations/search",
}

const join = (base: string, path: string) => `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`

// Image mapping for tours (using our existing images)
const TOUR_IMAGE_MAP: Record<string, string> = {
  safari: "/images/safari-lion.png",
  "victoria-falls": "/images/victoria-falls.png",
  luxury: "/images/luxury-accommodation.png",
  rail: "/images/rail-journey.png",
  cruise: "/images/zambezi-queen.png",
  beach: "/images/luxury-resort-pool.png",
  default: "/images/lion.png",
}

// Helper function to get appropriate image for a tour
function getTourImage(tourName: string, description: string): string {
  const name = tourName.toLowerCase()
  const desc = description.toLowerCase()

  if (name.includes("safari") || desc.includes("safari")) return TOUR_IMAGE_MAP.safari
  if (name.includes("victoria falls") || desc.includes("victoria falls")) return TOUR_IMAGE_MAP["victoria-falls"]
  if (name.includes("luxury") || desc.includes("luxury")) return TOUR_IMAGE_MAP.luxury
  if (name.includes("rail") || name.includes("train") || desc.includes("rail")) return TOUR_IMAGE_MAP.rail
  if (name.includes("cruise") || name.includes("river") || desc.includes("cruise")) return TOUR_IMAGE_MAP.cruise
  if (name.includes("beach") || name.includes("zanzibar") || desc.includes("beach")) return TOUR_IMAGE_MAP.beach

  return TOUR_IMAGE_MAP.default
}

// API Functions

/**
 * Resolve an access token for Tourplan.
 *
 * Priority:
 *   1. Use TOURPLAN_ACCESS_TOKEN if it exists
 *   2. Cache
 *   3. Call the login endpoint   (path overridable with TOURPLAN_AUTH_PATH)
 */
async function authenticate(): Promise<string> {
  // 1️⃣ env-supplied token
  if (process.env.TOURPLAN_ACCESS_TOKEN) return process.env.TOURPLAN_ACCESS_TOKEN

  // 2️⃣ cached token
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token

  // 3️⃣ interactive login
  const { apiKey, agentId, username, password, baseUrl } = TOURPLAN_CONFIG

  if (!username || !password || !agentId) {
    throw new Error(
      "Tourplan credentials are missing. Set TOURPLAN_AGENT_ID, TOURPLAN_USERNAME and TOURPLAN_PASSWORD or provide TOURPLAN_ACCESS_TOKEN.",
    )
  }

  const loginPath = process.env.TOURPLAN_AUTH_PATH ?? "/auth/login"
  const url = `${baseUrl.replace(/\/$/, "")}${loginPath}`

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey && { "X-API-Key": apiKey }),
    },
    body: JSON.stringify({
      agent_id: agentId,
      username,
      password,
      grant_type: "password",
    }),
  })

  // Helpful diagnostics for 404 (wrong path / baseUrl)
  if (resp.status === 404) {
    const bodySnippet = (await resp.text().catch(() => "")).slice(0, 200)
    throw new Error(
      `Tourplan login path returned 404. Verify NEXT_PUBLIC_TOURPLAN_API_URL (${baseUrl}) and TOURPLAN_AUTH_PATH is correct. Response snippet: ${bodySnippet}...`,
    )
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => "")
    throw new Error(
      `Tourplan authentication failed (${resp.status} ${resp.statusText}). Response body: ${body || "N/A"}`,
    )
  }

  const data = await resp.json()
  const token = data.access_token || data.token

  if (!token) {
    throw new Error("Tourplan authentication succeeded but no access_token was returned.")
  }

  // Cache token
  tokenCache = { token, expiresAt: Date.now() + TOKEN_TTL_MS }
  return token
}

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint: string, options: RequestInit = {}, retry = true): Promise<any> {
  const token = await authenticate()

  const resp = await fetch(join(TOURPLAN_CONFIG.baseUrl, endpoint), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-API-Key": TOURPLAN_CONFIG.apiKey,
      ...options.headers,
    },
  })

  // If token expired – clear cache & retry once
  if (resp.status === 401 && retry) {
    tokenCache = null
    return apiRequest(endpoint, options, false)
  }

  if (resp.status === 404) {
    const snippet = await resp
      .text()
      .catch(() => "")
      .then((t) => t.slice(0, 200))
    throw new Error(`Tourplan API 404 at ${join(TOURPLAN_CONFIG.baseUrl, endpoint)}. Snippet: ${snippet || "N/A"}`)
  }

  if (!resp.ok) {
    const msg = await resp.text().catch(() => "")
    throw new Error(`Tourplan API ${endpoint} failed (${resp.status}). Body: ${msg || "N/A"}`)
  }

  return resp.json()
}

/**
 * Search for available tours based on criteria
 */
export async function searchTours(params: {
  destination?: string
  startDate?: string
  endDate?: string
  travelers?: number
}) {
  try {
    console.log("Searching tours with params:", params)

    // Build query parameters
    const queryParams = new URLSearchParams()
    if (params.destination) queryParams.append("destination", params.destination)
    if (params.startDate) queryParams.append("start_date", params.startDate)
    if (params.endDate) queryParams.append("end_date", params.endDate)
    if (params.travelers) queryParams.append("pax", params.travelers.toString())

    const data = await apiRequest(`${ENDPOINTS.searchTours}?${queryParams.toString()}`)

    // Transform TourPlan data to our format and add images
    const tours =
      data.products?.map((product: any) => ({
        id: product.product_id || product.id,
        name: product.product_name || product.name,
        destination: product.destination || product.location,
        duration: product.duration_days || product.duration || 1,
        price: product.price_from || product.base_price || 0,
        description: product.short_description || product.description || "",
        longDescription: product.long_description || product.description || "",
        image: getTourImage(product.product_name || "", product.description || ""),
        available: product.available !== false,
        highlights: product.highlights || [],
        itinerary: product.itinerary || [],
        includes: product.inclusions || [],
        excludes: product.exclusions || [],
        departureDates: product.departure_dates || [],
      })) || []

    return {
      success: true,
      data: tours,
    }
  } catch (error) {
    console.error("Error searching tours:", error)

    // Fallback to mock data if API fails
    return {
      success: true,
      data: [
        {
          id: "tour-001",
          name: "Luxury Safari Experience",
          destination: "Kenya & Tanzania",
          duration: 10,
          price: 3499,
          description:
            "Experience the ultimate African safari across Kenya and Tanzania's most iconic wildlife reserves.",
          image: TOUR_IMAGE_MAP.safari,
          available: true,
        },
        {
          id: "tour-002",
          name: "Victoria Falls Adventure",
          destination: "Zimbabwe & Zambia",
          duration: 7,
          price: 2899,
          description: "Discover the majestic Victoria Falls and enjoy thrilling activities on the Zambezi River.",
          image: TOUR_IMAGE_MAP["victoria-falls"],
          available: true,
        },
        {
          id: "tour-003",
          name: "Cape Town Explorer",
          destination: "South Africa",
          duration: 5,
          price: 1899,
          description: "Explore the beauty of Cape Town and the surrounding wine regions.",
          image: TOUR_IMAGE_MAP.default,
          available: true,
        },
      ],
    }
  }
}

/**
 * Get tour details by ID
 */
export async function getTourDetails(tourId: string) {
  try {
    console.log("Getting tour details for ID:", tourId)

    const data = await apiRequest(`${ENDPOINTS.tourDetails}/${tourId}`)

    // Transform TourPlan data to our format
    const tour = {
      id: data.product_id || data.id,
      name: data.product_name || data.name,
      destination: data.destination || data.location,
      duration: data.duration_days || data.duration || 1,
      price: data.price_from || data.base_price || 0,
      description: data.short_description || data.description || "",
      longDescription: data.long_description || data.description || "",
      image: getTourImage(data.product_name || "", data.description || ""),
      gallery: [getTourImage(data.product_name || "", data.description || "")],
      available: data.available !== false,
      highlights: data.highlights || [],
      itinerary: data.itinerary || [],
      includes: data.inclusions || [],
      excludes: data.exclusions || [],
      departureDates: data.departure_dates || [],
    }

    return {
      success: true,
      data: tour,
    }
  } catch (error) {
    console.error("Error getting tour details:", error)
    return {
      success: false,
      error: "Failed to get tour details",
    }
  }
}

/**
 * Search for available accommodations based on criteria
 */
export async function searchAccommodations(params: {
  location?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}) {
  try {
    console.log("Searching accommodations with params:", params)

    const queryParams = new URLSearchParams()
    if (params.location) queryParams.append("location", params.location)
    if (params.checkIn) queryParams.append("check_in", params.checkIn)
    if (params.checkOut) queryParams.append("check_out", params.checkOut)
    if (params.guests) queryParams.append("guests", params.guests.toString())

    const data = await apiRequest(`${ENDPOINTS.searchAccom}?${queryParams.toString()}`)

    // Transform TourPlan data to our format
    const accommodations =
      data.accommodations?.map((acc: any) => ({
        id: acc.accommodation_id || acc.id,
        name: acc.accommodation_name || acc.name,
        location: acc.location || acc.destination,
        roomTypes: acc.room_types || ["Standard"],
        pricePerNight: acc.price_per_night || acc.base_price || 0,
        available: acc.available !== false,
        image: getTourImage(acc.accommodation_name || "", acc.description || ""),
      })) || []

    return {
      success: true,
      data: accommodations,
    }
  } catch (error) {
    console.error("Error searching accommodations:", error)
    return {
      success: false,
      error: "Failed to search accommodations",
    }
  }
}

/**
 * Create a booking in TourPlan
 */
export async function createBooking(bookingData: {
  customer: Omit<TourPlanCustomer, "id">
  itinerary: {
    tourId?: string
    accommodationId?: string
    activityIds?: string[]
    startDate: string
    endDate: string
    travelers: number
  }
}) {
  try {
    console.log("Creating booking with data:", bookingData)

    const payload = {
      customer: bookingData.customer,
      product_id: bookingData.itinerary.tourId,
      accommodation_id: bookingData.itinerary.accommodationId,
      activity_ids: bookingData.itinerary.activityIds,
      start_date: bookingData.itinerary.startDate,
      end_date: bookingData.itinerary.endDate,
      pax: bookingData.itinerary.travelers,
    }

    const data = await apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    })

    return {
      success: true,
      data: {
        id: data.booking_id || data.id,
        reference: data.booking_reference || data.reference,
        status: data.status || "pending",
        customer: {
          id: data.customer?.customer_id || "generated-id",
          ...bookingData.customer,
        },
        itinerary: {
          id: data.itinerary?.itinerary_id || "generated-id",
          name: data.product_name || "Custom Itinerary",
          startDate: bookingData.itinerary.startDate,
          endDate: bookingData.itinerary.endDate,
          destinations: data.destinations || ["To be confirmed"],
          activities: data.activities || [],
          accommodations: data.accommodations || [],
          transfers: data.transfers || [],
        },
        payment: {
          total: data.total_price || 0,
          currency: data.currency || "USD",
          deposit: data.deposit_amount || 0,
          depositPaid: data.deposit_paid || false,
          depositDueDate: data.deposit_due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          balance: data.balance_amount || 0,
          balancePaid: data.balance_paid || false,
          balanceDueDate: data.balance_due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    return {
      success: false,
      error: "Failed to create booking",
    }
  }
}

/**
 * Get booking details by ID
 */
export async function getBooking(bookingId: string) {
  try {
    console.log("Getting booking details for ID:", bookingId)

    const data = await apiRequest(`/bookings/${bookingId}`)

    return {
      success: true,
      data: {
        id: data.booking_id || data.id,
        reference: data.booking_reference || data.reference,
        status: data.status || "confirmed",
        customer: {
          id: data.customer?.customer_id || "customer-id",
          firstName: data.customer?.first_name || "John",
          lastName: data.customer?.last_name || "Doe",
          email: data.customer?.email || "john.doe@example.com",
          phone: data.customer?.phone || "+1234567890",
          nationality: data.customer?.nationality || "Australian",
          passportNumber: data.customer?.passport_number,
          passportExpiry: data.customer?.passport_expiry,
        },
        itinerary: {
          id: data.itinerary?.itinerary_id || "itinerary-id",
          name: data.product_name || "Tour Package",
          startDate: data.start_date || "2025-06-15",
          endDate: data.end_date || "2025-06-25",
          destinations: data.destinations || ["Kenya", "Tanzania"],
          activities: data.activities || [],
          accommodations: data.accommodations || [],
          transfers: data.transfers || [],
        },
        payment: {
          total: data.total_price || 0,
          currency: data.currency || "USD",
          deposit: data.deposit_amount || 0,
          depositPaid: data.deposit_paid || false,
          depositDueDate: data.deposit_due_date || "2025-01-15",
          balance: data.balance_amount || 0,
          balancePaid: data.balance_paid || false,
          balanceDueDate: data.balance_due_date || "2025-05-15",
        },
        createdAt: data.created_at || "2025-01-10T12:34:56Z",
        updatedAt: data.updated_at || "2025-01-10T14:23:45Z",
      },
    }
  } catch (error) {
    console.error("Error getting booking:", error)
    return {
      success: false,
      error: "Failed to get booking details",
    }
  }
}

/**
 * Update an existing booking
 */
export async function updateBooking(bookingId: string, updateData: Partial<TourPlanBooking>) {
  try {
    console.log("Updating booking ID:", bookingId, "with data:", updateData)

    const data = await apiRequest(`/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    })

    return {
      success: true,
      data: {
        id: bookingId,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error updating booking:", error)
    return {
      success: false,
      error: "Failed to update booking",
    }
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string, reason: string) {
  try {
    console.log("Cancelling booking ID:", bookingId, "Reason:", reason)

    const data = await apiRequest(`/bookings/${bookingId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    })

    return {
      success: true,
      data: {
        id: bookingId,
        status: "cancelled",
        cancellationReason: reason,
        cancellationDate: new Date().toISOString(),
        refundAmount: data.refund_amount || 0,
        updatedAt: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return {
      success: false,
      error: "Failed to cancel booking",
    }
  }
}
