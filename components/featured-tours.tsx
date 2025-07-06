import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star } from "lucide-react"

const featuredTours = [
  {
    id: 1,
    title: "Serengeti Safari Adventure",
    location: "Tanzania",
    duration: "7 days",
    price: "$2,499",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400&text=Serengeti+Safari",
    description: "Experience the Great Migration and witness millions of wildebeest crossing the plains.",
    highlights: ["Big Five", "Great Migration", "Luxury Camps"],
  },
  {
    id: 2,
    title: "Cape Town & Wine Country",
    location: "South Africa",
    duration: "5 days",
    price: "$1,899",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400&text=Cape+Town",
    description: "Explore the Mother City and taste world-class wines in the beautiful Cape Winelands.",
    highlights: ["Table Mountain", "Wine Tasting", "Penguin Colony"],
  },
  {
    id: 3,
    title: "Maasai Mara Game Drive",
    location: "Kenya",
    duration: "4 days",
    price: "$1,599",
    rating: 4.9,
    image: "/placeholder.svg?height=300&width=400&text=Maasai+Mara",
    description: "Discover the incredible wildlife of Kenya's most famous game reserve.",
    highlights: ["Lions", "Elephants", "Cultural Visit"],
  },
]

export function FeaturedTours() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredTours.map((tour) => (
        <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-100">
          <div className="relative">
            <img src={tour.image || "/placeholder.svg"} alt={tour.title} className="w-full h-48 object-cover" />
            <Badge className="absolute top-4 left-4 bg-orange-500 text-white">Featured</Badge>
          </div>

          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                {tour.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                {tour.rating}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-gray-900">{tour.title}</h3>
            <p className="text-gray-600 mb-4 text-sm">{tour.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tour.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {highlight}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1 text-orange-500" />
                {tour.duration}
              </div>
              <div className="text-2xl font-bold text-orange-500">{tour.price}</div>
            </div>

            <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white">View Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
