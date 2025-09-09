"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Bed, 
  Star, 
  MapPin, 
  Users, 
  Wifi, 
  Car,
  Coffee,
  Waves,
  Mountain,
  TreePine,
  Home,
  Tent,
  Hotel,
  Mail,
  Phone,
  Filter,
  Loader2,
  Eye,
  ArrowRight
} from "lucide-react"

// Generic accommodation images for different types
const genericImages = {
  lodge: [
    "/images/products/safari-jeep.jpg",
    "/images/products/lion-pride.jpg",
    "/images/products/elephants.jpg"
  ],
  hotel: [
    "/images/products/cape-town.jpg",
    "/images/products/victoria-falls.jpg"
  ],
  camp: [
    "/images/products/sunrise-tour.jpg",
    "/images/products/leopard.jpg"
  ],
  resort: [
    "/images/products/chobe-river.jpg",
    "/images/products/namibia-desert.jpg"
  ]
}

// Get a random generic image for accommodation type
const getGenericImage = (type: string): string => {
  const typeImages = genericImages[type as keyof typeof genericImages] || genericImages.lodge
  return typeImages[Math.floor(Math.random() * typeImages.length)]
}

// Sample static data for initial display (will be replaced by API data)
const fallbackAccommodations = [
  // Kenya Accommodations
  {
    id: "NBOHTL001",
    name: "Serena Safari Lodge",
    location: "Masai Mara, Kenya",
    country: "kenya",
    type: "lodge",
    category: "luxury",
    image: "/images/products/lion-pride.jpg",
    description: "Experience luxury in the heart of Masai Mara with panoramic views of the savanna. This award-winning lodge offers world-class safari experiences.",
    features: ["Pool", "Spa", "Wi-Fi", "Restaurant", "Bar", "Game Drives"],
    capacity: "48 rooms",
    highlights: ["Overlooks the Mara River", "Daily game drives included", "Cultural visits to Maasai villages"]
  },
  {
    id: "NBOHTL002", 
    name: "Governors' Camp",
    location: "Masai Mara, Kenya",
    country: "kenya",
    type: "camp",
    category: "luxury",
    image: "/images/products/elephants.jpg",
    description: "Classic safari camp on the banks of the Mara River, offering an authentic African experience with modern comforts.",
    features: ["River Views", "Bush Breakfast", "Sundowners", "Night Drives"],
    capacity: "37 tents",
    highlights: ["Prime wildlife location", "Unfenced camp", "Hippo viewing from bar"]
  },
  {
    id: "NBOHTL003",
    name: "Keekorok Lodge",
    location: "Masai Mara, Kenya", 
    country: "kenya",
    type: "lodge",
    category: "standard",
    image: "/images/products/leopard.jpg",
    description: "Historic lodge in the Masai Mara, perfectly positioned for the Great Migration viewing.",
    features: ["Pool", "Restaurant", "Bar", "Gift Shop"],
    capacity: "101 rooms",
    highlights: ["300-degree game viewing", "Hippo pool bar", "Traditional architecture"]
  },
  
  // Tanzania Accommodations
  {
    id: "JROHTL001",
    name: "Serengeti Serena Safari Lodge",
    location: "Serengeti, Tanzania",
    country: "tanzania",
    type: "lodge",
    category: "luxury",
    image: "/images/products/sunrise-tour.jpg",
    description: "Architecturally unique lodge designed to blend with the landscape, offering stunning views of the Serengeti plains.",
    features: ["Infinity Pool", "Spa", "Observatory", "Cultural Center"],
    capacity: "66 rooms",
    highlights: ["Migration viewing point", "Maasai-inspired architecture", "Star gazing deck"]
  },
  {
    id: "JROHTL002",
    name: "Ngorongoro Crater Lodge",
    location: "Ngorongoro, Tanzania",
    country: "tanzania",
    type: "lodge",
    category: "ultra-luxury",
    image: "/images/products/safari-jeep.jpg",
    description: "Perched on the edge of the world-famous Ngorongoro Crater, offering unparalleled luxury and views.",
    features: ["Butler Service", "Rose Petal Baths", "Champagne Dinners", "Private Decks"],
    capacity: "30 suites",
    highlights: ["Crater rim location", "Victorian furnishings", "Personal butler service"]
  },
  
  // South Africa Accommodations
  {
    id: "CPTHTL001",
    name: "Cape Grace Hotel",
    location: "V&A Waterfront, Cape Town",
    country: "south-africa",
    type: "hotel",
    category: "luxury",
    image: "/images/products/cape-town.jpg",
    description: "Elegant waterfront hotel with yacht marina views and Table Mountain backdrop, epitomizing Cape Town luxury.",
    features: ["Spa", "Fine Dining", "Yacht Access", "Wine Collection"],
    capacity: "120 rooms",
    highlights: ["Waterfront location", "Private art collection", "Signal Restaurant"]
  },
  {
    id: "JNBHTL001",
    name: "Sabi Sabi Bush Lodge",
    location: "Sabi Sands, Kruger",
    country: "south-africa",
    type: "lodge",
    category: "luxury",
    image: "/images/products/rhino.jpg",
    description: "Award-winning lodge in private game reserve adjacent to Kruger National Park, known for leopard sightings.",
    features: ["Pool", "Spa", "Boma Dinners", "Bush Walks", "Night Drives"],
    capacity: "25 suites",
    highlights: ["Big 5 game viewing", "No fences with Kruger", "Award-winning wine cellar"]
  },
  
  // Botswana Accommodations
  {
    id: "MUBHTL001",
    name: "Chobe Game Lodge",
    location: "Chobe National Park, Botswana",
    country: "botswana",
    type: "lodge",
    category: "luxury",
    image: "/images/products/chobe-river.jpg",
    description: "The only permanent lodge within Chobe National Park, famous for its large elephant herds.",
    features: ["River Views", "Pool", "Spa", "Boat Cruises", "Game Drives"],
    capacity: "44 rooms",
    highlights: ["Inside national park", "Elephant corridors", "River safaris"]
  },
  
  // Zimbabwe Accommodations
  {
    id: "VFAHTL001",
    name: "Victoria Falls Hotel",
    location: "Victoria Falls, Zimbabwe",
    country: "zimbabwe",
    type: "hotel",
    category: "luxury",
    image: "/images/products/victoria-falls.jpg",
    description: "Grand colonial hotel with manicured gardens and views of Victoria Falls Bridge and spray.",
    features: ["Heritage Site", "High Tea", "Pool", "Stanley's Terrace"],
    capacity: "161 rooms",
    highlights: ["Walking distance to falls", "Historic property", "Royal connections"]
  },
  
  // Namibia Accommodations
  {
    id: "WDHHTL001",
    name: "Sossusvlei Desert Lodge",
    location: "Namib Desert, Namibia",
    country: "namibia",
    type: "lodge",
    category: "luxury",
    image: "/images/products/namibia-desert.jpg",
    description: "Situated deep in the Namib Desert, offering stargazing observatory and desert adventures.",
    features: ["Observatory", "Pool", "Spa", "Quad Biking", "Hot Air Balloons"],
    capacity: "10 suites",
    highlights: ["Private reserve", "Desert adapted wildlife", "Star gazing"]
  }
]

