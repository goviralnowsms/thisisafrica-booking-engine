import { getTourplanAPI } from "@/lib/tourplan-api"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(request: Request) {
  try {
    const { bookingId, customerDetails } = await request.json()

    // 1. Update in our database first
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("customer_id, tourplan_booking_id")
      .eq("id", bookingId)
      .single()

    if (bookingError || !booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 })
    }

    // 2. Update customer details in our database
    const { error: customerError } = await supabase
      .from("customers")
      .update({
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
      })
      .eq("id", booking.customer_id)

    if (customerError) {
      return Response.json({ error: "Failed to update customer details" }, { status: 500 })
    }

    // 3. Try to update in Tourplan (may fail due to limitations)
    const tourplanAPI = getTourplanAPI()
    const tourplanUpdated = await tourplanAPI.updateCustomerDetails(booking.tourplan_booking_id, customerDetails)

    return Response.json({
      success: true,
      updatedInDatabase: true,
      updatedInTourplan: tourplanUpdated,
      message: tourplanUpdated
        ? "Customer details updated successfully"
        : "Customer details updated in our system. Tourplan update may require manual intervention.",
    })
  } catch (error) {
    console.error("Customer update failed:", error)
    return Response.json(
      {
        error: "Failed to update customer details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
