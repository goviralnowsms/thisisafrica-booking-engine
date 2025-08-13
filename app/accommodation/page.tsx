"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Bed, Star, MapPin } from "lucide-react"

export default function AccommodationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/accomm-hero.jpg"
          alt="Luxury safari lodge overlooking African wilderness"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Accommodation</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-6">
              Discover exceptional lodges, camps, and hotels across Africa
            </p>
            <p className="text-lg text-white/80 max-w-2xl">
              From luxury safari camps to boutique hotels, find the perfect accommodation for your African adventure
            </p>
          </div>
        </div>
      </section>

      {/* Construction Notice Section */}
      <section className="bg-orange-50 border-t-4 border-orange-500 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-orange-800 mb-4">This area is under construction</h2>
            <p className="text-xl text-orange-700 mb-6">Please call back soon.</p>
          </div>
        </div>
      </section>

      {/* Accommodation Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Scattered throughout Africa's parks and reserves are world class game lodges and permanent tented safari camps.
              </p>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Typically, these properties include all meals and guided game activities. They are well located in regions heavily populated with wildlife and the accommodation is often African inspired. Game lodges offer accommodation ranging from hotel-like rooms, to thatched roofed chalets and cottages, with balconies, en-suites and conveniences akin to a hotel. Luxury lodges will often feature private plunge pools, bathrooms with picture windows overlooking the bush and even treehouse sleep outs. Communal areas often include swimming pools, extensive decked areas with views of waterholes frequented by animals, spa treatment centres and curio shops.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Tented camps revisit the era of the grand tour, when guests stayed under permanent canvas-sided tents. Tented camps are either immersed in the bush, or overlook waterholes with a central focus on wildlife viewing. Tented camps offer most, if not all, of the comforts and conveniences of a lodge with social areas often reflecting bygone days of safari. Your tented room reflects that of a hotel room with an en-suite bathroom, mosquito netted beds and permanent lighting. Tented camps tend to be social affairs offering pre-dinner drinks, communal dining and post-dinner fire pit conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Types Section */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">African Accommodation Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bed className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Game Lodges</h3>
                <p className="text-gray-600">
                  Hotel-like rooms to thatched chalets with en-suites, balconies, and luxury amenities like private pools and spa centres
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Tented Camps</h3>
                <p className="text-gray-600">
                  Permanent canvas-sided tents with hotel room comforts, en-suite bathrooms, and social dining experiences
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Prime Wildlife Locations</h3>
                <p className="text-gray-600">Properties strategically located near waterholes and in regions with high wildlife populations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url("/images/products/rsz_leopard-in-tree.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need accommodation assistance?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Our accommodation experts are here to help you find the perfect lodge, tented camp, or hotel for your African adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/contact?subject=accommodation-inquiry"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
            >
              <span className="mr-2">📧</span>
              Contact Us
            </Link>
            <a
              href="/pdfs/products/Brochure-2025-Web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors"
            >
              <span className="mr-2">📥</span>
              Download Brochure
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}