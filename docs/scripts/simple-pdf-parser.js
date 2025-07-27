// scripts/simple-pdf-parser.js
// Simple line-by-line PDF parser

const fs = require('fs').promises
const path = require('path')

const SQL_FILE = 'af_product_pdf.sql'
const PDF_INDEX_FILE = path.join(__dirname, '../public/pdfs/product-pdf-index.json')
const LOCAL_PDF_DIR = path.join(__dirname, '../public/pdfs/products')

async function simplePdfParser() {
  console.log('🔍 Simple PDF parser...')
  
  try {
    const sqlPath = path.join(__dirname, SQL_FILE)
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log('📄 SQL file loaded')
    
    // Find all data patterns like: (id, 'code', 'filename.pdf', 1, 'date')
    const dataPattern = /\(\s*(\d+)\s*,\s*'([^']+)'\s*,\s*'([^']+\.pdf)'\s*,\s*1\s*,\s*'[^']*'\s*\)/gi
    
    const pdfIndex = {}
    const allPdfs = []
    let totalFound = 0
    let localFound = 0
    
    let match
    while ((match = dataPattern.exec(sqlContent)) !== null) {
      const [fullMatch, id, optioncode, pdfName] = match
      
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
        id: parseInt(id),
        status: exists ? 'exists' : 'missing'
      }
      
      pdfIndex[optioncode].push(pdfInfo)
      if (exists) {
        allPdfs.push(pdfInfo)
      }
      
      // Show progress every 20 items
      if (totalFound % 20 === 0) {
        console.log(`Progress: ${totalFound} PDFs processed...`)
      }
    }
    
    // Add all PDFs list
    pdfIndex.__all_pdfs__ = allPdfs
    
    // Save the index
    await fs.writeFile(
      PDF_INDEX_FILE,
      JSON.stringify(pdfIndex, null, 2),
      'utf8'
    )
    
    console.log('\n📊 Simple PDF Parser Summary:')
    console.log(`Total found in SQL: ${totalFound}`)
    console.log(`PDFs found locally: ${localFound}`)
    console.log(`PDFs missing: ${totalFound - localFound}`)
    console.log(`Product codes with PDFs: ${Object.keys(pdfIndex).filter(k => k !== '__all_pdfs__').length}`)
    
    // Check for our test product
    if (pdfIndex['NBOGTARP001CKEKEE']) {
      console.log('\n🎯 Test product NBOGTARP001CKEKEE:')
      pdfIndex['NBOGTARP001CKEKEE'].forEach(pdf => {
        console.log(`  - ${pdf.originalName} (${pdf.status})`)
      })
    } else {
      console.log('\n❌ Test product NBOGTARP001CKEKEE not found in parsed data')
      
      // Show first few product codes to help debug
      const codes = Object.keys(pdfIndex).filter(k => k !== '__all_pdfs__').slice(0, 10)
      console.log('Sample product codes found:', codes.join(', '))
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Run the simple parser
simplePdfParser()