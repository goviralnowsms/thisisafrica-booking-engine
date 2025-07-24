import { type NextRequest, NextResponse } from "next/server"

// This is where you'll integrate with the Tourplan API
export async function POST(request: NextRequest) {
  try {
    const searchParams = await request.json()

    // Replace this with actual Tourplan API integration
    const tourplanResponse = await fetch("YOUR_TOURPLAN_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TOURPLAN_API_KEY}`,
      },
      body: JSON.stringify({
        startingCountry: searchParams.startingCountry,
        destination: searchParams.destination,
        class: searchParams.class,
        // Add other required Tourplan parameters
      }),
    })

    if (!tourplanResponse.ok) {
      throw new Error("Failed to fetch from Tourplan API")
    }

    const data = await tourplanResponse.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Tourplan API error:", error)
    return NextResponse.json({ error: "Failed to search packages" }, { status: 500 })
  }
}
