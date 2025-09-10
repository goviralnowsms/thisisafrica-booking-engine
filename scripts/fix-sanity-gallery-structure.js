/**
 * Script to fix the gallery structure in Sanity productImage documents
 * Transforms direct image type items to galleryImage objects
 */

const { createClient } = require('@sanity/client')
require('dotenv').config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-09-04',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function fixGalleryStructure() {
  console.log('🔍 Fetching productImage documents with gallery items...')
  
  try {
    // Fetch all productImage documents with gallery items
    const query = `*[_type == "productImage" && defined(gallery) && count(gallery) > 0]`
    const documents = await client.fetch(query)
    
    console.log(`📊 Found ${documents.length} documents with gallery items`)
    
    let fixedCount = 0
    let errorCount = 0
    
    for (const doc of documents) {
      console.log(`\n📝 Processing document: ${doc.productCode} (${doc._id})`)
      
      // Check if gallery needs fixing
      const needsFix = doc.gallery.some(item => item._type === 'image')
      
      if (!needsFix) {
        console.log('  ✅ Gallery structure is already correct')
        continue
      }
      
      console.log(`  ⚠️ Found ${doc.gallery.length} gallery items that need fixing`)
      
      // Transform the gallery items
      const fixedGallery = doc.gallery.map((item, index) => {
        if (item._type === 'image') {
          // Transform direct image to galleryImage object
          console.log(`    🔄 Transforming item ${index + 1}: ${item.alt || 'No alt text'}`)
          return {
            _type: 'galleryImage',
            _key: item._key || `fixed-${Date.now()}-${index}`,
            image: {
              _type: 'image',
              asset: item.asset,
            },
            alt: item.alt,
            caption: item.caption,
            order: item.order
          }
        }
        // Item is already in correct format
        return item
      })
      
      // Update the document
      try {
        await client
          .patch(doc._id)
          .set({ gallery: fixedGallery })
          .commit()
        
        console.log('  ✅ Successfully fixed gallery structure')
        fixedCount++
      } catch (error) {
        console.error(`  ❌ Error updating document: ${error.message}`)
        errorCount++
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 Migration Summary:')
    console.log(`  ✅ Fixed: ${fixedCount} documents`)
    console.log(`  ❌ Errors: ${errorCount} documents`)
    console.log(`  📝 Total: ${documents.length} documents`)
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

// Run the migration
console.log('🚀 Starting Sanity gallery structure fix...')
console.log('='.repeat(50))
fixGalleryStructure()
  .then(() => {
    console.log('\n✨ Migration complete!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  })