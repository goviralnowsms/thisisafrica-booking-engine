"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Calendar, 
  Users, 
  Bed, 
  ArrowLeft, 
  Filter,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Loader2,
  Eye,
  ArrowRight
} from "lucide-react"
import { getLocalProductImageSync } from "@/lib/product-images"

interface RoomType {
  productCode: string
  roomType: string
  hotelName: string
  description: string
  locality: string
  supplier: string
  pricePerNight?: number
  totalPrice?: number
  currency?: string
  availability?: string
}

export default function HotelRoomsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const hotelName = decodeURIComponent(params.hotelName as string)
  
  // Search parameters
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const adults = searchParams.get('adults') || '2'
  const children = searchParams.get('children') || '0'
  const rooms = searchParams.get('rooms') || '1'
  const isFlexible = searchParams.get('flexible') === 'true'
  
  // State
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [selectedRoomType, setSelectedRoomType] = useState<string>('')
  const [priceRange, setPriceRange] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('price-low')
  
  // Calculate nights
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 1

  // Helper function to extract room type from product name
  const extractRoomType = (room: any): string => {
    // Try to extract from product name patterns
    const name = room.name || ''
    const description = room.description || ''
    const productCode = room.productCode || room.code || ''
    
    // Common patterns in names like "The Portswood Hotel - Standard Room"
    if (name.includes(' - ')) {
      const parts = name.split(' - ')
      if (parts.length > 1) {
        const potentialRoomType = parts[parts.length - 1]
        // Check if it's actually a room type (contains keywords)
        if (potentialRoomType.toLowerCase().includes('room') || 
            potentialRoomType.toLowerCase().includes('suite') ||
            potentialRoomType.toLowerCase().includes('villa') ||
            potentialRoomType.toLowerCase().includes('tent') ||
            potentialRoomType.toLowerCase().includes('cabin') ||
            potentialRoomType.toLowerCase().includes('apartment')) {
          return potentialRoomType
        }
      }
    }
    
    // Extract from product code patterns
    const codeUpper = productCode.toUpperCase()
    if (codeUpper.includes('STD')) return 'Standard Room'
    if (codeUpper.includes('DLX') || codeUpper.includes('DEL')) return 'Deluxe Room'
    if (codeUpper.includes('SUI')) return 'Suite'
    if (codeUpper.includes('FAM')) return 'Family Room'
    if (codeUpper.includes('VIL')) return 'Villa'
    if (codeUpper.includes('LUX')) return 'Luxury Room'
    if (codeUpper.includes('TEN')) return 'Tented Suite'
    if (codeUpper.includes('EXE')) return 'Executive Room'
    if (codeUpper.includes('SUP')) return 'Superior Room'
    
    // Check description for room types
    const descLower = description.toLowerCase()
    if (descLower.includes('standard')) return 'Standard Room'
    if (descLower.includes('deluxe')) return 'Deluxe Room'
    if (descLower.includes('luxury') && !descLower.includes('tent')) return 'Luxury Room'
    if (descLower.includes('luxury tent')) return 'Luxury Tent'
    if (descLower.includes('suite')) return 'Suite'
    if (descLower.includes('family')) return 'Family Room'
    if (descLower.includes('villa')) return 'Villa'
    if (descLower.includes('executive')) return 'Executive Room'
    if (descLower.includes('superior')) return 'Superior Room'
    
    // Fallback to the original roomType field if it's not the generic message
    if (room.roomType && room.roomType !== 'Various room types available') {
      return room.roomType
    }
    
    // Final fallback
    return 'Standard Room'
  }

  // Fetch room types for the hotel
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log('🏨 Fetching room types for hotel:', hotelName)
        
        // Use the accommodation search API to get all rooms for this hotel
        // We need to NOT group by hotel to get individual room products
        const params = new URLSearchParams({
          destination: 'South Africa', // Could make this dynamic based on hotel
          useButtonDestinations: 'true',
          dateFrom: checkIn || '2026-07-15',
          dateTo: checkOut || '2026-07-18',
          adults: adults,
          children: children,
          // Add a flag to indicate we want individual rooms, not grouped
          groupByHotel: 'false'
        })
        
        const response = await fetch(`/api/accommodation/search?${params}`)
        const result = await response.json()
        
        if (result.success && result.accommodations) {
          // Filter accommodations that match this hotel name
          const hotelRooms = result.accommodations.filter((acc: any) => {
            const accHotelName = acc.hotelName || acc.supplier || acc.name.split(' - ')[0]
            return accHotelName.toLowerCase().includes(hotelName.toLowerCase()) ||
                   hotelName.toLowerCase().includes(accHotelName.toLowerCase())
          })
          
          // Process each room to extract proper room type
          const processedRooms = hotelRooms.map((room: any) => ({
            ...room,
            roomType: extractRoomType(room)
          }))
          
          console.log(`🏨 Found ${processedRooms.length} room types for ${hotelName}`)
          console.log('🏨 Room data:', processedRooms.map(room => ({
            name: room.name,
            productCode: room.productCode,
            code: room.code,
            id: room.id,
            roomType: room.roomType
          })))
          setRoomTypes(processedRooms)
          setFilteredRooms(processedRooms)
        } else {
          setError('No rooms found for this hotel')
        }
      } catch (err) {
        console.error('Error fetching room types:', err)
        setError('Failed to load room information')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRoomTypes()
  }, [hotelName, checkIn, checkOut, adults, children])
  
  // Apply filters
  useEffect(() => {
    let filtered = [...roomTypes]
    
    // Filter by room type
    if (selectedRoomType && selectedRoomType !== 'all') {
      filtered = filtered.filter(room => 
        room.roomType.toLowerCase().includes(selectedRoomType.toLowerCase())
      )
    }
    
    // Filter by price range
    if (priceRange && priceRange !== 'all') {
      filtered = filtered.filter(room => {
        const price = room.pricePerNight || 0
        switch (priceRange) {
          case 'budget': return price <= 200
          case 'mid': return price > 200 && price <= 500
          case 'luxury': return price > 500
          default: return true
        }
      })
    }
    
    // Sort rooms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.pricePerNight || 0) - (b.pricePerNight || 0)
        case 'price-high':
          return (b.pricePerNight || 0) - (a.pricePerNight || 0)
        case 'name':
          return a.roomType.localeCompare(b.roomType)
        default:
          return 0
      }
    })
    
    setFilteredRooms(filtered)
  }, [roomTypes, selectedRoomType, priceRange, sortBy])
  
  // Get unique room types for filter
  const uniqueRoomTypes = Array.from(new Set(roomTypes.map(room => room.roomType)))
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b mt-16 md:mt-20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/accommodation" className="text-gray-500 hover:text-gray-700">Accommodation</Link>
            <span className="text-gray-400">/</span>
            <Link 
              href={`/accommodation/${encodeURIComponent(hotelName)}/select-dates`}
              className="text-gray-500 hover:text-gray-700"
            >
              {hotelName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Available Rooms</span>
          </nav>
          
          {/* Search Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{hotelName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {isFlexible ? 'Flexible dates' : `${formatDate(checkIn)} - ${formatDate(checkOut)} (${nights} night${nights !== 1 ? 's' : ''})`}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {adults} adult{adults !== '1' ? 's' : ''}{children !== '0' ? `, ${children} child${children !== '1' ? 'ren' : ''}` : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {rooms} room{rooms !== '1' ? 's' : ''}
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Change Dates
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Room Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Room Type</label>
                  <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All room types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All room types</SelectItem>
                      {uniqueRoomTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range (per night)</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All prices</SelectItem>
                      <SelectItem value="budget">Under $200</SelectItem>
                      <SelectItem value="mid">$200 - $500</SelectItem>
                      <SelectItem value="luxury">Over $500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Room Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Results Count */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    {loading ? 'Loading...' : `${filteredRooms.length} room${filteredRooms.length !== 1 ? 's' : ''} available`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-600">Loading available rooms...</p>
              </div>
            ) : error ? (
              <Card className="p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Search
                </Button>
              </Card>
            ) : filteredRooms.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">No rooms match your selected filters.</p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedRoomType('all')
                    setPriceRange('all')
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredRooms.map((room, index) => (
                  <Card key={room.productCode || room.code || room.id || `room-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      {/* Room Image */}
                      <div className="relative h-48 md:h-full rounded-lg overflow-hidden bg-gray-200">
                        <Image
                          src={getLocalProductImageSync(room.productCode || room.code || undefined)}
                          alt={room.roomType}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      
                      {/* Room Details */}
                      <div className="md:col-span-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{room.roomType}</h3>
                              <p className="text-gray-600 mt-1">{room.description}</p>
                            </div>
                            {room.pricePerNight && (
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                  ${room.pricePerNight}
                                </div>
                                <div className="text-sm text-gray-500">per night</div>
                                {nights > 1 && (
                                  <div className="text-sm text-gray-500">
                                    ${room.pricePerNight * nights} total
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Room Amenities (placeholder) */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Wifi className="h-3 w-3" />
                              Free WiFi
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Coffee className="h-3 w-3" />
                              Coffee/Tea
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              Parking
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Book Button */}
                        <div className="flex justify-end">
                          {room.productCode ? (
                            <Link href={`/products/${room.productCode}`}>
                              <Button className="bg-amber-500 hover:bg-amber-600">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details & Book
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </Link>
                          ) : (
                            <Button disabled className="bg-gray-400">
                              Contact for Availability
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}