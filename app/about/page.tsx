import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/about-us.jpg-A3D9aNmaFa1kfVKE1TRgrJnU5BTUy7.jpeg"
          alt="Contemplating the African landscape from a mountain cliff"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Image */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/mountain-gorilla.jpg"
                alt="Mountain Gorilla in natural habitat - Rwanda, Uganda wildlife experience"
                fill
                className="object-cover"
              />
            </div>

            {/* Right Column - Content */}
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-justify">
                  The African continent includes over 50 countries, each with individual tribal groups, traditions,
                  dialects, landscapes and wildlife species. It is these characteristics which make Africa such an
                  exciting, interesting and unique destination. Distances can be vast and each country's customs and
                  practices can make travel challenging at times, but in choosing the right travel company your African
                  adventure will be an extraordinarily fulfilling experience.
                </p>

                <p className="text-gray-700 leading-relaxed text-justify">
                  Having represented African tour operators in Australia since 1995, the director of This is Africa and
                  his team have over 40 years of combined knowledge and experience of promoting Africa. As a result,
                  This is Africa offers creative and innovative itineraries which will make your African journey as
                  interesting as your destination. We offer a wide selection of group tours and tailor-made itineraries
                  to suit all travellers. Whether you want luxury, five star accommodation and a personalised safari, or
                  you are on a tight budget and want to stretch your savings, we provide accurate, useful and reliable
                  advice at competitive prices.
                </p>
              </div>

              {/* Responsible Travel Section */}
              <div className="bg-orange-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">Responsible Travel</h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  Our tour operators are African-based and most of the travel wholesalers and lodges we feature support
                  local charities and assist with projects in local communities. Many game lodges not only support the
                  local community by offering employment, but also provide financial assistance to local schools,
                  orphanages, medical clinics and animal rehabilitation centres. Rest assured that your visit to Africa
                  will benefit the people you meet and the extended local community.
                </p>
              </div>

              {/* Licensed Agent */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-gray-600 font-medium">
                  <span className="font-bold">Licensed agent:</span> This is Africa is a licensed travel agent (ZTA
                  5985).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Values</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              What drives us to create exceptional African travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "40+ Years Experience",
                description: "Combined knowledge and expertise in African travel since 1995",
              },
              {
                icon: Heart,
                title: "Responsible Tourism",
                description: "Supporting local communities, charities, and conservation projects",
              },
              {
                icon: Users,
                title: "Personalized Service",
                description: "Tailored itineraries to suit every traveler's needs and budget",
              },
              {
                icon: Globe,
                title: "Local Partnerships",
                description: "Working with African-based operators and local communities",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="gradient-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <value.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">40+</div>
              <div className="text-orange-100 text-lg">Years Combined Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-orange-100 text-lg">African Countries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1995</div>
              <div className="text-orange-100 text-lg">Established Since</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
              <div className="text-orange-100 text-lg">Responsible Tourism</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Start Your African Adventure?</h2>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Let our experienced team create a personalized itinerary that will make your African journey unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gradient-orange hover:shadow-2xl text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
              Plan Your Trip
            </Button>
            <Button
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
