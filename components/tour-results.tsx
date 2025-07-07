"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, MapPin, Users, Clock } from "lucide-react"
import type { SearchCriteria, Tour } from "@/app/page"

interface TourResultsProps {
  searchCriteria: SearchCriteria
  onTourSelect: (tour: Tour) => void
  onBackToSearch: () => void
  onError?: (errorMessage: string) => void
}

export function TourResults({ searchCriteria, onTourSelect, onBackToSearch }: TourResultsProps) {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true)

      try {
        const response = await fetch("/api/tours/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchCriteria),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch tours")
        }

        const data = await response.json()
        setTours(data.tours || [])
      } catch (error) {
        console.error("Failed to fetch tours:", error)
        setTours([])
        // You could show an error message to the user here
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [searchCriteria])

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "OK":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "RQ":
        return <Badge className="bg-yellow-100 text-yellow-800">On Request</Badge>
      case "NO":
        return <Badge className="bg-red-100 text-red-800">Not Available</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      basic: { label: "Basic", className: "bg-blue-100 text-blue-800" },
      standard: { label: "Standard", className: "bg-purple-100 text-purple-800" },
      luxury: { label: "Luxury", className: "bg-gold-100 text-gold-800" },
    }

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.standard

    return <Badge className={config.className}>{config.label}</Badge>
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
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Skeleton className="w-48 h-32" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={onBackToSearch}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Tours</h2>
        <p className="text-gray-600">
          {tours.length} tours found for {searchCriteria.destination}, {searchCriteria.country}
        </p>
      </div>

      {tours.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">No tours found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any tours matching your criteria. Try adjusting your search parameters.
            </p>
            <Button onClick={onBackToSearch}>Modify Search</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tours.map((tour) => (
            <Card key={tour.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img
                      src={`/placeholder.svg?height=128&width=192&text=${encodeURIComponent(tour.name)}`}
                      alt={tour.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{tour.name}</h3>
                      <div className="flex space-x-2">
                        {getAvailabilityBadge(tour.availability)}
                        {getLevelBadge(tour.level)}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{tour.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tour.duration} days
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tour.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {tour.supplier}
                      </div>
                    </div>

                    {tour.extras.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Available Extras:</p>
                        <div className="flex flex-wrap gap-1">
                          {tour.extras.slice(0, 3).map((extra) => (
                            <Badge key={extra.id} variant="outline" className="text-xs">
                              {extra.name}
                            </Badge>
                          ))}
                          {tour.extras.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tour.extras.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-2xl font-bold text-gray-900">${tour.price}</p>
                      <p className="text-sm text-gray-500">per person</p>
                    </div>

                    <Button onClick={() => onTourSelect(tour)} disabled={tour.availability === "NO"} className="w-full">
                      {tour.availability === "NO" ? "Not Available" : "Select Tour"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
