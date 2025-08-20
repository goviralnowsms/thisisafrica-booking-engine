"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import FeaturedSpecials from "@/components/homepage/FeaturedSpecials"

export default function Home() {
  const router = useRouter()
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
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8">
              This is Africa is an Australian-owned company which specialise in selling group tours, pre-designed packages and tailor-made itineraries in southern and eastern Africa and the Middle East. For 25 years we have provided travellers with enriching and memorable Africa adventures and experiences.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-amber-500 hover:bg-amber-600 text-white px-8"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
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

      {/* Product-specific Navigation */}
      <section id="search-section" className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore Our Tours by Category</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the type of African adventure that speaks to you. Each category offers specialized tours with expert guidance and authentic experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Button 
              onClick={() => router.push('/group-tours-list')}
              className="bg-amber-500 hover:bg-amber-600 text-white h-16 text-lg font-semibold"
            >
              Group Tours
            </Button>
            <Button 
              onClick={() => router.push('/cruise')}
              className="bg-blue-500 hover:bg-blue-600 text-white h-16 text-lg font-semibold"
            >
              River Cruises
            </Button>
            <Button 
              onClick={() => router.push('/rail')}
              className="bg-green-500 hover:bg-green-600 text-white h-16 text-lg font-semibold"
            >
              Rail Journeys
            </Button>
            <Button 
              onClick={() => router.push('/packages')}
              className="bg-purple-500 hover:bg-purple-600 text-white h-16 text-lg font-semibold"
            >
              Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Travel Categories Cards - 2x3 Grid */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Guided Group Tours */}
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
                <h3 className="text-xl font-bold mb-2 text-gray-900">GUIDED GROUP TOURS</h3>
                <p className="text-gray-600 mb-4">
                  Specially selected tours. Great group accommodation and transport. Ideal for solo travellers.
                </p>
                <Button 
                  onClick={() => window.open('/group-tours-list', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Book now
                </Button>
              </div>
            </div>

            {/* 2. Pre-designed Packages */}
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
                <h3 className="text-xl font-bold mb-2 text-gray-900">PRE-DESIGNED PACKAGES</h3>
                <p className="text-gray-600 mb-4">
                  Specially selected tours. Great group accommodation and transport. Ideal for solo travellers.
                </p>
                <Button 
                  onClick={() => window.open('/packages', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Book now
                </Button>
              </div>
            </div>

            {/* 3. Tailor-made Itineraries */}
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
                <h3 className="text-xl font-bold mb-2 text-gray-900">TAILOR-MADE ITINERARIES</h3>
                <p className="text-gray-600 mb-4">
                  Custom-designed adventures. Personalised itineraries for your perfect African journey.
                </p>
                <Button 
                  onClick={() => router.push('/tailor-made')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Learn more
                </Button>
              </div>
            </div>

            {/* 4. Rail Journeys */}
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
                <h3 className="text-xl font-bold mb-2 text-gray-900">RAIL JOURNEYS</h3>
                <p className="text-gray-600 mb-4">
                  Discover our rail journeys. The Blue Train, Shongololo Express and more.
                </p>
                <Button 
                  onClick={() => window.open('/rail', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Book now
                </Button>
              </div>
            </div>

            {/* 5. Cruises */}
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
                <Button 
                  onClick={() => window.open('/cruise', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Book now
                </Button>
              </div>
            </div>

            {/* 6. Accommodation */}
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
                <Button 
                  onClick={() => window.open('/accommodation', '_blank')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Book now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Specials Section */}
      <FeaturedSpecials />

      {/* Featured Tours - Direct Booking */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Featured safari adventures</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to book? These are our most popular tours, available for immediate online booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Classic Kenya - Keekorok */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image src="/images/safari-lion.png" alt="Classic Kenya Safari" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded text-sm font-medium">
                  🔥 Most Popular
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Classic Kenya - Keekorok</h3>
                <p className="text-gray-600 mb-3 text-sm">6 days • Masai Mara • Lake Nakuru • Amboseli</p>
                <p className="text-gray-600 mb-4">
                  Experience the ultimate Kenyan safari with big five game viewing, Maasai village visit, and stunning landscapes.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-green-600">From AUD $5,447</span>
                    <p className="text-sm text-gray-500">per person twin share</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.open('/products/NBOGTARP001CKEKEE', '_blank', 'noopener,noreferrer')}
                    variant="outline"
                    className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    📋 View Details
                  </Button>
                  <Button 
                    onClick={() => router.push('/contact?tour=NBOGTARP001CKEKEE&name=Classic Kenya - Keekorok&type=group-tour')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
                  >
                    🚀 Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Classic Kenya - Serena */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image src="/images/products/1001187777125043.jpg" alt="Classic Kenya Serena" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                  ⭐ Premium
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Classic Kenya - Serena</h3>
                <p className="text-gray-600 mb-3 text-sm">6 days • Masai Mara • Lake Nakuru • Amboseli</p>
                <p className="text-gray-600 mb-4">
                  Luxury safari experience at premium Serena lodges with exceptional service and prime locations.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-green-600">From AUD $5,800</span>
                    <p className="text-sm text-gray-500">per person twin share</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.open('/products/NBOGTARP001CKSE', '_blank', 'noopener,noreferrer')}
                    variant="outline"
                    className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    📋 View Details
                  </Button>
                  <Button 
                    onClick={() => router.push('/contact?tour=NBOGTARP001CKSE&name=Classic Kenya - Serena&type=group-tour')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold"
                  >
                    🚀 Book Now
                  </Button>
                </div>
              </div>
            </div>

            {/* View All Tours */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow text-white">
              <div className="p-8 text-center h-full flex flex-col justify-center">
                <div className="mb-6">
                  <Search className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold mb-4">Explore All Tours</h3>
                  <p className="mb-6 opacity-90">
                    Discover our complete collection of African adventures across Kenya, Tanzania, Botswana, and more.
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/group-tours-list')}
                  variant="outline"
                  className="bg-white text-amber-600 border-white hover:bg-amber-50 font-bold"
                >
                  🔍 Browse All Tours
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose us</h2>
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
