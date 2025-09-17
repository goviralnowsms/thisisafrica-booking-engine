import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

export interface ProductImage {
  productCode: string
  productName?: string
  primaryImage?: {
    asset: any
    alt?: string
  }
  gallery?: Array<{
    image: any
    alt?: string
    caption?: string
  }>
  thumbnailImage?: {
    asset: any
    alt?: string
  }
}

// Helper to build image URLs
export function urlFor(source: any) {
  if (!source) return null
  return builder.image(source)
}

// Fetch product image by code
export async function getProductImage(productCode: string): Promise<ProductImage | null> {
  if (!productCode) return null
  
  try {
    const query = `*[_type == "productImage" && productCode == $code][0]{
      productCode,
      productName,
      primaryImage {
        asset,
        alt
      },
      gallery[] {
        image {
          asset
        },
        alt,
        caption
      },
      thumbnailImage {
        asset,
        alt
      }
    }`
    
    const result = await client.fetch(query, { code: productCode })
    return result
  } catch (error) {
    console.error('Error fetching product image:', error)
    return null
  }
}

// Fetch multiple product images
export async function getProductImages(productCodes: string[]): Promise<Record<string, ProductImage>> {
  if (!productCodes || productCodes.length === 0) return {}
  
  try {
    const query = `*[_type == "productImage" && productCode in $codes]{
      productCode,
      productName,
      primaryImage {
        asset,
        alt
      },
      gallery[] {
        image {
          asset
        },
        alt,
        caption
      },
      thumbnailImage {
        asset,
        alt
      }
    }`
    
    const results = await client.fetch(query, { codes: productCodes })
    
    // Convert array to object keyed by product code
    const imageMap: Record<string, ProductImage> = {}
    results.forEach((result: ProductImage) => {
      if (result.productCode) {
        imageMap[result.productCode] = result
      }
    })
    
    return imageMap
  } catch (error) {
    console.error('Error fetching product images:', error)
    return {}
  }
}

// Get image URL with optional transformations
export function getImageUrl(
  image: any,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  }
): string | null {
  if (!image?.asset) return null
  
  let imageBuilder = urlFor(image)
  
  if (!imageBuilder) return null
  
  if (options?.width) imageBuilder = imageBuilder.width(options.width)
  if (options?.height) imageBuilder = imageBuilder.height(options.height)
  if (options?.quality) imageBuilder = imageBuilder.quality(options.quality)
  if (options?.format) imageBuilder = imageBuilder.format(options.format)
  if (options?.fit) imageBuilder = imageBuilder.fit(options.fit)
  
  return imageBuilder.url()
}

// Get optimized image URLs for different use cases
export function getOptimizedImageUrls(image: any) {
  if (!image?.asset) return null
  
  return {
    thumbnail: getImageUrl(image, { width: 400, height: 300, quality: 80, format: 'webp' }),
    card: getImageUrl(image, { width: 800, height: 600, quality: 85, format: 'webp' }),
    full: getImageUrl(image, { width: 1920, height: 1080, quality: 90, format: 'webp' }),
    original: getImageUrl(image)
  }
}

// Fallback images for different product types
export const fallbackImages = {
  accommodation: '/images/products/portswood-captains-suite.jpg',
  'day-tour': '/images/products/cape-town-day-tour.jpg',
  'group-tour': '/images/products/classic-kenya.jpg',
  cruise: '/images/products/zambezi-queen.jpg',
  rail: '/images/products/rovos-rail.jpg',
  package: '/images/products/safari-package.jpg',
  default: '/images/products/accomm-hero.jpg'
}

// Get fallback image for product type
export function getFallbackImage(productType?: string): string {
  if (!productType) return fallbackImages.default
  return fallbackImages[productType as keyof typeof fallbackImages] || fallbackImages.default
}