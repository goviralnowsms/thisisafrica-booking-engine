// app/api/productdetails/route.js - Real Tourplan API with stable parsing

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tour code is required' 
      }, { status: 400 });
    }

    console.log(`🔍 Fetching product details for code: ${code}`);

    // Build XML request for detailed product information - same as your working search
    const xmlRequest = `<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
  <OptionInfoRequest>
    <AgentID>AGENT_ID</AgentID>
    <Password>PASSWORD</Password>
    <Opt>${code}</Opt>
    <Info>GMFTD</Info>
    <DateFrom>${new Date().toISOString().split('T')[0]}</DateFrom>
    <DateTo>${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</DateTo>
  </OptionInfoRequest>
</Request>`;

    console.log('📋 Product Details XML Request:', xmlRequest);

    // Make API call to Tourplan - same as your working search
    const response = await fetch('/api/tourplan', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlRequest,
    });

    if (!response.ok) {
      throw new Error(`Tourplan API request failed: ${response.status}`);
    }

    const xmlResponse = await response.text();
    console.log('📋 Product Details XML Response (first 500 chars):', xmlResponse.substring(0, 500));

    // Use browser DOMParser (same as your working search page)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlResponse, 'text/xml');

    // Check for errors
    const errors = xmlDoc.getElementsByTagName('ErrorText');
    if (errors.length > 0) {
      const errorText = errors[0].textContent;
      throw new Error(`Tourplan Error: ${errorText}`);
    }

    // Extract product details - same logic as your working search
    const optionElement = xmlDoc.getElementsByTagName('Option')[0];
    
    if (!optionElement) {
      return NextResponse.json({
        success: false,
        error: 'Tour not found'
      }, { status: 404 });
    }

    // Extract basic tour information - same as working search
    const optGeneral = optionElement.getElementsByTagName('OptGeneral')[0];
    const description = optGeneral?.getElementsByTagName('Description')[0]?.textContent || 'Tour Details';
    const periods = optGeneral?.getElementsByTagName('Periods')[0]?.textContent || '0';
    const classDescription = optGeneral?.getElementsByTagName('ClassDescription')[0]?.textContent || '';
    const comment = optGeneral?.getElementsByTagName('Comment')[0]?.textContent || '';

    // **EXACT PRICING LOGIC FROM YOUR WORKING SEARCH PAGE**
    let twinRate = 0;
    
    // Look for OptDateRanges (this is where the pricing is stored)
    const optDateRanges = optionElement.getElementsByTagName('OptDateRanges')[0];
    if (optDateRanges) {
      const dateRanges = optDateRanges.getElementsByTagName('OptDateRange');
      
      for (let j = 0; j < dateRanges.length; j++) {
        const dateRange = dateRanges[j];
        const rateSets = dateRange.getElementsByTagName('RateSets')[0];
        
        if (rateSets) {
          const rateSetElements = rateSets.getElementsByTagName('RateSet');
          
          for (let k = 0; k < rateSetElements.length; k++) {
            const rateSet = rateSetElements[k];
            const optRate = rateSet.getElementsByTagName('OptRate')[0];
            
            if (optRate) {
              // For accommodation products (with room rates)
              const roomRates = optRate.getElementsByTagName('RoomRates')[0];
              if (roomRates) {
                const twinRateElement = roomRates.getElementsByTagName('TwinRate')[0];
                if (twinRateElement) {
                  const thisRate = parseInt(twinRateElement.textContent || '0');
                  if (((thisRate < twinRate) || (twinRate === 0)) && (thisRate > 0)) {
                    twinRate = thisRate;
                  }
                }
              }
              
              // For non-accommodation products (with person rates) - Day Tours, etc.
              const personRates = optRate.getElementsByTagName('PersonRates')[0];
              if (personRates) {
                const adultRateElement = personRates.getElementsByTagName('AdultRate')[0];
                if (adultRateElement) {
                  const thisRate = parseInt(adultRateElement.textContent || '0');
                  if (((thisRate < twinRate) || (twinRate === 0)) && (thisRate > 0)) {
                    twinRate = thisRate;
                  }
                }
              }
            }
          }
        }
      }
    }

    // **PRICING CALCULATION** - Match WordPress formula from your working search
    let displayPrice = 0;
    if (twinRate > 0) {
      displayPrice = Math.ceil(twinRate / 200);
    }

    console.log(`💰 Extracted pricing - TwinRate: ${twinRate}, DisplayPrice: ${displayPrice}`);

    // Extract amenities and destinations - same as working search
    const amenities = [];
    const amenityElements = optionElement.getElementsByTagName('Amenities')[0];
    if (amenityElements) {
      const amenityList = amenityElements.getElementsByTagName('Amenity');
      for (let i = 0; i < amenityList.length; i++) {
        const amenity = amenityList[i];
        const amenityCode = amenity.getElementsByTagName('AmenityCode')[0]?.textContent;
        const amenityDesc = amenity.getElementsByTagName('AmenityDescription')[0]?.textContent;
        const amenityCategory = amenity.getElementsByTagName('AmenityCategory')[0]?.textContent;
        
        if (amenityCode && amenityDesc) {
          amenities.push({
            code: amenityCode,
            description: amenityDesc,
            category: amenityCategory
          });
        }
      }
    }

    // Extract destinations from CTY amenities (this is the real destination)
    const destinations = amenities
      .filter(amenity => amenity.category === 'CTY')
      .map(amenity => amenity.description);

    // Extract availability - same as working search
    let availabilityStatus = 'Available';
    const optDetailedAvails = optionElement.getElementsByTagName('OptDetailedAvails')[0];
    if (optDetailedAvails) {
      const availElements = optDetailedAvails.getElementsByTagName('OptDetailedAvail');
      if (availElements.length > 0) {
        const availValue = availElements[0].textContent;
        availabilityStatus = availValue === '8' ? 'Available' : 'Limited';
      }
    }

    // Extract detailed notes/descriptions
    const optionNotes = optionElement.getElementsByTagName('OptionNotes')[0];
    let detailedDescription = '';
    if (optionNotes) {
      const noteElement = optionNotes.getElementsByTagName('OptionNote')[0];
      if (noteElement) {
        detailedDescription = noteElement.getElementsByTagName('NoteText')[0]?.textContent || '';
      }
    }

    // Build comprehensive product details response
    const productDetails = {
      success: true,
      product: {
        code: code,
        name: description,
        title: description, // Use description as the main title, not supplier name
        description: detailedDescription || comment || description,
        duration: periods ? `${parseInt(periods) + 1} days` : '1 day',
        periods: parseInt(periods) || 0,
        
        // Pricing information - same as working search
        price: displayPrice,
        rawTwinRate: twinRate,
        priceDisplay: twinRate > 0 ? `$${displayPrice.toLocaleString()}` : 'On request',
        priceNote: 'per person twin share',
        
        // Location information
        destinations: destinations,
        primaryDestination: destinations[0] || 'Africa',
        
        // Tour details
        tourLevel: classDescription,
        comment: comment,
        availability: twinRate > 0 ? availabilityStatus : 'On request',
        
        // Amenities and features
        amenities: amenities,
        
        // For display purposes
        highlights: detailedDescription ? [detailedDescription] : [comment].filter(Boolean),
        includes: [
          'Professional English-speaking guide',
          'All park entrance fees',
          'Game drives in 4WD safari vehicle'
        ],
        excludes: [
          'International flights',
          'Visa fees',
          'Personal expenses'
        ],
        
        // Booking information
        bookingInfo: {
          minPax: 2,
          maxPax: 12,
          bookingDeadline: '48 hours prior to departure'
        }
      }
    };

    console.log(`✅ Successfully extracted product details for ${code}: ${productDetails.product.name} - Price: ${productDetails.product.priceDisplay}`);
    
    return NextResponse.json(productDetails);

  } catch (error) {
    console.error('❌ Product details fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Support GET requests
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tour code is required' 
      }, { status: 400 });
    }

    // Create a mock request for the POST handler
    const mockRequest = {
      json: async () => ({ code })
    };

    return await POST(mockRequest);
  } catch (error) {
    console.error('❌ GET request error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}