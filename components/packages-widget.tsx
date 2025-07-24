import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"

export function PackagesWidget() {
  return (
    <section className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="relative h-48">
        <Image
          src="/images/luxury-resort-pool.png"
          alt="Luxury resort with infinity pool overlooking the ocean"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-2xl font-bold text-white">Luxury Packages</h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-gray-600 mb-4">
          Experience Africa in style with our all-inclusive luxury packages. From beachfront resorts to safari lodges,
          we offer the finest accommodations and experiences.
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div>
              <h4 className="font-medium">Zanzibar Beach Escape</h4>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                ))}
                <span className="text-xs text-gray-500 ml-1">42 reviews</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">From</p>
              <p className="font-bold">$1,899</p>
            </div>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div>
              <h4 className="font-medium">Cape Town & Winelands</h4>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < 4 ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">36 reviews</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">From</p>
              <p className="font-bold">$2,250</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Seychelles Island Hopping</h4>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < 5 ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">28 reviews</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">From</p>
              <p className="font-bold">$3,450</p>
            </div>
          </div>
        </div>

        <Link href="/packages">
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
            View All Packages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
