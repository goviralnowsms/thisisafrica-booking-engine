"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, CheckCircle2, Clock, MapPin, Users, ArrowLeft, Loader2, Star } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TourDetails {
  id: string
  code: string
  name: string
  destination: string
  duration: number
  price: number
  description: string
  longDescription: string
  image: string
  gallery: string[]
  available: boolean
  highlights: string[]
  itinerary: Array<{
    day: number
    title: string
    description: string
  }>
  includes: string[]
  excludes: string[]
  departureDates: string[]
  maxGroupSize: number
  difficulty: string
  rating: number
}

function ProductDetailsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tourCode = searchParams.get("code")
  const tourId = searchParams.get("id")

  const [tour, setTour] = useState<TourDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [travelers, setTravelers] = useState("2")
  const [bookingStep, setBookingStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  // Load tour details
  useEffect(() => {
    async function loadTourDetails() {
      if (!tourCode && !tourId) {
        setLoading(false)
        return
      }

      try {
        // Simulate API call - replace with your actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock tour data - replace with actual API call using tourCode
        const mockTour: TourDetails = {
          id: tourId || "tour-001",
          code: tourCode || "SAF001",
          name: "Ultimate Safari Adventure",
          destination: "Kenya & Tanzania",
          duration: 10,
          price: 3499,
          description:
            "Experience the Big Five in their natural habitat across Kenya's Masai Mara and Tanzania's Serengeti.",
          longDescription:
            "Embark on the adventure of a lifetime with our Ultimate Safari Adventure. This comprehensive 10-day journey takes you through Kenya's world-famous Masai Mara and Tanzania's spectacular Serengeti National Park. Witness the Great Migration, encounter the Big Five, and immerse yourself in the rich cultures of the Maasai people. Our expert guides will ensure you have the best wildlife viewing opportunities while staying in carefully selected lodges that offer comfort and authenticity.",
          image: "/images/safari-lion.png",
          gallery: [
            "/images/safari-lion.png",
            "/images/victoria-falls.png",
            "/images/luxury-accommodation.png",
            "/images/zambezi-queen.png",
          ],
          available: true,
          highlights: [
            "Witness the Great Migration in Masai Mara",
            "Big Five game viewing in Serengeti",
            "Cultural visit to Maasai village",
            "Hot air balloon safari over the plains",
            "Professional wildlife photography guidance",
            "Luxury tented camp accommodations",
          ],
          itinerary: [
            {
              day: 1,
              title: "Arrival in Nairobi",
              description:
                "Arrive at Jomo Kenyatta International Airport. Transfer to your hotel and evening briefing about your safari adventure.",
            },
            {
              day: 2,
              title: "Nairobi to Masai Mara",
              description:
                "Morning flight to Masai Mara. Afternoon game drive in the reserve. Check into luxury tented camp.",
            },
            {
              day: 3,
              title: "Full Day Masai Mara",
              description:
                "Full day game drives with picnic lunch. Evening visit to Maasai village for cultural experience.",
            },
            {
              day: 4,
              title: "Hot Air Balloon Safari",
              description:
                "Early morning hot air balloon safari followed by champagne breakfast. Afternoon game drive.",
            },
            {
              day: 5,
              title: "Masai Mara to Serengeti",
              description: "Cross the border into Tanzania. Game drive en route to Serengeti National Park.",
            },
          ],
          includes: [
            "All accommodation as specified",
            "All meals during safari",
            "Professional English-speaking guide",
            "4WD safari vehicle with pop-up roof",
            "All park fees and conservancy fees",
            "Airport transfers",
            "Hot air balloon safari",
            "Cultural village visit",
          ],
          excludes: [
            "International flights",
            "Visa fees",
            "Travel insurance",
            "Personal expenses",
            "Alcoholic beverages",
            "Tips and gratuities",
            "Optional activities not mentioned",
          ],
          departureDates: ["2025-03-15", "2025-04-12", "2025-05-10", "2025-06-14", "2025-07-19", "2025-08-16"],
          maxGroupSize: 12,
          difficulty: "Easy",
          rating: 4.8,
        }

        setTour(mockTour)
      } catch (error) {
        console.error("Error loading tour details:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTourDetails()
  }, [tourCode, tourId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate booking submission - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Navigate to booking confirmation or success page
      router.push(`/booking-confirmation?reference=TIA${Date.now()}`)
    } catch (error) {
      console.error("Booking error:", error)
      alert("Booking failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateTotal = () => {
    if (!tour) return { basePrice: 0, taxes: 0, total: 0 }

    const basePrice = tour.price * Number.parseInt(travelers)
    const taxes = basePrice * 0.15
    return {
      basePrice,
      taxes,
      total: basePrice + taxes,
    }
  }

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
          <Button onClick={() => router.push("/booking-new")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  const { basePrice, taxes, total } = calculateTotal()

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/booking-new")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tour Details - Left Column */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden mb-8">
              <div className="relative h-[400px]">
                <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {tour.code}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{tour.rating}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-4">{tour.name}</h1>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                    <span>{tour.destination}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2 text-amber-500" />
                    <span>{tour.duration} days</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2 text-amber-500" />
                    <span>Max {tour.maxGroupSize} travelers</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{tour.longDescription}</p>

                <Tabs defaultValue="highlights" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="includes">Includes/Excludes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="highlights" className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Tour Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="itinerary" className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Day by Day Itinerary</h3>
                    <div className="space-y-6">
                      {tour.itinerary.map((day, index) => (
                        <div key={index} className="border-l-2 border-amber-500 pl-6 pb-6">
                          <h4 className="font-bold text-lg mb-2">
                            Day {day.day}: {day.title}
                          </h4>
                          <p className="text-gray-600">{day.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="includes" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-green-700">What's Included</h3>
                        <ul className="space-y-2">
                          {tour.includes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-red-700">What's Not Included</h3>
                        <ul className="space-y-2">
                          {tour.excludes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="h-5 w-5 mr-3 text-red-500 flex-shrink-0 mt-0.5">✕</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form - Right Column */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl">Book This Tour</CardTitle>
                <div className="text-2xl font-bold text-amber-600">
                  ${tour.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">per person</span>
                </div>
              </CardHeader>

              <CardContent>
                {bookingStep === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="departure-date">Departure Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
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
                              // Disable past dates and dates not in departure dates
                              const dateStr = format(date, "yyyy-MM-dd")
                              return date < new Date() || !tour.departureDates.includes(dateStr)
                            }}
                          />
                          <div className="p-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-2">Available departure dates:</p>
                            <div className="text-xs text-gray-400">
                              {tour.departureDates.map((date) => format(new Date(date), "MMM dd")).join(", ")}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="travelers">Number of Travelers</Label>
                      <Select value={travelers} onValueChange={setTravelers}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select travelers" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: tour.maxGroupSize }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Traveler" : "Travelers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between">
                        <span>
                          Base Price ({travelers} {Number.parseInt(travelers) === 1 ? "traveler" : "travelers"})
                        </span>
                        <span>${basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
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

                    <div className="pt-4 border-t border-gray-200 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tour</span>
                        <span className="text-right">{tour.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Code</span>
                        <span>{tour.code}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Date</span>
                        <span>{selectedDate ? format(selectedDate, "PPP") : "Not selected"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
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
                      <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
            <p className="text-lg text-gray-600">Loading tour details...</p>
          </div>
        </div>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  )
}
