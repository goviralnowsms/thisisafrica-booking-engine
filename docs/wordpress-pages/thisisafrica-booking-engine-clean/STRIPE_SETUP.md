# Stripe Sandbox Keys Setup Guide

This guide explains how to safely add Stripe sandbox (test) keys to your project for development and testing.

## 🔐 Security Best Practices

### 1. Environment Variables
- **NEVER** commit API keys directly to your code
- Use environment variables to store sensitive data
- Keep test and production keys separate

### 2. File Structure
\`\`\`
.env.local          # Your actual keys (ignored by git)
.env.example        # Template file (committed to git)
.gitignore          # Ensures .env* files are not committed
\`\`\`

## 🚀 Quick Setup

### Step 1: Get Your Stripe Test Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in the left sidebar)
3. Navigate to **Developers > API keys**
4. Copy your:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Step 2: Configure Environment Variables
1. Copy the example file:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Edit `.env.local` and replace the placeholder values:
   \`\`\`env
   STRIPE_API_KEY=sk_test_your_actual_secret_key_here
   STRIPE_PUBLIC_KEY=pk_test_your_actual_publishable_key_here
   \`\`\`

### Step 3: Verify Setup
Your project is already configured to use these environment variables through [`lib/api/config.js`](lib/api/config.js).

## 🧪 Testing with Stripe Test Cards

Use these test card numbers in your payment forms:

| Card Number | Brand | Description |
|-------------|-------|-------------|
| `4242424242424242` | Visa | Succeeds |
| `4000000000000002` | Visa | Declined |
| `4000000000009995` | Visa | Insufficient funds |
| `4000000000000069` | Visa | Expired card |

**Test Details:**
- Use any future expiry date (e.g., `12/34`)
- Use any 3-digit CVC (e.g., `123`)
- Use any postal code (e.g., `12345`)

## 🔄 Webhook Setup (Optional)

If you need to handle webhooks:

1. Install Stripe CLI:
   \`\`\`bash
   npm install -g stripe-cli
   \`\`\`

2. Login to Stripe:
   \`\`\`bash
   stripe login
   \`\`\`

3. Forward webhooks to your local server:
   \`\`\`bash
   stripe listen --forward-to localhost:3000/api/payment/callback
   \`\`\`

4. Copy the webhook signing secret and add to `.env.local`:
   \`\`\`env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   \`\`\`

## 🌍 Environment-Specific Configuration

### Development (.env.local)
\`\`\`env
STRIPE_API_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
APP_URL=http://localhost:3000
\`\`\`

### Production (.env.production)
\`\`\`env
STRIPE_API_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
APP_URL=https://yourdomain.com
\`\`\`

## ⚠️ Important Security Notes

1. **Test vs Live Keys:**
   - Test keys start with `sk_test_` and `pk_test_`
   - Live keys start with `sk_live_` and `pk_live_`
   - Never use live keys in development

2. **Key Visibility:**
   - Secret keys (`sk_`) should NEVER be exposed to the client
   - Publishable keys (`pk_`) can be safely used in frontend code

3. **Git Security:**
   - `.env.local` is already in `.gitignore`
   - Never commit files containing actual API keys
   - Use `.env.example` as a template for team members

## 🔍 Verification Checklist

- [ ] `.env.local` file created with your actual Stripe keys
- [ ] Keys start with `sk_test_` and `pk_test_` (for development)
- [ ] `.env.local` is listed in `.gitignore`
- [ ] Test payment works with test card numbers
- [ ] No API keys are hardcoded in your source code

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API key" error:**
   - Check that your key starts with `sk_test_` for the secret key
   - Ensure no extra spaces or characters in your `.env.local` file

2. **Environment variables not loading:**
   - Restart your development server after changing `.env.local`
   - Ensure the file is named exactly `.env.local` (not `.env.local.txt`)

3. **Payment not working:**
   - Verify you're using test card numbers from the table above
   - Check browser console for any JavaScript errors

## 📚 Additional Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
