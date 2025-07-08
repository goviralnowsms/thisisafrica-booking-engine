# Resend.com Email Setup Guide

## Overview
This guide will help you set up Resend.com for email notifications in your This Is Africa booking engine.

## Why Resend.com?
- ✅ **Better deliverability** than traditional SMTP
- ✅ **Professional templates** with tracking
- ✅ **Webhooks** for delivery status
- ✅ **3,000 emails/month free** then $0.80/1000 emails
- ✅ **Perfect for transactional emails** (booking confirmations, reminders)

## Step 1: Create Resend.com Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log into your Resend.com dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Name it: `This Is Africa Booking Engine`
5. Copy the API key (starts with `re_`)

## Step 3: Verify Your Domain

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter: `thisisafrica.com.au`
4. Follow the DNS setup instructions:
   - Add TXT record for SPF
   - Add CNAME record for DKIM
   - Add MX record if needed

## Step 4: Configure Environment Variables

Add to your `.env.local` file:

```bash
# Resend.com Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=sales@thisisafrica.com.au
```

## Step 5: Test Email Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the email service:
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"email":"your-email@example.com"}'
   ```

3. Check your email inbox for the test email

## Step 6: Email Templates Available

Your booking engine now includes these email templates:

### 1. Customer Booking Confirmation
- **Trigger**: When customer completes booking
- **Content**: Booking details, payment summary, important information
- **Action buttons**: View booking, pay remaining balance

### 2. Payment Reminder (2 weeks before tour)
- **Trigger**: Automated 2 weeks before tour date
- **Content**: Urgent payment reminder, tour details
- **Action button**: Pay now

### 3. Staff Notification
- **Trigger**: When new booking is created
- **Content**: Booking details, customer information
- **Action button**: View in admin panel

## Step 7: Production Deployment

### For Vercel:
1. Add environment variables in Vercel dashboard:
   - `RESEND_API_KEY`: Your Resend API key
   - `EMAIL_FROM`: sales@thisisafrica.com.au

### For AWS/EC2:
1. Add to your production environment:
   ```bash
   export RESEND_API_KEY=re_your_api_key_here
   export EMAIL_FROM=sales@thisisafrica.com.au
   ```

## Step 8: Monitor Email Delivery

1. **Resend Dashboard**: Check delivery rates, bounces, opens
2. **Webhooks**: Set up webhooks for delivery events
3. **Logs**: Monitor email sending in your application logs

## Email Features Included

### ✅ Customer Notifications
- Booking confirmation emails
- Payment reminders (2 weeks before tour)
- Professional HTML templates
- Mobile-responsive design

### ✅ Staff Notifications
- New booking alerts
- Customer details included
- Direct links to admin panel

### ✅ Automated Reminders
- 2-week payment reminders
- Configurable timing
- Database integration

### ✅ Professional Branding
- This Is Africa branding
- Contact information included
- Professional styling

## Troubleshooting

### Common Issues:

1. **"API key not found"**
   - Check your `RESEND_API_KEY` environment variable
   - Ensure the key starts with `re_`

2. **"Domain not verified"**
   - Complete DNS verification in Resend dashboard
   - Wait 24-48 hours for DNS propagation

3. **"Email not sending"**
   - Check Resend dashboard for errors
   - Verify recipient email address
   - Check application logs

4. **"Templates not loading"**
   - Restart your development server
   - Clear browser cache
   - Check file paths

## Support

- **Resend.com Support**: [support@resend.com](mailto:support@resend.com)
- **This Is Africa**: sales@thisisafrica.com.au
- **Technical Issues**: Check application logs and Resend dashboard

## Next Steps

1. ✅ Set up Resend.com account
2. ✅ Configure API key
3. ✅ Test email functionality
4. ✅ Deploy to production
5. ✅ Monitor email delivery
6. ✅ Set up webhooks (optional)

Your booking engine is now ready to send professional email notifications to customers and staff! 