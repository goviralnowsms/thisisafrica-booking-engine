"use client"

import type React from "react"

// Force dynamic rendering to prevent build issues
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Search, ArrowRight, FileText, Loader2 } from "lucide-react"

// Mock data for existing bookings
const MOCK_BOOKINGS = [
  {
    id: "booking-123456",
    reference: "TIA-123456",
    tourName: "Luxury Safari Experience",
    destination: "Kenya & Tanzania",
    startDate: "June 15, 2025",
    endDate: "June 25, 2025",
    duration: 10,
    travelers: 2,
    status: "confirmed",
    totalAmount: 6998,
    image: "/images/safari-lion.png",
  },
  {
    id: "booking-789012",
    reference: "TIA-789012",
    tourName: "Victoria Falls Adventure",
    destination: "Zimbabwe & Zambia",
    startDate: "August 5, 2025",
    endDate: "August 12, 2025",
    duration: 7,
    travelers: 2,
    status: "pending",
    totalAmount: 5798,
    image: "/images/victoria-falls.png",
  },
]

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({
    surname: "",
    bookingId: ""
  })
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Pre-populate form if coming from booking confirmation
  useEffect(() => {
    const prebookingData = sessionStorage.getItem('prebookingData')
    if (prebookingData) {
      try {
        const parsed = JSON.parse(prebookingData)
        if (parsed.bookingId) {
          setLoginForm(prev => ({
            ...prev,
            bookingId: parsed.bookingId
          }))
        }
        // Clear the pre-population data
        sessionStorage.removeItem('prebookingData')
      } catch (error) {
        console.error('Error parsing prebooking data:', error)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoggingIn(true)

    // Basic validation
    if (!loginForm.surname.trim() || !loginForm.bookingId.trim()) {
      setLoginError("Please enter both your surname and booking ID")
      setIsLoggingIn(false)
      return
    }

    try {
      console.log('🔍 Attempting booking lookup:', { bookingId: loginForm.bookingId, surname: loginForm.surname });
      
      // Check if this is a TIA booking first (stored locally)
      if (loginForm.bookingId.startsWith('TIA-')) {
        const tiaBookings = JSON.parse(localStorage.getItem('tiaBookings') || '{}');
        const tiaBooking = tiaBookings[loginForm.bookingId];
        
        if (tiaBooking) {
          // Verify surname matches
          const bookingSurname = tiaBooking.customerName?.split(' ').pop()?.toLowerCase();
          if (bookingSurname === loginForm.surname.toLowerCase()) {
            console.log('✅ Found TIA booking in local storage');
            setIsAuthenticated(true);
            
            // Format TIA booking for display
            const bookingForDisplay = {
              id: tiaBooking.reference,
              reference: tiaBooking.reference,
              tourName: tiaBooking.productName || 'African Adventure',
              destination: tiaBooking.productLocation || 'Africa',
              startDate: tiaBooking.dateFrom ? new Date(tiaBooking.dateFrom).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'TBD',
              endDate: tiaBooking.dateFrom ? new Date(tiaBooking.dateFrom).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'TBD',
              duration: 'Multiple days',
              travelers: tiaBooking.adults + (tiaBooking.children || 0),
              roomType: '1 Room',
              status: 'pending-confirmation',
              totalAmount: tiaBooking.totalCost ? Math.round(tiaBooking.totalCost / 100) : 0,
              image: "/images/safari-lion.png",
              supplier: tiaBooking.productSupplier || '',
              productCode: tiaBooking.productCode,
              note: 'This booking requires manual confirmation. You will be contacted within 48 hours.'
            };
            
            setBookings([bookingForDisplay]);
            setIsLoggingIn(false);
            return;
          }
        }
      }
      
      // If not TIA or not found locally, try TourPlan API
      const response = await fetch(`/api/tourplan/booking/lookup?bookingId=${encodeURIComponent(loginForm.bookingId)}&surname=${encodeURIComponent(loginForm.surname)}`)
      console.log('📡 API Response status:', response.status, response.statusText);
      
      const result = await response.json()
      console.log('📋 API Response data:', result);
      
      if (result.success && result.data?.booking) {
        console.log('🔍 Raw booking data from TourPlan:', result.data.booking);
        console.log('🔍 Available fields:', Object.keys(result.data.booking));
        if (result.data.booking.rawData) {
          console.log('🔍 TourPlan rawData fields:', Object.keys(result.data.booking.rawData));
          console.log('🔍 TourPlan rawData object:', result.data.booking.rawData);
        }
      }
      
      if (result.success && result.data?.booking) {
        setIsAuthenticated(true)
        // Convert single booking to array format for display
        const booking = result.data.booking
        // Get room type from rawData if available
        let roomTypeText = '1 room';
        if (booking.rawData?.Services?.Service?.RoomType) {
          const roomType = booking.rawData.Services.Service.RoomType;
          const roomTypeMap = {
            'SG': '1 Single Room',
            'DB': '1 Double Room',
            'TW': '1 Twin Room',
            'TR': '1 Triple Room',
            'QU': '1 Quad Room'
          };
          roomTypeText = roomTypeMap[roomType] || '1 Room';
        }
        
        const bookingForDisplay = {
          id: booking.id,
          reference: booking.reference,
          tourName: booking.tourName || booking.customerName || 'Your Booking',
          destination: booking.destination || 'Africa',
          startDate: booking.travelDate || 'TBD',
          endDate: booking.travelDateTo || booking.travelDate || 'TBD', // Use travelDateTo if available
          duration: booking.duration || 'Multiple days',
          travelers: booking.travelers || 1,
          roomType: roomTypeText,
          status: (booking.status || 'confirmed').toLowerCase().replace(' ', '-'), // Convert "Website Quote" to "website-quote"
          totalAmount: booking.totalPrice ? Math.round(booking.totalPrice / 100) : (booking.totalAmount || 0), // Convert cents to dollars
          image: "/images/safari-lion.png", // Default image
          supplier: booking.supplier || ''
        }
        setBookings([bookingForDisplay])
      } else {
        // Handle detailed error messages from API
        const errorMessage = result.message || result.error || "Invalid surname or booking ID. Please check your details and try again."
        setLoginError(errorMessage)
      }
    } catch (error) {
      console.error('Booking lookup error:', error)
      setLoginError("Unable to access bookings at this time. Please try again later.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setBookings([])
    setLoginForm({ surname: "", bookingId: "" })
    setLoginError("")
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Need surname for search - prompt user if not available
    if (!loginForm.surname) {
      setLoginError("Please enter your surname to search for bookings.")
      return
    }

    setIsSearching(true)
    setLoginError("")

    try {
      console.log(`🔍 Searching for booking: "${searchQuery}" with surname: "${loginForm.surname}"`);
      
      // Try to search using the booking lookup API
      // The search query could be a booking reference, so try it
      const response = await fetch(`/api/tourplan/booking/lookup?bookingId=${encodeURIComponent(searchQuery.trim())}&surname=${encodeURIComponent(loginForm.surname)}`)
      
      console.log('📡 Search response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('❌ Search error response:', errorText)
        throw new Error(`Search failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log('📋 Search result:', result)
      
      if (result.success && result.data?.booking) {
        // Found a booking - convert to display format
        const booking = result.data.booking
        const bookingForDisplay = {
          id: booking.id,
          reference: booking.reference,
          tourName: booking.tourName || 'Your Booking',
          destination: booking.destination || 'Africa',
          startDate: booking.travelDate || 'TBD',
          endDate: booking.travelDateTo || booking.travelDate || 'TBD',
          duration: booking.duration || 'Multiple days',
          travelers: booking.travelers || 1,
          roomType: '1 Room',
          status: (booking.status || 'confirmed').toLowerCase().replace(' ', '-'),
          totalAmount: booking.totalPrice ? Math.round(booking.totalPrice / 100) : (booking.totalAmount || 0),
          image: "/images/safari-lion.png",
          supplier: booking.supplier || ''
        }
        setBookings([bookingForDisplay])
      } else {
        // No booking found
        setBookings([])
        setLoginError(result.message || `No booking found for "${searchQuery}". Please check the booking reference and try again.`)
      }
    } catch (error) {
      console.error('Search error:', error)
      setBookings([])
      setLoginError(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    // Show cancellation information instead of actually cancelling
    alert(
      "IMPORTANT: Cancellation Request\n\n" +
      "This action does NOT automatically cancel your booking with This is Africa.\n\n" +
      "To fully cancel your booking, you must:\n" +
      "1. Contact our support team directly\n" +
      "2. Email: sales@thisisafrica.com.au\n" +
      "3. Phone: +61 2 9664 9187\n\n" +
      "Please have your booking reference ready when contacting us.\n\n" +
      "Cancellation policies and fees may apply depending on your booking terms."
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "website-quote":
        return <Badge className="bg-blue-500">Quote - Awaiting Confirmation</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Access My Bookings</h1>
            <p className="text-gray-600">Enter your surname and numeric booking ID to view your bookings</p>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <p className="font-medium mb-2">📋 Important: Booking References vs Booking IDs</p>
              <p>• <strong>Booking References</strong> (like TAWB100445) cannot be used for online lookup</p>
              <p>• Only <strong>numeric Booking IDs</strong> work with our automated system</p>
              <p>• For booking references, please contact our team at +61 2 9664 9187</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="surname" className="text-sm font-medium text-gray-700 mb-2 block">
                  Surname (Family Name)
                </Label>
                <Input
                  id="surname"
                  type="text"
                  placeholder="Enter your surname"
                  value={loginForm.surname}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, surname: e.target.value }))}
                  className="w-full"
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <Label htmlFor="bookingId" className="text-sm font-medium text-gray-700 mb-2 block">
                  Booking ID
                </Label>
                <Input
                  id="bookingId"
                  type="text"
                  placeholder="Enter booking ID (e.g. 1474)"
                  value={loginForm.bookingId}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, bookingId: e.target.value }))}
                  className="w-full"
                  disabled={isLoggingIn}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be a numeric booking ID
                </p>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{loginError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Accessing Bookings...
                  </>
                ) : (
                  'Access My Bookings'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Need help finding your booking details?</p>
                <Link href="/contact" className="text-amber-600 hover:text-amber-700 underline">
                  Contact our support team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="text-gray-600 hover:text-gray-800"
          >
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Find Your Booking</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search-booking" className="sr-only">
                Search by booking ID
              </Label>
              <Input
                id="search-booking"
                placeholder="Enter booking ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600" disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
          </form>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
            <TabsTrigger value="all">All Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 relative h-48 md:h-auto">
                      <Image
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.tourName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-3/4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{booking.tourName}</h3>
                          <p className="text-gray-600 mb-4">Booking Reference: {booking.reference}</p>
                        </div>
                        <div>{getStatusBadge(booking.status)}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                          <span>{booking.destination}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                          <span>
                            {booking.duration === 'Multiple days' || booking.duration === '1 day' 
                              ? `Departing ${booking.startDate}` 
                              : `${booking.startDate} - ${booking.endDate}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-amber-500" />
                          <span>
                            {booking.duration === 'Multiple days' || booking.duration === '1 day' 
                              ? booking.roomType || '1 room'
                              : `${booking.duration} / ${booking.roomType || '1 room'}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold">${booking.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => {
                            // Show booking details in a modal or expand inline
                            alert(`Booking Details:\n\nReference: ${booking.reference}\nBooking ID: ${booking.id}\nCustomer: ${booking.tourName}\nTravel Date: ${booking.startDate}\nStatus: ${booking.status}\nAmount: $${booking.totalAmount.toLocaleString()}\n\nFor full tour details, contact sales@thisisafrica.com.au`)
                          }}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {booking.status !== "cancelled" && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Request Cancellation
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">You don't have any upcoming bookings at the moment.</p>
                <Button asChild className="bg-amber-500 hover:bg-amber-600">
                  <Link href="/booking">
                    Browse Tours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            <div className="bg-white rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No past bookings</h3>
              <p className="text-gray-600 mb-6">You don't have any past bookings with us yet.</p>
              <Button asChild className="bg-amber-500 hover:bg-amber-600">
                <Link href="/booking">
                  Browse Tours
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 relative h-48 md:h-auto">
                      <Image
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.tourName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-3/4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{booking.tourName}</h3>
                          <p className="text-gray-600 mb-4">Booking Reference: {booking.reference}</p>
                        </div>
                        <div>{getStatusBadge(booking.status)}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                          <span>{booking.destination}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                          <span>
                            {booking.duration === 'Multiple days' || booking.duration === '1 day' 
                              ? `Departing ${booking.startDate}` 
                              : `${booking.startDate} - ${booking.endDate}`}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-amber-500" />
                          <span>
                            {booking.duration === 'Multiple days' || booking.duration === '1 day' 
                              ? booking.roomType || '1 room'
                              : `${booking.duration} / ${booking.roomType || '1 room'}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold">${booking.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => {
                            // Show booking details in a modal or expand inline
                            alert(`Booking Details:\n\nReference: ${booking.reference}\nBooking ID: ${booking.id}\nCustomer: ${booking.tourName}\nTravel Date: ${booking.startDate}\nStatus: ${booking.status}\nAmount: $${booking.totalAmount.toLocaleString()}\n\nFor full tour details, contact sales@thisisafrica.com.au`)
                          }}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {booking.status !== "cancelled" && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Request Cancellation
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-6">You don't have any bookings at the moment.</p>
                <Button asChild className="bg-amber-500 hover:bg-amber-600">
                  <Link href="/booking">
                    Browse Tours
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
