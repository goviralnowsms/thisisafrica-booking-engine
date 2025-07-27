// app/productdetails/page.tsx
'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  MapPin, 
  Clock, 
  Users, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'

// Simple UI components to replace shadcn imports
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

const Badge = ({ children, className = '', variant = 'default' }: { 
  children: React.ReactNode, 
  className?: string,
  variant?: string 
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'secondary' 
      ? 'bg-gray-100 text-gray-800' 
      : 'bg-blue-100 text-blue-800'
  } ${className}`}>
    {children}
  </span>
);

const Button = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'default',
  size = 'default',
  asChild = false
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string,
  variant?: string,
  size?: string,
  asChild?: boolean
}) => {
  const baseClasses = `inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background`;
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  };
  
  const sizeClasses = {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5 text-sm',
    lg: 'px-6 py-3 text-lg'
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default} ${className}`
    });
  }

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default} ${className}`}
    >
      {children}
    </button>
  );
};

const Tabs = ({ children, value, onValueChange }: { 
  children: React.ReactNode, 
  value?: string,
  onValueChange?: (value: string) => void 
}) => (
  <div className="w-full">{children}</div>
);

const TabsList = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex border-b border-gray-200 mb-4 ${className}`}>{children}</div>
);

const TabsTrigger = ({ children, value, isActive, onClick }: { 
  children: React.ReactNode, 
  value: string,
  isActive?: boolean,
  onClick?: () => void
}) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      isActive 
        ? 'text-blue-600 border-blue-500' 
        : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
    }`}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeValue }: { 
  children: React.ReactNode, 
  value: string,
  activeValue?: string
}) => (
  <div className={`mt-4 ${value === activeValue ? 'block' : 'hidden'}`}>
    {children}
  </div>
);

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Interfaces
interface ProductNote {
  category: string
  text: string
}

interface ProductAssets {
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

interface ProductRate {
  dateRange?: string
  twinRate?: string
  twinRateFormatted?: string
  currency?: string
}

interface ProductData {
  name: string
  code: string
  description?: string
  supplierName?: string
  location?: string
  notes?: ProductNote[]
  rates?: ProductRate[]
  localAssets?: ProductAssets
  content?: {
    introduction: string
    details: string
    inclusions: string
    highlights: string
    exclusions: string
    terms: string
  }
}

function ProductDetailsContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [productAssets, setProductAssets] = useState<ProductAssets | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('introduction')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (code) {
      fetchProductDetails(code)
    } else {
      setError('No product code provided')
      setLoading(false)
    }
  }, [code])

  const fetchProductDetails = async (productCode: string) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch from your existing Tourplan API route
      const response = await fetch(`/api/tourplan/product/${productCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setProductData(data.data)
        
        // Set assets from the API response
        if (data.data.localAssets) {
          setProductAssets(data.data.localAssets)
        }
      } else {
        throw new Error(data.error || 'Invalid response format')
      }

    } catch (err) {
      console.error('Error fetching product details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  // Extract note content by category
  const getNoteByCategory = (category: string): string => {
    const note = productData?.notes?.find(n => n.category === category)
    return note?.text || ''
  }

  // Get main description from structured content or notes
  const getMainDescription = (): string => {
    // Try structured content first
    if (productData?.content?.introduction) {
      return productData.content.introduction
    }
    
    // Fallback to manual note parsing
    const categories = ['GEN', 'DES', 'PII', 'DTL']
    for (const category of categories) {
      const description = getNoteByCategory(category)
      if (description) return description
    }
    return productData?.description || 'No description available.'
  }

  const getDetailsContent = (): string => {
    if (productData?.content?.details) {
      return productData.content.details
    }
    return getNoteByCategory('DTL') || getNoteByCategory('DES') || getNoteByCategory('PII') || 'Detailed information will be provided upon booking.'
  }

  const getInclusionsContent = (): string => {
    if (productData?.content?.inclusions) {
      return productData.content.inclusions
    }
    return getNoteByCategory('INC') || getNoteByCategory('INE') || 'Inclusions will be detailed in your customized quote.'
  }

  const getHighlightsContent = (): string => {
    if (productData?.content?.highlights) {
      return productData.content.highlights
    }
    return getNoteByCategory('PHL') || getNoteByCategory('HLT') || getNoteByCategory('SHL') || 'Experience the best of Africa with our professional guides.'
  }

  // Format text content to preserve line breaks and paragraphs
  const formatTextContent = (text: string): string => {
    if (!text) return ''
    
    // Convert line breaks to HTML paragraphs
    return text
      .split(/\n\s*\n/) // Split on double line breaks (paragraphs)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0)
      .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('')
  }

  // Check if product has pricing available
  const hasPricing = (): boolean => {
    return productData?.rates && productData.rates.length > 0 && 
           productData.rates.some(rate => {
             const price = parseFloat(rate.twinRate || '0');
             return price > 0;
           });
  }

  // Get the lowest price for display
  const getLowestPrice = (): { price: number; currency: string } | null => {
    if (!hasPricing()) return null;
    
    const prices = productData!.rates!
      .map(rate => parseFloat(rate.twinRate || '0'))
      .filter(price => price > 0);
    
    if (prices.length === 0) return null;
    
    return {
      price: Math.min(...prices),
      currency: productData!.rates![0].currency || 'AUD'
    };
  }

  // Handle booking button click
  const handleBookNow = () => {
    if (hasPricing()) {
      // Store product data for the booking form
      const bookingProductData = {
        tour: {
          id: productData!.code,
          name: productData!.name,
          description: productData!.description || '',
          supplier: productData!.supplierName || '',
          duration: '1 day',
          location: productData!.location || '',
        },
        rates: productData!.rates || [],
        availability: 'Available',
      };
      
      // Store in localStorage for the booking form to pick up
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTourData', JSON.stringify(bookingProductData));
        window.location.href = '/?mode=booking';
      }
    } else {
      // For products without pricing, show inquiry form
      if (typeof window !== 'undefined') {
        window.location.href = '/?mode=inquiry&code=' + encodeURIComponent(productData!.code);
      }
    }
  }

  // Image navigation
  const nextImage = () => {
    if (productAssets && productAssets.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === productAssets.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (productAssets && productAssets.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? productAssets.images.length - 1 : prev - 1
      )
    }
  }

  const goBack = () => {
    // Check for search context to return to search results
    if (typeof window !== 'undefined') {
      try {
        const searchContext = localStorage.getItem('searchContext');
        if (searchContext) {
          const context = JSON.parse(searchContext);
          if (context.returnUrl) {
            window.location.href = context.returnUrl;
            return;
          }
        }
      } catch (error) {
        console.warn('Could not parse search context:', error);
      }
      
      // Fallback to browser back or home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  }

  // Get search context for enhanced back button
  const getSearchContext = () => {
    if (typeof window === 'undefined') return null;
    try {
      const context = localStorage.getItem('searchContext');
      return context ? JSON.parse(context) : null;
    } catch {
      return null;
    }
  }

  const searchContext = getSearchContext();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetailsSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={goBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="border-red-200">
          <CardContent>
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error Loading Product</h3>
                <p className="text-sm text-red-500">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => typeof window !== 'undefined' && window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={goBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
              <p className="text-gray-600">The requested product could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button with Context */}
      <Button variant="outline" onClick={goBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {searchContext ? 
          `Back to ${searchContext.searchType} in ${searchContext.destination || searchContext.country}` : 
          'Back to Search'
        }
      </Button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
        <p className="text-gray-600">
          This is Africa is a rapidly growing wholesale and retail travel company 
          which specialises in selling tailor-made and package tours to Africa.
        </p>
      </div>

      {/* Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          {productAssets && productAssets.images.length > 0 && (
            <Card>
              <CardContent>
                <div className="p-0">
                  <div className="relative h-96 bg-gray-100 rounded-t-lg overflow-hidden">
                    <img 
                      src={productAssets.images[currentImageIndex].url}
                      alt={`${productData.name} - ${productAssets.images[currentImageIndex].originalName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `/images/no-image.jpg`
                      }}
                    />
                    {productAssets.images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Image indicators */}
                  {productAssets.images.length > 1 && (
                    <div className="flex justify-center p-4 space-x-2">
                      {productAssets.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div 
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: formatTextContent(getMainDescription())
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">African Adventure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Professional Guided Tour</span>
                </div>
                {productData.supplierName && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{productData.supplierName}</Badge>
                  </div>
                )}
                <div className="pt-2">
                  <p className="text-xs text-gray-500">Product Code: {productData.code}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          {productAssets && productAssets.pdfs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {productAssets.pdfs.map((pdf, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="w-full"
                    >
                      <a href={pdf.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        {pdf.name}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing & Booking */}
          <Card>
            <CardHeader>
              <CardTitle>
                {hasPricing() ? 'Pricing & Booking' : 'Get a Quote'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasPricing() && (
                <div className="mb-4">
                  {(() => {
                    const lowestPrice = getLowestPrice()
                    return lowestPrice ? (
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">From</p>
                        <p className="text-2xl font-bold text-green-600">
                          {lowestPrice.currency} ${lowestPrice.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per person twin share</p>
                      </div>
                    ) : null
                  })()}
                  
                  {/* Show sample dates */}
                  {productData.rates && productData.rates.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold mb-2">Available Dates:</p>
                      <div className="space-y-1">
                        {productData.rates.slice(0, 3).map((rate, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{rate.dateRange}</span>
                            <span className="font-semibold">{rate.twinRateFormatted}</span>
                          </div>
                        ))}
                        {productData.rates.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{productData.rates.length - 3} more dates available
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleBookNow}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {hasPricing() ? 'Book Now' : 'Get Quote'}
              </Button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                {hasPricing() 
                  ? 'Select dates and travelers to book online'
                  : 'Contact us for pricing and availability'
                }
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs Section */}
      <Card>
        <CardContent>
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="introduction" isActive={activeTab === 'introduction'} onClick={() => setActiveTab('introduction')}>
                  Introduction
                </TabsTrigger>
                <TabsTrigger value="details" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')}>
                  Details
                </TabsTrigger>
                <TabsTrigger value="inclusions" isActive={activeTab === 'inclusions'} onClick={() => setActiveTab('inclusions')}>
                  Inclusions
                </TabsTrigger>
                <TabsTrigger value="highlights" isActive={activeTab === 'highlights'} onClick={() => setActiveTab('highlights')}>
                  Highlights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="introduction" activeValue={activeTab}>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">About This Tour</h3>
                  <div 
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: formatTextContent(getMainDescription())
                    }} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" activeValue={activeTab}>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Tour Details</h3>
                  <div 
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: formatTextContent(getDetailsContent())
                    }} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="inclusions" activeValue={activeTab}>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                  <div 
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: formatTextContent(getInclusionsContent())
                    }} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="highlights" activeValue={activeTab}>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-3">Tour Highlights</h3>
                  <div 
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: formatTextContent(getHighlightsContent())
                    }} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-6 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-1">
              <p><strong>Product Code:</strong> {productData.code}</p>
              <p><strong>Available Note Categories:</strong> {productData.notes && Array.isArray(productData.notes) ? productData.notes.map(n => n.category).join(', ') : 'None'}</p>
              <p><strong>Total Notes:</strong> {productData.notes && Array.isArray(productData.notes) ? productData.notes.length : 0}</p>
              <p><strong>Images Found:</strong> {productAssets?.images.length || 0}</p>
              <p><strong>PDFs Available:</strong> {productAssets?.pdfs.length || 0}</p>
              {productAssets?.images.length && productAssets.images.length > 0 && (
                <p><strong>Image Names:</strong> {productAssets.images.map(img => img.originalName).join(', ')}</p>
              )}
              {productAssets?.pdfs.length && productAssets.pdfs.length > 0 && (
                <p><strong>PDF Names:</strong> {productAssets.pdfs.map(pdf => pdf.originalName).join(', ')}</p>
              )}
              
              {/* Show pricing debug and booking logic */}
              <div className="mt-4 space-y-1">
                <p><strong>Pricing Debug:</strong></p>
                <p className="text-sm">
                  <strong>Has Rates:</strong> {productData.rates ? 'Yes' : 'No'} 
                  ({productData.rates?.length || 0} rates)
                </p>
                <p className="text-sm">
                  <strong>Has Valid Pricing:</strong> {hasPricing() ? 'Yes' : 'No'}
                </p>
                <p className="text-sm">
                  <strong>Button Action:</strong> {hasPricing() ? 'Book Now → Booking Form' : 'Get Quote → Contact Form'}
                </p>
                {productData.rates && productData.rates.length > 0 && (
                  <div className="text-xs">
                    <p><strong>Rate Details:</strong></p>
                    {productData.rates.slice(0, 3).map((rate, index) => (
                      <p key={index}>
                        {rate.dateRange}: Twin=${rate.twinRate} (${parseFloat(rate.twinRate || '0') > 0 ? 'Valid' : 'Invalid'})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Loading Skeleton
function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" /> {/* Back button */}
      
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full" /> {/* Image */}
          <Skeleton className="h-64 w-full" /> {/* Content */}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

// Main Page Component
export default function ProductDetailsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <ProductDetailsSkeleton />
      </div>
    }>
      <ProductDetailsContent />
    </Suspense>
  )
}