"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import type { BookingData } from "@/app/page"

interface PaymentFormProps {
  bookingData: BookingData
  onPaymentSuccess: (bookingResult: any) => void
  onPaymentError: (error: string) => void
}

export function PaymentForm({ bookingData, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "error">("pending")
  const [paymentSessionId, setPaymentSessionId] = useState<string>("")
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      // Step 1: Create payment session
      console.log("Creating payment session for deposit:", bookingData.depositAmount)
      
      const paymentResponse = await fetch("/api/create-payment-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bookingData.depositAmount,
          currency: "usd",
          description: `Deposit for ${bookingData.tour.name}`,
          customerEmail: bookingData.customerDetails.email,
          bookingData,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment session")
      }

      const paymentData = await paymentResponse.json()
      console.log("Payment session created:", paymentData)

      if (!paymentData.success) {
        throw new Error(paymentData.error || "Payment session creation failed")
      }

      setPaymentSessionId(paymentData.sessionId)

      // Step 2: Simulate payment processing (in demo mode)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Step 3: Verify payment
      console.log("Verifying payment...")
      const verifyResponse = await fetch("/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: paymentData.sessionId,
          bookingData,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed")
      }

      const verifyData = await verifyResponse.json()
      console.log("Payment verification result:", verifyData)

      if (!verifyData.success) {
        throw new Error(verifyData.error || "Payment verification failed")
      }

      setPaymentStatus("success")

      // Step 4: Create booking after successful payment
      console.log("Creating booking after successful payment...")
      const bookingResponse = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingData,
          paymentSessionId: paymentData.sessionId,
          paymentStatus: "paid",
        }),
      })

      if (!bookingResponse.ok) {
        throw new Error("Booking creation failed after payment")
      }

      const bookingResult = await bookingResponse.json()
      console.log("Booking created after payment:", bookingResult)

      if (!bookingResult.success) {
        throw new Error(bookingResult.error || "Booking creation failed")
      }

      toast({
        title: "Payment Successful!",
        description: `Deposit of $${bookingData.depositAmount} processed. Booking confirmed.`,
      })

      onPaymentSuccess(bookingResult)
    } catch (error) {
      console.error("Payment process failed:", error)
      setPaymentStatus("error")
      
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      onPaymentError(errorMessage)
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Secure payment for your tour booking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tour:</span>
            <span className="font-medium">{bookingData.tour.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Price:</span>
            <span className="font-medium">{formatPrice(bookingData.totalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Deposit Required (30%):</span>
            <span className="font-medium text-green-600">{formatPrice(bookingData.depositAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining Balance:</span>
            <span className="font-medium">{formatPrice(bookingData.totalPrice - bookingData.depositAmount)}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-muted-foreground mb-4">
            <p>• 30% deposit required to confirm booking</p>
            <p>• Remaining balance due 21 days before departure</p>
            <p>• Secure payment processed by Stripe</p>
          </div>
        </div>

        {/* Payment Status */}
        {paymentStatus === "processing" && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing payment...</span>
          </div>
        )}

        {paymentStatus === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Payment successful!</span>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Payment failed</span>
          </div>
        )}

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Deposit ${formatPrice(bookingData.depositAmount)}
            </>
          )}
        </Button>

        <div className="text-xs text-muted-foreground text-center">
          Your payment information is secure and encrypted
        </div>
      </CardContent>
    </Card>
  )
}
