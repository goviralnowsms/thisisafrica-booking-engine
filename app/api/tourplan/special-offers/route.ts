import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🎁 Returning hardcoded Special Offers');
    
    // Hardcoded special offers with the correct product codes
    const specialOffers = [
      {
        id: 'GKPSPSABBLDSABBLS',
        code: 'GKPSPSABBLDSABBLS',
        name: 'Sabi Sabi Earth Lodge - Stay 4 Pay 3',
        description: 'Experience the award-winning Sabi Sabi Earth Lodge in the renowned Sabi Sand Game Reserve. Stay 4 nights and pay for only 3, including all meals, game drives, and luxury accommodation.',
        supplier: 'Sabi Sabi Private Game Reserve',
        duration: '4 nights',
        image: '/images/products/sabi-sabi1.png',
        rates: [{
          currency: 'AUD',
          twinRate: 455000, // $2,275 per person twin share in cents
          rateName: 'Stay 4 Pay 3 Special'
        }],
        discount: 'Stay 4 Pay 3'
      },
      {
        id: 'GKPSPSAV002SAVLHM',
        code: 'GKPSPSAV002SAVLHM',
        name: 'Savanna Lodge Honeymoon Special',
        description: 'Romantic honeymoon getaway at Savanna Private Game Reserve in the renowned Kruger Sabi Sand Reserve. Experience luxury accommodation, exceptional game viewing, and intimate safari experiences designed for couples.',
        supplier: 'Savanna Private Game Reserve',
        duration: '3 nights',
        image: '/images/products/savannah-lodge-honeymoon.png',
        rates: [{
          currency: 'AUD',
          twinRate: 240800, // $1,204 per person twin share in cents
          rateName: 'Honeymoon Special'
        }],
        discount: 'Honeymoon Special'
      },
      {
        id: 'HDSSPMAKUTSMSSCLS',
        code: 'HDSSPMAKUTSMSSCLS',
        name: 'Classic Kruger Package',
        description: 'Experience the best of Kruger National Park with expert guides, luxury accommodation at Makutsi Safari Springs, and incredible wildlife viewing opportunities. Perfect for families and first-time safari goers.',
        supplier: 'Makutsi Safari Springs',
        duration: '5 nights',
        image: '/images/products/kruger-package.jpeg',
        rates: [{
          currency: 'AUD',
          twinRate: 389000, // $1,945 per person twin share in cents
          rateName: 'Classic Package'
        }],
        discount: '25% Off'
      }
    ];
    
    console.log('🎁 Returning special offers:', specialOffers.map(offer => ({
      code: offer.code,
      name: offer.name,
      price: `$${Math.round(offer.rates[0].twinRate / 200).toLocaleString()} pp`
    })));
    
    return NextResponse.json({
      success: true,
      totalResults: specialOffers.length,
      offers: specialOffers,
      searchCriteria: { productType: 'Special Offers' },
      message: 'Showing featured special offers'
    });
    
  } catch (error) {
    console.error('❌ Error in Special Offers API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}