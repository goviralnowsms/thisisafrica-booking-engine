#!/bin/bash

# Script to configure EC2 security group for both SSH access and Tourplan API
# This script adds your local IP for SSH while maintaining the whitelisted IP for API calls

set -e

# Configuration
YOUR_LOCAL_IP="110.175.119.93"
WHITELISTED_IP="13.210.224.119"
INSTANCE_NAME="tourplan-booking-engine"

echo "🔧 EC2 Security Group Configuration"
echo "==================================="
echo "Your Local IP (for SSH): $YOUR_LOCAL_IP"
echo "Whitelisted IP (for API): $WHITELISTED_IP"
echo ""

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip'"
    echo "   unzip awscliv2.zip"
    echo "   sudo ./aws/install"
    exit 1
fi

# Check AWS CLI configuration
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run:"
    echo "   aws configure"
    exit 1
fi

echo "✅ AWS CLI configured"

# Get current region
REGION=$(aws configure get region)
if [ -z "$REGION" ]; then
    REGION="ap-southeast-2"  # Default to Sydney region
    echo "⚠️  No region configured, using default: $REGION"
fi

echo "Region: $REGION"
echo ""

# Function to find instance by name or get user input
find_instance() {
    echo "🔍 Looking for EC2 instances..."
    
    # Try to find instance by name tag
    INSTANCE_ID=$(aws ec2 describe-instances \
        --region $REGION \
        --filters "Name=tag:Name,Values=$INSTANCE_NAME" "Name=instance-state-name,Values=running" \
        --query 'Reservations[0].Instances[0].InstanceId' \
        --output text 2>/dev/null)
    
    if [ "$INSTANCE_ID" != "None" ] && [ "$INSTANCE_ID" != "null" ] && [ -n "$INSTANCE_ID" ]; then
        echo "✅ Found instance by name: $INSTANCE_ID"
        return 0
    fi
    
    # List all running instances for user to choose
    echo "Available running instances:"
    aws ec2 describe-instances \
        --region $REGION \
        --filters "Name=instance-state-name,Values=running" \
        --query 'Reservations[].Instances[].[InstanceId,Tags[?Key==`Name`].Value|[0],PublicIpAddress,InstanceType]' \
        --output table
    
    echo ""
    read -p "Enter the Instance ID you want to configure: " INSTANCE_ID
    
    if [ -z "$INSTANCE_ID" ]; then
        echo "❌ No instance ID provided"
        exit 1
    fi
}

