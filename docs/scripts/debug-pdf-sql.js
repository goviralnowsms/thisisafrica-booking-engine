// scripts/debug-pdf-sql.js
// Debug the PDF SQL file format

const fs = require('fs').promises
const path = require('path')

const SQL_FILE = 'af_product_pdf.sql'

async function debugPdfSql() {
  console.log('🔍 Debugging PDF SQL file format...')
  
  try {
    const sqlPath = path.join(__dirname, SQL_FILE)
    const sqlContent = await fs.readFile(sqlPath, 'utf8')
    
    console.log(`📄 File size: ${sqlContent.length} characters`)
    console.log(`📄 File lines: ${sqlContent.split('\n').length}`)
    
    // Show first 20 lines
    console.log('\n📋 First 20 lines of file:')
    const lines = sqlContent.split('\n')
    lines.slice(0, 20).forEach((line, index) => {
      console.log(`${(index + 1).toString().padStart(2, '0')}: ${line}`)
    })
    
    // Look for different SQL patterns
    console.log('\n🔍 Looking for SQL patterns:')
    
    // Check for INSERT statements
    const insertMatches = sqlContent.match(/INSERT INTO/gi)
    console.log(`INSERT statements found: ${insertMatches ? insertMatches.length : 0}`)
    
    // Check for table mentions
    const tableMatches = sqlContent.match(/af_product_pdf/gi)
    console.log(`Table mentions found: ${tableMatches ? tableMatches.length : 0}`)
    
    // Check for CREATE TABLE
    const createMatches = sqlContent.match(/CREATE TABLE/gi)
    console.log(`CREATE TABLE statements: ${createMatches ? createMatches.length : 0}`)
    
    // Check for specific patterns
    if (sqlContent.includes('af_product_pdf')) {
      console.log('\n✅ Table name found in file')
    } else {
      console.log('\n❌ Table name NOT found in file')
    }
    
    // Look for PDF file patterns
    const pdfPatterns = [
      /\.pdf/gi,
      /pdfname/gi,
      /NBOGTARP001CKEKEE/gi
    ]
    
    pdfPatterns.forEach((pattern, index) => {
      const matches = sqlContent.match(pattern)
      console.log(`Pattern ${index + 1} matches: ${matches ? matches.length : 0}`)
      if (matches && matches.length > 0) {
        console.log(`  Sample: ${matches[0]}`)
      }
    })
    
    // Show lines that contain "af_product_pdf"
    console.log('\n📋 Lines containing "af_product_pdf":')
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes('af_product_pdf')) {
        console.log(`${(index + 1).toString().padStart(3, '0')}: ${line}`)
      }
    }))
    
    // Look for data lines (lines with parentheses and .pdf)
    const dataLines = sqlContent.split('\n').filter(line => {
      const trimmed = line.trim()
      return trimmed.startsWith('(') && trimmed.includes(',') && 
             (trimmed.includes('.pdf') || trimmed.includes('PDF'))
    })
    
    console.log(`\n📋 Found ${dataLines.length} data lines with PDFs`)
    
    // Show first few data lines
    console.log('\n📋 Sample data lines:')
    dataLines.slice(0, 5).forEach((line, index) => {
      console.log(`${index + 1}: ${line.trim()}`)
    })
    
    // Search specifically for our test product
    const testProductLines = dataLines.filter(line => 
      line.includes('NBOGTARP001CKEKEE')
    )
    
    console.log(`\n🎯 Lines for NBOGTARP001CKEKEE: ${testProductLines.length}`)
    testProductLines.forEach((line, index) => {
      console.log(`  ${index + 1}: ${line.trim()}`)
    })
    
  } catch (error) {
    console.error('❌ Error reading PDF SQL file:', error)
    console.log('\n💡 Make sure:')
    console.log('1. The file exists: scripts/af_product_pdf.sql')
    console.log('2. The file is readable')
    console.log('3. The file contains SQL data')
  }
}

// Run the debug
debugPdfSql()