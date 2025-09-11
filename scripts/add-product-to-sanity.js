import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-10-01',
  useCdn: false,
})

async function addProduct() {
  const productCode = 'CPTACPOR002PORTST'
  
  try {
    // Check if product already exists
    const existing = await client.fetch(
      `*[_type == "productImage" && productCode == $productCode][0]`,
      { productCode }
    )
    
    if (existing) {
      console.log(`✅ Product ${productCode} already exists with ID: ${existing._id}`)
      console.log('Current status:', {
        active: existing.active,
        hasImages: !!(existing.primaryImage || existing.gallery?.length > 0)
      })
      return
    }
    
    // Create new product
    const newProduct = {
      _type: 'productImage',
      productCode: productCode,
      productName: 'Cape Town Accommodation - Portswood Hotel',
      active: true,
      // Empty image fields - to be filled in Sanity Studio
      primaryImage: null,
      gallery: [],
      mapImage: null,
      thumbnailImage: null,
      tags: []
    }
    
    const result = await client.create(newProduct)
    console.log(`✅ Successfully created product ${productCode}`)
    console.log(`📝 Document ID: ${result._id}`)
    console.log(`🔗 Edit in Sanity Studio: https://book.thisisafrica.com.au/studio/structure/productImage;${result._id}`)
    
  } catch (error) {
    console.error('❌ Error creating product:', error)
  }
}

// Run the script
addProduct()