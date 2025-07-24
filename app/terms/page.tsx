import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText, Shield, Users, Globe, AlertCircle, CheckCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/terms-conditions.jpg-7h7eonblDpNLAgxZX8lkAmvf43hFbg.jpeg"
          alt="Cultural exchange - sharing photography with local community"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Terms & Conditions</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-gray-700 text-lg leading-relaxed">
              These terms and conditions govern your use of This is Africa's services and your participation in our
              African travel experiences. We are committed to responsible tourism and creating meaningful connections
              between travelers and local communities.
            </p>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Commitment</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Our terms reflect our values of responsible tourism, community support, and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Licensed & Insured",
                description: "Licensed travel agent (ZTA 5985) with comprehensive insurance coverage",
              },
              {
                icon: Users,
                title: "Community Focus",
                description: "Supporting local communities and responsible tourism practices",
              },
              {
                icon: Globe,
                title: "Expert Knowledge",
                description: "40+ years combined experience in African travel",
              },
              {
                icon: FileText,
                title: "Clear Terms",
                description: "Transparent policies and fair booking conditions",
              },
            ].map((principle, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="gradient-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <principle.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{principle.title}</h3>
                <p className="text-gray-600 leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            {/* Booking Terms */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                Booking Terms
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Deposits:</strong> A deposit of 30% of the total tour cost is required to secure your booking.
                  Full payment is due 60 days prior to departure.
                </p>
                <p>
                  <strong>Confirmation:</strong> All bookings are subject to availability and confirmation from our
                  African tour operators and accommodation providers.
                </p>
                <p>
                  <strong>Documentation:</strong> Valid passports with at least 6 months validity and appropriate visas
                  are required. This is Africa can assist with visa applications.
                </p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-orange-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 text-orange-500 mr-3" />
                Cancellation Policy
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>More than 60 days:</strong> Deposit forfeited, remaining balance refunded minus administrative
                  fees.
                </p>
                <p>
                  <strong>31-60 days:</strong> 50% of total tour cost forfeited.
                </p>
                <p>
                  <strong>Less than 30 days:</strong> 100% of tour cost forfeited.
                </p>
                <p className="text-sm italic">
                  We strongly recommend comprehensive travel insurance to protect against unforeseen circumstances.
                </p>
              </div>
            </div>

            {/* Travel Insurance */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 text-blue-500 mr-3" />
                Travel Insurance
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  Travel insurance is strongly recommended and available through our partner nib with a 20% discount for
                  This is Africa customers.
                </p>
                <p>
                  Insurance should cover medical expenses, trip cancellation, lost luggage, and emergency evacuation.
                  Some activities may require additional coverage.
                </p>
              </div>
            </div>

            {/* Health & Safety */}
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Users className="w-6 h-6 text-green-500 mr-3" />
                Health & Safety
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  Travelers are responsible for ensuring they meet health requirements including vaccinations and
                  malaria prophylaxis as recommended by health authorities.
                </p>
                <p>
                  All activities carry inherent risks. Travelers participate at their own risk and should follow guide
                  instructions at all times.
                </p>
                <p>
                  This is Africa reserves the right to refuse service to travelers who pose a risk to themselves or
                  others.
                </p>
              </div>
            </div>

            {/* Responsible Tourism */}
            <div className="bg-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Globe className="w-6 h-6 text-purple-500 mr-3" />
                Responsible Tourism
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  Travelers are expected to respect local customs, cultures, and environments. We promote sustainable
                  tourism practices that benefit local communities.
                </p>
                <p>
                  Photography of people should be done respectfully and with permission. Some locations may have
                  restrictions on photography.
                </p>
                <p>We support local conservation efforts and ask travelers to follow Leave No Trace principles.</p>
              </div>
            </div>

            {/* Liability */}
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                Limitation of Liability
              </h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  This is Africa acts as an agent for tour operators, airlines, hotels, and other service providers. We
                  are not liable for their acts, omissions, or defaults.
                </p>
                <p>
                  Our liability is limited to the cost of services provided. We recommend comprehensive travel insurance
                  for additional protection.
                </p>
                <p>
                  Force majeure events including but not limited to natural disasters, political instability, or
                  pandemics may result in itinerary changes or cancellations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Questions About Our Terms?</h2>
          <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
            Our experienced team is here to help clarify any questions about our terms and conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
              Contact Us
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 bg-transparent"
            >
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Legal Footer */}
      <section className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            This is Africa Pty Ltd | ABN: [Number] | Licensed Travel Agent ZTA 5985
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Last updated: January 2025 | These terms are governed by Australian law
          </p>
        </div>
      </section>
    </div>
  )
}
