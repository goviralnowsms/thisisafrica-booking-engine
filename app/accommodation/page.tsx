"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Bed, 
  Star, 
  MapPin, 
  Users, 
  Search,
  Loader2,
  Eye,
  ArrowRight,
  Home,
  Tent,
  Hotel,
  Mail,
  Phone,
  Calendar
} from "lucide-react"
import { getAvailableCountries, getAvailableDestinations } from "@/lib/destination-mapping"
import { getLocalProductImageSync, preloadImageMapBackground } from "@/lib/product-images"

// Generic accommodation images for different types - optimized paths
const genericImages = {
  lodge: [
    "/images/products/sabi-sabi1.png",
    "/images/products/sabi-sabi2.jpg", 
    "/images/products/savannah-lodge-honeymoon.png",
    "/images/products/savannah-suite.jpg"
  ],
  hotel: [
    "/images/products/portswood-captains-suite.jpg",
    "/images/products/portswood-hotel-dining-1920x.jpg",
    "/images/products/portswoodhotelexterior10_facilities-1920.jpg",
    "/images/products/accomm-hero.jpg"
  ],
  camp: [
    "/images/products/sabi-sabi3.jpg",
    "/images/products/sabi-sabi4.jpg",
    "/images/products/savannah-lodge-honeymoon.png"
  ],
  resort: [
    "/images/products/accomm-hero.jpg",
    "/images/products/portswood-hotel-dining-1920x.jpg"
  ]
}

