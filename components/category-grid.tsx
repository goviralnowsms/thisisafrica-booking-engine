import Link from "next/link"
import Image from "next/image"
import { Car, Building, Ship, Train, Users, Package, ArrowRight } from "lucide-react"

const categories = [
  {
    title: "GROUP TOURS",
    description: "Specially selected tours. Great group accommodation and transport. Ideal for solo travellers.",
    icon: Users,
    href: "/group-tours",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-jS9rWqNokQHraE0UZ4VKn5VtPcYgQ2.jpeg",
  },
  {
    title: "ACCOMMODATION",
    description: "Great group tours. Choose from a variety of hotels. Ideal for solo travellers.",
    icon: Building,
    href: "/accommodation",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-MiICinKLvDhYScJDvi23I9XbW8UaQt.jpeg",
  },
  {
    title: "RAIL TOURS",
    description: "Discover our rail tours. The Blue Train, Shongololo Express and more.",
    icon: Train,
    href: "/rail-tours",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.jpg-Cz0na1LbpeZEXESmw6YTKIaAThiIcY.jpeg",
  },
  {
    title: "PACKAGES",
    description: "Specially selected tours. Great group accommodation and transport. Ideal for solo travellers.",
    icon: Package,
    href: "/packages",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.jpg-1MdxFlowVepMNZ7jCK8Fy7U7xI0Riu.jpeg",
  },
  {
    title: "CRUISES",
    description: "Discover our cruise options. Zambezi River cruises and more.",
    icon: Ship,
    href: "/cruises",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4.jpg-J3KOYmAWg9ER6wEphiEqzpzmzBUjCV.jpeg",
  },
  {
    title: "TAILOR MADE",
    description: "Custom-designed adventures. Personalized itineraries for your perfect African journey.",
    icon: Car,
    href: "/tailor-made",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tailor-made.jpg-qnQVfvKfB472tRUXsX2DTkeXn59dvh.jpeg",
  },
]

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <Link key={category.title} href={category.href} className="group">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-3">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:gradient-text transition-all duration-300">
                    {category.title}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
