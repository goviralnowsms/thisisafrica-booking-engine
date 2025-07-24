"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function BookingPage() {
  const params = useParams()
  const packageId = params.id

  const handleBookingRedirect = () => {
    // Redirect to your existing booking engine
    // Replace with your actual booking engine URL
    window.location.href = `https://your-booking-engine.vercel.app/book/${packageId}`
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
        <p className="text-gray-600 mb-8">
          You're about to book package {packageId}. You'll be redirected to our secure booking system to complete your
          reservation and pay the 30% deposit.
        </p>
        <Button
          onClick={handleBookingRedirect}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
        >
          Continue to Booking Engine
        </Button>
      </div>
    </div>
  )
}
