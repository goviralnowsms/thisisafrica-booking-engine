#!/bin/bash

# Complete Deployment Script - Installs everything and deploys the app
set -e

echo "🚀 Complete deployment of Tourplan Booking Engine..."

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

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
print_status "EC2 Public IP: $EC2_IP"

# STEP 1: Install all dependencies
print_header "STEP 1: INSTALLING DEPENDENCIES"

# Update system
print_status "Updating system packages..."
sudo dnf update -y

# Install Git
print_status "Installing Git..."
sudo dnf install -y git

# Install Node.js
print_status "Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install PM2
print_status "Installing PM2..."
sudo npm install -g pm2

# Install additional tools
print_status "Installing additional tools..."
sudo dnf install -y nano curl wget unzip

# Verify installations
print_status "Verifying installations..."
git --version
node --version
npm --version
pm2 --version

# STEP 2: Clone and setup application
print_header "STEP 2: CLONING APPLICATION"

# Set application directory
APP_DIR="/home/ec2-user/booking-engine"

# Remove existing directory if it exists
if [ -d "$APP_DIR" ]; then
    print_warning "Existing application directory found, backing up..."
    mv "$APP_DIR" "${APP_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Clone repository
print_status "Cloning repository from GitHub..."
git clone https://github.com/goviralnowsms/booking-engine.git "$APP_DIR"

# Change to application directory
cd "$APP_DIR"
print_status "Changed to directory: $(pwd)"

# STEP 3: Install application dependencies
print_header "STEP 3: INSTALLING APP DEPENDENCIES"
print_status "Installing npm dependencies..."
npm install

# STEP 4: Create environment configuration
print_header "STEP 4: CREATING ENVIRONMENT CONFIG"
print_status "Creating environment configuration..."
cat > .env.local << EOF
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Neon Database (Alternative)
NEON_NEON_DATABASE_URL=postgresql://username:password@host/database

# Tourplan API Configuration
TOURPLAN_API_URL=https://xml.tourplan.com/tourplan/
TOURPLAN_USERNAME=your_tourplan_username
TOURPLAN_PASSWORD=your_tourplan_password
TOURPLAN_AGENT_ID=your_agent_id

# Optional: Tourplan Proxy Configuration
TOURPLAN_PROXY_URL=http://your-proxy-url
USE_TOURPLAN_PROXY=false

# Payment Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# Alternative SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# App Configuration
NEXT_PUBLIC_APP_URL=http://$EC2_IP:3000
APP_URL=http://$EC2_IP:3000

# Environment
NODE_ENV=production
EOF

# STEP 5: Build application
print_header "STEP 5: BUILDING APPLICATION"
print_status "Building Next.js application..."
npm run build

# STEP 6: Deploy with PM2
print_header "STEP 6: DEPLOYING WITH PM2"

# Stop existing PM2 process if running
print_status "Stopping existing PM2 processes..."
pm2 delete booking-engine 2>/dev/null || true

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start npm --name "booking-engine" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

print_header "DEPLOYMENT COMPLETE!"
print_status "✅ Everything installed and deployed successfully!"
echo ""
echo -e "${GREEN}🌐 Your application is running at: http://$EC2_IP:3000${NC}"
echo ""
echo -e "${YELLOW}Important next steps:${NC}"
echo "1. 🔧 Edit environment variables: nano $APP_DIR/.env.local"
echo "2. 🔄 Restart app after config changes: pm2 restart booking-engine"
echo "3. 📊 Check application status: pm2 status"
echo "4. 📝 View application logs: pm2 logs booking-engine"
echo "5. 🏥 Test health endpoint: curl http://$EC2_IP:3000/api/health"
echo "6. 🌍 Test IP endpoint: curl http://$EC2_IP:3000/api/check-ip"
echo ""
echo -e "${RED}⚠️  CRITICAL: You MUST edit .env.local with your actual API keys before the app will work properly!${NC}"
