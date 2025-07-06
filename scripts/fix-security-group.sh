#!/bin/bash

# Script to help diagnose and fix EC2 connection issues
echo "🔍 EC2 Connection Troubleshooting Guide"
echo "========================================"
echo ""

echo "1. Check Security Group Settings:"
echo "   - Go to AWS Console → EC2 → Security Groups"
echo "   - Find your instance's security group"
echo "   - Ensure these inbound rules exist:"
echo "     * SSH (22) from 0.0.0.0/0 (or your IP)"
echo "     * HTTP (80) from 0.0.0.0/0"
echo "     * Custom TCP (3000) from 0.0.0.0/0"
echo ""

echo "2. Check Instance State:"
echo "   - Instance should be 'running'"
echo "   - Status checks should be 2/2 passed"
echo ""

echo "3. Alternative Connection Methods:"
echo "   - Try SSH from PowerShell"
echo "   - Use Session Manager (if IAM role configured)"
echo "   - Try different browser for Instance Connect"
echo ""

echo "4. If using SSH key, run this in PowerShell:"
echo "   ssh -i path/to/your-key.pem ec2-user@13.210.224.119"
echo ""

echo "5. If no SSH key, create new one:"
echo "   - AWS Console → EC2 → Key Pairs → Create"
echo "   - Stop instance → Change key pair → Start instance"
