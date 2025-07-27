// scripts/scan-local-images.js
// Simple script to scan local images without database connection

const fs = require('fs').promises
const path = require('path')

const LOCAL_IMAGE_DIR = path.join(__dirname, '../../public/images/products')
const IMAGE_INDEX_FILE = path.join(__dirname, '../../public/images/product-image-index.json')

async function scanLocalImages() {
  console.log('🔍 Scanning local images (no database required)...')
  
  try {
    // Check if images directory exists
    try {
      await fs.access(LOCAL_IMAGE_DIR)
    } catch {
      console.error(`❌ Images directory not found: ${LOCAL_IMAGE_DIR}`)
      console.log('📁 Make sure you have copied images to public/images/products/')
      return
    }
    
    // Read all files in the products directory
    const files = await fs.readdir(LOCAL_IMAGE_DIR)
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)
    })
    
    console.log(`📸 Found ${imageFiles.length} image files`)
    
    if (imageFiles.length === 0) {
      console.log('⚠️  No images found. Make sure to copy images to public/images/products/')
      return
    }
    
    // Create a basic index that can be used by the API
    // Since we don't have database mapping, we'll create a fallback system
    const imageIndex = {
      // Special entry for all available images
      "__all_images__": imageFiles.map(filename => ({
        originalName: filename,
        localFilename: filename,
        localPath: `/images/products/${filename}`,
        status: 'available',
        scannedAt: new Date().toISOString()
      })),
      
      // Example mappings - you can manually add known product codes here
      // "NBOGTARP001CKSE": [
      //   {
      //     originalName: "some_image.jpg", 
      //     localFilename: "some_image.jpg",
      //     localPath: "/images/products/some_image.jpg",
      //     status: "available"
      //   }
      // ]
    }
    
    // Try to create smart mappings based on filename patterns
    // Look for any patterns in filenames that might indicate product codes
    const smartMappings = {}
    
    for (const filename of imageFiles) {
      // Look for patterns like PRODUCTCODE_image.jpg or similar
      const nameWithoutExt = path.parse(filename).name
      
      // Try to extract potential product codes (adjust patterns as needed)
      const patterns = [
        /^([A-Z0-9]{8,})/i,           // Starts with 8+ alphanumeric chars
        /^([A-Z]{3}[A-Z0-9]{5,})/i,  // Starts with 3 letters + 5+ chars
        /([A-Z0-9]{6,})/i            // Contains 6+ alphanumeric chars
      ]
      
      for (const pattern of patterns) {
        const match = nameWithoutExt.match(pattern)
        if (match) {
          const potentialCode = match[1].toUpperCase()
          
          if (!smartMappings[potentialCode]) {
            smartMappings[potentialCode] = []
          }
          
          smartMappings[potentialCode].push({
            originalName: filename,
            localFilename: filename,
            localPath: `/images/products/${filename}`,
            status: 'auto-detected',
            pattern: pattern.toString()
          })
          break // Only use first matching pattern
        }
      }
    }
    
    // Add smart mappings to index
    Object.assign(imageIndex, smartMappings)
    
    // Save the index
    await fs.writeFile(
      IMAGE_INDEX_FILE,
      JSON.stringify(imageIndex, null, 2),
      'utf8'
    )
    
    console.log('\n📊 Local Image Scan Summary:')
    console.log(`Total images found: ${imageFiles.length}`)
    console.log(`Auto-detected product codes: ${Object.keys(smartMappings).length}`)
    console.log(`Index saved to: ${IMAGE_INDEX_FILE}`)
    
    // Show sample images
    console.log('\n🖼️ Sample images:')
    imageFiles.slice(0, 10).forEach(img => {
      console.log(`- ${img}`)
    })
    
    // Show auto-detected codes
    if (Object.keys(smartMappings).length > 0) {
      console.log('\n🎯 Auto-detected product codes:')
      Object.keys(smartMappings).slice(0, 10).forEach(code => {
        const count = smartMappings[code].length
        console.log(`- ${code} (${count} image${count > 1 ? 's' : ''})`)
      })
    }
    
    console.log('\n✅ Done! Your images are ready to use.')
    console.log('💡 You can manually edit the index file to map specific product codes to images.')
    
  } catch (error) {
    console.error('❌ Error scanning images:', error)
  }
}

// Run the scanner
scanLocalImages()