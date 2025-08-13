import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'demo_mode');

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  // In demo mode, just log the email
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'demo_mode') {
    console.log('📧 Demo mode - Email would be sent:', {
      to: options.to,
      subject: options.subject,
      from: options.from || process.env.EMAIL_FROM || 'noreply@thisisafrica.com.au'
    });
    return { success: true, id: 'demo_' + Date.now() };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: options.from || process.env.EMAIL_FROM || 'noreply@thisisafrica.com.au',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    });

    if (error) {
      console.error('❌ Email send error:', error);
      console.error('❌ Full Resend error object:', JSON.stringify(error, null, 2));
      return { success: false, error: error.message, fullError: error };
    }

    console.log('✅ Email sent successfully:', data?.id);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('❌ Email service error:', error);
    console.error('❌ Full catch error:', JSON.stringify(error, null, 2));
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email',
      fullError: error
    };
  }
}

// Helper function to send booking confirmation email
export async function sendBookingConfirmation(booking: {
  reference: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  dateFrom: string;
  dateTo?: string;
  totalCost: number;
  currency: string;
  status: string;
  requiresManualConfirmation?: boolean;
}) {
  try {
    console.log('🔄 Generating booking confirmation email template for:', booking.reference);
    const template = getBookingConfirmationTemplate(booking);
    
    console.log('📧 Sending booking confirmation to:', booking.customerEmail);
    console.log('📧 Email subject:', `Booking Confirmation - ${booking.reference}`);
    
    const result = await sendEmail({
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.reference}`,
      html: template.html,
      text: template.text,
      replyTo: 'sales@thisisafrica.com.au'
    });
    
    console.log('📧 Email send result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error in sendBookingConfirmation:', error);
    throw error;
  }
}

// Helper function to send quote email
export async function sendQuoteEmail(quote: {
  reference: string;
  customerEmail: string;
  customerName: string;
  productName: string;
  dateFrom: string;
  dateTo?: string;
  totalCost: number;
  currency: string;
}) {
  const template = getQuoteTemplate(quote);
  
  return sendEmail({
    to: quote.customerEmail,
    subject: `Travel Quote - ${quote.reference}`,
    html: template.html,
    text: template.text,
    replyTo: 'quotes@thisisafrica.com.au'
  });
}

// Helper function to send admin notification
export async function sendAdminNotification(booking: {
  reference: string;
  customerName: string;
  customerEmail: string;
  productCode: string;
  productName: string;
  dateFrom: string;
  totalCost: number;
  currency: string;
  requiresManualConfirmation?: boolean;
  tourplanStatus?: string;
}) {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@thisisafrica.com.au'];
  const template = getAdminNotificationTemplate(booking);
  
  return sendEmail({
    to: adminEmails,
    subject: `New Booking ${booking.requiresManualConfirmation ? '[MANUAL REQUIRED]' : ''} - ${booking.reference}`,
    html: template.html,
    text: template.text,
    replyTo: booking.customerEmail
  });
}

// Email template functions
function getBookingConfirmationTemplate_BROKEN(booking: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e3a5f; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 30px; background-color: #1e3a5f; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking ${booking.requiresManualConfirmation ? 'Received' : 'Confirmation'}</h1>
          <p>Reference: ${booking.reference}</p>
        </div>
        
        <div class="content">
          <p>Dear ${booking.customerName},</p>
          
          ${booking.requiresManualConfirmation ? `
            <div class="warning">
              <strong>Important:</strong> Your booking request has been received and is being processed. 
              Our team will contact you within 48 hours to confirm availability and finalize your booking.
            </div>
          ` : `
            <p>Thank you for your booking. Your travel arrangements have been confirmed.</p>
          `}
          
          <div class="booking-details">
            <h2>Booking Details</h2>
            
            <div class="detail-row">
              <span class="label">Reference Number:</span>
              <span class="value">${booking.reference}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Product:</span>
              <span class="value">${booking.productName}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Travel Date:</span>
              <span class="value">${new Date(booking.dateFrom).toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            ${booking.dateTo ? `
            <div class="detail-row">
              <span class="label">Return Date:</span>
              <span class="value">${new Date(booking.dateTo).toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            ` : ''}
            
            <div class="detail-row">
              <span class="label">Total Cost:</span>
              <span class="value">${booking.currency} ${(booking.totalCost / 100).toFixed(2)}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value">${booking.requiresManualConfirmation ? 'Pending Confirmation' : 'Confirmed'}</span>
            </div>
          </div>
          
          <h3>Next Steps</h3>
          ${booking.requiresManualConfirmation ? `
            <ol>
              <li>Our team will verify availability with the supplier</li>
              <li>You will receive a confirmation email within 48 hours</li>
              <li>If the dates are not available, we will contact you with alternatives</li>
              <li>Payment will only be processed once availability is confirmed</li>
            </ol>
          ` : `
            <ol>
              <li>You will receive detailed travel documents closer to your departure date</li>
              <li>Please ensure all passport and visa requirements are met</li>
              <li>Review your travel insurance options</li>
              <li>Contact us if you need to make any changes</li>
            </ol>
          `}
          
          <p>If you have any questions, please don't hesitate to contact us:</p>
          <ul>
            <li>Email: sales@thisisafrica.com.au</li>
            <li>Phone: +61 2 9664 9187</li>
            <li>Website: www.thisisafrica.com.au</li>
          </ul>
          
          <p>Thank you for choosing This is Africa!</p>
        </div>
        
        <div class="footer">
          <p>This is Africa | ABN 36 165 885 388</p>
          <p>Suite 3, Level 1, 42 Parkside Crescent, Campbelltown NSW 2560</p>
          <p>This email was sent to ${booking.customerEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Booking ${booking.requiresManualConfirmation ? 'Received' : 'Confirmation'}
Reference: ${booking.reference}

Dear ${booking.customerName},

${booking.requiresManualConfirmation ? 
  'Your booking request has been received and is being processed. Our team will contact you within 48 hours to confirm availability and finalize your booking.' :
  'Thank you for your booking. Your travel arrangements have been confirmed.'}

BOOKING DETAILS
---------------
Reference Number: ${booking.reference}
Product: ${booking.productName}
Travel Date: ${new Date(booking.dateFrom).toLocaleDateString('en-AU')}
${booking.dateTo ? `Return Date: ${new Date(booking.dateTo).toLocaleDateString('en-AU')}` : ''}
Total Cost: ${booking.currency} ${(booking.totalCost / 100).toFixed(2)}
Status: ${booking.requiresManualConfirmation ? 'Pending Confirmation' : 'Confirmed'}

NEXT STEPS
----------
${booking.requiresManualConfirmation ? 
  '1. Our team will verify availability\n2. You will receive confirmation within 48 hours\n3. Payment will be processed once confirmed' :
  '1. Travel documents will be sent closer to departure\n2. Ensure passport/visa requirements are met\n3. Review travel insurance options'}

Contact Us:
Email: sales@thisisafrica.com.au
Phone: +61 2 9664 9187
Website: www.thisisafrica.com.au

Thank you for choosing This is Africa!
  `;
  
  return { html, text };
}

// SIMPLE WORKING EMAIL TEMPLATE
function getBookingConfirmationTemplate(booking: any) {
  const html = `
    <html>
    <body>
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://thisisafrica.com.au/images/products/this-is-africa-logo.png" alt="This is Africa" style="max-width: 200px; height: auto;" />
      </div>
      <h1>BOOKING CONFIRMATION</h1>
      <p><strong>Reference:</strong> ${booking.reference}</p>
      <p><strong>Customer:</strong> ${booking.customerName}</p>
      <p><strong>Product:</strong> ${booking.productName}</p>
      <p><strong>Travel Date:</strong> ${booking.dateFrom}</p>
      <p><strong>Return Date:</strong> ${booking.dateTo || 'N/A'}</p>
      <p><strong>Status:</strong> ${booking.requiresManualConfirmation ? 'Pending Confirmation' : 'Confirmed'}</p>
      <p>Contact: sales@thisisafrica.com.au | +61 2 9664 9187</p>
    </body>
    </html>
  `;

  const text = `
BOOKING CONFIRMATION
Reference: ${booking.reference}
Customer: ${booking.customerName}
Product: ${booking.productName}
Travel Date: ${booking.dateFrom}
Return Date: ${booking.dateTo || 'N/A'}
Status: ${booking.requiresManualConfirmation ? 'Pending Confirmation' : 'Confirmed'}
Contact: sales@thisisafrica.com.au | +61 2 9664 9187
  `;

  return { html, text };
}

function getQuoteTemplate(quote: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f59e0b; color: white; padding: 30px 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; margin-bottom: 20px; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .quote-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .detail-row { margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; display: inline-block; min-width: 120px; }
        .value { color: #333; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .button { display: inline-block; padding: 12px 30px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .highlight { color: #f59e0b; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://thisisafrica.com.au/images/products/this-is-africa-logo.png" alt="This is Africa" class="logo" />
          <h1>Travel Quote</h1>
          <p>Reference: <span class="highlight">${quote.reference}</span></p>
        </div>
        
        <div class="content">
          <p>Dear ${quote.customerName},</p>
          
          <p>Thank you for your interest in our travel services. Please find your personalized quote below:</p>
          
          <div class="quote-details">
            <h2>Quote Details</h2>
            
            <div class="detail-row">
              <span class="label">Quote Reference:</span>
              <span class="value">${quote.reference}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Product:</span>
              <span class="value">${quote.productName}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Travel Date:</span>
              <span class="value">${new Date(quote.dateFrom).toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            
            ${quote.dateTo ? `
            <div class="detail-row">
              <span class="label">Return Date:</span>
              <span class="value">${new Date(quote.dateTo).toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            ` : ''}
            
            <div class="detail-row">
              <span class="label">Total Cost:</span>
              <span class="value" style="font-size: 18px; color: #1e3a5f;">
                <strong>${quote.currency} ${(quote.totalCost / 100).toFixed(2)}</strong>
              </span>
            </div>
          </div>
          
          <h3>Quote Validity</h3>
          <p>This quote is valid for 7 days from the date of issue. Prices are subject to availability at the time of booking.</p>
          
          <h3>How to Book</h3>
          <p>To confirm this booking, please:</p>
          <ol>
            <li>Reply to this email confirming you wish to proceed</li>
            <li>Or call us on +61 2 9664 9187</li>
            <li>Or visit our website at www.thisisafrica.com.au</li>
          </ol>
          
          <p>If you have any questions or would like to modify this quote, please don't hesitate to contact us.</p>
          
          <p>We look forward to helping you create unforgettable memories in Africa!</p>
        </div>
        
        <div class="footer">
          <p>This is Africa | ABN 36 165 885 388</p>
          <p>Suite 3, Level 1, 42 Parkside Crescent, Campbelltown NSW 2560</p>
          <p>This email was sent to ${quote.customerEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Travel Quote
Reference: ${quote.reference}

Dear ${quote.customerName},

Thank you for your interest in our travel services. Please find your personalized quote below:

QUOTE DETAILS
-------------
Quote Reference: ${quote.reference}
Product: ${quote.productName}
Travel Date: ${new Date(quote.dateFrom).toLocaleDateString('en-AU')}
${quote.dateTo ? `Return Date: ${new Date(quote.dateTo).toLocaleDateString('en-AU')}` : ''}
Total Cost: ${quote.currency} ${(quote.totalCost / 100).toFixed(2)}

QUOTE VALIDITY
--------------
This quote is valid for 7 days from the date of issue. Prices are subject to availability at the time of booking.

HOW TO BOOK
-----------
To confirm this booking:
1. Reply to this email confirming you wish to proceed
2. Or call us on +61 2 9664 9187
3. Or visit www.thisisafrica.com.au

Contact Us:
Email: quotes@thisisafrica.com.au
Phone: +61 2 9664 9187
Website: www.thisisafrica.com.au

We look forward to helping you create unforgettable memories in Africa!

This is Africa
  `;
  
  return { html, text };
}

function getAdminNotificationTemplate(booking: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: ${booking.requiresManualConfirmation ? '#dc3545' : '#f59e0b'}; color: white; padding: 30px 20px; text-align: center; }
        .logo { max-width: 200px; height: auto; margin-bottom: 20px; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .booking-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .detail-row { margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #666; display: inline-block; min-width: 120px; }
        .value { color: #333; }
        .warning { background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .highlight { color: #f59e0b; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://thisisafrica.com.au/images/products/this-is-africa-logo.png" alt="This is Africa" class="logo" />
          <h1>New Booking ${booking.requiresManualConfirmation ? '[MANUAL ACTION REQUIRED]' : 'Confirmed'}</h1>
          <p>Reference: <span class="highlight">${booking.reference}</span></p>
        </div>
        
        <div class="content">
          ${booking.requiresManualConfirmation ? `
            <div class="warning">
              <strong>⚠️ Manual Processing Required!</strong><br>
              This booking requires manual confirmation with the supplier.<br>
              TourPlan Status: ${booking.tourplanStatus || 'Unknown'}<br>
              Product Type: ${booking.productCode.includes('CRUISE') ? 'CRUISE' : booking.productCode.includes('RAIL') ? 'RAIL' : 'OTHER'}
            </div>
          ` : ''}
          
          <div class="booking-details">
            <h2>Customer Information</h2>
            
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${booking.customerName}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value"><a href="mailto:${booking.customerEmail}">${booking.customerEmail}</a></span>
            </div>
            
            <h2>Booking Details</h2>
            
            <div class="detail-row">
              <span class="label">Reference:</span>
              <span class="value">${booking.reference}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Product Code:</span>
              <span class="value">${booking.productCode}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Product Name:</span>
              <span class="value">${booking.productName}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Travel Date:</span>
              <span class="value">${new Date(booking.dateFrom).toLocaleDateString('en-AU')}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Total Cost:</span>
              <span class="value">${booking.totalCost && booking.totalCost > 0 ? `${booking.currency} ${(booking.totalCost / 100).toFixed(2)}` : 'TBC'}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">TourPlan Status:</span>
              <span class="value">${booking.tourplanStatus || 'N/A'}</span>
            </div>
          </div>
          
          ${booking.requiresManualConfirmation ? `
            <h3>Required Actions:</h3>
            <ol>
              <li>Contact supplier to confirm availability</li>
              <li>Process booking manually in TourPlan</li>
              <li>Send confirmation email to customer</li>
              <li>Update booking status in system</li>
            </ol>
          ` : ''}
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.reference}" 
               style="display: inline-block; padding: 12px 30px; background-color: #1e3a5f; color: white; text-decoration: none; border-radius: 5px;">
              View in Admin Panel
            </a>
          </p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from the TIA Booking System</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
New Booking ${booking.requiresManualConfirmation ? '[MANUAL ACTION REQUIRED]' : 'Confirmed'}
Reference: ${booking.reference}

${booking.requiresManualConfirmation ? 
  `⚠️ MANUAL PROCESSING REQUIRED!\nTourPlan Status: ${booking.tourplanStatus || 'Unknown'}\n` : ''}

CUSTOMER INFORMATION
--------------------
Name: ${booking.customerName}
Email: ${booking.customerEmail}

BOOKING DETAILS
---------------
Reference: ${booking.reference}
Product Code: ${booking.productCode}
Product Name: ${booking.productName}
Travel Date: ${new Date(booking.dateFrom).toLocaleDateString('en-AU')}
Total Cost: ${booking.totalCost && booking.totalCost > 0 ? `${booking.currency} ${(booking.totalCost / 100).toFixed(2)}` : 'TBC'}
TourPlan Status: ${booking.tourplanStatus || 'N/A'}

${booking.requiresManualConfirmation ? 
  'REQUIRED ACTIONS:\n1. Contact supplier to confirm availability\n2. Process booking manually\n3. Send confirmation to customer\n4. Update booking status' : ''}

View in Admin Panel: ${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.reference}
  `;
  
  return { html, text };
}

export { getBookingConfirmationTemplate, getQuoteTemplate, getAdminNotificationTemplate };