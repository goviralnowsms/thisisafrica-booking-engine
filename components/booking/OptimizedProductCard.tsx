"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"
import { hasRailAvailability, getRailAvailability } from "@/lib/rail-availability"
import { hasCruiseAvailability, getCruiseAvailability } from "@/lib/cruise-availability"
import { shouldShowDepartureDay, getDepartureDayMessage } from "@/lib/group-tours-availability"

interface OptimizedProductCardProps {
  tour: any
  productType: string
  priority?: boolean
  sanityImage?: {
    primaryImage?: {
      asset?: {
        url: string
      }
    }
  }
}

// Shared blur data URL for placeholder
const shimmerBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#f0f0f0" offset="20%" />
        <stop stop-color="#e0e0e0" offset="50%" />
        <stop stop-color="#f0f0f0" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="#f0f0f0" />
    <rect id="r" width="400" height="300" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-400" to="400" dur="1s" repeatCount="indefinite" />
  </svg>`
).toString('base64')}`

export default function OptimizedProductCard({ tour, productType, priority = false, sanityImage }: OptimizedProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>('')

  // Get fallback image based on product type
  const getFallbackImage = () => {
    const fallbackImages = {
      'Group Tours': '/images/safari-lion.png',
      'Packages': '/images/safari-lion.png',
      'Rail': '/images/rail-journey.jpg',
      'Cruises': '/images/zambezi-queen.png'
    }
    return fallbackImages[productType as keyof typeof fallbackImages] || '/images/safari-lion.png'
  }

  useEffect(() => {
    // Determine the best image source
    if (sanityImage?.primaryImage?.asset?.url) {
      setImageSrc(sanityImage.primaryImage.asset.url)
    } else {
      // Fall back to default image
      setImageSrc(getFallbackImage())
    }
  }, [sanityImage, tour.code])

  const isRail = productType === 'Rail'
  const isCruise = productType === 'Cruises'
  const hasAvailability = isRail ? hasRailAvailability(tour.code) : 
                          isCruise ? hasCruiseAvailability(tour.code) : true
  const availabilityInfo = isRail ? getRailAvailability(tour.code) : 
                          isCruise ? getCruiseAvailability(tour.code) : null

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative h-48 bg-gray-100">
        <Image 
          src={imageError ? getFallbackImage() : imageSrc}
          alt={tour.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
          placeholder="blur"
          blurDataURL={shimmerBlurDataURL}
          onError={() => {
            setImageError(true)
            setImageSrc(getFallbackImage())
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
                    ${tour.rates?.[0]?.singleRate ? Math.round(tour.rates[0].singleRate / 100).toLocaleString() : 'POA'}
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