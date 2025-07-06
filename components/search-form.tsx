"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, Search } from "lucide-react"

export function SearchForm() {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  })

  const handleInputChange = (field: string, value: string) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    // This will connect to Tourplan XML API
    console.log("Searching with:", searchData)

    try {
      // Future: Call Tourplan XML API endpoint
      const response = await fetch("/api/tours/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })

      if (response.ok) {
        const results = await response.json()
        console.log("Search results:", results)
        // Handle search results here
      }
    } catch (error) {
      console.error("Search error:", error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                Destination
              </Label>
              <Input
                id="destination"
                type="text"
                placeholder="Where to?"
                value={searchData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Check-in Date */}
            <div className="space-y-2">
              <Label htmlFor="checkin" className="text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-in
              </Label>
              <Input
                id="checkin"
                type="date"
                value={searchData.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label htmlFor="checkout" className="text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Check-out
              </Label>
              <Input
                id="checkout"
                type="date"
                value={searchData.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 inline mr-1" />
                Guests
              </Label>
              <select
                id="guests"
                value={searchData.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search African Tours</span>
            </Button>
          </div>
        </form>

        {/* Optional Search Note */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">All fields are optional. Leave blank to browse all available tours.</p>
        </div>
      </CardContent>
    </Card>
  )
}
