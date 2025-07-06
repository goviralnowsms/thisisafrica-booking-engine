"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Shield, MapPin, Clock } from "lucide-react"
import type { BookingData } from "@/app/page"

interface PaymentFormProps {
  bookingData: BookingData
  onPaymentComplete: (reference: string) => void
  onBack: () => void
}

export function PaymentForm({ bookingData, onPaymentComplete, onBack }: PaymentFormProps) {
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate booking reference
      const reference = `TIA${Date.now().toString().slice(-6)}`

      onPaymentComplete(reference)
    } catch (error) {
      console.error("Payment failed:", error)
      setProcessing(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "luxury":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack} disabled={processing}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{bookingData.tour.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {bookingData.tour.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {bookingData.tour.duration} days
                    </div>
                  </div>
                  <Badge className={getLevelColor(bookingData.tour.level)} variant="secondary" className="mt-2">
                    {bookingData.tour.level}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Customer Details</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      {bookingData.customerDetails.firstName} {bookingData.customerDetails.lastName}
                    </p>
                    <p>{bookingData.customerDetails.email}</p>
                    <p>{bookingData.customerDetails.phone}</p>
                    <p>{bookingData.customerDetails.address}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Selected Extras</h4>
                  <div className="space-y-1 text-sm">
                    {bookingData.selectedExtras.map((extraId) => {
                      const extra = bookingData.tour.extras.find((e) => e.id === extraId)
                      return extra ? (
                        <div key={extraId} className="flex justify-between">
                          <span>{extra.name}</span>
                          <span>${extra.price}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Tour Price</span>
                    <span>${bookingData.totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>Deposit Due Today</span>
                    <span>${bookingData.depositAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining Balance</span>
                    <span>${bookingData.totalPrice - bookingData.depositAmount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </CardTitle>
              <CardDescription>Secure payment processing - Pay your deposit to confirm booking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-800 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your payment is processed securely. We accept all major credit cards and PayPal.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">${bookingData.depositAmount}</div>
                    <p className="text-sm text-gray-600">Deposit amount (30% of total tour price)</p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Deposit ${bookingData.depositAmount}
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    <p>By proceeding, you agree to our Terms of Service and Privacy Policy.</p>
                    <p className="mt-1">
                      The remaining balance of ${bookingData.totalPrice - bookingData.depositAmount} will be due before
                      your tour departure.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
