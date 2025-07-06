#!/bin/bash

# Install Dependencies Script for EC2 Amazon Linux 2023
set -e

echo "🚀 Installing dependencies on EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Update system packages
print_status "Updating system packages..."
sudo dnf update -y

# Install Git
print_status "Installing Git..."
sudo dnf install -y git

# Verify Git installation
if command -v git &> /dev/null; then
    print_status "Git installed successfully: $(git --version)"
else
    print_error "Git installation failed"
    exit 1
fi

# Install Node.js 18
print_status "Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Verify Node.js installation
if command -v node &> /dev/null; then
    print_status "Node.js installed successfully: $(node --version)"
    print_status "npm version: $(npm --version)"
else
    print_error "Node.js installation failed"
    exit 1
fi

# Install PM2 globally
print_status "Installing PM2 process manager..."
sudo npm install -g pm2

# Verify PM2 installation
if command -v pm2 &> /dev/null; then
    print_status "PM2 installed successfully: $(pm2 --version)"
else
    print_error "PM2 installation failed"
    exit 1
fi

print_status "✅ All dependencies installed successfully!"
echo ""
echo "Installed packages:"
echo "- Git: $(git --version)"
echo "- Node.js: $(node --version)"
echo "- npm: $(npm --version)"
echo "- PM2: $(pm2 --version)"
