import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'
import { getProductImages, getImageUrl } from '@/lib/sanity-product-images'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'
    const xmlParser = new TourPlanXMLParser()
    
    // Extract search parameters
    const hotelName = searchParams.get('hotelName') || ''
    const productCode = searchParams.get('productCode') || ''
    const supplierCodeParam = searchParams.get('supplierCode') || ''
    const roomTypeFilter = searchParams.get('roomTypeFilter') || '' // Room type filter from search
    const destination = searchParams.get('destination') || 'South Africa'
    const dateFrom = searchParams.get('dateFrom') || '2026-07-15'
    const dateTo = searchParams.get('dateTo') || '2026-07-18'
    const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : 2
    const children = searchParams.get('children') ? parseInt(searchParams.get('children')!) : 0

    console.log('🏨 Hotel rooms search request:', {
      hotelName,
      productCode,
      supplierCodeParam,
      roomTypeFilter,
      destination,
      dateFrom,
      dateTo,
      adults,
      children
    })

    // Extract supplier code from the product code if provided
    let extractedSupplierCode = ''
    
    if (productCode) {
      // Extract supplier code from product code
      // Format: GKPACSABBLDSABBLV where SABBLD is the supplier code
      // Pattern: [3 letters][AC][supplier code][room suffix]
      
      const acIndex = productCode.indexOf('AC')
      if (acIndex > 0 && acIndex < productCode.length - 2) {
        const afterAC = productCode.substring(acIndex + 2)
        
        // The supplier code ends where it repeats (usually 3 letters from start)
        // SABBLD -> SAB is repeated as SABBLV at the end
        // SABEAL -> SAB is repeated as SABEAV at the end
        // KAR015 -> KAR is repeated as KARFAM at the end
        
        // Find where the first 3 chars of afterAC appear again
        const firstThree = afterAC.substring(0, 3).toUpperCase()
        
        // Search for the second occurrence of these 3 letters
        let secondOccurrence = -1
        for (let i = 3; i < afterAC.length - 2; i++) {
          if (afterAC.substring(i, i + 3).toUpperCase() === firstThree) {
            secondOccurrence = i
            break
          }
        }
        
        if (secondOccurrence > 0) {
          extractedSupplierCode = afterAC.substring(0, secondOccurrence)
          console.log(`🏨 Extracted supplier code '${extractedSupplierCode}' from product code '${productCode}'`)
        } else {
          // Fallback: might be a code like POR002 (6 chars)
          const match = afterAC.match(/^([A-Z]{3}\d{3})/i)
          if (match) {
            extractedSupplierCode = match[1]
            console.log(`🏨 Extracted supplier code '${extractedSupplierCode}' (standard format) from product code '${productCode}'`)
          }
        }
      }
    }
    
    // Now search for all accommodation, we'll filter by supplier name
    const xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonDestinations>
      <ButtonDestination>
        <ButtonName>Accommodation</ButtonName>
        <DestinationName>${destination}</DestinationName>
      </ButtonDestination>
    </ButtonDestinations>
    <Info>G</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <Type>DB</Type>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`

    console.log('🏨 Hotel rooms XML request:', xml)
    
    // Make API call to TourPlan
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml',
        'User-Agent': 'ThisIsAfrica/1.0'
      },
      body: xml
    })
    
    if (!response.ok) {
      throw new Error(`TourPlan API error: ${response.status} ${response.statusText}`)
    }
    
    const xmlResponse = await response.text()
    console.log('🏨 Raw TourPlan response length:', xmlResponse.length)
    
    // Parse response
    let parsedResponse;
    try {
      parsedResponse = xmlParser.parseResponse(xmlResponse)
    } catch (error) {
      console.error('🏨 XML parsing error:', error)
      return NextResponse.json({
        success: false,
        rooms: [],
        error: 'Failed to parse TourPlan response'
      }, { status: 500 })
    }
    
    // Extract options
    const optionInfoReply = parsedResponse.OptionInfoReply
    let rawOptions = []
    
    if (optionInfoReply && optionInfoReply.Option) {
      rawOptions = Array.isArray(optionInfoReply.Option) ? optionInfoReply.Option : [optionInfoReply.Option]
    }
    
    console.log(`🏨 Total raw options found: ${rawOptions.length}`)
    
    // Filter by extracted supplier code if we have it
    let hotelRooms = []
    
    if (extractedSupplierCode) {
      // We have the supplier code from the product code
      console.log(`🏨 Filtering by extracted supplier code: "${extractedSupplierCode}"`)
      hotelRooms = rawOptions.filter((option: any) => {
        const optCode = option.Opt || option.OptCode || ''
        
        // Check if this product has the same supplier code
        const acIndex = optCode.indexOf('AC')
        if (acIndex > 0) {
          const afterAC = optCode.substring(acIndex + 2)
          
          // Check if it starts with our supplier code
          const isMatch = afterAC.toUpperCase().startsWith(extractedSupplierCode.toUpperCase())
          
          if (isMatch) {
            console.log(`  ✓ Matched: ${optCode} - ${option.OptGeneral?.SupplierName}`)
          }
          return isMatch
        }
        return false
      })
      
      console.log(`🏨 Found ${hotelRooms.length} rooms with supplier code ${extractedSupplierCode}`)
    } else {
      // Fallback to the old logic if no product code was provided
      let supplierCode = supplierCodeParam
      const hotelNameLower = hotelName.toLowerCase()
    
    if (!supplierCode) {
      // If no supplier code provided, try to find ANY product for this hotel to get the supplier code
      
      // Extract the main hotel name word for searching (e.g., "portswood" from "The Portswood Hotel")
      const mainHotelWord = hotelNameLower
        .replace(/\bthe\b/g, '')
        .replace(/\bhotel\b/g, '')
        .replace(/\band\b/g, '')
        .trim()
        .split(/\s+/)[0] // Get first significant word
      
      console.log(`🏨 No supplier code provided, searching for hotel with main word: "${mainHotelWord}"`)
      
      // Find a product that matches the hotel name to extract supplier code
      for (const option of rawOptions) {
        const supplier = (option.OptGeneral?.SupplierName || '').toLowerCase()
        const code = option.Opt || option.OptCode || ''
        
        if (supplier.includes(mainHotelWord)) {
          // Extract supplier code from product code
          // Format: CPTACPOR002PORTST - POR002 is the supplier code
          const codeMatch = code.match(/([A-Z]{3}\d{3})/i)
          if (codeMatch) {
            supplierCode = codeMatch[1]
            console.log(`🏨 Found supplier code ${supplierCode} from product ${code} (supplier: ${option.OptGeneral?.SupplierName})`)
            break
          }
        }
      }
    } else {
      console.log(`🏨 Using provided supplier code: ${supplierCode}`)
    }
    
    // Now find ALL products with this supplier code
    
    if (supplierCode) {
      // Search by supplier code
      console.log(`🏨 Searching for all products with supplier code: ${supplierCode}`)
      hotelRooms = rawOptions.filter((option: any) => {
        const code = option.Opt || option.OptCode || ''
        return code.includes(supplierCode)
      })
      
      console.log(`🏨 Found ${hotelRooms.length} products with supplier code ${supplierCode}:`)
      hotelRooms.forEach((opt: any) => {
        console.log(`  - ${opt.Opt}: ${opt.OptGeneral?.SupplierName} - ${opt.OptGeneral?.Description}`)
      })
    } else {
      // Fallback to name matching
      console.log(`🏨 No supplier code found, falling back to name matching for "${hotelName}"`)
      
      hotelRooms = rawOptions.filter((option: any) => {
        const supplier = option.OptGeneral?.SupplierName || ''
        const description = option.OptGeneral?.Description || ''
        
        // Extract key words from hotel name
        const keyWords = hotelNameLower
          .replace(/\bthe\b/g, '')
          .replace(/\bhotel\b/g, '')
          .replace(/\band\b/g, '')
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 2)
        
        // Check if supplier matches the hotel name
        const supplierLower = supplier.toLowerCase()
        const isMatch = keyWords.some(word => supplierLower.includes(word)) ||
                       supplierLower === hotelNameLower ||
                       hotelNameLower.includes(supplierLower.replace(' hotel', '').trim())
        
        if (isMatch) {
          console.log(`🏨 Matched by name: ${option.Opt} - ${supplier} - ${description}`)
        }
        
        return isMatch
      })
    }
    } // Close the else block for when no supplierName
    
    console.log(`🏨 Found ${hotelRooms.length} rooms for ${hotelName}`)
    
    // Transform to room format with proper room type extraction
    const rooms = hotelRooms.map((option: any) => {
      const code = option.Opt || option.OptCode || ''
      const supplier = option.OptGeneral?.SupplierName || ''
      const description = option.OptGeneral?.Description || ''
      const name = `${supplier}${description ? ` - ${description}` : ''}`
      
      // Use the TourPlan description as the room name/type for display
      // This ensures the displayed name matches exactly what's in TourPlan
      let roomType = description || 'Standard Room'

      // Also extract a category from the code suffix for filtering purposes
      const codeSuffix = code.slice(-2).toUpperCase()
      let roomCategory = 'standard'

      // Categorize based on suffix for filtering
      if (codeSuffix === 'ST' || code.toUpperCase().endsWith('STD')) roomCategory = 'standard'
      else if (codeSuffix === 'EX' || codeSuffix === 'EXE') roomCategory = 'executive'
      else if (codeSuffix === 'FM' || codeSuffix === 'FAM') roomCategory = 'family'
      else if (codeSuffix === 'DL' || codeSuffix === 'DLX') roomCategory = 'deluxe'
      else if (codeSuffix === 'SU' || codeSuffix === 'SUI') roomCategory = 'suite'
      else if (codeSuffix === 'LS') roomCategory = 'luxury-suite'
      else if (codeSuffix === 'LX' || codeSuffix === 'LUX') roomCategory = 'luxury'
      else if (codeSuffix === 'LM' || codeSuffix === 'MAN') roomCategory = 'manor'
      else if (codeSuffix === 'LV' || codeSuffix === 'VL' || codeSuffix === 'VIL') roomCategory = 'villa'
      else if (codeSuffix === 'SP' || codeSuffix === 'SUP') roomCategory = 'superior'

      // If no description provided, create a default based on category
      if (!description || description.trim() === '') {
        const categoryNames: Record<string, string> = {
          'standard': 'Standard Room',
          'executive': 'Executive Suite',
          'family': 'Family Suite',
          'deluxe': 'Deluxe Suite',
          'suite': 'Suite',
          'luxury-suite': 'Luxury Suite',
          'luxury': 'Luxury Room',
          'manor': 'Manor Suite',
          'villa': 'Villa',
          'superior': 'Superior Room'
        }
        roomType = categoryNames[roomCategory] || 'Standard Room'
      }

      console.log(`🏨 Room for ${code}: "${roomType}" (category: ${roomCategory}, suffix: ${codeSuffix})`)
      
      return {
        productCode: code,
        roomType: roomType,
        name: name,
        description: option.OptGeneral?.Comment || description,
        hotelName: supplier,
        supplier: supplier,
        locality: option.OptGeneral?.LocalityDescription || ''
      }
    })
    
    // Apply room type filter if provided (exact matching to prevent Villa/Suite confusion)
    let filteredRooms = rooms
    if (roomTypeFilter) {
      console.log(`🏨 Applying room type filter: "${roomTypeFilter}"`)

      const filterLower = roomTypeFilter.toLowerCase().replace('-', ' ')

      filteredRooms = rooms.filter((room: any) => {
        const roomTypeLower = room.roomType.toLowerCase()

        // Exact matching to prevent conflicts
        if (filterLower.includes('villa')) {
          // Villa should ONLY match villa, not suite
          return roomTypeLower.includes('villa') && !roomTypeLower.includes('suite')
        } else if (filterLower.includes('luxury') && filterLower.includes('suite')) {
          // Luxury Suite should match luxury suite but not villa
          return roomTypeLower.includes('luxury') && roomTypeLower.includes('suite') && !roomTypeLower.includes('villa')
        } else if (filterLower.includes('deluxe')) {
          return roomTypeLower.includes('deluxe')
        } else if (filterLower.includes('suite')) {
          return roomTypeLower.includes('suite') && !roomTypeLower.includes('villa')
        } else {
          return roomTypeLower.includes(filterLower)
        }
      })

      console.log(`🏨 Filtered from ${rooms.length} to ${filteredRooms.length} rooms matching "${roomTypeFilter}"`)
    }

    // Remove duplicates based on room type
    const uniqueRooms = filteredRooms.reduce((acc: any[], room: any) => {
      const existing = acc.find(r => r.roomType === room.roomType)
      if (!existing || !existing.productCode) {
        // If no existing room with this type, or existing has no code, use this one
        return [...acc.filter(r => r.roomType !== room.roomType), room]
      }
      return acc
    }, [])
    
    console.log(`🏨 Returning ${uniqueRooms.length} unique room types`)
    
    // Fetch Sanity images for room products
    const roomCodes = uniqueRooms.map((room: any) => room.productCode).filter(Boolean)
    const sanityImages = await getProductImages(roomCodes)
    
    // Add Sanity image URLs to rooms
    const roomsWithImages = uniqueRooms.map((room: any) => {
      const sanityImage = sanityImages[room.productCode]
      
      if (sanityImage?.primaryImage) {
        const imageUrl = getImageUrl(sanityImage.primaryImage, {
          width: 800,
          height: 600,
          quality: 85
        })
        
        if (imageUrl) {
          room.image = imageUrl
          room.imageAlt = sanityImage.primaryImage.alt || room.roomType
        }
      }
      
      return room
    })
    
    return NextResponse.json({
      success: true,
      rooms: roomsWithImages,
      totalRooms: hotelRooms.length,
      message: `Found ${roomsWithImages.length} room types for ${hotelName}`
    })
    
  } catch (error) {
    console.error('❌ Hotel rooms search API error:', error)
    return NextResponse.json({
      success: false,
      rooms: [],
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 })
  }
}