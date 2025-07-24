"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Eye, MapPin, Calendar, Users, Star, Phone, Mail, Clock } from "lucide-react"

export default function BrochureClientPage() {
  const highlights = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Group Tours",
      description: "Small group adventures across Africa's most iconic destinations",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Private Safaris",
      description: "Exclusive wildlife experiences in luxury game reserves",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Rail Journeys",
      description: "Luxury train travel including Rovos Rail and Blue Train",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Tailor-Made",
      description: "Custom itineraries designed around your preferences",
    },
  ]

  const destinations = [
    "South Africa",
    "Kenya",
    "Tanzania",
    "Botswana",
    "Zimbabwe",
    "Zambia",
    "Namibia",
    "Uganda",
    "Rwanda",
    "Mauritius",
    "Madagascar",
    "Egypt",
  ]

  const handleDownloadBrochure = () => {
    // Create a link element and trigger download
    const link = document.createElement("a")
    link.href = "/brochure/this-is-africa-2025-brochure.pdf"
    link.download = "This-is-Africa-2025-Brochure.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewBrochure = () => {
    window.open("/brochure/this-is-africa-2025-brochure.pdf", "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cheetah-hero.jpg"
            alt="African Cheetah in natural habitat"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  2025 Edition Now Available
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                  Africa Travel Brochure
                  <span className="block text-orange-600">2025</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Discover the magic of Africa with our comprehensive 108-page travel guide. From epic safaris to luxury
                  rail journeys, find your perfect African adventure with 25 years of expertise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
                  onClick={handleDownloadBrochure}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg bg-white/80 backdrop-blur-sm"
                  onClick={handleViewBrochure}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Online
                </Button>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-3">What's Inside:</h3>
                <ul className="text-slate-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    108 pages of African travel inspiration
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    Detailed itineraries and pricing for 2025
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    Expert travel tips and destination guides
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2">•</span>
                    Luxury accommodations and unique experiences
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Brochure Preview */}
            <div className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg transform rotate-3 opacity-20"></div>
                <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200">
                  <div className="aspect-[3/4] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-600 via-orange-500 to-orange-700"></div>
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
                      <div>
                        <div className="text-sm opacity-90 mb-2">thisisafrica.com.au</div>
                        <div className="text-xs opacity-75">02 9664 9187</div>
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">GROUP TOURS</h3>
                        <h4 className="text-lg mb-1">FAMILY TOURS</h4>
                        <h4 className="text-lg mb-1">GORILLA TREKS</h4>
                        <h4 className="text-lg mb-1">RAIL JOURNEYS</h4>
                        <h4 className="text-lg mb-1">PRIVATE SAFARIS</h4>
                        <h4 className="text-lg mb-4">TAILOR MADE HOLIDAYS</h4>
                        <div className="text-3xl font-bold">2025</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs opacity-90">Prices are per person, twin share, 2025 low season</div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-medium">108 Pages</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Africa Your Way</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From intimate group tours to luxury private safaris, discover the perfect way to experience Africa's
              wonders with our expert guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-all hover:border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-4">
                    {highlight.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{highlight.title}</h3>
                  <p className="text-sm text-slate-600">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Destinations We Cover</h2>
            <p className="text-lg text-slate-600">
              Explore 12 incredible African countries with 25 years of expert local knowledge
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {destinations.map((destination, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                {destination}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">25 Years of African Expertise</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            For the past 25 years, This is Africa has been providing travellers with enriching and memorable Africa
            adventures. We are an Australian-owned company and accredited member of the Council of Australian Tour
            Operators. We only sell holidays to Africa - nowhere else.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">25+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
              <div className="text-slate-600">African Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-slate-600">Africa Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Planning?</h2>
          <p className="text-xl text-orange-100 mb-8">Download our brochure and begin your African adventure today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
              onClick={handleDownloadBrochure}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Brochure
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg bg-transparent transition-all"
              onClick={() => (window.location.href = "tel:+61296649187")}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call +61 (0) 2 9664 9187
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Need Help Planning Your Trip?</h3>
            <p className="text-slate-600">
              Our Africa travel experts are here to help you create the perfect itinerary
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <div className="font-medium text-slate-900 mb-1">Phone</div>
              <div className="text-slate-600">+61 (0) 2 9664 9187</div>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-3">
                <Mail className="h-6 w-6" />
              </div>
              <div className="font-medium text-slate-900 mb-1">Email</div>
              <div className="text-slate-600">sales@thisisafrica.com.au</div>
            </div>

            <div className="flex flex-col items-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <div className="font-medium text-slate-900 mb-1">Hours</div>
              <div className="text-slate-600">Mon-Fri 9:00am-5:00pm</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
