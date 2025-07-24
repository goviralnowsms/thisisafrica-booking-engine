interface BookingParams {
  packageId?: string
  searchParams?: {
    startingCountry?: string
    destination?: string
    class?: string
    category?: string
    adults?: number
    children?: number
    departureDate?: string
  }
  source?: string
}

export class BookingIntegration {
  private static bookingBaseUrl = process.env.NEXT_PUBLIC_BOOKING_ENGINE_URL || "https://book.thisisafrica.com.au"

  /**
   * Redirect to booking engine with search parameters
   */
  static redirectToBooking(params: BookingParams) {
    const bookingUrl = new URL(this.bookingBaseUrl)

    // Add package ID if provided
    if (params.packageId) {
      bookingUrl.pathname = `/book/${params.packageId}`
    } else {
      bookingUrl.pathname = "/search"
    }

    // Add all search parameters
    if (params.searchParams) {
      Object.entries(params.searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          bookingUrl.searchParams.set(key, value.toString())
        }
      })
    }

    // Add source tracking
    bookingUrl.searchParams.set("source", params.source || "main-site")
    bookingUrl.searchParams.set("timestamp", Date.now().toString())

    // Redirect to booking engine
    window.location.href = bookingUrl.toString()
  }

  /**
   * Generate booking URL without redirecting (for links)
   */
  static generateBookingUrl(params: BookingParams): string {
    const bookingUrl = new URL(this.bookingBaseUrl)

    if (params.packageId) {
      bookingUrl.pathname = `/book/${params.packageId}`
    } else {
      bookingUrl.pathname = "/search"
    }

    if (params.searchParams) {
      Object.entries(params.searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          bookingUrl.searchParams.set(key, value.toString())
        }
      })
    }

    bookingUrl.searchParams.set("source", params.source || "main-site")

    return bookingUrl.toString()
  }

  /**
   * Handle search form submission from any page
   */
  static handleSearchSubmission(searchData: any, currentPage: string) {
    this.redirectToBooking({
      searchParams: searchData,
      source: `main-site-${currentPage}`,
    })
  }
}
