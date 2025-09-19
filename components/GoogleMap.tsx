"use client"

import { useEffect, useState } from 'react'
import { Loader2, MapPin } from 'lucide-react'

interface GoogleMapProps {
  supplierCode?: string
  hotelName?: string
  fallbackCoordinates?: { lat: number; lng: number }
  height?: string
  className?: string
}

export default function GoogleMap({ 
  supplierCode, 
  hotelName = "Hotel",
  fallbackCoordinates,
  height = "400px",
  className = "" 
}: GoogleMapProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGPS = async () => {
      if (!supplierCode) {
        if (fallbackCoordinates) {
          setCoordinates(fallbackCoordinates)
        } else {
          setError('No supplier code or coordinates provided')
        }
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/accommodation/supplier-gps?supplierCode=${supplierCode}`)
        const data = await response.json()
        
        if (data.success && data.coordinates) {
          setCoordinates(data.coordinates)
        } else if (fallbackCoordinates) {
          // Use fallback if API doesn't return coordinates
          setCoordinates(fallbackCoordinates)
        } else {
          setError('GPS coordinates not available for this location')
        }
      } catch (err) {
        console.error('Error fetching GPS:', err)
        if (fallbackCoordinates) {
          setCoordinates(fallbackCoordinates)
        } else {
          setError('Failed to load map')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchGPS()
  }, [supplierCode, fallbackCoordinates])

  if (loading) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  if (error || !coordinates) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{error || 'Map not available'}</p>
        </div>
      </div>
    )
  }

  // Generate Google Maps Embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${coordinates.lat},${coordinates.lng}&zoom=15`
  
  // Alternative: Static map image (doesn't require API key for basic usage)
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=800x400&markers=color:red%7C${coordinates.lat},${coordinates.lng}&scale=2`

  // If no Google Maps API key, show a link to Google Maps
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`} style={{ height }}>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative h-full group"
        >
          {/* Show static map as background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${staticMapUrl}')`,
            }}
          />
          
          {/* Overlay with hotel info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold text-lg">{hotelName}</h3>
            </div>
            <p className="text-sm opacity-90">
              GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
            </p>
            <p className="text-sm mt-2 opacity-75 group-hover:opacity-100 transition-opacity">
              Click to view on Google Maps →
            </p>
          </div>
        </a>
      </div>
    )
  }

  // With API key, show embedded map
  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title={`Map of ${hotelName}`}
      />
    </div>
  )
}