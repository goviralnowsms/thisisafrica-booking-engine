import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const supplierName = searchParams.get('supplierName')
    const productCode = searchParams.get('productCode')

    let query = ''
    let params: any = {}

    if (supplierName) {
      // Search by supplier name (case insensitive)
      query = `*[_type == "accommodationSupplier" && supplierName match $supplierName && active == true][0]{
        supplierName,
        supplierCode,
        "primaryImageUrl": primaryImage.asset->url,
        "primaryImageAlt": primaryImage.alt,
        "gallery": gallery[]{
          "url": image.asset->url,
          "alt": alt,
          "caption": caption,
          order
        },
        description,
        location,
        type,
        category,
        associatedProductCodes,
        amenities
      }`
      params = { supplierName: `*${supplierName}*` }
    } else if (productCode) {
      // Search by associated product code
      query = `*[_type == "accommodationSupplier" && $productCode in associatedProductCodes && active == true][0]{
        supplierName,
        supplierCode,
        "primaryImageUrl": primaryImage.asset->url,
        "primaryImageAlt": primaryImage.alt,
        "gallery": gallery[]{
          "url": image.asset->url,
          "alt": alt,
          "caption": caption,
          order
        },
        description,
        location,
        type,
        category,
        associatedProductCodes,
        amenities
      }`
      params = { productCode }
    } else {
      // Get all active suppliers
      query = `*[_type == "accommodationSupplier" && active == true] | order(featured desc, sortOrder asc, supplierName asc){
        supplierName,
        supplierCode,
        "primaryImageUrl": primaryImage.asset->url,
        "primaryImageAlt": primaryImage.alt,
        description,
        location,
        type,
        category,
        associatedProductCodes,
        featured,
        sortOrder
      }`
      params = {}
    }

    const result = await client.fetch(query, params)

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error fetching accommodation suppliers:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch accommodation suppliers'
      },
      { status: 500 }
    )
  }
}

// Cache for 5 minutes
export const revalidate = 300