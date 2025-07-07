import Link from "next/link"
import { MapPin, Phone } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">This is Africa</h1>
              <p className="text-sm text-gray-600">Book Your African Adventure</p>
            </div>
          </Link>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+61 (0) 2 96649187</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
