import Image from "next/image"
import SearchBar from "@/components/search-bar"
import CategoryGrid from "@/components/category-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Award, Users, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <>
      {/* Hero Section with modern overlay */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/02.jpg-7zbFi97PZ5cHic8l0Pwl4688VLEF2j.jpeg"
          alt="Majestic African Lion"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center text-white max-w-6xl px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
            TRAVEL WITH
            <span className="block gradient-text bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              EXPERIENCE
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling
            tailor-made and package tours to Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="gradient-orange hover:shadow-2xl text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
              Explore Tours
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 bg-transparent"
            >
              Watch Video
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section with modern container */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <SearchBar className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* Special Deals Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">SPECIAL DEALS</h2>
            <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
              The ultimate overland adventure tours by countries, each with individual time groups, traditions,
              dialects, landscapes and wildlife species. It is these characteristics which make each overland tour so
              exciting, interesting and unique destination.
            </p>
          </div>

          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Victoria.Falls_.1000x400.jpg-LWwuF4QaRsvuU51Qi3HESEuBpSgPUa.jpeg"
              alt="Victoria Falls with Rainbow"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Victoria Falls Experience</h3>
              <p className="text-lg opacity-90">Witness the power of nature's masterpiece</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Explore Africa</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Choose from our carefully curated selection of African adventures
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Why Choose Us Section with modern cards */}
      <section className="relative py-32 overflow-hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/back-ground.jpg-BrUhTFzSMQ2x9SzAzDoTvf3i5z4Bwn.jpeg"
          alt="Travel Journey - Ready for Adventure"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Why Choose Us</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "RESPONSIBLE PRICING",
                description:
                  "Our product team strives to deliver the best available prices from trusted and responsible local operators. We consider current exchange rates and the season of your travel to provide competitive pricing.",
              },
              {
                icon: Users,
                title: "PERSONALISED SERVICE",
                description:
                  "Our expert consultants are travel professionals. They will use their extensive knowledge of Africa, travel industry experience and passion for travelling to create your dream African holiday.",
              },
              {
                icon: Globe,
                title: "CUSTOMISED ITINERARIES",
                description:
                  "Whether you choose a popular pre-prepared itinerary, or prefer a tailormade itinerary which suits your interests, dates, timeframe and budget; our consultants will personalise every aspect of your journey.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="glass-effect rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="gradient-orange rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-8 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Connected</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get the latest deals and travel inspiration delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full px-6 backdrop-blur-md"
            />
            <Button className="gradient-orange hover:shadow-lg px-8 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
