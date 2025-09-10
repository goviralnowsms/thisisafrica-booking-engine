import { NextRequest } from 'next/server';
import { getProductDetails } from '@/lib/tourplan';
import { successResponse, errorResponse, handleTourPlanError } from '../../utils';

// GET - Get product details with images and full content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productCode: string }> }
) {
  const resolvedParams = await params;
  const { productCode } = resolvedParams;
  
  try {
    console.log('🔍 Product API called with params:', resolvedParams);
    
    if (!productCode) {
      console.error('❌ No product code provided');
      return errorResponse('Product code is required', 400);
    }
    
    console.log(`🔍 Fetching full product details for code: ${productCode}`);
    
    // Handle mock product NBOGTSAFHQEAETIA
    if (productCode === 'NBOGTSAFHQEAETIA') {
      console.log('🎭 Returning mock data for NBOGTSAFHQEAETIA');
      const mockProductData = {
        id: 'NBOGTSAFHQEAETIA',
        code: 'NBOGTSAFHQEAETIA',
        name: 'East Africa Explored - Intimate Properties',
        description: 'Kenya and Tanzania',
        supplierName: 'This Is Africa',
        location: 'Nairobi, Kenya',
        duration: '13 days',
        periods: 13,
        rates: [{
          currency: 'AUD',
          singleRate: 890000,  // $8,900 in cents
          doubleRate: 780000,  // $7,800 in cents
          twinRate: 780000,    // $7,800 in cents (per person twin share)
          twinRateTotal: 1560000, // $15,600 for two people
          twinRateFormatted: 'AUD $7,800',
          dateRange: 'July 2026 - December 2028',
          rateName: 'Small Group Safari'
        }],
        notes: [{
          category: 'PDW',
          text: 'EAST AFRICA EXPLORED - INTIMATE PROPERTIES\n\nKENYA AND TANZANIA - 13 DAY SMALL GROUP SAFARI\n\nExperience the magic of East Africa on this intimate 13-day safari adventure through Kenya and Tanzania. Stay at carefully selected intimate properties that offer personalized service and authentic wildlife experiences.\n\nThis small group safari takes you through some of East Africa\'s most renowned national parks and reserves, providing opportunities to witness the Great Migration, encounter the Big Five, and experience the rich cultures of the Maasai and other local communities.\n\nHighlights include game drives in the Serengeti, visits to the Ngorongoro Crater, and wildlife viewing in Kenya\'s premier parks including the Maasai Mara, Amboseli, and Tsavo.\n\nAccommodation is in intimate lodges and camps that provide a more personal and exclusive safari experience, with expert guides ensuring exceptional wildlife encounters and cultural interactions.'
        }],
        content: {
          introduction: 'EAST AFRICA EXPLORED - INTIMATE PROPERTIES\n\nKENYA AND TANZANIA - 13 DAY SMALL GROUP SAFARI\n\nExperience the magic of East Africa on this intimate 13-day safari adventure through Kenya and Tanzania. Stay at carefully selected intimate properties that offer personalized service and authentic wildlife experiences.',
          details: 'This small group safari takes you through some of East Africa\'s most renowned national parks and reserves, providing opportunities to witness the Great Migration, encounter the Big Five, and experience the rich cultures of the Maasai and other local communities.\n\nHighlights include game drives in the Serengeti, visits to the Ngorongoro Crater, and wildlife viewing in Kenya\'s premier parks including the Maasai Mara, Amboseli, and Tsavo.',
          inclusions: 'Accommodation in intimate lodges and camps\nAll meals during safari\nProfessional safari guide\nGame drives and park fees\nAirport transfers\nGround transportation in 4WD vehicles\nBottled water during game drives',
          mapImage: '/images/products/NBOGTSAFHQ-EAETIA-Map.jpg'
        },
        localAssets: {
          images: [
            { url: '/images/products/NBOGTSAFHEQ-AETIA-1.jpg', type: 'image', category: 'product', originalName: 'NBOGTSAFHEQ-AETIA-1.jpg', status: 'exists' },
            { url: '/images/products/NBOGTSAFHQ-EAETIA-2.jpg', type: 'image', category: 'product', originalName: 'NBOGTSAFHQ-EAETIA-2.jpg', status: 'exists' },
            { url: '/images/products/NBOGTSAFHQ-EAETIA-3.jpg', type: 'image', category: 'product', originalName: 'NBOGTSAFHQ-EAETIA-3.jpg', status: 'exists' },
            { url: '/images/products/NBOGTSAFHQ-EAETIA-4.jpg', type: 'image', category: 'product', originalName: 'NBOGTSAFHQ-EAETIA-4.jpg', status: 'exists' },
            { url: '/images/products/NBOGTSAFHQ-EAETIA-5.jpg', type: 'image', category: 'product', originalName: 'NBOGTSAFHQ-EAETIA-5.jpg', status: 'exists' }
          ],
          pdfs: [
            { url: '/pdfs/products/NBOGTS AFHQ EAETIA-PDF.pdf', name: 'Tour Brochure', originalName: 'NBOGTS AFHQ EAETIA-PDF.pdf', status: 'exists' }
          ]
        },
        locality: 'Nairobi, Kenya',
        class: 'Intimate Properties',
        countries: ['Kenya', 'Tanzania']
      };
      
      return successResponse(mockProductData);
    }
    
    // Get product details with images and structured content
    let productData;
    try {
      productData = await getProductDetails(productCode);
    } catch (detailsError) {
      console.error('❌ Error in getProductDetails:', detailsError);
      throw detailsError;
    }
    
    // Fix pricing for Savanna Lodge Honeymoon Deal specifically
    if (productCode === 'GKPSPSAV002SAVLHM' && productData.rates?.length > 0) {
      console.log('🔧 Applying pricing correction for Savanna Lodge');
      productData.rates = [{
        currency: 'AUD',
        singleRate: 0,
        doubleRate: 2407,
        twinRate: 2407,
        twinRateTotal: 2407,
        twinRateFormatted: 'AUD $1,204',
        dateRange: '30 July - 31 December 2025',
        rateName: 'Honeymoon Special'
      }];
    }
    
    // Fix pricing for Sabi Sabi Bush Lodge specifically
    if (productCode === 'GKPSPSABBLDSABBLS' && productData.rates?.length > 0) {
      console.log('🔧 Applying pricing correction for Sabi Sabi Bush Lodge');
      productData.rates = [{
        currency: 'AUD',
        singleRate: 8029,
        doubleRate: 11598,
        twinRate: 11598,
        twinRateTotal: 11598,
        twinRateFormatted: 'AUD $5,799',
        dateRange: '2025 Special Offer',
        rateName: 'Special Deal'
      }];
    }
    
    // Fix pricing for Classic Kruger Package (Makutsi Safari Springs) specifically
    if (productCode === 'HDSSPMAKUTSMSSCLS') {
      console.log('🔧 Applying pricing correction for Classic Kruger Package');
      productData.rates = [
        {
          currency: 'AUD',
          singleRate: 2270,
          doubleRate: 4540,
          twinRate: 4540,
          twinRateTotal: 4540,
          twinRateFormatted: 'AUD $2,270',
          dateRange: '4 Aug - 31 Oct 2025',
          rateName: 'Classic Kruger Package - Early Season'
        },
        {
          currency: 'AUD',
          singleRate: 2475,
          doubleRate: 4950,
          twinRate: 4950,
          twinRateTotal: 4950,
          twinRateFormatted: 'AUD $2,475',
          dateRange: '1 Nov 2025 - 31 Oct 2026',
          rateName: 'Classic Kruger Package - High Season'
        }
      ];
    }
    
    // Removed hardcoded pricing - let actual API data come through
    
    // Removed hardcoded pricing - let actual API data come through
    
    // Fix pricing for Kenya - Classic Kenya Serena Lodges Test Package
    if (productCode === 'NBOGPARP001CKSLP') {
      console.log('🔧 Applying pricing correction for Kenya - Classic Kenya Serena Lodges Test Package');
      productData.rates = [{
        currency: 'AUD',
        singleRate: 4400,
        doubleRate: 8800,
        twinRate: 8800,
        twinRateTotal: 8800,
        twinRateFormatted: 'AUD $4,400',
        dateRange: '2025 Package Rates',
        rateName: 'Classic Kenya Serena Lodges Test Package'
      }];
    }
    
    // Log what we found for debugging
    console.log(`✅ Product details retrieved:`);
    console.log(`   - Name: ${productData.name}`);
    console.log(`   - Images: ${productData.localAssets?.images.length || 0}`);
    console.log(`   - PDFs: ${productData.localAssets?.pdfs.length || 0}`);
    console.log(`   - Notes: ${productData.notes?.length || 0}`);
    console.log(`   - Rates: ${productData.rates?.length || 0}`);
    
    // Return the product data directly (successResponse already wraps it)
    return successResponse(productData);
    
  } catch (error) {
    console.error(`❌ Error fetching product details for ${productCode}:`, error);
    return handleTourPlanError(error);
  }
}