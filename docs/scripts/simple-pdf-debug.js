// scripts/simple-pdf-debug.js
// Simple debug for PDF SQL file

const fs = require('fs').promises
const path = require('path')

async function simplePdfDebug() {
  console.log('🔍 Simple PDF SQL debug...')
  
  try {
    const sqlPath = path.join(__dirname, 'af_product_pdf.sql')
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log('File size:', sqlContent.length, 'characters')
    console.log('File lines:', sqlContent.split('\n').length)
    
    // Show first 10 lines
    console.log('\nFirst 10 lines:')
    const lines = sqlContent.split('\n')
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      console.log(`${i + 1}: ${lines[i]}`)
    }
    
    // Check for INSERT statements
    const insertCount = (sqlContent.match(/INSERT INTO/gi) || []).length
    console.log('\nINSERT statements:', insertCount)
    
    // Check for table name
    const tableCount = (sqlContent.match(/af_product_pdf/gi) || []).length
    console.log('Table mentions:', tableCount)
    
    // Check for PDF files
    const pdfCount = (sqlContent.match(/\.pdf/gi) || []).length
    console.log('PDF mentions:', pdfCount)
    
    // Look for our test product
    if (sqlContent.includes('NBOGTARP001CKEKEE')) {
      console.log('\n✅ Found test product NBOGTARP001CKEKEE')
    } else {
      console.log('\n❌ Test product NBOGTARP001CKEKEE not found')
    }
    
    // Show any line with INSERT and VALUES
    console.log('\nLines with INSERT and VALUES:')
    lines.forEach((line, index) => {
      if (line.includes('INSERT INTO') && line.includes('af_product_pdf')) {
        console.log(`Line ${index + 1}: ${line}`)
        
        // Also show the next few lines (the actual data)
        console.log('Next 5 lines:')
        for (let i = 1; i <= 5 && (index + i) < lines.length; i++) {
          console.log(`  ${index + 1 + i}: ${lines[index + i]}`)
        }
      }
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

simplePdfDebug()