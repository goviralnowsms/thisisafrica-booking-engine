"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Bed, ArrowLeft, Search, Loader2, Home } from "lucide-react"

interface RoomOption {
  productCode: string
  roomType: string
  name: string
  description?: string
}

export default function SelectDatesPage() {
  const params = useParams()
  const router = useRouter()
  const hotelName = decodeURIComponent(params.hotelName as string)
  
  // Form state
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState("2")
  const [children, setChildren] = useState("0")
  const [rooms, setRooms] = useState("1")
  const [flexibleDates, setFlexibleDates] = useState(false)
  const [selectedRoomCode, setSelectedRoomCode] = useState("")
  
  // Room types state
  const [roomOptions, setRoomOptions] = useState<RoomOption[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [roomsError, setRoomsError] = useState<string | null>(null)
  
  // Helper function to extract room type from product data
  const extractRoomType = (room: any): string => {
    const name = room.name || ''
    const description = room.description || ''
    const productCode = room.productCode || room.code || ''
    
    // Common patterns in names like "The Portswood Hotel - Standard Room"
    if (name.includes(' - ')) {
      const parts = name.split(' - ')
      if (parts.length > 1) {
        const potentialRoomType = parts[parts.length - 1]
        if (potentialRoomType.toLowerCase().includes('room') || 
            potentialRoomType.toLowerCase().includes('suite') ||
            potentialRoomType.toLowerCase().includes('villa') ||
            potentialRoomType.toLowerCase().includes('tent')) {
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
    
    // Check description
    const descLower = description.toLowerCase()
    if (descLower.includes('standard')) return 'Standard Room'
    if (descLower.includes('deluxe')) return 'Deluxe Room'
    if (descLower.includes('luxury') && !descLower.includes('tent')) return 'Luxury Room'
    if (descLower.includes('suite')) return 'Suite'
    if (descLower.includes('villa')) return 'Villa'
    
    return room.roomType || 'Standard Room'
  }

  // Set default dates (tomorrow for check-in, day after for check-out)
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)
    
    setCheckIn(tomorrow.toISOString().split('T')[0])
    setCheckOut(dayAfter.toISOString().split('T')[0])
  }, [])
  
  // Fetch available room types for this hotel
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRooms(true)
      setRoomsError(null)
      
      try {
        // Use the simpler room-types endpoint
        const params = new URLSearchParams({
          hotelName: hotelName,
          dateFrom: checkIn || '2026-07-15',
          dateTo: checkOut || '2026-07-18'
        })
        
        const response = await fetch(`/api/accommodation/room-types?${params}`)
        const result = await response.json()
        
        console.log('Room types API response:', result)
        
        if (result.success && result.rooms && result.rooms.length > 0) {
          // Transform rooms to RoomOption format
          const roomOptions = result.rooms.map((room: any) => ({
            productCode: room.productCode,
            roomType: room.roomType,
            name: room.name || room.roomType,
            description: room.description
          }))
          
          console.log(`Found ${roomOptions.length} room types for ${hotelName}:`, roomOptions)
          setRoomOptions(roomOptions)
          
          // Auto-select first room if only one option
          if (roomOptions.length === 1) {
            setSelectedRoomCode(roomOptions[0].productCode)
          }
        } else {
          console.log('No rooms found or API failed:', result)
          // Set default room option if API fails
          setRoomOptions([{
            productCode: '',
            roomType: 'Standard Room',
            name: `${hotelName} - Standard Room`,
            description: 'Please contact us for room availability'
          }])
          setRoomsError('Unable to load specific room types. Please contact us for availability.')
        }
      } catch (err) {
        console.error('Error fetching room types:', err)
        // Set default room option on error
        setRoomOptions([{
          productCode: '',
          roomType: 'Standard Room',
          name: `${hotelName} - Standard Room`,
          description: 'Please contact us for room availability'
        }])
        setRoomsError('Failed to load room types. Please contact us for assistance.')
      } finally {
        setLoadingRooms(false)
      }
    }
    
    fetchRoomTypes()
  }, [hotelName, checkIn, checkOut])
  
  const handleSearch = () => {
    // Validate required fields
    if (!selectedRoomCode) {
      alert('Please select a room type')
      return
    }
    
    if (!flexibleDates && (!checkIn || !checkOut)) {
      alert('Please select check-in and check-out dates or choose flexible dates')
      return
    }
    
    if (!flexibleDates && new Date(checkIn) >= new Date(checkOut)) {
      alert('Check-out date must be after check-in date')
      return
    }
    
    // Navigate directly to the product details page with search parameters
    const searchParams = new URLSearchParams({
      checkIn: flexibleDates ? '2026-07-15' : checkIn,
      checkOut: flexibleDates ? '2026-07-18' : checkOut,
      adults,
      children,
      rooms,
      flexible: flexibleDates ? 'true' : 'false',
      hotelName: hotelName
    })
    
    // Go directly to the product page for the selected room
    router.push(`/products/${selectedRoomCode}?${searchParams}`)
  }
  
  // Calculate number of nights
  const nights = checkIn && checkOut ? 
    Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b mt-16 md:mt-20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/accommodation" className="text-gray-500 hover:text-gray-700">Accommodation</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{hotelName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm opacity-90">Back to search results</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotelName}</h1>
            <p className="text-xl opacity-90">Select your dates and guests to see available rooms</p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">
                Check Availability & Rates
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Choose your travel dates and number of guests to see room options and pricing
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Flexible Dates Option */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="flexible-dates"
                    checked={flexibleDates}
                    onChange={(e) => setFlexibleDates(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="flexible-dates" className="text-sm font-medium text-blue-800">
                    I'm flexible with my dates
                  </label>
                </div>
                <p className="text-xs text-blue-600 mt-1 ml-6">
                  Get the best deals by being flexible with your travel dates
                </p>
              </div>

              {/* Dates Section */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${flexibleDates ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Check-in Date
                  </label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                    disabled={flexibleDates}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Check-out Date
                  </label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full"
                    disabled={flexibleDates}
                  />
                </div>
              </div>
              
              {flexibleDates ? (
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-800 font-medium">
                    🗓️ Flexible dates selected - we'll show you the best available rates
                  </span>
                </div>
              ) : nights > 0 && (
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <span className="text-amber-800 font-medium">
                    {nights} night{nights !== 1 ? 's' : ''} stay
                  </span>
                </div>
              )}

              {/* Guests Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Adults
                  </label>
                  <Select value={adults} onValueChange={setAdults}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Adult{num !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <Select value={children} onValueChange={setChildren}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0,1,2,3,4].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num !== 1 ? 'Children' : 'Child'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bed className="inline h-4 w-4 mr-1" />
                    Rooms
                  </label>
                  <Select value={rooms} onValueChange={setRooms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Room{num !== 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Room Type Selection */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="inline h-4 w-4 mr-1" />
                  Room Type
                </label>
                {loadingRooms ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-500 mr-2" />
                    <span className="text-gray-600">Loading room types...</span>
                  </div>
                ) : roomsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{roomsError}</p>
                  </div>
                ) : roomOptions.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">No room types found for this hotel.</p>
                  </div>
                ) : (
                  <Select value={selectedRoomCode} onValueChange={setSelectedRoomCode}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a room type" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomOptions.map((room) => (
                        <SelectItem key={room.productCode} value={room.productCode}>
                          <div className="flex flex-col">
                            <span className="font-medium">{room.roomType}</span>
                            {room.description && room.description !== room.roomType && (
                              <span className="text-xs text-gray-500 truncate max-w-[300px]">
                                {room.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Search Button */}
              <div className="pt-6">
                <Button 
                  onClick={handleSearch}
                  disabled={!selectedRoomCode || (!flexibleDates && (!checkIn || !checkOut))}
                  size="lg"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 text-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  View Room Details & Book
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>✓ Free cancellation on most bookings</p>
                <p>✓ No booking fees</p>
                <p>✓ Secure payment processing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}