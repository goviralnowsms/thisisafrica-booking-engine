import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-16 w-48">
                <Image
                  src="/images/this-is-africa-logo.png"
                  alt="This is Africa Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-400">
              Crafting unforgettable African journeys since 2005. Our expert team brings you authentic experiences
              across the continent.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-amber-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/visas" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Visas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold">Latest News</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Image
                    src="/images/gorilla-news.png"
                    alt="Gorilla conservation efforts"
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">Gorilla Conservation Success in Rwanda</h4>
                  <p className="text-gray-400 text-sm mb-1">April 1, 2025</p>
                  <Link
                    href="/news/gorilla-conservation"
                    className="text-amber-500 text-sm hover:text-amber-400 inline-flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-[60px] h-[60px] bg-amber-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-medium">MAR 25</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-white">New Luxury Camp Opens in Serengeti</h4>
                  <p className="text-gray-400 text-sm mb-1">March 25, 2025</p>
                  <Link
                    href="/news/serengeti-camp"
                    className="text-amber-500 text-sm hover:text-amber-400 inline-flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                <span className="text-gray-400">123 Safari Street, Sydney, Australia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-amber-500" />
                <span className="text-gray-400">+61 2 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-amber-500" />
                <span className="text-gray-400">info@thisisafrica.com.au</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button className="bg-amber-500 hover:bg-amber-600 w-full">Book a Consultation</Button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">2025 Brochure</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <Image
                    src="/images/brochure-cover.png"
                    alt="This is Africa 2025 Brochure Cover"
                    width={120}
                    height={120}
                    className="rounded-md border-2 border-amber-500"
                  />
                </div>
                <h4 className="text-white text-center font-medium mb-2">This is Africa 2025</h4>
                <p className="text-gray-400 text-sm text-center mb-3">
                  Download our latest brochure featuring all our destinations and packages for 2025.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF (4.2MB)
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} This is Africa. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-amber-500 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-amber-500 text-sm">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-amber-500 text-sm">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
