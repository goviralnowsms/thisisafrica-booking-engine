import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Mock tour data for demo purposes
const mockTours = [
  {
    id: "tour-1",
    name: "Sydney Harbour Bridge Climb",
    description: "Experience breathtaking views of Sydney from the top of the iconic Harbour Bridge",
    duration: 3,
    price: 299,
    level: "Moderate",
    availability: "OK" as const,
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
    availability: "OK" as const,
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
    availability: "RQ" as const,
    supplier: "Ayers Rock Resort",
    location: "Uluru, NT",
    extras: [],
  },
]

export async function POST(request: NextRequest) {
  try {
    const searchCriteria = await request.json()
    console.log("Search criteria received:", searchCriteria)

    // Filter tours based on search criteria
    let filteredTours = mockTours

    if (searchCriteria.country) {
      // For demo, assume all tours are in Australia
      filteredTours = filteredTours.filter(
        () =>
          searchCriteria.country.toLowerCase().includes("australia") ||
          searchCriteria.country.toLowerCase().includes("aus"),
      )
    }

    if (searchCriteria.destination) {
      filteredTours = filteredTours.filter((tour) =>
        tour.location.toLowerCase().includes(searchCriteria.destination.toLowerCase()),
      )
    }

    if (searchCriteria.tourLevel) {
      filteredTours = filteredTours.filter(
        (tour) => tour.level.toLowerCase() === searchCriteria.tourLevel.toLowerCase(),
      )
    }

    if (searchCriteria.budget) {
      const maxBudget = Number.parseInt(searchCriteria.budget)
      if (!isNaN(maxBudget)) {
        filteredTours = filteredTours.filter((tour) => tour.price <= maxBudget)
      }
    }

    return NextResponse.json({
      success: true,
      tours: filteredTours,
      message: `Found ${filteredTours.length} tours`,
    })
  } catch (error) {
    console.error("Tour search API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to search tours",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Tour search API is running",
    endpoint: "POST /api/tours/search",
    availableTours: mockTours.length,
  })
}
