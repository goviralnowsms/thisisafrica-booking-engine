import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Users, Calendar, MapPin } from "lucide-react"

export function TailorMade() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tailor-made Itineraries</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Custom-designed African experiences created exclusively for you and your travel companions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/tailor-made-safari.png"
              alt="Family enjoying a tailor-made safari experience"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold">Your Dream African Journey, Your Way</h3>
            <p className="text-lg text-gray-600">
              Our tailor-made itineraries are designed around your specific interests, preferred travel dates, and
              accommodation style. Whether you're planning a family adventure, a romantic honeymoon, or a special
              celebration with friends, we'll craft the perfect itinerary just for you.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lg">Personalized Itineraries</h4>
                  <p className="text-gray-600">
                    Customized routes and experiences based on your interests and travel style
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lg">Expert Planning</h4>
                  <p className="text-gray-600">
                    Work with our Africa specialists who have extensive first-hand knowledge
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lg">Flexible Scheduling</h4>
                  <p className="text-gray-600">Travel on dates that work for you, not fixed departure schedules</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-lg">24/7 Support</h4>
                  <p className="text-gray-600">Dedicated assistance throughout your journey for peace of mind</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                Start Planning Your Itinerary
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Users className="h-10 w-10 text-amber-500 mr-4" />
              <h3 className="text-xl font-bold">Family Itineraries</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Age-appropriate activities, family-friendly accommodations, and experiences that will create lasting
              memories for all generations.
            </p>
            <Link
              href="/tailor-made/family"
              className="text-amber-500 font-medium hover:text-amber-600 inline-flex items-center"
            >
              Learn More
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <Calendar className="h-10 w-10 text-amber-500 mr-4" />
              <h3 className="text-xl font-bold">Special Occasions</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Celebrate anniversaries, birthdays, or other milestones with extraordinary experiences in Africa's most
              beautiful settings.
            </p>
            <Link
              href="/tailor-made/special-occasions"
              className="text-amber-500 font-medium hover:text-amber-600 inline-flex items-center"
            >
              Learn More
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <MapPin className="h-10 w-10 text-amber-500 mr-4" />
              <h3 className="text-xl font-bold">Multi-Country Journeys</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Seamlessly combine multiple African destinations in one perfectly coordinated itinerary tailored to your
              interests.
            </p>
            <Link
              href="/tailor-made/multi-country"
              className="text-amber-500 font-medium hover:text-amber-600 inline-flex items-center"
            >
              Learn More
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
