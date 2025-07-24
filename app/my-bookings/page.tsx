"use client"

import type React from "react"

import { useState } from "react"
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
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate API call delay
    setTimeout(() => {
      const filteredBookings = MOCK_BOOKINGS.filter(
        (booking) =>
          booking.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.tourName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setBookings(filteredBookings)
      setIsSearching(false)
    }, 1000)
  }

  const handleCancelBooking = (bookingId: string) => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      // In a real implementation, this would make an API call to cancel the booking
      const updatedBookings = bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
      )
      setBookings(updatedBookings)
      setIsLoading(false)
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Find Your Booking</h2>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search-booking" className="sr-only">
                Search by booking reference or tour name
              </Label>
              <Input
                id="search-booking"
                placeholder="Enter booking reference or tour name"
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
                            {booking.startDate} - {booking.endDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-amber-500" />
                          <span>
                            {booking.duration} days / {booking.travelers} travelers
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold">${booking.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" asChild>
                            <Link href={`/booking/details?tourId=tour-001`}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {booking.status !== "cancelled" && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Cancel Booking
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
                            {booking.startDate} - {booking.endDate}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-amber-500" />
                          <span>
                            {booking.duration} days / {booking.travelers} travelers
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-2xl font-bold">${booking.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" asChild>
                            <Link href={`/booking/details?tourId=tour-001`}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {booking.status !== "cancelled" && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isLoading}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Cancel Booking
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
