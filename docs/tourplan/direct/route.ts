// app/api/tourplan/direct/route.ts
// Direct Tourplan API call - works with your existing xmlTourplanClient

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { xmlRequest } = await request.json();
    
    console.log('Direct Tourplan API called with XML:', xmlRequest.substring(0, 200) + '...');
    
    // Make direct call to Tourplan
    const endpoint = process.env.TOURPLAN_API_ENDPOINT;
    
    if (!endpoint) {
      throw new Error('TOURPLAN_API_ENDPOINT not configured');
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlRequest
    });

    if (!response.ok) {
      throw new Error(`Tourplan API error: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('Tourplan response received, length:', xmlText.length);

    // Parse the XML response
    const parsedData = parseProductDetails(xmlText);
    
    return NextResponse.json({ 
      success: true, 
      data: parsedData 
    });

  } catch (error) {
    console.error('Direct Tourplan API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// XML parsing function
function parseProductDetails(xmlText: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  // Check for errors first
  const errorReply = xmlDoc.getElementsByTagName('ErrorReply')[0];
  if (errorReply) {
    throw new Error(`Tourplan API Error: ${errorReply.textContent}`);
  }
  
  const option = xmlDoc.getElementsByTagName('Option')[0];
  if (!option) {
    throw new Error('Product not found');
  }
  
  return {
    code: getElementText(option, 'Opt') || '',
    name: getElementText(option, 'Description') || '',
    description: getElementText(option, 'Comment') || '',
    location: getElementText(option, 'LocationName') || '',
    supplier: getElementText(option, 'SupplierName') || '',
    images: extractImages(option),
    notes: extractNotes(option),
    amenities: extractAmenities(option),
    rates: extractRates(option),
    availability: getElementText(option, 'Availability') || 'Unknown',
    pricing: {
      currency: getElementText(option, 'Currency') || 'USD',
      rates: extractRates(option),
      availability: getElementText(option, 'Availability') || 'Unknown',
      totalPrice: calculateTotalPrice(extractRates(option))
    }
  };
}

// Helper functions
function getElementText(parent: Element | Document, tagName: string): string | null {
  const element = parent.getElementsByTagName(tagName)[0];
  return element?.textContent || null;
}

function extractRates(option: Element) {
  const rates = [];
  const optRates = option.getElementsByTagName('OptRate');
  
  for (let i = 0; i < optRates.length; i++) {
    const rate = optRates[i];
    rates.push({
      date: getElementText(rate, 'Date') || '',
      rateName: getElementText(rate, 'RateName') || '',
      singleRate: getElementText(rate, 'SingleRate') || '0',
      twinRate: getElementText(rate, 'TwinRate') || '0',
      availability: getElementText(rate, 'Availability') || 'Unknown'
    });
  }
  
  return rates;
}

function extractImages(option: Element): string[] {
  const images: string[] = [];
  const notes = option.getElementsByTagName('OptionNote');
  
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const category = getElementText(note, 'NoteCategory');
    if (category === 'PI1' || category === 'IMG') {
      const imageUrl = getElementText(note, 'NoteText');
      if (imageUrl) images.push(imageUrl);
    }
  }
  
  return images;
}

function extractNotes(option: Element): Record<string, string> {
  const notes: Record<string, string> = {};
  const optionNotes = option.getElementsByTagName('OptionNote');
  
  for (let i = 0; i < optionNotes.length; i++) {
    const note = optionNotes[i];
    const category = getElementText(note, 'NoteCategory');
    const text = getElementText(note, 'NoteText');
    if (category && text) {
      notes[category] = text;
    }
  }
  
  return notes;
}

function extractAmenities(option: Element) {
  const amenities = [];
  const amenityNodes = option.getElementsByTagName('Amenity');
  
  for (let i = 0; i < amenityNodes.length; i++) {
    const amenity = amenityNodes[i];
    amenities.push({
      code: getElementText(amenity, 'AmenityCode') || '',
      category: getElementText(amenity, 'AmenityCategory') || '',
      description: getElementText(amenity, 'AmenityDescription') || '',
      level: getElementText(amenity, 'AmenityLevel') || ''
    });
  }
  
  return amenities;
}

function calculateTotalPrice(rates: any[]): number {
  if (!rates || rates.length === 0) return 0;
  
  let total = 0;
  rates.forEach(rate => {
    const price = parseFloat(rate.twinRate || rate.singleRate || '0');
    total += price;
  });
  
  return total;
}