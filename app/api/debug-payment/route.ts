import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables (without exposing sensitive data)
    const envCheck = {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripePublic: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      stripeSecretLength: process.env.STRIPE_SECRET_KEY?.length || 0,
      stripePublicLength: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.length || 0,
      stripeSecretPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || 'none',
      stripePublicPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 8) || 'none',
      nodeEnv: process.env.NODE_ENV,
      hasResend: !!process.env.RESEND_API_KEY,
      hasTourplan: !!process.env.TOURPLAN_PASSWORD,
      timestamp: new Date().toISOString(),
      deploymentCheck: 'Payment system fix deployment - v1.0',
    };

    // Test basic Stripe import
    let stripeImportTest = 'success';
    try {
      const Stripe = require('stripe');
      if (process.env.STRIPE_SECRET_KEY) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-06-20',
        });
        stripeImportTest = 'initialized';
      }
    } catch (error) {
      stripeImportTest = `error: ${error instanceof Error ? error.message : 'unknown'}`;
    }

    return NextResponse.json({
      status: 'debug-info',
      environment: envCheck,
      stripeImport: stripeImportTest,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      host: request.headers.get('host'),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug endpoint failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}