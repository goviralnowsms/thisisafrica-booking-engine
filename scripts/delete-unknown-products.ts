// Script to delete unknown products from Sanity that don't exist in TourPlan
// Run with: npx tsx scripts/delete-unknown-products.ts

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import * as fs from 'fs'
import * as readline from 'readline'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim())
    })
  })
}

async function deleteUnknownProducts() {
  console.log('🗑️  Delete Unknown Products from Sanity\n')
  
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
    
    console.log(`Found ${products.length} products to delete:\n`)
    products.forEach(p => {
      console.log(`  - ${p.productCode}: ${p.productName || 'No name'}`)
    })
    
    console.log('\n⚠️  WARNING: This action cannot be undone!')
    const answer = await askQuestion('\nAre you sure you want to delete these products? (yes/no): ')
    
    if (answer !== 'yes' && answer !== 'y') {
      console.log('\n❌ Deletion cancelled.')
      return
    }
    
    console.log('\n🗑️  Deleting products...')
    
    let successCount = 0
    let errorCount = 0
    
    for (const id of productIds) {
      try {
        await client.delete(id)
        console.log(`✅ Deleted: ${id}`)
        successCount++
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 50))
      } catch (error) {
        console.error(`❌ Failed to delete ${id}:`, error)
        errorCount++
      }
    }
    
    console.log('\n📊 Results:')
    console.log(`✅ Successfully deleted: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    
    // Clean up the JSON file
    if (successCount > 0) {
      fs.unlinkSync('scripts/products-to-delete.json')
      console.log('\n🧹 Cleaned up products-to-delete.json')
    }
    
  } catch (error) {
    console.error('❌ Error deleting products:', error)
  } finally {
    rl.close()
  }
}

// Run the script
deleteUnknownProducts()
  .then(() => {
    console.log('\n✨ Script completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })