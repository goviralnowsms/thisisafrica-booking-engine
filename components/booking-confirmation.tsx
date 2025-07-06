"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, MapPin, Clock, Calendar } from "lucide-react"
import type { BookingData } from "@/app/page"

interface BookingConfirmationProps {
  bookingData: BookingData
  bookingReference: string
  onNewSearch: () => void
}

export function BookingConfirmation({ bookingData, bookingReference, onNewSearch }: BookingConfirmationProps) {
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
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600">Thank you for choosing This is Africa. Your adventure awaits!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Reference: <span className="font-mono font-semibold">{bookingReference}</span>
            </CardDescription>
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
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Name:</strong> {bookingData.customerDetails.firstName}{" "}
                    {bookingData.customerDetails.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {bookingData.customerDetails.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {bookingData.customerDetails.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {bookingData.customerDetails.address}
                  </p>
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
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Your deposit has been successfully processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-semibold">Payment Confirmed</span>
                </div>
                <p className="text-sm text-green-700">
                  Your deposit of ${bookingData.depositAmount} has been successfully processed.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Tour Price</span>
                  <span>${bookingData.totalPrice}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Deposit Paid</span>
                  <span>-${bookingData.depositAmount}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Remaining Balance</span>
                  <span className="text-orange-600">${bookingData.totalPrice - bookingData.depositAmount}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-semibold">Payment Schedule</span>
                </div>
                <p className="text-sm text-blue-700">
                  The remaining balance of ${bookingData.totalPrice - bookingData.depositAmount} is due 30 days before
                  your tour departure date.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Mail className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Confirmation Email</h4>
              <p className="text-sm text-gray-600">
                You'll receive a detailed confirmation email within 24 hours with your itinerary and travel documents.
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Pre-Tour Contact</h4>
              <p className="text-sm text-gray-600">
                Our team will contact you 2 weeks before departure to finalize details and answer any questions.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Final Payment</h4>
              <p className="text-sm text-gray-600">
                Complete your payment 30 days before departure and get ready for your African adventure!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Download Confirmation
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Mail className="w-4 h-4" />
          Email Confirmation
        </Button>
        <Button onClick={onNewSearch} className="bg-orange-500 hover:bg-orange-600">
          Book Another Tour
        </Button>
      </div>
    </div>
  )
}
