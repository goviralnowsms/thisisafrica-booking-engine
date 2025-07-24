"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { BookingSearch } from "@/components/booking-search"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { searchTours } from "@/lib/tourplan-api"

export default function BookingPage() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedTour, setSelectedTour] = useState<any | null>(null)

  // Real search functionality using TourPlan API
  const handleSearch = async (searchParams: any) => {
    setIsSearching(true)

    try {
      console.log("Search params:", searchParams)
      const result = await searchTours({
        destination: searchParams.destination,
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        travelers: searchParams.travelers,
      })

      if (result.success) {
        setSearchResults(result.data)
      } else {
        console.error("Search failed:", result.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
      setSearchPerformed(true)
    }
  }

  const handleSelectTour = (tour: any) => {
    setSelectedTour(tour)
    router.push(`/booking/details?tourId=${tour.id}`)
  }

  const handleBookNow = (tour: any) => {
    console.log("Booking tour:", tour.id)
    router.push(`/booking/create?tourId=${tour.id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh]">
        <Image src="/images/safari-lion.png" alt="African safari experience" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Find Your Perfect African Adventure</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Search our curated selection of tours, safaris, and experiences
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Search Tours & Safaris</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <BookingSearch onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Searching for the perfect experiences...</p>
            </div>
          ) : searchPerformed ? (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Search Results {searchResults.length > 0 && `(${searchResults.length} tours found)`}
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((tour) => (
                    <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
                      <div className="relative h-48">
                        <Image src={tour.image || "/placeholder.svg"} alt={tour.name} fill className="object-cover" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <span className="font-medium mr-2">Duration:</span> {tour.duration} days
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium mr-2">Destination:</span> {tour.destination}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">From</p>
                            <p className="text-xl font-bold">${tour.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleSelectTour(tour)}
                          >
                            View Details
                          </Button>
                          <Link href={`/booking/create?tourId=${tour.id}`} className="flex-1">
                            <Button className="w-full bg-amber-500 hover:bg-amber-600">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-600 mb-4">No tours found matching your criteria.</p>
                  <p className="text-gray-500">Try adjusting your search parameters or browse our featured packages.</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}
