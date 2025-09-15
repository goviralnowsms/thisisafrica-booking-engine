// Product image utility functions for efficient image loading
// Uses local images for search results (fast) and Sanity for product details (high-res)

let imageMap: Map<string, string> | null = null
let imageMapPromise: Promise<Map<string, string>> | null = null

// Load and cache the image mapping (lazy loaded)
function loadImageMap(): Promise<Map<string, string>> {
  if (imageMap) return Promise.resolve(imageMap)
  if (imageMapPromise) return imageMapPromise
  
  imageMapPromise = (async () => {
    try {
      // Dynamically import the JSON to avoid build-time issues
      const productImageIndex = await import('@/public/images/product-image-index.json')
      imageMap = new Map<string, string>()
      
      Object.entries(productImageIndex.default).forEach(([productCode, images]) => {
        if (Array.isArray(images) && images.length > 0) {
          // Use the first image as the primary image
          const primaryImage = images[0]
          if (primaryImage && primaryImage.localPath) {
            imageMap.set(productCode, primaryImage.localPath)
          }
        }
      })
      
      return imageMap
    } catch (error) {
      console.error('Error loading product image index:', error)
      // Return empty map on error
      imageMap = new Map<string, string>()
      return imageMap
    }
  })()
  
  return imageMapPromise
}

/**
 * Get local product image for search results (optimized for speed)
 * Now loads mapping on-demand rather than blocking component mount
 */
export async function getLocalProductImage(productCode: string): Promise<string> {
  try {
    const map = await loadImageMap()
    
    // Check if we have a mapped image for this product code
    const mappedImage = map.get(productCode)
    if (mappedImage) {
      return mappedImage
    }
  } catch (error) {
    console.warn('Failed to load image map, using fallback:', error)
  }
  
  // Fallback based on product type (using product code prefix)
  return getProductTypeFallbackImage(productCode)
}

/**
 * Synchronous version that immediately returns fallback if no map is loaded
 * This prevents blocking and ensures images always render quickly
 */
export function getLocalProductImageSync(productCode: string | undefined, preloadedMap?: Map<string, string>): string {
  // If we have a preloaded map, use it
  if (preloadedMap && preloadedMap.size > 0) {
    const mappedImage = preloadedMap.get(productCode)
    if (mappedImage) {
      return mappedImage
    }
  }
  
  // If we have the cached map, use it
  if (imageMap && imageMap.size > 0) {
    const mappedImage = imageMap.get(productCode)
    if (mappedImage) {
      return mappedImage
    }
  }
  
  // Safety check for undefined productCode
  if (!productCode) {
    return '/images/products/accommodation-hero.jpg'
  }

  // For group tours, try using an actual product image that's likely to be cached
  // instead of fallback to reduce simultaneous image requests
  if (productCode.startsWith('NBO') || productCode.startsWith('ARK') || productCode.startsWith('DAR') || productCode.includes('GT')) {
    // Use a specific product image that should load quickly
    return '/images/products/1522221588867576.jpg'
  }
  
  // Always return immediate fallback - never block rendering
  return getProductTypeFallbackImage(productCode)
}

/**
 * Get fallback image based on product type
 * Using smaller product images instead of large hero images for faster loading
 */
function getProductTypeFallbackImage(productCode: string): string {
  if (productCode.startsWith('BBK') || productCode.includes('CR')) {
    // Cruise products - use smaller product image
    return '/images/products/1056674876420386.jpg'
  } else if (productCode.startsWith('NBO') || productCode.startsWith('ARK') || productCode.startsWith('DAR') || productCode.includes('GT')) {
    // Group tours - use smaller product image  
    return '/images/products/1001187777125043.jpg'
  } else if (productCode.includes('RL') || productCode.includes('RAIL')) {
    // Rail products - use smaller product image
    return '/images/products/1007857754228357.jpg'
  } else if (productCode.includes('AC') || productCode.includes('HT')) {
    // Accommodation - use smaller product image
    return '/images/products/100950688398955.jpg'
  } else if (productCode.includes('PK')) {
    // Packages - keep packages-hero.jpg as it's working well
    return '/images/products/packages-hero.jpg'
  }
  
  // Ultimate fallback - use a small generic product image
  return '/images/products/1035426787412259.jpg'
}

/**
 * Get all images for a product (used in search results if needed)
 */
export async function getLocalProductImages(productCode: string): Promise<string[]> {
  try {
    const productImageIndex = await import('@/public/images/product-image-index.json')
    const productImages = (productImageIndex.default as any)[productCode]
    
    if (productImages && Array.isArray(productImages)) {
      return productImages
        .filter((img: any) => img.localPath)
        .map((img: any) => img.localPath)
    }
  } catch (error) {
    console.error('Error loading product images:', error)
  }
  
  // Return single fallback image as array
  const fallback = await getLocalProductImage(productCode)
  return [fallback]
}

/**
 * Preload image map in background (non-blocking)
 * Call this in useEffect to start loading but don't wait for it
 */
export function preloadImageMapBackground(): void {
  loadImageMap().catch(error => {
    console.warn('Background image map preload failed:', error)
  })
}

/**
 * Preload image map for use in components (blocking)
 * Only use this when you need the map immediately
 */
export async function preloadImageMap(): Promise<Map<string, string>> {
  return loadImageMap()
}

/**
 * Check if a product has local images available
 */
export async function hasLocalProductImages(productCode: string): Promise<boolean> {
  const map = await loadImageMap()
  return map.has(productCode)
}

/**
 * Get image dimensions hint for Next.js Image optimization
 * Returns smaller dimensions for search results, larger for details
 */
export function getImageDimensions(context: 'search' | 'detail') {
  if (context === 'search') {
    return { width: 600, height: 400 }
  }
  return { width: 1200, height: 800 }
}