"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Search, Loader2, Star, Calendar } from "lucide-react"
import { getAvailableCountriesFromAPI, getAvailableDestinationsFromAPI, getTourPlanDestinationNameFromValue } from "@/lib/dynamic-destination-mapping"
import { shouldShowDepartureDay, getDepartureDayMessage } from "@/lib/group-tours-availability"


export default function GroupToursPage() {
  const router = useRouter()
  const [tours, setTours] = useState<any[]>([])
  const [filteredTours, setFilteredTours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [productImages, setProductImages] = useState<{[key: string]: string}>({})
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string}[]>([])
  const [availableDestinations, setAvailableDestinations] = useState<{value: string, label: string, tourPlanName: string}[]>([])

  // Load the product image index once on component mount
  useEffect(() => {
    const loadImageIndex = async () => {
      try {
        const response = await fetch('/images/product-image-index.json')
        if (!response.ok) {
          console.warn('Product image index not found, using default images')
          return
        }
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Product image index returned non-JSON response')
          return
        }
        const imageIndex = await response.json()
        
        // Create a mapping of product codes to their primary images
        const imageMap: {[key: string]: string} = {}
        
        Object.keys(imageIndex).forEach(productCode => {
          const images = imageIndex[productCode]
          if (images && images.length > 0) {
            // Use the first available image as primary
            const primaryImage = images.find((img: any) => img.status === 'exists')
            if (primaryImage && primaryImage.localPath) {
              imageMap[productCode] = primaryImage.localPath
            }
          }
        })
        
        setProductImages(imageMap)
      } catch (error) {
        console.warn('Failed to load image index:', error)
      }
    }
    
    loadImageIndex()
    
    // Load available countries dynamically from TourPlan API
    const loadCountries = async () => {
      try {
        const countries = await getAvailableCountriesFromAPI('Group Tours')
        setAvailableCountries(countries)
        console.log('✅ Loaded', countries.length, 'countries for Group Tours from TourPlan API')
      } catch (error) {
        console.error('❌ Failed to load countries:', error)
        setAvailableCountries([])
      }
    }
    
    loadCountries()
  }, [])

  // Update available destinations when country changes
  useEffect(() => {
    if (selectedCountry) {
      const loadDestinations = async () => {
        try {
          const destinations = await getAvailableDestinationsFromAPI('Group Tours', selectedCountry)
          setAvailableDestinations(destinations)
          console.log('✅ Loaded', destinations.length, 'destinations for', selectedCountry)
        } catch (error) {
          console.error('❌ Failed to load destinations for', selectedCountry, error)
          setAvailableDestinations([])
        }
      }
      
      loadDestinations()
      // Reset destination selection when country changes
      setSelectedDestination("")
    } else {
      setAvailableDestinations([])
      setSelectedDestination("")
    }
  }, [selectedCountry])

  // Function to get product-specific image from cached data or fallback
  const getProductImage = (tourCode: string) => {
    if (!tourCode) return "/images/safari-lion.png"
    
    // Check if we have the image cached
    if (productImages[tourCode]) {
      return productImages[tourCode]
    }
    
    // Fallback to generic safari image
    return "/images/safari-lion.png"
  }

  const handleSearch = async () => {
    if (!selectedCountry) {
      alert('Please select a country to search for Group Tours')
      return
    }

    console.log('🦁 Starting group tours search...')
    setLoading(true)
    setSearchPerformed(false)

    try {
      // Build search URL with parameters
      const params = new URLSearchParams()
      params.set('productType', 'Group Tours')
      
      // Use the correct TourPlan destination name
      const tourPlanDestination = getTourPlanDestinationNameFromValue('Group Tours', selectedCountry, selectedDestination || selectedCountry)
      params.set('destination', tourPlanDestination)
      
      if (selectedClass) params.set('class', selectedClass)
      
      console.log('🦁 Group tours search params:', params.toString())
      
      const response = await fetch(`/api/tourplan?${params.toString()}`)
      const result = await response.json()

      console.log('🦁 Group tours search response:', result)

      if (result.success) {
        console.log('🦁 Found', result.tours?.length || 0, 'group tours')
        console.log('🦁 Setting tours and filteredTours...')
        const tourList = result.tours || []
        setTours(tourList)
        setFilteredTours(tourList)
        console.log('🦁 Tours state updated')
      } else {
        console.error("🦁 Group tours search failed:", result.error)
        setTours([])
        setFilteredTours([])
      }
    } catch (error) {
      console.error("🦁 Search error:", error)
      setTours([])
      setFilteredTours([])
    } finally {
      console.log('🦁 Setting loading=false, searchPerformed=true')
      setLoading(false)
      setSearchPerformed(true)
      console.log('🦁 Search complete. Final state:', { 
        loading: false, 
        searchPerformed: true, 
        toursLength: tours.length,
        filteredToursLength: filteredTours.length 
      })
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Guided group tours</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Join like-minded travelers on expertly guided small group adventures across Africa
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Experience the magic of Africa with fellow adventurers, expert guides, and unforgettable shared moments
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find Your Perfect Group Adventure</h2>
            <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
              Guided group tours offer a cost-effective way to travel from place to place in Africa with like-minded others. Group tours depart on scheduled dates and typically include most services, such as transport, accommodation, meals and activities. Group sizes vary from six to 20 passengers and solo travellers may have a single supplement option.
            </p>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value)}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedDestination} 
                  onValueChange={(value) => setSelectedDestination(value)}
                  disabled={!selectedCountry || availableDestinations.length === 0}
                >
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500 disabled:bg-gray-400 disabled:text-gray-600">
                    <SelectValue placeholder={selectedCountry ? "Select Destination" : "Select Country First"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDestinations.map((destination) => (
                      <SelectItem key={destination.value} value={destination.value}>
                        {destination.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value)}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {(loading || searchPerformed) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
                <p className="text-lg text-gray-600">Searching for Guided group tours...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    Guided group tours {filteredTours.length > 0 && `(${filteredTours.length} tours found)`}
                  </h2>
                  {filteredTours.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Showing results for {selectedCountry || selectedDestination}
                    </div>
                  )}
                </div>

                {filteredTours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTours.map((tour) => (
                      <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="relative h-48">
                          <Image 
                            src={getProductImage(tour.code)} 
                            alt={tour.name} 
                            fill 
                            className="object-cover"
                            onError={(e) => {
                              // Fallback to generic safari image if product image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/safari-lion.png";
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">Guided group tour</Badge>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{tour.duration || 'Multiple days'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{tour.supplier}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">From</p>
                              {tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 ? (
                                <p className="text-lg font-bold text-blue-600">On Request</p>
                              ) : (
                                <p className="text-xl font-bold text-green-600">
                                  ${tour.rates[0]?.singleRate ? Math.round(tour.rates[0].singleRate / 100).toLocaleString() : 'POA'}
                                </p>
                              )}
                              {shouldShowDepartureDay(tour.code) && (
                                <p className="text-xs text-gray-500 mt-1">{getDepartureDayMessage(tour.code)}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Link href={`/products/${tour.code}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                View details
                              </Button>
                            </Link>
                            {tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 ? (
                              <Button 
                                className="flex-1 bg-blue-500 hover:bg-blue-600"
                                onClick={() => router.push(`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}`)}
                              >
                                Get quote
                              </Button>
                            ) : (
                              <Button 
                                className="flex-1 bg-amber-500 hover:bg-amber-600"
                                onClick={() => router.push(`/booking/create?tourId=${tour.code}`)}
                              >
                                Book now
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">No group tours found for your search criteria.</p>
                    <p className="text-gray-500 mb-6">Try selecting a different country or destination.</p>
                    <Button onClick={() => {
                      setSelectedCountry("")
                      setSelectedDestination("")
                      setSelectedClass("")
                      setSearchPerformed(false)
                      setTours([])
                      setFilteredTours([])
                    }}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Group Tours Benefits */}
      {(searchPerformed && filteredTours.length > 0) && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why choose guided group tours?</h2>
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
      )}

      {/* Brochure Download Banner */}
      {!searchPerformed && (
        <section className="relative py-16">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url("/images/products/rsz_leopard-in-tree.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discover more African adventures
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Download our comprehensive 2025 brochure featuring all our tours, 
              exclusive packages, and expert travel tips for your African journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a
                href="/pdfs/products/Brochure-2025-Web.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
              >
                <span className="mr-2">📥</span>
                Download 2025 brochure
              </a>
              <Link
                href="/contact?subject=brochure-request"
                className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors"
              >
                <span className="mr-2">✉️</span>
                Request printed copy
              </Link>
            </div>
            <div className="text-white/80">
              <Link href="/contact">
                <Button 
                  className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-800 mr-4"
                >
                  Need help?
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
