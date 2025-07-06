#!/bin/bash

# Check current IP address
echo "🔍 Checking current IP address..."

# Check external IP
EXTERNAL_IP=$(curl -s https://ipinfo.io/ip)
echo "External IP: $EXTERNAL_IP"

# Check if it matches expected IP
EXPECTED_IP="13.210.224.119"
if [ "$EXTERNAL_IP" = "$EXPECTED_IP" ]; then
    echo "✅ IP matches expected: $EXPECTED_IP"
else
    echo "⚠️  IP mismatch! Expected: $EXPECTED_IP, Got: $EXTERNAL_IP"
fi

# Check local network interface
echo ""
echo "Local network interfaces:"
ip addr show
