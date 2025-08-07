"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"
import { searchTours } from "@/lib/tourplan-api"

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSearching, setIsSearching] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedTour, setSelectedTour] = useState<any | null>(null)
  const [productImages, setProductImages] = useState<{[key: string]: string}>({})
  const [searchCriteria, setSearchCriteria] = useState({
    productType: "",
    country: "",
    destination: "",
    class: ""
  })

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
  }, [])

  // Auto-search if URL has search parameters
  useEffect(() => {
    const productType = searchParams.get('productType')
    const country = searchParams.get('country')
    const destination = searchParams.get('destination')
    const classLevel = searchParams.get('class')

    if (productType) {
      // Set the search criteria from URL params
      setSearchCriteria({
        productType: productType || '',
        country: country || '',
        destination: destination || '',
        class: classLevel || ''
      })
      
      // Auto-perform search based on URL parameters
      handleSimpleSearch({
        productType: productType || '',
        country: country || '',
        destination: destination || '',
        class: classLevel || ''
      })
    }
  }, [searchParams])

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

  // Simple search functionality using TourPlan API (matching homepage pattern)
  const handleSimpleSearch = async (criteria: any) => {
    // For Group Tours, require either country or destination to be selected
    if (criteria.productType === 'Group Tours' && !criteria.country && !criteria.destination) {
      alert('Please select a country or destination to search for Group Tours')
      return
    }
    
    setIsSearching(true)

    try {
      console.log("Search criteria:", criteria)
      // Build search URL with parameters
      const params = new URLSearchParams()
      if (criteria.productType) params.set('productType', criteria.productType)
      if (criteria.country) params.set('destination', criteria.country)
      if (criteria.destination) params.set('destination', criteria.destination)
      if (criteria.class) params.set('class', criteria.class)
      
      const response = await fetch(`/api/tourplan?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setSearchResults(result.tours || [])
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

  const handleSearch = () => {
    handleSimpleSearch(searchCriteria)
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
      <section className="relative h-[60vh]">
        <Image src="/images/products/booking-page-hero.jpeg" alt="African safari experience" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Find your perfect African adventure</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Search our curated selection of tours, safaris, and experiences
            </p>
          </div>
        </div>
      </section>

      {/* Simple Search Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Search tours & safaris</h2>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select value={searchCriteria.productType} onValueChange={(value) => setSearchCriteria(prev => ({...prev, productType: value}))}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Tour Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Group Tours">Group Tours</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Cruises">Cruises</SelectItem>
                    <SelectItem value="Rail">Rail Tours</SelectItem>
                    <SelectItem value="Packages">Packages</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchCriteria.country} onValueChange={(value) => setSearchCriteria(prev => ({...prev, country: value}))}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="botswana">Botswana</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="south-africa">South Africa</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="namibia">Namibia</SelectItem>
                    <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                    <SelectItem value="zambia">Zambia</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchCriteria.destination} onValueChange={(value) => setSearchCriteria(prev => ({...prev, destination: value}))}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cape-town">Cape Town</SelectItem>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="victoria-falls">Victoria Falls</SelectItem>
                    <SelectItem value="serengeti">Serengeti</SelectItem>
                    <SelectItem value="okavango">Okavango Delta</SelectItem>
                    <SelectItem value="kruger">Kruger National Park</SelectItem>
                    <SelectItem value="masai-mara">Masai Mara</SelectItem>
                    <SelectItem value="zanzibar">Zanzibar</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={searchCriteria.class} onValueChange={(value) => setSearchCriteria(prev => ({...prev, class: value}))}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="standard-plus">Standard-plus</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isSearching ? (
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
                Search results {searchResults.length > 0 && `(${searchResults.length} tours found)`}
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((tour) => (
                    <div key={tour.id} className="bg-white rounded-xl overflow-hidden shadow-lg">
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
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <span className="font-medium mr-2">Duration:</span> {tour.duration || 'Multiple days'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium mr-2">Supplier:</span> {tour.supplier}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">From</p>
                            {tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 ? (
                              <p className="text-lg font-bold text-blue-600">On Request</p>
                            ) : (
                              <p className="text-xl font-bold">
                                ${tour.rates[0]?.singleRate ? tour.rates[0].singleRate.toLocaleString() : 'POA'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link href={`/products/${tour.code}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full bg-transparent"
                            >
                              View Details
                            </Button>
                          </Link>
                          {tour.rates?.[0]?.rateName === 'Price on Application' || tour.rates?.[0]?.singleRate === 0 ? (
                            <Link href={`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}`} className="flex-1">
                              <Button className="w-full bg-blue-500 hover:bg-blue-600">Get Quote</Button>
                            </Link>
                          ) : (
                            <Link href={`/booking/create?tourId=${tour.id}`} className="flex-1">
                              <Button className="w-full bg-amber-500 hover:bg-amber-600">Book Now</Button>
                            </Link>
                          )}
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
