/**
 * TourPlan API Integration - Real XML API
 * 
 * This integrates with the actual TourPlan HostConnect XML API
 * using our tested backend services.
 */

// Frontend-friendly interfaces (converted from TourPlan XML responses)
export interface Tour {
  id: string;
  code: string;
  name: string;
  description: string;
  supplier: string;
  duration: string;
  image?: string;
  rates: TourRate[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: string;
  startLocation?: string;
  endLocation?: string;
}

export interface TourRate {
  currency: string;
  singleRate: number;
  doubleRate: number;
  twinRate: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchParams {
  productType: 'Group Tours' | 'Day Tours' | 'Accommodation' | 'Cruises' | 'Rail' | 'Packages' | 'Special Offers';
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  adults?: number;
  children?: number;
}

export interface SearchResult {
  success: boolean;
  tours: Tour[];
  totalResults: number;
  error?: string;
}

export interface BookingData {
  customerName: string;
  email?: string;
  mobile?: string;
  productCode: string;
  rateId: string;
  dateFrom: string;
  dateTo?: string;
  adults?: number;
  children?: number;
  isQuote?: boolean;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  reference?: string;
  status?: string;
  totalCost?: number;
  currency?: string;
  error?: string;
}

// Helper function to format dates for TourPlan API
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Helper function to convert TourPlan prices (cents) to display format
function formatPrice(priceInCents: number): number {
  return Math.round(priceInCents / 100); // Convert cents to dollars
}

/**
 * Search for tours using the real TourPlan API
 */
export async function searchTours(params: {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  travelers?: string;
  productType?: string;
}): Promise<SearchResult> {
  try {
    // Convert frontend params to API format
    const searchParams: SearchParams = {
      productType: (params.productType as any) || 'Group Tours',
      destination: params.destination,
      dateFrom: params.startDate ? formatDate(params.startDate) : undefined,
      dateTo: params.endDate ? formatDate(params.endDate) : undefined,
      adults: params.travelers ? parseInt(params.travelers) : undefined,
    };

    const response = await fetch('/api/tourplan/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchParams),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        tours: [],
        totalResults: 0,
        error: data.message || 'Search failed',
      };
    }

    // Convert API response to frontend format
    const tours: Tour[] = (data.data.products || []).map((product: any) => ({
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      supplier: product.supplier,
      duration: product.duration,
      image: product.image,
      rates: product.rates.map((rate: any) => ({
        currency: rate.currency || 'AUD',
        singleRate: formatPrice(rate.singleRate || 0),
        doubleRate: formatPrice(rate.doubleRate || 0),
        twinRate: formatPrice(rate.twinRate || 0),
      })),
    }));

    return {
      success: true,
      tours,
      totalResults: data.data.totalResults || tours.length,
    };
  } catch (error) {
    console.error('TourPlan search error:', error);
    return {
      success: false,
      tours: [],
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Search failed',
    };
  }
}

/**
 * Get detailed tour information
 */
export async function getTourDetails(tourCode: string): Promise<{ success: boolean; tour?: Tour; error?: string }> {
  try {
    const response = await fetch(`/api/tourplan/product/${tourCode}`);
    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.message || 'Failed to get tour details',
      };
    }

    const product = data.data;
    const tour: Tour = {
      id: product.id,
      code: product.code,
      name: product.name,
      description: product.description,
      supplier: product.supplier,
      duration: product.duration,
      image: product.image,
      rates: product.rates.map((rate: any) => ({
        currency: rate.currency || 'AUD',
        singleRate: formatPrice(rate.singleRate || 0),
        doubleRate: formatPrice(rate.doubleRate || 0),
        twinRate: formatPrice(rate.twinRate || 0),
        dateFrom: rate.dateFrom,
        dateTo: rate.dateTo,
      })),
      inclusions: product.inclusions,
      exclusions: product.exclusions,
      itinerary: product.itinerary,
    };

    return {
      success: true,
      tour,
    };
  } catch (error) {
    console.error('TourPlan get tour details error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get tour details',
    };
  }
}

/**
 * Create a booking using the real TourPlan API
 */
export async function createBooking(bookingData: BookingData): Promise<BookingResult> {
  try {
    const response = await fetch('/api/tourplan/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.message || 'Booking failed',
      };
    }

    return {
      success: true,
      bookingId: data.data.bookingId,
      reference: data.data.bookingRef,
      status: data.data.status,
      totalCost: data.data.totalCost,
      currency: data.data.currency,
    };
  } catch (error) {
    console.error('TourPlan booking error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Booking failed',
    };
  }
}

/**
 * Get booking details
 */
export async function getBookingDetails(bookingId: string): Promise<{ success: boolean; booking?: any; error?: string }> {
  try {
    const response = await fetch(`/api/tourplan/booking/${bookingId}`);
    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.message || 'Failed to get booking details',
      };
    }

    return {
      success: true,
      booking: data.data,
    };
  } catch (error) {
    console.error('TourPlan get booking details error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get booking details',
    };
  }
}

/**
 * Check TourPlan API connection
 */
export async function checkConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/tourplan/auth');
    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data.message || 'Connection failed',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('TourPlan connection check error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}