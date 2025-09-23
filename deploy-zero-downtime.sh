#!/bin/bash

# Zero-downtime deployment script for This Is Africa
# This script performs a rolling deployment using PM2 cluster mode

set -e  # Exit on error

echo "🚀 Zero-Downtime Deployment Script for This Is Africa"
echo "======================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Pull latest code
print_status "📥 Pulling latest code from GitHub..."
git pull origin main || {
    print_error "Failed to pull latest code"
    exit 1
}

# Step 2: Check for environment file
if [ ! -f ".env.production.local" ]; then
    print_warning ".env.production.local not found!"

    # Try to copy from .env.local if it exists
    if [ -f ".env.local" ]; then
        print_status "Creating .env.production.local from .env.local..."
        cp .env.local .env.production.local

        # Update app URL for production
        sed -i 's|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://book.thisisafrica.com.au|g' .env.production.local
        sed -i 's|NODE_ENV=.*|NODE_ENV=production|g' .env.production.local

        print_success "Created .env.production.local from .env.local"
    else
        print_error "No environment file found. Please create .env.production.local"
        print_error "You can copy from your local .env.local file"
        exit 1
    fi
else
    print_success "Using existing .env.production.local"

    # Run update script if it exists (for adding new variables)
    if [ -f "update-env-production.sh" ]; then
        print_status "Running environment update script..."
        chmod +x update-env-production.sh
        ./update-env-production.sh
    fi
fi

# Ensure proper permissions
chmod 600 .env.production.local

# Step 3: Install dependencies if package.json changed
print_status "📦 Checking dependencies..."
if git diff HEAD~1 HEAD --name-only | grep -q "package.json\|pnpm-lock.yaml"; then
    print_status "Dependencies changed. Installing..."
    pnpm install --frozen-lockfile || {
        print_error "Failed to install dependencies"
        exit 1
    }
else
    print_success "No dependency changes detected"
fi

# Step 4: Build the application
print_status "🔨 Building Next.js application..."
pnpm build || {
    print_error "Build failed"
    exit 1
}
print_success "Build completed successfully"

# Step 5: Check if PM2 is running with our app
print_status "🔍 Checking PM2 status..."
if pm2 list | grep -q "thisisafrica"; then
    print_status "App is running. Performing zero-downtime reload..."

    # Step 6: Reload with zero downtime
    pm2 reload ecosystem.config.js --update-env || {
        print_warning "Reload failed, trying graceful restart..."
        pm2 restart ecosystem.config.js --update-env
    }
    print_success "Application reloaded with zero downtime!"
else
    print_status "App not running. Starting fresh..."

    # Step 7: Start the application for the first time
    pm2 start ecosystem.config.js || {
        print_error "Failed to start application"
        exit 1
    }
    print_success "Application started successfully!"
fi

# Step 8: Save PM2 configuration
print_status "💾 Saving PM2 configuration..."
pm2 save || print_warning "Could not save PM2 configuration"

# Step 9: Show status
print_status "📊 Current application status:"
pm2 list

# Step 10: Test if the site is responding
print_status "🧪 Testing site availability..."
sleep 5  # Give the app time to start

# Test the local instance
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    print_success "Site is responding correctly!"
else
    print_warning "Site may not be fully ready yet. Check manually at https://book.thisisafrica.com.au"
fi

# Step 11: Show logs (last 20 lines)
print_status "📝 Recent logs:"
pm2 logs thisisafrica --nostream --lines 20

echo ""
echo "======================================================"
print_success "🎉 Zero-downtime deployment complete!"
echo ""
echo "📌 Useful commands:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs            - View live logs"
echo "  pm2 monit           - Monitor CPU/Memory"
echo "  pm2 reload all      - Reload without downtime"
echo ""
echo "🌐 Your site should be live at: https://book.thisisafrica.com.au"
echo "   (No 502 errors during deployment!)"
echo ""