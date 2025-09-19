// Script to analyze and optionally delete unknown products from Sanity
// Run with: npx tsx scripts/analyze-unknown-products.ts

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Test product codes against TourPlan API
async function checkProductInTourPlan(productCode: string): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3003/api/tourplan/product/' + productCode)
    const data = await response.json()
    return response.ok && data.data && !data.error
  } catch (error) {
    return false
  }
}

async function analyzeUnknownProducts() {
  console.log('🔍 Analyzing unknown products in Sanity...\n')
  
  try {
    // Fetch all products with unknown or missing productType
    const unknownProducts = await client.fetch(
      `*[_type == "productImage" && (!defined(productType) || productType == "unknown" || productType == null)] | order(productCode asc) {
        _id,
        productCode,
        productName,
        productType,
        active,
        "hasImage": defined(primaryImage)
      }`
    )
    
    if (unknownProducts.length === 0) {
      console.log('✅ No unknown products found in Sanity!')
      return
    }
    
    console.log(`Found ${unknownProducts.length} unknown products:\n`)
    console.log('Code                    | Name                                     | Has Image | In TourPlan')
    console.log('------------------------|------------------------------------------|-----------|------------')
    
    const productsToDelete = []
    
    for (const product of unknownProducts) {
      const existsInTourPlan = await checkProductInTourPlan(product.productCode)
      
      const code = product.productCode.padEnd(23)
      const name = (product.productName || 'No name').substring(0, 40).padEnd(40)
      const hasImage = product.hasImage ? 'Yes' : 'No '
      const inTourPlan = existsInTourPlan ? '✅ Yes' : '❌ No'
      
      console.log(`${code} | ${name} | ${hasImage}       | ${inTourPlan}`)
      
      if (!existsInTourPlan) {
        productsToDelete.push(product)
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log('\n📊 Summary:')
    console.log(`- Total unknown products: ${unknownProducts.length}`)
    console.log(`- Products NOT in TourPlan: ${productsToDelete.length}`)
    console.log(`- Products WITH images: ${unknownProducts.filter(p => p.hasImage).length}`)
    
    if (productsToDelete.length > 0) {
      console.log('\n⚠️  The following products do NOT exist in TourPlan and could be deleted:')
      productsToDelete.forEach(p => {
        console.log(`  - ${p.productCode}: ${p.productName || 'No name'}`)
      })
      
      // Ask for confirmation to delete
      console.log('\n❓ Would you like to delete these products from Sanity?')
      console.log('   To delete, run: npx tsx scripts/delete-unknown-products.ts')
      
      // Save the list for the delete script
      const fs = await import('fs')
      await fs.promises.writeFile(
        'scripts/products-to-delete.json',
        JSON.stringify(productsToDelete.map(p => p._id), null, 2)
      )
      console.log('\n💾 Product IDs saved to scripts/products-to-delete.json')
    }
    
  } catch (error) {
    console.error('❌ Error analyzing products:', error)
  }
}

// Run the script
analyzeUnknownProducts()
  .then(() => {
    console.log('\n✨ Analysis complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })