import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, MapPin, Users } from "lucide-react"

export function GroupTours() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Group Tours</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Join like-minded travelers on our expertly guided group safaris and tours
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/safari-lion.png"
                alt="Safari experience with lion and vehicle"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">Most Popular</Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Classic Kenya & Tanzania Safari</h3>
              <p className="text-gray-600 mb-4">
                Experience the best of East Africa's wildlife on this comprehensive group safari through Kenya's Masai
                Mara and Tanzania's Serengeti.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Kenya & Tanzania</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  <span>12 Days / 11 Nights</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Max 8 travelers</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Year-round departures</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-2xl font-bold">$4,299</p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600">View Tour</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="South Africa Explorer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">South Africa Explorer</h3>
                  <p className="text-gray-600 mb-4">
                    From Cape Town to Kruger National Park, experience South Africa's diverse attractions.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$3,199</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Tour
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Botswana & Victoria Falls"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">Botswana & Victoria Falls</h3>
                  <p className="text-gray-600 mb-4">
                    Explore the Okavango Delta and witness the majesty of Victoria Falls.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$3,899</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Tour
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Namibia Desert Adventure"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">Namibia Desert Adventure</h3>
                  <p className="text-gray-600 mb-4">
                    Discover the stunning landscapes of Namibia's deserts and coastline.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$2,999</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Tour
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
          >
            View All Group Tours
          </Button>
        </div>
      </div>
    </section>
  )
}
