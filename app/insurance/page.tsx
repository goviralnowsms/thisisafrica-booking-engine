"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Phone, Mail, CheckCircle, Star, AlertTriangle } from "lucide-react"

export default function InsurancePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/insurance-hero.jpg"
          alt="Travel Insurance - Peace of Mind for Your African Adventure"
          fill
          priority
          className="object-cover"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Travel Insurance</h1>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              Protect your African adventure with comprehensive travel insurance
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Special Offer */}
            <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-6 mb-12 text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-amber-500 mr-3" />
                <h2 className="text-2xl font-bold text-amber-900">
                  Exclusive 20% Discount for This is Africa Customers
                </h2>
              </div>
              <p className="text-amber-800 text-lg">
                Book through us and automatically receive a 20% discount on your travel insurance. 
                Save hundreds of dollars with our simple online process!
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <p className="text-gray-700 leading-relaxed text-lg mb-8">
                This is Africa offers travel insurance through nib and if you book through us you will 
                automatically receive a 20% discount. The online process is simple and you can save up 
                to hundreds of dollars!
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Nib understands the importance of helping people access insurance products and services 
                suitable for every travel adventure; from planning and experiencing, to returning home safely.
              </p>
            </div>

            {/* Coverage Options */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Coverage</h3>
              <div className="bg-white rounded-lg shadow-md p-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  You can choose the plan that you think best suits the kind of holiday you're taking 
                  and the level of cover you need – from basic cover through to comprehensive, multi-trip, 
                  domestic and international plans.
                </p>
                
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Coverage Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Having your trip or flights cancelled</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accidental lost luggage or having it stolen</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Suffering a medical or dental emergency overseas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Getting sick or injured overseas, even when playing amateur sports, and more
                    </span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Medical Conditions:</strong> nib travel insurance includes automatic cover for a 
                    range of existing medical conditions and the ability to apply to cover some other conditions 
                    for an additional premium (which may be significant) and increased excess.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Support */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">24/7 Emergency Medical Support</h3>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-start mb-6">
                  <Shield className="h-8 w-8 text-amber-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Our 24/7 Emergency Assistance team provides emergency assistance for our customers 
                      worldwide. Our experienced specialists can be contacted by telephone 24 hours a day, 
                      7 days a week to help you in the event of an emergency and to liaise on your behalf 
                      with our in-house medical team.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-6 w-6 text-amber-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Within Australia</p>
                      <p className="text-gray-700">1300 555 019</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="h-6 w-6 text-amber-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Outside Australia</p>
                      <p className="text-gray-700">+61 3 8523 2800</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg md:col-span-2">
                    <Mail className="h-6 w-6 text-amber-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">Email Support</p>
                      <a href="mailto:travelassist@nib.com.au" className="text-amber-600 hover:text-amber-700">
                        travelassist@nib.com.au
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Get a Quote */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Your Quote</h3>
              <div className="bg-amber-500 text-white rounded-lg p-8">
                <h4 className="text-xl font-bold mb-4">For a quote, please follow these steps:</h4>
                <ol className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="bg-white text-amber-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Click on the logo below and follow the link to the website (some computers require you to right mouse click then select 'open hyperlink')</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-white text-amber-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Enter your information for a quick quote</span>
                  </li>
                </ol>
                
                <div className="text-center">
                  <a 
                    href="https://www.nib.com.au/travel-insurance/Turnstile/PartnerLink?partnerCode=10099&source=websale/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-6"
                  >
                    <Image
                      src="/images/products/nib_logo.png"
                      alt="nib Travel Insurance"
                      width={200}
                      height={80}
                      className="mx-auto hover:opacity-90 transition-opacity"
                    />
                  </a>
                  <a 
                    href="https://www.nib.com.au/travel-insurance/Turnstile/PartnerLink?partnerCode=10099&source=websale/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="lg" 
                      className="bg-white text-amber-600 hover:bg-gray-100 font-bold px-8 py-4"
                    >
                      Get Your Quote with nib
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-gray-100 rounded-lg p-6">
              <div className="flex items-start mb-4">
                <AlertTriangle className="h-6 w-6 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                <h4 className="text-lg font-semibold text-gray-900">Important Information</h4>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                This is Africa Pty Ltd, ABN 32606195895 is a distributor of nib Travel Services (Australia) 
                Pty Ltd (nib), ABN 81 115 932 173, AFSL 308461 and receives a commission for nib products 
                purchased through This is Africa Pty Ltd. This is Africa Pty Ltd acts as an agent for nib 
                and not as your agent. This is Africa Pty Ltd cannot give advice about nib products, and 
                any factual information provided is not intended to imply a recommendation or opinion about 
                nib products. Before you buy, please read the Product Disclosure Statement, Financial Services 
                Guide and Target Market Determination (TMD) available from us. If you have a complaint about 
                a nib product, see the Product Disclosure Statement for the complaints process. This insurance 
                is underwritten by Pacific International Insurance Pty Ltd, ABN 83 169 311 193.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Journey?</h2>
            <p className="text-gray-600 mb-8">
              Don't let unexpected events ruin your African adventure. Get comprehensive travel 
              insurance with our exclusive 20% discount.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.nib.com.au/travel-insurance/Turnstile/PartnerLink?partnerCode=10099&source=websale/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Get Quote Now
                </Button>
              </a>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}