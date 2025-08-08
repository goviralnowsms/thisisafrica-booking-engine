"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface SpecialOffer {
  id: string
  code: string
  name: string
  description: string
  supplier: string
  duration: string
  image?: string | null
  rates: Array<{
    currency: string
    singleRate?: number
    doubleRate?: number
    twinRate?: number
    rateName?: string
  }>
}

export default function FeaturedSpecials() {
  const router = useRouter()
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSpecialOffers() {
      try {
        console.log('🎁 Fetching special offers for homepage...')
        const response = await fetch('/api/tourplan/special-offers')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch special offers')
        }
        
        console.log('🎁 Special offers fetched:', data)
        setOffers(data.offers || [])
        setError(null)
      } catch (err) {
        console.error('❌ Error fetching special offers:', err)
        setError(err instanceof Error ? err.message : 'Failed to load special offers')
      } finally {
        setLoading(false)
      }
    }

    fetchSpecialOffers()
  }, [])

  // Static fallback data when API fails or returns no results
  const staticOffers = [
    {
      id: 'classic-kruger-package',
      code: 'HDSSPMAKUTSMSSCLS',
      name: 'Classic Kruger Package',
      description: 'Experience the best of Kruger National Park with expert guides, luxury accommodation, and incredible wildlife viewing opportunities.',
      supplier: 'This is Africa',
      duration: '6 days',
      image: '/images/products/kruger-package.jpeg',
      carouselImages: ['/images/products/kruger-package.jpeg', '/images/products/kruger-zebra.jpeg'],
      mapImage: '/images/products/cheetah.jpeg',
      rates: [{ currency: 'AUD', twinRate: 4540, rateName: 'Special Package' }], // $2,270 per person twin share (2270 * 2 = 4540)
      originalPrice: 5000, // Regular price for comparison
      discount: '25% Off'
    },
    {
      id: 'victoria-falls-explorer',
      code: 'VFE001',
      name: 'Victoria Falls Explorer',
      description: 'Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.',
      supplier: 'This is Africa',
      duration: '5 days',
      image: '/images/victoria-falls.png',
      rates: [{ currency: 'AUD', twinRate: 575800, rateName: 'Special Offer' }], // $2,879 per person
      originalPrice: 719800, // $3,599 per person
      discount: '20% Off'
    },
    {
      id: 'zanzibar-beach-escape',
      code: 'ZBE001', 
      name: 'Zanzibar Beach Escape',
      description: 'Stay 7 nights, pay for only 5 at this stunning beachfront resort in Zanzibar.',
      supplier: 'This is Africa',
      duration: '7 days',
      image: '/images/luxury-resort-pool.png',
      rates: [{ currency: 'AUD', twinRate: 350000, rateName: 'Free Nights' }], // $1,750 per person
      originalPrice: 490000, // $2,450 per person
      discount: 'Free Nights'
    },
    {
      id: 'kenya-family-safari',
      code: 'KFS001',
      name: 'Kenya Family Safari', 
      description: 'Kids under 12 stay and travel free on this incredible family safari adventure.',
      supplier: 'This is Africa',
      duration: '8 days',
      image: '/images/safari-lion.png',
      rates: [{ currency: 'AUD', twinRate: 599800, rateName: 'Family Offer' }], // From $2,999 per person
      discount: 'Family Offer'
    }
  ]

  // Use static fallback if loading failed or no offers returned
  const displayOffers = (!loading && offers.length === 0) ? staticOffers : offers

  const formatPrice = (rate: any) => {
    if (!rate) return 'POA'
    
    const price = rate.twinRate || rate.doubleRate || rate.singleRate
    if (!price || price === 0) return 'POA'
    
    // TourPlan prices are already in dollars for special deals, not cents
    const dollars = Math.round(price)
    return `$${dollars.toLocaleString()}`
  }

  const getProductImage = (offer: any) => {
    // Map specific product codes to appropriate images
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
    
    // Default fallback
    return offer.image || '/images/safari-lion.png'
  }

  const getDiscountBadge = (offer: any, index: number) => {
    if (offer.discount) return offer.discount
    
    // Use product-specific badges based on names
    const name = offer.name?.toLowerCase() || ''
    if (name.includes('honeymoon')) return 'Honeymoon Special'
    if (name.includes('stay 4 pay 3') || name.includes('4 pay 3')) return 'Stay 4 Pay 3'
    if (name.includes('classic')) return 'Classic Package'
    
    // Default badges for variety
    const badges = ['Special Deal', 'Limited Time', 'Great Value']
    return badges[index % badges.length]
  }
  
  const getPriceDisplay = (offer: any) => {
    if (!offer.rates || offer.rates.length === 0) return 'From $2,999'
    
    const rate = offer.rates[0]
    if (!rate || (!rate.twinRate && !rate.doubleRate && !rate.singleRate)) return 'POA'
    
    // Check if this is static data vs API data
    const isStaticData = staticOffers.some(staticOffer => staticOffer.id === offer.id)
    
    // Show per person twin share pricing if available
    if (rate.twinRate && rate.twinRate > 0) {
      if (isStaticData) {
        // Static data: prices are already in cents, convert to dollars and show per person
        const perPerson = Math.round(rate.twinRate / 200) // Divide by 200 (100 for cents + 2 for twin share)
        return `From $${perPerson.toLocaleString()}`
      } else {
        // API data: assume rate is per person
        const perPerson = Math.round(rate.twinRate / 100) // Just convert cents to dollars
        return `From $${perPerson.toLocaleString()}`
      }
    }
    
    if (rate.doubleRate && rate.doubleRate > 0) {
      if (isStaticData) {
        const perPerson = Math.round(rate.doubleRate / 200)
        return `From $${perPerson.toLocaleString()}`
      } else {
        const perPerson = Math.round(rate.doubleRate / 100)
        return `From $${perPerson.toLocaleString()}`
      }
    }
    
    if (rate.singleRate && rate.singleRate > 0) {
      const price = isStaticData ? Math.round(rate.singleRate / 100) : rate.singleRate
      return `From $${price.toLocaleString()}`
    }
    
    return 'POA'
  }

  const getBadgeColor = (index: number) => {
    const colors = ['bg-amber-500', 'bg-green-500', 'bg-blue-500']
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured specials</h2>
            <p className="text-lg text-gray-600">Loading our latest special offers...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured specials</h2>
          <p className="text-lg text-gray-600">
            {error 
              ? "Our handpicked special offers and experiences" 
              : "Limited-time offers on our most popular destinations and experiences"
            }
          </p>
          {error && (
            <p className="text-sm text-gray-500 mt-2">
              Showing curated offers (Live offers temporarily unavailable)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayOffers.slice(0, 3).map((offer, index) => (
            <div key={offer.id || offer.code} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image 
                  src={getProductImage(offer)} 
                  alt={offer.name} 
                  fill 
                  className="object-cover" 
                />
                <div className={`absolute top-4 left-4 ${getBadgeColor(index)} text-white px-3 py-1 rounded text-sm font-medium`}>
                  {getDiscountBadge(offer, index)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{offer.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {offer.description 
                    ? offer.description.substring(0, 150) + (offer.description.length > 150 ? '...' : '')
                    : `Experience ${offer.name} with ${offer.supplier}`
                  }
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">
                      {getPriceDisplay(offer)}
                    </span>
                    <p className="text-sm text-gray-500">per person twin share</p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    // Navigate to product page if we have a real product code
                    if (offer.code && offer.code.length > 6) {
                      router.push(`/products/${offer.code}`)
                    } else {
                      // Navigate to special offers search page
                      router.push('/booking?productType=Special Offers')
                    }
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  View deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}