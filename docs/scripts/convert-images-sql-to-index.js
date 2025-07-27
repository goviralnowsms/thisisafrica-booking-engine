// scripts/convert-images-sql-to-index.js
// Convert image SQL dump to index without database connection

const fs = require('fs').promises
const path = require('path')

const SQL_FILE = 'af_product_images.sql'
const IMAGE_INDEX_FILE = path.join(__dirname, '../../public/images/product-image-index.json')
const LOCAL_IMAGE_DIR = path.join(__dirname, '../../public/images/products')

async function convertImageSqlToIndex() {
  console.log('🔍 Converting image SQL to index...')
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, SQL_FILE)
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log('📄 Image SQL file loaded')
    
    // Extract INSERT statements for af_product_images
    const insertRegex = /INSERT INTO [`']?af_product_images[`']? \([^)]+\) VALUES\s*((?:\([^)]+\),?\s*)+);/gis
    const imageIndex = {}
    const allImages = []
    let totalFound = 0
    let localFound = 0
    
    let match
    while ((match = insertRegex.exec(sqlContent)) !== null) {
      const valuesSection = match[1]
      
      // Parse each row in this INSERT statement
      const rowRegex = /\(([^)]+)\)/g
      let rowMatch
      
      while ((rowMatch = rowRegex.exec(valuesSection)) !== null) {
        const values = rowMatch[1].split(',').map(val => val.trim().replace(/^['"`]|['"`]$/g, ''))
        
        // Structure: id, optioncode, image_name, status, created_date
        if (values.length >= 4) {
          const [id, optioncode, imageName, status, date] = values
          
          // Clean up option code (remove trailing spaces)
          const cleanOptionCode = optioncode.trim()
          
          // Status can be '1' or 1 (with or without quotes)  
          const statusValue = status.toString().replace(/['"]/g, '')
          if (cleanOptionCode && imageName && statusValue === '1') {
            totalFound++
            
            // Check if image exists locally
            const localPath = path.join(LOCAL_IMAGE_DIR, imageName)
            let exists = false
            
            try {
              await fs.access(localPath)
              exists = true
              localFound++
            } catch {
              // Image doesn't exist locally
            }
            
            // Add to index
            if (!imageIndex[cleanOptionCode]) {
              imageIndex[cleanOptionCode] = []
            }
            
            const imageInfo = {
              originalName: imageName,
              localFilename: imageName,
              localPath: exists ? `/images/products/${imageName}` : null,
              id: parseInt(id) || 0,
              status: exists ? 'exists' : 'missing'
            }
            
            imageIndex[cleanOptionCode].push(imageInfo)
            if (exists) {
              allImages.push(imageInfo)
            }
          }
        }
      }
    }
    
    // Add all images list (only existing ones)
    imageIndex.__all_images__ = allImages
    
    // Save the index
    await fs.writeFile(
      IMAGE_INDEX_FILE,
      JSON.stringify(imageIndex, null, 2),
      'utf8'
    )
    
    console.log('\n📊 Image SQL Conversion Summary:')
    console.log(`Total database mappings: ${totalFound}`)
    console.log(`Images found locally: ${localFound}`)
    console.log(`Images missing: ${totalFound - localFound}`)
    console.log(`Product codes with images: ${Object.keys(imageIndex).filter(k => k !== '__all_images__').length}`)
    console.log(`Index saved to: ${IMAGE_INDEX_FILE}`)
    
    // Show some examples
    const codesWithImages = Object.keys(imageIndex).filter(code => 
      code !== '__all_images__' && imageIndex[code].some(img => img.status === 'exists')
    )
    
    console.log('\n🎯 Sample product codes with local images:')
    codesWithImages.slice(0, 10).forEach(code => {
      const imageCount = imageIndex[code].filter(img => img.status === 'exists').length
      console.log(`- ${code} (${imageCount} image${imageCount > 1 ? 's' : ''})`)
    })
    
    // Check for our test product
    const testCodes = ['NBOGTARP001CKSE', 'NBOGTARP001CKSO', 'ARKGTARP001SIMSE7']
    console.log('\n🔍 Checking test products:')
    testCodes.forEach(code => {
      if (imageIndex[code]) {
        console.log(`✅ ${code}: ${imageIndex[code].length} image(s)`)
        imageIndex[code].forEach(img => {
          console.log(`   - ${img.originalName} (${img.status})`)
        })
      } else {
        console.log(`❌ ${code}: No images found`)
      }
    })
    
  } catch (error) {
    console.error('❌ Error converting image SQL:', error)
    console.log('\n💡 Make sure you:')
    console.log('1. Put the SQL file in the scripts/ folder')
    console.log('2. Name it "af_product_images.sql"')
    console.log('3. Ensure it contains INSERT statements for af_product_images')
  }
}

// Run the converter
convertImageSqlToIndex()