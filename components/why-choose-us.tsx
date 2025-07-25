import Image from "next/image"
import { CheckCircle2, Award, Clock, Shield, HeartHandshake } from "lucide-react"

export function WhyChooseUs() {
  return (
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
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Africa Specialists</h3>
                  <p className="text-gray-600">
                    Our team has extensive first-hand knowledge of Africa, with regular visits to stay updated on the
                    latest experiences and accommodations.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Award-Winning Service</h3>
                  <p className="text-gray-600">
                    Recognized for our exceptional customer service and attention to detail, we ensure every aspect of
                    your journey exceeds expectations.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Travel with confidence knowing our dedicated team is available around the clock to assist with any
                    needs during your journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Financial Protection</h3>
                  <p className="text-gray-600">
                    Your booking is secure with our comprehensive financial protection and flexible booking policies.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <HeartHandshake className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold mb-2">Responsible Travel</h3>
                  <p className="text-gray-600">
                    We're committed to sustainable tourism that benefits local communities and contributes to
                    conservation efforts across Africa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md">
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
  )
}
