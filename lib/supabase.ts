// Supabase temporarily disabled - using TourPlan direct booking only
console.log('⚠️ Supabase disabled - using TourPlan direct booking only')

// Stub client to prevent import errors
export const supabase = null

export const supabaseAdmin = null

// Database types
export interface BookingRecord {
  id?: string
  created_at?: string
  updated_at?: string
  
  // TourPlan Integration
  tourplan_booking_id?: string
  tourplan_reference?: string
  product_code: string
  
  // Tour Details
  tour_name: string
  departure_date: string
  adults: number
  children: number
  total_travelers: number
  
  // Pricing
  base_price: number
  children_price: number
  accommodation_cost: number
  activities_cost: number
  subtotal: number
  taxes: number
  total_price: number
  deposit_amount: number
  final_payment_amount: number
  currency: string
  
  // Lead Traveler (Contact)
  lead_traveler_first_name: string
  lead_traveler_last_name: string
  lead_traveler_email: string
  lead_traveler_phone: string
  lead_traveler_nationality?: string
  lead_traveler_passport?: string
  lead_traveler_dietary_requirements?: string
  
  // Billing Address
  billing_address: string
  billing_city: string
  billing_postal_code: string
  billing_country: string
  
  // Other Travelers (JSON array)
  other_travelers?: Array<{
    firstName: string
    lastName: string
    email?: string
    phone?: string
    nationality?: string
    passport?: string
    isChild?: boolean
    age?: number
    dateOfBirth?: string
  }>
  
  // Tour Options
  accommodation_type: string
  selected_activities?: string[]
  special_requests?: string
  
  // Booking Status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  booking_type: 'quote' | 'booking'
  requires_manual_confirmation: boolean
  
  // Payment Information
  payment_status: 'pending' | 'deposit_paid' | 'paid_in_full' | 'refunded'
  stripe_payment_intent_id?: string
  deposit_paid_at?: string
  final_payment_due_date?: string
  
  // Metadata
  booking_source: string // 'website', 'phone', 'email'
  user_agent?: string
  ip_address?: string
}

/**
 * Stub function - Create a new booking record in Supabase
 */
export async function createBookingRecord(bookingData: Omit<BookingRecord, 'id' | 'created_at' | 'updated_at'>): Promise<BookingRecord> {
  console.log('📝 Supabase disabled - skipping booking record creation')
  return { 
    ...bookingData,
    id: 'stub-' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

/**
 * Stub function - Update a booking record with TourPlan information
 */
export async function updateBookingWithTourPlan(
  bookingId: string, 
  tourplanData: { 
    tourplan_booking_id: string
    tourplan_reference: string
    status?: string
  }
): Promise<BookingRecord> {
  console.log('📝 Supabase disabled - skipping booking update')
  return {
    id: bookingId,
    tourplan_booking_id: tourplanData.tourplan_booking_id,
    tourplan_reference: tourplanData.tourplan_reference,
    status: (tourplanData.status || 'confirmed') as any,
    updated_at: new Date().toISOString()
  } as BookingRecord
}

/**
 * Stub function - Update payment status
 */
export async function updatePaymentStatus(
  bookingId: string,
  paymentData: {
    payment_status: BookingRecord['payment_status']
    stripe_payment_intent_id?: string
    deposit_paid_at?: string
  }
): Promise<BookingRecord> {
  console.log('📝 Supabase disabled - skipping payment status update')
  return {
    id: bookingId,
    ...paymentData,
    updated_at: new Date().toISOString()
  } as BookingRecord
}

/**
 * Stub function - Get booking by ID
 */
export async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  console.log('📝 Supabase disabled - returning null for booking lookup')
  return null
}

/**
 * Stub function - Get booking by TourPlan reference
 */
export async function getBookingByTourPlanReference(reference: string): Promise<BookingRecord | null> {
  console.log('📝 Supabase disabled - returning null for TourPlan reference lookup')
  return null
}