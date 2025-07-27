"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Users, Download, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// CSS for tour content styling
const tourContentStyles = `
  .tour-content h3 {
    color: #d97706 !important;
    font-weight: bold !important;
    font-size: 1.125rem !important;
    margin-top: 1.5rem !important;
    margin-bottom: 0.75rem !important;
  }
  .tour-content h4 {
    color: #d97706 !important;
    font-weight: 600 !important;
    margin-top: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }
  .tour-content p {
    margin-bottom: 0.75rem !important;
    line-height: 1.6 !important;
  }
`

interface ProductDetails {
  id: string
  code: string
  name: string
  description?: string
  supplier?: string
  supplierName?: string
  duration?: string
  periods?: number
  location?: string
  rates?: Array<{
    currency?: string
    singleRate?: number
    twinRate?: string | number
    twinRateTotal?: number
    twinRateFormatted?: string
    dateRange?: string
  }>
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
    mapImage?: string
  }
  localAssets?: {
    images: Array<{
      url: string
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
  const [mapImage, setMapImage] = useState<string | null>(null)

  // Check for local map image
  useEffect(() => {
    const checkForMap = async () => {
      if (!productCode || !product) return;
      
      // Extract country from product code/URL - including airport codes
      const codeCountryMap: { [key: string]: string } = {
        'nbo': '/images/maps/kenya-tanzania-uganda.png', // Nairobi (Kenya)
        'kenya': '/images/maps/kenya-tanzania-uganda.png',
        'dar': '/images/maps/kenya-tanzania-uganda.png', // Dar es Salaam (Tanzania)
        'jro': '/images/maps/kenya-tanzania-uganda.png', // Kilimanjaro (Tanzania)
        'tnz': '/images/maps/kenya-tanzania-uganda.png', // Tanzania
        'tanzania': '/images/maps/kenya-tanzania-uganda.png',
        'uganda': '/images/maps/kenya-tanzania-uganda.png',
        'ebb': '/images/maps/kenya-tanzania-uganda.png', // Entebbe (Uganda)
        'gbe': '/images/maps/botswana-zimbabwe.png', // Gaborone (Botswana)
        'mub': '/images/maps/botswana-zimbabwe.png', // Maun (Botswana)
        'botswana': '/images/maps/botswana-zimbabwe.png',
        'wdh': '/images/maps/namibia.png', // Windhoek (Namibia)
        'namibia': '/images/maps/namibia.png',
        'cpt': '/images/maps/south-africa-namibia-botswana-zimbabwe.png', // Cape Town
        'jnb': '/images/maps/south-africa-namibia-botswana-zimbabwe.png', // Johannesburg
        'south-africa': '/images/maps/south-africa-namibia-botswana-zimbabwe.png',
        'hre': '/images/maps/botswana-zimbabwe.png', // Harare (Zimbabwe)
        'vfa': '/images/maps/botswana-vic-falls.png', // Victoria Falls
        'zimbabwe': '/images/maps/botswana-zimbabwe.png',
        'lun': '/images/maps/botswana-namibia-zambia-zimbabwe.png', // Lusaka (Zambia)
        'zambia': '/images/maps/botswana-namibia-zambia-zimbabwe.png',
      };
      
      // First, try to find country/airport code in the product code URL
      let mapFromCode = null;
      const productCodeLower = productCode.toLowerCase();
      for (const [code, mapPath] of Object.entries(codeCountryMap)) {
        if (productCodeLower.includes(code)) {
          mapFromCode = mapPath;
          break;
        }
      }
      
      // Get destination from product data
      const destination = product.destination?.toLowerCase() || '';
      const country = product.country?.toLowerCase() || '';
      
      // Try different map file formats
      const mapFormats = [
        // First priority: maps that include the product code in filename (both cases)
        `/images/maps/kenya-tanzania-uganda-${productCode}.png`,
        `/images/maps/kenya-tanzania-uganda-${productCode.toUpperCase()}.png`,
        `/images/maps/botswana-zimbabwe-${productCode}.png`,
        `/images/maps/botswana-zimbabwe-${productCode.toUpperCase()}.png`,
        `/images/maps/namibia-${productCode}.png`,
        `/images/maps/namibia-${productCode.toUpperCase()}.png`,
        `/images/maps/south-africa-${productCode}.png`,
        `/images/maps/south-africa-${productCode.toUpperCase()}.png`,
        
        // Second priority: country extracted from product code
        mapFromCode,
        
        // Try exact product code match
        `/images/maps/${productCode}.png`,
        `/images/maps/${productCode}.jpg`,
        `/images/maps/${productCode.toLowerCase()}.png`,
        
        // Try destination-based matches
        destination.includes('kenya') && '/images/maps/kenya-tanzania-uganda.png',
        destination.includes('tanzania') && '/images/maps/kenya-tanzania-uganda.png',
        destination.includes('uganda') && '/images/maps/kenya-tanzania-uganda.png',
        destination.includes('botswana') && '/images/maps/botswana-zimbabwe.png',
        destination.includes('namibia') && '/images/maps/namibia.png',
        destination.includes('south africa') && '/images/maps/south-africa-namibia-botswana-zimbabwe.png',
        destination.includes('zimbabwe') && '/images/maps/botswana-zimbabwe.png',
        destination.includes('victoria falls') && '/images/maps/botswana-vic-falls.png',
        destination.includes('cape town') && '/images/maps/cape-town-to-vic-falls.png',
        
        // Try country-based matches
        country === 'kenya' && '/images/maps/kenya-tanzania-uganda.png',
        country === 'tanzania' && '/images/maps/kenya-tanzania-uganda.png',
        country === 'uganda' && '/images/maps/kenya-tanzania-uganda.png',
        country === 'botswana' && '/images/maps/botswana-zimbabwe.png',
        country === 'namibia' && '/images/maps/namibia.png',
        country === 'south africa' && '/images/maps/south-africa-namibia-botswana-zimbabwe.png',
        country === 'zimbabwe' && '/images/maps/botswana-zimbabwe.png',
      ].filter(Boolean);
      
      // Check each possible map
      for (const mapPath of mapFormats) {
        try {
          const response = await fetch(mapPath, { method: 'HEAD' });
          if (response.ok) {
            setMapImage(mapPath);
            return; // Found a map, stop searching
          }
        } catch {
          // Continue to next format
        }
      }
      
      // No map found - use first product image as fallback
      const images = product?.localAssets?.images && product.localAssets.images.length > 0
        ? product.localAssets.images.map(img => img.url)
        : [];
      
      if (images.length > 0) {
        setMapImage(images[0]);
      }
    };
    
    checkForMap();
  }, [productCode, product]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/tourplan/product/${productCode}`)
        const result = await response.json()
        
        console.log('API Response:', result) // Debug log
        
        if (result.success && result.data) {
          // Handle double-nested response structure
          const productData = result.data.data || result.data
          console.log('Product Data:', productData) // Debug log
          setProduct(productData)
        } else {
          setError(result.error || result.message || "Failed to load product details")
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
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
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
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error || "Product not found"}</p>
            <Link href="/booking" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Calculate product images after product is loaded
  const productImages = product?.localAssets?.images && product.localAssets.images.length > 0
    ? product.localAssets.images.map(img => img.url)
    : ["/images/safari-lion.png", "/images/luxury-accommodation.png", "/images/rail-journey.png"]

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: tourContentStyles }} />
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

      {/* Hero Section with Gallery and Map */}
      <section className="relative h-[60vh] bg-gray-900">
        <div className="relative h-full flex">
          {/* Map Section - Left Side */}
          <div className="hidden lg:block w-1/3 h-full bg-gray-200 relative">
            {mapImage ? (
              <Image
                src={mapImage}
                alt="Tour Route Map"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-semibold">Tour Route Map</p>
                  <p className="text-sm">Map will be available soon</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Image Gallery - Right Side */}
          <div className="relative flex-1 h-full">
            <Image
              src={productImages[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            
            {/* Navigation buttons - only show if more than 1 image */}
            {productImages.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % productImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === selectedImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          </div>
        </div>
        
        {/* Title overlay - only on the right side over the image carousel */}
        <div className="absolute bottom-0 left-0 lg:left-1/3 right-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="px-8 pb-12">
            <div className="max-w-3xl text-white">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-amber-500 px-3 py-1 rounded-full text-sm font-medium">⭐ Premium Experience</span>
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">{product.location || 'African Adventure'}</span>
                {product.rates && product.rates.length > 0 && product.rates.find(rate => {
                  const rateValue = rate.twinRateTotal || rate.twinRate || 0
                  return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                }) && (
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    💰 From {product.rates.find(rate => {
                      const rateValue = rate.twinRateTotal || rate.twinRate || 0
                      return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                    })?.twinRateFormatted}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <span className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5" />
                  {product.periods ? `${product.periods + 1} days` : '7 days'}
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Small Group Tour
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  {product.supplierName || 'Expert Guides'}
                </span>
              </div>
              
              <p className="text-xl mb-8 max-w-2xl">
                {product.description || "Experience the magic of Africa with our expertly crafted safari adventure."}
              </p>
              
              <div className="flex gap-4">
                {product.rates?.find(rate => {
                  const rateValue = rate.twinRateTotal || rate.twinRate || 0
                  return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                }) ? (
                  <Link 
                    href={`/booking/create?tourId=${product.code}`}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-lg text-lg"
                  >
                    Book This Adventure
                  </Link>
                ) : (
                  <Link 
                    href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg text-lg"
                  >
                    Request Quote
                  </Link>
                )}
                <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg text-lg">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content with tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 rounded-t-lg h-12">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="itinerary" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">Itinerary</TabsTrigger>
                    <TabsTrigger value="inclusions" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">Inclusions</TabsTrigger>
                    <TabsTrigger value="pricing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">Pricing</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="overview" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">Tour Overview</h2>
                      <div className="prose max-w-none">
                        {product.content?.introduction ? (
                          <div 
                            className="whitespace-pre-line text-gray-700 leading-relaxed tour-content"
                            dangerouslySetInnerHTML={{
                              __html: product.content.introduction
                                .replace(/Day \d+:([^\n]*)/g, '<h3 class="text-lg font-bold text-amber-600 mt-6 mb-3">$&</h3>')
                                .replace(/^(Flights|Accommodation|Meals|Transport|Transfers|Activities|Park fees|Tour essentials|Important Information)$/gm, '<h4 class="text-md font-semibold text-amber-600 mt-5 mb-2">$1</h4>')
                                .replace(/\n\n/g, '</p><p class="mb-3">')
                                .replace(/^(?!<h)/, '<p class="mb-3">')
                                .replace(/(?<!>)$/, '</p>')
                            }}
                          />
                        ) : (
                          <p className="text-gray-700">{product.description}</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="itinerary" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">Tour Itinerary</h2>
                      <div className="prose max-w-none">
                        {product.content?.details ? (
                          <div 
                            className="whitespace-pre-line text-gray-700 leading-relaxed tour-content"
                            dangerouslySetInnerHTML={{
                              __html: product.content.details
                                .replace(/Day \d+:([^\n]*)/g, '<h3 class="text-lg font-bold text-amber-600 mt-6 mb-3">$&</h3>')
                                .replace(/^(Safari information|Accommodation|Transport|Meals|Guide|Activities):/gm, '<h4 class="text-md font-semibold text-amber-600 mt-5 mb-2">$1:</h4>')
                                .replace(/\n\n/g, '</p><p class="mb-3">')
                                .replace(/^(?!<h)/, '<p class="mb-3">')
                                .replace(/(?<!>)$/, '</p>')
                            }}
                          />
                        ) : (
                          <p className="text-gray-700">Detailed itinerary available upon request.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="inclusions" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">What's Included</h2>
                      <div className="prose max-w-none">
                        {product.content?.inclusions ? (
                          <div 
                            className="whitespace-pre-line text-gray-700 leading-relaxed tour-content"
                            dangerouslySetInnerHTML={{
                              __html: product.content.inclusions
                                .replace(/^​?(Flights|Accommodation|Meals|Transport|Transfers|Activities|Park fees|Tour essentials|Important Information)$/gm, '<h4 class="text-md font-semibold text-amber-600 mt-5 mb-2">$1</h4>')
                                .replace(/\n\n/g, '</p><p class="mb-3">')
                                .replace(/^(?!<h)/, '<p class="mb-3">')
                                .replace(/(?<!>)$/, '</p>')
                            }}
                          />
                        ) : (
                          <p className="text-gray-700">Please contact us for detailed inclusions.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pricing" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">Pricing & Dates</h2>
                      <div className="space-y-4">
                        {product.rates && product.rates.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b-2 border-gray-200">
                                  <th className="text-left py-3 px-2 text-amber-600 font-semibold">Date Range</th>
                                  <th className="text-right py-3 px-2 text-amber-600 font-semibold">Single<br/><span className="text-xs font-normal text-gray-500">per person</span></th>
                                  <th className="text-right py-3 px-2 text-amber-600 font-semibold">Twin Share<br/><span className="text-xs font-normal text-gray-500">per person</span></th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.rates.filter(rate => {
                                  const twinValue = rate.twinRateTotal || rate.twinRate || 0
                                  const twinRate = typeof twinValue === 'string' ? parseFloat(twinValue) : twinValue
                                  return twinRate > 0 || (rate.singleRate || 0) > 0
                                }).map((rate, index) => (
                                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-2 text-gray-700">
                                      {rate.dateRange || (rate.dateFrom && rate.dateTo ? 
                                        `${new Date(rate.dateFrom).toLocaleDateString()} - ${new Date(rate.dateTo).toLocaleDateString()}` 
                                        : "Available dates")}
                                    </td>
                                    <td className="text-right py-3 px-2 font-semibold text-gray-800">
                                      {rate.singleRate > 0 ? `${rate.currency || 'AUD'} $${rate.singleRate.toLocaleString()}` : 'POA'}
                                    </td>
                                    <td className="text-right py-3 px-2 font-semibold text-green-600">
                                      {(rate.twinRateTotal || rate.twinRate) > 0 ? rate.twinRateFormatted : 'POA'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Pricing available on request</p>
                            <Link 
                              href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}`}
                              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-lg"
                            >
                              Request Quote
                            </Link>
                          </div>
                        )}
                        
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Payment Information</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <div>• 30% deposit required at booking</div>
                            <div>• Final payment (70%) due 60 days before departure</div>
                            <div>• All prices are per person and subject to availability</div>
                            <div>• Children's pricing available (varies by age)</div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                <h3 className="text-xl font-bold text-center mb-4 text-amber-600">🎯 Book This Adventure</h3>
                
                {/* Pricing */}
                <div className="text-center bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-1">🏷️ Starting from</p>
                  <p className="text-3xl font-bold text-green-700">
                    {product.rates?.find(rate => {
                      const rateValue = rate.twinRateTotal || rate.twinRate || 0
                      return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                    })?.twinRateFormatted || 'Contact for Pricing'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {product.rates?.find(rate => {
                      const rateValue = rate.twinRateTotal || rate.twinRate || 0
                      return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                    }) ? 'per person twin share' : 'Custom quote required'}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-amber-600">✨ What's Included</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Expert local guides</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>All park entrance fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>4WD safari vehicle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Small group experience</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  {product.rates?.find(rate => {
                    const rateValue = rate.twinRateTotal || rate.twinRate || 0
                    return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                  }) ? (
                    <Link 
                      href={`/booking/create?tourId=${product.code}`}
                      className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 text-center rounded-lg"
                    >
                      🚀 Book Now
                    </Link>
                  ) : (
                    <Link 
                      href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}`}
                      className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 text-center rounded-lg"
                    >
                      📧 Request Quote
                    </Link>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    {product.localAssets?.pdfs && product.localAssets.pdfs.length > 0 ? (
                      product.localAssets.pdfs.map((pdf, index) => (
                        <a 
                          key={index}
                          href={pdf.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="border border-amber-200 hover:bg-amber-50 px-3 py-2 rounded text-center text-sm"
                        >
                          <Download className="h-4 w-4 inline mr-1" />
                          PDF
                        </a>
                      ))
                    ) : (
                      <button className="border border-amber-200 hover:bg-amber-50 px-3 py-2 rounded text-sm">
                        <Download className="h-4 w-4 inline mr-1" />
                        PDF Guide
                      </button>
                    )}
                    
                    <button className="border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded text-sm">
                      💬 Get Quote
                    </button>
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 text-sm text-gray-600 text-center">
                  <p className="font-semibold mb-2 text-amber-600">Need Help?</p>
                  <p>Call: 1300 55 44 01</p>
                  <p>Email: info@thisisafrica.com.au</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}