import Image from "next/image"
import SearchBar from "@/components/search-bar"

export default function GroupToursPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-jS9rWqNokQHraE0UZ4VKn5VtPcYgQ2.jpeg"
          alt="Group Safari Tours"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Group Tours</h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>
      </section>

      {/* Description */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 max-w-4xl mx-auto">
            Join like-minded travelers on specially selected group tours. Great group accommodation and transport, ideal
            for solo travelers looking to explore Africa with others.
          </p>
        </div>
      </section>

      {/* Search Section - Redirects to booking engine with group-tours category */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <SearchBar category="group-tours" redirectToBooking={true} />
        </div>
      </section>

      {/* Content sections would go here */}
    </>
  )
}
