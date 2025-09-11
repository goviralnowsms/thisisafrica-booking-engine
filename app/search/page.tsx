"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Search, Loader2, Star, ArrowLeft, Filter } from "lucide-react"
import { getAvailableCountriesFromAPI, getAvailableDestinationsFromAPI, getTourPlanDestinationNameFromValue } from "@/lib/dynamic-destination-mapping"
import { hasRailAvailability, getRailAvailability } from "@/lib/rail-availability"
import { hasCruiseAvailability, getCruiseAvailability } from "@/lib/cruise-availability"
import { shouldShowDepartureDay, getDepartureDayMessage } from "@/lib/group-tours-availability"

export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get search parameters from URL
  const initialCountry = searchParams.get('country') || ""
  const initialDestination = searchParams.get('destination') || ""
  const initialClass = searchParams.get('class') || ""
  
  const [searchCriteria, setSearchCriteria] = useState({
    country: initialCountry,
    destination: initialDestination,
    class: initialClass
  })
  
  const [searchResults, setSearchResults] = useState<{
    groupTours: any[],
    packages: any[],
    rail: any[],
    cruises: any[]
  }>({
    groupTours: [],
    packages: [],
    rail: [],
    cruises: []
  })
  
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [availableCountries, setAvailableCountries] = useState<{value: string, label: string}[]>([])
  const [availableDestinations, setAvailableDestinations] = useState<{value: string, label: string, tourPlanName: string}[]>([])
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(['Group Tours', 'Packages', 'Rail', 'Cruises'])
  const [productImages, setProductImages] = useState<{[key: string]: string}>({})
  const [sanityImages, setSanityImages] = useState<{[key: string]: any}>({})

  // Initialize countries and perform initial search
  useEffect(() => {
    const loadCountries = async () => {
      // Get unique countries from all product types
      const allCountries = new Map<string, string>()
      
      for (const productType of ['Group Tours', 'Rail', 'Cruises', 'Packages']) {
        const countries = await getAvailableCountriesFromAPI(productType)
        countries.forEach(country => {
          allCountries.set(country.value, country.label)
        })
      }
      
      const uniqueCountries = Array.from(allCountries.entries()).map(([value, label]) => ({ value, label }))
      uniqueCountries.sort((a, b) => a.label.localeCompare(b.label))
      setAvailableCountries(uniqueCountries)
    }
    
    loadCountries()
    
    // Load Sanity images for better performance
    const loadSanityImages = async () => {
      try {
        // Fetch all product images from Sanity in one go
        const response = await fetch('/api/sanity/product-images', {
          cache: 'no-store'
        })
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const imageMap: {[key: string]: any} = {}
            result.data.forEach((item: any) => {
              if (item.productCode) {
                imageMap[item.productCode] = item
              }
            })
            setSanityImages(imageMap)
          }
        }
      } catch (error) {
        console.warn('Failed to load Sanity images:', error)
      }
    }
    
    // Load local image index as fallback
    const loadImageIndex = async () => {
      try {
        const response = await fetch('/images/product-image-index.json')
        if (!response.ok) return
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) return
        
        const imageIndex = await response.json()
        const imageMap: {[key: string]: string} = {}
        
        Object.keys(imageIndex).forEach(productCode => {
          const images = imageIndex[productCode]
          if (images && images.length > 0) {
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
    
    // Load both in parallel
    Promise.all([loadSanityImages(), loadImageIndex()])
    
    // Perform initial search if we have parameters
    if (initialCountry) {
      performSearch(initialCountry, initialDestination, initialClass)
    }
  }, [initialCountry, initialDestination, initialClass])

  // Update available destinations when country changes
  useEffect(() => {
    const loadDestinations = async () => {
      if (searchCriteria.country) {
        const allDestinations = new Map<string, {value: string, label: string, tourPlanName: string}>()
        
        for (const productType of ['Group Tours', 'Rail', 'Cruises', 'Packages']) {
          const destinations = await getAvailableDestinationsFromAPI(productType, searchCriteria.country)
          destinations.forEach(dest => {
            allDestinations.set(dest.value, dest)
          })
        }
        
        const uniqueDestinations = Array.from(allDestinations.values())
        uniqueDestinations.sort((a, b) => a.label.localeCompare(b.label))
        setAvailableDestinations(uniqueDestinations)
      } else {
        setAvailableDestinations([])
      }
    }
    
    loadDestinations()
  }, [searchCriteria.country])

  const performSearch = async (country: string, destination?: string, tourClass?: string) => {
    if (!country) {
      alert('Please select a country to search')
      return
    }

    console.log('🔍 Starting multi-product search...')
    setLoading(true)
    setSearchPerformed(false)

    const results = {
      groupTours: [],
      packages: [],
      rail: [],
      cruises: []
    }

    try {
      // Search each product type in parallel
      const searchPromises = selectedProductTypes.map(async (productType) => {
        const params = new URLSearchParams()
        params.set('productType', productType)
        
        const tourPlanDestination = getTourPlanDestinationNameFromValue(productType, country, destination || country)
        params.set('destination', tourPlanDestination)
        
        if (tourClass) params.set('class', tourClass)
        
        console.log(`🔍 Searching ${productType}:`, params.toString())
        
        try {
          const response = await fetch(`/api/tourplan?${params.toString()}`)
          const result = await response.json()
          
          if (result.success && result.tours) {
            console.log(`✅ ${productType}: Found ${result.tours.length} products`)
            return { productType, tours: result.tours }
          } else {
            console.log(`❌ ${productType}: No results or error`)
            return { productType, tours: [] }
          }
        } catch (error) {
          console.error(`❌ ${productType} search failed:`, error)
          return { productType, tours: [] }
        }
      })

      const searchResults = await Promise.all(searchPromises)
      
      // Organize results by product type
      searchResults.forEach(({ productType, tours }) => {
        switch (productType) {
          case 'Group Tours':
            results.groupTours = tours
            break
          case 'Packages':
            results.packages = tours
            break
          case 'Rail':
            results.rail = tours
            break
          case 'Cruises':
            results.cruises = tours
            break
        }
      })

      setSearchResults(results)
      
      const totalResults = results.groupTours.length + results.packages.length + results.rail.length + results.cruises.length
      console.log(`🎉 Search complete: ${totalResults} total products found`)
      
    } catch (error) {
      console.error('🔍 Search error:', error)
    } finally {
      setLoading(false)
      setSearchPerformed(true)
    }
  }

  const handleSearch = () => {
    performSearch(searchCriteria.country, searchCriteria.destination, searchCriteria.class)
  }

  const getProductImage = (tour: any, productType: string) => {
    const fallbackImages = {
      'Group Tours': '/images/products/Lion-1-1200x800.jpg',
      'Packages': '/images/products/Lion-1-1200x800.jpg', 
      'Rail': '/images/rail-journey.jpg',
      'Cruises': '/images/zambezi-queen.png'
    }
    
    if (!tour.code) {
      return fallbackImages[productType as keyof typeof fallbackImages] || '/images/products/Lion-1-1200x800.jpg'
    }
    
    // Check Sanity images first (fastest)
    if (sanityImages[tour.code]?.primaryImage?.asset?.url) {
      return sanityImages[tour.code].primaryImage.asset.url
    }
    
    // Check local image index
    if (productImages[tour.code]) {
      return productImages[tour.code]
    }
    
    // Fallback to product-specific default images
    return fallbackImages[productType as keyof typeof fallbackImages] || '/images/products/Lion-1-1200x800.jpg'
  }

  const renderProductCard = (tour: any, productType: string) => {
    const isRail = productType === 'Rail'
    const isCruise = productType === 'Cruises'
    const hasAvailability = isRail ? hasRailAvailability(tour.code) : 
                           isCruise ? hasCruiseAvailability(tour.code) : true
    const availabilityInfo = isRail ? getRailAvailability(tour.code) : 
                            isCruise ? getCruiseAvailability(tour.code) : null
    
    return (
      <div key={`${productType}-${tour.id}`} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-48">
          <Image 
            src={getProductImage(tour, productType)} 
            alt={tour.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
            onError={(e) => {
              // Fallback to product-specific default image if loading fails
              const target = e.target as HTMLImageElement;
              const fallbackImages = {
                'Group Tours': '/images/products/Lion-1-1200x800.jpg',
                'Packages': '/images/products/Lion-1-1200x800.jpg',
                'Rail': '/images/rail-journey.jpg',
                'Cruises': '/images/zambezi-queen.png'
              }
              target.src = fallbackImages[productType as keyof typeof fallbackImages] || '/images/products/Lion-1-1200x800.jpg';
            }}
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-amber-500 hover:bg-amber-600">{productType}</Badge>
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
              {(isRail && !hasAvailability) || (isCruise && !hasAvailability) ? (
                <>
                  <p className="text-sm text-gray-500">Availability</p>
                  <p className="text-lg font-bold text-orange-600">Quote Required</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500">From</p>
                  {tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 ? (
                    <p className="text-lg font-bold text-blue-600">On Request</p>
                  ) : (
                    <p className="text-xl font-bold text-green-600">
                      ${tour.rates[0]?.singleRate ? Math.round(tour.rates[0].singleRate / 100).toLocaleString() : 'POA'}
                    </p>
                  )}
                </>
              )}
              {availabilityInfo?.departureDay && (
                <p className="text-xs text-gray-500">Departs {availabilityInfo.departureDay}s</p>
              )}
              {productType === 'Group Tours' && shouldShowDepartureDay(tour.code) && (
                <p className="text-xs text-gray-500 mt-1">{getDepartureDayMessage(tour.code)}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href={`/products/${tour.code}`} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full">View details</Button>
            </Link>
            {(isRail && !hasAvailability) || (isCruise && !hasAvailability) || tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 ? (
              <Link href={`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}&type=${productType.toLowerCase()}`} className="flex-1">
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
    )
  }

  const totalResults = searchResults.groupTours.length + searchResults.packages.length + searchResults.rail.length + searchResults.cruises.length

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Search Results</h1>
              {searchPerformed && (
                <p className="text-gray-600">
                  {loading ? 'Searching...' : `${totalResults} results found for ${searchCriteria.country}`}
                </p>
              )}
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select value={searchCriteria.country} onValueChange={(value) => setSearchCriteria(prev => ({...prev, country: value}))}>
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
                value={searchCriteria.destination} 
                onValueChange={(value) => setSearchCriteria(prev => ({...prev, destination: value}))}
                disabled={!searchCriteria.country || availableDestinations.length === 0}
              >
                <SelectTrigger className="bg-amber-500 text-white border-amber-500 disabled:bg-gray-400 disabled:text-gray-600">
                  <SelectValue placeholder={searchCriteria.country ? "Select Destination" : "Select Country First"} />
                </SelectTrigger>
                <SelectContent>
                  {availableDestinations.map((destination) => (
                    <SelectItem key={destination.value} value={destination.value}>
                      {destination.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={searchCriteria.class} onValueChange={(value) => setSearchCriteria(prev => ({...prev, class: value}))}>
                <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} disabled={loading} className="bg-amber-500 hover:bg-amber-600 text-white">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>
            </div>
            
            {/* Product Type Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 flex items-center mr-2">
                <Filter className="h-4 w-4 mr-1" />
                Show:
              </span>
              {['Group Tours', 'Packages', 'Rail', 'Cruises'].map((type) => (
                <Button
                  key={type}
                  variant={selectedProductTypes.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (selectedProductTypes.includes(type)) {
                      setSelectedProductTypes(prev => prev.filter(t => t !== type))
                    } else {
                      setSelectedProductTypes(prev => [...prev, type])
                    }
                  }}
                  className={selectedProductTypes.includes(type) ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {(loading || searchPerformed) && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
                <p className="text-lg text-gray-600">Searching all product types...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Group Tours Results */}
                {selectedProductTypes.includes('Group Tours') && searchResults.groupTours.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      Group Tours ({searchResults.groupTours.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                      {searchResults.groupTours.map((tour) => renderProductCard(tour, 'Group Tours'))}
                    </div>
                    <div className="text-center">
                      <Link href={`/group-tours-list?country=${searchCriteria.country}&destination=${searchCriteria.destination}&class=${searchCriteria.class}`}>
                        <Button variant="outline">View all Group Tours</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Packages Results */}
                {selectedProductTypes.includes('Packages') && searchResults.packages.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      Packages ({searchResults.packages.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                      {searchResults.packages.map((tour) => renderProductCard(tour, 'Packages'))}
                    </div>
                    <div className="text-center">
                      <Link href={`/packages?country=${searchCriteria.country}&destination=${searchCriteria.destination}&class=${searchCriteria.class}`}>
                        <Button variant="outline">View all Packages</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Rail Results */}
                {selectedProductTypes.includes('Rail') && searchResults.rail.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      Rail Journeys ({searchResults.rail.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                      {searchResults.rail.map((tour) => renderProductCard(tour, 'Rail'))}
                    </div>
                    <div className="text-center">
                      <Link href={`/rail?country=${searchCriteria.country}&destination=${searchCriteria.destination}&class=${searchCriteria.class}`}>
                        <Button variant="outline">View all Rail Journeys</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Cruises Results */}
                {selectedProductTypes.includes('Cruises') && searchResults.cruises.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      Cruises ({searchResults.cruises.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                      {searchResults.cruises.map((tour) => renderProductCard(tour, 'Cruises'))}
                    </div>
                    <div className="text-center">
                      <Link href={`/cruise?country=${searchCriteria.country}&destination=${searchCriteria.destination}&class=${searchCriteria.class}`}>
                        <Button variant="outline">View all Cruises</Button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {totalResults === 0 && searchPerformed && (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">No tours found for your search criteria.</p>
                    <p className="text-gray-500 mb-6">Try selecting a different country or destination, or adjust your product type filters.</p>
                    <Button onClick={() => {
                      setSearchCriteria({ country: "", destination: "", class: "" })
                      setSearchPerformed(false)
                      setSearchResults({ groupTours: [], packages: [], rail: [], cruises: [] })
                    }}>
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}