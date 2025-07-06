#!/bin/bash

# Script to help connect to your EC2 instance
# Automatically finds your instance and provides connection commands

YOUR_LOCAL_IP="110.175.119.93"
WHITELISTED_IP="13.210.224.119"

echo "🔗 EC2 Connection Helper"
echo "======================="
echo "Your Local IP: $YOUR_LOCAL_IP"
echo "Target Whitelisted IP: $WHITELISTED_IP"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run: aws configure"
    exit 1
fi

REGION=$(aws configure get region || echo "ap-southeast-2")
echo "Region: $REGION"
echo ""

# List running instances
echo "🔍 Finding your EC2 instances..."
INSTANCES=$(aws ec2 describe-instances \
    --region $REGION \
    --filters "Name=instance-state-name,Values=running" \
    --query 'Reservations[].Instances[].[InstanceId,Tags[?Key==`Name`].Value|[0],PublicIpAddress,KeyName,InstanceType]' \
    --output text)

if [ -z "$INSTANCES" ]; then
    echo "❌ No running instances found in region $REGION"
    exit 1
fi

echo "Available instances:"
echo "Instance ID | Name | Public IP | Key Name | Type"
echo "------------|------|-----------|----------|-----"
echo "$INSTANCES" | while read line; do
    echo "$line" | awk '{printf "%-12s | %-10s | %-13s | %-10s | %s\n", $1, ($2=="None"?"(no name)":$2), ($3=="None"?"(no IP)":$3), ($4=="None"?"(no key)":$4), $5}'
done

echo ""
read -p "Enter the Instance ID you want to connect to: " INSTANCE_ID

if [ -z "$INSTANCE_ID" ]; then
    echo "❌ No instance ID provided"
    exit 1
fi

# Get instance details
INSTANCE_DETAILS=$(aws ec2 describe-instances \
    --region $REGION \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].[PublicIpAddress,KeyName,State.Name]' \
    --output text)

PUBLIC_IP=$(echo $INSTANCE_DETAILS | cut -d' ' -f1)
KEY_NAME=$(echo $INSTANCE_DETAILS | cut -d' ' -f2)
STATE=$(echo $INSTANCE_DETAILS | cut -d' ' -f3)

if [ "$STATE" != "running" ]; then
    echo "❌ Instance is not running (current state: $STATE)"
    exit 1
fi

if [ "$PUBLIC_IP" = "None" ] || [ -z "$PUBLIC_IP" ]; then
    echo "❌ Instance has no public IP address"
    exit 1
fi

if [ "$KEY_NAME" = "None" ] || [ -z "$KEY_NAME" ]; then
    echo "❌ Instance has no key pair associated"
    exit 1
fi

echo "✅ Instance Details:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"
echo "   Key Name: $KEY_NAME"
echo "   State: $STATE"
echo ""

# Check if this is the whitelisted IP
if [ "$PUBLIC_IP" = "$WHITELISTED_IP" ]; then
    echo "✅ This instance has the whitelisted IP for Tourplan API!"
else
    echo "⚠️  This instance IP ($PUBLIC_IP) is different from whitelisted IP ($WHITELISTED_IP)"
fi

echo ""

# Find key file
KEY_PATHS=(
    "$HOME/.ssh/$KEY_NAME.pem"
    "$HOME/Downloads/$KEY_NAME.pem"
    "$HOME/Desktop/$KEY_NAME.pem"
    "./$KEY_NAME.pem"
)

KEY_FILE=""
for path in "${KEY_PATHS[@]}"; do
    if [ -f "$path" ]; then
        KEY_FILE="$path"
        break
    fi
done

if [ -z "$KEY_FILE" ]; then
    echo "❌ Key file not found. Searched in:"
    for path in "${KEY_PATHS[@]}"; do
        echo "   $path"
    done
    echo ""
    echo "Please download your key file from AWS Console → EC2 → Key Pairs"
    echo "Or specify the path manually:"
    read -p "Enter full path to your .pem file: " KEY_FILE
    
    if [ ! -f "$KEY_FILE" ]; then
        echo "❌ Key file not found: $KEY_FILE"
        exit 1
    fi
fi

echo "✅ Found key file: $KEY_FILE"

# Check key file permissions
KEY_PERMS=$(stat -c "%a" "$KEY_FILE" 2>/dev/null || stat -f "%A" "$KEY_FILE" 2>/dev/null)
if [ "$KEY_PERMS" != "400" ] && [ "$KEY_PERMS" != "600" ]; then
    echo "🔧 Fixing key file permissions..."
    chmod 400 "$KEY_FILE"
    echo "✅ Key file permissions set to 400"
fi

echo ""
echo "🚀 Connection Commands:"
echo "======================"
echo ""
echo "SSH Connection:"
echo "ssh -i \"$KEY_FILE\" ubuntu@$PUBLIC_IP"
echo ""
echo "SCP (copy files to instance):"
echo "scp -i \"$KEY_FILE\" /local/file ubuntu@$PUBLIC_IP:/remote/path"
echo ""
echo "SCP (copy files from instance):"
echo "scp -i \"$KEY_FILE\" ubuntu@$PUBLIC_IP:/remote/file /local/path"
echo ""

# Offer to connect now
read -p "Would you like to connect now? (y/n): " CONNECT_NOW

if [ "$CONNECT_NOW" = "y" ] || [ "$CONNECT_NOW" = "Y" ]; then
    echo "🔗 Connecting to $PUBLIC_IP..."
    ssh -i "$KEY_FILE" ubuntu@$PUBLIC_IP
else
    echo "👍 Connection details saved. Use the SSH command above when ready."
fi
