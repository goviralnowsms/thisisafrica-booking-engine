# Environment Setup for This Is Africa Booking Engine

## Your Current Setup:
- **Local VPN IP**: 84.46.231.251 (whitelisted with Tourplan)
- **Development Server**: Running on localhost:3000
- **Status**: Ready to connect to Tourplan API

## Step 1: Create .env.local file

Create a file called `.env.local` in your project root with the following content:

```env
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000

# Tourplan API Configuration (Direct Connection)
TOURPLAN_API_URL=https://your_tourplan_sandbox_api_url
TOURPLAN_USERNAME=your_tourplan_username
TOURPLAN_PASSWORD=your_tourplan_password
TOURPLAN_AGENT_ID=your_tourplan_agent_id

# No proxy needed since your IP is whitelisted
USE_TOURPLAN_PROXY=false

# Stripe Sandbox (for testing payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Environment
NODE_ENV=development
```

## Step 2: Get Your Tourplan API Credentials

You'll need to provide:
1. **TOURPLAN_API_URL** - Your Tourplan sandbox API endpoint
2. **TOURPLAN_USERNAME** - Your Tourplan username
3. **TOURPLAN_PASSWORD** - Your Tourplan password
4. **TOURPLAN_AGENT_ID** - Your Tourplan agent ID

## Step 3: Get Stripe Test Keys

For payment testing, you'll need:
1. **STRIPE_SECRET_KEY** - Your Stripe test secret key (starts with sk_test_)
2. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** - Your Stripe test publishable key (starts with pk_test_)

## Step 4: Test the Connection

Once you have the .env.local file set up, restart your development server:

```bash
npm run dev
```

Then test the Tourplan connection:
- Visit: http://localhost:3000/api/check-tourplan-connection
- Should show: "Tourplan configuration is present"

## Step 5: Deploy to Vercel

After local testing works, deploy to Vercel:

```bash
npx vercel --yes
```

Then update the environment variables in Vercel dashboard with your production domain.

## Notes:
- Your VPN IP (84.46.231.251) is already whitelisted with Tourplan
- No AWS proxy needed for local development
- Demo mode will work even without Tourplan credentials
- Stripe sandbox will work for payment testing 