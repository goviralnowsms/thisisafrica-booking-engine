#!/bin/bash

# Update environment variables on Vultr server for HTTPS
echo "Updating production environment variables for HTTPS..."

cat > /root/updated-tia/.env.production.local << 'EOF'
# This Is Africa Booking Engine - Production Environment Variables

# App URLs (Updated for HTTPS)
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

# WordPress Database
DB_HOST=localhost
DB_USER=thisisafricacom_imageexport
DB_PASSWORD=f4Xr0vEwS!hlcpx6
DB_NAME=thisisafricacom_traveld2_travel

# Supabase
SUPABASE_URL=https://qtbfvjggnupqgoekjdtm.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://qtbfvjggnupqgoekjdtm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YmZ2amdnbnVwcWdvZWtqZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTEzOTgsImV4cCI6MjA1ODg4NzM5OH0.iv08lwHigKFRzaS5o4b3HjLZLqQMPxM-jnfgVdyktDc
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YmZ2amdnbnVwcWdvZWtqZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMTEzOTgsImV4cCI6MjA1ODg4NzM5OH0.iv08lwHigKFRzaS5o4b3HjLZLqQMPxM-jnfgVdyktDc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0YmZ2amdnbnVwcWdvZWtqZHRtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzMxMTM5OCwiZXhwIjoyMDU4ODg3Mzk4fQ.gl8Oc0zMd-FGkgK5aO2wuzv-GcPr-60k-32kxQrE33k

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_51RYzX3I7q377qvY0tV1r8zvaaFqc6VRpfJBSjKS8yLqwVncitScxUi03ZofSAdOpD4JsXuEQHc4apGKqj7cI6nBX00KKzvpGtZ
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RYzX3I7q377qvY08WDWHO5slz0a2Lua9lw8ibgNvAcAcmy1OFsiupYkjJSuiWEbubKcrXnx1xAsD3fVP8NPUTSm00isPspOLB

# Email
RESEND_API_KEY=re_EjQP1u3d_9FFECVwHU4GYQfUoMqEHrGgL
EMAIL_FROM=noreply@book.thisisafrica.com.au
ADMIN_EMAILS=sales@thisisafrica.com.au

# Environment
NODE_ENV=production
EOF

echo "✅ Environment variables updated for HTTPS!"
echo "Restarting the application..."

# Restart the application to pick up new env variables
cd /root/updated-tia
pm2 restart updated-tia

echo "✅ Application restarted with new environment variables"