"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      setStatus("error")
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        const result = await response.json()

        if (result.success && result.status === "paid") {
          setPaymentDetails(result)
          setStatus("success")

          // Get booking data from localStorage
          const bookingData = localStorage.getItem("pendingBookingData")
          const bookingReference = localStorage.getItem("pendingBookingReference")

          if (bookingData && bookingReference) {
            // Here you would typically save the booking to your database
            console.log("Booking confirmed:", { bookingReference, bookingData: JSON.parse(bookingData) })

            // Clean up localStorage
            localStorage.removeItem("pendingBookingData")
            localStorage.removeItem("pendingBookingReference")
          }

          // Redirect to home after 5 seconds
          setTimeout(() => {
            router.push("/")
          }, 5000)
        } else {
          setStatus("error")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setStatus("error")
      }
    }

    verifyPayment()
  }, [searchParams, router])

  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {status === "loading" && "Verifying Payment..."}
            {status === "success" && "Payment Successful!"}
            {status === "error" && "Payment Error"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}

          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-semibold">Your payment was successful!</p>
                {paymentDetails && (
                  <>
                    <p className="text-sm text-gray-600">Booking Reference: {paymentDetails.bookingReference}</p>
                    <p className="text-sm text-gray-600">
                      Amount Paid: ${(paymentDetails.amountPaid / 100).toFixed(2)}{" "}
                      {paymentDetails.currency?.toUpperCase()}
                    </p>
                  </>
                )}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-green-800">
                    <strong>Test Payment Completed!</strong>
                    <br />
                    This was a test transaction using Stripe's test mode.
                  </p>
                </div>
                <p className="text-sm text-gray-500">You will receive a confirmation email shortly.</p>
                <p className="text-sm text-gray-500">Redirecting to home page in 5 seconds...</p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500" />
              <div className="text-center space-y-2">
                <p className="font-semibold">Payment verification failed</p>
                <p className="text-sm text-gray-600">Please contact support if you believe this is an error.</p>
              </div>
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