interface Accommodation {
  id: string
  code: string
  name: string
  supplier?: string
  description?: string
  destination?: string
  location?: string
  country: string
  type: string
  category: string
  image: string
  roomType?: string
  rates?: any[]
  hasAvailability?: boolean
  features?: string[]
  capacity?: string
  highlights?: string[]
  displayName?: string
}

const countries = [
  { value: "all", label: "All Destinations" },
  { value: "kenya", label: "Kenya" },
  { value: "tanzania", label: "Tanzania" },
  { value: "south-africa", label: "South Africa" },
  { value: "botswana", label: "Botswana" },
  { value: "zimbabwe", label: "Zimbabwe" },
  { value: "namibia", label: "Namibia" }
]

const types = [
  { value: "all", label: "All Types", icon: Home },
  { value: "lodge", label: "Safari Lodges", icon: Home },
  { value: "camp", label: "Tented Camps", icon: Tent },
  { value: "hotel", label: "Hotels", icon: Hotel }
]

export default function AccommodationPage() {
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [accommodations, setAccommodations] = useState<Accommodation[]>(fallbackAccommodations)
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch accommodations from TourPlan API
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams()
        if (selectedCountry !== "all") {
          params.append("destination", selectedCountry)
        }
        
        const response = await fetch(`/api/accommodation/search?${params}`)
        const data = await response.json()
        
        if (data.success && data.accommodations) {
          // Merge API data with fallback data features
          const enrichedAccommodations = data.accommodations.map((acc: any) => {
            // Find matching fallback data for additional features
            const fallback = fallbackAccommodations.find(
              fb => fb.location?.toLowerCase().includes(acc.destination?.toLowerCase() || '')
            )
            
            return {
              ...acc,
              // Ensure we have an image
              image: acc.image || getGenericImage(acc.type),
              // Add features from fallback if not present
              features: acc.features || fallback?.features || [
                'Wi-Fi', 'Restaurant', 'Bar', 'Pool'
              ],
              capacity: acc.capacity || `${acc.roomType || 'Room'}`,
              highlights: acc.highlights || [
                acc.supplier ? `Operated by ${acc.supplier}` : 'Premium accommodation',
                acc.hasAvailability ? 'Available for booking' : 'On request'
              ],
              // Properly format the name to show room type
              displayName: acc.roomType && acc.name ? 
                `${acc.name} - ${acc.roomType}` : 
                acc.name
            }
          })
          
          setAccommodations(enrichedAccommodations)
        } else {
          // If API fails, use fallback data
          console.log('Using fallback accommodation data')
          setAccommodations(fallbackAccommodations)
        }
      } catch (err) {
        console.error('Failed to fetch accommodations:', err)
        setError('Failed to load accommodations. Showing sample data.')
        // Use fallback data on error
        setAccommodations(fallbackAccommodations)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAccommodations()
  }, []) // Only fetch once on mount
  
  // Filter accommodations based on selected filters
  useEffect(() => {
    let filtered = accommodations

    if (selectedCountry !== "all") {
      filtered = filtered.filter(acc => acc.country === selectedCountry)
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(acc => acc.type === selectedType)
    }

    setFilteredAccommodations(filtered)
  }, [selectedCountry, selectedType, accommodations])

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'lodge': return <Home className="h-4 w-4" />
      case 'camp': return <Tent className="h-4 w-4" />
      case 'hotel': return <Hotel className="h-4 w-4" />
      default: return <Bed className="h-4 w-4" />
    }
  }

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'ultra-luxury': return 'bg-purple-500'
      case 'luxury': return 'bg-amber-500'
      case 'standard': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <Image
          src="/images/products/accomm-hero.jpg"
          alt="African safari lodge at sunset"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">African Accommodations</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              From luxury safari lodges to intimate tented camps
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Browse our handpicked collection of exceptional accommodations across Africa
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-semibold text-gray-700">Filter by:</span>
            </div>
            
            {/* Country Filter */}
            <div className="flex gap-2 flex-wrap">
              {countries.map(country => (
                <Button
                  key={country.value}
                  variant={selectedCountry === country.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCountry(country.value)}
                  className={selectedCountry === country.value ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {country.label}
                </Button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 ml-auto">
              {types.map(type => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                  className={selectedType === type.value ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  <type.icon className="h-4 w-4 mr-1" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="bg-amber-50 py-3">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-700">
            {loading ? (
              <span>Loading accommodations...</span>
            ) : (
              <>
                Showing <span className="font-semibold">{filteredAccommodations.length}</span> accommodations
                {selectedCountry !== "all" && ` in ${countries.find(c => c.value === selectedCountry)?.label}`}
                {selectedType !== "all" && ` - ${types.find(t => t.value === selectedType)?.label}`}
              </>
            )}
          </p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <section className="bg-red-50 py-3">
          <div className="container mx-auto px-4">
            <p className="text-center text-red-700">{error}</p>
          </div>
        </section>
      )}

      {/* Accommodation Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-4" />
              <p className="text-gray-600">Loading accommodations from TourPlan...</p>
            </div>
          ) : filteredAccommodations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAccommodations.map((accommodation) => (
                <Card key={accommodation.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64">
                    <Image
                      src={accommodation.image}
                      alt={accommodation.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className={`${getCategoryBadgeColor(accommodation.category)} text-white`}>
                        {accommodation.category.replace('-', ' ')}
                      </Badge>
                      <Badge className="bg-white/90 text-gray-700">
                        {getTypeIcon(accommodation.type)}
                        <span className="ml-1">{accommodation.type}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1">
                      {accommodation.displayName || accommodation.name}
                    </h3>
                    {accommodation.supplier && (
                      <p className="text-sm text-gray-500 mb-2">{accommodation.supplier}</p>
                    )}
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {accommodation.location || accommodation.destination || 'Africa'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {accommodation.description}
                    </p>

                    <div className="flex items-center text-gray-500 mb-4">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {accommodation.roomType || accommodation.capacity || 'Standard Room'}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {accommodation.features.slice(0, 4).map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {accommodation.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{accommodation.features.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Highlights */}
                    <div className="border-t pt-4 mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Highlights:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {accommodation.highlights.slice(0, 2).map((highlight, idx) => (
                          <li key={idx} className="flex items-start">
                            <Star className="h-3 w-3 mr-1 mt-0.5 text-amber-500" />
                            <span className="line-clamp-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2">
                      {/* View Details Button */}
                      <Link 
                        href={`/products/${accommodation.code}`}
                        className="w-full"
                      >
                        <Button className="w-full bg-amber-500 hover:bg-amber-600">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                      
                      {/* Request Quote Button */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/contact?subject=accommodation-inquiry&property=${encodeURIComponent(
                            accommodation.displayName || accommodation.name
                          )}&code=${accommodation.code}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Request Quote
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => window.location.href = 'tel:+61299571788'}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No accommodations found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSelectedCountry("all")
                  setSelectedType("all")
                }}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Experience African Hospitality</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Scattered throughout Africa's parks and reserves are world-class game lodges and permanent tented safari camps that offer unparalleled wildlife experiences combined with exceptional comfort and service.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Home className="h-5 w-5 mr-2 text-amber-500" />
                    Safari Lodges
                  </h3>
                  <p className="text-gray-700">
                    Game lodges offer accommodation ranging from hotel-like rooms to thatched-roofed chalets with private balconies, en-suite bathrooms, and luxury amenities. Many feature private plunge pools, spa centers, and viewing decks overlooking waterholes.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Tent className="h-5 w-5 mr-2 text-amber-500" />
                    Tented Camps
                  </h3>
                  <p className="text-gray-700">
                    Experience the romance of classic safari in permanent canvas-sided tents with all modern comforts. These camps offer en-suite bathrooms, comfortable beds, and authentic bush experiences with communal dining and evening campfires.
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                All our featured properties include meals and guided activities, ensuring you experience the best of African wildlife and hospitality. Our team will help you select the perfect accommodation to match your travel style and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative py-16 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience Africa?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Let our experts help you choose the perfect accommodation for your African adventure. 
            We'll create a customized itinerary that matches your preferences and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact?subject=accommodation-consultation"
              className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-100 text-amber-600 font-bold rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Get Expert Advice
            </Link>
            <Link
              href="/tailor-made"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors"
            >
              Create Custom Itinerary
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}