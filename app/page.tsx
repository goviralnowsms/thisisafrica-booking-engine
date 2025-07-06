import { SearchForm } from "@/components/search-form"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">This is Africa</h1>
                <p className="text-sm text-orange-600">Discover Amazing Tours</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover the Magic of <span className="text-orange-500">Africa</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience unforgettable adventures across the African continent. From wildlife safaris to cultural
            journeys, find your perfect tour.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Featured Tours Section - Ready for API Integration */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Tours</h3>
            <p className="text-lg text-gray-600">Popular destinations and experiences across Africa</p>
          </div>

          {/* Placeholder for Featured Tours - Will be populated by Tourplan API */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-r from-orange-200 to-orange-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl">🦁</span>
                    </div>
                    <p className="text-orange-700 font-medium">Tour Loading...</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Featured Tour {item}</h4>
                  <p className="text-gray-600 text-sm mb-4">This space will display real tour data from Tourplan API</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 font-bold">From $---</span>
                    <span className="text-sm text-gray-500">-- days</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <span className="text-xl font-bold">This is Africa</span>
            </div>
            <p className="text-gray-400">© 2024 This is Africa Tours. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
