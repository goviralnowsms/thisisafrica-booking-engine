"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown, Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-36 md:w-48">
              <Image src="/images/this-is-africa-logo.png" alt="This is Africa Logo" fill className="object-contain" />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
              >
                Destinations <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/destinations/south-africa" className="w-full">
                    South Africa
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/destinations/kenya" className="w-full">
                    Kenya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/destinations/tanzania" className="w-full">
                    Tanzania
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/destinations/botswana" className="w-full">
                    Botswana
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/destinations/zimbabwe" className="w-full">
                    Zimbabwe
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/destinations/all" className="w-full">
                    View All
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
              >
                Packages <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/packages/all-inclusive" className="w-full">
                    All Inclusive
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/packages/honeymoon" className="w-full">
                    Honeymoon
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/packages/fly-in-safaris" className="w-full">
                    Fly-in Safaris
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/packages/family" className="w-full">
                    Family Packages
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/packages/all" className="w-full">
                    View All
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/about"
              className={`font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
            >
              About
            </Link>

            <Link
              href="/visas"
              className={`font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
            >
              Visas
            </Link>

            <Link
              href="/contact"
              className={`font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/my-bookings"
              className={`font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-amber-500 transition-colors`}
            >
              My Bookings
            </Link>
            <Button className="bg-amber-500 hover:bg-amber-600">Book Now</Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className={`h-6 w-6 ${isScrolled ? "text-gray-800" : "text-white"}`} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <div className="relative h-12 w-36">
                    <Image
                      src="/images/this-is-africa-logo.png"
                      alt="This is Africa Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="font-medium text-lg">
                  Home
                </Link>
                <div className="space-y-2">
                  <div className="font-medium text-lg">Destinations</div>
                  <div className="pl-4 space-y-2">
                    <Link href="/destinations/south-africa" className="block text-gray-600">
                      South Africa
                    </Link>
                    <Link href="/destinations/kenya" className="block text-gray-600">
                      Kenya
                    </Link>
                    <Link href="/destinations/tanzania" className="block text-gray-600">
                      Tanzania
                    </Link>
                    <Link href="/destinations/all" className="block text-amber-500">
                      View All
                    </Link>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-lg">Packages</div>
                  <div className="pl-4 space-y-2">
                    <Link href="/packages/all-inclusive" className="block text-gray-600">
                      All Inclusive
                    </Link>
                    <Link href="/packages/honeymoon" className="block text-gray-600">
                      Honeymoon
                    </Link>
                    <Link href="/packages/fly-in-safaris" className="block text-gray-600">
                      Fly-in Safaris
                    </Link>
                    <Link href="/packages/all" className="block text-amber-500">
                      View All
                    </Link>
                  </div>
                </div>
                <Link href="/about" className="font-medium text-lg">
                  About
                </Link>
                <Link href="/visas" className="font-medium text-lg">
                  Visas
                </Link>
                <Link href="/contact" className="font-medium text-lg">
                  Contact
                </Link>
                <div className="pt-4">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600">Book Now</Button>
                </div>
                <div className="flex space-x-4 pt-4">
                  <Link href="#" className="text-gray-600 hover:text-amber-500">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-amber-500">
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-amber-500">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
