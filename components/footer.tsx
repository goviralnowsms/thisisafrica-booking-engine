import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TIA-NEW3-300x196-removebg-preview-2LFeoo3QTCARHfSJeCeCsF8E6cFdVx.png"
              alt="This is Africa - Travel with Experience"
              width={150}
              height={98}
              className="h-12 w-auto"
            />
            <p className="text-gray-300 leading-relaxed">Specializing in tailor-made and package tours to Africa.</p>

            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lowland-Gorilla-Africa-1_cropped-150x150-DJng5WcXpT0jpeala8F0ociDxZeR5e.jpeg"
                alt="African Lowland Gorilla"
                width={150}
                height={150}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xl mb-6 gradient-text">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/visas", label: "Visas" },
                { href: "/insurance", label: "Insurance" },
                { href: "/packages", label: "Packages" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest News */}
          <div>
            <h3 className="font-bold text-xl mb-6 gradient-text">Latest News</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-gray-300 text-sm mb-2">Follow This is Africa on social media for latest news</p>
                <p className="text-gray-500 text-xs">March 15, 2024</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-gray-300 text-sm mb-2">This is Africa launches new website with enhanced booking</p>
                <p className="text-gray-500 text-xs">March 10, 2024</p>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-xl mb-6 gradient-text">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p className="font-semibold text-white mb-1">This is Africa</p>
                  <p>Level 1, Suite 15</p>
                  <p>189 Queen Street</p>
                  <p>Melbourne VIC 3000</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <a
                  href="mailto:info@thisisafrica.com.au"
                  className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                >
                  info@thisisafrica.com.au
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <a href="tel:0396424187" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                  03 9642 4187
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; 2025 This is Africa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
