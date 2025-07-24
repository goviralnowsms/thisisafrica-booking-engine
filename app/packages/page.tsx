"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { BookingIntegration } from "@/lib/booking-integration"

interface Package {
  id: string
  title: string
  duration: string
  description: string
  image: string
  priceNote: string
  onRequest: boolean
  category: string
}

// Mock data - replace with actual Tourplan API call
const mockPackages: Package[] = [
  {
    id: "chobe-safari-2night",
    title: "CHOBE SAFARI LODGE - 2 NIGHT GETAWAY LUXURY",
    duration: "3 DAYS",
    description: "Operates daily per person twin share",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-MiICinKLvDhYScJDvi23I9XbW8UaQt.jpeg",
    priceNote: "per person twin share",
    onRequest: true,
    category: "packages",
  },
  {
    id: "chobe-safari-3night",
    title: "CHOBE SAFARI LODGE - 3 NIGHT SAFARI SPECIAL",
    duration: "4 DAYS",
    description: "Operates daily per person twin share",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-jS9rWqNokQHraE0UZ4VKn5VtPcYgQ2.jpeg",
    priceNote: "per person twin share",
    onRequest: true,
    category: "packages",
  },
  {
    id: "chobe-bush-3night",
    title: "CHOBE BUSH LODGE - 3 NIGHT SAFARI SPECIAL",
    duration: "4 DAYS",
    description: "Operates daily per person twin share",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.jpg-1MdxFlowVepMNZ7jCK8Fy7U7xI0Riu.jpeg",
    priceNote: "per person twin share",
    onRequest: true,
    category: "packages",
  },
]

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    botswana: false,
    namibia: false,
    zimbabwe: false,
  })

  useEffect(() => {
    // Simulate API call
    setPackages(mockPackages)
  }, [])

  const handleBooking = (pkg: Package) => {
    // Redirect to booking engine with package details
    BookingIntegration.redirectToBooking({
      packageId: pkg.id,
      searchParams: {
        category: "packages",
        startingCountry: "botswana", // Could be from current search state
        destination: "chobe",
      },
      source: "packages-page",
    })
  }

  const handleQuickBook = (pkg: Package) => {
    // Direct booking without search parameters
    BookingIntegration.redirectToBooking({
      packageId: pkg.id,
      source: "packages-quick-book",
    })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/packages-header-xrWtskScfdU2BIzjYWziyLsLhQMiDN.png"
          alt="Luxury African Accommodation"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Packages</h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
        </div>
      </section>

      {/* Description */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 max-w-4xl mx-auto">
            This is Africa is a rapidly growing wholesale and retail travel company which specialises in selling
            tailor-made and package tours to Africa.
          </p>
        </div>
      </section>

      {/* Search Section - This will redirect to booking engine */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <SearchBar category="packages" redirectToBooking={true} />
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-gray-700">Show only these destinations:</span>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="botswana"
                checked={filters.botswana}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, botswana: checked as boolean }))}
              />
              <label htmlFor="botswana" className="text-sm font-medium">
                Botswana
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="namibia"
                checked={filters.namibia}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, namibia: checked as boolean }))}
              />
              <label htmlFor="namibia" className="text-sm font-medium">
                Namibia
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="zimbabwe"
                checked={filters.zimbabwe}
                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, zimbabwe: checked as boolean }))}
              />
              <label htmlFor="zimbabwe" className="text-sm font-medium">
                Zimbabwe
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching packages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-64">
                    <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill className="object-cover" />
                    {pkg.onRequest && (
                      <Badge className="absolute top-4 right-4 bg-gray-600 text-white">ON REQUEST</Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{pkg.title}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-orange-500">{pkg.duration}</div>
                      <div className="text-sm text-gray-600">{pkg.description}</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{pkg.priceNote}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBooking(pkg)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        VIEW DETAILS
                      </Button>
                      <Button
                        onClick={() => handleQuickBook(pkg)}
                        variant="outline"
                        className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
                      >
                        BOOK NOW
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
