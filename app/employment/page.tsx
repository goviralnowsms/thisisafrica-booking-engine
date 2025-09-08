"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Calendar, DollarSign, CheckCircle, Mail, Users, GraduationCap, Globe, Heart } from "lucide-react"

export default function EmploymentPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <Image
          src="/images/products/employment-banner.jpg"
          alt="Employment at This is Africa - Join Our Team"
          fill
          priority
          className="object-cover"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60">
          <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Employment</h1>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              Join our passionate team of African travel specialists
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mt-4">
              Experience the rewarding career of sharing Africa's magic with fellow travelers while building your expertise in specialized travel consulting
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Current Positions */}
            <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-6 mb-12">
              <h2 className="text-2xl font-bold text-amber-900 mb-2">
                Currently seeking Full Time and Part Time Travel Consultants
              </h2>
            </div>

            {/* Introduction */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Have you been to Africa and are you passionate about travel?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-8">
                This is Africa is a rapidly growing wholesale and retail travel company which specialises in 
                selling tailor-made and package tours to Africa. To meet the demands of our growing business 
                we are regularly seeking staff members to join our friendly team. Our office is situated in 
                Randwick NSW and is close to public transport links.
              </p>
            </div>

            {/* Why Choose This Career */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Why Choose a Career in African Travel?
              </h2>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Turn your African travel experiences into meaningful career expertise
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Work with clients who share your passion for adventure and discovery
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Continuous learning through educational trips and industry training
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Build lasting relationships with suppliers and travel partners across Africa
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Contribute to sustainable tourism that benefits local African communities
                    </span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Develop specialized skills in luxury travel, safari planning, and cultural experiences
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Reservations Consultant</h3>
              <p className="text-gray-700 leading-relaxed">
                Consultants are predominately advising travel agents and the general public about our products 
                and making reservations. Good writing skills and attention to detail are required when compiling 
                quotes and itineraries for clients. Our team environment allows you plenty of opportunity to 
                expand your marketing, product sourcing and airline ticketing (Galileo) skills. Experience in 
                client management and general office skills, such as answering phones and using Microsoft Office 
                is required. If you love Africa and have the drive and passion to inspire others to experience 
                it too, then we would like to hear from you.
              </p>
            </div>

            {/* Requirements */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The successful candidate must have:</h3>
              <div className="bg-white rounded-lg shadow-md p-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      <strong>Travelled to Africa</strong> (please do not apply if you haven't)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Excellent Galileo and Smartpoint skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Excellent writing skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Enthusiasm and a good work ethic</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Travel industry experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Past history of consistent long periods of employment</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Package */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-8 w-8 text-amber-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-900">Package</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Good salary + super
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    4 weeks annual leave
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Regular educational leave to Africa
                  </li>
                </ul>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-amber-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-900">Hours</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Monday to Friday
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Tuesday to Saturday (every third week)
                  </li>
                </ul>
              </div>
            </div>

            {/* Career Development & Culture */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Career Development */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-8 w-8 text-amber-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-900">Career Development</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Advanced Galileo and booking system training
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Marketing and product sourcing skill development
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    First-hand destination knowledge through educational trips
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Airline ticketing and industry certification opportunities
                  </li>
                </ul>
              </div>

              {/* Team & Culture */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-amber-500 mr-3" />
                  <h4 className="text-xl font-bold text-gray-900">Team & Culture</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Friendly, collaborative team environment
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Share your passion for Africa with like-minded colleagues
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Contribute to inspiring life-changing travel experiences
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                    Build expertise in luxury and adventure travel markets
                  </li>
                </ul>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-100 rounded-lg p-6 mb-12 flex items-center">
              <MapPin className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
              <p className="text-gray-700">
                <strong>Office Location:</strong> Randwick, NSW - Close to public transport links
              </p>
            </div>

            {/* Application CTA */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg p-10 text-center shadow-lg">
              <h3 className="text-3xl font-bold mb-2">Start Your African Travel Career</h3>
              <p className="text-xl mb-4 text-amber-100">
                Join the leading specialists in African adventure travel
              </p>
              <p className="mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Take the next step in your travel career by joining our passionate team. Send us your resume, 
                covering letter, and a list of African countries you've experienced firsthand.
              </p>
              <a 
                href="mailto:employment@thisisafrica.com.au"
                className="inline-flex items-center bg-white text-amber-600 hover:bg-gray-50 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Mail className="h-6 w-6 mr-3" />
                Apply Now - employment@thisisafrica.com.au
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Why Work at This is Africa?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Growing Company</h3>
                <p className="text-gray-600">
                  Be part of a rapidly expanding wholesale and retail travel company
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Africa Expertise</h3>
                <p className="text-gray-600">
                  Work with specialists in African travel and share your passion
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Educational Travel</h3>
                <p className="text-gray-600">
                  Regular opportunities to experience Africa firsthand
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}