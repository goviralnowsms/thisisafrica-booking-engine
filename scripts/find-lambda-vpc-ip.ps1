# Find Lambda VPC Configuration and Outbound IP
# This script helps locate where your Lambda gets its static IP from

Write-Host "=== FINDING LAMBDA VPC CONFIGURATION ===" -ForegroundColor Green
Write-Host ""

$LAMBDA_FUNCTION = "tourplan-api-proxy"
$EXPECTED_IP = "13.210.224.119"

Write-Host "Lambda Function: $LAMBDA_FUNCTION" -ForegroundColor Yellow
Write-Host "Expected Outbound IP: $EXPECTED_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: Check Lambda VPC Configuration" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You're currently looking at the Configuration > Triggers tab." -ForegroundColor White
Write-Host "The API Gateway endpoint is for INCOMING requests." -ForegroundColor White
Write-Host ""
Write-Host "To find the OUTBOUND IP configuration:" -ForegroundColor Yellow
Write-Host "1. Stay in the Configuration tab" -ForegroundColor Gray
Write-Host "2. Click on 'VPC' in the left sidebar" -ForegroundColor Gray
Write-Host "3. Look for VPC, Subnets, and Security groups" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: What to Look For in VPC Section" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If your Lambda has a static IP, you'll see:" -ForegroundColor White
Write-Host "- VPC: A specific VPC ID (not 'No VPC')" -ForegroundColor Gray
Write-Host "- Subnets: Private subnet IDs" -ForegroundColor Gray
Write-Host "- Security groups: One or more security group IDs" -ForegroundColor Gray
Write-Host ""
Write-Host "If you see 'No VPC':" -ForegroundColor Red
Write-Host "- Your Lambda doesn't have a static IP" -ForegroundColor White
Write-Host "- The IP 13.210.224.119 is NOT from this Lambda" -ForegroundColor White
Write-Host "- You need to find where that IP actually comes from" -ForegroundColor White
Write-Host ""

Write-Host "STEP 3: Find the NAT Gateway (if VPC configured)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If your Lambda IS in a VPC:" -ForegroundColor White
Write-Host "1. Note the VPC ID from Lambda configuration" -ForegroundColor Gray
Write-Host "2. Go to VPC Console: https://console.aws.amazon.com/vpc/" -ForegroundColor Gray
Write-Host "3. Click 'NAT Gateways' in left sidebar" -ForegroundColor Gray
Write-Host "4. Find NAT Gateway in your VPC" -ForegroundColor Gray
Write-Host "5. Check its Elastic IP - this should be 13.210.224.119" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Alternative - Check All NAT Gateways" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Direct approach to find the IP:" -ForegroundColor White
Write-Host "1. Go to VPC Console: https://console.aws.amazon.com/vpc/" -ForegroundColor Gray
Write-Host "2. Click 'NAT Gateways'" -ForegroundColor Gray
Write-Host "3. Look for NAT Gateway with IP: 13.210.224.119" -ForegroundColor Gray
Write-Host "4. Note which VPC it belongs to" -ForegroundColor Gray
Write-Host "5. Check if your Lambda uses that VPC" -ForegroundColor Gray
Write-Host ""

Write-Host "NEXT STEPS BASED ON WHAT YOU FIND:" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""
Write-Host "Scenario A: Lambda has VPC, NAT Gateway has the IP" -ForegroundColor Yellow
Write-Host "- The IP 13.210.224.119 is correctly configured" -ForegroundColor White
Write-Host "- You can move this IP to EC2 by:" -ForegroundColor White
Write-Host "  1. Disassociating IP from NAT Gateway" -ForegroundColor Gray
Write-Host "  2. Associating IP with EC2 instance" -ForegroundColor Gray
Write-Host "  3. Your Lambda will lose static IP access" -ForegroundColor Gray
Write-Host ""

Write-Host "Scenario B: Lambda has no VPC" -ForegroundColor Yellow
Write-Host "- Lambda doesn't use the static IP" -ForegroundColor White
Write-Host "- The IP 13.210.224.119 might be:" -ForegroundColor White
Write-Host "  1. From a different service" -ForegroundColor Gray
Write-Host "  2. Already deleted/released" -ForegroundColor Gray
Write-Host "  3. In a different region" -ForegroundColor Gray
Write-Host ""

Write-Host "Scenario C: Can't find IP anywhere" -ForegroundColor Yellow
Write-Host "- The IP was never actually allocated to your account" -ForegroundColor White
Write-Host "- You need to allocate a new Elastic IP" -ForegroundColor White
Write-Host "- Contact Tourplan to whitelist the new IP" -ForegroundColor White
Write-Host ""

Write-Host "=== IMMEDIATE ACTION REQUIRED ===" -ForegroundColor Red
Write-Host ""
Write-Host "1. Click 'VPC' in your Lambda configuration sidebar" -ForegroundColor White
Write-Host "2. Check if it shows VPC details or 'No VPC'" -ForegroundColor White
Write-Host "3. Report back what you see" -ForegroundColor White
Write-Host ""

Write-Host "After checking VPC, run one of these:" -ForegroundColor Cyan
Write-Host "- If VPC configured: .\scripts\find-nat-gateway-ip.ps1" -ForegroundColor White
Write-Host "- If no VPC: .\scripts\allocate-new-elastic-ip.ps1" -ForegroundColor White
