"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Loader2, Star, Gift, Calendar } from "lucide-react"

export default function SpecialOffersPage() {
  const router = useRouter()
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [productImages, setProductImages] = useState<{[key: string]: string}>({})
  const [productAvailability, setProductAvailability] = useState<{[key: string]: boolean}>({}) // Track availability for each product

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
    loadSpecialOffers()
  }, [])


  // Function to get product-specific image from cached data or fallback
  const getProductImage = (offer: any) => {
    // Map specific product codes to appropriate images (same as homepage)
    const productCode = offer.code?.toUpperCase() || ''
    
    if (productCode === 'HDSSPMAKUTSMSSCLS' || productCode.includes('KRUGER')) {
      return offer.image || '/images/products/kruger-package.jpeg' // Classic Kruger Package
    }
    if (productCode.includes('SABI') || productCode.includes('GKPSPSABBLDSABBLS')) {
      return '/images/products/sabi-sabi1.png' // Sabi Sabi - use actual lodge image (PNG format)
    }
    if (productCode.includes('SAVANNA') || productCode.includes('GKPSPSAV002SAVLHM')) {
      return '/images/products/savannah-lodge-honeymoon.png' // Savanna Lodge - specific honeymoon image
    }
    if (productCode.includes('MAKUTSI') || productCode.includes('HDSSPMAKUTSMSSCLS')) {
      return '/images/safari-elephants.png' // Makutsi - family safari theme
    }
    
    // Check if we have the image cached from product-image-index.json
    if (productImages[offer.code]) {
      return productImages[offer.code]
    }
    
    // Default fallback (same as homepage)
    return offer.image || '/images/safari-lion.png'
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
        console.log(`✅ Availability for ${productCode}:`, hasValidDays, 'Days checked:', result.data.calendar.length)
        setProductAvailability(prev => ({ ...prev, [productCode]: hasValidDays }))
      } else {
        // If we can't get calendar data, default to false (show Get Quote)
        console.log(`❌ No calendar data for ${productCode}, result:`, result)
        setProductAvailability(prev => ({ ...prev, [productCode]: false }))
      }
    } catch (error) {
      console.warn('❌ Error checking availability for', productCode, ':', error)
      // On error, default to false (show Get Quote)
      setProductAvailability(prev => ({ ...prev, [productCode]: false }))
    }
  }

  const loadSpecialOffers = async () => {
    console.log('🎁 Loading special offers...')
    setLoading(true)

    try {
      const response = await fetch('/api/tourplan/special-offers')
      const result = await response.json()

      console.log('🎁 Special offers response:', result)

      if (result.success && result.offers) {
        console.log('🎁 Found', result.offers.length, 'special offers')
        setOffers(result.offers)
        
        // Check availability for each offer
        result.offers.forEach((offer: any) => {
          checkProductAvailability(offer.code)
        })
      } else {
        console.error("🎁 Special offers failed:", result.error)
        setOffers([])
      }
    } catch (error) {
      console.error("🎁 Error loading special offers:", error)
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/vic-falls2-crop.jpeg"
          alt="Special offers and deals for African adventures"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Special offers</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Exclusive deals and limited-time offers for your African adventure
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Discover amazing savings on luxury safaris, group tours, and unique experiences across Africa
            </p>
          </div>
        </div>
      </section>


      {/* Special Offers Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Current special offers</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Take advantage of these limited-time deals and exclusive offers. Perfect for travelers looking for exceptional value on authentic African experiences.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin mb-4" />
              <p className="text-lg text-gray-600">Loading special offers...</p>
            </div>
          ) : offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    <Image 
                      src={getProductImage(offer)} 
                      alt={offer.name} 
                      fill 
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to generic safari image if product image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/safari-lion.png";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">Special Offer</Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{offer.description}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{offer.duration || 'Multiple days'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{offer.location || offer.class || 'Africa'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">From</p>
                        {(() => {
                          // Use same pricing logic as homepage
                          if (!offer.rates || offer.rates.length === 0) return (
                            <p className="text-lg font-bold text-blue-600">Special Price</p>
                          );
                          
                          const rate = offer.rates[0];
                          if (!rate || (!rate.twinRate && !rate.doubleRate && !rate.singleRate)) return (
                            <p className="text-lg font-bold text-blue-600">Special Price</p>
                          );
                          
                          // Show per person twin share pricing if available (same as homepage)
                          if (rate.twinRate && rate.twinRate > 0) {
                            // API data: Values like 240800 are in cents for twin room
                            // Convert from cents and divide by 2 for per person
                            const perPerson = Math.round(rate.twinRate / 200) // Divide by 200 (100 for cents + 2 for twin share)
                            return (
                              <p className="text-xl font-bold text-green-600">
                                ${perPerson.toLocaleString()}
                              </p>
                            );
                          }
                          
                          if (rate.doubleRate && rate.doubleRate > 0) {
                            const perPerson = Math.round(rate.doubleRate / 200);
                            return (
                              <p className="text-xl font-bold text-green-600">
                                ${perPerson.toLocaleString()}
                              </p>
                            );
                          }
                          
                          if (rate.singleRate && rate.singleRate > 0) {
                            const price = Math.round(rate.singleRate / 100);
                            return (
                              <p className="text-xl font-bold text-green-600">
                                ${price.toLocaleString()}
                              </p>
                            );
                          }
                          
                          return <p className="text-lg font-bold text-blue-600">Special Price</p>;
                        })()}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link href={`/products/${offer.code}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full">
                          View details
                        </Button>
                      </Link>
                      {(() => {
                        // Check actual availability from calendar data
                        const hasCalendarAvailability = productAvailability[offer.code];
                        
                        // Show Get Quote if:
                        // 1. No calendar availability (checked dynamically)
                        // 2. No rates or zero rates
                        // 3. Still checking availability (undefined)
                        if (hasCalendarAvailability === false || 
                            hasCalendarAvailability === undefined ||
                            (!offer.rates || offer.rates.length === 0 || 
                             (!offer.rates[0]?.twinRate && !offer.rates[0]?.doubleRate && !offer.rates[0]?.singleRate))) {
                          return (
                            <Link href={`/contact?tour=${offer.code}&name=${encodeURIComponent(offer.name)}&type=special-offer`} className="flex-1">
                              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                {hasCalendarAvailability === undefined ? (
                                  <>⏳ Checking...</>
                                ) : (
                                  <>
                                    <Gift className="mr-2 h-4 w-4" />
                                    Get offer
                                  </>
                                )}
                              </Button>
                            </Link>
                          );
                        } else {
                          // Has calendar availability - show Book Now
                          return (
                            <Link href={`/booking/create?tourId=${offer.code}`} className="flex-1">
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
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-4">No special offers available at the moment.</p>
              <p className="text-gray-500 mb-6">Check back soon for new deals and exclusive offers!</p>
              <Link href="/">
                <Button>Browse all tours</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Special Offers */}
      {offers.length > 0 && (
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Why our special offers?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Exclusive Deals</h3>
                  <p className="text-gray-600">
                    Limited-time offers and exclusive discounts you won't find anywhere else
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Premium Value</h3>
                  <p className="text-gray-600">
                    Exceptional savings on luxury experiences and premium accommodations
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Limited Time</h3>
                  <p className="text-gray-600">Don't miss out - these special offers are available for a limited time only</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
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
            Questions about our special offers?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Our travel experts are here to help you find the perfect deal and answer any questions about our special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/contact?subject=special-offers-inquiry"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
            >
              <span className="mr-2">📧</span>
              Contact Us
            </Link>
            <a
              href="/pdfs/products/Brochure-2025-Web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors"
            >
              <span className="mr-2">📥</span>
              Download Brochure
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}