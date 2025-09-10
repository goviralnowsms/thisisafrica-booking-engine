import { NextRequest, NextResponse } from 'next/server'
import { getProductImages } from '@/lib/sanity/productImages'

export async function GET(
  request: NextRequest,
  { params }: { params: { productCode: string } }
) {
  try {
    const { productCode } = params

    if (!productCode) {
      return NextResponse.json(
        { error: 'Product code is required' },
        { status: 400 }
      )
    }

    const productImages = await getProductImages(productCode)

    if (!productImages) {
      return NextResponse.json(
        { 
          success: true, 
          data: null,
          message: 'No images found for this product code in Sanity'
        },
        { status: 200 }
      )
    }

    // Process the images to return them in a format suitable for the frontend
    const processedImages = {
      productCode: productImages.productCode,
      productName: productImages.productName,
      primaryImage: productImages.primaryImage?.asset?.url || null,
      mapImage: productImages.mapImage?.asset?.url || null,
      thumbnailImage: productImages.thumbnailImage?.asset?.url || null,
      gallery: productImages.gallery
        ?.sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order field
        ?.map(item => ({
          url: item.image?.asset?.url,
          alt: item.alt || '',
          caption: item.caption || '',
          order: item.order || 0
        }))
        ?.filter(item => item.url) // Only include items with valid URLs
        || []
    }

    return NextResponse.json({
      success: true,
      data: processedImages
    })

  } catch (error) {
    console.error('Error in product images API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}