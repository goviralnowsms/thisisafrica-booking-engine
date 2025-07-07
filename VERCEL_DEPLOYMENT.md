# Vercel Deployment Guide

This guide will help you deploy the This Is Africa booking engine to Vercel.

## Prerequisites

- GitHub repository with the booking engine code
- Vercel account (free tier works fine)
- Domain name (optional)

## Step 1: Prepare Your Repository

1. **Ensure your code is ready:**
   ```bash
   # Test locally first
   npm run build
   npm run start
   ```

2. **Create a `.env.example` file** (if not exists):
   ```env
   # Tourplan API (Optional - demo mode works without these)
   TOURPLAN_API_URL=https://your-tourplan-api-url
   TOURPLAN_USERNAME=your-username
   TOURPLAN_PASSWORD=your-password
   TOURPLAN_AGENT_ID=your-agent-id
   TOURPLAN_PROXY_URL=https://your-aws-proxy-endpoint
   USE_TOURPLAN_PROXY=true

   # App URLs
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   APP_URL=https://your-vercel-domain.vercel.app

   # Stripe (Optional - demo mode works without these)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

   # Email (Optional)
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@thisisafrica.com.au
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project settings:**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Add Environment Variables:**
   - Click "Environment Variables" in project settings
   - Add each variable from your `.env.example`
   - Make sure `NEXT_PUBLIC_APP_URL` points to your Vercel domain

6. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. **Go to Settings → Environment Variables**
2. **Add the following variables:**

   ```env
   # Required
   NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
   APP_URL=https://your-vercel-domain.vercel.app

   # Optional - Demo mode works without these
   TOURPLAN_API_URL=https://your-tourplan-api-url
   TOURPLAN_USERNAME=your-username
   TOURPLAN_PASSWORD=your-password
   TOURPLAN_AGENT_ID=your-agent-id
   TOURPLAN_PROXY_URL=https://your-aws-proxy-endpoint
   USE_TOURPLAN_PROXY=true
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=noreply@thisisafrica.com.au
   ```

3. **Set Environment:**
   - Production: ✅
   - Preview: ✅ (for testing)
   - Development: ❌ (not needed)

## Step 4: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test the booking flow:**
   - Search for tours
   - Select a tour
   - Fill booking form
   - Test payment (demo mode)
   - Verify confirmation

3. **Test API endpoints:**
   ```bash
   # Health check
   curl https://your-domain.vercel.app/api/health

   # Tour search
   curl -X POST https://your-domain.vercel.app/api/tours/search \
     -H "Content-Type: application/json" \
     -d '{"country": "South Africa"}'
   ```

## Step 5: Custom Domain (Optional)

1. **In Vercel dashboard, go to Settings → Domains**
2. **Add your custom domain:**
   - Enter your domain (e.g., `booking.thisisafrica.com.au`)
   - Follow DNS configuration instructions
3. **Update environment variables:**
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
   - Change `APP_URL` to your custom domain

## Step 6: Production Configuration

### For Production with Tourplan API:

1. **Set up AWS EC2 proxy:**
   - Launch EC2 instance
   - Configure proxy server
   - Get static IP address

2. **Whitelist IP with Tourplan:**
   - Contact Tourplan support
   - Provide your EC2 IP address
   - Wait for confirmation

3. **Update environment variables:**
   ```env
   TOURPLAN_API_URL=https://your-tourplan-api-url
   TOURPLAN_USERNAME=your-username
   TOURPLAN_PASSWORD=your-password
   TOURPLAN_AGENT_ID=your-agent-id
   TOURPLAN_PROXY_URL=https://your-ec2-ip/proxy
   USE_TOURPLAN_PROXY=true
   ```

### For Production with Stripe:

1. **Get production Stripe keys:**
   - Go to Stripe Dashboard
   - Switch to live mode
   - Copy live keys

2. **Update environment variables:**
   ```env
   STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key
   ```

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Environment variables not working:**
   - Ensure variables are set for Production environment
   - Redeploy after adding variables
   - Check variable names match code

3. **API endpoints not working:**
   - Verify Vercel functions are deployed
   - Check server logs in Vercel dashboard
   - Test with curl commands

4. **Payment not working:**
   - Verify Stripe keys are correct
   - Check Stripe webhook configuration
   - Test with demo mode first

### Getting Help:

1. **Check Vercel logs:**
   - Go to your project in Vercel dashboard
   - Click on latest deployment
   - Check "Functions" tab for API errors

2. **Test locally:**
   ```bash
   npm run build
   npm run start
   ```

3. **Check environment:**
   - Visit `/api/health` endpoint
   - Check browser console for errors

## Monitoring

### Vercel Analytics:

1. **Enable Analytics** in project settings
2. **Monitor performance** and errors
3. **Set up alerts** for downtime

### Custom Monitoring:

1. **Health checks:**
   ```bash
   # Set up cron job to check health
   curl -f https://your-domain.vercel.app/api/health || echo "Site down"
   ```

2. **Uptime monitoring:**
   - Use services like UptimeRobot
   - Monitor critical endpoints
   - Set up notifications

## Security

### Environment Variables:

- ✅ **Never commit secrets** to Git
- ✅ **Use Vercel environment variables**
- ✅ **Rotate keys regularly**
- ✅ **Use different keys for dev/prod**

### API Security:

- ✅ **Validate all inputs**
- ✅ **Rate limit API endpoints**
- ✅ **Use HTTPS only**
- ✅ **Monitor for abuse**

## Performance

### Optimization:

1. **Enable Vercel Edge Functions** for faster API responses
2. **Use Image Optimization** for tour images
3. **Implement caching** for tour data
4. **Optimize bundle size** with code splitting

### Monitoring:

1. **Track Core Web Vitals**
2. **Monitor API response times**
3. **Set up performance budgets**
4. **Use Vercel Analytics**

---

Your booking engine is now live! 🎉

**Next Steps:**
1. Test the complete booking flow
2. Configure production services (Stripe, Tourplan)
3. Set up monitoring and alerts
4. Train your team on the system 