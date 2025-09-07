#!/bin/bash

# Install nginx if not already installed
echo "Installing nginx..."
apt update
apt install -y nginx

# Create nginx configuration for the booking site
echo "Creating nginx configuration..."
cat > /etc/nginx/sites-available/book.thisisafrica.com.au << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name book.thisisafrica.com.au 139.180.164.190;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static file caching (optional - if you have a public directory)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Increase max body size for file uploads
    client_max_body_size 10M;
}
EOF

# Enable the site
echo "Enabling the site..."
ln -sf /etc/nginx/sites-available/book.thisisafrica.com.au /etc/nginx/sites-enabled/

# Remove default nginx site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Restart nginx
echo "Restarting nginx..."
systemctl restart nginx
systemctl enable nginx

# Update firewall to allow HTTP and HTTPS
echo "Updating firewall rules..."
ufw allow 'Nginx Full'
ufw allow 80/tcp
ufw allow 443/tcp

echo "✅ Nginx setup complete!"
echo "Your site should now be accessible at:"
echo "  - http://book.thisisafrica.com.au"
echo "  - http://139.180.164.190"
echo ""
echo "Next steps:"
echo "1. Test the site without :3000 port"
echo "2. Consider adding SSL certificate with certbot for HTTPS"