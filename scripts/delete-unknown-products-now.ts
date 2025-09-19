// Script to delete unknown products from Sanity (non-interactive)
// Run with: npx tsx scripts/delete-unknown-products-now.ts

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import * as fs from 'fs'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function deleteUnknownProducts() {
  console.log('🗑️  Deleting Unknown Products from Sanity\n')
  
  try {
    // Check if the products-to-delete.json file exists
    if (!fs.existsSync('scripts/products-to-delete.json')) {
      console.log('❌ No products-to-delete.json file found.')
      console.log('   Please run: npx tsx scripts/analyze-unknown-products.ts first')
      return
    }
    
    // Load the product IDs to delete
    const productIds = JSON.parse(
      fs.readFileSync('scripts/products-to-delete.json', 'utf-8')
    ) as string[]
    
    if (productIds.length === 0) {
      console.log('✅ No products to delete!')
      return
    }
    
    // Fetch the products to show what will be deleted
    const products = await client.fetch(
      `*[_id in $ids] {
        _id,
        productCode,
        productName,
        productType
      }`,
      { ids: productIds }
    )
    
    console.log(`Deleting ${products.length} unknown products:\n`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const product of products) {
      try {
        await client.delete(product._id)
        console.log(`✅ Deleted: ${product.productCode} - ${product.productName || 'No name'}`)
        successCount++
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 50))
      } catch (error) {
        console.error(`❌ Failed to delete ${product.productCode}:`, error)
        errorCount++
      }
    }
    
    console.log('\n📊 Results:')
    console.log(`✅ Successfully deleted: ${successCount} products`)
    console.log(`❌ Failed: ${errorCount}`)
    
    // Clean up the JSON file
    if (successCount > 0) {
      fs.unlinkSync('scripts/products-to-delete.json')
      console.log('🧹 Cleaned up products-to-delete.json')
    }
    
  } catch (error) {
    console.error('❌ Error deleting products:', error)
  }
}

// Run the script
deleteUnknownProducts()
  .then(() => {
    console.log('\n✨ All unknown products deleted successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })