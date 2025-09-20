"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import GoogleMap from "@/components/GoogleMap"
import { 
  Bed, 
  Users, 
  Wifi,
  Coffee,
  Bath,
  Tv,
  Wind,
  MapPin,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react"

interface RoomType {
  code: string
  name: string
  description: string
  type: string
  capacity: number
  price?: number
  currency?: string
  amenities?: string[]
  image?: string
  imageAlt?: string
}

interface HotelDetails {
  name: string
  location: string
  description: string
  roomTypes: RoomType[]
  supplierCode?: string
}

// Placeholder room images using existing project images
const roomImages = {
  standard: "/images/products/portswood-captains-suite.jpg",
  deluxe: "/images/products/portswood-captains-suite.jpg",
  luxury: "/images/products/sabi-sabi1.png",
  suite: "/images/products/portswood-captains-suite.jpg",
  villa: "/images/products/savannah-lodge-honeymoon.png",
  family: "/images/products/savannah-suite.jpg",
  default: "/images/products/portswood-captains-suite.jpg"
}

// Get appropriate placeholder image based on room type
const getRoomImage = (roomType: string): string => {
  const type = roomType.toLowerCase()
  
  // More specific matching order (most specific first)
  if (type.includes('luxury') && !type.includes('suite')) return roomImages.luxury
  if (type.includes('deluxe')) return roomImages.deluxe
  if (type.includes('villa')) return roomImages.villa
  if (type.includes('family')) return roomImages.family
  if (type.includes('suite')) return roomImages.suite
  if (type.includes('standard')) return roomImages.standard
  
  // Fallback to default room image
  return roomImages.default
}

// Mock inclusions based on room type
const getRoomInclusions = (roomType: string): string[] => {
  const baseInclusions = ["Free WiFi", "Air Conditioning", "En-suite Bathroom", "Daily Housekeeping"]
  const type = roomType.toLowerCase()
  
  if (type.includes('deluxe') || type.includes('luxury')) {
    return [...baseInclusions, "Mini Bar", "Bathtub", "Living Area", "Balcony/Terrace"]
  }
  if (type.includes('suite')) {
    return [...baseInclusions, "Separate Living Room", "Mini Bar", "Bathtub", "Work Desk", "Ocean/Garden View"]
  }
  if (type.includes('family')) {
    return [...baseInclusions, "Extra Beds", "Kitchenette", "Dining Area", "Multiple Bathrooms"]
  }
  return baseInclusions
}

export default function HotelDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const hotelCode = params.hotelCode as string
  
  const [hotel, setHotel] = useState<HotelDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelCode) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Get the product code from URL params
        const urlParams = new URLSearchParams(window.location.search)
        const productCode = urlParams.get('productCode') || ''
        
        // Extract supplier code from product code if available
        let supplierCode = ''
        if (productCode) {
          // Extract supplier code (e.g., MPTSACSAB003SABST -> SAB003)
          const match = productCode.match(/([A-Z]{3}\d{3})/)
          if (match) {
            supplierCode = match[1]
            console.log('🏨 Extracted supplier code:', supplierCode, 'from product:', productCode)
          }
        }
        
        // Fetch room types for this hotel
        const hotelName = decodeURIComponent(hotelCode)
        const apiUrl = productCode 
          ? `/api/accommodation/hotel-rooms?hotelName=${encodeURIComponent(hotelName)}&productCode=${productCode}`
          : supplierCode 
            ? `/api/accommodation/hotel-rooms?hotelName=${encodeURIComponent(hotelName)}&supplierCode=${supplierCode}`
            : `/api/accommodation/hotel-rooms?hotelName=${encodeURIComponent(hotelName)}`
        
        const response = await fetch(apiUrl)
        const data = await response.json()
        
        if (data.success && data.rooms) {
          // Transform API response to hotel format
          // Extract supplier code from first room's product code
          const firstRoom = data.rooms[0]
          let supplierCode = ''
          if (firstRoom?.productCode) {
            // Extract supplier code from product code (e.g., CPTACPOR002PORTST -> POR002)
            const match = firstRoom.productCode.match(/([A-Z]{3}\d{3})/)
            if (match) {
              supplierCode = match[1]
            }
          }
          
          const hotelData: HotelDetails = {
            name: hotelName,
            location: data.rooms[0]?.locality || "Africa",
            description: `Experience luxury and comfort at ${hotelName}. Contact us for the best rates and availability.`,
            supplierCode,
            roomTypes: data.rooms.map((room: any) => ({
              code: room.productCode,
              name: room.roomType || room.name,
              description: room.description || `Comfortable ${room.roomType} with modern amenities.`,
              type: room.roomType?.includes('Suite') ? 'Suite' : 'Double',
              capacity: room.roomType?.includes('Family') ? 4 : 2,
              image: room.image,
              imageAlt: room.imageAlt
            }))
          }
          setHotel(hotelData)
        } else {
          setError(data.error || "Hotel not found")
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error)
        setError("Failed to load hotel details")
      } finally {
        setLoading(false)
      }
    }
    
    fetchHotelDetails()
  }, [hotelCode])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    )
  }
  
  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Hotel not found"}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {hotel.location}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 mb-2">Need assistance?</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Us
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
          
          {hotel.description && (
            <p className="mt-4 text-gray-700 max-w-4xl">{hotel.description}</p>
          )}
        </div>
      </section>
      
      {/* Room Types Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Room Type</h2>
            <p className="text-gray-600">Choose from our available room options below</p>
          </div>
          
          {/* Room Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.roomTypes.map((room, index) => (
              <Card key={room.code || index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Room Image */}
                <div className="relative h-48">
                  <Image
                    src={room.image || getRoomImage(room.name)}
                    alt={room.imageAlt || room.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/images/products/portswood-captains-suite.jpg"
                    }}
                  />
                  {room.price && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      {room.currency || 'AUD'} ${room.price}
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  {/* Room Name & Type */}
                  <h3 className="text-xl font-bold mb-2">{room.name}</h3>
                  
                  {/* Room Info */}
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <span className="flex items-center gap-1 text-sm">
                      <Bed className="h-4 w-4" />
                      {room.type || "Double"}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4" />
                      {room.capacity || 2} Guests
                    </span>
                  </div>
                  
                  {/* Room Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {room.description || "Comfortable room with modern amenities and excellent service."}
                  </p>
                  
                  {/* Inclusions */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Room Inclusions:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {getRoomInclusions(room.name).slice(0, 4).map((inclusion, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link 
                      href={`/contact?hotel=${hotelCode}&room=${room.code}&hotelName=${encodeURIComponent(hotel.name)}&roomType=${encodeURIComponent(room.name)}&inquiry=best-rates`}
                      className="block"
                    >
                      <Button className="w-full bg-amber-500 hover:bg-amber-600">
                        Contact for Best Rates
                      </Button>
                    </Link>
                    
                    <Link 
                      href={`/products/${room.code}`}
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* No rooms fallback */}
          {hotel.roomTypes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No room types available for display.</p>
              <Link href={`/contact?hotel=${hotelCode}&hotelName=${encodeURIComponent(hotel.name)}`}>
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Contact Us for Room Options
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Location Map Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
            <p className="text-gray-600">View {hotel.name} on the map</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <GoogleMap 
              supplierCode={hotel.supplierCode}
              hotelName={hotel.name}
              height="400px"
              className="shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help Choosing?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our travel experts can help you select the perfect room for your stay and provide 
            exclusive rates not available online.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600">
                <Phone className="h-4 w-4 mr-2" />
                Talk to an Expert
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Request Callback
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}