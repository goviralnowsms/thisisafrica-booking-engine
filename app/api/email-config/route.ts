import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.EMAIL_FROM || 'noreply@thisisafrica.com.au',
    adminEmails: process.env.ADMIN_EMAILS || 'sales@thisisafrica.com.au'
  });
}