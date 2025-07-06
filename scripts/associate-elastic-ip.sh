#!/bin/bash

# Script to associate the whitelisted Elastic IP with your EC2 instance
# This ensures your instance uses the IP that's whitelisted with Tourplan

WHITELISTED_IP="13.210.224.119"
YOUR_LOCAL_IP="110.175.119.93"

echo "🔗 Elastic IP Association"
echo "========================="
echo "Target Whitelisted IP: $WHITELISTED_IP"
echo "Your Local IP: $YOUR_LOCAL_IP"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured"
    exit 1
fi

REGION=$(aws configure get region || echo "ap-southeast-2")
echo "Region: $REGION"
echo ""

# Find your instance
echo "🔍 Finding your EC2 instance..."
INSTANCES=$(aws ec2 describe-instances \
    --region $REGION \
    --filters "Name=instance-state-name,Values=running" \
    --query 'Reservations[].Instances[].[InstanceId,Tags[?Key==`Name`].Value|[0],PublicIpAddress]' \
    --output text)

if [ -z "$INSTANCES" ]; then
    echo "❌ No running instances found"
    exit 1
fi

echo "Available instances:"
echo "$INSTANCES" | while read line; do
    INST_ID=$(echo $line | cut -d' ' -f1)
    INST_NAME=$(echo $line | cut -d' ' -f2)
    INST_IP=$(echo $line | cut -d' ' -f3)
    echo "  $INST_ID | ${INST_NAME:-'(no name)'} | ${INST_IP:-'(no IP)'}"
done

echo ""
read -p "Enter Instance ID to associate with $WHITELISTED_IP: " INSTANCE_ID

if [ -z "$INSTANCE_ID" ]; then
    echo "❌ No instance ID provided"
    exit 1
fi

# Check if the Elastic IP exists and is available
echo ""
echo "🔍 Checking Elastic IP $WHITELISTED_IP..."

ELASTIC_IP_INFO=$(aws ec2 describe-addresses \
    --region $REGION \
    --public-ips $WHITELISTED_IP 2>/dev/null)

if [ $? -ne 0 ]; then
    echo "❌ Elastic IP $WHITELISTED_IP not found in region $REGION"
    echo ""
    echo "Possible solutions:"
    echo "1. Check if the IP is in a different region"
    echo "2. The IP might have been released"
    echo "3. Contact AWS support to recover the IP"
    echo "4. Request a new IP whitelist from Tourplan"
    exit 1
fi

# Check if it's already associated
ASSOCIATED_INSTANCE=$(echo "$ELASTIC_IP_INFO" | jq -r '.Addresses[0].InstanceId // empty')
ALLOCATION_ID=$(echo "$ELASTIC_IP_INFO" | jq -r '.Addresses[0].AllocationId')

echo "✅ Found Elastic IP $WHITELISTED_IP"
echo "   Allocation ID: $ALLOCATION_ID"

if [ -n "$ASSOCIATED_INSTANCE" ] && [ "$ASSOCIATED_INSTANCE" != "null" ]; then
    if [ "$ASSOCIATED_INSTANCE" = "$INSTANCE_ID" ]; then
        echo "✅ Elastic IP is already associated with your instance!"
        
        # Verify the association worked
        sleep 5
        CURRENT_IP=$(aws ec2 describe-instances \
            --region $REGION \
            --instance-ids $INSTANCE_ID \
            --query 'Reservations[0].Instances[0].PublicIpAddress' \
            --output text)
        
        echo "   Current instance IP: $CURRENT_IP"
        exit 0
    else
        echo "⚠️  Elastic IP is associated with different instance: $ASSOCIATED_INSTANCE"
        read -p "Do you want to disassociate it and move to your instance? (y/n): " MOVE_IP
        
        if [ "$MOVE_IP" != "y" ] && [ "$MOVE_IP" != "Y" ]; then
            echo "❌ Aborted by user"
            exit 1
        fi
        
        echo "🔄 Disassociating from current instance..."
        aws ec2 disassociate-address \
            --region $REGION \
            --allocation-id $ALLOCATION_ID
        
        echo "✅ Disassociated from previous instance"
        sleep 3
    fi
else
    echo "✅ Elastic IP is available for association"
fi

# Associate the Elastic IP with your instance
echo ""
echo "🔗 Associating Elastic IP with instance $INSTANCE_ID..."

if aws ec2 associate-address \
    --region $REGION \
    --instance-id $INSTANCE_ID \
    --allocation-id $ALLOCATION_ID; then
    
    echo "✅ Elastic IP association initiated"
    
    # Wait for association to complete
    echo "⏳ Waiting for association to complete..."
    sleep 10
    
    # Verify the association
    CURRENT_IP=$(aws ec2 describe-instances \
        --region $REGION \
        --instance-ids $INSTANCE_ID \
        --query 'Reservations[0].Instances[0].PublicIpAddress' \
        --output text)
    
    echo ""
    echo "🎉 Association Results:"
    echo "======================"
    echo "Instance ID: $INSTANCE_ID"
    echo "New Public IP: $CURRENT_IP"
    echo "Expected IP: $WHITELISTED_IP"
    
    if [ "$CURRENT_IP" = "$WHITELISTED_IP" ]; then
        echo "✅ SUCCESS! Instance now has the whitelisted IP"
        echo ""
        echo "⚠️  IMPORTANT: Your SSH connection will change!"
        echo "   Old connection might be lost"
        echo "   New SSH command: ssh -i your-key.pem ubuntu@$WHITELISTED_IP"
        echo ""
        echo "🔧 Next steps:"
        echo "1. Update your security group to allow SSH from $YOUR_LOCAL_IP"
        echo "2. Test SSH connection to the new IP"
        echo "3. Test Tourplan API connection"
    else
        echo "❌ Association may have failed or is still in progress"
        echo "   Check AWS Console for status"
    fi
    
else
    echo "❌ Failed to associate Elastic IP"
    echo "   Check AWS Console for details"
    exit 1
fi
