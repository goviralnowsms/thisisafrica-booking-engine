import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

export function Accommodations() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Luxury Accommodations</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Experience Africa in comfort and style with our handpicked selection of luxury lodges and camps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="relative h-64 md:h-80">
              <Image
                src="/images/luxury-accommodation.png"
                alt="Luxury safari tent with bathtub"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold">Serengeti Luxury Tented Camp</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
              <div className="flex items-center mb-4">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-gray-500">Serengeti National Park, Tanzania</span>
              </div>
              <p className="text-gray-600 mb-4">
                Experience the ultimate in safari luxury with our tented camp in the heart of the Serengeti. Each
                spacious tent features elegant furnishings, a private deck, and breathtaking views of the savanna.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-gray-100">
                  Private Bathroom
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  Outdoor Shower
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  Full Board
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  Game Drives
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  Spa Services
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-2xl font-bold">
                    $750<span className="text-sm font-normal text-gray-500">/night</span>
                  </p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600">View Property</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-2/5">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt="Victoria Falls River Lodge"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Victoria Falls River Lodge</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-500 text-sm">Zambezi National Park, Zimbabwe</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Luxury lodge on the banks of the Zambezi River, just minutes from Victoria Falls.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-lg font-bold">
                        $595<span className="text-xs font-normal text-gray-500">/night</span>
                      </p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Property
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
                    alt="Cape Town Waterfront Hotel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Cape Grace Hotel</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-500 text-sm">V&A Waterfront, Cape Town</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Elegant waterfront hotel with stunning views of Table Mountain and the marina.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-lg font-bold">
                        $450<span className="text-xs font-normal text-gray-500">/night</span>
                      </p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Property
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
                    alt="Masai Mara Safari Camp"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">Governors' Camp</h3>
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-gray-500 text-sm">Masai Mara, Kenya</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    Classic safari camp in the heart of the Masai Mara, perfect for wildlife viewing.
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-lg font-bold">
                        $380<span className="text-xs font-normal text-gray-500">/night</span>
                      </p>
                    </div>
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                      View Property
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
            View All Accommodations
          </Button>
        </div>
      </div>
    </section>
  )
}
