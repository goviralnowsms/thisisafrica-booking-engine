import { NextRequest, NextResponse } from 'next/server';
import { 
  sendEmail, 
  sendBookingConfirmation, 
  sendQuoteEmail, 
  sendAdminNotification 
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'basic', to, ...data } = body;
    
    let result;
    
    switch (type) {
      case 'booking':
        result = await sendBookingConfirmation({
          reference: data.reference || 'TEST-BOOKING-123',
          customerEmail: to || 'customer@example.com',
          customerName: data.customerName || 'Test Customer',
          productName: data.productName || 'Classic Kenya Safari - 7 Days',
          dateFrom: data.dateFrom || '2025-10-15',
          dateTo: data.dateTo || '2025-10-22',
          totalCost: data.totalCost || 345000,
          currency: data.currency || 'AUD',
          status: data.status || 'CONFIRMED',
          requiresManualConfirmation: data.requiresManualConfirmation || false
        });
        break;
        
      case 'quote':
        result = await sendQuoteEmail({
          reference: data.reference || 'QUOTE-123',
          customerEmail: to || 'customer@example.com',
          customerName: data.customerName || 'Test Customer',
          productName: data.productName || 'Luxury Cape Town Experience',
          dateFrom: data.dateFrom || '2025-12-20',
          dateTo: data.dateTo || '2025-12-27',
          totalCost: data.totalCost || 567800,
          currency: data.currency || 'AUD'
        });
        break;
        
      case 'admin':
        result = await sendAdminNotification({
          reference: data.reference || 'TIA-CRUISE-123',
          customerName: data.customerName || 'Test Customer',
          customerEmail: data.customerEmail || 'customer@example.com',
          productCode: data.productCode || 'BBKCRCHO018TIACP2',
          productName: data.productName || 'Chobe Princess 2 Night River Cruise',
          dateFrom: data.dateFrom || '2025-10-31',
          totalCost: data.totalCost || 234500,
          currency: data.currency || 'AUD',
          requiresManualConfirmation: data.requiresManualConfirmation !== false,
          tourplanStatus: data.tourplanStatus || 'NO'
        });
        break;
        
      default:
        // Basic test email
        result = await sendEmail({
          to: to || 'test@example.com',
          subject: data.subject || 'Test Email from This is Africa',
          html: data.html || `
            <h1>Test Email</h1>
            <p>This is a test email from the This is Africa booking system.</p>
            <p>If you received this, the email service is working correctly!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          `,
          text: data.text || 'Test email from This is Africa booking system.'
        });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      result,
      type,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send test email' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: {
      endpoint: 'POST /api/test-email',
      types: ['basic', 'booking', 'quote', 'admin'],
      examples: {
        basic: {
          type: 'basic',
          to: 'test@example.com',
          subject: 'Test Email',
          html: '<h1>Test</h1>',
          text: 'Test'
        },
        booking: {
          type: 'booking',
          to: 'customer@example.com',
          customerName: 'John Doe',
          reference: 'BOOK-123',
          productName: 'Safari Tour',
          dateFrom: '2025-10-15',
          totalCost: 345000,
          currency: 'AUD'
        },
        quote: {
          type: 'quote',
          to: 'customer@example.com',
          customerName: 'Jane Smith',
          reference: 'QUOTE-456',
          productName: 'Luxury Safari',
          dateFrom: '2025-12-20',
          totalCost: 567800,
          currency: 'AUD'
        },
        admin: {
          type: 'admin',
          reference: 'TIA-RAIL-789',
          customerName: 'Bob Johnson',
          customerEmail: 'bob@example.com',
          productCode: 'VFARLROV001',
          productName: 'Rovos Rail Journey',
          dateFrom: '2025-11-10',
          totalCost: 890000,
          requiresManualConfirmation: true,
          tourplanStatus: 'NO'
        }
      }
    }
  });
}