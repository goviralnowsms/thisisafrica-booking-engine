import { getTourplanAPI } from "@/lib/tourplan-api"

export async function POST(request: Request) {
  try {
    const { tourId, date } = await request.json()

    if (!tourId || !date) {
      return Response.json({ error: "Tour ID and date are required" }, { status: 400 })
    }

    const tourplanAPI = getTourplanAPI()
    const availability = await tourplanAPI.checkAvailability(tourId, date)

    if (!availability) {
      return Response.json({ error: "Availability information not found" }, { status: 404 })
    }

    return Response.json({
      availability: availability.availability,
      price: availability.price,
      currency: availability.currency,
      spotsAvailable: availability.spotsAvailable,
      date: availability.date,
      tourId: availability.tourId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Availability check failed:", error)
    return Response.json(
      {
        error: "Failed to check availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
