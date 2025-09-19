"use client"

import { useEffect, useState, useMemo } from "react"

// Disable static generation for this dynamic page
export const dynamic = 'force-dynamic'
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
// Temporary fix for lucide-react module resolution issue
// import { MapPin, Clock, Users, Download, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PricingCalendar from "@/components/booking/PricingCalendar"
import GoogleMap from "@/components/GoogleMap"

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
  const router = useRouter()
  const productCode = decodeURIComponent(params.code as string)
  
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [mapImage, setMapImage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [hasAvailableDates, setHasAvailableDates] = useState<boolean | null>(null)
  const [sanityImages, setSanityImages] = useState<any>(null)
  const [sanityImagesLoaded, setSanityImagesLoaded] = useState(false)
  const [hasHighResImages, setHasHighResImages] = useState(false)
  const [hasHighResMap, setHasHighResMap] = useState(false)
  const [supplierCode, setSupplierCode] = useState<string | null>(null)
  const [availableRoomTypes, setAvailableRoomTypes] = useState<any[]>([])
  const [selectedRoomType, setSelectedRoomType] = useState<string>('')
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false)
  
  // Check if this is an accommodation product
  const isAccommodation = useMemo(() => {
    if (!productCode) return false
    // Accommodation codes typically contain 'AC' after the airport code
    // Examples: CPTACPOR002PORTST, JNBAC*, etc.
    const pattern = /^[A-Z]{3}AC/
    const isAccomm = pattern.test(productCode)
    
    // Extract supplier code for accommodation products
    if (isAccomm) {
      // Extract supplier code from product code (e.g., CPTACPOR002PORTST -> POR002)
      const match = productCode.match(/([A-Z]{3}\d{3})/)
      if (match) {
        setSupplierCode(match[1])
      }
    }
    
    return isAccomm
  }, [productCode])
  
  // Format display name for accommodation products
  const displayName = useMemo(() => {
    if (!product) return ''
    
    if (isAccommodation && product.supplierName) {
      // For accommodation: "Hotel Name - Room Type"
      return `${product.supplierName}${product.name ? ` - ${product.name}` : ''}`
    }
    
    return product.name
  }, [product, isAccommodation])

  // Client-side hydration effect
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Debug effect to track high-res image detection changes
  useEffect(() => {
    console.log(`🔄 [${productCode}] hasHighResImages changed to:`, hasHighResImages)
  }, [hasHighResImages, productCode])

  // Fetch Sanity images effect
  useEffect(() => {
    const fetchSanityImages = async () => {
      if (!productCode) return

      try {
        console.log(`🖼️ [${productCode}] Fetching Sanity images from API...`)
        const response = await fetch(`/api/sanity/product-images/${productCode}`, {
          cache: 'no-store',
          next: { revalidate: 0 }
        })
        const result = await response.json()
        
        if (result.success && result.data) {
          console.log(`🖼️ [${productCode}] Sanity images loaded:`, result.data)
          setSanityImages(result.data)
          
          // Check if this product has high-resolution images by examining actual image dimensions
          // High-res gallery images should be ~1200x800, maps ~800x800 
          // Old images are ~600x347, so we detect based on width >= 1000 for gallery images
          
          if (result.data.gallery && result.data.gallery.length > 0) {
            console.log(`🖼️ [${productCode}] Found ${result.data.gallery.length} gallery images:`, result.data.gallery)
            // Try to detect high-res images by checking image URLs or loading one image to check dimensions
            const firstGalleryImage = result.data.gallery[0]?.url
            console.log(`🖼️ [${productCode}] First gallery image URL:`, firstGalleryImage)
            if (firstGalleryImage) {
              // For Sanity images, we can detect high-res from the URL dimensions
              // Sanity URLs contain dimensions like: .../image-1720x1110.jpg
              const dimensionMatch = firstGalleryImage.match(/-(\d+)x(\d+)\./);
              if (dimensionMatch) {
                const width = parseInt(dimensionMatch[1]);
                const height = parseInt(dimensionMatch[2]);
                const isHighRes = width >= 1000;
                setHasHighResImages(isHighRes);
                console.log(`🖼️ [${productCode}] Sanity image dimensions from URL: ${width}x${height}, High-res: ${isHighRes}`);
              } else {
                // Fallback: try Image constructor approach
                try {
                  const img = document.createElement('img');
                  img.onload = function() {
                    const isHighRes = this.width >= 1000;
                    setHasHighResImages(isHighRes);
                    console.log(`🖼️ [${productCode}] Gallery image dimensions: ${this.width}x${this.height}, High-res: ${isHighRes}`);
                  };
                  img.onerror = function() {
                    console.error(`🖼️ [${productCode}] Could not load image for dimension check:`, firstGalleryImage);
                    // Final fallback: assume high-res for Sanity CDN images
                    setHasHighResImages(true);
                    console.log(`🖼️ [${productCode}] Using fallback: assuming high-res for Sanity image`);
                  };
                  img.crossOrigin = 'anonymous';
                  img.src = firstGalleryImage;
                } catch (error) {
                  console.log(`🖼️ [${productCode}] Error with Image constructor:`, error);
                  // Final fallback: assume high-res for Sanity CDN images
                  setHasHighResImages(true);
                  console.log(`🖼️ [${productCode}] Using final fallback: assuming high-res for Sanity image`);
                }
              }
            }
          } else {
            console.log(`🖼️ [${productCode}] No gallery images found or empty gallery:`, result.data.gallery)
            setHasHighResImages(false)
          }
          
          // Also check map image resolution if available
          if (result.data.mapImage) {
            // For Sanity map images, detect dimensions from URL
            const mapDimensionMatch = result.data.mapImage.match(/-(\d+)x(\d+)\./);
            if (mapDimensionMatch) {
              const mapWidth = parseInt(mapDimensionMatch[1]);
              const mapHeight = parseInt(mapDimensionMatch[2]);
              const isHighResMap = mapWidth > 600;
              setHasHighResMap(isHighResMap);
              console.log(`🖼️ [${productCode}] Map image dimensions from URL: ${mapWidth}x${mapHeight}, High-res map: ${isHighResMap}`);
            } else {
              // Fallback for map images
              try {
                const mapImg = document.createElement('img');
                mapImg.onload = function() {
                  const isHighResMap = this.width > 600;
                  setHasHighResMap(isHighResMap);
                  console.log(`🖼️ [${productCode}] Map image dimensions: ${this.width}x${this.height}, High-res map: ${isHighResMap}`);
                };
                mapImg.onerror = function() {
                  console.log(`🖼️ [${productCode}] Could not load map image for dimension check`);
                  // Assume high-res for Sanity CDN maps
                  setHasHighResMap(true);
                };
                mapImg.crossOrigin = 'anonymous';
                mapImg.src = result.data.mapImage;
              } catch (error) {
                console.log(`🖼️ [${productCode}] Error checking map image dimensions:`, error);
                // Assume high-res for Sanity CDN maps
                setHasHighResMap(true);
              }
            }
          } else {
            setHasHighResMap(false)
          }
          
          console.log('Checking high resolution images for', productCode)
        } else {
          console.log(`🖼️ [${productCode}] No Sanity images found. Response:`, result)
          setSanityImages(null)
          
          // Check if this product has hardcoded high-res images
          if (productCode === 'NBOGTSAFHQEAETIA') {
            console.log('🖼️ [NBOGTSAFHQEAETIA] Using hardcoded high-res images')
            // We know NBOGTSAFHQEAETIA has high-res images, so set directly
            setHasHighResImages(true)
          } else {
            setHasHighResImages(false)
          }
        }
      } catch (error) {
        console.warn('Error fetching Sanity images:', error)
        setSanityImages(null)
        setHasHighResImages(false)
      } finally {
        setSanityImagesLoaded(true)
      }
    }

    if (productCode) {
      fetchSanityImages()
    }
  }, [productCode])

  // Calculate product images - now checks Sanity first, then falls back to hardcoded
  const realImages = useMemo(() => {
    if (!product) return []
    
    console.log('Checking product images for:', productCode)
    console.log('Sanity images loaded:', sanityImagesLoaded, 'Sanity images:', sanityImages)
    
    // First check Sanity images if loaded
    if (sanityImagesLoaded && sanityImages?.gallery && sanityImages.gallery.length > 0) {
      console.log('Using Sanity images for', productCode)
      return sanityImages.gallery
        .map((img: any) => img.url)
        .filter((url: string) => url && url.trim() !== '')
        .slice(0, 5) // Limit to 5 images
    }
    
    // Fallback to hardcoded images for specific products
    console.log('No Sanity images, checking hardcoded images for:', productCode)
    
    // Check for NBOGTSAFHQEAETIA specific images (East Africa tour - no space)
    if (productCode === 'NBOGTSAFHQEAETIA') {
      console.log('Matched NBOGTSAFHQEAETIA - returning custom images')
      return [
        '/images/products/NBOGTSAFHEQ-AETIA-1.jpg',
        '/images/products/NBOGTSAFHQ-EAETIA-2.jpg',
        '/images/products/NBOGTSAFHQ-EAETIA-3.jpg',
        '/images/products/NBOGTSAFHQ-EAETIA-4.jpg',
        '/images/products/NBOGTSAFHQ-EAETIA-5.jpg'
      ]
    }
    
    // Check for Classic Kruger Package specific images
    if (productCode === 'HDSSPMAKUTSMSSCLS') {
      return [
        '/images/products/kruger-package.jpeg',
        '/images/products/kruger-zebra.jpeg'
      ]
    }
    
    // Return TourPlan product images if available
    if (product.localAssets?.images && product.localAssets.images.length > 0) {
      return product.localAssets.images
        .map(img => img.url)
        .filter(url => url && url.trim() !== '')
        .slice(0, 5) // Limit to 5 images to avoid performance issues
    }
    
    return []
  }, [product, productCode, sanityImages, sanityImagesLoaded])
  
  // Use real images if available, otherwise fallback images
  const productImages = useMemo(() => {
    return realImages.length > 0 
      ? realImages
      : ["/images/products/Lion-1-1200x800.jpg", "/images/products/accomm-hero.jpg", "/images/products/Lion-2-1200x800.jpg"]
  }, [realImages])
  
  // Determine left side image and remaining carousel images
  const leftSideImage = useMemo(() => {
    // First check Sanity map image
    if (sanityImages?.mapImage) {
      console.log('Using Sanity map image for', productCode)
      return sanityImages.mapImage
    }
    
    // Check for NBOGTSAFHQEAETIA specific map (no space)
    if (productCode === 'NBOGTSAFHQEAETIA') {
      return '/images/products/NBOGTSAFHQ-EAETIA-Map.jpg'
    }
    
    // Check for Classic Kruger Package specific left side image
    if (productCode === 'HDSSPMAKUTSMSSCLS') {
      return '/images/products/cheetah.jpeg'
    }
    
    // If we have a map from TourPlan data or found through map checking logic
    if (mapImage && !mapImage.includes('/images/products/')) {
      return mapImage
    }
    // If no map and we have multiple real images, use the second image for variety
    if (realImages.length > 1) {
      return realImages[1]
    }
    // If only one real image or no real images, use first image
    return productImages[0]
  }, [mapImage, realImages, productImages, productCode, sanityImages])
  
  // Remaining images for carousel (excluding the one used on left side)
  const carouselImages = useMemo(() => {
    let images = productImages
    
    if (realImages.length <= 1) {
      // If we only have 1 or no real images, show all productImages in carousel
      images = productImages
    } else if (leftSideImage === realImages[1]) {
      // If we're using the second image on the left, show first + third onwards in carousel
      images = [realImages[0], ...realImages.slice(2)]
    } else {
      // Otherwise show all images in carousel
      images = productImages
    }
    
    // Add specific images for Savanna Lodge product
    if (productCode && productCode.includes('GKPSPSAV002SAVLHM')) {
      const savannahSuiteImage = '/images/products/savannah-suite.jpg'
      const savannahHoneymoonImage = '/images/products/savannah-lodge-honeymoon.png'
      
      // Only show the 2 Savanna Lodge specific images
      return [savannahHoneymoonImage, savannahSuiteImage]
    }
    
    // Add specific images for Sabi Sabi Bush Lodge
    if (productCode && (productCode.includes('GKPSPSABBLDSABBLS') || productCode.includes('SABI'))) {
      const sabiImages = [
        '/images/products/sabi-sabi1.png',
        '/images/products/sabi-sabi2.jpg',
        '/images/products/sabi-sabi3.jpg',
        '/images/products/sabi-sabi4.jpg'
      ]
      return sabiImages
    }
    
    return images
  }, [leftSideImage, realImages, productImages, productCode])
  
  // Show carousel controls only if we have multiple carousel images
  const showCarouselControls = useMemo(() => carouselImages.length > 1, [carouselImages])


  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showCarouselControls) return
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setSelectedImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setSelectedImageIndex((prev) => (prev + 1) % carouselImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showCarouselControls, carouselImages.length])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !showCarouselControls) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setSelectedImageIndex((prev) => (prev + 1) % carouselImages.length)
    }
    if (isRightSwipe) {
      setSelectedImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
    }
  }

  // Simple map image selection based on product code
  useEffect(() => {
    if (!productCode) return;
    
    const productCodeUpper = productCode.toUpperCase();
    let mapPath = null;
    
    // First check for specific product code maps
    if (productCodeUpper === 'NBOGTARP001CKSE') {
      mapPath = '/images/maps/kenya-tanzania-uganda-NBOGTARP001CKSE.png';
    } else if (productCodeUpper === 'NBOGTARP001CKEKEE') {
      // Use the comprehensive Kenya/Tanzania/Uganda map for Keekorok tour
      mapPath = '/images/maps/Serengeti-np-lakevictoria-masai-mara-nakuru-naivasha-amboseli-arusha-zanzibar-dar-es-salaam.png';
    } else if (productCodeUpper.includes('NBO') || productCodeUpper.includes('KENYA')) {
      // Kenya tours - use the detailed Kenya/Tanzania map
      mapPath = '/images/maps/Serengeti-np-lakevictoria-masai-mara-nakuru-naivasha-amboseli-arusha-zanzibar-dar-es-salaam.png';
    } else if (productCodeUpper.includes('GBE') || productCodeUpper.includes('MUB') || productCodeUpper.includes('BOTSWANA')) {
      mapPath = '/images/maps/botswana-zimbabwe.png';
    } else if (productCodeUpper.includes('WDH') || productCodeUpper.includes('NAMIBIA')) {
      mapPath = '/images/maps/namibia.png';
    } else if (productCodeUpper.includes('CPT') || productCodeUpper.includes('JNB') || productCodeUpper.includes('SOUTH-AFRICA')) {
      mapPath = '/images/maps/south-africa-namibia-botswana-zimbabwe.png';
    } else if (productCodeUpper.includes('VFA') || productCodeUpper.includes('VICTORIA')) {
      mapPath = '/images/maps/botswana-vic-falls.png';
    } else if (productCodeUpper.includes('HRE') || productCodeUpper.includes('ZIMBABWE')) {
      mapPath = '/images/maps/botswana-zimbabwe.png';
    } else if (productCodeUpper.includes('LUN') || productCodeUpper.includes('ZAMBIA')) {
      mapPath = '/images/maps/botswana-namibia-zambia-zimbabwe.png';
    } else {
      // Default to comprehensive Kenya/Tanzania map for other African tours
      mapPath = '/images/maps/Serengeti-np-lakevictoria-masai-mara-nakuru-naivasha-amboseli-arusha-zanzibar-dar-es-salaam.png';
    }
    
    setMapImage(mapPath);
  }, [productCode]);

  // Check availability dates for products with pricing
  useEffect(() => {
    if (!product || !productCode) return;
    
    // Only check availability for products that have pricing
    const hasRates = product.rates?.some(rate => {
      const rateValue = rate.twinRateTotal || rate.twinRate || 0
      return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
    });
    
    if (!hasRates) {
      setHasAvailableDates(false);
      return;
    }
    
    // Check if this product has availability issues (like BBKCRTVT001ZAM2NM)
    const checkAvailability = async () => {
      try {
        // Get next 3 months of pricing data to check for available dates
        const currentDate = new Date();
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
        
        const params = new URLSearchParams({
          dateFrom: currentDate.toISOString().split('T')[0],
          dateTo: endDate.toISOString().split('T')[0],
          adults: '2',
          children: '0',
          roomType: 'DB'
        });

        const response = await fetch(`/api/tourplan/pricing/${productCode}?${params}`, {
          cache: 'no-store'
        });
        const result = await response.json();

        if (result.success && result.data?.calendar) {
          // Check if there are any days with pricing data (since all tours are now bookable)
          const hasValidDays = result.data.calendar.some((day: any) => 
            day.validDay || day.available || (day.rates && day.rates.length > 0)
          );
          setHasAvailableDates(hasValidDays);
        } else {
          // Since all tours are now bookable, assume availability if we have basic product rates
          setHasAvailableDates(hasRates);
        }
      } catch (error) {
        console.warn('Error checking availability:', error);
        // On error, assume booking is possible (conservative approach)
        setHasAvailableDates(true);
      }
    };
    
    checkAvailability();
  }, [product, productCode]);

  useEffect(() => {
    // Only fetch on client side to avoid hydration mismatch
    if (!isClient) return

    const fetchProductDetails = async () => {
      if (!productCode) {
        setError("No product code provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching product details for:', productCode)
        console.log('API URL:', `/api/tourplan/product/${productCode}`)
        const response = await fetch(`/api/tourplan/product/${productCode}`)
        
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        console.log('Response headers:', Object.fromEntries(response.headers.entries()))
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('Full API Response:', result)
        
        if (result.success && result.data) {
          // Handle the double-nested response structure: {success: true, data: {success: true, data: {...}}}
          let productData = result.data
          if (productData.success && productData.data) {
            productData = productData.data
          }
          console.log('Extracted Product Data:', productData)
          
          if (productData && productData.id) {
            console.log('Setting product data:', productData)
            
            // Add PDF for NBOGTSAFHQEAETIA product (no space)
            if (productCode === 'NBOGTSAFHQEAETIA') {
              if (!productData.localAssets) {
                productData.localAssets = { images: [], pdfs: [] }
              }
              if (!productData.localAssets.pdfs) {
                productData.localAssets.pdfs = []
              }
              // Add the PDF with space in filename
              productData.localAssets.pdfs = [{
                url: '/pdfs/products/NBOGTSAFHQ EAETIA-PDF.pdf',
                name: 'Tour Brochure',
                originalName: 'NBOGTSAFHQ EAETIA-PDF.pdf',
                status: 'available'
              }]
            }
            
            setProduct(productData)
            // Reset image carousel to first image when product changes
            setSelectedImageIndex(0)
            console.log('Product set successfully')
            // Force a small delay to ensure state updates
            await new Promise(resolve => setTimeout(resolve, 100))
          } else {
            console.error('Invalid product data structure:', productData)
            setError("Invalid product data received")
          }
        } else {
          console.error('API Error - No success or data:', result)
          setError(result.error || result.message || "Failed to load product details")
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError(`Failed to load product details: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
        console.log('Loading finished')
      }
    }

    fetchProductDetails()
  }, [productCode, isClient])

  // Fetch available room types for accommodation products
  useEffect(() => {
    const fetchRoomTypes = async () => {
      if (!isAccommodation || !product?.supplierName) return
      
      setLoadingRoomTypes(true)
      try {
        console.log(`🏨 Fetching room types for hotel: ${product.supplierName}`)
        const response = await fetch(`/api/accommodation/room-types/${encodeURIComponent(product.supplierName)}?currentCode=${productCode}`)
        const result = await response.json()
        
        if (result.success && result.roomTypes) {
          setAvailableRoomTypes(result.roomTypes)
          console.log(`🏨 Found ${result.roomTypes.length} room types:`, result.roomTypes)
        } else {
          console.log('🏨 No room types found or API failed:', result)
          setAvailableRoomTypes([])
        }
      } catch (error) {
        console.error('Error fetching room types:', error)
      } finally {
        setLoadingRoomTypes(false)
      }
    }
    
    fetchRoomTypes()
  }, [isAccommodation, product?.supplierName])

  // Handle room type selection
  const handleRoomTypeChange = (newRoomTypeCode: string) => {
    console.log(`🏨 Switching to room type: ${newRoomTypeCode}`)
    // Navigate to the new product page
    router.push(`/products/${newRoomTypeCode}`)
  }

  if (loading || !isClient) {
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


  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{ __html: tourContentStyles }} />
      {/* Breadcrumb */}
      <div className="bg-white border-b mt-16 md:mt-20">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm ml-48">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/booking" className="text-gray-500 hover:text-gray-700">Tours</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{displayName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Title Above Gallery */}
      <section className="bg-white">
        {/* Title and Info Section */}
        <div className="container mx-auto px-4 py-6">
          <div className="lg:ml-[33.333%] px-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">⭐ Premium Experience</span>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">{product.location || 'African Adventure'}</span>
              {product.rates && product.rates.length > 0 && product.rates.find(rate => {
                const rateValue = rate.twinRateTotal || rate.twinRate || 0
                return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
              }) && (
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  From {product.rates.find(rate => {
                    const rateValue = rate.twinRateTotal || rate.twinRate || 0
                    return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                  })?.twinRateFormatted}
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
            
            {/* Room Type Selector for Accommodation */}
            {isAccommodation && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                <div className="text-sm text-gray-600 mb-2">
                  Debug: Accommodation={isAccommodation ? 'Yes' : 'No'}, 
                  Loading={loadingRoomTypes ? 'Yes' : 'No'}, 
                  Room Types Found={availableRoomTypes.length}
                </div>
                {(availableRoomTypes.length > 1 || loadingRoomTypes) && (
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Select Room Type:
                    </label>
                    <Select 
                      value={selectedRoomType || productCode} 
                      onValueChange={handleRoomTypeChange}
                      disabled={loadingRoomTypes}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Choose room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoomTypes.map((roomType) => (
                          <SelectItem 
                            key={roomType.productCode} 
                            value={roomType.productCode}
                          >
                            {roomType.roomType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {loadingRoomTypes && (
                      <span className="text-sm text-gray-500">Loading room types...</span>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Different room types may have different pricing and availability
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery and Map Section */}
        {console.log('🖼️ RENDER hasHighResImages:', hasHighResImages, 'hasHighResMap:', hasHighResMap, 'productCode:', productCode, 'sanityImagesLoaded:', sanityImagesLoaded)}
        <div className={`relative ${hasHighResImages ? 'h-[80vh] w-full' : 'h-[60vh] flex justify-center'}`}>
          <div className={hasHighResImages ? 'h-full w-full flex gap-6 px-6 py-4' : 'flex justify-center w-full'}>
            {/* Left Side - Map or Alternative Image - Square but 1/3 of space */}
            <div className={`hidden lg:block ${hasHighResImages ? 'w-1/3 h-full rounded-lg overflow-hidden shadow-lg flex-shrink-0' : 'w-1/3 h-full border-r'} bg-white relative`}>
              {isAccommodation && supplierCode ? (
                // For accommodation: Show Google Maps with GPS first, fallback to Sanity map image
                <GoogleMap 
                  supplierCode={supplierCode}
                  hotelName={product?.supplierName || 'Hotel'}
                  fallbackMapImage={leftSideImage || undefined}
                  height="100%"
                  className="h-full"
                />
              ) : leftSideImage ? (
                // For tours: Show regular map image
                <Image
                  src={leftSideImage}
                  alt={leftSideImage.includes('/maps/') || leftSideImage.includes('Map') ? "Tour Route Map" : "Tour Image"}
                  fill
                  className={hasHighResImages ? "object-cover object-left" : "object-contain p-4"}
                  quality={100}
                  sizes={hasHighResImages ? "33vw" : "(max-width: 1024px) 0vw, 500px"}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="h-12 w-12 mx-auto mb-2 flex items-center justify-center text-2xl">📍</div>
                    <p className="font-semibold">{isAccommodation ? 'Hotel Location Map' : 'Tour Route Map'}</p>
                    <p className="text-sm">Map will be available soon</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Image Gallery - Right Side - 2/3 of space, same height as map */}
            <div 
              className={`relative ${hasHighResImages ? 'w-2/3 h-full rounded-lg overflow-hidden shadow-lg' : 'flex-1 h-full'} bg-white`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                key={selectedImageIndex}
                src={carouselImages[selectedImageIndex] || carouselImages[0]}
                alt={product.name}
                fill
                className={hasHighResImages ? "object-cover" : "object-contain"}
                priority
                quality={100}
                sizes={hasHighResImages ? "72vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1000px"}
              />
            
            {/* Navigation buttons - only show if more than 1 real image */}
            {showCarouselControls && (
            <>
              <button
                onClick={() => setSelectedImageIndex((selectedImageIndex - 1 + carouselImages.length) % carouselImages.length)}
                className="absolute left-12 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
                aria-label="Previous image"
              >
                <span className="text-xl">‹</span>
              </button>
              <button
                onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % carouselImages.length)}
                className="absolute right-12 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
                aria-label="Next image"
              >
                <span className="text-xl">›</span>
              </button>
              
              {/* Image counter */}
              <div className="absolute top-8 right-8 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {selectedImageIndex + 1} / {carouselImages.length}
              </div>
              
              {/* Dot indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === selectedImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
            </div>
          </div>
        </div>
        
        {/* Title overlay - removed as title is now above the gallery */}
        {/* <div className="absolute bottom-0 left-0 lg:left-1/3 right-0 bg-gradient-to-t from-black/80 to-transparent">
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
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <span className="flex items-center gap-2 text-lg">
                  <span className="text-lg">🕒</span>
                  {product.periods ? `${product.periods + 1} days` : '7 days'}
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <span className="text-lg">👥</span>
                  Small Group Tour
                </span>
                <span className="flex items-center gap-2 text-lg">
                  <span className="text-lg">📍</span>
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
                    href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}&inquiry=best-rates`}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-lg text-lg"
                  >
                    Contact Us for Best Rates
                  </Link>
                ) : (
                  <Link 
                    href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg text-lg"
                  >
                    Request Quote
                  </Link>
                )}
                <a 
                  href="#overview"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg text-lg inline-block"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div> */}
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content with tabs */}
            <div className="lg:col-span-2">
              <div id="overview" className="bg-white rounded-lg shadow">
                <Tabs defaultValue="introduction" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 rounded-t-lg h-12">
                    <TabsTrigger value="introduction" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">{isAccommodation ? 'Overview' : 'Introduction'}</TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">{isAccommodation ? 'Rooms' : 'Details'}</TabsTrigger>
                    <TabsTrigger value="inclusions" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">{isAccommodation ? 'Inclusions' : 'Inclusions'}</TabsTrigger>
                    <TabsTrigger value="pricing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">{isAccommodation ? 'Rates' : 'Pricing'}</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-6">
                    <TabsContent value="introduction" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">{isAccommodation ? 'Hotel Overview' : 'Tour Introduction'}</h2>
                      <div className="prose max-w-none">
                        {product.content?.details ? (
                          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {product.content.details}
                          </div>
                        ) : (
                          <p className="text-gray-700">Detailed itinerary available upon request.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">{isAccommodation ? 'Room Details' : 'Tour Details'}</h2>
                      <div className="prose max-w-none">
                        {product.content?.introduction ? (
                          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {product.content.introduction}
                          </div>
                        ) : (
                          <p className="text-gray-700">{product.description}</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="inclusions" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">What's Included</h2>
                      <div className="prose max-w-none">
                        {product.content?.inclusions ? (
                          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {product.content.inclusions}
                          </div>
                        ) : (
                          <p className="text-gray-700">Please contact us for detailed inclusions.</p>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="pricing" className="mt-0">
                      <h2 className="text-2xl font-bold mb-4 text-amber-600">Pricing & Availability</h2>
                      <div className="space-y-4">
                        <PricingCalendar 
                          productCode={product.code}
                          onDateSelect={(date, pricing) => {
                            console.log('Selected date:', date, 'with pricing:', pricing)
                            // Navigate to contact page with pre-selected date for best rates inquiry
                            const contactUrl = `/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}&date=${date}&inquiry=best-rates`
                            router.push(contactUrl)
                          }}
                        />
                        
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-800 mb-2">Payment Information</h4>
                          <div className="text-sm text-blue-700 space-y-1">
                            <div>• 30% deposit required at booking</div>
                            <div>• Final payment (70%) due 60 days before departure</div>
                            <div>• All prices are per person and subject to availability</div>
                            <div>• Children's pricing available (varies by age)</div>
                            <div>• Departures are typically on {product.description || 'scheduled days'}</div>
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
                <h3 className="text-xl font-bold text-center mb-4 text-amber-600">{isAccommodation ? '🏨 Book This Hotel' : '🎯 Book This Adventure'}</h3>
                
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
                  {(() => {
                    // Check if product has pricing
                    const hasRates = product.rates?.find(rate => {
                      const rateValue = rate.twinRateTotal || rate.twinRate || 0
                      return (typeof rateValue === 'string' ? parseFloat(rateValue) : rateValue) > 0
                    });
                    
                    // Show appropriate button based on pricing and availability
                    if (hasRates && hasAvailableDates === true) {
                      // Has pricing AND available dates - show Contact for Best Rates
                      return (
                        <Link 
                          href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}&inquiry=best-rates`}
                          className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 text-center rounded-lg"
                        >
                          📞 Contact Us for Best Rates
                        </Link>
                      );
                    } else if (hasRates && hasAvailableDates === false) {
                      // Has pricing but NO available dates - show Get Quote
                      return (
                        <Link 
                          href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}&reason=no-availability`}
                          className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 text-center rounded-lg"
                        >
                          📧 Get Quote - No Available Dates
                        </Link>
                      );
                    } else if (hasAvailableDates === null) {
                      // Still checking availability - show loading state
                      return (
                        <div className="block w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white font-bold py-4 text-center rounded-lg">
                          ⏳ Checking Availability...
                        </div>
                      );
                    } else {
                      // No pricing or other issues - show Request Quote
                      return (
                        <Link 
                          href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}`}
                          className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 text-center rounded-lg"
                        >
                          📧 Request Quote
                        </Link>
                      );
                    }
                  })()}
                  
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
                          <span className="text-sm inline mr-1">📥</span>
                          PDF
                        </a>
                      ))
                    ) : (
                      <button className="border border-amber-200 hover:bg-amber-50 px-3 py-2 rounded text-sm">
                        <span className="text-sm inline mr-1">📥</span>
                        PDF Guide
                      </button>
                    )}
                    
                    <Link 
                      href={`/contact?tour=${product.code}&name=${encodeURIComponent(product.name)}&inquiry=best-rates`}
                      className="border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded text-sm block text-center"
                    >
                      💬 Best Rates
                    </Link>
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 text-sm text-gray-600 text-center">
                  <p className="font-semibold mb-2 text-amber-600">Need Help?</p>
                  <p>Call: +61 2 9664 9187</p>
                  <p>Email: sales@thisisafrica.com.au</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brochure Download Banner */}
      <section className="relative py-16 mt-12">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/products/rsz_leopard-in-tree.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover more African adventures
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Download our comprehensive 2025 brochure featuring all our tours, 
            exclusive packages, and expert travel tips for your African journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pdfs/products/Brochure-2025-Web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
            >
              <span className="mr-2">📥</span>
              Download 2025 brochure
            </a>
            <Link
              href="/contact?subject=brochure-request"
              className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors"
            >
              <span className="mr-2">✉️</span>
              Request printed copy
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}