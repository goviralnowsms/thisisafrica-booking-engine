#!/bin/bash

# Update production environment variables on Vultr
echo "🔧 Updating production environment variables..."

# Create .env.production.local with essential variables
cat > .env.production.local << 'EOF'
# This Is Africa Production Environment Variables

# App URLs
NEXT_PUBLIC_APP_URL=https://book.thisisafrica.com.au
APP_URL=https://book.thisisafrica.com.au

# TourPlan API Configuration (server-side only)
TOURPLAN_API_URL=https://pa-thisis.nx.tourplan.net/hostconnect/api/hostConnectApi
TOURPLAN_AGENT_ID=SAMAGT
TOURPLAN_PASSWORD=S@MAgt01
TOURPLAN_TIMEOUT=30000
TOURPLAN_RETRIES=3

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=h4qu7hkw
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-09-04
SANITY_API_TOKEN=skUREaXA9lNLT1nmAZljtznXRIhMhsjsV3W2bmMmB9VdZGqUvfE7YasI6hoaYk1dppUKnHTz7KOpbxm4SkIQMi9XKiReiyL2861TwfhX6JshNHCKkAnuX6jYcQqziFsUIYaD3YT0gZV6djEzq1mHzWuMw13p9VZPBq7fxNfPWP4pzsrBE1ZP

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_51RYzX3I7q377qvY0tV1r8zvaaFqc6VRpfJBSjKS8yLqwVncitScxUi03ZofSAdOpD4JsXuEQHc4apGKqj7cI6nBX00KKzvpGtZ
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RYzX3I7q377qvY08WDWHO5slz0a2Lua9lw8ibgNvAcAcmy1OFsiupYkjJSuiWEbubKcrXnx1xAsD3fVP8NPUTSm00isPspOLB

# Email Notifications
RESEND_API_KEY=re_EjQP1u3d_9FFECVwHU4GYQfUoMqEHrGgL
EMAIL_FROM=noreply@book.thisisafrica.com.au
ADMIN_EMAILS=sales@thisisafrica.com.au

# Environment
NODE_ENV=production
EOF

echo "✅ Production environment variables updated!"
echo "📁 Created: .env.production.local"

# Set proper permissions
chmod 600 .env.production.local

echo "🔒 Environment file permissions secured"