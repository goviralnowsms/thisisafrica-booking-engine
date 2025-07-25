import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Train } from "lucide-react"

export function RailJourneys() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Luxury Rail Journeys</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Experience Africa's breathtaking landscapes from the comfort of a luxury train
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/rail-journey.png"
                alt="Luxury train journey through African landscape"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">Signature Journey</Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Rovos Rail - Pride of Africa</h3>
              <p className="text-gray-600 mb-4">
                Step aboard the most luxurious train in the world and journey through the heart of Africa. Experience
                the golden age of rail travel with elegant accommodations, fine dining, and breathtaking scenery.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Cape Town to Pretoria</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  <span>3 Days / 2 Nights</span>
                </div>
                <div className="flex items-center">
                  <Train className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Luxury Suites</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Year-round departures</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-2xl font-bold">$2,150</p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600">View Journey</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Blue Train" fill className="object-cover" />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">The Blue Train</h3>
                  <p className="text-gray-600 mb-4">
                    A window to the soul of Africa, combining magnificent scenery with the luxury of a five-star hotel.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$1,850</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Journey
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
                    alt="Shongololo Express"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">Shongololo Express</h3>
                  <p className="text-gray-600 mb-4">
                    Explore Southern Africa's most spectacular landscapes and destinations by rail.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$5,350</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Journey
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
                    alt="Desert Express"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">Desert Express</h3>
                  <p className="text-gray-600 mb-4">
                    Journey through Namibia's stunning desert landscapes in comfort and style.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$1,950</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Journey
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
            View All Rail Journeys
          </Button>
        </div>
      </div>
    </section>
  )
}
