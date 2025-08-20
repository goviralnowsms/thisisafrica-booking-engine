"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Phone, Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourCode: '',
    tourName: '',
    message: '',
    travelers: '2',
    preferredDate: '',
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Pre-fill form if tour details or brochure request are provided
  useEffect(() => {
    const tourCode = searchParams.get('tour')
    const tourName = searchParams.get('name')
    const subject = searchParams.get('subject')
    
    if (tourCode || tourName) {
      setFormData(prev => ({
        ...prev,
        tourCode: tourCode || '',
        tourName: decodeURIComponent(tourName || ''),
        message: tourCode 
          ? `I am interested in getting a quote for the tour: ${decodeURIComponent(tourName || tourCode)}\n\nPlease provide pricing and availability details.`
          : ''
      }))
    } else if (subject === 'brochure-request') {
      setFormData(prev => ({
        ...prev,
        message: 'Please send me a printed brochure.\n\nI would like to receive your latest travel brochure with details of all your African tours and packages.'
      }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions and Privacy Policy to continue.')
      return
    }
    
    setIsSubmitting(true)

    try {
      // In a real application, you would send this to an API endpoint
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h1>
              <p className="text-gray-600">
                Thank you for your inquiry. Our travel experts will review your request and get back to you within 24 hours with a personalized quote.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>• Our team will review your requirements</div>
                <div>• We'll check availability for your preferred dates</div>
                <div>• You'll receive a detailed quote within 24 hours</div>
                <div>• We'll follow up to discuss your perfect African adventure</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/booking">
                <Button variant="outline">Browse More Tours</Button>
              </Link>
              <Link href="/">
                <Button className="bg-amber-500 hover:bg-amber-600">Return Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 ml-48">
            <Link href="/booking" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Get a Quote</h1>
              <p className="text-gray-600">Tell us about your dream African adventure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formData.tourName && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-semibold text-amber-800 mb-1">Tour Request</h3>
                      <p className="text-amber-700">{formData.tourName}</p>
                      {formData.tourCode && (
                        <p className="text-sm text-amber-600">Code: {formData.tourCode}</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="+61 XXX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Travelers
                      </label>
                      <select
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 People</option>
                        <option value="3">3 People</option>
                        <option value="4">4 People</option>
                        <option value="5">5 People</option>
                        <option value="6+">6+ People</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Travel Date
                      </label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Tell us about your dream African adventure. Include any special requirements, preferences, or questions you have."
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                      * I agree with{' '}
                      <Link href="/terms-conditions" target="_blank" className="text-amber-600 hover:text-amber-700 underline">
                        Terms & Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-amber-600 hover:text-amber-700 underline">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3"
                  >
                    {isSubmitting ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Quote Request
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4 text-amber-600">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-gray-600">+61 2 9664 9187</p>
                      <p className="text-sm text-gray-500">Mon-Fri: 9:00am-5:00pm | Sat: by appointment</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">sales@thisisafrica.com.au</p>
                      <p className="text-sm text-gray-500">We respond within 24 hours Mon-Fri</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-500 mt-1" />
                    <div>
                      <p className="font-semibold">Office</p>
                      <p className="text-gray-600">51 Frenchmans Rd<br />Randwick NSW 2031</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Why Get a Quote?</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• Personalized itinerary recommendations</div>
                    <div>• Best available pricing and deals</div>
                    <div>• Expert advice from Africa specialists</div>
                    <div>• Flexible payment options</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}