// Preload common images for better performance
if (typeof window !== 'undefined') {
  const preloadImages = [
    "/images/products/sabi-sabi1.png",
    "/images/products/portswood-captains-suite.jpg",
    "/images/products/savannah-lodge-honeymoon.png"
  ]
  preloadImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

// Get a specific image for accommodation type and name
const getAccommodationImage = (type: string, name: string, supplier: string): string => {
  const lowerName = (name + ' ' + supplier).toLowerCase()
  
  // Specific accommodation mappings
  if (lowerName.includes('portswood')) return '/images/products/portswood-captains-suite.jpg'
  if (lowerName.includes('table bay')) return '/images/products/portswood-hotel-dining-1920x.jpg'
  if (lowerName.includes('cape grace')) return '/images/products/portswoodhotelexterior10_facilities-1920.jpg'
  if (lowerName.includes('sabi sabi')) return '/images/products/sabi-sabi1.png'
  if (lowerName.includes('kapama')) return '/images/products/sabi-sabi2.jpg'
  if (lowerName.includes('kuname')) return '/images/products/savannah-lodge-honeymoon.png'
  if (lowerName.includes('savannah') || lowerName.includes('serena')) return '/images/products/savannah-suite.jpg'
  
  // Fallback to type-based selection
  const typeImages = genericImages[type as keyof typeof genericImages] || genericImages.hotel
  return typeImages[Math.floor(Math.random() * typeImages.length)]
}

// Get a random generic image for accommodation type (kept for backward compatibility)
const getGenericImage = (type: string): string => {
  const typeImages = genericImages[type as keyof typeof genericImages] || genericImages.lodge
  return typeImages[Math.floor(Math.random() * typeImages.length)]
}

// No fallback data - only show real TourPlan results

interface Accommodation {
  id: string
  code: string
  name: string
  supplier?: string
  description?: string
  destination?: string
  location?: string
  country: string
  type: string
  category: string
  image: string
  roomType?: string
  rates?: any[]
  hasAvailability?: boolean
  features?: string[]
  capacity?: string
  highlights?: string[]
  displayName?: string
}

export default function AccommodationPage() {
  const router = useRouter()
  const [tours, setTours] = useState<any[]>([])
  const [filteredTours, setFilteredTours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  // Removed productImages state - using direct image paths for faster loading
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string}[]>([])
  const [availableDestinations, setAvailableDestinations] = useState<{value: string, label: string, tourPlanName: string}[]>([])
  const [availableClasses, setAvailableClasses] = useState<{value: string, label: string}[]>([])
  const [availableDestinationFilters, setAvailableDestinationFilters] = useState<string[]>([])
  const [selectedDestinationFilters, setSelectedDestinationFilters] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Initialize countries on mount
  useEffect(() => {
    // Initialize available countries for Accommodation
    const countries = getAvailableCountries('Accommodation')
    // Sort countries alphabetically by label
    const sortedCountries = countries.sort((a, b) => a.label.localeCompare(b.label))
    setAvailableCountries(sortedCountries)
    
    // Start loading image map in background (non-blocking)
    preloadImageMapBackground()
  }, [])

  // Update available destinations when country changes
  useEffect(() => {
    const loadDestinationsFromAPI = async () => {
      if (selectedCountry && availableCountries.length > 0) {
        try {
          console.log('🏨 Fetching destinations for country:', selectedCountry)
          
          const countryLabel = availableCountries.find(c => c.value === selectedCountry)?.label || selectedCountry
          const response = await fetch(`/api/tourplan/destinations?productType=Accommodation&country=${encodeURIComponent(countryLabel)}`)
          const result = await response.json()
          
          if (result.success && result.destinations) {
            console.log('🏨 Got destinations from API:', result.destinations)
            // Transform string array to {value, label} format
            const transformedDestinations = result.destinations.map((dest: string) => ({
              value: dest.toLowerCase().replace(/\s+/g, '-'),
              label: dest,
              tourPlanName: dest
            }))
            setAvailableDestinations(transformedDestinations)
          } else {
            console.warn('🏨 Failed to get destinations from API, falling back to hardcoded list')
            const destinations = getAvailableDestinations('Accommodation', selectedCountry)
            setAvailableDestinations(destinations)
          }
        } catch (error) {
          console.error('🏨 Error fetching destinations from API:', error)
          const destinations = getAvailableDestinations('Accommodation', selectedCountry)
          setAvailableDestinations(destinations)
        }
      } else {
        setAvailableDestinations([])
        setSelectedDestination("")
      }
    }
    
    loadDestinationsFromAPI()
  }, [selectedCountry, availableCountries])

  // Update available classes when country changes
  useEffect(() => {
    const loadClassesFromAPI = async () => {
      if (selectedCountry && availableCountries.length > 0) {
        try {
          console.log('🏨 Fetching classes for country:', selectedCountry)
          
          const country = availableCountries.find(c => c.value === selectedCountry)
          const tourPlanCountry = country?.label || selectedCountry
          const response = await fetch(`/api/tourplan/destinations?productType=Accommodation&country=${encodeURIComponent(tourPlanCountry)}`)
          const result = await response.json()
          
          // Skip the API classes as they return star ratings, not room types
          // Use actual TourPlan room types instead
          console.log('🏨 Using actual TourPlan room types')
          setAvailableClasses([
            { value: 'standard', label: 'Standard Room' },
            { value: 'luxury', label: 'Luxury Room' },
            { value: 'suite', label: 'Suite' },
            { value: 'executive', label: 'Executive Suite' },
            { value: 'deluxe', label: 'Deluxe Suite' },
            { value: 'villa', label: 'Villa' },
            { value: 'family', label: 'Family Room' },
            { value: 'tent', label: 'Luxury Tent' },
            { value: 'royal', label: 'Royal Suite' },
            { value: 'spa', label: 'Spa Suite' },
            { value: 'manor', label: 'Manor House' }
          ])
        } catch (error) {
          console.error('🏨 Error fetching classes from API:', error)
          setAvailableClasses([
            { value: 'standard', label: 'Standard Room' },
            { value: 'luxury', label: 'Luxury Room' },
            { value: 'suite', label: 'Suite' },
            { value: 'villa', label: 'Villa' }
          ])
        }
      } else {
        setAvailableClasses([])
        setSelectedClass("")
      }
    }
    
    loadClassesFromAPI()
  }, [selectedCountry, availableCountries])

  // Reset dependent fields when country changes
  useEffect(() => {
    // Clear destination and class when country changes
    setSelectedDestination("")
    setSelectedClass("")
    setSearchPerformed(false)
    setTours([])
    setFilteredTours([])
    setError(null)
  }, [selectedCountry])
  
  // Apply destination filtering when selectedDestinationFilters changes
  useEffect(() => {
    if (selectedDestinationFilters.length === 0) {
      setFilteredTours(tours)
    } else {
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

  const handleSearch = async () => {
    if (!selectedCountry) {
      alert('Please select a country to search for Accommodation')
      return
    }

    // Room class is now optional - if not selected, shows grouped hotels
    // if (selectedClass && selectedClass === "select-option") {
    //   selectedClass = undefined // Treat as no selection
    // }

    setLoading(true)
    setError(null)
    setSearchPerformed(true)
    
    try {
      const params = new URLSearchParams()
      
      // Use the correct TourPlan destination name from API data
      let tourPlanDestination = selectedCountry
      if (selectedDestination && selectedDestination !== "select-option" && availableDestinations.length > 0) {
        const destination = availableDestinations.find(d => d.value === selectedDestination)
        tourPlanDestination = destination?.tourPlanName || selectedDestination
      } else {
        const country = availableCountries.find(c => c.value === selectedCountry)
        tourPlanDestination = country?.label || selectedCountry
      }
      
      params.set('destination', tourPlanDestination)
      params.set('useButtonDestinations', 'true')
      
      if (selectedClass && selectedClass !== "select-option") params.set('class', selectedClass)
      
      console.log('🏨 Accommodation search params:', params.toString())
      
      const response = await fetch(`/api/accommodation/search?${params}`)
      const data = await response.json()
      
      if (data.success && data.accommodations) {
        console.log(`🏨 Found ${data.accommodations.length} accommodations`)
        
        // Transform accommodations to match tour structure
        const transformedTours = data.accommodations.map((acc: any) => ({
          ...acc,
          id: acc.code || acc.id,
          name: acc.displayName || acc.name || `${acc.hotelName || 'Hotel'} - ${acc.roomType || 'Room'}`,
          // Use direct image path for faster loading - no Sanity checks
          image: getAccommodationImage(acc.type || 'hotel', acc.name || '', acc.supplier || ''),
          description: acc.description || acc.hotelDescription || '',
          duration: `${acc.roomType || 'Accommodation'}`,
          destination: tourPlanDestination,
          countries: [selectedCountry] // For filtering
        }))
        
        setTours(transformedTours)
        
        // Extract available destination filters from tour results
        const destinationSet = new Set<string>()
        transformedTours.forEach((tour: any) => {
          if (tour.countries && Array.isArray(tour.countries)) {
            tour.countries.forEach((country: string) => destinationSet.add(country))
          }
        })
        setAvailableDestinationFilters(Array.from(destinationSet))
        
      } else {
        console.log('🏨 No accommodations found')
        setTours([])
        setError(data.error || 'No accommodations found')
      }
      
    } catch (error) {
      console.error('🏨 Accommodation search error:', error)
      setError('Failed to search accommodations')
      setTours([])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'lodge': return <Home className="h-4 w-4" />
      case 'camp': return <Tent className="h-4 w-4" />
      case 'hotel': return <Hotel className="h-4 w-4" />
      default: return <Bed className="h-4 w-4" />
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'ultra-luxury': return 'bg-purple-500'
      case 'luxury': return 'bg-amber-500'
      case 'standard': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image
          src="/images/products/accomm-hero.jpg"
          alt="African safari lodge at sunset"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">African Accommodations</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              From luxury safari lodges to intimate tented camps
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Browse our handpicked collection of exceptional accommodations across Africa
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-100 rounded-lg p-6">
              <p className="text-sm text-gray-700 mb-4 text-center">
                Select a country and room type to find specific accommodations. Room type selection helps filter to your preferred accommodation level.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value)}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCountries?.map((country, index) => (
                      <SelectItem key={`${country.value}-${index}`} value={country.value}>
                        {country.label}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedDestination} 
                  onValueChange={(value) => setSelectedDestination(value)}
                  disabled={!selectedCountry || !availableDestinations || availableDestinations.length === 0}
                >
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500 disabled:bg-gray-400 disabled:text-gray-600">
                    <SelectValue placeholder="Select Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDestinations?.map((destination, index) => (
                      <SelectItem key={`${destination.value}-${index}`} value={destination.value}>
                        {destination.label}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedClass} 
                  onValueChange={(value) => setSelectedClass(value)}
                  disabled={!selectedCountry || !availableClasses || availableClasses.length === 0}
                >
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500 disabled:bg-gray-400 disabled:text-gray-600">
                    <SelectValue placeholder="Select Room Type (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableClasses?.map((cls, index) => (
                      <SelectItem key={`${cls.value}-${index}`} value={cls.value}>
                        {cls.label}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleSearch}
                  disabled={!selectedCountry || loading}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searchPerformed && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Destination Filter Checkboxes */}
            {availableDestinationFilters.length > 1 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3">Filter by Destinations:</h3>
                <div className="flex flex-wrap gap-4">
                  {availableDestinationFilters.map(country => (
                    <label key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`destination-${country}`}
                        checked={selectedDestinationFilters.includes(country)}
                        onCheckedChange={(checked) => 
                          handleDestinationFilterChange(country, checked === true)
                        }
                      />
                      <span className="text-sm">{country}</span>
                    </label>
                  ))}
                </div>
                {selectedDestinationFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDestinationFilters([])}
                    className="mt-3"
                  >
                    Clear destination filters
                  </Button>
                )}
              </div>
            )}

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                {loading ? (
                  <p className="text-gray-600">Searching accommodations...</p>
                ) : filteredTours.length > 0 ? (
                  <div className="text-sm text-gray-600">
                    Showing {selectedClass} accommodations in {selectedDestination || selectedCountry}
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
                ) : searchPerformed ? (
                  <p className="text-gray-600">No accommodations found for your search criteria.</p>
                ) : (
                  <p className="text-gray-600">Use the search form above to find accommodations.</p>
                )}
              </div>
            </div>

      {/* Error Message */}
      {error && (
        <section className="bg-red-50 py-3">
          <div className="container mx-auto px-4">
            <p className="text-center text-red-700">{error}</p>
          </div>
        </section>
      )}

            {/* Tour Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-600">Searching accommodations...</p>
              </div>
            ) : filteredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTours.map((tour) => (
                  <Card key={tour.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-64">
                      <Image
                        src={tour.image || getLocalProductImageSync(tour.code || tour.id)}
                        alt={tour.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        onError={(e) => {
                          // Fallback to generic image if mapping fails
                          const target = e.target as HTMLImageElement;
                          target.src = getGenericImage('lodge');
                        }}
                      />
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">
                        {tour.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{tour.destination}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <Bed className="h-4 w-4 mr-1" />
                        <span className="text-sm">{tour.duration}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {tour.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-2">
                        <Link 
                          href={`/accommodation/${encodeURIComponent(tour.name.split(' - ')[0])}/select-dates`}
                          className="w-full"
                        >
                          <Button className="w-full bg-amber-500 hover:bg-amber-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Check Availability
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                        
                        <div className="flex gap-2">
                          <Link 
                            href={`/contact?subject=accommodation-inquiry&property=${encodeURIComponent(tour.name)}&code=${tour.code || tour.id}`}
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full">
                              <Mail className="h-4 w-4 mr-2" />
                              Request Quote
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => window.location.href = 'tel:+61299571788'}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchPerformed ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No accommodations found for your search criteria.</p>
                <Button 
                  onClick={() => {
                    setSelectedCountry("")
                    setSelectedDestination("")
                    setSelectedClass("")
                    setSearchPerformed(false)
                    setTours([])
                  }}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Clear Search
                </Button>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Experience African Hospitality</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Scattered throughout Africa's parks and reserves are world-class game lodges and permanent tented safari camps that offer unparalleled wildlife experiences combined with exceptional comfort and service.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-amber-500" />
                    Safari Lodges
                  </h3>
                  <p className="text-gray-700">
                    Game lodges offer accommodation ranging from hotel-like rooms to thatched-roofed chalets with private balconies, en-suite bathrooms, and luxury amenities. Many feature private plunge pools, spa centers, and viewing decks overlooking waterholes.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Tent className="h-5 w-5 mr-2 text-amber-500" />
                    Tented Camps
                  </h3>
                  <p className="text-gray-700">
                    Experience the romance of classic safari in permanent canvas-sided tents with all modern comforts. These camps offer en-suite bathrooms, comfortable beds, and authentic bush experiences with communal dining and evening campfires.
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                All our featured properties include meals and guided activities, ensuring you experience the best of African wildlife and hospitality. Our team will help you select the perfect accommodation to match your travel style and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative py-16 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Africa?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Let our experts help you choose the perfect accommodation for your African adventure. 
            We'll create a customized itinerary that matches your preferences and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?subject=accommodation-consultation"
              className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-100 text-amber-600 font-bold rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Get Expert Advice
            </Link>
            <Link
              href="/tailor-made"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors"
            >
              Create Custom Itinerary
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}