import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-3 space-y-4 lg:pl-8">
            {/* This is Africa Logo */}
            <Link href="/" className="inline-block">
              <div className="relative h-16 w-48">
                <Image
                  src="/images/products/this-is-africa-logo.png"
                  alt="This is Africa Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            
            {/* CATO Membership */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Proud members of:</p>
              <Link href="https://www.cato.travel/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Image
                  src="/images/products/CATO-300x164-membership.png"
                  alt="CATO Member"
                  width={150}
                  height={82}
                />
              </Link>
            </div>
            
            {/* ATIA Logo */}
            <div>
              <Link href="https://atia.travel/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Image
                  src="/images/products/atia.png"
                  alt="ATIA Member"
                  width={150}
                  height={82}
                  className="rounded"
                />
              </Link>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-2">
              <Link href="https://www.facebook.com/ThisisAfricaAUS/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/thisisafricaaus/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://x.com/ThisisAfricaAUS" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Quick links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Home
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
              <li>
                <Link href="/terms-conditions" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold">Contact us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                <span className="text-gray-400">51 Frenchmans Rd, Randwick NSW 2031, Australia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-amber-500" />
                <span className="text-gray-400">+61 2 9664 9187</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-amber-500" />
                <span className="text-gray-400">sales@thisisafrica.com.au</span>
              </li>
            </ul>
            
            <div className="pt-4">
              <h4 className="text-md font-semibold text-white mb-2">Hours of operation</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Mon-Fri: 9:00am to 5:00pm</div>
                <div>Sat: by appointment only</div>
                <div>Sun: closed</div>
              </div>
            </div>
            
            <div className="pt-4">
              <Link href="/contact" className="block">
                <Button className="bg-amber-500 hover:bg-amber-600 w-full">Book a Consultation</Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-semibold">2025 Brochure</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <Image
                    src="/images/products/thisisafrica-pdf.png"
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
                <a 
                  href="/pdfs/products/Brochure-2025-Web.pdf"
                  download
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white rounded-md transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-400 text-sm">© {new Date().getFullYear()} This is Africa. All rights reserved.</p>
              <p className="text-gray-400 text-sm mt-2 max-w-lg">
                This is Africa is an accredited member of the Council of Australian Tour Operators and an approved licensed wholesaler with the Australian Federation of Travel Agents.
              </p>
            </div>
            <div className="flex space-x-6">
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
