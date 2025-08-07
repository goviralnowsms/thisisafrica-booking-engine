"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Search, Loader2, Star } from "lucide-react"


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
  }, [])

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
    if (!selectedCountry && !selectedDestination) {
      alert('Please select a country or destination to search for Guided group tours')
      return
    }

    setLoading(true)
    setSearchPerformed(false)

    try {
      // Build search URL with parameters
      const params = new URLSearchParams()
      params.set('productType', 'Guided group tours')
      if (selectedCountry) params.set('destination', selectedCountry)
      if (selectedDestination) params.set('destination', selectedDestination)
      if (selectedClass) params.set('class', selectedClass)
      
      const response = await fetch(`/api/tourplan?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        const tourList = result.tours || []
        setTours(tourList)
        setFilteredTours(tourList)
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
                              <Link href={`/booking/create?tourId=${tour.code}`} className="flex-1">
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
              <h2 className="text-3xl font-bold mb-6">Why Choose Guided group tours?</h2>
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

      {/* Call to Action */}
      {!searchPerformed && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Explore Africa?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Select your preferred destination above to discover our carefully curated group tours. 
              Each tour is designed to provide authentic experiences with expert local guides.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => document.querySelector('.bg-gray-100')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Search Guided group tours
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
