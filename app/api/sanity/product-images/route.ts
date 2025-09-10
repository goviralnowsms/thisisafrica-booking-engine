import { NextRequest, NextResponse } from 'next/server'
import { getAllProductImages } from '@/lib/sanity/productImages'

export async function GET(request: NextRequest) {
  try {
    const productImages = await getAllProductImages()

    if (!productImages || productImages.length === 0) {
      return NextResponse.json(
        { 
          success: true, 
          data: [],
          message: 'No product images found in Sanity'
        },
        { 
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            'CDN-Cache-Control': 'public, s-maxage=300'
          }
        }
      )
    }

    // Process the images to return them in a format suitable for the frontend
    const processedImages = productImages.map(item => ({
      productCode: item.productCode,
      productName: item.productName,
      primaryImage: item.primaryImage,
      thumbnailImage: item.thumbnailImage,
      active: item.active
    }))

    return NextResponse.json({
      success: true,
      data: processedImages
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=300'
      }
    })

  } catch (error) {
    console.error('Error fetching all product images:', error)
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