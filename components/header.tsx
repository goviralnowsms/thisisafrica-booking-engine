import Link from "next/link"
import { Facebook, Instagram, Twitter, Phone, Menu } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <>
      {/* Top bar with modern gradient */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link href="#" className="text-white hover:text-orange-400 transition-colors duration-300">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white hover:text-orange-400 transition-colors duration-300">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white hover:text-orange-400 transition-colors duration-300">
              <Twitter className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <Phone className="w-4 h-4" />
            <span>Need help? +61 (0) 2 96649187</span>
          </div>
        </div>
      </div>

      {/* Main header with glass effect */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TIA-NEW3-300x196-removebg-preview-2LFeoo3QTCARHfSJeCeCsF8E6cFdVx.png"
              alt="This is Africa - Travel with Experience"
              width={200}
              height={130}
              className="h-16 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/visas", label: "Visas" },
              { href: "/about", label: "About" },
              { href: "/insurance", label: "Insurance" },
              { href: "/brochure", label: "Brochure" },
              { href: "/terms", label: "Terms & Conditions" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-orange-500 font-medium transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
    </>
  )
}
