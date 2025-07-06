#!/bin/bash

set -e

echo "🚀 Deploying Tourplan Booking Engine via Session Manager"
echo "======================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_header "STEP 1: SYSTEM UPDATE"
print_status "Updating system packages..."
sudo dnf update -y

print_header "STEP 2: INSTALL NODE.JS"
print_status "Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

print_status "Installing PM2 globally..."
sudo npm install -g pm2

print_status "Verifying installations..."
node --version
npm --version
pm2 --version

print_header "STEP 3: CLONE REPOSITORY"
print_status "Cloning booking engine repository..."
cd /home/ec2-user
git clone https://github.com/goviralnowsms/booking-engine.git
cd booking-engine

print_header "STEP 4: INSTALL DEPENDENCIES"
print_status "Installing npm dependencies..."
npm install

print_header "STEP 5: ENVIRONMENT CONFIGURATION"
if [ ! -f ".env.local" ]; then
    print_warning "Creating .env.local template..."
    cat > .env.local << 'EOF'
# Database Configuration - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration - Neon (Alternative)
NEON_NEON_DATABASE_URL=postgresql://username:password@host/database

# Tourplan API Configuration
TOURPLAN_API_URL=https://xml.tourplan.com/tourplan/xml/request.asp
TOURPLAN_USERNAME=your_tourplan_username
TOURPLAN_PASSWORD=your_tourplan_password
TOURPLAN_AGENT_ID=your_agent_id

# Optional: Tourplan Proxy Configuration
TOURPLAN_PROXY_URL=http://your-proxy-url
USE_TOURPLAN_PROXY=false

# Payment Configuration - Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration - Resend
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Alternative Email Configuration - SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://13.210.224.119:3000
APP_URL=http://13.210.224.119:3000

# Environment
NODE_ENV=production
EOF
    print_warning "⚠️  Please edit .env.local with your actual values!"
    print_status "Run: nano .env.local"
    print_status "After editing, run: npm run build && pm2 start npm --name 'booking-engine' -- start"
    exit 0
else
    print_status "✅ .env.local found"
fi

print_header "STEP 6: BUILD APPLICATION"
print_status "Building Next.js application..."
npm run build

print_header "STEP 7: START WITH PM2"
print_status "Stopping any existing processes..."
pm2 delete booking-engine 2>/dev/null || true

print_status "Starting application with PM2..."
pm2 start npm --name "booking-engine" -- start

print_status "Saving PM2 configuration..."
pm2 save

print_status "Setting up PM2 startup..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

print_header "DEPLOYMENT COMPLETE!"
print_status "✅ Application deployed successfully!"
echo ""
echo -e "${GREEN}🌐 Your application is running at: http://13.210.224.119:3000${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs booking-engine"
echo "🔄 Restart app: pm2 restart booking-engine"
echo "🏥 Health check: curl http://13.210.224.119:3000/api/health"
echo "🌍 IP check: curl http://13.210.224.119:3000/api/check-ip"
