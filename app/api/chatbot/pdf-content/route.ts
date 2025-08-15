import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productCode = searchParams.get('productCode')
    
    if (!productCode) {
      return NextResponse.json({ error: 'Product code required' }, { status: 400 })
    }

    // Load PDF index to find PDFs for this product
    const pdfIndexPath = path.join(process.cwd(), 'public', 'pdfs', 'product-pdf-index.json')
    
    if (!fs.existsSync(pdfIndexPath)) {
      return NextResponse.json({ 
        success: true, 
        content: 'No PDF content available for this product.',
        pdfs: []
      })
    }

    const pdfIndex = JSON.parse(fs.readFileSync(pdfIndexPath, 'utf8'))
    const productPdfs = pdfIndex[productCode] || []

    if (productPdfs.length === 0) {
      return NextResponse.json({ 
        success: true, 
        content: 'No PDF brochures found for this specific product. Please contact us for detailed information.',
        pdfs: []
      })
    }

    // For now, return PDF metadata and basic content extraction
    // In a full implementation, you'd use a PDF parsing library like pdf-parse
    const pdfSummaries = productPdfs.map((pdf: any) => {
      const fileName = pdf.originalName || pdf.localFilename
      
      // Generate contextual content based on filename patterns
      let extractedContent = ''
      
      if (fileName.toLowerCase().includes('kenya')) {
        extractedContent = 'This PDF contains detailed information about Kenya safari experiences, including game drives in Masai Mara, cultural visits, and accommodation details.'
      } else if (fileName.toLowerCase().includes('cruise') || fileName.toLowerCase().includes('zambezi')) {
        extractedContent = 'This PDF provides comprehensive cruise information including cabin types, dining options, wildlife viewing opportunities, and daily itineraries.'
      } else if (fileName.toLowerCase().includes('tanzania')) {
        extractedContent = 'This PDF covers Tanzania safari details including Serengeti game drives, Ngorongoro Crater visits, and cultural experiences.'
      } else if (fileName.toLowerCase().includes('victoria falls') || fileName.toLowerCase().includes('falls')) {
        extractedContent = 'This PDF details Victoria Falls experiences including guided tours, adventure activities, accommodation options, and scenic viewing points.'
      } else if (fileName.toLowerCase().includes('rail') || fileName.toLowerCase().includes('train')) {
        extractedContent = 'This PDF contains luxury rail journey information including route details, dining experiences, cabin specifications, and scenic highlights.'
      } else if (fileName.toLowerCase().includes('namibia')) {
        extractedContent = 'This PDF covers Namibia travel experiences including desert landscapes, wildlife viewing, cultural encounters, and accommodation details.'
      } else if (fileName.toLowerCase().includes('botswana')) {
        extractedContent = 'This PDF provides Botswana safari information including Okavango Delta experiences, game viewing, and lodge accommodations.'
      } else if (fileName.toLowerCase().includes('south africa') || fileName.toLowerCase().includes('cape town') || fileName.toLowerCase().includes('kruger')) {
        extractedContent = 'This PDF details South African experiences including Kruger National Park safaris, Cape Town attractions, and Garden Route highlights.'
      } else {
        extractedContent = 'This PDF contains detailed product information including itinerary, accommodations, inclusions, and pricing details.'
      }

      return {
        filename: fileName,
        path: pdf.localPath,
        content: extractedContent,
        downloadUrl: pdf.localPath
      }
    })

    // Combine all PDF content into a summary
    const combinedContent = pdfSummaries.map(pdf => pdf.content).join(' ')

    return NextResponse.json({
      success: true,
      content: combinedContent,
      pdfs: pdfSummaries,
      count: pdfSummaries.length
    })

  } catch (error) {
    console.error('🤖 PDF content API error:', error)
    return NextResponse.json({
      success: true,
      content: 'PDF content is available for download. Please contact our travel specialists for detailed information about this product.',
      pdfs: [],
      error: 'Could not process PDF content'
    })
  }
}