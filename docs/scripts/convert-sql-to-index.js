// scripts/convert-pdf-sql-to-index.js
// Convert PDF SQL dump to index

const fs = require('fs').promises
const path = require('path')

const SQL_FILE = 'af_product_pdf.sql' // Put your PDF SQL file here
const PDF_INDEX_FILE = path.join(__dirname, '../public/pdfs/product-pdf-index.json')
const LOCAL_PDF_DIR = path.join(__dirname, '../public/pdfs/products')

async function convertPdfSqlToIndex() {
  console.log('🔍 Converting PDF SQL to index...')
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, SQL_FILE)
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log('📄 PDF SQL file loaded')
    
    // Extract INSERT statements - same pattern as images
    const insertRegex = /INSERT INTO [`']?af_product_pdf[`']? \([^)]+\) VALUES\s*((?:\([^)]+\),?\s*)+);/gis
    const pdfIndex = {}
    const allPdfs = []
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
        
        // Structure: id, optioncode, pdfname, status, date (actual PDF table structure)
        if (values.length >= 4) {
          const [id, optioncode, pdfName, status, date] = values
          
          // Status can be '1' or 1 (with or without quotes)  
          const statusValue = status.toString().replace(/['"]/g, '')
          if (optioncode && pdfName && statusValue === '1') {
            totalFound++
            
            // Check if PDF exists locally
            const localPath = path.join(LOCAL_PDF_DIR, pdfName)
            let exists = false
            
            try {
              await fs.access(localPath)
              exists = true
              localFound++
            } catch {
              // PDF doesn't exist locally
            }
            
            // Add to index
            if (!pdfIndex[optioncode]) {
              pdfIndex[optioncode] = []
            }
            
            const pdfInfo = {
              originalName: pdfName,
              localFilename: pdfName,
              localPath: exists ? `/pdfs/products/${pdfName}` : null,
              id: parseInt(id) || 0,
              status: exists ? 'exists' : 'missing'
            }
            
            pdfIndex[optioncode].push(pdfInfo)
            if (exists) {
              allPdfs.push(pdfInfo)
            }
          }
        }
      }
    }
    
    // Add all PDFs list (only existing ones)
    pdfIndex.__all_pdfs__ = allPdfs
    
    // Save the index
    await fs.writeFile(
      PDF_INDEX_FILE,
      JSON.stringify(pdfIndex, null, 2),
      'utf8'
    )
    
    console.log('\n📊 PDF SQL Conversion Summary:')
    console.log(`Total database mappings: ${totalFound}`)
    console.log(`PDFs found locally: ${localFound}`)
    console.log(`PDFs missing: ${totalFound - localFound}`)
    console.log(`Product codes with PDFs: ${Object.keys(pdfIndex).filter(k => k !== '__all_pdfs__').length}`)
    console.log(`Index saved to: ${PDF_INDEX_FILE}`)
    
    // Show some examples
    const codesWithPdfs = Object.keys(pdfIndex).filter(code => 
      code !== '__all_pdfs__' && pdfIndex[code].some(pdf => pdf.status === 'exists')
    )
    
    console.log('\n🎯 Sample product codes with local PDFs:')
    codesWithPdfs.slice(0, 10).forEach(code => {
      const pdfCount = pdfIndex[code].filter(pdf => pdf.status === 'exists').length
      console.log(`- ${code} (${pdfCount} PDF${pdfCount > 1 ? 's' : ''})`)
    })
    
    // Check for our test product
    if (pdfIndex['NBOGTARP001CKEKEE']) {
      console.log('\n🔍 Test product NBOGTARP001CKEKEE:')
      pdfIndex['NBOGTARP001CKEKEE'].forEach(pdf => {
        console.log(`  - ${pdf.originalName} (${pdf.status})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error converting PDF SQL:', error)
    console.log('\n💡 Make sure you:')
    console.log('1. Put the SQL file in the scripts/ folder')
    console.log('2. Name it "af_product_pdf.sql"')
    console.log('3. Ensure it contains INSERT statements')
  }
}

// Run the converter
convertPdfSqlToIndex()