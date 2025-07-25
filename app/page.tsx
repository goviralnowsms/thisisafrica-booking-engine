import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Lion Image - Made Taller */}
      <section className="relative h-[80vh] md:h-screen">
        <Image src="/images/lion.png" alt="Majestic African lion" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container mx-auto px-4 py-20 md:py-48 flex flex-col items-center justify-center text-center h-full">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4">
              TRAVEL WITH <span className="text-amber-500">EXPERIENCE</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8">
              This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling
              tailor-made and package tours to Africa.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white px-8">
                Explore Tours
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 bg-transparent"
              >
                Watch Video
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Search Form */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                  <SelectValue placeholder="Starting country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="botswana">Botswana</SelectItem>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="south-africa">South Africa</SelectItem>
                  <SelectItem value="tanzania">Tanzania</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                  <SelectValue placeholder="Starting destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cape-town">Cape Town</SelectItem>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="victoria-falls">Victoria Falls</SelectItem>
                  <SelectItem value="serengeti">Serengeti</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="bg-amber-500 text-white border-amber-500">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Categories Cards - 2x3 Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Group Tours */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/safari-lion.png"
                  alt="Group Tours - Safari vehicle with lions"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">GROUP TOURS</h3>
                <p className="text-gray-600 mb-4">
                  Specially selected tours. Great group accommodation and transport. Ideal for solo travellers.
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
              </div>
            </div>

            {/* Accommodation */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/luxury-accommodation.png"
                  alt="Accommodation - Luxury safari tent"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">ACCOMMODATION</h3>
                <p className="text-gray-600 mb-4">
                  Great group tours. Choose from a variety of hotels. Ideal for solo travellers.
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
              </div>
            </div>

            {/* Rail Tours */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/rail-journey.png"
                  alt="Rail Tours - Luxury train journey"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">RAIL TOURS</h3>
                <p className="text-gray-600 mb-4">
                  Discover our rail tours. The Blue Train, Shongololo Express and more.
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
              </div>
            </div>

            {/* Packages */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/luxury-resort-pool.png"
                  alt="Packages - Beach resort with pool"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">PACKAGES</h3>
                <p className="text-gray-600 mb-4">
                  Specially selected tours. Great group accommodation and transport. Ideal for solo travellers.
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
              </div>
            </div>

            {/* Cruises */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/zambezi-queen.png"
                  alt="Cruises - River cruise boat"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">CRUISES</h3>
                <p className="text-gray-600 mb-4">Discover our cruise options. Zambezi River cruises and more.</p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
              </div>
            </div>

            {/* Tailor Made */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src="/images/tailor-made-safari.png"
                  alt="Tailor Made - Custom safari group"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2">
                  <Search className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">TAILOR MADE</h3>
                <p className="text-gray-600 mb-4">
                  Custom-designed adventures. Personalised itineraries for your perfect African journey.
                </p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Specials Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Specials</h2>
            <p className="text-lg text-gray-600">
              Limited-time offers on our most popular destinations and experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Victoria Falls Explorer */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image src="/images/victoria-falls.png" alt="Victoria Falls Explorer" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded text-sm font-medium">
                  20% Off
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Victoria Falls Explorer</h3>
                <p className="text-gray-600 mb-4">
                  Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-gray-500 line-through">$3,599</span>
                    <span className="text-2xl font-bold ml-2">$2,879</span>
                  </div>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600">View Deal</Button>
              </div>
            </div>

            {/* Zanzibar Beach Escape */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image src="/images/luxury-resort-pool.png" alt="Zanzibar Beach Escape" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded text-sm font-medium">
                  Free Nights
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Zanzibar Beach Escape</h3>
                <p className="text-gray-600 mb-4">
                  Stay 7 nights, pay for only 5 at this stunning beachfront resort in Zanzibar.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-gray-500 line-through">$2,450</span>
                    <span className="text-2xl font-bold ml-2">$1,750</span>
                  </div>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600">View Deal</Button>
              </div>
            </div>

            {/* Kenya Family Safari */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image src="/images/safari-lion.png" alt="Kenya Family Safari" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded text-sm font-medium">
                  Family Offer
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Kenya Family Safari</h3>
                <p className="text-gray-600 mb-4">
                  Kids under 12 stay and travel free on this incredible family safari adventure.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold">From $2,999</span>
                  </div>
                </div>
                <Button className="w-full bg-amber-500 hover:bg-amber-600">View Deal</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">RESPONSIBLE PRICING</h3>
              <p className="text-gray-300">
                Our product team strives to deliver the best available prices from trusted and responsible local
                operators. We consider current exchange rates and the season of your travel to provide competitive
                pricing.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">PERSONALISED SERVICE</h3>
              <p className="text-gray-300">
                Our expert consultants are travel professionals. They will use their extensive knowledge of Africa,
                travel industry experience and passion for travelling to create your dream African holiday.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">CUSTOMISED ITINERARIES</h3>
              <p className="text-gray-300">
                Whether you choose a popular pre-prepared itinerary, or prefer a tailor-made itinerary which suits your
                interests, dates, timeframe and budget, our consultants will personalise every aspect of your journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
