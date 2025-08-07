"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, Clock, Heart, Sparkles } from "lucide-react"

export default function TailorMadePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/tailor-made-hero.jpg"
          alt="Custom-designed African safari adventure"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Tailor-made itineraries</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Custom-designed adventures crafted exclusively for you
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              Every detail personalized to create your perfect African journey, tailored to your interests, budget, and travel style
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                Tailor-made itineraries are designed by us to suit your individual dates, desired destinations, interests and budget. These itineraries may include flights, transfers, accommodation, meals and activities. Tailor-made itineraries are personalised and perfect for travellers with specific travel dates, honeymooners, families and those who seek be-spoke experiences.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-amber-600 mb-6">Your Journey, Your Way</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Tailor-made tours offer greater flexibility and independence. As opposed to group travel, private tours allow you to travel alone or with your own party. Set itineraries, which include self-drive itineraries, are available which you can customise to suit your individual interests and needs.
                </p>
                <p className="mb-6">
                  Additional side trips may include a visit to the local village or craft market, or may cater to your passion for photography. Tailormade safaris are escorted by a driver / guide in a private vehicle. This style of travel often appeals to travellers with specific travel dates, honeymooners and families.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                  <p className="text-amber-800 font-semibold">
                    Please contact us on <a href="tel:61296649187" className="text-amber-600 hover:text-amber-700 underline">+61 2 9664 9187</a> for more information on our tailor-made itinerary options.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-600">Private Tours</h3>
                <p className="text-gray-600">Travel with your own party - perfect for families, couples, or small groups seeking privacy and personalized attention.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-600">Flexible Dates</h3>
                <p className="text-gray-600">Choose your own travel dates and duration to fit your schedule and preferences perfectly.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-600">Custom Itineraries</h3>
                <p className="text-gray-600">Modify existing itineraries or create completely new ones based on your interests and passions.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-600">Expert Guides</h3>
                <p className="text-gray-600">Professional driver/guides with extensive local knowledge to enhance your experience.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-600">Personal Service</h3>
                <p className="text-gray-600">Dedicated support from our travel specialists to plan and book your perfect African adventure.</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-amber-600">Self-Drive Options</h3>
                <p className="text-gray-600">Independent self-drive itineraries available for the more adventurous traveler.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Tell Us Your Dreams</h3>
                <p className="text-gray-600 text-sm">
                  Share your interests, budget, travel dates, and any special requirements
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Design</h3>
                <p className="text-gray-600 text-sm">
                  Our specialists craft a detailed itinerary based on your preferences
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Refine & Perfect</h3>
                <p className="text-gray-600 text-sm">
                  Work together to adjust and perfect every detail of your journey
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Travel & Enjoy</h3>
                <p className="text-gray-600 text-sm">
                  Embark on your perfectly crafted African adventure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Itineraries */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Sample Tailor-made Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Luxury Safari */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <Image 
                    src="/images/luxury-accommodation.png" 
                    alt="Luxury Safari Experience" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Luxury Safari Experience</h3>
                  <p className="text-gray-600 mb-4">
                    Private game drives, exclusive camps, and world-class dining in Kenya and Tanzania
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>10-14 days</span>
                    <MapPin className="h-4 w-4 mr-1 ml-4" />
                    <span>Kenya & Tanzania</span>
                  </div>
                  <Link href="/contact?type=tailor-made&experience=luxury-safari">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">Inquire Now</Button>
                  </Link>
                </div>
              </div>

              {/* Family Adventure */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <Image 
                    src="/images/safari-lion.png" 
                    alt="Family Adventure" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Family Adventure</h3>
                  <p className="text-gray-600 mb-4">
                    Kid-friendly safaris, educational experiences, and family-suitable accommodations
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>7-10 days</span>
                    <MapPin className="h-4 w-4 mr-1 ml-4" />
                    <span>South Africa</span>
                  </div>
                  <Link href="/contact?type=tailor-made&experience=family-adventure">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">Inquire Now</Button>
                  </Link>
                </div>
              </div>

              {/* Cultural Journey */}
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <Image 
                    src="/images/tailor-made-safari.png" 
                    alt="Cultural Journey" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Cultural Journey</h3>
                  <p className="text-gray-600 mb-4">
                    Immersive cultural experiences, local communities, and traditional ceremonies
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>12-16 days</span>
                    <MapPin className="h-4 w-4 mr-1 ml-4" />
                    <span>Multi-country</span>
                  </div>
                  <Link href="/contact?type=tailor-made&experience=cultural-journey">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600">Inquire Now</Button>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Adventure?</h2>
          <p className="text-xl mb-6">
            Our travel specialists are ready to help you create the perfect tailor-made African experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <a 
              href="tel:61296649187"
              className="bg-white text-amber-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-lg text-lg inline-flex items-center justify-center gap-2"
            >
              Call +61 2 9664 9187
            </a>
            <Link 
              href="/contact?type=tailor-made"
              className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 rounded-lg text-lg inline-flex items-center justify-center gap-2"
            >
              Send Enquiry
            </Link>
          </div>
          <p className="text-amber-100">
            Email: <a href="mailto:sales@thisisafrica.com.au" className="hover:text-white underline">sales@thisisafrica.com.au</a>
          </p>
        </div>
      </section>
    </main>
  )
}