# Function to get security group for instance
get_security_group() {
    echo "🔍 Getting security group for instance $INSTANCE_ID..."
    
    SECURITY_GROUP_ID=$(aws ec2 describe-instances \
        --region $REGION \
        --instance-ids $INSTANCE_ID \
        --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' \
        --output text)
    
    if [ -z "$SECURITY_GROUP_ID" ] || [ "$SECURITY_GROUP_ID" = "None" ]; then
        echo "❌ Could not find security group for instance"
        exit 1
    fi
    
    echo "✅ Security Group ID: $SECURITY_GROUP_ID"
}

# Function to add SSH rule for your local IP
add_ssh_rule() {
    echo "🔐 Adding SSH access for your local IP ($YOUR_LOCAL_IP)..."
    
    # Check if rule already exists
    EXISTING_RULE=$(aws ec2 describe-security-groups \
        --region $REGION \
        --group-ids $SECURITY_GROUP_ID \
        --query "SecurityGroups[0].IpPermissions[?FromPort==\`22\` && ToPort==\`22\` && IpRanges[?CidrIp==\`$YOUR_LOCAL_IP/32\`]]" \
        --output text)
    
    if [ -n "$EXISTING_RULE" ] && [ "$EXISTING_RULE" != "None" ]; then
        echo "✅ SSH rule for your IP already exists"
        return 0
    fi
    
    # Add SSH rule
    if aws ec2 authorize-security-group-ingress \
        --region $REGION \
        --group-id $SECURITY_GROUP_ID \
        --protocol tcp \
        --port 22 \
        --cidr $YOUR_LOCAL_IP/32 \
        --tag-specifications "ResourceType=security-group-rule,Tags=[{Key=Name,Value=SSH-Access-Local-IP},{Key=Purpose,Value=SSH-from-local}]" 2>/dev/null; then
        echo "✅ SSH rule added successfully"
    else
        echo "⚠️  SSH rule might already exist or failed to add"
    fi
}

# Function to add HTTP/HTTPS rules
add_web_rules() {
    echo "🌐 Adding HTTP/HTTPS access rules..."
    
    # Add HTTP rule (port 80)
    if ! aws ec2 describe-security-groups \
        --region $REGION \
        --group-ids $SECURITY_GROUP_ID \
        --query "SecurityGroups[0].IpPermissions[?FromPort==\`80\` && ToPort==\`80\` && IpRanges[?CidrIp==\`0.0.0.0/0\`]]" \
        --output text | grep -q "80"; then
        
        aws ec2 authorize-security-group-ingress \
            --region $REGION \
            --group-id $SECURITY_GROUP_ID \
            --protocol tcp \
            --port 80 \
            --cidr 0.0.0.0/0 \
            --tag-specifications "ResourceType=security-group-rule,Tags=[{Key=Name,Value=HTTP-Access},{Key=Purpose,Value=Web-traffic}]" 2>/dev/null || true
        echo "✅ HTTP rule added"
    else
        echo "✅ HTTP rule already exists"
    fi
    
    # Add HTTPS rule (port 443)
    if ! aws ec2 describe-security-groups \
        --region $REGION \
        --group-ids $SECURITY_GROUP_ID \
        --query "SecurityGroups[0].IpPermissions[?FromPort==\`443\` && ToPort==\`443\` && IpRanges[?CidrIp==\`0.0.0.0/0\`]]" \
        --output text | grep -q "443"; then
        
        aws ec2 authorize-security-group-ingress \
            --region $REGION \
            --group-id $SECURITY_GROUP_ID \
            --protocol tcp \
            --port 443 \
            --cidr 0.0.0.0/0 \
            --tag-specifications "ResourceType=security-group-rule,Tags=[{Key=Name,Value=HTTPS-Access},{Key=Purpose,Value=Web-traffic}]" 2>/dev/null || true
        echo "✅ HTTPS rule added"
    else
        echo "✅ HTTPS rule already exists"
    fi
    
    # Add custom port for Next.js development (port 3000)
    if ! aws ec2 describe-security-groups \
        --region $REGION \
        --group-ids $SECURITY_GROUP_ID \
        --query "SecurityGroups[0].IpPermissions[?FromPort==\`3000\` && ToPort==\`3000\` && IpRanges[?CidrIp==\`$YOUR_LOCAL_IP/32\`]]" \
        --output text | grep -q "3000"; then
        
        aws ec2 authorize-security-group-ingress \
            --region $REGION \
            --group-id $SECURITY_GROUP_ID \
            --protocol tcp \
            --port 3000 \
            --cidr $YOUR_LOCAL_IP/32 \
            --tag-specifications "ResourceType=security-group-rule,Tags=[{Key=Name,Value=NextJS-Dev},{Key=Purpose,Value=Development-access}]" 2>/dev/null || true
        echo "✅ Next.js development port (3000) rule added"
    else
        echo "✅ Next.js development port rule already exists"
    fi
}

# Function to display current security group rules
show_security_rules() {
    echo ""
    echo "📋 Current Security Group Rules:"
    echo "================================"
    
    aws ec2 describe-security-groups \
        --region $REGION \
        --group-ids $SECURITY_GROUP_ID \
        --query 'SecurityGroups[0].IpPermissions[].[IpProtocol,FromPort,ToPort,IpRanges[0].CidrIp,IpRanges[0].Description]' \
        --output table
}

# Function to get instance connection info
show_connection_info() {
    echo ""
    echo "🔗 Connection Information:"
    echo "========================="
    
    INSTANCE_INFO=$(aws ec2 describe-instances \
        --region $REGION \
        --instance-ids $INSTANCE_ID \
        --query 'Reservations[0].Instances[0].[PublicIpAddress,PublicDnsName,KeyName]' \
        --output text)
    
    PUBLIC_IP=$(echo $INSTANCE_INFO | cut -d' ' -f1)
    PUBLIC_DNS=$(echo $INSTANCE_INFO | cut -d' ' -f2)
    KEY_NAME=$(echo $INSTANCE_INFO | cut -d' ' -f3)
    
    echo "Instance ID: $INSTANCE_ID"
    echo "Public IP: $PUBLIC_IP"
    echo "Public DNS: $PUBLIC_DNS"
    echo "Key Pair: $KEY_NAME"
    echo ""
    echo "SSH Command:"
    echo "ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$PUBLIC_IP"
    echo ""
    echo "Or using DNS:"
    echo "ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$PUBLIC_DNS"
    echo ""
    
    if [ "$PUBLIC_IP" = "$WHITELISTED_IP" ]; then
        echo "✅ Instance has the whitelisted IP for Tourplan API!"
    else
        echo "⚠️  Instance IP ($PUBLIC_IP) differs from whitelisted IP ($WHITELISTED_IP)"
        echo "   You may need to associate the Elastic IP $WHITELISTED_IP"
    fi
}

# Main execution
echo "Starting security group configuration..."

find_instance
get_security_group
add_ssh_rule
add_web_rules
show_security_rules
show_connection_info

echo ""
echo "🎉 Security group configuration complete!"
echo ""
echo "Next steps:"
echo "1. Test SSH connection: ssh -i ~/.ssh/your-key.pem ubuntu@$PUBLIC_IP"
echo "2. If needed, associate Elastic IP $WHITELISTED_IP with the instance"
echo "3. Deploy your Tourplan booking engine application"
echo ""
echo "Troubleshooting:"
echo "- If SSH fails, check that your key file has correct permissions: chmod 400 ~/.ssh/your-key.pem"
echo "- If you can't find your key file, check AWS Console → EC2 → Key Pairs"
echo "- Your current local IP is: $YOUR_LOCAL_IP"
