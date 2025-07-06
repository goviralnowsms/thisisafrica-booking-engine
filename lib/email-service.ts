import nodemailer from "nodemailer"

interface BookingConfirmationEmailOptions {
  to: string
  bookingId: string
  customerName: string
  tourName: string
  bookingDate: string
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async sendBookingConfirmationEmail(options: BookingConfirmationEmailOptions): Promise<void> {
    const { to, bookingId, customerName, tourName, bookingDate } = options

    const bookingUrl = `https://book.thisisafrica.com.au/booking/${bookingId}`

    const mailOptions = {
      from: "bookings@thisisafrica.com.au",
      to: to,
      subject: "Booking Confirmation",
      html: `
        <p>Dear ${customerName},</p>
        <p>Your booking for ${tourName} on ${bookingDate} has been confirmed.</p>
        <p>You can view your booking details at: <a href="${bookingUrl}">${bookingUrl}</a></p>
        <p>Thank you for booking with us!</p>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log("Booking confirmation email sent successfully!")
    } catch (error) {
      console.error("Error sending booking confirmation email:", error)
      throw error
    }
  }

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
