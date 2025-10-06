import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN, // Add token for write operations
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.supplierName) {
      return NextResponse.json(
        { success: false, error: 'supplierName is required' },
        { status: 400 }
      )
    }

    // Create the accommodation supplier document
    const doc = {
      _type: 'accommodationSupplier',
      supplierName: body.supplierName,
      supplierCode: body.supplierCode || null,
      description: body.description || null,
      location: body.location || null,
      type: body.type || null,
      category: body.category || null,
      associatedProductCodes: body.associatedProductCodes || [],
      amenities: body.amenities || [],
      active: body.active !== undefined ? body.active : true,
      featured: body.featured || false,
      sortOrder: body.sortOrder || null,
      notes: body.notes || null,
    }

    const result = await client.create(doc)

    return NextResponse.json({
      success: true,
      data: result,
      message: `Accommodation supplier "${body.supplierName}" created successfully`
    })
  } catch (error) {
    console.error('Error creating accommodation supplier:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create accommodation supplier',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Cache for 5 minutes
export const revalidate = 300