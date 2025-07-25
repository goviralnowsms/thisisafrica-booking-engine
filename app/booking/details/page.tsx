"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, CheckCircle2, Clock, MapPin, Users, ArrowLeft, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTourDetails, createBooking } from "@/lib/tourplan-api"

export default function TourDetailsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tourId = searchParams.get("tourId")
  const [tour, setTour] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [travelers, setTravelers] = useState("2")
  const [bookingStep, setBookingStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  // Load tour details on component mount
  useEffect(() => {
    async function loadTourDetails() {
      if (!tourId) {
        setLoading(false)
        return
      }

      try {
        const result = await getTourDetails(tourId)
        if (result.success) {
          setTour(result.data)
        } else {
          console.error("Failed to load tour details:", result.error)
        }
      } catch (error) {
        console.error("Error loading tour details:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTourDetails()
  }, [tourId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
          <p className="text-lg text-gray-600">Loading tour details...</p>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
          <p className="text-gray-600 mb-6">The tour you're looking for could not be found.</p>
          <Button onClick={() => router.push("/booking")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createBooking({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          nationality: "Australian", // Default for now
        },
        itinerary: {
          tourId: tour.id,
          startDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
          endDate: selectedDate
            ? format(new Date(selectedDate.getTime() + tour.duration * 24 * 60 * 60 * 1000), "yyyy-MM-dd")
            : "",
          travelers: Number.parseInt(travelers),
        },
      })

      if (result.success) {
        setBookingComplete(true)
        setBookingReference(result.data.reference)
      } else {
        console.error("Booking failed:", result.error)
        alert("Booking failed. Please try again.")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    const basePrice = tour.price * Number.parseInt(travelers)
    const taxes = basePrice * 0.15
    return {
      basePrice,
      taxes,
      total: basePrice + taxes,
    }
  }

  const { basePrice, taxes, total } = calculateTotal()

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {bookingComplete ? (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Thank you for booking with This is Africa. Your booking reference is:</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-2xl font-bold text-amber-700">{bookingReference}</p>
            </div>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to {formData.email} with all the details of your booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push("/")} variant="outline">
                Return to Homepage
              </Button>
              <Button onClick={() => router.push("/booking")} className="bg-amber-500 hover:bg-amber-600">
                Book Another Tour
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Back button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push("/booking")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search Results
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tour details - Left column */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
                  <div className="relative h-[300px]">
                    <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{tour.name}</h1>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-1 text-amber-500" />
                        <span>{tour.destination}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-1 text-amber-500" />
                        <span>{tour.duration} days</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-1 text-amber-500" />
                        <span>Max 12 travelers</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6">{tour.longDescription || tour.description}</p>

                    <Tabs defaultValue="highlights">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="highlights">Highlights</TabsTrigger>
                        <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                        <TabsTrigger value="includes">Includes/Excludes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="highlights" className="pt-4">
                        <h3 className="text-xl font-semibold mb-4">Tour Highlights</h3>
                        {tour.highlights && tour.highlights.length > 0 ? (
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {tour.highlights.map((highlight: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600">Highlights will be provided upon booking confirmation.</p>
                        )}
                      </TabsContent>

                      <TabsContent value="itinerary" className="pt-4">
                        <h3 className="text-xl font-semibold mb-4">Tour Itinerary</h3>
                        {tour.itinerary && tour.itinerary.length > 0 ? (
                          <div className="space-y-4">
                            {tour.itinerary.map((day: any, index: number) => (
                              <div key={index} className="border-l-2 border-amber-500 pl-4 pb-4">
                                <h4 className="font-bold">
                                  Day {day.day || index + 1}: {day.title || day.name}
                                </h4>
                                <p className="text-gray-600">{day.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            Detailed itinerary will be provided upon booking confirmation.
                          </p>
                        )}
                      </TabsContent>

                      <TabsContent value="includes" className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Includes</h3>
                            {tour.includes && tour.includes.length > 0 ? (
                              <ul className="space-y-2">
                                {tour.includes.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-600">Inclusions will be detailed upon booking confirmation.</p>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Excludes</h3>
                            {tour.excludes && tour.excludes.length > 0 ? (
                              <ul className="space-y-2">
                                {tour.excludes.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <span className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5">✕</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-600">Exclusions will be detailed upon booking confirmation.</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Booking form - Right column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                  <h2 className="text-xl font-bold mb-4">Book This Tour</h2>

                  {bookingStep === 1 ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="departure-date">Departure Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !selectedDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                              disabled={(date) => {
                                // Disable past dates
                                return date < new Date()
                              }}
                            />
                            <div className="p-3 border-t border-gray-100">
                              <p className="text-sm text-gray-500">Select your preferred departure date</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Select value={travelers} onValueChange={setTravelers}>
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select number of travelers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Traveler</SelectItem>
                            <SelectItem value="2">2 Travelers</SelectItem>
                            <SelectItem value="3">3 Travelers</SelectItem>
                            <SelectItem value="4">4 Travelers</SelectItem>
                            <SelectItem value="5">5 Travelers</SelectItem>
                            <SelectItem value="6">6 Travelers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4 border-t border-gray-200 mt-6">
                        <div className="flex justify-between mb-2">
                          <span>
                            Base Price ({travelers} {Number.parseInt(travelers) === 1 ? "traveler" : "travelers"})
                          </span>
                          <span>${basePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Taxes & Fees</span>
                          <span>${taxes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>${total.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-amber-500 hover:bg-amber-600 mt-6"
                        onClick={() => setBookingStep(2)}
                        disabled={!selectedDate}
                      >
                        Continue to Booking
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitBooking} className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                        <Textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-200 mt-6">
                        <div className="flex justify-between mb-2">
                          <span>Tour</span>
                          <span className="text-right text-sm">{tour.name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Date</span>
                          <span>{selectedDate ? format(selectedDate, "PPP") : "Not selected"}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Travelers</span>
                          <span>{travelers}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>${total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button type="button" variant="outline" onClick={() => setBookingStep(1)} className="flex-1">
                          Back
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-amber-500 hover:bg-amber-600"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing
                            </>
                          ) : (
                            "Complete Booking"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
