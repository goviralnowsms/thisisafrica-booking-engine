import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar, Users } from "lucide-react"

export function RiverCruises() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Luxury River Cruises</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Explore Africa's majestic waterways aboard our selection of premium river cruise vessels
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/zambezi-queen.png"
                alt="Zambezi Queen luxury river cruise boat"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">Premium Cruise</Badge>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">Zambezi Queen</h3>
              <p className="text-gray-600 mb-4">
                Experience the ultimate in river safari luxury aboard the Zambezi Queen. This floating boutique hotel
                offers unparalleled wildlife viewing along the Chobe River, with elegant suites, gourmet dining, and
                expert-guided excursions.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Chobe River, Botswana</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  <span>2-3 Night Cruises</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Max 28 guests</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Year-round departures</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-2xl font-bold">
                    $1,250<span className="text-sm font-normal text-gray-500">/night</span>
                  </p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600">View Cruise</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Chobe Princess"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">Chobe Princess</h3>
                  <p className="text-gray-600 mb-4">
                    Intimate houseboats offering a personalized safari experience on the Chobe River.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">
                        $950<span className="text-sm font-normal text-gray-500">/night</span>
                      </p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Cruise
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
                    alt="Nile River Cruise"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">MS Mayfair Nile Cruise</h3>
                  <p className="text-gray-600 mb-4">
                    Explore ancient Egyptian wonders on this elegant Nile River cruise vessel.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$1,450</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Cruise
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
                    alt="Lake Victoria Cruise"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h3 className="text-xl font-bold mb-2">Lake Victoria Explorer</h3>
                  <p className="text-gray-600 mb-4">
                    Discover the beauty of Africa's largest lake with stops at remote islands and villages.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-xl font-bold">$1,850</p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Cruise
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
            View All River Cruises
          </Button>
        </div>
      </div>
    </section>
  )
}
