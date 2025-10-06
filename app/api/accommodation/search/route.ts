import { NextRequest, NextResponse } from 'next/server'
import { TourPlanXMLBuilder } from '@/lib/tourplan/xml-builder'
import { TourPlanXMLParser } from '@/lib/tourplan/xml-parser'
import { getProductImages, getImageUrl } from '@/lib/sanity-product-images'

const credentials = {
  agentId: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  password: process.env.TOURPLAN_PASSWORD || 'S@MAgt01'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    
    // Extract search parameters
    const destination = searchParams.get('destination') || undefined
    const productCode = searchParams.get('productCode') || undefined
    const starRating = searchParams.get('starRating') || undefined // Star rating filter (TourPlan codes: 15, 25, 35, 45, 55, 65)
    const dateFrom = searchParams.get('dateFrom') || '2026-07-15'
    const dateTo = searchParams.get('dateTo') || '2026-07-18'
    const adults = searchParams.get('adults') ? parseInt(searchParams.get('adults')!) : 2
    const children = searchParams.get('children') ? parseInt(searchParams.get('children')!) : 0
    const useButtonDestinations = searchParams.get('useButtonDestinations') === 'true'
    const groupByHotel = searchParams.get('groupByHotel') !== 'false' // Default to true unless explicitly false

    console.log('🏨 Accommodation search request:', {
      destination,
      productCode,
      starRating,
      dateFrom,
      dateTo,
      adults,
      children,
      useButtonDestinations
    })

    // Build room configuration
    const roomConfigs = [{
      Adults: adults,
      Children: children,
      Type: 'DB' as const, // Default to double room
      Quantity: 1
    }]
    
    // Build XML request using working template format
    // Since ButtonName="Accommodation" always returns empty, we'll use different strategies
    let xml = '';
    
    if (productCode) {
      // Strategy 1: Direct product code search (most reliable)
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <Opt>${productCode}</Opt>
    <Info>GSI</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <Type>DB</Type>
        <Quantity>1</Quantity>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;
    } else if (useButtonDestinations && destination) {
      // Strategy 2: Use TourPlan recommended ButtonDestinations structure
      // Use Info="G" for general data to get star ratings and basic info
      const infoParam = 'G';

      xml = `<?xml version="1.0"?>
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
    <Info>${infoParam}</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
    <RoomConfigs>
      <RoomConfig>
        <Adults>${adults}</Adults>
        ${children > 0 ? `<Children>${children}</Children>` : ''}
        <RoomType>DB</RoomType>
      </RoomConfig>
    </RoomConfigs>
  </OptionInfoRequest>
</Request>`;
    } else {
      // Strategy 3: Fallback - search for tours/packages that include accommodation
      xml = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${credentials.agentId}</AgentID>
    <Password>${credentials.password}</Password>
    <ButtonName>Group Tours</ButtonName>
    <DestinationName>${destination}</DestinationName>
    <Info>GMFTD</Info>
    <DateFrom>${dateFrom}</DateFrom>
    <DateTo>${dateTo}</DateTo>
  </OptionInfoRequest>
</Request>`;
    }

    console.log('🏨 Accommodation XML request:', xml)
    
    // Make API call to TourPlan
    const apiEndpoint = process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi'
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
    console.log('🏨 Raw TourPlan response:', xmlResponse)
    
    // Parse response using standard XML parser
    const xmlParser = new TourPlanXMLParser()
    
    // First, let's parse the raw XML to see what we're getting
    let parsedResponse;
    try {
      parsedResponse = xmlParser.parseResponse(xmlResponse)
      console.log('🏨 Parsed XML structure:', JSON.stringify(parsedResponse, null, 2))
    } catch (error) {
      console.error('🏨 XML parsing error:', error)
      return NextResponse.json({
        success: false,
        accommodations: [],
        totalResults: 0,
        error: 'Failed to parse TourPlan response'
      }, { status: 500 })
    }
    
    // Extract data directly from parsed response since structure is different
    const optionInfoReply = parsedResponse.OptionInfoReply
    let rawOptions = []
    
    if (optionInfoReply && optionInfoReply.Option) {
      rawOptions = Array.isArray(optionInfoReply.Option) ? optionInfoReply.Option : [optionInfoReply.Option]
    }
    
    console.log('🏨 Raw options found:', rawOptions.length)
    
    if (rawOptions.length === 0) {
      console.log('🏨 No options found in TourPlan response')
      return NextResponse.json({
        success: false,
        accommodations: [],
        totalResults: 0,
        error: 'No accommodation options found for your search'
      }, { status: 200 })
    }
    
    // Transform options to accommodations using actual TourPlan structure
    let accommodations = rawOptions.map((option: any) => {
      // Check if this is a real accommodation with stay results
      const isRealAccommodation = option.OptStayResults != null
      const stayResults = option.OptStayResults || {}
      
      // Extract locality with fallback to address fields for better filtering
      let locality = option.OptGeneral?.LocalityDescription || ''
      
      // Normalize Sabi variations to consistent naming
      if (locality && locality.toLowerCase().includes('sabi sabi')) {
        console.log(`🏨 Normalizing Sabi locality from "${locality}" to "Sabi Sand Game Reserve"`)
        locality = 'Sabi Sand Game Reserve'
      }
      
      // If locality is empty, check address fields for location information
      if (!locality) {
        const address1 = option.OptGeneral?.Address1 || ''
        const address2 = option.OptGeneral?.Address2 || ''
        const address3 = option.OptGeneral?.Address3 || ''
        
        // Check for Victoria & Alfred Waterfront patterns
        const vawPatterns = [
          'Victoria & Alfred Waterfront',
          'V & A Waterfront', 
          'Victoria and Alfred Waterfront',
          'V&A Waterfront'
        ]
        
        const addressText = `${address1} ${address2} ${address3}`.toLowerCase()
        
        for (const pattern of vawPatterns) {
          if (addressText.includes(pattern.toLowerCase())) {
            locality = 'Victoria & Alfred Waterfront'
            break
          }
        }
        
        // Check for Sabi Sand/Sabi Sabi patterns in address
        if (!locality) {
          const sabiPatterns = [
            'sabi sabi',
            'sabi sand', 
            'sabi-sabi',
            'sabi-sand'
          ]
          
          for (const pattern of sabiPatterns) {
            if (addressText.includes(pattern)) {
              console.log(`🏨 Found Sabi pattern "${pattern}" in address, setting locality to "Sabi Sand Game Reserve"`)
              locality = 'Sabi Sand Game Reserve'
              break
            }
          }
        }
        
        // Check for Sabi patterns in supplier name if still no locality
        if (!locality) {
          const supplierName = (option.OptGeneral?.SupplierName || '').toLowerCase()
          const sabiPatterns = ['sabi sabi', 'sabi sand', 'sabi-sabi', 'sabi-sand']
          
          for (const pattern of sabiPatterns) {
            if (supplierName.includes(pattern)) {
              console.log(`🏨 Found Sabi pattern "${pattern}" in supplier name "${option.OptGeneral?.SupplierName}", setting locality to "Sabi Sand Game Reserve"`)
              locality = 'Sabi Sand Game Reserve'
              break
            }
          }
        }
        
        // Check for other common Cape Town areas
        if (!locality) {
          if (addressText.includes('cape town') || addressText.includes('capetown')) {
            if (addressText.includes('city bowl') || addressText.includes('city center')) {
              locality = 'Cape Town City Bowl'
            } else if (addressText.includes('camps bay')) {
              locality = 'Camps Bay'
            } else if (addressText.includes('sea point')) {
              locality = 'Sea Point'
            } else if (addressText.includes('green point')) {
              locality = 'Green Point'
            } else {
              locality = 'Cape Town'
            }
          }
        }
      }
      
      return {
        id: option.Opt || option.OptCode,
        code: option.Opt || option.OptCode,
        name: option.OptGeneral?.SupplierName || option.OptGeneral?.Description || option.Description || 'Safari Tour',
        supplier: option.OptGeneral?.SupplierName || option.SupplierName || '',
        description: `${option.OptGeneral?.Description || ''} - ${option.OptGeneral?.Comment || ''}`.trim().replace(/^- |^$/, ''),
        destination: destination || locality || '',
        country: extractCountryFromDestination(destination || ''),
        type: isRealAccommodation ? 'hotel' : determineAccommodationType(option.OptGeneral?.Description || '', option.OptGeneral?.Comment || ''),
        category: option.OptGeneral?.ClassDescription?.toLowerCase().includes('4') ? 'luxury' : 'standard',
        image: option.OptGeneral?.Image || '/images/products/accomm-hero.jpg',
        rates: isRealAccommodation ? [{
          currency: stayResults.Currency || 'AUD',
          totalPrice: stayResults.TotalPrice || 0,
          agentPrice: stayResults.AgentPrice || 0,
          rateId: stayResults.RateId || 'Default',
          rateName: stayResults.RateName || 'Standard',
          availability: stayResults.Availability || 'RQ',
          roomType: stayResults.RoomList?.RoomType || 'DB'
        }] : [],
        hasAvailability: isRealAccommodation ? stayResults.Availability === 'OK' : true,
        // Accommodation-specific fields - extract room type more accurately
        roomType: extractRoomTypeFromOption(option),
        hotelName: option.OptGeneral?.SupplierName || 'Safari Lodge',
        address: [
          option.OptGeneral?.Address2,
          option.OptGeneral?.Address3,
          option.OptGeneral?.Address4
        ].filter(Boolean).join(', '),
        // Extract star rating to match the format used in dropdown ("5" not "5S")
        starRating: (() => {
          const classDesc = option.OptGeneral?.ClassDescription || ''
          const classCode = option.OptGeneral?.Class || ''

          // Try ClassDescription first (e.g., "5 Star" -> "5")
          if (classDesc) {
            const match = classDesc.match(/(\d+)\s*[Ss]tar/)
            if (match) return match[1]
          }

          // Try Class field (e.g., "5S" -> "5")
          if (classCode) {
            const match = classCode.match(/(\d+)S/)
            if (match) return match[1]
          }

          return classCode // Fallback to raw value
        })(),
        locality: locality,
        // Pricing info (convert from cents to dollars)
        pricePerNight: isRealAccommodation && stayResults.TotalPrice ? Math.round(stayResults.TotalPrice / 100) : null,
        totalPrice: isRealAccommodation && stayResults.TotalPrice ? Math.round(stayResults.TotalPrice / 100) : null
      }
    })

    // Apply filtering only for Group Tours fallback searches
    if (!productCode && !useButtonDestinations) {
      console.log('🏨 Filtering Group Tours results for accommodation-focused tours')
      const beforeFilter = accommodations.length
      accommodations = accommodations.filter((acc: any) => {
        const name = acc.name?.toLowerCase() || ''
        const description = acc.description?.toLowerCase() || ''
        const supplier = acc.supplier?.toLowerCase() || ''
        
        return (
          name.includes('lodge') ||
          name.includes('camp') ||
          name.includes('hotel') ||
          name.includes('resort') ||
          name.includes('serena') ||
          name.includes('keekorok') ||
          name.includes('accommodation') ||
          description.includes('lodge') ||
          description.includes('camp') ||
          description.includes('hotel') ||
          description.includes('accommodation') ||
          supplier.includes('serena') ||
          supplier.includes('safari') ||
          // Also include classic safari packages that typically include accommodation
          name.includes('classic') ||
          name.includes('safari') ||
          description.includes('safari')
        )
      })
      console.log(`🏨 Filtered from ${beforeFilter} to ${accommodations.length} accommodation-focused results`)
    } else if (useButtonDestinations) {
      console.log('🏨 Using real accommodation results from ButtonDestinations')

      // Apply star rating filtering if specified
      if (starRating) {
        console.log(`🏨 Filtering by star rating: ${starRating}`)

        const beforeFilter = accommodations.length

        // Filter by exact star rating match
        accommodations = accommodations.filter((acc: any) => {
          return acc.starRating === starRating
        })

        const starRatingLabel = {
          '1': '1 Star',
          '2': '2 Star',
          '3': '3 Star',
          '4': '4 Star',
          '5': '5 Star',
          '6': 'Luxury (6 Star)'
        }[starRating] || `${starRating} Star`

        console.log(`🏨 Star rating filter: from ${beforeFilter} to ${accommodations.length} results for: ${starRatingLabel}`)
      } else if (groupByHotel) {
        // Group by hotel name when no room type specified AND grouping is enabled
        console.log('🏨 Grouping accommodations by hotel name')
        const hotelMap = new Map()
        
        accommodations.forEach((acc: any) => {
          const hotelName = acc.hotelName || acc.supplier || acc.name
          console.log(`🏨 Processing: ${acc.name}, hotelName: ${hotelName}, supplier: ${acc.supplier}`)
          
          if (hotelName && !hotelMap.has(hotelName)) {
            // Use the first room type found for this hotel as the representative
            hotelMap.set(hotelName, {
              ...acc,
              name: hotelName,
              roomType: `Check room types and availability`,
              description: `${hotelName} - Contact us for room options and availability`
            })
          }
        })
        
        accommodations = Array.from(hotelMap.values())
        console.log(`🏨 Grouped into ${accommodations.length} unique hotels`)
      } else {
        // Don't group - return all individual room products
        console.log('🏨 Returning individual room products without grouping')
      }
    }

    console.log(`🏨 Successfully found ${accommodations.length} accommodations`)

    // Fetch Sanity images for all accommodations
    const productCodes = accommodations.map((acc: any) => acc.code).filter(Boolean)
    const sanityImages = await getProductImages(productCodes)
    
    // Add Sanity image URLs to accommodations
    const accommodationsWithImages = accommodations.map((acc: any) => {
      const sanityImage = sanityImages[acc.code]
      
      if (sanityImage?.primaryImage) {
        // Use Sanity image if available
        const imageUrl = getImageUrl(sanityImage.primaryImage, { 
          width: 800, 
          height: 600, 
          quality: 85 
        })
        
        if (imageUrl) {
          acc.image = imageUrl
          acc.imageAlt = sanityImage.primaryImage.alt || acc.name
        }
      }
      
      return acc
    })

    return NextResponse.json({
      success: true,
      accommodations: accommodationsWithImages,
      totalResults: accommodationsWithImages.length,
      message: `Found ${accommodationsWithImages.length} accommodation options`
    })
    
  } catch (error) {
    console.error('❌ Accommodation search API error:', error)
    return NextResponse.json({
      success: false,
      accommodations: [],
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Search failed'
    }, { status: 500 })
  }
}

// Helper function to extract country from destination
function extractCountryFromDestination(destination: string): string {
  const dest = destination.toLowerCase()
  
  if (dest.includes('kenya') || dest.includes('nairobi') || dest.includes('masai mara')) return 'kenya'
  if (dest.includes('tanzania') || dest.includes('serengeti') || dest.includes('ngorongoro')) return 'tanzania'
  if (dest.includes('south africa') || dest.includes('cape town') || dest.includes('kruger')) return 'south-africa'
  if (dest.includes('botswana') || dest.includes('okavango') || dest.includes('chobe')) return 'botswana'
  if (dest.includes('zimbabwe') || dest.includes('victoria falls')) return 'zimbabwe'
  if (dest.includes('namibia') || dest.includes('windhoek') || dest.includes('sossusvlei')) return 'namibia'
  if (dest.includes('zambia')) return 'zambia'
  
  return 'other'
}

// Helper function to determine accommodation type from name/description
function determineAccommodationType(name: string, description: string): string {
  const text = (name + ' ' + description).toLowerCase()
  
  if (text.includes('camp') || text.includes('camping')) return 'camp'
  if (text.includes('hotel')) return 'hotel'
  if (text.includes('lodge') || text.includes('safari')) return 'lodge'
  if (text.includes('resort')) return 'resort'
  if (text.includes('guest house') || text.includes('guesthouse')) return 'guesthouse'
  
  // Default to lodge for safari accommodations
  return 'lodge'
}

// Helper function to check exact room type matching
function isExactRoomTypeMatch(text: string, filter: string): boolean {
  // Handle specific room type conflicts
  if (filter.includes('villa')) {
    // "Villa" should ONLY match villa, not suite
    return text.includes('villa') && !text.includes('suite')
  } else if (filter.includes('suite')) {
    // "Suite" should match suite but check for specific type
    if (filter.includes('luxury')) {
      return text.includes('luxury') && text.includes('suite') && !text.includes('villa')
    } else if (filter.includes('deluxe')) {
      return text.includes('deluxe') && text.includes('suite')
    } else {
      return text.includes('suite') && !text.includes('villa')
    }
  } else if (filter.includes('tent')) {
    // "Tent" should only match tent
    return text.includes('tent')
  } else if (filter.includes('room')) {
    // "Room" should match room but not suite or villa
    return text.includes('room') && !text.includes('suite') && !text.includes('villa')
  } else {
    // Default exact match
    return text.includes(filter)
  }
}

// Helper function to extract room type from TourPlan option data
function extractRoomTypeFromOption(option: any): string {
  // Try multiple sources in order of preference
  const description = option.OptGeneral?.Description || ''
  const comment = option.OptGeneral?.Comment || ''
  const supplierName = option.OptGeneral?.SupplierName || ''
  const productCode = option.Opt || ''

  // First try to extract from description (most reliable)
  if (description) {
    const lowerDesc = description.toLowerCase()

    // Check for specific room types in order of specificity
    if (lowerDesc.includes('luxury') && lowerDesc.includes('villa')) return 'Luxury Villa'
    if (lowerDesc.includes('luxury') && lowerDesc.includes('suite')) return 'Luxury Suite'
    if (lowerDesc.includes('deluxe') && lowerDesc.includes('suite')) return 'Deluxe Suite'
    if (lowerDesc.includes('executive') && lowerDesc.includes('suite')) return 'Executive Suite'
    if (lowerDesc.includes('manor') && (lowerDesc.includes('suite') || lowerDesc.includes('house'))) return 'Manor Suite'
    if (lowerDesc.includes('presidential') && lowerDesc.includes('suite')) return 'Presidential Suite'
    if (lowerDesc.includes('villa')) return 'Villa'
    if (lowerDesc.includes('luxury') && lowerDesc.includes('tent')) return 'Luxury Tent'
    if (lowerDesc.includes('suite')) return 'Suite'
    if (lowerDesc.includes('deluxe') && lowerDesc.includes('room')) return 'Deluxe Room'
    if (lowerDesc.includes('luxury') && lowerDesc.includes('room')) return 'Luxury Room'
    if (lowerDesc.includes('standard') && lowerDesc.includes('room')) return 'Standard Room'
    if (lowerDesc.includes('family') && lowerDesc.includes('room')) return 'Family Room'
    if (lowerDesc.includes('tent')) return 'Tent'
    if (lowerDesc.includes('room')) return 'Room'

    // Return the description as-is if it doesn't match patterns
    return description
  }

  // Fallback to product code analysis
  return extractRoomTypeFromCode(productCode)
}

// Helper function to extract room type from product code (based on client's example)
function extractRoomTypeFromCode(code: string): string {
  if (!code) return 'Standard Room'

  // Based on client example: GKPACSAB019SABSUI
  // Format: [DEST][AC][SUPPLIER][ROOMTYPE]

  const roomTypePart = code.substring(code.length - 6) // Last 6 characters

  // Common room type mappings
  if (roomTypePart.includes('SUI')) return 'Luxury Suite'
  if (roomTypePart.includes('LUX')) return 'Luxury Room'
  if (roomTypePart.includes('STD')) return 'Standard Room'
  if (roomTypePart.includes('FAM')) return 'Family Room'
  if (roomTypePart.includes('VIL')) return 'Villa'
  if (roomTypePart.includes('TEN')) return 'Tented Suite'

  // Default based on product name patterns
  return 'Safari Room'
}