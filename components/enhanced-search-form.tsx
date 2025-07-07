"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star } from "lucide-react"
import type { SearchCriteria } from "@/app/page"

interface EnhancedSearchFormProps {
  onSearch: (criteria: SearchCriteria) => void
}

const countries = [
  "South Africa",
  "Kenya",
  "Tanzania",
  "Uganda",
  "Rwanda",
  "Botswana",
  "Namibia",
  "Zimbabwe",
  "Zambia",
  "Ethiopia",
  "Madagascar",
  "Mozambique",
  "Ghana",
  "Morocco",
]

const destinations = {
  "South Africa": ["Cape Town", "Johannesburg", "Kruger National Park", "Garden Route", "Drakensberg", "Hermanus"],
  Kenya: ["Nairobi", "Masai Mara", "Amboseli", "Tsavo", "Lake Nakuru", "Samburu"],
  Tanzania: ["Arusha", "Serengeti", "Ngorongoro", "Zanzibar", "Kilimanjaro", "Tarangire"],
  Uganda: ["Kampala", "Bwindi", "Queen Elizabeth NP", "Murchison Falls", "Lake Bunyonyi"],
  Rwanda: ["Kigali", "Volcanoes National Park", "Nyungwe Forest", "Lake Kivu"],
  Botswana: ["Gaborone", "Okavango Delta", "Chobe", "Kalahari", "Moremi"],
  Namibia: ["Windhoek", "Sossusvlei", "Etosha", "Swakopmund", "Damaraland"],
  Zimbabwe: ["Harare", "Victoria Falls", "Hwange", "Mana Pools", "Great Zimbabwe"],
  Zambia: ["Lusaka", "South Luangwa", "Lower Zambezi", "Victoria Falls", "Kafue"],
}

const tourLevels = [
  { value: "basic", label: "Basic", description: "Budget-friendly options", color: "bg-blue-100 text-blue-800" },
  {
    value: "standard",
    label: "Standard",
    description: "Comfortable experiences",
    color: "bg-green-100 text-green-800",
  },
  { value: "luxury", label: "Luxury", description: "Premium experiences", color: "bg-purple-100 text-purple-800" },
]

export function EnhancedSearchForm({ onSearch }: EnhancedSearchFormProps) {
  const [country, setCountry] = useState("")
  const [destination, setDestination] = useState("")
  const [tourLevel, setTourLevel] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const criteria: SearchCriteria = {
      country: country || undefined,
      destination: destination || undefined,
      tourLevel: tourLevel || undefined,
    }

    onSearch(criteria)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Discover Your <span className="text-orange-500">African Adventure</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          From thrilling safaris to cultural immersions, find the perfect African experience tailored to your dreams.
        </p>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Search className="w-6 h-6 text-orange-500" />
            Find Your Perfect Tour
          </CardTitle>
          <CardDescription className="text-base">
            Search our collection of authentic African experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Simple Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2 text-base font-medium">
                  <MapPin className="w-4 h-4" />
                  Country
                </Label>
                <Select
                  value={country}
                  onValueChange={(value) => {
                    setCountry(value)
                    setDestination("")
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-base font-medium">
                  Destination
                </Label>
                <Select value={destination} onValueChange={setDestination} disabled={!country}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={country ? "Select destination" : "Select country first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {country &&
                      destinations[country as keyof typeof destinations]?.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tourLevel" className="flex items-center gap-2 text-base font-medium">
                  <Star className="w-4 h-4" />
                  Tour Level
                </Label>
                <Select value={tourLevel} onValueChange={setTourLevel}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    {tourLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={level.color} variant="secondary">
                            {level.label}
                          </Badge>
                          <span className="text-sm text-gray-600">{level.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center pt-4">
              <Button type="submit" size="lg" className="px-12 py-3 text-lg bg-orange-500 hover:bg-orange-600">
                <Search className="w-5 h-5 mr-2" />
                Search African Tours
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
