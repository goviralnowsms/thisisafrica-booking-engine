"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search, MapPin, Clock, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Tour {
  id: string
  name: string
  destination: string
  duration: number
  price: number
  description: string
  image: string
  available: boolean
  code?: string
}

export default function BookingNewPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [destination, setDestination] = useState("all")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [travelers, setTravelers] = useState("1")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Tour[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Mock search function - replace with your actual API call
  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock results - replace with actual API call
      const mockResults: Tour[] = [
        {
          id: "tour-001",
          code: "SAF001",
          name: "Ultimate Safari Adventure",
          destination: "Kenya & Tanzania",
          duration: 10,
          price: 3499,
          description:
            "Experience the Big Five in their natural habitat across Kenya's Masai Mara and Tanzania's Serengeti.",
          image: "/images/safari-lion.png",
          available: true,
        },
        {
          id: "tour-002",
          code: "VF002",
          name: "Victoria Falls Explorer",
          destination: "Zimbabwe & Zambia",
          duration: 7,
          price: 2899,
          description: "Witness the power of Victoria Falls and enjoy adventure activities on the Zambezi River.",
          image: "/images/victoria-falls.png",
          available: true,
        },
        {
          id: "tour-003",
          code: "CT003",
          name: "Cape Town & Wine Country",
          destination: "South Africa",
          duration: 8,
          price: 2299,
          description: "Explore Cape Town's stunning landscapes and world-renowned wine regions.",
          image: "/images/luxury-accommodation.png",
          available: false,
        },
        {
          id: "tour-004",
          code: "GOR004",
          name: "Gorilla Trekking Experience",
          destination: "Rwanda & Uganda",
          duration: 6,
          price: 4299,
          description:
            "Get up close with mountain gorillas in their natural habitat in the forests of Rwanda and Uganda.",
          image: "/images/gorilla-news.png",
          available: true,
        },
      ]

      // Filter results based on search criteria
      let filteredResults = mockResults

      if (searchQuery) {
        filteredResults = filteredResults.filter(
          (tour) =>
            tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tour.code?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      if (destination !== "all") {
        filteredResults = filteredResults.filter((tour) =>
          tour.destination.toLowerCase().includes(destination.toLowerCase()),
        )
      }

      setSearchResults(filteredResults)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectTour = (tour: Tour) => {
    if (!tour.available) {
      alert("This tour is currently not available. Please select another tour or contact us for alternatives.")
      return
    }

    // Navigate to product details page with tour code
    router.push(`/product-details?code=${tour.code}&id=${tour.id}`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh]">
        <Image src="/images/safari-lion.png" alt="African safari booking" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Book Your African Adventure</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Search and book from our curated selection of tours and experiences
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Find Your Perfect Tour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Tours</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Search by tour name, destination, or tour code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Destinations</SelectItem>
                      <SelectItem value="kenya">Kenya</SelectItem>
                      <SelectItem value="tanzania">Tanzania</SelectItem>
                      <SelectItem value="south-africa">South Africa</SelectItem>
                      <SelectItem value="botswana">Botswana</SelectItem>
                      <SelectItem value="namibia">Namibia</SelectItem>
                      <SelectItem value="zambia">Zambia</SelectItem>
                      <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                      <SelectItem value="rwanda">Rwanda</SelectItem>
                      <SelectItem value="uganda">Uganda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {departureDate ? format(departureDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={departureDate}
                        onSelect={setDepartureDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelers">Travelers</Label>
                  <Select value={travelers} onValueChange={setTravelers}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Traveler</SelectItem>
                      <SelectItem value="2">2 Travelers</SelectItem>
                      <SelectItem value="3">3 Travelers</SelectItem>
                      <SelectItem value="4">4 Travelers</SelectItem>
                      <SelectItem value="5">5 Travelers</SelectItem>
                      <SelectItem value="6+">6+ Travelers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <Button onClick={handleSearch} disabled={isSearching} className="bg-amber-500 hover:bg-amber-600 px-8">
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Tours
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
                  <p className="text-lg text-gray-600">Searching for tours...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">
                    Search Results {searchResults.length > 0 && `(${searchResults.length} tours found)`}
                  </h2>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.map((tour) => (
                        <Card key={tour.id} className={`overflow-hidden ${!tour.available ? "opacity-60" : ""}`}>
                          <div className="relative h-48">
                            <Image
                              src={tour.image || "/placeholder.svg"}
                              alt={tour.name}
                              fill
                              className="object-cover"
                            />
                            {!tour.available && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Not Available
                                </span>
                              </div>
                            )}
                            {tour.code && (
                              <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium">
                                {tour.code}
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>

                            <div className="flex justify-between items-center mb-4">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{tour.destination}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{tour.duration} days</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">From</p>
                                <p className="text-xl font-bold">${tour.price.toLocaleString()}</p>
                              </div>
                            </div>

                            <Button
                              onClick={() => handleSelectTour(tour)}
                              disabled={!tour.available}
                              className={`w-full ${
                                tour.available ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-300 cursor-not-allowed"
                              }`}
                            >
                              {tour.available ? "View Details & Book" : "Not Available"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-lg text-gray-600 mb-4">No tours found matching your criteria.</p>
                      <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
