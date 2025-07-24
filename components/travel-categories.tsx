import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function TravelCategories() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Africa Your Way</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Discover our range of travel experiences tailored to your preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80">
              <Image
                src="/images/safari-lion.png"
                alt="Safari experience with lion and vehicle"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Safaris</h3>
              <p className="text-white/90 mb-4 max-w-xs">
                Experience Africa's incredible wildlife up close in their natural habitats.
              </p>
              <Link href="/safaris">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Explore Safaris
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80">
              <Image
                src="/images/luxury-accommodation.png"
                alt="Luxury safari tent with bathtub"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Luxury Stays</h3>
              <p className="text-white/90 mb-4 max-w-xs">
                Indulge in Africa's finest accommodations, from tented camps to 5-star resorts.
              </p>
              <Link href="/luxury-stays">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Explore Luxury Stays
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80">
              <Image
                src="/images/victoria-falls.png"
                alt="Victoria Falls aerial view with rainbow"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Natural Wonders</h3>
              <p className="text-white/90 mb-4 max-w-xs">
                Witness Africa's breathtaking landscapes and natural phenomena.
              </p>
              <Link href="/natural-wonders">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Explore Wonders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80">
              <Image
                src="/images/rail-journey.png"
                alt="Luxury train journey through African landscape"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Rail Journeys</h3>
              <p className="text-white/90 mb-4 max-w-xs">
                Travel in style aboard luxury trains through Africa's diverse landscapes.
              </p>
              <Link href="/rail-journeys">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Explore Rail Journeys
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80">
              <Image
                src="/images/zambezi-queen.png"
                alt="Zambezi Queen luxury river cruise boat"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">River Cruises</h3>
              <p className="text-white/90 mb-4 max-w-xs">
                Explore Africa's majestic waterways aboard luxury cruise vessels.
              </p>
              <Link href="/river-cruises">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Explore River Cruises
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-80">
              <Image
                src="/images/luxury-resort-pool.png"
                alt="Luxury resort with infinity pool overlooking the ocean"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Beach Retreats</h3>
              <p className="text-white/90 mb-4 max-w-xs">
                Relax on Africa's pristine beaches and enjoy world-class resorts.
              </p>
              <Link href="/beach-retreats">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Explore Beach Retreats
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
