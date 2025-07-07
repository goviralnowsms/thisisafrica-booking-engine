"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock } from "lucide-react"
import type { Tour } from "@/app/page"

interface FeaturedToursProps {
  onTourSelect: (tour: Tour) => void
}

// Sample featured tours data
const featuredTours: Tour[] = [
  {
    id: "featured-1",
    name: "Kruger Safari Adventure",
    description:
      "Experience the Big Five in South Africa's premier game reserve with expert guides and luxury accommodation.",
    duration: 5,
    price: 1299,
    level: "standard",
    availability: "OK",
    supplier: "African Safari Co",
    location: "Kruger National Park, South Africa",
    extras: [
      { id: "1", name: "Game Drive", description: "Morning game drive", price: 0, isCompulsory: true },
      { id: "2", name: "Bush Walk", description: "Guided bush walk", price: 150, isCompulsory: false },
    ],
  },
  {
    id: "featured-2",
    name: "Serengeti Migration",
    description:
      "Witness the Great Migration in Tanzania's Serengeti with comfortable tented camps and daily game drives.",
    duration: 7,
    price: 2199,
    level: "luxury",
    availability: "OK",
    supplier: "Tanzania Expeditions",
    location: "Serengeti, Tanzania",
    extras: [
      {
        id: "3",
        name: "Hot Air Balloon",
        description: "Balloon safari over Serengeti",
        price: 450,
        isCompulsory: false,
      },
    ],
  },
  {
    id: "featured-3",
    name: "Victoria Falls Explorer",
    description: "Discover the majesty of Victoria Falls with adventure activities and cultural experiences.",
    duration: 4,
    price: 899,
    level: "standard",
    availability: "OK",
    supplier: "Falls Adventures",
    location: "Victoria Falls, Zimbabwe",
    extras: [
      { id: "4", name: "Helicopter Flight", description: "Helicopter over the falls", price: 200, isCompulsory: false },
    ],
  },
  {
    id: "featured-4",
    name: "Cape Town & Wine Route",
    description: "Explore Cape Town's highlights and the famous wine regions with tastings and scenic drives.",
    duration: 6,
    price: 1599,
    level: "luxury",
    availability: "OK",
    supplier: "Cape Tours",
    location: "Cape Town, South Africa",
    extras: [
      { id: "5", name: "Wine Tasting", description: "Premium wine tasting tour", price: 120, isCompulsory: false },
    ],
  },
  {
    id: "featured-5",
    name: "Masai Mara Safari",
    description: "Classic Kenya safari experience in the world-famous Masai Mara with traditional camps.",
    duration: 5,
    price: 1799,
    level: "standard",
    availability: "OK",
    supplier: "Kenya Safaris",
    location: "Masai Mara, Kenya",
    extras: [{ id: "6", name: "Cultural Visit", description: "Visit Masai village", price: 80, isCompulsory: false }],
  },
  {
    id: "featured-6",
    name: "Okavango Delta",
    description: "Explore Botswana's pristine wilderness by mokoro and on foot with expert local guides.",
    duration: 4,
    price: 2299,
    level: "luxury",
    availability: "OK",
    supplier: "Botswana Wilderness",
    location: "Okavango Delta, Botswana",
    extras: [
      { id: "7", name: "Mokoro Trip", description: "Traditional canoe excursion", price: 0, isCompulsory: true },
    ],
  },
]

export function FeaturedTours({ onTourSelect }: FeaturedToursProps) {
  const getLevelBadge = (level: string) => {
    const levelConfig = {
      basic: { label: "Basic", className: "bg-blue-100 text-blue-800" },
      standard: { label: "Standard", className: "bg-green-100 text-green-800" },
      luxury: { label: "Luxury", className: "bg-purple-100 text-purple-800" },
    }

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.standard
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="max-w-6xl mx-auto mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured African Tours</h2>
        <p className="text-lg text-gray-600">Handpicked experiences showcasing the best of Africa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredTours.map((tour) => (
          <Card key={tour.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(tour.name)}`}
                  alt={tour.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 right-3">{getLevelBadge(tour.level)}</div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {tour.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {tour.duration} days
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {tour.location.split(",")[0]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="text-2xl font-bold text-gray-900">${tour.price}</p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>

                  <Button onClick={() => onTourSelect(tour)} className="bg-orange-500 hover:bg-orange-600">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
