"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingIntegration } from "@/lib/booking-integration"
import { MapPin, Calendar, Users, Phone, Mail } from "lucide-react"

// Mock product data - in real app, this would come from your API/CMS
const getProductData = (slug: string) => {
  const products = {
    "classic-kenya-keekorok-lodges": {
      id: "classic-kenya-keekorok-lodges",
      title: "Classic Kenya - Keekorok Lodges",
      subtitle: "From the open plains of the Masai Mara to the pink flamingos of Lake Nakuru",
      description:
        "This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling tailor-made and package tours to Africa.",
      mapImage: "/images/kenya-safari-map.png",
      heroImage: "/images/keekorok-lodge.jpg",
      visits: "Nairobi, Masai Mara National Reserve, Lake Nakuru National Park, Lake Naivasha, Amboseli National Park",
      start: "Nairobi",
      finish: "Nairobi",
      duration: "7 days",
      style: "deluxe, small group safari",
      groupSize: "maximum 7",
      productCode: "NBOGTARPOOLCKEKEE",
      operates: "Sundays",
      overview:
        "From the open plains of the Masai Mara, to the pink flamingos of Lake Nakuru and the riverbeds of Amboseli, this small group safari includes three of the most picturesque regions of Kenya. It also provides the perfect opportunity to spot the 'big five' and to enjoy east Africa's diverse scenery. A visit to a Maasai village adds a rare insight into this ancient culture. One of our most popular Kenyan safaris, this tour provides great value and classic 'big five' game viewing.",
      itinerary: [
        {
          day: 1,
          title: "Nairobi",
          description: "Meet and greet transfer to your Nairobi hotel. Afternoon at leisure. Eka Hotel",
        },
        {
          day: 2,
          title: "Masai Mara National Reserve",
          description:
            "Drive through the rift escarpment to the Masai Mara National Reserve, followed by an afternoon game drive. Keekorok Lodge",
        },
        {
          day: 3,
          title: "Masai Mara National Reserve",
          description:
            "A full day of wildlife spotting with morning and afternoon game drives. Enjoy a visit to a Maasai village. Keekorok Lodge.",
        },
        {
          day: 4,
          title: "Lake Nakuru",
          description:
            "Spot wildlife en route to Lake Nakuru, where you enjoy lunch. This afternoon game drive in Lake Nakuru National Park. Lake Nakuru Lodge.",
        },
        {
          day: 5,
          title: "Amboseli National Park",
          description:
            "Enjoy a morning boat ride on Lake Naivasha, then depart the Rift Valley for Amboseli National Park. Ol Tukai Lodge.",
        },
        {
          day: 6,
          title: "Amboseli National Park",
          description:
            "With Mt Kilimanjaro as your backdrop you enjoy a full day of wildlife spotting during morning and afternoon game drives. Ol Tukai Lodge.",
        },
        {
          day: 7,
          title: "Nairobi",
          description: "Return drive to Nairobi.",
        },
      ],
      inclusions: {
        accommodation: "deluxe hotel and game lodges",
        transport: "4WD vehicle with photo roof (guaranteed window seat / maximum 7 passengers)",
        meals: "most meals (refer to inclusions tab)",
        guide: "English speaking driver / guide",
        activities:
          "game drives within three national parks and reserves, boat excursion Lake Naivasha, Maasai village visit",
      },
    },
  }

  return products[slug as keyof typeof products] || null
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState("introduction")

  const product = getProductData(slug)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600">The requested safari package could not be found.</p>
      </div>
    )
  }

  const handleBooking = () => {
    BookingIntegration.redirectToBooking({
      packageId: product.id,
      searchParams: {
        category: "safari",
        destination: "kenya",
      },
      source: "product-page",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{product.title}</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-4xl mx-auto text-lg">{product.description}</p>
          </div>

          {/* Main Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.mapImage || "/placeholder.svg"}
                alt="Classic Kenya Safari Route Map - Masai Mara, Lake Nakuru, Amboseli"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.heroImage || "/placeholder.svg"}
                alt="Keekorok Lodge wooden walkway and traditional safari accommodation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-orange-500 rounded-none h-14">
              <TabsTrigger
                value="introduction"
                className="text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold"
              >
                Introduction
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="inclusions"
                className="text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold"
              >
                Inclusions
              </TabsTrigger>
              <TabsTrigger
                value="dates-prices"
                className="text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold"
              >
                Dates & Prices
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="text-white data-[state=active]:bg-orange-600 data-[state=active]:text-white font-semibold"
              >
                Printable Itinerary
              </TabsTrigger>
            </TabsList>

            <div className="bg-gray-50 p-8">
              <TabsContent value="introduction" className="mt-0">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-orange-600 mb-6">{product.title.toUpperCase()}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-orange-600">Visits:</span> {product.visits}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-600">Start:</span> {product.start}{" "}
                        <span className="font-semibold text-orange-600">Finish:</span> {product.finish}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-600">Duration:</span> {product.duration}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-orange-600">Style:</span> {product.style}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-600">Group size:</span> {product.groupSize}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-600">Product code:</span> {product.productCode}
                      </div>
                      <div>
                        <span className="font-semibold text-orange-600">Operates:</span> {product.operates}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-8">{product.overview}</p>

                  <div className="space-y-6">
                    {product.itinerary.map((day) => (
                      <div key={day.day} className="border-l-4 border-orange-500 pl-6">
                        <h3 className="font-bold text-orange-600 mb-2">
                          Day {day.day}: {day.title}
                        </h3>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-orange-50 rounded-lg">
                    <h3 className="font-bold text-orange-600 mb-4">Safari Information:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold">Accommodation:</span> {product.inclusions.accommodation}
                      </div>
                      <div>
                        <span className="font-semibold">Transport:</span> {product.inclusions.transport}
                      </div>
                      <div>
                        <span className="font-semibold">Meals:</span> {product.inclusions.meals}
                      </div>
                      <div>
                        <span className="font-semibold">Guide:</span> {product.inclusions.guide}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-semibold">Activities:</span> {product.inclusions.activities}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Tour Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="font-semibold">Duration</p>
                        <p className="text-gray-600">{product.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="font-semibold">Group Size</p>
                        <p className="text-gray-600">{product.groupSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="font-semibold">Style</p>
                        <p className="text-gray-600">{product.style}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="inclusions" className="mt-0">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Accommodation</p>
                        <p className="text-gray-600">{product.inclusions.accommodation}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Transportation</p>
                        <p className="text-gray-600">{product.inclusions.transport}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Meals</p>
                        <p className="text-gray-600">{product.inclusions.meals}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Guide</p>
                        <p className="text-gray-600">{product.inclusions.guide}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">Activities</p>
                        <p className="text-gray-600">{product.inclusions.activities}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dates-prices" className="mt-0">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Dates & Pricing</h2>
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-6">Contact us for current pricing and availability</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={handleBooking}
                        className="gradient-orange hover:shadow-lg text-white px-8 py-3 rounded-full font-semibold"
                      >
                        Request Quote
                      </Button>
                      <Button
                        variant="outline"
                        className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold bg-transparent"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Us
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="mt-0">
                <div className="bg-white rounded-lg p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Printable Itinerary</h2>
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50 bg-transparent"
                    >
                      Download PDF
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {product.itinerary.map((day) => (
                      <div key={day.day} className="border-b border-gray-200 pb-4">
                        <h3 className="font-bold text-lg mb-2">
                          Day {day.day}: {day.title}
                        </h3>
                        <p className="text-gray-700">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Safari?</h2>
          <p className="text-orange-100 mb-8 text-lg">Contact us today to secure your African adventure</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleBooking}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold text-lg"
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-full font-semibold text-lg bg-transparent"
            >
              <Mail className="w-4 h-4 mr-2" />
              Get Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
