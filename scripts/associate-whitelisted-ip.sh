#!/bin/bash

# Script to associate the whitelisted IP (13.210.224.119) with current EC2 instance
# Run this script on your new EC2 instance

WHITELISTED_IP="13.210.224.119"
YOUR_LOCAL_IP="110.175.119.93"

echo "🔍 EC2 IP Association Helper"
echo "============================"
echo "Target IP: $WHITELISTED_IP"
echo "Your Local IP: $YOUR_LOCAL_IP"
echo ""

# Get current instance information
echo "📋 Getting current instance information..."
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
CURRENT_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)
AZ=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)

echo "Instance ID: $INSTANCE_ID"
echo "Current Public IP: $CURRENT_PUBLIC_IP"
echo "Region: $REGION"
echo "Availability Zone: $AZ"
echo ""

# Check if we already have the right IP
if [ "$CURRENT_PUBLIC_IP" = "$WHITELISTED_IP" ]; then
    echo "✅ SUCCESS: Instance already has the whitelisted IP!"
    echo "🎉 You can proceed with Tourplan API testing."
    exit 0
fi

echo "❌ Current IP ($CURRENT_PUBLIC_IP) does not match whitelisted IP ($WHITELISTED_IP)"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI not installed. Installing..."
    
    # Install AWS CLI v2
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    
    echo "✅ AWS CLI installed. You need to configure it:"
    echo "   Run: aws configure"
    echo "   Enter your AWS Access Key ID and Secret Access Key"
    echo ""
fi

# Check AWS CLI configuration
echo "🔧 Checking AWS CLI configuration..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured or no permissions."
    echo ""
    echo "To configure AWS CLI:"
    echo "1. Run: aws configure"
    echo "2. Enter your AWS credentials"
    echo "3. Set region to: $REGION"
    echo ""
    echo "Or use IAM role if this instance has one attached."
    exit 1
fi

echo "✅ AWS CLI configured"
echo ""

# Check for available Elastic IPs
echo "🔍 Checking for Elastic IP $WHITELISTED_IP..."
ELASTIC_IP_INFO=$(aws ec2 describe-addresses --public-ips $WHITELISTED_IP --region $REGION 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ Found Elastic IP $WHITELISTED_IP"
    
    # Check if it's associated with another instance
    ASSOCIATED_INSTANCE=$(echo $ELASTIC_IP_INFO | jq -r '.Addresses[0].InstanceId // empty')
    
    if [ -z "$ASSOCIATED_INSTANCE" ] || [ "$ASSOCIATED_INSTANCE" = "null" ]; then
        echo "🎯 Elastic IP is available for association!"
        
        # Get allocation ID
        ALLOCATION_ID=$(echo $ELASTIC_IP_INFO | jq -r '.Addresses[0].AllocationId')
        
        echo "Attempting to associate Elastic IP..."
        if aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOCATION_ID --region $REGION; then
            echo "✅ SUCCESS: Elastic IP associated!"
            echo ""
            echo "Waiting for association to complete..."
            sleep 10
            
            # Verify new IP
            NEW_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
            echo "New Public IP: $NEW_IP"
            
            if [ "$NEW_IP" = "$WHITELISTED_IP" ]; then
                echo "🎉 SUCCESS: Instance now has the whitelisted IP!"
                echo "✅ You can now use the Tourplan API."
            else
                echo "⚠️  IP association may still be in progress. Check AWS console."
            fi
        else
            echo "❌ Failed to associate Elastic IP. Check permissions and try manually."
        fi
    else
        echo "⚠️  Elastic IP is associated with instance: $ASSOCIATED_INSTANCE"
        echo "You may need to disassociate it first or use AWS console."
    fi
else
    echo "❌ Elastic IP $WHITELISTED_IP not found or not accessible."
    echo ""
    echo "Possible solutions:"
    echo "1. The IP was released back to AWS"
    echo "2. It's in a different region"
    echo "3. You don't have permissions to view it"
    echo ""
    echo "Next steps:"
    echo "1. Check AWS Console → EC2 → Elastic IPs"
    echo "2. Contact AWS Support if needed"
    echo "3. Request new IP whitelist from Tourplan"
fi

echo ""
echo "📞 Need help? Check the EC2_IP_ASSOCIATION_GUIDE.md"
