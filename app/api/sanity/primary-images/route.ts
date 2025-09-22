import { NextRequest, NextResponse } from 'next/server'
import { getAllProductImages } from '@/lib/sanity/productImages'

export async function GET(request: NextRequest) {
  try {
    const allProductImages = await getAllProductImages()

    // Create a map of productCode -> primaryImage URL for fast lookups
    const primaryImageMap: Record<string, string> = {}

    allProductImages.forEach(product => {
      if (product.productCode && product.primaryImage?.asset?.url) {
        primaryImageMap[product.productCode] = product.primaryImage.asset.url
      }
    })

    return NextResponse.json({
      success: true,
      data: primaryImageMap,
      count: Object.keys(primaryImageMap).length
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      }
    })

  } catch (error) {
    console.error('Error in primary images API:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch primary images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}