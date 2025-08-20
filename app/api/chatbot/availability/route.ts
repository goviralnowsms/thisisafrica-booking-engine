import { NextRequest, NextResponse } from 'next/server'
import { getProductDetails } from '@/lib/tourplan/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productCode = searchParams.get('productCode')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    
    if (!productCode) {
      return NextResponse.json({ error: 'Product code required' }, { status: 400 })
    }

    console.log('🤖 Checking availability for:', { productCode, dateFrom, dateTo })

    // Get full product details including pricing and availability
    // Note: getProductDetails returns the data directly, not wrapped in { success, data }
    let product
    try {
      product = await getProductDetails(productCode)
    } catch (error) {
      console.error('🤖 Failed to get product details:', error)
      return NextResponse.json({
        success: false,
        available: false,
        message: 'Product not found or unavailable',
        productCode
      })
    }
    
    if (!product) {
      return NextResponse.json({
        success: false,
        available: false,
        message: 'Product not found or unavailable',
        productCode
      })
    }

    // Process availability data
    const availability = processAvailabilityData(product, dateFrom, dateTo)
    
    // Generate availability response for chatbot
    const response = generateAvailabilityResponse(product, availability)

    return NextResponse.json({
      success: true,
      productCode,
      productName: product.name,
      available: availability.hasAvailability,
      availability: availability,
      response: response,
      pricing: {
        singleRate: availability.bestRate?.singleRate ? formatPrice(availability.bestRate.singleRate) : null,
        doubleRate: availability.bestRate?.doubleRate ? formatPrice(availability.bestRate.doubleRate) : null,
        twinRate: availability.bestRate?.twinRate ? formatPrice(availability.bestRate.twinRate) : null,
        currency: availability.bestRate?.currency || 'AUD'
      },
      dates: availability.availableDates
    })

  } catch (error) {
    console.error('🤖 Availability API error:', error)
    return NextResponse.json({
      success: false,
      available: false,
      message: 'Unable to check availability at this time. Please contact us for current availability.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function processAvailabilityData(product: any, dateFrom?: string | null, dateTo?: string | null) {
  const availability = {
    hasAvailability: false,
    availableDates: [] as string[],
    bestRate: null as any,
    dateRanges: [] as any[],
    specialNotes: [] as string[]
  }

  if (!product.rates || product.rates.length === 0) {
    availability.specialNotes.push('Pricing available on request')
    return availability
  }

  // Process rate data
  const validRates = product.rates.filter((rate: any) => 
    rate.singleRate > 0 || rate.doubleRate > 0 || rate.twinRate > 0
  )

  if (validRates.length === 0) {
    availability.specialNotes.push('Contact us for current pricing and availability')
    return availability
  }

  availability.hasAvailability = true
  availability.bestRate = validRates[0] // Usually the first rate is the current/best rate

  // Extract date ranges
  validRates.forEach((rate: any) => {
    if (rate.dateFrom && rate.dateTo) {
      availability.dateRanges.push({
        from: rate.dateFrom,
        to: rate.dateTo,
        rate: rate
      })
      
      // Add specific dates to available dates array
      const startDate = new Date(rate.dateFrom)
      const endDate = new Date(rate.dateTo)
      
      // Add some sample dates within the range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        availability.availableDates.push(d.toISOString().split('T')[0])
      }
    }
  })

  // Add product-specific availability notes
  if (product.code?.includes('CHOBE') || product.code?.includes('CHO')) {
    if (product.code.includes('CP3') || product.code.includes('3N')) {
      availability.specialNotes.push('Available Friday departures only')
    } else if (product.code.includes('CP2') || product.code.includes('2N')) {
      availability.specialNotes.push('Available Monday and Wednesday departures')
    }
  }

  if (product.code?.includes('RAIL') || product.code?.includes('RLR')) {
    availability.specialNotes.push('Luxury rail journeys with limited weekly departures')
  }

  if (product.code?.includes('GROUP') || product.code?.includes('GT')) {
    availability.specialNotes.push('Small group tours with guaranteed departures')
  }

  return availability
}

function generateAvailabilityResponse(product: any, availability: any): string {
  const productName = product.name || 'this tour'
  
  if (!availability.hasAvailability) {
    return `${productName} is available on request. I recommend contacting our specialists for current pricing and departure dates.`
  }

  let response = `Great news! ${productName} is currently available. `

  if (availability.bestRate) {
    const twinPrice = availability.bestRate.twinRate ? formatPrice(availability.bestRate.twinRate) : null
    const singlePrice = availability.bestRate.singleRate ? formatPrice(availability.bestRate.singleRate) : null
    
    if (twinPrice) {
      response += `Current pricing starts from ${twinPrice} per person twin share`
      if (singlePrice) {
        response += ` or ${singlePrice} for single occupancy`
      }
      response += '. '
    }
  }

  if (availability.dateRanges.length > 0) {
    response += `Available date ranges include ${availability.dateRanges.length} different periods throughout the year. `
  }

  if (availability.specialNotes.length > 0) {
    response += `Please note: ${availability.specialNotes.join(', ')}. `
  }

  response += 'Would you like me to check specific dates or help you with booking?'

  return response
}

function formatPrice(priceInCents: number): string {
  // Convert from cents to dollars and format for per-person pricing
  const dollarsPerPerson = Math.round(priceInCents / 200) // Divide by 200 (100 for cents + 2 for twin share)
  return `AUD $${dollarsPerPerson.toLocaleString()}`
}

// POST endpoint for bulk availability checks
export async function POST(request: NextRequest) {
  try {
    const { productCodes } = await request.json()
    
    if (!Array.isArray(productCodes) || productCodes.length === 0) {
      return NextResponse.json({ error: 'Product codes array required' }, { status: 400 })
    }

    console.log('🤖 Bulk availability check for:', productCodes)

    const results = []

    for (const productCode of productCodes.slice(0, 5)) { // Limit to 5 products
      try {
        const product = await getProductDetails(productCode)
        
        if (product) {
          const availability = processAvailabilityData(product)
          results.push({
            productCode,
            productName: product.name,
            available: availability.hasAvailability,
            bestPrice: availability.bestRate?.twinRate ? formatPrice(availability.bestRate.twinRate) : 'POA',
            summary: availability.hasAvailability ? 'Available' : 'On request'
          })
        } else {
          results.push({
            productCode,
            available: false,
            summary: 'Unavailable'
          })
        }
      } catch (err) {
        console.warn(`Failed to check availability for ${productCode}:`, err)
        results.push({
          productCode,
          available: false,
          summary: 'Check failed'
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      count: results.length
    })

  } catch (error) {
    console.error('🤖 Bulk availability API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Bulk availability check failed'
    }, { status: 500 })
  }
}