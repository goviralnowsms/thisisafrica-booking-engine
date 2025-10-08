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

// Function to fetch supplier images from Sanity
const fetchSupplierImages = async (): Promise<Map<string, { imageUrl: string, alt: string }>> => {
  try {
    const response = await fetch('/api/sanity/accommodation-suppliers')
    const result = await response.json()

    const imageMap = new Map<string, { imageUrl: string, alt: string }>()

    if (result.success && Array.isArray(result.data)) {
      result.data.forEach((supplier: any) => {
        if (supplier.supplierName && supplier.primaryImageUrl) {
          // Store by supplier name (normalized to lowercase for matching)
          const normalizedName = supplier.supplierName.toLowerCase().trim()
          imageMap.set(normalizedName, {
            imageUrl: supplier.primaryImageUrl,
            alt: supplier.primaryImageAlt || supplier.supplierName
          })

          // Also store by associated product codes if available
          if (supplier.associatedProductCodes && Array.isArray(supplier.associatedProductCodes)) {
            supplier.associatedProductCodes.forEach((code: string) => {
              imageMap.set(code, {
                imageUrl: supplier.primaryImageUrl,
                alt: supplier.primaryImageAlt || supplier.supplierName
              })
            })
          }
        }
      })
    }

    return imageMap
  } catch (error) {
    console.error('Error fetching supplier images:', error)
    return new Map()
  }
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
const getAccommodationImage = (
  type: string,
  name: string,
  supplier: string,
  productCode: string,
  supplierImages: Map<string, { imageUrl: string, alt: string }> | null
): { imageUrl: string, alt: string } => {
  // First, try to get image from Sanity supplier images
  if (supplierImages) {
    // Try by product code first
    if (productCode && supplierImages.has(productCode)) {
      return supplierImages.get(productCode)!
    }

    // Try by supplier name (normalized)
    const normalizedSupplier = supplier.toLowerCase().trim()
    if (normalizedSupplier && supplierImages.has(normalizedSupplier)) {
      return supplierImages.get(normalizedSupplier)!
    }

    // Try by hotel name from the full name (e.g., "Portswood Hotel - Standard Room" -> "portswood hotel")
    const hotelNameMatch = name.toLowerCase().split(' - ')[0].trim()
    if (hotelNameMatch && supplierImages.has(hotelNameMatch)) {
      return supplierImages.get(hotelNameMatch)!
    }

    // Try partial matches for known variations
    for (const [key, value] of supplierImages.entries()) {
      if (key.includes('portswood') && (name.toLowerCase().includes('portswood') || supplier.toLowerCase().includes('portswood'))) {
        return value
      }
      if (key.includes('sabi') && (name.toLowerCase().includes('sabi') || supplier.toLowerCase().includes('sabi'))) {
        return value
      }
      if (key.includes('table bay') && (name.toLowerCase().includes('table bay') || supplier.toLowerCase().includes('table bay'))) {
        return value
      }
      if (key.includes('cape grace') && (name.toLowerCase().includes('cape grace') || supplier.toLowerCase().includes('cape grace'))) {
        return value
      }
    }
  }

  // Fallback to static images if no Sanity match
  const lowerName = (name + ' ' + supplier).toLowerCase()

  // Specific accommodation mappings
  let imageUrl = '/images/products/portswood-captains-suite.jpg' // default
  let alt = 'Accommodation'

  if (lowerName.includes('portswood')) {
    imageUrl = '/images/products/portswood-captains-suite.jpg'
    alt = 'Portswood Hotel'
  } else if (lowerName.includes('table bay')) {
    imageUrl = '/images/products/portswood-hotel-dining-1920x.jpg'
    alt = 'Table Bay Hotel'
  } else if (lowerName.includes('cape grace')) {
    imageUrl = '/images/products/portswoodhotelexterior10_facilities-1920.jpg'
    alt = 'Cape Grace Hotel'
  } else if (lowerName.includes('sabi sabi')) {
    imageUrl = '/images/products/sabi-sabi1.png'
    alt = 'Sabi Sabi Bush Lodge'
  } else if (lowerName.includes('kapama')) {
    imageUrl = '/images/products/sabi-sabi2.jpg'
    alt = 'Kapama Lodge'
  } else if (lowerName.includes('kuname')) {
    imageUrl = '/images/products/savannah-lodge-honeymoon.png'
    alt = 'Kuname Lodge'
  } else if (lowerName.includes('savannah') || lowerName.includes('serena')) {
    imageUrl = '/images/products/savannah-suite.jpg'
    alt = 'Savannah Lodge'
  }

  return { imageUrl, alt }
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
  starRating?: string
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
  const [supplierImages, setSupplierImages] = useState<Map<string, { imageUrl: string, alt: string }> | null>(null)

  // Initialize countries on mount - dynamically discover countries with actual accommodations
  useEffect(() => {
    const loadAvailableCountries = async () => {
      try {
        console.log('🌍 Loading countries with accommodation products...')

        const response = await fetch('/api/accommodation/countries')
        const result = await response.json()

        if (result.success && result.countries) {
          console.log('🌍 Loaded countries:', result.countries)
          setAvailableCountries(result.countries)

          if (result.fallback) {
            console.warn('⚠️ Using fallback countries due to API error')
          }
        } else {
          console.error('❌ Failed to load countries, using fallback')
          // Fallback to minimum viable countries
          setAvailableCountries([
            { value: 'south-africa', label: 'South Africa' },
            { value: 'kenya', label: 'Kenya' }
          ])
        }
      } catch (error) {
        console.error('❌ Error loading countries:', error)
        // Fallback to minimum viable countries
        setAvailableCountries([
          { value: 'south-africa', label: 'South Africa' },
          { value: 'kenya', label: 'Kenya' }
        ])
      }
    }

    // Only load countries on mount - images will be loaded when search is performed
    loadAvailableCountries()
  }, [])

  // Update available destinations when country changes - get destinations with actual accommodations
  useEffect(() => {
    const loadDestinationsFromAPI = async () => {
      if (selectedCountry && availableCountries.length > 0) {
        try {
          console.log('🏨 Fetching destinations with accommodations for country:', selectedCountry)

          const countryLabel = availableCountries.find(c => c.value === selectedCountry)?.label || selectedCountry
          const response = await fetch(`/api/accommodation/destinations-for-country?country=${encodeURIComponent(countryLabel)}`)
          const result = await response.json()

          if (result.success && result.destinations) {
            console.log('🏨 Got destinations with accommodations:', result.destinations)
            setAvailableDestinations(result.destinations)
          } else {
            console.warn('🏨 No destinations with accommodations found for this country')
            setAvailableDestinations([])
          }
        } catch (error) {
          console.error('🏨 Error fetching destinations with accommodations:', error)
          setAvailableDestinations([])
        }
      } else {
        setAvailableDestinations([])
        setSelectedDestination("")
      }
    }

    loadDestinationsFromAPI()
  }, [selectedCountry, availableCountries])

  // Update available star ratings when country changes - should work with just country selection
  useEffect(() => {
    const loadStarRatingsFromAPI = async () => {
      if (selectedCountry && availableCountries.length > 0) {
        try {
          const countryLabel = availableCountries.find(c => c.value === selectedCountry)?.label || selectedCountry
          let destinationLabel = null

          // If a destination is selected (but not "all-destinations"), get its label for filtering
          if (selectedDestination && selectedDestination !== "" && selectedDestination !== "select-option" && selectedDestination !== "all-destinations") {
            destinationLabel = availableDestinations.find(d => d.value === selectedDestination)?.label
          }
          // For no destination or "all-destinations", we'll fetch star ratings for the whole country

          console.log('🏨 Fetching star ratings for:', { country: countryLabel, destination: destinationLabel || 'Country-wide' })

          // Build API URL - always include country
          let apiUrl = `/api/accommodation/room-types-for-destination?country=${encodeURIComponent(countryLabel)}`
          if (destinationLabel) {
            apiUrl += `&destination=${encodeURIComponent(destinationLabel)}`
          }

          const response = await fetch(apiUrl)
          const result = await response.json()

          if (result.success && result.roomTypes) {
            console.log('🏨 Got star ratings:', result.roomTypes)
            setAvailableClasses(result.roomTypes)
          } else {
            console.warn('🏨 No star ratings found for this location')
            setAvailableClasses([])
          }
        } catch (error) {
          console.error('🏨 Error fetching star ratings:', error)
          setAvailableClasses([])
        }
      } else {
        setAvailableClasses([])
        setSelectedClass("")
      }
    }

    loadStarRatingsFromAPI()
  }, [selectedCountry, availableCountries, selectedDestination, availableDestinations])

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

  // Don't reset star rating when destination changes - user should be able to filter by destination + star rating
  // useEffect(() => {
  //   setSelectedClass("")
  // }, [selectedDestination])
  
  // Apply destination filtering when selectedDestinationFilters changes
  useEffect(() => {
    console.log(`🔍 Starting filtering with ${tours.length} tours`)
    console.log(`🔍 Filters: Destination="${selectedDestination}", StarRating="${selectedClass}"`)

    let filtered = tours

    // Apply destination filtering from checkboxes
    if (selectedDestinationFilters.length > 0) {
      filtered = filtered.filter((tour: any) => {
        return selectedDestinationFilters.some(selectedDest =>
          tour.locality === selectedDest ||
          tour.destination === selectedDest ||
          (tour.countries && tour.countries.includes(selectedDest))
        )
      })
      console.log(`🌍 Checkbox filtered ${tours.length} tours to ${filtered.length} based on destinations:`, selectedDestinationFilters)
    }

    // Apply STRICT destination filtering from dropdown to prevent cross-contamination
    if (selectedDestination && selectedDestination !== "select-option" && selectedDestination !== "all-destinations" && availableDestinations.length > 0) {
      const destinationLabel = availableDestinations.find(d => d.value === selectedDestination)?.label
      if (destinationLabel) {
        const before = filtered.length

        filtered = filtered.filter((tour: any) => {
          const locality = (tour.locality || '').toLowerCase().trim()
          const destination = destinationLabel.toLowerCase().trim()
          const hotelName = (tour.name || '').toLowerCase().trim()
          const supplier = (tour.supplier || '').toLowerCase().trim()

          // Debug logging for troubleshooting
          const isMatch = (() => {
            if (destination.includes('victoria') && destination.includes('alfred')) {
              // V&A Waterfront: MUST contain waterfront keywords AND NOT sabi
              const hasWaterfront = locality.includes('victoria') || locality.includes('alfred') ||
                                    locality.includes('waterfront') || locality.includes('v&a') || locality.includes('v & a')
              const hasSabi = locality.includes('sabi') || hotelName.includes('sabi') || supplier.includes('sabi')
              return hasWaterfront && !hasSabi
            }
            else if (destination.includes('sabi')) {
              // Sabi Sand: MUST contain sabi AND NOT waterfront
              const hasSabi = locality.includes('sabi') || hotelName.includes('sabi') || supplier.includes('sabi')
              const hasWaterfront = locality.includes('waterfront') || locality.includes('victoria') || locality.includes('alfred')
              return hasSabi && !hasWaterfront
            }
            else {
              // Other destinations: exact or partial match
              return locality === destination || locality.includes(destination) || destination.includes(locality)
            }
          })()

          return isMatch
        })

        console.log(`🎯 STRICT filtered from ${before} to ${filtered.length} for: ${destinationLabel}`)
      }
    }
    
    // Apply star rating filtering from dropdown if selected
    if (selectedClass && selectedClass !== "select-option") {
      // selectedClass now contains the TourPlan star code (15, 25, 35, 45, 55, 65)
      filtered = filtered.filter((tour: any) => {
        // Match the star rating exactly
        return tour.starRating === selectedClass
      })
      const starLabel = availableClasses.find(c => c.value === selectedClass)?.label
      console.log(`🏨 Filtered to ${filtered.length} accommodations with star rating: ${starLabel} (code: ${selectedClass})`)
    }
    
    setFilteredTours(filtered)
  }, [selectedDestinationFilters, tours, selectedDestination, availableDestinations, selectedClass, availableClasses])

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

    // Load supplier images only when needed (on search)
    let currentSupplierImages = supplierImages
    if (!currentSupplierImages) {
      try {
        const images = await fetchSupplierImages()
        console.log(`🖼️ Loaded ${images.size} supplier images from Sanity`)
        setSupplierImages(images)
        currentSupplierImages = images
      } catch (error) {
        console.warn('Failed to load supplier images:', error)
        const emptyMap = new Map()
        setSupplierImages(emptyMap) // Set empty map to prevent retrying
        currentSupplierImages = emptyMap
      }
    }

    try {
      const params = new URLSearchParams()

      // Always search by country, then filter client-side (working approach)
      const country = availableCountries.find(c => c.value === selectedCountry)
      const tourPlanDestination = country?.label || selectedCountry

      params.set('destination', tourPlanDestination)
      params.set('useButtonDestinations', 'true')

      if (selectedClass && selectedClass !== "select-option") params.set('starRating', selectedClass)

      console.log('🏨 Accommodation search params:', params.toString())

      const response = await fetch(`/api/accommodation/search?${params}`)
      const data = await response.json()

      if (data.success && data.accommodations) {
        console.log(`🏨 Found ${data.accommodations.length} accommodations`)

        // Transform accommodations to match tour structure
        const transformedTours = data.accommodations.map((acc: any) => {
          const imageData = getAccommodationImage(
            acc.type || 'hotel',
            acc.name || '',
            acc.supplier || '',
            acc.code || acc.id,
            currentSupplierImages
          )

          return {
            ...acc,
            id: acc.code || acc.id,
            name: acc.displayName || acc.name || `${acc.hotelName || 'Hotel'} - ${acc.roomType || 'Room'}`,
            image: imageData.imageUrl,
            imageAlt: imageData.alt,
            description: acc.description || acc.hotelDescription || '',
            duration: `${acc.roomType || 'Accommodation'}`,  // Keep for internal use but not displayed
            destination: tourPlanDestination,
            locality: acc.locality || '',
            actualDestination: selectedDestination ? (availableDestinations.find(d => d.value === selectedDestination)?.label || selectedDestination) : '',
            roomTypeForFiltering: acc.roomType || '',
            starRating: acc.starRating || '',  // Ensure starRating is passed through
            selectedDestinationFromDropdown: selectedDestination ? (availableDestinations.find(d => d.value === selectedDestination)?.label || selectedDestination) : '',
            countries: [selectedCountry] // For filtering
          }
        })
        
        setTours(transformedTours)

        // Extract available destination filters from tour results
        const destinationSet = new Set<string>()

        transformedTours.forEach((tour: any) => {
          // Add to destination filters
          if (tour.locality && tour.locality.trim() !== '') {
            destinationSet.add(tour.locality)
          } else if (tour.destination && tour.destination !== tour.locality) {
            destinationSet.add(tour.destination)
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

  const renderStarRating = (starRating: string | undefined) => {
    if (!starRating) return null

    // Parse the star rating (now comes as simple numbers: 1, 2, 3, 4, 5, 6)
    const rating = parseInt(starRating)

    if (isNaN(rating) || rating < 1 || rating > 6) return null

    // For 6 star, show as luxury/special
    if (rating === 6) {
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-amber-500 text-amber-500"
            />
          ))}
          <span className="text-sm text-amber-600 font-semibold ml-1">Luxury</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating} Star Hotel)</span>
      </div>
    )
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
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center pt-16 md:pt-20">
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
                Select a country and star rating to find specific accommodations. Star rating helps filter to your preferred hotel class.
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
                    <SelectValue placeholder="Select Destination (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="all-destinations" value="all-destinations">
                      All Destinations
                    </SelectItem>
                    {availableDestinations?.map((destination, index) => (
                      <SelectItem key={`${destination.value}-${index}`} value={destination.value}>
                        {destination.label}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedClass}
                  onValueChange={(value) => setSelectedClass(value === 'clear' ? '' : value)}
                  disabled={!selectedCountry || !availableClasses || availableClasses.length === 0}
                >
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500 disabled:bg-gray-400 disabled:text-gray-600">
                    <SelectValue placeholder="Select Star Rating (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedClass && (
                      <SelectItem key="clear-rating" value="clear">
                        Clear Star Rating
                      </SelectItem>
                    )}
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
              {/* Clear Filters Button - shows when filters are applied */}
              {(selectedDestination || selectedClass) && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedDestination("")
                      setSelectedClass("")
                    }}
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {searchPerformed && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                {loading ? (
                  <p className="text-gray-600">Searching accommodations...</p>
                ) : filteredTours.length > 0 ? (
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const parts = []
                      if (selectedClass) {
                        const classLabel = availableClasses.find(c => c.value === selectedClass)?.label
                        if (classLabel) parts.push(classLabel)
                      }
                      parts.push('accommodations in')
                      if (selectedDestination && selectedDestination !== "select-option" && selectedDestination !== "all-destinations") {
                        const destLabel = availableDestinations.find(d => d.value === selectedDestination)?.label
                        if (destLabel) parts.push(destLabel)
                      } else {
                        parts.push(availableCountries.find(c => c.value === selectedCountry)?.label || selectedCountry)
                      }
                      return `Showing ${parts.join(' ')}`
                    })()}
                    <span className="ml-2 font-semibold">({filteredTours.length} {filteredTours.length === 1 ? 'result' : 'results'})</span>
                  </div>
                ) : searchPerformed ? (
                  <div className="text-gray-600">
                    <p>No accommodations found for your search criteria.</p>
                    {(selectedDestination || selectedClass) && (
                      <p className="text-sm mt-1">Try adjusting your destination or room type filters.</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Use the search form above to find accommodations.</p>
                )}
              </div>
              {/* New Search Button */}
              {filteredTours.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCountry("")
                    setSelectedDestination("")
                    setSelectedClass("")
                    setSearchPerformed(false)
                    setTours([])
                    setFilteredTours([])
                    setSelectedDestinationFilters([])
                    setError(null)
                  }}
                  className="border-amber-500 text-amber-600 hover:bg-amber-50"
                >
                  Start New Search
                </Button>
              )}
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
                        src={tour.image || '/images/products/portswood-captains-suite.jpg'}
                        alt={tour.imageAlt || tour.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        onError={(e) => {
                          // Additional fallback if the primary placeholder fails
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/products/portswood-captains-suite.jpg';
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

                      {tour.starRating ? (
                        <div className="mb-3">
                          {renderStarRating(tour.starRating)}
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600 mb-3">
                          <Hotel className="h-4 w-4 mr-1" />
                          <span className="text-sm">Hotel Accommodation</span>
                        </div>
                      )}
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {tour.description}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/accommodation/hotel/${encodeURIComponent(tour.name.split(' - ')[0])}?productCode=${tour.code || tour.id}`}
                          className="w-full"
                        >
                          <Button className="w-full bg-amber-500 hover:bg-amber-600">
                            <Bed className="h-4 w-4 mr-2" />
                            Select Room Type
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
                    setSelectedDestinationFilters([])
                    setSearchPerformed(false)
                    setTours([])
                    setFilteredTours([])
                    setAvailableDestinationFilters([])
                    setError(null)
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