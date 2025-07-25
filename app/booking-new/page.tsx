"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Search, MapPin, Clock, Star, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Tour {
  id: string
  code: string
  name: string
  destination: string
  duration: number
  price: number
  description: string
  image: string
  available: boolean
  rating: number
  highlights: string[]
}

function BookingSearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [destination, setDestination] = useState("all")
  const [departureDate, setDepartureDate] = useState<Date>()
  const [travelers, setTravelers] = useState("2")
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  // Mock tour data - replace with actual API call
  const mockTours: Tour[] = [
    {
      id: "1",
      code: "SAF001",
      name: "Ultimate Safari Adventure",
      destination: "Kenya & Tanzania",
      duration: 10,
      price: 3499,
      description:
        "Experience the Big Five in their natural habitat across Kenya's Masai Mara and Tanzania's Serengeti.",
      image: "/images/safari-lion.png",
      available: true,
      rating: 4.8,
      highlights: ["Big Five viewing", "Great Migration", "Maasai culture", "Hot air balloon safari"],
    },
    {
      id: "2",
      code: "VIC002",
      name: "Victoria Falls Explorer",
      destination: "Zimbabwe & Zambia",
      duration: 7,
      price: 2299,
      description: "Witness the thundering Victoria Falls and enjoy adventure activities on the Zambezi River.",
      image: "/images/victoria-falls.png",
      available: true,
      rating: 4.6,
      highlights: ["Victoria Falls", "Zambezi River cruise", "Adventure activities", "Local markets"],
    },
    {
      id: "3",
      code: "LUX003",
      name: "Luxury Lodge Experience",
      destination: "South Africa",
      duration: 5,
      price: 4999,
      description: "Indulge in luxury accommodations while experiencing world-class game viewing.",
      image: "/images/luxury-accommodation.png",
      available: false,
      rating: 4.9,
      highlights: ["5-star lodges", "Private game drives", "Spa treatments", "Fine dining"],
    },
    {
      id: "4",
      code: "RIV004",
      name: "Zambezi River Cruise",
      destination: "Botswana",
      duration: 8,
      price: 3799,
      description: "Cruise the pristine waters of the Zambezi River aboard the luxury Zambezi Queen.",
      image: "/images/zambezi-queen.png",
      available: true,
      rating: 4.7,
      highlights: ["Luxury river cruise", "Wildlife viewing", "Chobe National Park", "Sunset cruises"],
    },
    {
      id: "5",
      code: "TAI005",
      name: "Tailor-Made Safari",
      destination: "Multiple Countries",
      duration: 14,
      price: 5999,
      description: "Create your perfect African adventure with our fully customizable safari experience.",
      image: "/images/tailor-made-safari.png",
      available: true,
      rating: 4.8,
      highlights: ["Fully customizable", "Private guide", "Multiple countries", "Luxury accommodations"],
    },
    {
      id: "6",
      code: "RAI006",
      name: "African Rail Journey",
      destination: "South Africa",
      duration: 12,
      price: 4299,
      description: "Experience Africa's landscapes from the comfort of a luxury train journey.",
      image: "/images/rail-journey.png",
      available: true,
      rating: 4.5,
      highlights: ["Luxury train travel", "Scenic routes", "Fine dining", "Cultural experiences"],
    },
  ]

  // Load tours on component mount
  useEffect(() => {
    async function loadTours() {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTours(mockTours)
        setFilteredTours(mockTours)
      } catch (error) {
        console.error("Error loading tours:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTours()
  }, [])

  // Filter tours based on search criteria
  useEffect(() => {
    let filtered = tours

    // Text search
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Destination filter
    if (destination !== "all") {
      filtered = filtered.filter((tour) => tour.destination.toLowerCase().includes(destination.toLowerCase()))
    }

    setFilteredTours(filtered)
  }, [searchQuery, destination, tours])

  const handleSearch = async () => {
    setSearching(true)
    try {
      // Simulate API search call
      await new Promise((resolve) => setTimeout(resolve, 500))
      // In real implementation, this would make an API call with search parameters
      console.log("Searching with:", { searchQuery, destination, departureDate, travelers })
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setSearching(false)
    }
  }

  const handleTourSelect = (tour: Tour) => {
    if (!tour.available) {
      alert("This tour is currently unavailable. Please contact us for alternative dates.")
      return
    }

    // Navigate to product details page with tour code
    router.push(`/product-details?code=${tour.code}&id=${tour.id}`)
  }

  const destinations = [
    { value: "all", label: "All Destinations" },
    { value: "kenya", label: "Kenya" },
    { value: "tanzania", label: "Tanzania" },
    { value: "south africa", label: "South Africa" },
    { value: "botswana", label: "Botswana" },
    { value: "zimbabwe", label: "Zimbabwe" },
    { value: "zambia", label: "Zambia" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
          <p className="text-lg text-gray-600">Loading tours...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect African Adventure</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search and book from our collection of carefully curated tours and experiences across Africa.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search Tours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Tour Name, Destination, or Code</Label>
                <Input
                  id="search"
                  placeholder="e.g., Safari, Kenya, SAF001"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="destination">Destination</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest.value} value={dest.value}>
                        {dest.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="departure">Departure Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
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

              <div>
                <Label htmlFor="travelers">Travelers</Label>
                <Select value={travelers} onValueChange={setTravelers}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Traveler" : "Travelers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Button onClick={handleSearch} className="bg-amber-500 hover:bg-amber-600" disabled={searching}>
                {searching ? (
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

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredTours.length} Tour{filteredTours.length !== 1 ? "s" : ""} Found
          </h2>
          <p className="text-gray-600">
            {searchQuery && `Results for "${searchQuery}"`}
            {destination !== "all" && ` in ${destinations.find((d) => d.value === destination)?.label}`}
          </p>
        </div>

        {/* Tour Grid */}
        {filteredTours.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all available tours.</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setDestination("all")
                  setDepartureDate(undefined)
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Card
                key={tour.id}
                className={cn(
                  "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
                  !tour.available && "opacity-60 cursor-not-allowed",
                )}
                onClick={() => handleTourSelect(tour)}
              >
                <div className="relative h-48">
                  <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                  <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {tour.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="text-xs font-medium">{tour.rating}</span>
                  </div>
                  {!tour.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary" className="bg-red-500 text-white">
                        Unavailable
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{tour.name}</h3>

                  <div className="flex flex-wrap gap-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                      <span>{tour.destination}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-amber-500" />
                      <span>{tour.duration} days</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {tour.highlights.slice(0, 2).map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {tour.highlights.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{tour.highlights.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">${tour.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                    <Button
                      size="sm"
                      className={cn(
                        "bg-amber-500 hover:bg-amber-600",
                        !tour.available && "bg-gray-400 cursor-not-allowed",
                      )}
                      disabled={!tour.available}
                    >
                      {tour.available ? "View Details" : "Unavailable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function BookingSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4 mx-auto" />
            <p className="text-lg text-gray-600">Loading search...</p>
          </div>
        </div>
      }
    >
      <BookingSearchContent />
    </Suspense>
  )
}
