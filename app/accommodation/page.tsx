"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Search, Loader2, Star, Bed } from "lucide-react"


export default function AccommodationPage() {
  const router = useRouter()
  const [tours, setTours] = useState<any[]>([])
  const [filteredTours, setFilteredTours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedDestination, setSelectedDestination] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [productImages, setProductImages] = useState<{[key: string]: string}>({})

  // Format pricing from TourPlan rates (same format as Special Offers)
  const formatPrice = (tour: any) => {
    if (!tour.rates || tour.rates.length === 0) {
      return 'On Request'
    }
    
    const rate = tour.rates[0]
    if (!rate) return 'On Request'
    
    // Get the best available rate (twin > double > single)
    const price = rate.twinRate || rate.doubleRate || rate.singleRate
    if (!price || price === 0) return 'On Request'
    
    console.log('🏨 Accommodation pricing debug:', {
      tourCode: tour.code,
      tourName: tour.name,
      rawPrice: price,
      rateData: rate
    })
    
    // TourPlan rates are in cents, need to convert to dollars first
    // Then divide by 2 to get per person pricing
    const perPerson = Math.round(price / 100 / 2)
    
    console.log('🏨 Formatted price:', `From $${perPerson.toLocaleString()}`)
    return `From $${perPerson.toLocaleString()}`
  }

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
    if (!tourCode) return "/images/accommodation-lodge.jpg"
    
    // Check if we have the image cached
    if (productImages[tourCode]) {
      return productImages[tourCode]
    }
    
    // Fallback to generic accommodation image
    return "/images/accommodation-lodge.jpg"
  }

  const handleSearch = async () => {
    if (!selectedCountry && !selectedDestination) {
      alert('Please select a country or destination to search for Accommodation')
      return
    }

    setLoading(true)
    setSearchPerformed(false)

    try {
      // Build search URL with parameters
      const params = new URLSearchParams()
      params.set('productType', 'Accommodation')
      if (selectedCountry) params.set('destination', selectedCountry)
      if (selectedDestination) params.set('destination', selectedDestination)
      if (selectedClass) params.set('class', selectedClass)
      params.set('adults', adults.toString())
      params.set('children', children.toString())
      
      const response = await fetch(`/api/tourplan?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setTours(result.tours || [])
        setFilteredTours(result.tours || [])
      } else {
        console.error("Search failed:", result.error)
        setTours([])
        setFilteredTours([])
      }
    } catch (error) {
      console.error("Search error:", error)
      setTours([])
      setFilteredTours([])
    } finally {
      setLoading(false)
      setSearchPerformed(true)
    }
  }


  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/accomm-hero.jpg"
          alt="Luxury safari lodge overlooking African wilderness"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Accommodation</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Discover exceptional lodges, camps, and hotels across Africa
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              From luxury safari camps to boutique hotels, find the perfect accommodation for your African adventure
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Find your perfect accommodation</h2>
            <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
              Accommodation in Africa can range from basic to the ultimate in luxury. Accommodation styles include tented camps, or 'glamping', which range from 3 star to 5 stars, boutique hotels, chalets, manors, rondavels, guesthouses and self-erected tents. Some popular accommodation options are included on our website.
            </p>
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value)}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="botswana">Botswana</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="namibia">Namibia</SelectItem>
                    <SelectItem value="south-africa">South Africa</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                    <SelectItem value="zambia">Zambia</SelectItem>
                    <SelectItem value="zimbabwe">Zimbabwe</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDestination} onValueChange={(value) => setSelectedDestination(value)}>
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

                <Select value={adults.toString()} onValueChange={(value) => setAdults(parseInt(value))}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Adults" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Adult</SelectItem>
                    <SelectItem value="2">2 Adults</SelectItem>
                    <SelectItem value="3">3 Adults</SelectItem>
                    <SelectItem value="4">4 Adults</SelectItem>
                    <SelectItem value="5">5 Adults</SelectItem>
                    <SelectItem value="6">6 Adults</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
                  <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                    <SelectValue placeholder="Children" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 Children</SelectItem>
                    <SelectItem value="1">1 Child</SelectItem>
                    <SelectItem value="2">2 Children</SelectItem>
                    <SelectItem value="3">3 Children</SelectItem>
                    <SelectItem value="4">4 Children</SelectItem>
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
                <p className="text-lg text-gray-600">Searching for Accommodation...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">
                    Accommodation {filteredTours.length > 0 && `(${filteredTours.length} properties found)`}
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
                              // Fallback to generic accommodation image if product image fails to load
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/accommodation-lodge.jpg";
                            }}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-amber-500 hover:bg-amber-600">Accommodation</Badge>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center text-sm text-gray-500 mb-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{tour.duration || 'Multiple nights'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{tour.supplier}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Pricing</p>
                              <p className="text-lg font-bold text-blue-600">{formatPrice(tour)}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Link href={`/products/${tour.code}`} className="flex-1">
                              <Button variant="outline" className="w-full">
                                View details
                              </Button>
                            </Link>
                            <Link href={`/contact?tour=${tour.code}&name=${encodeURIComponent(tour.name)}&type=accommodation`} className="flex-1">
                              <Button className="w-full bg-blue-500 hover:bg-blue-600">Get quote</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 mb-4">No accommodation found for your search criteria.</p>
                    <p className="text-gray-500 mb-6">Try selecting a different country or destination.</p>
                    <Button onClick={() => {
                      setSelectedCountry("")
                      setSelectedDestination("")
                      setSelectedClass("")
                      setAdults(2)
                      setChildren(0)
                      setSearchPerformed(false)
                      setTours([])
                      setFilteredTours([])
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

      {/* Accommodation Benefits */}
      {(searchPerformed && filteredTours.length > 0) && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why choose our accommodation?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bed className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Handpicked properties</h3>
                  <p className="text-gray-600">
                    Every lodge and hotel is carefully selected for quality, location, and authentic African experience
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Exceptional service</h3>
                  <p className="text-gray-600">
                    Experience warm African hospitality with staff trained to provide outstanding service
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prime locations</h3>
                  <p className="text-gray-600">Strategically located near major attractions and wildlife areas</p>
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