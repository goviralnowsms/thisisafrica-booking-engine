"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, MapPin, Users, Star, Filter, Search, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

async function fetchGroupTours(params: Record<string, string>) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`/api/tourplan?${query}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch tours")
  return (await res.json()) as { success: boolean; data: any[] }
}

export default function GroupToursPage() {
  const router = useRouter()
  const [tours, setTours] = useState<any[]>([])
  const [filteredTours, setFilteredTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedDuration, setSelectedDuration] = useState("any")
  const [selectedBudget, setSelectedBudget] = useState("any")
  const [departureDate, setDepartureDate] = useState<Date>()

  // Load group tours on component mount
  useEffect(() => {
    async function loadGroupTours() {
      try {
        // Build search parameters for the API
        const searchParams: Record<string, string> = {}

        if (selectedCountry !== "all") {
          searchParams.destination = selectedCountry
        }

        if (departureDate) {
          searchParams.startDate = format(departureDate, "yyyy-MM-dd")
        }

        const result = await fetchGroupTours(searchParams)

        if (result.success) {
          // Use real Tourplan API data without adding mock data
          setTours(result.data)
          setFilteredTours(result.data)
        } else {
          console.error("Failed to load tours from API")
          setTours([])
          setFilteredTours([])
        }
      } catch (error) {
        console.error("Error loading group tours:", error)
        setTours([])
        setFilteredTours([])
      } finally {
        setLoading(false)
      }
    }

    loadGroupTours()
  }, [selectedCountry, departureDate])

  // Filter tours based on search criteria (client-side filtering for immediate response)
  useEffect(() => {
    let filtered = tours

    if (searchTerm) {
      filtered = filtered.filter(
        (tour) =>
          tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDuration !== "any") {
      const [min, max] = selectedDuration.split("-").map(Number)
      filtered = filtered.filter((tour) => {
        const duration = tour.duration || 1
        if (max) {
          return duration >= min && duration <= max
        } else {
          return duration >= min
        }
      })
    }

    if (selectedBudget !== "any") {
      const [min, max] = selectedBudget.split("-").map(Number)
      filtered = filtered.filter((tour) => {
        const price = tour.price || 0
        if (max) {
          return price >= min && price <= max
        } else {
          return price >= min
        }
      })
    }

    setFilteredTours(filtered)
  }, [searchTerm, selectedDuration, selectedBudget, tours])

  const handleBookTour = (tourId: string) => {
    router.push(`/booking/details?tourId=${tourId}`)
  }

  const handleApplyFilters = async () => {
    setLoading(true)

    try {
      // Build search parameters for server-side filtering
      const searchParams: Record<string, string> = {}

      if (selectedCountry !== "all") {
        searchParams.destination = selectedCountry
      }

      if (departureDate) {
        searchParams.startDate = format(departureDate, "yyyy-MM-dd")
      }

      // Add travelers parameter for group tours (assuming group tours have multiple travelers)
      searchParams.travelers = "4" // Default group size

      const result = await fetchGroupTours(searchParams)

      if (result.success) {
        setTours(result.data)
        setFilteredTours(result.data)
      }
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/group-tours-banner.jpg"
          alt="Group safari expedition with photographers and flamingos"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Group Tours</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Join like-minded travelers on expertly guided small group adventures across Africa
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Experience the magic of Africa with fellow adventurers, expert guides, and unforgettable shared moments
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find Your Perfect Group Adventure</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="search">Search Tours</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="south-africa">South Africa</SelectItem>
                    <SelectItem value="botswana">Botswana</SelectItem>
                    <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                    <SelectItem value="zambia">Zambia</SelectItem>
                    <SelectItem value="namibia">Namibia</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Duration</SelectItem>
                    <SelectItem value="1-5">1-5 days</SelectItem>
                    <SelectItem value="6-10">6-10 days</SelectItem>
                    <SelectItem value="11-15">11-15 days</SelectItem>
                    <SelectItem value="16">16+ days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Budget</SelectItem>
                    <SelectItem value="0-2000">Under $2,000</SelectItem>
                    <SelectItem value="2000-4000">$2,000 - $4,000</SelectItem>
                    <SelectItem value="4000-6000">$4,000 - $6,000</SelectItem>
                    <SelectItem value="6000">$6,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departure">Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "MMM yyyy") : "Any Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={departureDate} onSelect={setDepartureDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="bg-amber-500 hover:bg-amber-600 px-8" onClick={handleApplyFilters} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Group Tours Benefits */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Group Tours?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Like-Minded Travelers</h3>
                <p className="text-gray-600">
                  Meet fellow adventurers who share your passion for exploration and discovery
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
                <p className="text-gray-600">
                  Professional local guides with extensive knowledge and years of experience
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Small Groups</h3>
                <p className="text-gray-600">Maximum 12 travelers for a more intimate and personalized experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Listing */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              Available Group Tours {filteredTours.length > 0 && `(${filteredTours.length} tours)`}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredTours.length} of {tours.length} tours
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Loading group tours...</p>
            </div>
          ) : filteredTours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={tour.image || "/placeholder.svg"}
                      alt={tour.name || "Tour"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-500 hover:bg-amber-600">Group Tour</Badge>
                    </div>
                    {tour.available && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Available
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2">{tour.name || "African Adventure"}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tour.description || "Experience the wonders of Africa on this guided tour"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                          <span>{tour.destination || "Africa"}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-amber-500" />
                          <span>{tour.duration || 7} days</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-amber-500" />
                          <span>Small Group</span>
                        </div>
                        {tour.highlights && tour.highlights.length > 0 && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-amber-500 fill-amber-500" />
                            <span>{tour.highlights.length} highlights</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {tour.departureDates && tour.departureDates.length > 0 && (
                            <div>
                              <span className="text-gray-500 text-sm">Next departure:</span>
                              <div className="font-medium text-sm">
                                {format(new Date(tour.departureDates[0]), "MMM dd, yyyy")}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">From</div>
                          <div className="text-xl font-bold">${(tour.price || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/booking/details?tourId=${tour.id}`)}
                    >
                      View Details
                    </Button>
                    <Button className="flex-1 bg-amber-500 hover:bg-amber-600" onClick={() => handleBookTour(tour.id)}>
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">No group tours found matching your criteria.</p>
              <p className="text-gray-500 mb-6">Try adjusting your search filters or browse all available tours.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCountry("all")
                  setSelectedDuration("any")
                  setSelectedBudget("any")
                  setDepartureDate(undefined)
                  handleApplyFilters()
                }}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Group Adventure?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the magic of Africa through our expertly guided group tours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600" onClick={() => router.push("/booking")}>
              Browse All Tours
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Contact Our Experts
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
