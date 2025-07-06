import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Handle payment cancellation
  return NextResponse.redirect(
    new URL('/payment?status=CANCELLED', request.url)
  );
}
