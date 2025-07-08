import nodemailer from "nodemailer"

interface BookingConfirmationEmailOptions {
  to: string
  bookingId: string
  customerName: string
  tourName: string
  bookingDate: string
  bookingReference: string
  totalAmount: number
  depositAmount: number
  remainingBalance: number
}

interface PaymentReminderEmailOptions {
  to: string
  customerName: string
  bookingReference: string
  tourName: string
  tourDate: string
  totalAmount: number
  remainingBalance: number
  dueDate: string
  paymentUrl: string
}

interface StaffNotificationEmailOptions {
  to: string
  bookingReference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  tourName: string
  tourDate: string
  totalAmount: number
  depositAmount: number
  adults: number
  children: number
  adminUrl: string
}

export class EmailService {
  private transporter: nodemailer.Transporter
  private useEmailJS: boolean

  constructor() {
    this.useEmailJS = process.env.USE_EMAILJS === 'true'
    
    if (!this.useEmailJS) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT || "587"),
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    }
  }

  // Customer Booking Confirmation Email
  async sendBookingConfirmationEmail(options: BookingConfirmationEmailOptions): Promise<void> {
    const { 
      to, 
      bookingId, 
      customerName, 
      tourName, 
      bookingDate, 
      bookingReference,
      totalAmount,
      depositAmount,
      remainingBalance
    } = options

    const bookingUrl = `https://book.thisisafrica.com.au/booking/${bookingReference}`
    const paymentUrl = `https://book.thisisafrica.com.au/payment/${bookingReference}`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - This Is Africa</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2c5530; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .payment-summary { background: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #2c5530; color: white; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .important { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your African adventure is secured</p>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            
            <p>Thank you for booking with This Is Africa! Your booking has been confirmed and we're excited to help you create unforgettable memories.</p>
            
            <div class="booking-details">
              <h2>📋 Booking Details</h2>
              <p><strong>Booking Reference:</strong> ${bookingReference}</p>
              <p><strong>Tour:</strong> ${tourName}</p>
              <p><strong>Date:</strong> ${bookingDate}</p>
              <p><strong>Status:</strong> Confirmed</p>
            </div>
            
            <div class="payment-summary">
              <h2>💰 Payment Summary</h2>
              <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
              <p><strong>Deposit Paid:</strong> $${depositAmount.toFixed(2)} ✅</p>
              <p><strong>Remaining Balance:</strong> $${remainingBalance.toFixed(2)}</p>
            </div>
            
            <div class="important">
              <h3>⚠️ Important Information</h3>
              <ul>
                <li>Your remaining balance of $${remainingBalance.toFixed(2)} is due 2 weeks before your tour date</li>
                <li>You'll receive a payment reminder email 2 weeks before departure</li>
                <li>All bookings are subject to supplier confirmation</li>
                <li>Travel insurance is recommended</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${bookingUrl}" class="button">View Booking Details</a>
              <a href="${paymentUrl}" class="button" style="margin-left: 10px;">Pay Remaining Balance</a>
            </div>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or need to make changes to your booking, please contact us:</p>
            <ul>
              <li>Email: bookings@thisisafrica.com.au</li>
              <li>Phone: +27 21 123 4567</li>
              <li>WhatsApp: +27 82 123 4567</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This Is Africa - Creating Unforgettable African Adventures</p>
            <p>© 2024 This Is Africa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: "bookings@thisisafrica.com.au",
      to: to,
      subject: `Booking Confirmed - ${tourName} (${bookingReference})`,
      html: htmlContent,
    }

    try {
      if (this.useEmailJS) {
        await this.sendViaEmailJS({
          to,
          subject: mailOptions.subject,
          html: htmlContent,
          templateId: 'booking_confirmation'
        })
      } else {
        await this.transporter.sendMail(mailOptions)
      }
      console.log("Booking confirmation email sent successfully!")
    } catch (error) {
      console.error("Error sending booking confirmation email:", error)
      throw error
    }
  }

  // Payment Reminder Email (2 weeks before tour)
  async sendPaymentReminderEmail(options: PaymentReminderEmailOptions): Promise<void> {
    const { 
      to, 
      customerName, 
      bookingReference, 
      tourName, 
      tourDate, 
      totalAmount, 
      remainingBalance, 
      dueDate, 
      paymentUrl 
    } = options

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder - This Is Africa</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4edda; color: #155724; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .payment-urgent { background: #f8d7da; color: #721c24; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Final Payment Reminder</h1>
            <p>Your tour is just 2 weeks away!</p>
          </div>
          
          <div class="content">
            <p>Dear ${customerName},</p>
            
            <p>Your African adventure is just around the corner! This is a friendly reminder that your final payment is due.</p>
            
            <div class="payment-urgent">
              <h2>⚠️ Payment Due</h2>
              <p><strong>Remaining Balance:</strong> $${remainingBalance.toFixed(2)}</p>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p><strong>Tour Date:</strong> ${tourDate}</p>
            </div>
            
            <div class="booking-details">
              <h2>📋 Booking Details</h2>
              <p><strong>Booking Reference:</strong> ${bookingReference}</p>
              <p><strong>Tour:</strong> ${tourName}</p>
              <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paymentUrl}" class="button">Pay Now</a>
            </div>
            
            <h3>📞 Need Help?</h3>
            <p>If you have any questions about your payment or booking, please contact us immediately:</p>
            <ul>
              <li>Email: bookings@thisisafrica.com.au</li>
              <li>Phone: +27 21 123 4567</li>
              <li>WhatsApp: +27 82 123 4567</li>
            </ul>
            
            <p><strong>Note:</strong> Failure to pay the remaining balance may result in cancellation of your booking.</p>
          </div>
          
          <div class="footer">
            <p>This Is Africa - Creating Unforgettable African Adventures</p>
            <p>© 2024 This Is Africa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: "bookings@thisisafrica.com.au",
      to: to,
      subject: `Payment Reminder - ${tourName} (${bookingReference})`,
      html: htmlContent,
    }

    try {
      if (this.useEmailJS) {
        await this.sendViaEmailJS({
          to,
          subject: mailOptions.subject,
          html: htmlContent,
          templateId: 'payment_reminder'
        })
      } else {
        await this.transporter.sendMail(mailOptions)
      }
      console.log("Payment reminder email sent successfully!")
    } catch (error) {
      console.error("Error sending payment reminder email:", error)
      throw error
    }
  }

  // Staff Notification Email
  async sendStaffNotificationEmail(options: StaffNotificationEmailOptions): Promise<void> {
    const { 
      to, 
      bookingReference, 
      customerName, 
      customerEmail, 
      customerPhone, 
      tourName, 
      tourDate, 
      totalAmount, 
      depositAmount, 
      adults, 
      children, 
      adminUrl 
    } = options

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking - This Is Africa</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .customer-details { background: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Booking Received!</h1>
            <p>Action required - Please review and confirm</p>
          </div>
          
          <div class="content">
            <h2>📋 Booking Information</h2>
            
            <div class="booking-details">
              <p><strong>Booking Reference:</strong> ${bookingReference}</p>
              <p><strong>Tour:</strong> ${tourName}</p>
              <p><strong>Date:</strong> ${tourDate}</p>
              <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
              <p><strong>Deposit Amount:</strong> $${depositAmount.toFixed(2)}</p>
              <p><strong>Participants:</strong> ${adults} adults, ${children} children</p>
            </div>
            
            <div class="customer-details">
              <h3>👤 Customer Details</h3>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${adminUrl}" class="button">View in Admin Panel</a>
            </div>
            
            <h3>📞 Next Steps</h3>
            <ul>
              <li>Review booking details in admin panel</li>
              <li>Confirm availability with suppliers</li>
              <li>Send confirmation to customer</li>
              <li>Prepare tour documentation</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This Is Africa - Admin Notification</p>
            <p>© 2024 This Is Africa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: "bookings@thisisafrica.com.au",
      to: to,
      subject: `New Booking - ${tourName} (${bookingReference})`,
      html: htmlContent,
    }

    try {
      if (this.useEmailJS) {
        await this.sendViaEmailJS({
          to,
          subject: mailOptions.subject,
          html: htmlContent,
          templateId: 'staff_notification'
        })
      } else {
        await this.transporter.sendMail(mailOptions)
      }
      console.log("Staff notification email sent successfully!")
    } catch (error) {
      console.error("Error sending staff notification email:", error)
      throw error
    }
  }

  // Email.js integration
  private async sendViaEmailJS(options: {
    to: string
    subject: string
    html: string
    templateId: string
  }): Promise<void> {
    // This would integrate with EmailJS
    // You'll need to install @emailjs/browser and configure it
    console.log(`EmailJS: Sending ${options.templateId} to ${options.to}`)
    
    // For now, we'll use nodemailer as fallback
    if (this.transporter) {
      await this.transporter.sendMail({
        from: "bookings@thisisafrica.com.au",
        to: options.to,
        subject: options.subject,
        html: options.html,
      })
    }
  }

  // Legacy methods for backward compatibility
  getBookingConfirmationTemplate(data: any): string {
    return `
      <div>
        <p>Dear ${data.customerName},</p>
        <p>Your booking with reference ${data.bookingReference} has been confirmed.</p>
        <p>Tour: ${data.tourName}</p>
        <p>Date: ${data.tourDate}</p>
        <p>Total: ${data.totalAmount}</p>
        <p>
          <a href="https://book.thisisafrica.com.au/booking/${data.bookingReference}" class="button">View Booking Details</a>
        </p>
        <p>Thank you for booking with us!</p>
      </div>
    `
  }

  getPaymentReminderTemplate(data: any): string {
    return `
      <div>
        <p>Dear ${data.customerName},</p>
        <p>This is a reminder that your payment for booking ${data.bookingReference} is due.</p>
        <p>Total: ${data.totalAmount}</p>
        <p>Due Date: ${data.dueDate}</p>
        <p>
          <a href="https://book.thisisafrica.com.au/payment/${data.bookingReference}" class="button">Pay Now</a>
        </p>
      </div>
    `
  }

  getAdminNotificationTemplate(data: any): string {
    return `
      <div>
        <p>New booking received!</p>
        <p>Booking Reference: ${data.bookingReference}</p>
        <p>Customer Name: ${data.customerName}</p>
        <p>Tour: ${data.tourName}</p>
        <p>Date: ${data.tourDate}</p>
        <p>Total: ${data.totalAmount}</p>
        <p><a href="https://book.thisisafrica.com.au/admin/bookings/${data.bookingReference}">View in Admin Panel</a></p>
      </div>
    `
  }
}
