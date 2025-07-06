import type { SearchCriteria, Tour } from "@/app/page"
import { TourplanAPI } from "@/app/tourplan-api"

// Mock data for development/demo
const mockTours: Tour[] = [
  {
    id: "tour-1",
    name: "Sydney Harbour Bridge Climb",
    description: "Experience breathtaking views of Sydney from the top of the iconic Harbour Bridge",
    duration: 3,
    price: 299,
    level: "Moderate",
    availability: "OK",
    supplier: "BridgeClimb Sydney",
    location: "Sydney, NSW",
    extras: [
      {
        id: "photo-1",
        name: "Professional Photo Package",
        description: "High-quality photos of your climb experience",
        price: 49,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "tour-2",
    name: "Great Ocean Road Day Tour",
    description: "Discover the stunning coastline and famous rock formations along Victoria's Great Ocean Road",
    duration: 12,
    price: 189,
    level: "Easy",
    availability: "OK",
    supplier: "Gray Line Tours",
    location: "Melbourne, VIC",
    extras: [
      {
        id: "lunch-1",
        name: "Gourmet Lunch",
        description: "Three-course meal at a local restaurant",
        price: 35,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "tour-3",
    name: "Uluru Sunrise & Kata Tjuta Tour",
    description: "Watch the sunrise over Uluru and explore the ancient rock formations of Kata Tjuta",
    duration: 6,
    price: 145,
    level: "Easy",
    availability: "RQ",
    supplier: "Ayers Rock Resort",
    location: "Uluru, NT",
    extras: [],
  },
  {
    id: "tour-4",
    name: "Blue Mountains Day Trip",
    description: "Explore the stunning Blue Mountains with scenic railway rides and bushwalking",
    duration: 8,
    price: 129,
    level: "Moderate",
    availability: "OK",
    supplier: "Blue Mountains Tours",
    location: "Blue Mountains, NSW",
    extras: [
      {
        id: "cable-car-1",
        name: "Scenic Skyway Upgrade",
        description: "Premium glass-floor cable car experience",
        price: 25,
        isCompulsory: false,
      },
    ],
  },
]

// Create singleton instance
const tourplanAPI = new TourplanAPI()

export async function searchTours(criteria: SearchCriteria): Promise<Tour[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // For demo purposes, return mock data
    // In production, this would make actual API calls to Tourplan
    let filteredTours = mockTours

    // Apply filters based on search criteria
    if (criteria.destination) {
      filteredTours = filteredTours.filter((tour) =>
        tour.location.toLowerCase().includes(criteria.destination!.toLowerCase()),
      )
    }

    if (criteria.tourLevel) {
      filteredTours = filteredTours.filter((tour) => tour.level.toLowerCase() === criteria.tourLevel!.toLowerCase())
    }

    if (criteria.budget) {
      const maxBudget = Number.parseInt(criteria.budget)
      if (!isNaN(maxBudget)) {
        filteredTours = filteredTours.filter((tour) => tour.price <= maxBudget)
      }
    }

    if (criteria.duration) {
      const maxDuration = Number.parseInt(criteria.duration)
      if (!isNaN(maxDuration)) {
        filteredTours = filteredTours.filter((tour) => tour.duration <= maxDuration)
      }
    }

    return filteredTours
  } catch (error) {
    console.error("Error searching tours:", error)
    throw new Error("Failed to search tours")
  }
}

export async function getTourDetails(tourId: string): Promise<Tour | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const tour = mockTours.find((t) => t.id === tourId)
  return tour || null
}

export async function createBooking(
  bookingData: any,
): Promise<{ success: boolean; bookingId?: string; error?: string }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    // In production, this would create a real booking via Tourplan API
    const bookingId = `BK${Date.now()}`

    return {
      success: true,
      bookingId,
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to create booking",
    }
  }
}

/**
 * Returns the singleton instance of the TourplanAPI class.
 */
export function getTourplanAPI(): TourplanAPI {
  return tourplanAPI
}

/**
 * Convenience wrapper around tourplanAPI.getOptionInfo(...).
 */
export async function getOptionInfo(tourId: string) {
  return await tourplanAPI.getOptionInfo(tourId)
}

export { tourplanAPI }
