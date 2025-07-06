#!/bin/bash

# Setup Nginx reverse proxy
echo "🔧 Setting up Nginx..."

# Copy nginx configuration
sudo cp scripts/nginx.conf /etc/nginx/conf.d/tourplan.conf

# Test nginx configuration
sudo nginx -t

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

echo "✅ Nginx setup complete!"
echo "🌐 Your app should now be accessible at http://13.210.224.119"
