#!/bin/bash

# EC2 Setup Script for Tourplan Booking Engine
# Run this on your EC2 instance after connecting via SSH

echo "🚀 Setting up Tourplan Booking Engine on EC2..."

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Node.js 18 (required for Next.js)
echo "📦 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
echo "📦 Installing Git..."
sudo yum install -y git

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Nginx for reverse proxy
echo "📦 Installing Nginx..."
sudo yum install -y nginx

# Verify installations
echo "✅ Verifying installations..."
node --version
npm --version
git --version
pm2 --version

echo "🎉 Basic setup complete!"
echo ""
echo "Next steps:"
echo "1. Clone your repository"
echo "2. Install dependencies"
echo "3. Configure environment variables"
echo "4. Build and start the application"
