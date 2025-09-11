/**
 * Migration script to fix Sanity CMS Tags field
 * Converts string-based tags to object-based tags for consistency
 * Run this after updating the galleryImage schema
 */

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

async function migrateTagsToObjectFormat() {
  console.log('🔍 Starting tags migration...')
  
  try {
    // Find all galleryImage documents with string-based tags
    console.log('📋 Fetching galleryImage documents with string-based tags...')
    const galleryImages = await client.fetch(`
      *[_type == "galleryImage" && defined(tags) && count(tags[]) > 0] {
        _id,
        _rev,
        title,
        tags
      }
    `)
    
    console.log(`📊 Found ${galleryImages.length} galleryImage documents to check`)
    
    let migratedCount = 0
    let skippedCount = 0
    
    for (const doc of galleryImages) {
      console.log(`\n🔍 Checking document: ${doc.title} (${doc._id})`)
      
      // Check if tags are strings (need migration) or objects (already correct)
      const needsMigration = doc.tags.some(tag => typeof tag === 'string')
      
      if (!needsMigration) {
        console.log(`✅ Document "${doc.title}" already has object-based tags, skipping`)
        skippedCount++
        continue
      }
      
      // Convert string tags to object format
      const newTags = doc.tags.map(tag => {
        if (typeof tag === 'string') {
          return {
            _type: 'tag',
            value: tag
          }
        }
        // If it's already an object, keep it as is
        return tag
      })
      
      console.log(`🔄 Migrating tags for "${doc.title}":`)
      console.log(`   Old tags:`, doc.tags)
      console.log(`   New tags:`, newTags)
      
      // Update the document
      try {
        await client.patch(doc._id).set({ tags: newTags }).commit()
        console.log(`✅ Successfully migrated tags for "${doc.title}"`)
        migratedCount++
      } catch (error) {
        console.error(`❌ Failed to migrate tags for "${doc.title}":`, error.message)
      }
    }
    
    console.log(`\n📊 Migration Summary:`)
    console.log(`   ✅ Successfully migrated: ${migratedCount} documents`)
    console.log(`   ⏭️  Skipped (already correct): ${skippedCount} documents`)
    console.log(`   📋 Total checked: ${galleryImages.length} documents`)
    
    // Also check productImage documents for consistency
    console.log('\n🔍 Checking productImage documents for tag consistency...')
    const productImages = await client.fetch(`
      *[_type == "productImage" && defined(tags) && count(tags[]) > 0] {
        _id,
        productCode,
        productName,
        tags
      }
    `)
    
    console.log(`📊 Found ${productImages.length} productImage documents with tags`)
    
    let productIssues = 0
    for (const doc of productImages) {
      const hasStringTags = doc.tags.some(tag => typeof tag === 'string')
      if (hasStringTags) {
        console.log(`⚠️  ProductImage "${doc.productCode}" has string-based tags that need migration`)
        productIssues++
      }
    }
    
    if (productIssues === 0) {
      console.log('✅ All productImage documents have correct object-based tags')
    } else {
      console.log(`⚠️  Found ${productIssues} productImage documents with string-based tags`)
      console.log('🔄 Now migrating productImage documents...')
      
      // Migrate productImage documents
      let productMigratedCount = 0
      for (const doc of productImages) {
        const hasStringTags = doc.tags.some(tag => typeof tag === 'string')
        if (hasStringTags) {
          console.log(`\n🔄 Migrating productImage: ${doc.productCode}`)
          
          // Convert string tags to object format
          const newTags = doc.tags.map(tag => {
            if (typeof tag === 'string') {
              return {
                _type: 'tag',
                value: tag
              }
            }
            return tag
          })
          
          try {
            await client.patch(doc._id).set({ tags: newTags }).commit()
            console.log(`✅ Successfully migrated tags for "${doc.productCode}"`)
            productMigratedCount++
          } catch (error) {
            console.error(`❌ Failed to migrate tags for "${doc.productCode}":`, error.message)
          }
        }
      }
      
      console.log(`\n📊 ProductImage Migration Summary:`)
      console.log(`   ✅ Successfully migrated: ${productMigratedCount} productImage documents`)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

async function main() {
  console.log('🚀 Sanity Tags Migration Tool')
  console.log('================================')
  
  // Check if we have the required environment variables
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable')
    process.exit(1)
  }
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN environment variable')
    console.log('💡 You need a Sanity API token with write permissions.')
    console.log('   Create one at: https://sanity.io/manage')
    process.exit(1)
  }
  
  console.log(`🔗 Connected to Sanity project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`)
  console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}`)
  
  await migrateTagsToObjectFormat()
  
  console.log('\n🎉 Migration completed!')
  console.log('💡 You can now edit the Tags field in Sanity Studio without the "Invalid list values" error')
}

// Run the migration
main().catch(console.error)