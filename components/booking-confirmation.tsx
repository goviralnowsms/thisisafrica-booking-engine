"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, MapPin, Users, Mail, Phone, CreditCard, Search } from "lucide-react"

interface BookingConfirmationProps {
  bookingReference: string
  onBackToSearch: () => void
}

export function BookingConfirmation({ bookingReference, onBackToSearch }: BookingConfirmationProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600">Your African adventure is secured. We'll be in touch soon!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Reference: <span className="font-mono font-bold">{bookingReference}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">African Safari Tour</h3>
              <p className="text-gray-600">Your selected tour has been confirmed</p>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                <span>Africa</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                <span>Multiple days</span>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">What's Included</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Professional tour guide</div>
                <div>• Accommodation as specified</div>
                <div>• Transportation during tour</div>
                <div>• Meals as per itinerary</div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Next Steps</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>• Confirmation email sent</div>
                <div>• We'll verify availability</div>
                <div>• Detailed itinerary to follow</div>
                <div>• Final payment due before departure</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Your deposit has been processed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Payment Successful</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Deposit Paid</span>
                <span className="text-green-600 font-medium">✓ Confirmed</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Remaining Balance</span>
                <span>Due before departure</span>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Confirmation email sent to your email</li>
                <li>• We'll verify availability with suppliers</li>
                <li>• Final balance due 2-4 weeks before departure</li>
                <li>• Detailed itinerary will be provided</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• All bookings are subject to supplier confirmation</li>
                <li>• Cancellation policy applies as per terms</li>
                <li>• Travel insurance is recommended</li>
                <li>• Contact us for any changes or questions</li>
              </ul>
            </div>

            <Button onClick={onBackToSearch} className="w-full" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Book Another Tour
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
