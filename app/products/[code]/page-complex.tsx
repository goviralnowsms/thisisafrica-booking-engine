"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductDetails {
  id: string
  code: string
  name: string
  description: string
  supplier: string
  supplierName: string
  duration: string
  location?: string
  image: string | null
  rates: Array<{
    currency: string
    singleRate: number
    doubleRate: number
    twinRate: number
    dateRange?: string
    twinRateFormatted?: string
    dateFrom?: string
    dateTo?: string
    rateName?: string
  }>
  inclusions: string[]
  exclusions: string[]
  itinerary?: string
  notes?: Array<{
    category: string
    text: string
  }>
  content?: {
    introduction?: string
    details?: string
    inclusions?: string
    highlights?: string
    exclusions?: string
    terms?: string
  }
  localAssets?: {
    images: Array<{
      url: string
      type: string
      category: string
      originalName: string
      status?: string
    }>
    pdfs: Array<{
      url: string
      name: string
      originalName: string
      status: string
    }>
  }
}

export default function ProductDetailsPage() {
  const params = useParams()
  const productCode = params.code as string
  
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  // Get product images from localAssets or fallback to mock images
  const getProductImages = () => {
    if (product?.localAssets?.images && product.localAssets.images.length > 0) {
      return product.localAssets.images.map(img => img.url)
    }
    // Fallback to mock images
    return [
      "/images/safari-lion.png",
      "/images/luxury-accommodation.png", 
      "/images/rail-journey.png"
    ]
  }
  
  const productImages = getProductImages()

  // Mark as client-side after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-advance carousel - only on client side after hydration
  useEffect(() => {
    if (isClient && productImages.length > 1) {
      const timer = setInterval(() => {
        setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
      }, 5000) // Change image every 5 seconds
      
      return () => clearInterval(timer)
    }
  }, [isClient, productImages.length, product]) // Include product to ensure it runs after data loads

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tourplan/product/${productCode}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.data)
        } else {
          setError(data.message || "Failed to load product details")
        }
      } catch (err) {
        setError("Failed to load product details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (productCode) {
      fetchProductDetails()
    }
  }, [productCode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-48 w-full mb-4" />
            </div>
            <div>
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <p className="text-red-600 mb-4">{error || "Product not found"}</p>
              <Link href="/booking">
                <Button>Back to Search</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/booking" className="text-gray-500 hover:text-gray-700">Tours</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner Section */}
      <section className="relative h-[70vh] md:h-[80vh] bg-gray-900 overflow-hidden">
        <div className="relative h-full">
          <Image
            src={productImages[selectedImageIndex]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
          
          {/* Auto-advancing carousel */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % productImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110 z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Enhanced Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === selectedImageIndex 
                        ? "bg-white scale-125" 
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              {/* Tour badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-amber-500 text-white border-0 px-3 py-1 hover:bg-amber-500">
                  ⭐ Premium Experience
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm hover:bg-white/25">
                  📍 {product.location || 'African Adventure'}
                </Badge>
                {product.rates && product.rates.length > 0 && (
                  <Badge className="bg-green-600 text-white border-0 hover:bg-green-600">
                    💰 From {(() => {
                      const rate = product.rates[0];
                      if (rate?.twinRateFormatted) {
                        return rate.twinRateFormatted;
                      } else if (rate?.twinRate) {
                        return `${rate.currency || 'AUD'} $${rate.twinRate.toLocaleString()}`;
                      }
                      return 'Request Quote';
                    })()}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90 mb-6">
                <span className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  {product.duration || `${product.periods || 1} days`}
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Small Group Tour
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  {product.supplierName || product.supplier || 'Expert Local Guides'}
                </span>
              </div>
              
              {/* Quick description */}
              <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                {product.description || "Experience the magic of Africa with our expertly crafted safari adventure. Witness incredible wildlife, stunning landscapes, and create memories that will last a lifetime."}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 text-lg"
                  onClick={() => {
                    if (isClient) {
                      document.getElementById('booking-section')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }
                  }}
                >
                  Book This Adventure
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-black backdrop-blur-sm bg-white/10 px-8 py-3 text-lg"
                  onClick={() => {
                    if (isClient) {
                      document.getElementById('details-section')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="details-section" className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
                  <TabsTrigger value="dates">Dates & Prices</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                      {/* Use structured content first, then fallback */}
                      {product.content?.introduction ? (
                        <div className="whitespace-pre-wrap">{product.content.introduction}</div>
                      ) : (
                        <>
                          <p>{product.description}</p>
                          {product.notes?.find(n => n.category === 'PII')?.text && (
                            <div className="mt-4">
                              <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                              <div className="whitespace-pre-wrap">{product.notes.find(n => n.category === 'PII')?.text}</div>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Itinerary</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none">
                      {product.content?.details ? (
                        <div className="whitespace-pre-wrap">{product.content.details}</div>
                      ) : product.itinerary ? (
                        <div className="whitespace-pre-wrap">{product.itinerary}</div>
                      ) : product.notes?.find(n => ['DTL', 'PDW', 'DES'].includes(n.category))?.text ? (
                        <div className="whitespace-pre-wrap">{product.notes.find(n => ['DTL', 'PDW', 'DES'].includes(n.category))?.text}</div>
                      ) : (
                        <p>Detailed itinerary available upon request.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="inclusions" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>What's Included</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {product.content?.inclusions ? (
                        <div className="whitespace-pre-wrap prose prose-sm max-w-none">{product.content.inclusions}</div>
                      ) : product.inclusions && product.inclusions.length > 0 ? (
                        <ul className="space-y-2">
                          {product.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : product.notes?.find(n => ['INC', 'INE'].includes(n.category))?.text ? (
                        <div className="whitespace-pre-wrap prose prose-sm max-w-none">{product.notes.find(n => ['INC', 'INE'].includes(n.category))?.text}</div>
                      ) : (
                        <p>Please contact us for detailed inclusions.</p>
                      )}
                      
                      {/* Show exclusions if available */}
                      {(product.content?.exclusions || (product.exclusions && product.exclusions.length > 0) || product.notes?.find(n => n.category === 'EXC')?.text) && (
                        <>
                          <h4 className="font-semibold mt-6 mb-2">Not Included</h4>
                          {product.content?.exclusions ? (
                            <div className="whitespace-pre-wrap prose prose-sm max-w-none">{product.content.exclusions}</div>
                          ) : product.exclusions && product.exclusions.length > 0 ? (
                            <ul className="space-y-2">
                              {product.exclusions.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-red-600 mr-2">✗</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : product.notes?.find(n => n.category === 'EXC')?.text ? (
                            <div className="whitespace-pre-wrap prose prose-sm max-w-none">{product.notes.find(n => n.category === 'EXC')?.text}</div>
                          ) : null}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="dates" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Dates & Pricing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Date Range</th>
                              <th className="text-right py-2">Single</th>
                              <th className="text-right py-2">Double/Twin</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.rates.map((rate, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-3">
                                  {rate.dateRange || (rate.dateFrom && rate.dateTo ? (
                                    `${new Date(rate.dateFrom).toLocaleDateString()} - ${new Date(rate.dateTo).toLocaleDateString()}`
                                  ) : "Year-round")}
                                </td>
                                <td className="text-right font-semibold">
                                  {rate.singleRate ? `${rate.currency || 'AUD'} $${rate.singleRate.toLocaleString()}` : 'POA'}
                                </td>
                                <td className="text-right font-semibold">
                                  {rate.twinRateFormatted || (rate.twinRate ? `${rate.currency || 'AUD'} $${rate.twinRate.toLocaleString()}` : 'POA')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              {/* Map Section */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Tour Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Interactive map will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Booking Widget */}
            <div>
              <Card id="booking-section" className="sticky top-4 border-2 border-amber-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="text-xl text-center">🎯 Book This Adventure</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Pricing Display */}
                    <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">🏷️ Starting from</p>
                      <p className="text-3xl font-bold text-green-700">
                        {(() => {
                          const rate = product.rates[0];
                          if (rate?.twinRateFormatted) {
                            return rate.twinRateFormatted;
                          } else if (rate?.twinRate) {
                            return `${rate.currency || 'AUD'} $${rate.twinRate.toLocaleString()}`;
                          } else if (rate?.singleRate) {
                            return `${rate.currency || 'AUD'} $${rate.singleRate.toLocaleString()}`;
                          }
                          return 'Contact for Pricing';
                        })()}
                      </p>
                      <p className="text-sm text-gray-600">per person twin share</p>
                      {product.rates && product.rates.length > 1 && (
                        <p className="text-xs text-green-600 mt-1">
                          💰 Multiple dates available - prices may vary
                        </p>
                      )}
                    </div>
                    
                    {/* Key Selling Points */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        ✨ What's Included
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-green-600">✓</span>
                          <span>Expert local guides</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-green-600">✓</span>
                          <span>All park entrance fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-green-600">✓</span>
                          <span>4WD safari vehicle</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <span className="text-green-600">✓</span>
                          <span>Small group experience</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Link href={`/booking/create?tourId=${product.code}`}>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 text-lg shadow-lg">
                          🚀 Book This Adventure Now
                        </Button>
                      </Link>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* PDF Downloads */}
                        {product.localAssets?.pdfs && product.localAssets.pdfs.length > 0 ? (
                          product.localAssets.pdfs.map((pdf, index) => (
                            <Button 
                              key={index}
                              variant="outline" 
                              size="sm"
                              className="border-amber-200 hover:bg-amber-50"
                              asChild
                            >
                              <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </a>
                            </Button>
                          ))
                        ) : (
                          <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50">
                            <Download className="h-4 w-4 mr-1" />
                            PDF Guide
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                          💬 Get Quote
                        </Button>
                      </div>
                      
                      {/* Urgency/Trust signals */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-blue-800">
                          🔥 <strong>Popular Choice!</strong> 87% of travelers recommend this tour
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 text-sm text-gray-600">
                      <p className="font-semibold mb-2">Need Help?</p>
                      <p>Call us: 1300 55 44 01</p>
                      <p>Email: info@thisisafrica.com.au</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}