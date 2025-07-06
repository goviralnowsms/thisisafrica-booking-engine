import { NextResponse } from 'next/server';
import { verifyPaymentStatus, processPaymentCallback } from '@/lib/paymentAPI';

// Define interfaces for the payment API return types
interface PaymentResult {
  status: string;
  reference?: string;
  amount?: number;
  currency?: string;
  provider: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Support both Tyro and Stripe parameters
  const paymentId = searchParams.get('paymentId') || searchParams.get('session_id');
  const status = searchParams.get('status');
  
  if (!paymentId) {
    return NextResponse.json(
      { error: 'Payment ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // First try to process the callback data directly
    const callbackData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });
    
    const callbackResult = await processPaymentCallback(callbackData) as PaymentResult;
    
    // If callback processing doesn't provide clear status, verify directly
    if (!callbackResult || callbackResult.status === 'PENDING') {
      const paymentStatus = await verifyPaymentStatus(paymentId) as PaymentResult;
      
      // Redirect back to the application with status
      const redirectUrl = `/payment?status=${paymentStatus.status}&paymentId=${paymentId}&provider=${paymentStatus.provider}`;
      
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    
    // Redirect with callback result status
    const redirectUrl = `/payment?status=${callbackResult.status}&paymentId=${paymentId}&provider=${callbackResult.provider}`;
    
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('Error processing payment callback:', error);
    
    return NextResponse.redirect(
      new URL(`/payment?status=ERROR&message=${encodeURIComponent('Error processing payment')}`, request.url)
    );
  }
}
