"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, MapPin, Users, Phone, Mail, Home, Loader2 } from "lucide-react"

function BookingConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingReference = searchParams.get("reference")
  const bookingId = searchParams.get("bookingId") // TourPlan booking ID from URL
  const tourplanStatus = searchParams.get("status") // 'partial', 'manual', etc.
  const manualFlag = searchParams.get("manual") // 'true' if manual confirmation needed

  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  useEffect(() => {
    // Load booking details from sessionStorage if available
    const storedBooking = sessionStorage.getItem('manualConfirmationBooking')
    let initialBookingDetails = null
    
    if (storedBooking) {
      try {
        initialBookingDetails = JSON.parse(storedBooking)
        setBookingDetails(initialBookingDetails)
      } catch (error) {
        console.error('Error parsing stored booking:', error)
      }
    }

    // If we have bookingId from URL but not in stored data, add it
    if (bookingId && (!initialBookingDetails || !initialBookingDetails.bookingId)) {
      setBookingDetails(prev => ({
        ...prev,
        bookingId: bookingId
      }))
    }

    // Simulate loading confirmation details
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [bookingId]) // Removed bookingDetails from dependency array to prevent loop

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
          <p className="text-lg text-gray-600">Processing your booking...</p>
        </div>
      </div>
    )
  }

  // If no booking reference from URL, try to get it from stored booking data
  const effectiveBookingReference = bookingReference || bookingDetails?.bookingReference || bookingDetails?.bookingRef || bookingDetails?.id

  if (!effectiveBookingReference && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find your booking confirmation.</p>
          <Button onClick={() => router.push("/booking-new")}>Start New Booking</Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Your African adventure awaits</p>
        </div>

        {/* Booking Reference */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Booking Details</h2>
            <div className="text-3xl font-bold text-green-600 mb-2">{effectiveBookingReference}</div>
            {(bookingId || bookingDetails?.bookingId) && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-green-300">
                <div className="text-sm text-gray-600 mb-1">Booking ID for "My Bookings" access:</div>
                <div className="text-2xl font-bold text-gray-900">{bookingId || bookingDetails?.bookingId}</div>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-3">
              {(bookingId || bookingDetails?.bookingId) 
                ? 'Save your Booking ID to access "My Bookings" later'
                : 'Save your reference number for your records'
              }
            </p>
            
            {/* Booking Status */}
            {(manualFlag === 'true' || tourplanStatus === 'manual') && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-center text-amber-800 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">Booking submitted for confirmation</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  {bookingDetails?.message || 'Your booking has been submitted to our booking system. Staff will confirm availability within 48 hours.'}
                </p>
              </div>
            )}
            
            {tourplanStatus === 'partial' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center text-blue-800 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <span className="font-medium">Booking submitted successfully</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Your booking has been received and is being processed. You will receive confirmation shortly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold">
                    {bookingDetails?.productDetails?.code === 'BBKCRCHO018TIACP2' ? 'Chobe Princess 2 Night Cruise' :
                     bookingDetails?.productDetails?.code === 'BBKCRCHO018TIACP3' ? 'Chobe Princess 3 Night Cruise' :
                     bookingDetails?.productDetails?.code?.includes('BBKCR') ? 'Botswana River Cruise' :
                     bookingDetails?.productDetails?.code?.includes('RLROV') ? 'Rovos Rail Journey' :
                     'African Adventure'}
                  </h3>
                  <p className="text-gray-600">
                    {bookingDetails?.productDetails?.code?.includes('BBKCR') ? 'Botswana' :
                     bookingDetails?.productDetails?.code?.includes('RLROV') ? 'Southern Africa' :
                     'Africa'}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {bookingDetails?.productDetails?.code || effectiveBookingReference}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">Departure Date</h4>
                  <p className="text-gray-600">
                    {bookingDetails?.productDetails?.dateFrom ? 
                      new Date(bookingDetails.productDetails.dateFrom).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 
                      'TBD'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">Travelers</h4>
                  <p className="text-gray-600">
                    {bookingDetails?.productDetails?.adults || 2} Adults
                    {bookingDetails?.productDetails?.children > 0 && `, ${bookingDetails.productDetails.children} Children`}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-amber-600">$8,047</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Including taxes and fees</p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Confirmation Email</h4>
                  <p className="text-gray-600 text-sm">
                    You'll receive a detailed confirmation email within 15 minutes with your itinerary and travel
                    documents.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">
                    {(manualFlag === 'true' || tourplanStatus === 'manual') 
                      ? 'TourPlan Processing' 
                      : 'Travel Consultant Contact'
                    }
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {(manualFlag === 'true' || tourplanStatus === 'manual')
                      ? 'Your booking has been submitted to our TourPlan system. Our staff will review and confirm availability within 48 hours.'
                      : 'Our travel consultant will contact you within 24 hours to discuss your preferences and finalize details.'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Pre-Departure Information</h4>
                  <p className="text-gray-600 text-sm">
                    30 days before departure, you'll receive detailed pre-departure information including packing lists
                    and travel tips.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">Call Us</h4>
                  <p className="text-gray-600">+61 2 9664 9187</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">Email Us</h4>
                  <p className="text-gray-600">sales@thisisafrica.com.au</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5 text-amber-500" />
                <div>
                  <h4 className="font-medium">Visit Us</h4>
                  <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            onClick={() => {
              // Pre-populate My Bookings form with the booking details
              if (bookingDetails?.bookingId || bookingId) {
                sessionStorage.setItem('prebookingData', JSON.stringify({
                  bookingId: bookingDetails?.bookingId || bookingId || '',
                  reference: effectiveBookingReference
                }))
              }
              router.push("/my-bookings")
            }} 
            variant="outline" 
            size="lg"
          >
            View My Bookings
          </Button>
          <Button onClick={() => router.push("/")} className="bg-amber-500 hover:bg-amber-600" size="lg">
            Back to Home
          </Button>
          <Button onClick={() => router.push("/booking-new")} variant="outline" size="lg">
            Book Another Tour
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
            <p className="text-lg text-gray-600">Loading confirmation...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  )
}
