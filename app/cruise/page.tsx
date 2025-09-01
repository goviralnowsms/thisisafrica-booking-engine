"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, MapPin, Users, Search, Loader2, Star, Ship, Calendar } from "lucide-react"
import { getAvailableCountries, getAvailableDestinations, getTourPlanDestinationName } from "@/lib/destination-mapping"
import { hasCruiseAvailability, getCruiseAvailability } from "@/lib/cruise-availability"
import { shouldShowDestinationAndClass } from "@/lib/cruise-region-mapping"


export default function CruisesPage() {
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
  const [productAvailability, setProductAvailability] = useState<{[key: string]: boolean}>({}) // Track availability for each product
  const [availableDestinationFilters, setAvailableDestinationFilters] = useState<string[]>([]) // Countries from tour amenities
  const [selectedDestinationFilters, setSelectedDestinationFilters] = useState<string[]>([]) // Selected country filters

  // Load the product image index once on component mount
  useEffect(() => {
    const loadImageIndex = async () => {
      try {
        const response = await fetch('/images/product-image-index.json')
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
    
    // Initialize available countries for Cruises
    const countries = getAvailableCountries('Cruises')
    setAvailableCountries(countries)
  }, [])

  // Update available destinations when country changes
  useEffect(() => {
    if (selectedCountry) {
      const destinations = getAvailableDestinations('Cruises', selectedCountry)
      setAvailableDestinations(destinations)
      // Reset destination selection when country changes
      setSelectedDestination("")
    } else {
      setAvailableDestinations([])
      setSelectedDestination("")
    }
  }, [selectedCountry])

  // Apply destination filtering when selectedDestinationFilters changes
  useEffect(() => {
    if (selectedDestinationFilters.length === 0) {
      // No filters selected - show all tours
      setFilteredTours(tours)
    } else {
      // Filter tours that include at least one of the selected countries
      const filtered = tours.filter((tour: any) => {
        if (!tour.countries || !Array.isArray(tour.countries)) return false
        return selectedDestinationFilters.some(selectedCountry =>
          tour.countries.includes(selectedCountry)
        )
      })
      setFilteredTours(filtered)
      console.log(`🌍 Filtered ${tours.length} tours to ${filtered.length} based on destinations:`, selectedDestinationFilters)
    }
  }, [selectedDestinationFilters, tours])

  // Handle destination filter checkbox changes
  const handleDestinationFilterChange = (country: string, checked: boolean) => {
    if (checked) {
      setSelectedDestinationFilters(prev => [...prev, country])
    } else {
      setSelectedDestinationFilters(prev => prev.filter(c => c !== country))
    }
  }

  // Function to get product-specific image from cached data or fallback
  const getProductImage = (tourCode: string) => {
    if (!tourCode) return "/images/cruise-ship.jpg"
    
    // Check if we have the image cached
    if (productImages[tourCode]) {
      return productImages[tourCode]
    }
    
    // Fallback to generic cruise image
    return "/images/cruise-ship.jpg"
  }

  // Check if a product has available dates
  const checkProductAvailability = async (productCode: string) => {
    try {
      // Get next 3 months of pricing data to check for available dates
      const currentDate = new Date()
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate())
      
      const params = new URLSearchParams({
        dateFrom: currentDate.toISOString().split('T')[0],
        dateTo: endDate.toISOString().split('T')[0],
        adults: '2',
        children: '0',
        roomType: 'DB'
      })

      const response = await fetch(`/api/tourplan/pricing/${productCode}?${params}`, {
        cache: 'no-store'
      })
      const result = await response.json()

      if (result.success && result.data?.calendar) {
        // Check if there are any valid/available days in the calendar
        const hasValidDays = result.data.calendar.some((day: any) => day.validDay && day.available)
        setProductAvailability(prev => ({ ...prev, [productCode]: hasValidDays }))
      } else {
        // If we can't get calendar data, default to false (show Get Quote)
        setProductAvailability(prev => ({ ...prev, [productCode]: false }))
      }
    } catch (error) {
      console.warn('Error checking availability for', productCode, ':', error)
      // On error, default to false (show Get Quote)
      setProductAvailability(prev => ({ ...prev, [productCode]: false }))
    }
  }

  const handleSearch = async () => {
    if (!selectedCountry) {
      alert('Please select a country to search for Cruises')
      return
    }

    console.log('🚢 Starting cruise search using TourPlan API...')
    setLoading(true)
    setSearchPerformed(false)
    // Clear destination filters for new search
    setSelectedDestinationFilters([])
    setAvailableDestinationFilters([])

    try {
      // Build search criteria for API - only include destination if specific destination is selected
      const searchCriteria: any = {
        productType: 'Cruises',
        dateFrom: new Date().toISOString().split('T')[0], // Today's date
        cabinConfigs: [
          {
            Adults: 2,
            Children: 0,
            Type: 'DB',
            Quantity: 1
          }
        ]
      }

      // Only add destination if a specific destination (not just country) is selected
      if (selectedDestination && selectedDestination !== "select-option") {
        // Map specific destination selections to TourPlan destination names
        let destinationForAPI = selectedDestination
        if (selectedDestination.toLowerCase() === 'kasane airport') {
          destinationForAPI = 'Kasane Airport'
        }
        searchCriteria.destination = destinationForAPI
      } else if (selectedCountry && selectedClass && selectedClass !== "select-option") {
        // If no specific destination but both country and class are selected, use country as destination
        let destinationForAPI = selectedCountry
        if (selectedCountry.toLowerCase() === 'botswana') {
          destinationForAPI = 'Kasane Airport'
        } else if (selectedCountry.toLowerCase() === 'namibia') {
          destinationForAPI = 'Namibia'
        } else if (selectedCountry.toLowerCase() === 'zimbabwe') {
          destinationForAPI = 'Namibia'
        }
        searchCriteria.destination = destinationForAPI
      }
      // If only country is selected (no destination, no class), don't set destination - this will return all cruises

      // Only include class if selected
      if (selectedClass && selectedClass !== "select-option") {
        searchCriteria.class = selectedClass
      }

      console.log('🚢 Search criteria:', searchCriteria)

      // Call the optimized API search endpoint
      const response = await fetch('/api/tourplan/search-fast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
      })

      const result = await response.json()
      console.log('🚢 API search result:', result)

      if (!result.success) {
        console.error('❌ API search failed:', result)
        setTours([])
        setFilteredTours([])
        setLoading(false)
        setSearchPerformed(true)
        return
      }

      const products = result.tours || []
      console.log(`🚢 API returned ${products.length} cruise products (filtered by destination+class)`)

      if (products.length === 0) {
        setTours([])
        setFilteredTours([])
        setLoading(false)
        setSearchPerformed(true)
        return
      }

      // Check availability for each product
      products.forEach((product: any) => {
        if (product.code) {
          checkProductAvailability(product.code)
        }
      })
      
      // Add countries for destination filtering UI
      products.forEach((product: any) => {
        // All cruise products operate in Botswana/Namibia region
        product.countries = ['Botswana', 'Namibia']
      })
      
      // Set destination filters
      setAvailableDestinationFilters(['Botswana', 'Namibia'])
      
      setTours(products)
      setFilteredTours(products) // API already handles filtering, no need for client-side filtering
      console.log(`🚢 Successfully loaded ${products.length} cruise products via API`)
      
    } catch (error) {
      console.error('❌ Error searching cruises:', error)
      setTours([])
      setFilteredTours([])
    } finally {
      console.log('🚢 Setting loading=false, searchPerformed=true')
      setLoading(false)
      setSearchPerformed(true)
    }
  }


  console.log('🚢 Render - State:', { 
    loading, 
    searchPerformed, 
    toursLength: tours.length, 
    filteredToursLength: filteredTours.length,
    showResults: loading || searchPerformed
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/cruise-hero.jpg"
          alt="Luxury cruise ship sailing along African coastline"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Cruises</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Discover Africa's coastlines and waterways in luxury
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              From ocean cruises along the dramatic African coast to river expeditions through pristine waterways, experience Africa from a unique perspective
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find Your Perfect Cruise</h2>
            <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
              Short cruises on Botswana's Chobe River and Zimbabwe's Lake Kariba provide exceptional water-based game viewing and offer a different perspective to vehicle-based game viewing. In Egypt, riverboat cruises and sailboats along the Nile River offer a relaxing and scenic way to see the sights around Luxor and Aswan.
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
                    <SelectValue placeholder="(Select option)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-option">Select Option</SelectItem>
                    {availableDestinations.map((destination) => (
                      <SelectItem key={destination.value} value={destination.value}>
                        {destination.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedClass} onValueChange={(value) => setSelectedClass(value)}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="(Select option)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-option">Select Option</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="superior">Superior</SelectItem>
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

      {/* Destination Filter Section */}
      {searchPerformed && availableDestinationFilters.length > 0 && (
        <section className="bg-gray-50 py-4 border-t">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Show only these destinations:
                </span>
                <div className="flex flex-wrap gap-4">
                  {availableDestinationFilters.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`destination-${country}`}
                        checked={selectedDestinationFilters.includes(country)}
                        onCheckedChange={(checked) => 
                          handleDestinationFilterChange(country, checked === true)
                        }
                      />
                      <label
                        htmlFor={`destination-${country}`}
                        className="text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                      >
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedDestinationFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDestinationFilters([])}
                    className="ml-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results Section */}
      {(loading || searchPerformed) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
                <p className="text-lg text-gray-600">Searching for Cruises...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    Cruises {filteredTours.length > 0 && `(${filteredTours.length} cruises found)`}
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
                              // Fallback to generic cruise image if product image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/zambezi-queen.png";
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">Cruise</Badge>
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
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{tour.location || 'Africa'}</span>
                              </div>
                              {tour.class && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <span>{tour.class}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">From</p>
                              {!tour.rates || tour.rates.length === 0 || tour.rates[0]?.rateName === 'Price on Application' || tour.rates[0]?.singleRate === 0 ? (
                                <p className="text-lg font-bold text-blue-600">On Request</p>
                              ) : (
                                <p className="text-xl font-bold text-green-600">
                                  ${tour.rates[0].singleRate ? Math.round(tour.rates[0].singleRate / 100).toLocaleString() : 'POA'}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Link href={`/products/${tour.code}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                              <Button variant="outline" className="w-full">
                                View details
                              </Button>
                            </Link>
                            {(() => {
                              // Check actual availability from calendar data
                              const hasCalendarAvailability = productAvailability[tour.code];
                              const availabilityInfo = getCruiseAvailability(tour.code);
                              
                              // Show Get Quote if:
                              // 1. No calendar availability (checked dynamically)
                              // 2. No rates or "Price on Application"
                              // 3. Still checking availability (undefined)
                              if (hasCalendarAvailability === false || 
                                  hasCalendarAvailability === undefined ||
                                  !tour.rates || 
                                  tour.rates.length === 0 ||
                                  tour.rates[0]?.rateName === 'Price on Application' || 
                                  tour.rates[0]?.singleRate === 0) {
                                return (
                                  <Link href={`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}&type=cruise`} className="flex-1">
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                      {hasCalendarAvailability === undefined ? (
                                        <>⏳ Checking...</>
                                      ) : availabilityInfo?.departureDay ? (
                                        <>
                                          <Calendar className="mr-2 h-4 w-4" />
                                          Get quote
                                        </>
                                      ) : (
                                        'Get quote'
                                      )}
                                    </Button>
                                  </Link>
                                );
                              } else {
                                // Has calendar availability - show Book Now
                                return (
                                  <Link href={`/booking/create?tourId=${tour.id}`} className="flex-1">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                                      <Calendar className="mr-2 h-4 w-4" />
                                      Book now
                                    </Button>
                                  </Link>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">No cruises found for your search criteria.</p>
                    <p className="text-gray-500 mb-6">Try selecting a different country or destination.</p>
                    <Button onClick={() => {
                      setSelectedCountry("")
                      setSelectedDestination("")
                      setSelectedClass("")
                      setSearchPerformed(false)
                      setTours([])
                      setFilteredTours([])
                      setSelectedDestinationFilters([])
                      setAvailableDestinationFilters([])
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

      {/* Cruise Benefits */}
      {(searchPerformed && filteredTours.length > 0) && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why choose African cruises?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ship className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Unique Perspective</h3>
                  <p className="text-gray-600">
                    Experience Africa's dramatic coastlines and pristine waterways from the comfort of your ship
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Luxury Amenities</h3>
                  <p className="text-gray-600">
                    Enjoy world-class dining, entertainment, and accommodation while exploring remote destinations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Remote Access</h3>
                  <p className="text-gray-600">Reach pristine destinations and wildlife areas accessible only by water</p>
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