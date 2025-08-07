"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh]">
        <Image
          src="/images/products/about-us.jpg"
          alt="About This is Africa - Travel with Experience"
          fill
          priority
          className="object-cover"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">About</h1>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Image */}
              <div className="relative">
                <Image
                  src="/images/safari-lion.png"
                  alt="African Wildlife Safari"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg w-full"
                  quality={90}
                />
              </div>

              {/* Right Column - Content */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    The African continent includes over 50 countries, each with individual tribal groups, 
                    traditions, dialects and unique species. It is these characteristics which 
                    make Africa such an exciting, interesting and unique destination. Distances can be 
                    vast and many countries customs and practices can differ from most western countries, 
                    which is part of the excitement. That is why a reliable, experienced and well-qualified 
                    travel company offering the right travel company will be the best choice.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Having represented African tour operators in Australia since 1999, the director of 
                    This is Africa has had team from over 40 years of extensive knowledge and 
                    experience in promoting Africa. As a result, This is Africa offers creative and 
                    innovative packages which will make your African journey as interesting as your 
                    destination. We specialise in tailor-made and packaged tours for leisure and business 
                    travellers. Whether you want luxury, mid to accommodation and a 
                    personalised service or whether you are on a tight budget and want to stretch your legs 
                    as far as possible, we can service all travellers.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Content Row */}
            <div className="mt-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Responsible Travel Section */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Responsible Travel</h3>
                  <p className="text-gray-700 leading-relaxed">
                    One of our operators are African-based and most of the travel wholesalers and lodges we feature support local charities and assist with projects in local communities. Many 
                    game lodges not only support the local community by offering employment, but also provide financial assistance to local schools, orphanages, medical clinics and animal 
                    rehabilitation centres. Rest assured that your visit to Africa will benefit the people you meet and the extended local community.
                  </p>
                </div>

                {/* Licensed Agent Section */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Licensed Agent</h3>
                  <p className="text-gray-700 leading-relaxed">
                    This is Africa is a licensed travel agent (LTA 5865).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Why Choose This is Africa?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Knowledge</h3>
                <p className="text-gray-600">
                  Over 40 years of extensive experience in promoting African travel
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">50+ Countries</h3>
                <p className="text-gray-600">
                  Extensive coverage across the entire African continent
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Licensed Agent</h3>
                <p className="text-gray-600">
                  Fully licensed travel agent (LTA 5865) for your peace of mind
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tailor-Made</h3>
                <p className="text-gray-600">
                  Customized tours designed to match your interests and budget
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Experience Africa?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Let our expertise guide you through the adventure of a lifetime. 
            Contact us today to start planning your African journey.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-amber-500 hover:bg-amber-600">
                Contact Us Today
              </Button>
            </Link>
            <Link href="/packages">
              <Button variant="outline">
                View Our Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}