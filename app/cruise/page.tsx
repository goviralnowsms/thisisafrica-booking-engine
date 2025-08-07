"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Search, Loader2, Star, Ship } from "lucide-react"


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

  const handleSearch = async () => {
    if (!selectedCountry && !selectedDestination) {
      alert('Please select a country or destination to search for Cruises')
      return
    }

    console.log('🚢 Starting cruise search...')
    setLoading(true)
    setSearchPerformed(false)

    try {
      // Build search URL with parameters
      const params = new URLSearchParams()
      params.set('productType', 'Cruises')
      if (selectedCountry) params.set('destination', selectedCountry)
      if (selectedDestination) params.set('destination', selectedDestination)
      if (selectedClass) params.set('class', selectedClass)
      
      console.log('🚢 Cruise search params:', params.toString())
      const response = await fetch(`/api/tourplan?${params.toString()}`)
      const result = await response.json()

      console.log('🚢 Cruise search response:', result)

      if (result.success) {
        console.log('🚢 Found', result.tours?.length || 0, 'cruises')
        console.log('🚢 Setting tours and filteredTours...')
        setTours(result.tours || [])
        setFilteredTours(result.tours || [])
        console.log('🚢 Tours state updated')
      } else {
        console.error("🚢 Cruise search failed:", result.error)
        setTours([])
        setFilteredTours([])
      }
    } catch (error) {
      console.error("🚢 Search error:", error)
      setTours([])
      setFilteredTours([])
    } finally {
      console.log('🚢 Setting loading=false, searchPerformed=true')
      setLoading(false)
      setSearchPerformed(true)
      console.log('🚢 Search complete. Final state:', { 
        loading: false, 
        searchPerformed: true, 
        toursLength: tours.length,
        filteredToursLength: filteredTours.length 
      })
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
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="botswana">Botswana</SelectItem>
                    <SelectItem value="namibia">Namibia</SelectItem>
                    <SelectItem value="zambezi">Zambezi</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDestination} onValueChange={(value) => setSelectedDestination(value)}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chobe-river">Chobe River</SelectItem>
                    <SelectItem value="zambezi-river">Zambezi River</SelectItem>
                    <SelectItem value="victoria-falls">Victoria Falls</SelectItem>
                    <SelectItem value="okavango-delta">Okavango Delta</SelectItem>
                    <SelectItem value="caprivi-strip">Caprivi Strip</SelectItem>
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
                                  ${tour.rates[0]?.singleRate ? tour.rates[0].singleRate.toLocaleString() : 'POA'}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Link href={`/products/${tour.code}`} className="flex-1">
                              <Button variant="outline" className="w-full">
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
                    <p className="text-lg text-gray-600 mb-4">No cruises found for your search criteria.</p>
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

      {/* Cruise Benefits */}
      {(searchPerformed && filteredTours.length > 0) && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why Choose African Cruises?</h2>
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

      {/* Call to Action */}
      {!searchPerformed && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Set Sail?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Select your preferred destination above to discover our exceptional cruise experiences. 
              Explore Africa's stunning coastlines and waterways in comfort and style.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => document.querySelector('.bg-gray-100')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Search Cruises
              </Button>
              <Link href="/contact">
                <Button variant="outline">Need Help Choosing?</Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}