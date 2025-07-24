import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Calendar } from "lucide-react"

export function FeaturedSpecials() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Specials</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Limited-time offers on our most popular destinations and experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-48">
              <Image
                src="/images/victoria-falls.png"
                alt="Victoria Falls aerial view with rainbow"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">20% Off</Badge>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Victoria Falls Explorer</h3>
              <p className="text-gray-600 mb-4">
                Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Zimbabwe & Zambia</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  <span>7 Days / 6 Nights</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Valid until June 30, 2025</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-gray-500 line-through">$3,599</span>
                  <span className="text-xl font-bold ml-2">$2,879</span>
                </div>
                <Badge className="bg-green-600">Save $720</Badge>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600">View Special</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-48">
              <Image
                src="/images/luxury-resort-pool.png"
                alt="Luxury resort with infinity pool overlooking the ocean"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">Free Nights</Badge>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Zanzibar Beach Escape</h3>
              <p className="text-gray-600 mb-4">
                Stay 7 nights, pay for only 5 at this stunning beachfront resort in Zanzibar.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Zanzibar, Tanzania</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  <span>7 Days / 7 Nights</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Valid until September 30, 2025</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-gray-500 line-through">$2,450</span>
                  <span className="text-xl font-bold ml-2">$1,750</span>
                </div>
                <Badge className="bg-green-600">2 Nights Free</Badge>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600">View Special</Button>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-48">
              <Image
                src="/images/safari-lion.png"
                alt="Safari experience with lion and vehicle"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-500 hover:bg-amber-600">Family Offer</Badge>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold mb-2">Kenya Family Safari</h3>
              <p className="text-gray-600 mb-4">
                Kids under 12 stay and travel free on this incredible family safari adventure.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Kenya</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  <span>8 Days / 7 Nights</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Valid for travel in 2025</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xl font-bold">From $2,999</span>
                  <span className="text-sm ml-1">per adult</span>
                </div>
                <Badge className="bg-green-600">Kids Free</Badge>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600">View Special</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
