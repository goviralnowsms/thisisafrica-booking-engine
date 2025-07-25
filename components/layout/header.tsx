"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/this-is-africa-logo.png"
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
                isScrolled ? "text-gray-900 hover:text-amber-500" : "text-white hover:text-amber-300"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`font-medium transition-colors ${
                isScrolled ? "text-gray-900 hover:text-amber-500" : "text-white hover:text-amber-300"
              }`}
            >
              About
            </Link>
            <Link
              href="/visas"
              className={`font-medium transition-colors ${
                isScrolled ? "text-gray-900 hover:text-amber-500" : "text-white hover:text-amber-300"
              }`}
            >
              Visas
            </Link>
            <Link
              href="/contact"
              className={`font-medium transition-colors ${
                isScrolled ? "text-gray-900 hover:text-amber-500" : "text-white hover:text-amber-300"
              }`}
            >
              Contact
            </Link>
            <Link
              href="/my-bookings"
              className={`font-medium transition-colors ${
                isScrolled ? "text-gray-900 hover:text-amber-500" : "text-white hover:text-amber-300"
              }`}
            >
              My Bookings
            </Link>
          </nav>

          {/* Book Now Button */}
          <div className="hidden lg:block">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">Book Now</Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${isScrolled ? "text-gray-900" : "text-white"}`}
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
                <Link
                  href="/about"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/visas"
                  className="text-lg font-medium text-gray-900 hover:text-amber-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Visas
                </Link>
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
                <Button className="bg-amber-500 hover:bg-amber-600 text-white mt-4">Book Now</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
