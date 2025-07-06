#!/bin/bash

# Complete EC2 Setup Script for Amazon Linux 2023
set -e

echo "🚀 Installing all dependencies for Tourplan Booking Engine..."

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

# Update system packages
print_header "UPDATING SYSTEM"
print_status "Updating system packages..."
sudo dnf update -y

# Install Git
print_header "INSTALLING GIT"
print_status "Installing Git..."
sudo dnf install -y git

# Verify Git installation
if command -v git &> /dev/null; then
    print_status "✅ Git installed successfully: $(git --version)"
else
    print_error "❌ Git installation failed"
    exit 1
fi

# Install Node.js 18
print_header "INSTALLING NODE.JS"
print_status "Adding NodeSource repository..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -

print_status "Installing Node.js 18..."
sudo dnf install -y nodejs

# Verify Node.js installation
if command -v node &> /dev/null; then
    print_status "✅ Node.js installed successfully: $(node --version)"
    print_status "✅ npm installed successfully: $(npm --version)"
else
    print_error "❌ Node.js installation failed"
    exit 1
fi

# Install PM2 globally
print_header "INSTALLING PM2"
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Verify PM2 installation
if command -v pm2 &> /dev/null; then
    print_status "✅ PM2 installed successfully: $(pm2 --version)"
else
    print_error "❌ PM2 installation failed"
    exit 1
fi

# Install additional useful tools
print_header "INSTALLING ADDITIONAL TOOLS"
print_status "Installing nano, curl, wget, and other utilities..."
sudo dnf install -y nano curl wget unzip

print_header "INSTALLATION COMPLETE"
print_status "✅ All dependencies installed successfully!"
echo ""
echo -e "${GREEN}Installed packages:${NC}"
echo "- Git: $(git --version)"
echo "- Node.js: $(node --version)"
echo "- npm: $(npm --version)"
echo "- PM2: $(pm2 --version)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Clone your repository: git clone https://github.com/goviralnowsms/booking-engine.git"
echo "2. Navigate to project: cd booking-engine"
echo "3. Install dependencies: npm install"
echo "4. Configure environment: nano .env.local"
echo "5. Build and deploy: npm run build && pm2 start npm --name booking-engine -- start"
