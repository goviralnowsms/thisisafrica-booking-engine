"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, ChevronDown, Phone } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false)
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false)
  const pathname = usePathname()

  // Check if current page has a hero section that might need transparent header
  const hasHeroSection = pathname === "/" || pathname.startsWith("/group-tours") || 
                        pathname.startsWith("/packages") || pathname.startsWith("/accommodation") ||
                        pathname.startsWith("/rail") || pathname.startsWith("/cruise") ||
                        pathname.startsWith("/tailor-made")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !hasHeroSection 
          ? "bg-white shadow-md" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/products/this-is-africa-logo.png"
              alt="This is Africa"
              width={120}
              height={40}
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium transition-colors ${
                isScrolled || !hasHeroSection 
                  ? "text-gray-700 hover:text-amber-500" 
                  : "text-white hover:text-amber-300"
              }`}
            >
              Home
            </Link>
            {/* About Dropdown */}
            <div className="relative group">
              <button
                className={`font-medium transition-colors flex items-center gap-1 ${
                  isScrolled || !hasHeroSection 
                    ? "text-gray-700 hover:text-amber-500" 
                    : "text-white hover:text-amber-300"
                }`}
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                About
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 transition-all duration-200 ${
                  isAboutDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                <Link
                  href="/about"
                  className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/testimonials"
                  className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  href="/employment"
                  className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  Employment
                </Link>
              </div>
            </div>
            <Link
              href="/insurance"
              className={`font-medium transition-colors ${
                isScrolled || !hasHeroSection 
                  ? "text-gray-700 hover:text-amber-500" 
                  : "text-white hover:text-amber-300"
              }`}
            >
              Insurance
            </Link>
            <a
              href="https://cibtvisas.com.au/?login=thisisafrica"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-medium transition-colors ${
                isScrolled || !hasHeroSection 
                  ? "text-gray-700 hover:text-amber-500" 
                  : "text-white hover:text-amber-300"
              }`}
            >
              Visas
            </a>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${
                isScrolled || !hasHeroSection 
                  ? "text-gray-700 hover:text-amber-500" 
                  : "text-white hover:text-amber-300"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/my-bookings"
              className={`font-medium transition-colors ${
                isScrolled || !hasHeroSection 
                  ? "text-gray-700 hover:text-amber-500" 
                  : "text-white hover:text-amber-300"
              }`}
            >
              My Bookings
            </Link>
          </nav>

          {/* Desktop Phone and Book Now Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href="tel:+61296649187" 
              className={`flex items-center gap-2 font-medium transition-colors ${
                isScrolled || !hasHeroSection 
                  ? "text-gray-700 hover:text-amber-500" 
                  : "text-white hover:text-amber-300"
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>+61 2 9664 9187</span>
            </a>
            <Link href="/booking">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">Book now</Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/booking">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3">
                Book now
              </Button>
            </Link>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    isScrolled || !hasHeroSection 
                      ? "text-gray-700 hover:text-amber-500" 
                      : "text-white hover:text-amber-300"
                  }`}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                
                {/* About Dropdown */}
                <div>
                  <button
                    className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors flex items-center justify-between w-full"
                    onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                  >
                    About
                    <ChevronDown className={`h-4 w-4 transition-transform ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Items */}
                  <div className={`ml-4 mt-2 space-y-2 ${isMobileAboutOpen ? 'block' : 'hidden'}`}>
                    <Link
                      href="/about"
                      className="block text-gray-700 hover:text-amber-500 transition-colors py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      href="/testimonials"
                      className="block text-gray-700 hover:text-amber-500 transition-colors py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Testimonials
                    </Link>
                    <Link
                      href="/employment"
                      className="block text-gray-700 hover:text-amber-500 transition-colors py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Employment
                    </Link>
                  </div>
                </div>
                
                <Link
                  href="/insurance"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Insurance
                </Link>
                <a
                  href="https://cibtvisas.com.au/?login=thisisafrica"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Visas
                </a>
                <Link
                  href="/contact"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/my-bookings"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white mt-4 w-full">Book now</Button>
                </Link>
              </div>
            </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
