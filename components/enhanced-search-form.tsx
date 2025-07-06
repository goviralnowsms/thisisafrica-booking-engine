"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Calendar, Users, Search } from "lucide-react"

export function EnhancedSearchForm() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("2")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search:", { destination, checkIn, checkOut, guests })
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-orange-200">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                Destination
              </Label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select destination</option>
                <option value="kenya">Kenya Safari</option>
                <option value="tanzania">Tanzania Adventure</option>
                <option value="south-africa">South Africa Explorer</option>
                <option value="botswana">Botswana Wildlife</option>
                <option value="namibia">Namibia Desert</option>
                <option value="zambia">Zambia Falls</option>
              </select>
            </div>

            {/* Check-in Date */}
            <div className="space-y-2">
              <Label htmlFor="checkin" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Check-in
              </Label>
              <input
                type="date"
                id="checkin"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label htmlFor="checkout" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Check-out
              </Label>
              <input
                type="date"
                id="checkout"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-500" />
                Guests
              </Label>
              <select
                id="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5+ Guests</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Search className="h-5 w-5" />
              Search African Adventures
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
