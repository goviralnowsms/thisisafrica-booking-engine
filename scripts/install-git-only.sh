#!/bin/bash

# Install Git only (skip curl conflicts)
set -e

echo "🔧 Installing Git for deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# Install Git only
print_status "Installing Git..."
sudo dnf install -y git

# Verify Git installation
if command -v git &> /dev/null; then
    print_status "✅ Git installed successfully: $(git --version)"
else
    print_error "❌ Git installation failed"
    exit 1
fi

# Verify existing installations
print_status "Checking existing installations..."
if command -v node &> /dev/null; then
    print_status "✅ Node.js already installed: $(node --version)"
else
    print_warning "⚠️ Node.js not found"
fi

if command -v npm &> /dev/null; then
    print_status "✅ npm already installed: $(npm --version)"
else
    print_warning "⚠️ npm not found"
fi

if command -v pm2 &> /dev/null; then
    print_status "✅ PM2 already installed: $(pm2 --version)"
else
    print_warning "⚠️ PM2 not found"
fi

echo ""
print_status "🎉 Ready to clone repository!"
echo "Next step: git clone https://github.com/goviralnowsms/booking-engine.git"
