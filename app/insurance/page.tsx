import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shield, Phone, Globe, Heart, CheckCircle, AlertTriangle } from "lucide-react"

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wild-life-1-1-insurance.jpg-mAO3mPqLAx1J222yAqh0pj8BQ4TdmC.jpeg"
          alt="Group of travelers on walking safari in African savanna"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Insurance</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-12">
              <p className="text-gray-700 text-lg leading-relaxed">
                This is Africa offers travel insurance through nib and if you book through us you will automatically
                receive a 20% discount. The online process is simple and you can save up to hundreds of dollars!
              </p>
            </div>

            {/* About nib */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <p className="text-gray-700 leading-relaxed mb-6">
                Nib understands the importance of helping people access insurance products and services suitable for
                every travel adventure; from planning and experiencing, to returning home safely.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can choose the plan that you think best suits the kind of holiday you're taking and the level of
                cover you need – from basic cover through to comprehensive, multi-trip, domestic and international
                plans.
              </p>
            </div>

            {/* Coverage Details */}
            <div className="bg-green-50 border-l-4 border-green-500 rounded-r-2xl p-8">
              <h3 className="text-xl font-bold text-green-700 mb-6">
                nib can provide cover for many things that could go wrong when you travel, including:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Having your trip or flights cancelled",
                  "Accidental lost luggage or having it stolen",
                  "Suffering a medical or dental emergency overseas",
                  "Getting sick or injured overseas, even when playing amateur sports, and more",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <p className="text-gray-700 leading-relaxed">
                nib travel insurance also includes automatic cover for a range of existing medical conditions and the
                ability to apply to cover some other conditions for an additional premium (which may be significant) and
                increased excess.
              </p>
            </div>

            {/* 24/7 Emergency Support */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-2xl p-8">
              <h3 className="text-xl font-bold text-red-700 mb-4">24/7 Emergency medical support</h3>
              <p className="text-gray-700 leading-relaxed">
                Our 24/7 Emergency Assistance team provides emergency assistance for our customers worldwide. Our
                experienced specialists can be contacted by telephone 24 hours a day, 7 days a week to help you in the
                event of an emergency and to liaise on your behalf with our in-house medical team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Why Choose Our Insurance?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Comprehensive protection for your African adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "20% Discount",
                description: "Automatic discount when you book through This is Africa",
              },
              {
                icon: Phone,
                title: "24/7 Support",
                description: "Emergency assistance available worldwide, anytime",
              },
              {
                icon: Globe,
                title: "Worldwide Coverage",
                description: "Comprehensive protection across all African destinations",
              },
              {
                icon: Heart,
                title: "Medical Conditions",
                description: "Automatic cover for existing medical conditions included",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="gradient-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Types */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Coverage Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose the plan that best suits your travel needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Basic Cover",
                description: "Essential protection for budget-conscious travelers",
                features: ["Trip cancellation", "Medical emergencies", "Lost luggage", "24/7 support"],
              },
              {
                title: "Comprehensive",
                description: "Complete protection for worry-free travel",
                features: [
                  "All basic features",
                  "Adventure sports cover",
                  "Higher claim limits",
                  "Pre-existing conditions",
                ],
                popular: true,
              },
              {
                title: "Multi-Trip",
                description: "Perfect for frequent travelers to Africa",
                features: ["Annual coverage", "Multiple destinations", "Business travel", "Family options"],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-orange-500 to-orange-600 text-white transform scale-105"
                    : "bg-white hover:-translate-y-2"
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className={`text-2xl font-bold mb-4 ${plan.popular ? "text-white" : "text-gray-800"}`}>
                  {plan.title}
                </h3>
                <p className={`mb-6 ${plan.popular ? "text-orange-100" : "text-gray-600"}`}>{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle
                        className={`w-5 h-5 ${plan.popular ? "text-orange-200" : "text-green-500"} flex-shrink-0`}
                      />
                      <span className={plan.popular ? "text-orange-100" : "text-gray-700"}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={
                    plan.popular
                      ? "w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold py-3 rounded-full"
                      : "w-full gradient-orange text-white hover:shadow-lg font-semibold py-3 rounded-full"
                  }
                >
                  Get Quote
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Protect Your African Adventure</h2>
          <p className="text-orange-100 mb-8 text-lg max-w-2xl mx-auto">
            Don't let unexpected events ruin your dream trip. Get comprehensive travel insurance with our exclusive 20%
            discount.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
              Get Insurance Quote
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-yellow-50 border-t-4 border-yellow-400">
        <div className="container mx-auto px-4">
          <div className="flex items-start space-x-4 max-w-4xl mx-auto">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-yellow-700 text-sm leading-relaxed">
                Please read the Product Disclosure Statement (PDS) and Target Market Determination (TMD) before
                purchasing travel insurance. Consider if the product is right for you and seek professional advice if
                needed. Terms, conditions, limits, and exclusions apply.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
