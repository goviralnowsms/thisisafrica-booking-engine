"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Download, Mail, Phone } from "lucide-react"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get("reference")

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">Thank you for booking with This is Africa. Your adventure awaits!</p>

              {reference && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                  <h2 className="text-lg font-semibold mb-2">Booking Reference</h2>
                  <p className="text-2xl font-bold text-amber-700">{reference}</p>
                  <p className="text-sm text-gray-600 mt-2">Please save this reference number for your records</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold">What happens next?</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Confirmation Email</p>
                      <p className="text-sm text-gray-600">
                        You'll receive a detailed confirmation email within 15 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Personal Contact</p>
                      <p className="text-sm text-gray-600">
                        Our travel specialist will contact you within 24 hours to finalize details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Download className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium">Travel Documents</p>
                      <p className="text-sm text-gray-600">
                        Complete itinerary and travel documents will be sent 2 weeks before departure
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push("/")} variant="outline">
                  Return to Homepage
                </Button>
                <Button onClick={() => router.push("/booking-new")} className="bg-amber-500 hover:bg-amber-600">
                  Book Another Tour
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help? Contact us at{" "}
                  <a href="mailto:bookings@thisisafrica.com" className="text-amber-600 hover:underline">
                    bookings@thisisafrica.com
                  </a>{" "}
                  or call{" "}
                  <a href="tel:+27123456789" className="text-amber-600 hover:underline">
                    +27 12 345 6789
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
