import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SpecialDeals() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Deals</h2>
          <div className="w-20 h-1 bg-amber-500 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Limited-time offers on our most popular destinations and experiences
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden shadow-lg mb-12">
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src="/images/victoria-falls.png"
              alt="Victoria Falls aerial view with rainbow"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                  <Badge className="mb-3 bg-amber-500 hover:bg-amber-600">Limited Time Offer</Badge>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Victoria Falls Explorer</h3>
                  <p className="text-white/90 max-w-2xl mb-4">
                    Experience the majestic Victoria Falls, one of the Seven Natural Wonders of the World
                  </p>
                  <div className="flex items-center">
                    <span className="text-white/80 line-through mr-2">$3,599</span>
                    <span className="text-xl font-bold text-white">$2,879</span>
                    <span className="ml-2 bg-green-600 text-white text-sm px-2 py-1 rounded">Save 20%</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">View Deal</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
