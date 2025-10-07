"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, MapPin, Users, Search, Loader2, Star, Package } from "lucide-react"
import { getAvailableCountries, getAvailableDestinations, getTourPlanDestinationName } from "@/lib/destination-mapping"
import { getLocalProductImageSync, preloadImageMapBackground } from "@/lib/product-images"


export default function PackagesPage() {
  const router = useRouter()
  const [tours, setTours] = useState<any[]>([])
  const [filteredTours, setFilteredTours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string}[]>([])
  const [availableDestinations, setAvailableDestinations] = useState<{value: string, label: string, tourPlanName: string}[]>([])
  const [availableClasses, setAvailableClasses] = useState<{value: string, label: string}[]>([])
  const [availableDestinationFilters, setAvailableDestinationFilters] = useState<string[]>([]) // Countries from tour amenities
  const [selectedDestinationFilters, setSelectedDestinationFilters] = useState<string[]>([]) // Selected country filters

  useEffect(() => {
    const loadCountriesFromAPI = async () => {
      try {
        console.log('📦 Fetching available countries for Packages from TourPlan API...')
        
        // Fetch countries from TourPlan API (empty country param returns available countries)
        const response = await fetch('/api/tourplan/destinations?productType=Packages&country=')
        const result = await response.json()
        
        console.log('📦 TourPlan countries response:', result)
        
        if (result.success && result.countries) {
          // Convert TourPlan country names to our format
          const apiCountries = result.countries.map((country: string) => ({
            value: country.toLowerCase().replace(/\s+/g, '-'),
            label: country
          }))
          
          console.log('📦 Setting available countries from API:', apiCountries)
          setAvailableCountries(apiCountries)
        } else {
          console.warn('📦 Failed to get countries from API, falling back to hardcoded list')
          // Fallback to hardcoded list if API fails
          const countries = getAvailableCountries('Packages')
          setAvailableCountries(countries)
        }
      } catch (error) {
        console.error('📦 Error fetching countries from API:', error)
        // Fallback to hardcoded list
        const countries = getAvailableCountries('Packages')
        setAvailableCountries(countries)
      }
    }
    
    loadCountriesFromAPI()
    // Load image map in background for better initial page load performance
    preloadImageMapBackground()
  }, [])

  // Update available destinations when country changes
  useEffect(() => {
    const loadDestinationsFromAPI = async () => {
      if (selectedCountry) {
        try {
          console.log('📦 Fetching destinations for country:', selectedCountry)
          
          // Convert country value back to display name for API call
          const countryLabel = availableCountries.find(c => c.value === selectedCountry)?.label || selectedCountry
          
          // Fetch destinations from TourPlan API
          const response = await fetch(`/api/tourplan/destinations?productType=Packages&country=${encodeURIComponent(countryLabel)}`)
          const result = await response.json()
          
          console.log('📦 TourPlan destinations response:', result)
          
          if (result.success && result.destinations) {
            // Convert TourPlan destination names to our format
            const apiDestinations = result.destinations.map((destination: string) => ({
              value: destination.toLowerCase().replace(/\s+/g, '-'),
              label: destination,
              tourPlanName: destination // Use actual TourPlan name
            }))
            
            console.log('📦 Setting available destinations from API:', apiDestinations)
            setAvailableDestinations(apiDestinations)
          } else {
            console.warn('📦 Failed to get destinations from API, falling back to hardcoded list')
            // Fallback to hardcoded list if API fails
            const destinations = getAvailableDestinations('Packages', selectedCountry)
            setAvailableDestinations(destinations)
          }
        } catch (error) {
          console.error('📦 Error fetching destinations from API:', error)
          // Fallback to hardcoded list
          const destinations = getAvailableDestinations('Packages', selectedCountry)
          setAvailableDestinations(destinations)
        }
        
        // Reset destination selection when country changes (class loads separately)
        setSelectedDestination("")
      } else {
        setAvailableDestinations([])
        setSelectedDestination("")
        setSelectedClass("")
        setAvailableClasses([])
      }
    }
    
    loadDestinationsFromAPI()
  }, [selectedCountry, availableCountries])

  // Update available classes when country changes (not destination)
  useEffect(() => {
    const loadClassesFromAPI = async () => {
      if (selectedCountry) {
        try {
          console.log('📦 Fetching classes for country:', selectedCountry)
          
          // Fetch classes from TourPlan API using COUNTRY name
          // Classes come from country-level API calls, not destination-level
          const country = availableCountries.find(c => c.value === selectedCountry)
          const tourPlanCountry = country?.label || selectedCountry
          const response = await fetch(`/api/tourplan/destinations?productType=Packages&country=${encodeURIComponent(tourPlanCountry)}`)
          const result = await response.json()
          
          console.log('📦 TourPlan classes response:', result)
          
          if (result.success && result.classes) {
            // Convert TourPlan class names to our format
            const apiClasses = result.classes.map((className: string) => ({
              value: className.toLowerCase(),
              label: className
            }))
            
            console.log('📦 Setting available classes from API:', apiClasses)
            setAvailableClasses(apiClasses)
          } else {
            console.warn('📦 Failed to get classes from API, using fallback')
            // Fallback to basic classes if API fails
            setAvailableClasses([
              { value: 'basic', label: 'Basic' },
              { value: 'standard', label: 'Standard' },
              { value: 'luxury', label: 'Luxury' }
            ])
          }
        } catch (error) {
          console.error('📦 Error fetching classes from API:', error)
          // Fallback to basic classes
          setAvailableClasses([
            { value: 'basic', label: 'Basic' },
            { value: 'standard', label: 'Standard' },
            { value: 'luxury', label: 'Luxury' }
          ])
        }
        
        // Reset class selection when country changes
        setSelectedClass("")
      } else {
        setAvailableClasses([])
        setSelectedClass("")
      }
    }
    
    loadClassesFromAPI()
  }, [selectedCountry, availableCountries])

  // Apply destination filtering when selectedDestinationFilters changes
  useEffect(() => {
    if (selectedDestinationFilters.length === 0) {
      // No filters selected - show all tours
      setFilteredTours(tours)
    } else {
      // Filter tours that include ALL of the selected countries (AND logic)
      const filtered = tours.filter((tour: any) => {
        if (!tour.countries || !Array.isArray(tour.countries)) return false
        // Tour must visit ALL selected countries
        return selectedDestinationFilters.every(selectedCountry =>
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

  // Function to get product-specific image using the image mapping function
  const getProductImage = (tourCode: string) => {
    if (!tourCode) return "/images/products/packages-hero.jpg"
    
    // Use the image mapping function for fast image loading
    return getLocalProductImageSync(tourCode)
  }

  const handleSearch = async () => {
    if (!selectedCountry) {
      alert('Please select a country to search for Packages')
      return
    }

    console.log('📦 Starting packages search...')
    setLoading(true)
    setSearchPerformed(false)
    // Clear destination filters for new search
    setSelectedDestinationFilters([])
    setAvailableDestinationFilters([])

    try {
      // Build search URL with parameters
      const params = new URLSearchParams()
      params.set('productType', 'Packages')
      
      // Use the correct TourPlan destination name from API data
      let tourPlanDestination = selectedCountry
      if (selectedDestination && selectedDestination !== "select-option" && availableDestinations.length > 0) {
        // Find the selected destination and use its TourPlan name
        const destination = availableDestinations.find(d => d.value === selectedDestination)
        tourPlanDestination = destination?.tourPlanName || selectedDestination
      } else {
        // Use the country's TourPlan name
        const country = availableCountries.find(c => c.value === selectedCountry)
        tourPlanDestination = country?.label || selectedCountry
      }
      
      console.log('📦 Using TourPlan destination name:', tourPlanDestination)
      params.set('destination', tourPlanDestination)
      
      if (selectedClass && selectedClass !== "select-option") params.set('class', selectedClass)
      
      console.log('📦 Packages search params:', params.toString())
      
      const response = await fetch(`/api/tourplan/search-fast?${params.toString()}`)
      const result = await response.json()

      console.log('📦 Packages search response:', result)

      if (result.success) {
        console.log('📦 Found', result.tours?.length || 0, 'packages')
        console.log('📦 Setting tours and filteredTours...')
        
        // Skip individual availability checks for performance
        // All packages should show "Get quote" button by default
        const toursWithDefaultAvailability = (result.tours || []).map((tour: any) => ({
          ...tour,
          hasAvailableDates: false // Default to "Get quote" for all packages
        }))
        
        setTours(toursWithDefaultAvailability)
        setFilteredTours(toursWithDefaultAvailability)
        console.log('📦 Tours state updated with availability data')
        
        // Extract available destination filters from tour countries
        const allCountries = new Set<string>()
        toursWithDefaultAvailability.forEach((tour: any) => {
          if (tour.countries && Array.isArray(tour.countries)) {
            tour.countries.forEach((country: string) => {
              allCountries.add(country)
            })
          }
        })
        const uniqueCountries = Array.from(allCountries).sort()
        setAvailableDestinationFilters(uniqueCountries)
        console.log('🌍 Available destination filters:', uniqueCountries)
      } else {
        console.error("📦 Packages search failed:", result.error)
        setTours([])
        setFilteredTours([])
      }
    } catch (error) {
      console.error("📦 Search error:", error)
      setTours([])
      setFilteredTours([])
    } finally {
      console.log('📦 Setting loading=false, searchPerformed=true')
      setLoading(false)
      setSearchPerformed(true)
      console.log('📦 Search complete. Final state:', { 
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
          src="/images/products/packages-hero.jpg"
          alt="Complete African safari package experience"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Pre-designed packages</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Complete African adventures with everything included
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Discover comprehensive travel packages that combine accommodation, tours, meals, and transfers for the ultimate hassle-free African experience
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find your perfect package</h2>
            <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
              Packages include pre-designed, popular itineraries which can start on any date and typically include transfers, accommodation, some meals and popular activities. These packages suit everyone and may be available in various standards (basic, standard, standard-plus, deluxe and luxury), they can also be customised if desired.
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

                <Select 
                  value={selectedClass} 
                  onValueChange={(value) => setSelectedClass(value)}
                  disabled={!selectedCountry || availableClasses.length === 0}
                >
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500 disabled:bg-gray-400 disabled:text-gray-600">
                    <SelectValue placeholder="(Select option)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select-option">Select Option</SelectItem>
                    {availableClasses.map((classOption) => (
                      <SelectItem key={classOption.value} value={classOption.value}>
                        {classOption.label}
                      </SelectItem>
                    ))}
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
                <p className="text-lg text-gray-600">Searching for Pre-designed packages...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    Pre-designed packages {filteredTours.length > 0 && `(${filteredTours.length} packages found)`}
                  </h2>
                  {filteredTours.length > 0 && (
                    <div className="text-sm text-gray-600">
                      Showing results for {selectedCountry || selectedDestination}
                      {filteredTours.some(tour => tour._isHybridFallback) && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <div className="flex items-center">
                            <div className="text-amber-800 text-sm">
                              <strong>Note:</strong> Showing all {selectedCountry} results. More specific filtering for {selectedDestination}/{selectedClass} is being improved.
                            </div>
                          </div>
                        </div>
                      )}
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
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">Package</Badge>
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
                                <div className="flex items-center text-sm text-gray-500 mb-1">
                                  <span>{tour.class}</span>
                                </div>
                              )}
                              {tour.comment && (
                                <div className="text-sm text-blue-600">
                                  {tour.comment}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">From</p>
                              {tour.rates?.[0]?.rateName === 'Price on Application' || (tour.rates?.[0]?.twinRate === 0 && tour.rates?.[0]?.singleRate === 0) ? (
                                <p className="text-lg font-bold text-blue-600">On Request</p>
                              ) : (
                                <p className="text-xl font-bold text-green-600">
                                  ${(() => {
                                    // Find the LOWEST rate across all date ranges (for "From..." pricing)
                                    const twinRates = tour.rates?.filter((r: any) => r.twinRate > 0).map((r: any) => r.twinRate) || []
                                    const lowestTwinRate = twinRates.length > 0 ? Math.min(...twinRates) : 0
                                    
                                    const doubleRates = tour.rates?.filter((r: any) => r.doubleRate > 0).map((r: any) => r.doubleRate) || []
                                    const lowestDoubleRate = doubleRates.length > 0 ? Math.min(...doubleRates) : 0
                                    
                                    const singleRates = tour.rates?.filter((r: any) => r.singleRate > 0).map((r: any) => r.singleRate) || []
                                    const lowestSingleRate = singleRates.length > 0 ? Math.min(...singleRates) : 0
                                    
                                    if (lowestTwinRate > 0) {
                                      return Math.round(lowestTwinRate / 200).toLocaleString()
                                    } else if (lowestDoubleRate > 0) {
                                      return Math.round(lowestDoubleRate / 200).toLocaleString()
                                    } else if (lowestSingleRate > 0) {
                                      return Math.round(lowestSingleRate / 100).toLocaleString()
                                    }
                                    return 'POA'
                                  })()}
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
                            {tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 || !tour.hasAvailableDates ? (
                              <Link href={`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}`} className="flex-1">
                                <Button className="w-full bg-blue-500 hover:bg-blue-600">Get quote</Button>
                              </Link>
                            ) : (
                              <Link href={`/booking/create?tourId=${tour.id}`} className="flex-1">
                                <Button className="w-full bg-amber-500 hover:bg-amber-600">Book now</Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">No packages found for your search criteria.</p>
                    <p className="text-gray-500 mb-6">Try selecting a different country or destination.</p>
                    <Button onClick={() => {
                      setSelectedCountry("")
                      setSelectedDestination("")
                      setSelectedClass("")
                      setAvailableClasses([])
                      setSearchPerformed(false)
                      setTours([])
                      setFilteredTours([])
                      setSelectedDestinationFilters([])
                      setAvailableDestinationFilters([])
                    }}>
                      Clear search
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Package Benefits */}
      {(searchPerformed && filteredTours.length > 0) && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why choose our packages?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">All-inclusive</h3>
                  <p className="text-gray-600">
                    Everything you need for your African adventure bundled together for convenience and value
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Expert planning</h3>
                  <p className="text-gray-600">
                    Carefully crafted itineraries by local experts who know Africa's hidden gems and must-see destinations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hassle-free</h3>
                  <p className="text-gray-600">No planning stress - we handle all logistics, bookings, and coordination for you</p>
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