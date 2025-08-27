"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, MapPin, Users, Search, Loader2, Star, Train, Calendar } from "lucide-react"
import { getAvailableCountries, getAvailableDestinations, getTourPlanDestinationName } from "@/lib/destination-mapping"
import { hasRailAvailability, getRailAvailability } from "@/lib/rail-availability"


export default function RailPage() {
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
    
    // Initialize available countries for Rail
    const countries = getAvailableCountries('Rail')
    setAvailableCountries(countries)
  }, [])

  // Update available destinations when country changes
  useEffect(() => {
    if (selectedCountry) {
      const destinations = getAvailableDestinations('Rail', selectedCountry)
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
    if (!tourCode) return "/images/rail-journey.jpg"
    
    // Check if we have the image cached
    if (productImages[tourCode]) {
      return productImages[tourCode]
    }
    
    // Fallback to generic rail image
    return "/images/rail-journey.jpg"
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
      alert('Please select a country to search for Rail journeys')
      return
    }

    console.log('🚂 Starting rail search...')
    setLoading(true)
    setSearchPerformed(false)
    // Clear destination filters for new search
    setSelectedDestinationFilters([])
    setAvailableDestinationFilters([])

    try {
      // Build search URL with parameters
      const params = new URLSearchParams()
      params.set('productType', 'Rail')
      
      // For Rail, pass the actual destination value to enable proper filtering
      // The API will handle mapping to country level for search
      const effectiveDestination = (selectedDestination && selectedDestination !== "select-option") ? selectedDestination : selectedCountry
      params.set('destination', effectiveDestination)
      
      if (selectedClass && selectedClass !== "select-option") params.set('class', selectedClass)
      
      console.log('🚂 Rail search params:', params.toString())
      
      const response = await fetch(`/api/tourplan?${params.toString()}`)
      const result = await response.json()

      console.log('🚂 Rail search response:', result)

      if (result.success) {
        console.log('🚂 Found', result.tours?.length || 0, 'rail journeys')
        console.log('🚂 Setting tours and filteredTours...')
        const toursData = result.tours || []
        setTours(toursData)
        setFilteredTours(toursData)
        console.log('🚂 Tours state updated')
        
        // Extract available destination filters from tour countries
        const allCountries = new Set<string>()
        toursData.forEach((tour: any) => {
          if (tour.countries && Array.isArray(tour.countries)) {
            tour.countries.forEach((country: string) => {
              allCountries.add(country)
            })
          }
        })
        const uniqueCountries = Array.from(allCountries).sort()
        setAvailableDestinationFilters(uniqueCountries)
        console.log('🌍 Available destination filters:', uniqueCountries)
        
        // Check availability for each product
        toursData.forEach((tour: any) => {
          checkProductAvailability(tour.code)
        })
      } else {
        console.error("🚂 Rail search failed:", result.error)
        setTours([])
        setFilteredTours([])
      }
    } catch (error) {
      console.error("🚂 Search error:", error)
      setTours([])
      setFilteredTours([])
    } finally {
      console.log('🚂 Setting loading=false, searchPerformed=true')
      setLoading(false)
      setSearchPerformed(true)
      console.log('🚂 Search complete. Final state:', { 
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
          src="/images/products/rail-hero.jpg"
          alt="Luxury train journey through African landscapes"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Rail Journeys</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Experience Africa's most scenic railway adventures
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              From luxury train journeys to historic railway routes, discover Africa by rail in unparalleled comfort and style
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find Your Perfect Rail Journey</h2>
            <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
              The iconic Blue Train and Rovos Rail train journeys in southern Africa offer five-star travel reminiscent of a bygone era. Journeys include 'off track' activities, such as safaris, golf rounds and cultural and historic experiences. Journeys range from three days to 16 days and may traverse over multiple countries.
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
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-option">Select Option</SelectItem>
                    {/* Rail products only have Luxury class per WordPress */}
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
                <p className="text-lg text-gray-600">Searching for Rail Journeys...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    Rail Journeys {filteredTours.length > 0 && `(${filteredTours.length} journeys found)`}
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
                              // Fallback to generic rail image if product image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/rail-journey.jpg";
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">Rail Journey</Badge>
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
                                <span>{tour.location || tour.class || 'Africa'}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              {(() => {
                                let hasAvailability = hasRailAvailability(tour.code);
                                const availabilityInfo = getRailAvailability(tour.code);
                                
                                // Override for Cape Town products that have availability
                                const capeTownHasAvailability = ['CPTRLROV001CTPPUL', 'CPTRLROV001CTPRRO', 'CPTRLROV001RRCTPR'];
                                if (capeTownHasAvailability.includes(tour.code)) {
                                  hasAvailability = true;
                                }
                                
                                if (!hasAvailability) {
                                  return (
                                    <>
                                      <p className="text-sm text-gray-500">Availability</p>
                                      <p className="text-lg font-bold text-orange-600">Quote Required</p>
                                      {availabilityInfo?.departureDay && (
                                        <p className="text-xs text-gray-500">Departs {availabilityInfo.departureDay}s</p>
                                      )}
                                    </>
                                  );
                                }
                                
                                // Has availability - show pricing
                                return (
                                  <>
                                    <p className="text-sm text-gray-500">From per person twin share</p>
                                    {tour.rates?.[0]?.rateName === 'Price on Application' || (tour.rates?.[0]?.singleRate === 0 && tour.rates?.[0]?.twinRate === 0) ? (
                                      <p className="text-lg font-bold text-blue-600">On Request</p>
                                    ) : (
                                      <p className="text-xl font-bold text-green-600">
                                        ${(() => {
                                          // For rail tours, show per person twin share rate (converted from cents)
                                          const rate = tour.rates[0];
                                          const twinRateTotal = rate?.twinRate || rate?.doubleRate || 0;
                                          if (twinRateTotal > 0) {
                                            // Convert from cents and divide by 2 for per person twin share
                                            const perPersonRate = Math.round(twinRateTotal / 100 / 2);
                                            return perPersonRate.toLocaleString();
                                          }
                                          const singleRate = rate?.singleRate || 0;
                                          if (singleRate > 0) {
                                            // Convert from cents for single rate
                                            return Math.round(singleRate / 100).toLocaleString();
                                          }
                                          return 'POA';
                                        })()}
                                      </p>
                                    )}
                                    {availabilityInfo?.departureDay && (
                                      <p className="text-xs text-gray-500">Departs {availabilityInfo.departureDay}s</p>
                                    )}
                                  </>
                                );
                              })()}
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
                              let hasCalendarAvailability = productAvailability[tour.code];
                              const availabilityInfo = getRailAvailability(tour.code);
                              
                              // Special handling for known products
                              // Victoria Falls routes: Have rates but NO availability - should be Get Quote
                              const victoriaFallsNoAvailability = ['VFARLROV001VFPRDX', 'VFARLROV001VFPRRY', 'VFARLROV001VFPYPM'];
                              // Cape Town routes: Have rates AND availability - should be Book Now
                              const capeTownHasAvailability = ['CPTRLROV001CTPPUL', 'CPTRLROV001CTPRRO', 'CPTRLROV001RRCTPR'];
                              
                              // Force correct behavior for known products
                              if (victoriaFallsNoAvailability.includes(tour.code)) {
                                // Victoria Falls - always Get Quote (no availability)
                                hasCalendarAvailability = false;
                              } else if (capeTownHasAvailability.includes(tour.code)) {
                                // Cape Town - always Book Now (has availability)
                                hasCalendarAvailability = true;
                              }
                              
                              // Show Get Quote if:
                              // 1. No calendar availability (checked dynamically or forced)
                              // 2. No rates or "Price on Application"
                              // 3. Still checking availability (undefined)
                              if (hasCalendarAvailability === false || 
                                  hasCalendarAvailability === undefined ||
                                  tour.rates?.[0]?.rateName === 'Price on Application' || 
                                  tour.rates?.[0]?.singleRate === 0) {
                                return (
                                  <Link href={`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}&type=rail`} className="flex-1">
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
                    <p className="text-lg text-gray-600 mb-4">No rail journeys found for your search criteria.</p>
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

      {/* Rail Benefits */}
      {(searchPerformed && filteredTours.length > 0) && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why choose rail travel?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Train className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Scenic Routes</h3>
                  <p className="text-gray-600">
                    Journey through breathtaking landscapes and iconic African scenery from the comfort of your carriage
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Luxury Comfort</h3>
                  <p className="text-gray-600">
                    Experience the golden age of travel with premium accommodations and world-class service
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Historic Railways</h3>
                  <p className="text-gray-600">Travel on legendary railway lines with rich history and cultural significance</p>
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