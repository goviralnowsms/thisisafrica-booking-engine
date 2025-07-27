// scripts/create-image-index.js
// Simple script to create image index from database without downloading images

const mysql = require('mysql2/promise')
const fs = require('fs').promises
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Database configuration from environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

const IMAGE_INDEX_FILE = path.join(__dirname, '../public/images/product-image-index.json')
const LOCAL_IMAGE_DIR = path.join(__dirname, '../public/images/products')

async function createImageIndex() {
  console.log('🔍 Creating image index from database...')
  
  let connection
  const imageIndex = {}
  
  try {
    // Connect to database
    connection = await mysql.createConnection(DB_CONFIG)
    console.log('✅ Connected to WordPress database')
    
    // Get image mappings
    const [rows] = await connection.execute(`
      SELECT optioncode, image_name, id
      FROM af_product_images 
      WHERE status = '1' 
      ORDER BY optioncode, id
    `)
    
    console.log(`📋 Found ${rows.length} image mappings`)
    
    // Check which images actually exist locally
    let foundImages = 0
    let missingImages = 0
    
    for (const row of rows) {
      const { optioncode, image_name, id } = row
      
      // Check if image file exists locally
      const localPath = path.join(LOCAL_IMAGE_DIR, image_name)
      let exists = false
      
      try {
        await fs.access(localPath)
        exists = true
        foundImages++
      } catch {
        missingImages++
        console.log(`⚠️  Missing: ${image_name}`)
      }
      
      // Add to index
      if (!imageIndex[optioncode]) {
        imageIndex[optioncode] = []
      }
      
      imageIndex[optioncode].push({
        originalName: image_name,
        localFilename: image_name, // Same filename since you copied directly
        localPath: exists ? `/images/products/${image_name}` : null,
        id,
        status: exists ? 'exists' : 'missing'
      })
    }
    
    // Save index
    await fs.writeFile(
      IMAGE_INDEX_FILE,
      JSON.stringify(imageIndex, null, 2),
      'utf8'
    )
    
    console.log('\n📊 Index Creation Summary:')
    console.log(`Total mappings: ${rows.length}`)
    console.log(`Images found locally: ${foundImages}`)
    console.log(`Images missing: ${missingImages}`)
    console.log(`Product codes with images: ${Object.keys(imageIndex).length}`)
    console.log(`Index saved to: ${IMAGE_INDEX_FILE}`)
    
    // Show sample product codes
    const codesWithImages = Object.keys(imageIndex).filter(code => 
      imageIndex[code].some(img => img.status === 'exists')
    )
    
    console.log(`\n🎯 Sample product codes with images:`)
    console.log(codesWithImages.slice(0, 10).join(', '))
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the script
createImageIndex()