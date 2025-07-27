// app/api/tourplan/search/route.ts - FIXED VERSION WITH PRICING

import { NextRequest, NextResponse } from 'next/server'
import { parseString } from 'xml2js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      destination, 
      buttonName, 
      dateFrom, 
      dateTo, 
      adults = 2, 
      children = 0 
    } = body

    console.log('🔗 API Route Environment Check:')
    console.log('TOURPLAN_API_URL:', process.env.TOURPLAN_API_URL)
    console.log('TOURPLAN_AGENT_ID:', process.env.TOURPLAN_AGENTID ? 'SET' : 'MISSING')
    console.log('TOURPLAN_PASSWORD:', process.env.TOURPLAN_AGENTPASSWORD ? 'SET' : 'MISSING')

    // Build XML request with PRICING INFORMATION
    const xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>${process.env.TOURPLAN_AGENTID}</AgentID>
    <Password>${process.env.TOURPLAN_AGENTPASSWORD}</Password>
    <ButtonName>${buttonName || 'Rail'}</ButtonName>
    <DestinationName>${destination || 'South Africa'}</DestinationName>
    <Info>GS</Info>
    <DateFrom>${dateFrom || '2025-07-15'}</DateFrom>
    <DateTo>${dateTo || '2025-07-29'}</DateTo>
    <RateConvert>Y</RateConvert>
  </OptionInfoRequest>
</Request>`

    console.log('🔗 Sending XML to Tourplan:', xmlRequest)

    // Make request to Tourplan API
    const response = await fetch(process.env.TOURPLAN_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlRequest,
    })

    console.log('📋 Tourplan Response Status:', response.status)

    if (!response.ok) {
      throw new Error(`Tourplan API error: ${response.status}`)
    }

    const xmlText = await response.text()
    console.log('📋 Tourplan Response Length:', xmlText.length)
    console.log('📋 Tourplan Response Preview:', xmlText.substring(0, 300) + '...')

    // Check for errors
    if (xmlText.includes('ErrorReply')) {
      console.error('❌ Tourplan API error response')
      return NextResponse.json({
        success: false,
        error: 'Tourplan API error',
        tours: []
      })
    }

    // Parse XML response
    const parsedData: any = await new Promise((resolve, reject) => {
      parseString(xmlText, { 
        explicitArray: false,
        trim: true,
        normalize: true,
        normalizeTags: false,
        attrkey: 'attributes'
      }, (err, result) => {
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })

    // Extract tours from response
    const tours: any[] = []
    
    if (parsedData?.Reply?.OptionInfoReply?.Option) {
      const options = Array.isArray(parsedData.Reply.OptionInfoReply.Option)
        ? parsedData.Reply.OptionInfoReply.Option
        : [parsedData.Reply.OptionInfoReply.Option]

      options.forEach((option: any) => {
        // Extract pricing information
        const rates: any[] = []
        
        // Look for pricing in different places
        if (option.OptStayResults?.RateSet?.RateStays?.RateStay) {
          const rateStays = Array.isArray(option.OptStayResults.RateSet.RateStays.RateStay)
            ? option.OptStayResults.RateSet.RateStays.RateStay
            : [option.OptStayResults.RateSet.RateStays.RateStay]
          
          rateStays.forEach((rateStay: any) => {
            if (rateStay.StayPays?.StayPay) {
              const stayPays = Array.isArray(rateStay.StayPays.StayPay)
                ? rateStay.StayPays.StayPay
                : [rateStay.StayPays.StayPay]
              
              stayPays.forEach((stayPay: any) => {
                rates.push({
                  adultPrice: parseFloat(stayPay.Pay) || 0,
                  currency: 'USD', // or extract from response
                  rateName: rateStay.RateName || 'Standard'
                })
              })
            }
          })
        }

        // Look for room rates if it's accommodation
        if (option.OptRates?.RoomRates?.SingleRate) {
          rates.push({
            adultPrice: parseFloat(option.OptRates.RoomRates.SingleRate) || 0,
            currency: 'USD',
            rateName: 'Single'
          })
        }

        if (option.OptRates?.RoomRates?.TwinRate) {
          rates.push({
            adultPrice: parseFloat(option.OptRates.RoomRates.TwinRate) || 0,
            currency: 'USD',
            rateName: 'Twin'
          })
        }

        // Create tour object
        const tour = {
          id: option.Opt || `tour-${tours.length}`,
          name: option.OptGeneral?.Description || option.OptGeneral?.SupplierName || 'Unknown Tour',
          description: option.OptGeneral?.Description || '',
          supplierName: option.OptGeneral?.SupplierName || '',
          location: option.OptGeneral?.LocalityDescription || destination,
          duration: '1 day', // Extract from option if available
          groupSize: `${adults + children} guests`,
          difficulty: 'Moderate',
          includes: [],
          images: [],
          rates: rates,
          priceFrom: rates.length > 0 ? Math.min(...rates.map(r => r.adultPrice)) : 0,
          availability: 'Available', // Extract from response if available
          code: option.Opt
        }

        tours.push(tour)
        console.log(`✅ Processed tour: ${tour.name} with ${rates.length} rates`)
      })
    }

    console.log(`📊 Found ${tours.length} tours total`)

    return NextResponse.json({
      success: true,
      tours: tours,
      debug: {
        searchCriteria: { destination, buttonName, dateFrom, dateTo },
        totalResults: tours.length,
        hasRates: tours.filter(t => t.rates.length > 0).length
      }
    })

  } catch (error) {
    console.error('❌ Search API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
      tours: []
    })
  }
}