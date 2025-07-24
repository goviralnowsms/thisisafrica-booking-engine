import Image from "next/image"
import Link from "next/link"
import { BookingSearch } from "@/components/booking-search"
import { Newsletter } from "@/components/newsletter"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Lion Image */}
      <section className="relative h-[60vh] md:h-[80vh]">
        <Image src="/images/lion.png" alt="Majestic African lion" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent">
          <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Experience the Magic of Africa</h1>
            <p className="text-xl text-white/90 max-w-2xl mb-8">
              Unforgettable journeys through the continent's most breathtaking landscapes, cultures, and wildlife
            </p>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
              Explore Our Tours
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Search Section */}
      <section className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <BookingSearch />
        </div>
      </section>

      {/* Featured Specials Section */}
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
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-2 py-1 rounded text-sm font-medium">
                  20% Off
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">Victoria Falls Explorer</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-500 line-through text-sm">$3,599</span>
                    <span className="text-xl font-bold ml-2">$2,879</span>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    View Deal
                  </Button>
                </div>
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
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Free Nights
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">Zanzibar Beach Escape</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Stay 7 nights, pay for only 5 at this stunning beachfront resort in Zanzibar.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-500 line-through text-sm">$2,450</span>
                    <span className="text-xl font-bold ml-2">$1,750</span>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    View Deal
                  </Button>
                </div>
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
                <div className="absolute top-4 left-4 bg-amber-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Family Offer
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">Kenya Family Safari</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Kids under 12 stay and travel free on this incredible family safari adventure.
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl font-bold">From $2,999</span>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    View Deal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Travel Categories - 3 Column Layout */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Packages */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/luxury-resort-pool.png"
                  alt="Luxury resort with infinity pool overlooking the ocean"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-2xl font-bold text-white">Packages</h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Experience Africa in style with our all-inclusive luxury packages. From beachfront resorts to safari
                  lodges.
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Zanzibar Beach Escape</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$1,899</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Cape Town & Winelands</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$2,250</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Seychelles Island Hopping</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$3,450</p>
                    </div>
                  </div>
                </div>

                <Link href="/packages">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    View All Packages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Middle Column - River Cruises */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/zambezi-queen.png"
                  alt="Zambezi Queen luxury river cruise boat"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-2xl font-bold text-white">River Cruises</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Explore Africa's majestic waterways aboard our selection of premium river cruise vessels. Experience
                  wildlife and scenery from a unique perspective.
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Zambezi Queen</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$1,250</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Chobe Princess</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$950</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Nile River Cruise</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">$1,450</p>
                    </div>
                  </div>
                </div>

                <Link href="/river-cruises">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    View All Cruises
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Tailor Made */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/tailor-made-safari.png"
                  alt="Family enjoying a tailor-made safari experience"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="text-2xl font-bold text-white">Tailor Made</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  Custom-designed African experiences created exclusively for you and your travel companions. Your dream
                  journey, your way.
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Family Safaris</h4>
                      <p className="text-sm text-gray-500">Age-appropriate activities for all generations</p>
                    </div>
                  </div>

                  <div className="flex items-start pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-medium">Honeymoon Journeys</h4>
                      <p className="text-sm text-gray-500">Romantic experiences in Africa's most beautiful settings</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div>
                      <h4 className="font-medium">Multi-Country Tours</h4>
                      <p className="text-sm text-gray-500">Combine multiple destinations in one journey</p>
                    </div>
                  </div>
                </div>

                <Link href="/tailor-made">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Start Planning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Categories - 2 Row x 2 Column Layout */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rail Journeys */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 relative h-48 md:h-auto">
                  <Image
                    src="/images/rail-journey.png"
                    alt="Luxury train journey through African landscape"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-5 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Rail Journeys</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Experience Africa's breathtaking landscapes from the comfort of a luxury train. Travel in style with
                    gourmet dining and elegant accommodations.
                  </p>
                  <Link href="/rail-journeys">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      Explore Rail Journeys
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Accommodations */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 relative h-48 md:h-auto">
                  <Image
                    src="/images/luxury-accommodation.png"
                    alt="Luxury safari tent with bathtub"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-5 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Luxury Accommodations</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Experience Africa in comfort and style with our handpicked selection of luxury lodges, tented camps,
                    and 5-star hotels.
                  </p>
                  <Link href="/accommodations">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      View Accommodations
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Group Tours */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 relative h-48 md:h-auto">
                  <Image
                    src="/images/safari-lion.png"
                    alt="Safari experience with lion and vehicle"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-5 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Group Tours</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Join like-minded travelers on our expertly guided group safaris and tours. Experience the best of
                    Africa with great company.
                  </p>
                  <Link href="/group-tours">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      View Group Tours
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Special Deals */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 relative h-48 md:h-auto">
                  <Image
                    src="/images/victoria-falls.png"
                    alt="Victoria Falls aerial view with rainbow"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-5 flex flex-col">
                  <h3 className="text-xl font-bold mb-2">Special Deals</h3>
                  <p className="text-gray-600 mb-4 flex-grow">
                    Take advantage of our limited-time offers, seasonal promotions, and exclusive packages for
                    incredible savings.
                  </p>
                  <Link href="/special-deals">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                      View Special Deals
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-amber-500 mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl text-center">
              We're passionate about creating unforgettable African experiences with exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Africa Specialists</h3>
                  <p className="text-gray-600">
                    Our team has extensive first-hand knowledge of Africa, with regular visits to stay updated.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Award-Winning Service</h3>
                  <p className="text-gray-600">
                    Recognized for our exceptional customer service and attention to detail.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Travel with confidence knowing our dedicated team is available around the clock.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2">Financial Protection</h3>
                  <p className="text-gray-600">
                    Your booking is secure with our comprehensive financial protection policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <Image
                  src="/images/travel-ready-man.png"
                  alt="Excited traveler ready for an African adventure"
                  width={500}
                  height={600}
                  className="rounded-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-amber-500 rounded-lg p-4 shadow-lg hidden md:block">
                  <p className="text-white font-bold text-xl">20+ Years</p>
                  <p className="text-white text-sm">Creating African memories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  )
}
