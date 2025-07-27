import { NextRequest } from 'next/server';
import { getProductDetails } from '@/lib/tourplan';
import { successResponse, errorResponse, handleTourPlanError } from '../../utils';

// GET - Get product details with images and full content
export async function GET(
  request: NextRequest,
  { params }: { params: { productCode: string } }
) {
  try {
    const { productCode } = params;
    
    if (!productCode) {
      return errorResponse('Product code is required', 400);
    }
    
    console.log(`🔍 Fetching full product details for code: ${productCode}`);
    
    // Get product details with images and structured content
    const productData = await getProductDetails(productCode);
    
    // Log what we found for debugging
    console.log(`✅ Product details retrieved:`);
    console.log(`   - Name: ${productData.name}`);
    console.log(`   - Images: ${productData.localAssets?.images.length || 0}`);
    console.log(`   - PDFs: ${productData.localAssets?.pdfs.length || 0}`);
    console.log(`   - Notes: ${productData.notes?.length || 0}`);
    console.log(`   - Rates: ${productData.rates?.length || 0}`);
    
    // Return in the format expected by the frontend (matching docs/page.tsx)
    return successResponse({
      success: true,
      data: productData
    });
    
  } catch (error) {
    console.error(`❌ Error fetching product details for ${params.productCode}:`, error);
    return handleTourPlanError(error);
  }
}