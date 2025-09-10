import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false, // Disable CDN to get immediate updates when images are added
})

export interface SanityProductImage {
  _id: string
  productCode: string
  productName?: string
  primaryImage?: {
    asset: {
      _ref: string
      url: string
    }
    alt: string
  }
  gallery?: Array<{
    _key: string
    image: {
      asset: {
        _ref: string
        url: string
      }
    }
    alt?: string
    caption?: string
    order?: number
  }>
  mapImage?: {
    asset: {
      _ref: string
      url: string
    }
    alt?: string
  }
  thumbnailImage?: {
    asset: {
      _ref: string
      url: string
    }
    alt?: string
  }
  active: boolean
}

export async function getProductImages(productCode: string): Promise<SanityProductImage | null> {
  try {
    const query = `
      *[_type == "productImage" && productCode == $productCode && active == true][0] {
        _id,
        productCode,
        productName,
        primaryImage {
          asset-> {
            _ref,
            url
          },
          alt
        },
        gallery[] {
          _key,
          _type,
          ...(_type == "image" => {
            asset-> {
              _ref,
              url
            },
            alt,
            caption,
            order
          }),
          ...(_type == "galleryImage" => {
            image {
              asset-> {
                _ref,
                url
              }
            },
            alt,
            caption,
            order
          })
        },
        mapImage {
          asset-> {
            _ref,
            url
          },
          alt
        },
        thumbnailImage {
          asset-> {
            _ref,
            url
          },
          alt
        },
        active
      }
    `
    
    const result = await client.fetch(query, { productCode })
    return result
  } catch (error) {
    console.error('Error fetching product images from Sanity:', error)
    return null
  }
}

export async function getAllProductImages(): Promise<SanityProductImage[]> {
  try {
    const query = `
      *[_type == "productImage" && active == true] {
        _id,
        productCode,
        productName,
        primaryImage {
          asset-> {
            _ref,
            url
          },
          alt
        },
        gallery[] {
          _key,
          _type,
          ...(_type == "image" => {
            asset-> {
              _ref,
              url
            },
            alt,
            caption,
            order
          }),
          ...(_type == "galleryImage" => {
            image {
              asset-> {
                _ref,
                url
              }
            },
            alt,
            caption,
            order
          })
        },
        mapImage {
          asset-> {
            _ref,
            url
          },
          alt
        },
        thumbnailImage {
          asset-> {
            _ref,
            url
          },
          alt
        },
        active
      } | order(productCode asc)
    `
    
    const result = await client.fetch(query)
    return result || []
  } catch (error) {
    console.error('Error fetching all product images from Sanity:', error)
    return []
  }
}