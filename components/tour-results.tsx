"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, Users, ArrowLeft } from "lucide-react"
import type { SearchCriteria, Tour } from "@/app/page"

interface TourResultsProps {
  searchCriteria: SearchCriteria
  onTourSelect: (tour: Tour) => void
  onBackToSearch: () => void
}

export function TourResults({ searchCriteria, onTourSelect, onBackToSearch }: TourResultsProps) {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchTours = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/tours/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchCriteria),
        })

        if (!response.ok) {
          throw new Error("Failed to search tours")
        }

        const data = await response.json()
        setTours(data.tours || [])
      } catch (err) {
        setError("Failed to load tours. Please try again.")
        console.error("Tour search error:", err)
      } finally {
        setLoading(false)
      }
    }

    searchTours()
  }, [searchCriteria])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "luxury":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "OK":
        return "bg-green-100 text-green-800"
      case "RQ":
        return "bg-yellow-100 text-yellow-800"
      case "NO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "OK":
        return "Available"
      case "RQ":
        return "On Request"
      case "NO":
        return "Not Available"
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onBackToSearch}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={onBackToSearch}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={onBackToSearch}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>

        <div className="text-sm text-gray-600">
          Found {tours.length} tour{tours.length !== 1 ? "s" : ""}
        </div>
      </div>

      {tours.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">No tours found matching your criteria.</p>
            <Button onClick={onBackToSearch}>Try Different Search</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {tours.map((tour) => (
            <Card key={tour.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{tour.name}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tour.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tour.duration} days
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {tour.supplier}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getLevelColor(tour.level)} variant="secondary">
                      {tour.level}
                    </Badge>
                    <Badge className={getAvailabilityColor(tour.availability)} variant="secondary">
                      {getAvailabilityText(tour.availability)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-4">{tour.description}</CardDescription>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${tour.price}
                    <span className="text-sm font-normal text-gray-500"> per person</span>
                  </div>
                  <Button
                    onClick={() => onTourSelect(tour)}
                    disabled={tour.availability === "NO"}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400"
                  >
                    {tour.availability === "NO" ? "Not Available" : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
