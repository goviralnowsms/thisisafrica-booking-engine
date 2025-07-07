import { type NextRequest, NextResponse } from "next/server"
import type { SearchCriteria, Tour } from "@/app/page"

export const runtime = "nodejs"

// Mock tour data for demonstration
const mockTours: Tour[] = [
  {
    id: "safari-1",
    name: "Kruger National Park Safari",
    description: "Experience the thrill of spotting the Big Five in South Africa's premier wildlife reserve. This 3-day safari includes luxury accommodation, expert guides, and unforgettable game drives.",
    duration: 3,
    price: 1200,
    level: "luxury",
    availability: "OK",
    supplier: "This Is Africa Safaris",
    location: "Kruger National Park, South Africa",
    extras: [
      {
        id: "extra-1",
        name: "Sunset Game Drive",
        description: "Evening safari with sundowner drinks",
        price: 150,
        isCompulsory: false,
      },
      {
        id: "extra-2",
        name: "Bush Walk",
        description: "Guided walking safari with armed ranger",
        price: 200,
        isCompulsory: false,
      },
      {
        id: "extra-3",
        name: "Photography Workshop",
        description: "Learn wildlife photography techniques",
        price: 300,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "safari-2",
    name: "Masai Mara Adventure",
    description: "Witness the Great Migration in Kenya's most famous wildlife reserve. Includes luxury tented camp accommodation and daily game drives.",
    duration: 4,
    price: 1800,
    level: "luxury",
    availability: "OK",
    supplier: "This Is Africa Safaris",
    location: "Masai Mara, Kenya",
    extras: [
      {
        id: "extra-4",
        name: "Hot Air Balloon Safari",
        description: "Sunrise balloon ride over the Mara",
        price: 450,
        isCompulsory: false,
      },
      {
        id: "extra-5",
        name: "Cultural Village Visit",
        description: "Visit traditional Masai village",
        price: 100,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "safari-3",
    name: "Serengeti Discovery",
    description: "Explore Tanzania's iconic Serengeti National Park. This 5-day tour includes luxury lodge accommodation and expert wildlife viewing.",
    duration: 5,
    price: 2200,
    level: "luxury",
    availability: "RQ",
    supplier: "This Is Africa Safaris",
    location: "Serengeti, Tanzania",
    extras: [
      {
        id: "extra-6",
        name: "Ngorongoro Crater Day Trip",
        description: "Visit the world's largest intact caldera",
        price: 350,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "culture-1",
    name: "Cape Town Cultural Experience",
    description: "Immerse yourself in the vibrant culture of Cape Town. Visit historical sites, taste local cuisine, and explore the beautiful coastline.",
    duration: 3,
    price: 800,
    level: "standard",
    availability: "OK",
    supplier: "This Is Africa Tours",
    location: "Cape Town, South Africa",
    extras: [
      {
        id: "extra-7",
        name: "Wine Tasting Tour",
        description: "Visit Stellenbosch wineries",
        price: 120,
        isCompulsory: false,
      },
      {
        id: "extra-8",
        name: "Table Mountain Cable Car",
        description: "Panoramic views of the city",
        price: 80,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "adventure-1",
    name: "Victoria Falls Adventure",
    description: "Experience the power of Victoria Falls and enjoy thrilling adventure activities in Zambia and Zimbabwe.",
    duration: 4,
    price: 1400,
    level: "standard",
    availability: "OK",
    supplier: "This Is Africa Adventures",
    location: "Victoria Falls, Zambia/Zimbabwe",
    extras: [
      {
        id: "extra-9",
        name: "White Water Rafting",
        description: "Adrenaline-pumping rafting experience",
        price: 250,
        isCompulsory: false,
      },
      {
        id: "extra-10",
        name: "Helicopter Flight",
        description: "Aerial views of the falls",
        price: 400,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "budget-1",
    name: "Budget Safari Experience",
    description: "Affordable 2-day safari in a private game reserve. Perfect for budget-conscious travelers who want to experience African wildlife.",
    duration: 2,
    price: 450,
    level: "basic",
    availability: "OK",
    supplier: "This Is Africa Budget Tours",
    location: "Various Locations, South Africa",
    extras: [
      {
        id: "extra-11",
        name: "Traditional Braai",
        description: "South African barbecue experience",
        price: 50,
        isCompulsory: false,
      },
    ],
  },
]

function filterTours(criteria: SearchCriteria): Tour[] {
  let filtered = [...mockTours]

  // Filter by country
  if (criteria.country) {
    filtered = filtered.filter(tour => 
      tour.location.toLowerCase().includes(criteria.country!.toLowerCase())
    )
  }

  // Filter by destination
  if (criteria.destination) {
    filtered = filtered.filter(tour => 
      tour.location.toLowerCase().includes(criteria.destination!.toLowerCase()) ||
      tour.name.toLowerCase().includes(criteria.destination!.toLowerCase())
    )
  }

  // Filter by tour level
  if (criteria.tourLevel) {
    filtered = filtered.filter(tour => tour.level === criteria.tourLevel)
  }

  // Filter by availability (exclude unavailable tours)
  filtered = filtered.filter(tour => tour.availability !== "NO")

  return filtered
}

export async function POST(request: NextRequest) {
  try {
    const searchCriteria: SearchCriteria = await request.json()

    console.log("Search criteria received:", searchCriteria)

    // Filter tours based on criteria
    const tours = filterTours(searchCriteria)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      tours: tours,
      message: `Found ${tours.length} tours`,
      criteria: searchCriteria,
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
    availableFilters: ["country", "destination", "tourLevel", "startDate", "endDate", "adults", "children"],
  })
}
