# Find NAT Gateway with specific IP address
# This script helps locate NAT Gateways and their associated Elastic IPs

Write-Host "=== FINDING NAT GATEWAY WITH IP 13.210.224.119 ===" -ForegroundColor Green
Write-Host ""

$TARGET_IP = "13.210.224.119"

Write-Host "Searching for NAT Gateway with IP: $TARGET_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "MANUAL STEPS (AWS Console):" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to VPC Console:" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/vpc/home?region=ap-southeast-2" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Click 'NAT Gateways' in the left sidebar" -ForegroundColor White
Write-Host ""
Write-Host "3. Look at the 'Elastic IP address' column" -ForegroundColor White
Write-Host "   - Find the row with IP: $TARGET_IP" -ForegroundColor Gray
Write-Host "   - Note the NAT Gateway ID" -ForegroundColor Gray
Write-Host "   - Note the VPC ID" -ForegroundColor Gray
Write-Host "   - Note the Subnet" -ForegroundColor Gray
Write-Host ""

Write-Host "4. If you find the NAT Gateway:" -ForegroundColor White
Write-Host "   - This confirms the IP exists and is in use" -ForegroundColor Green
Write-Host "   - Your Lambda function uses this for outbound connections" -ForegroundColor Green
Write-Host "   - You can move this IP to EC2" -ForegroundColor Green
Write-Host ""

Write-Host "5. If you DON'T find the NAT Gateway:" -ForegroundColor White
Write-Host "   - The IP might be in a different region" -ForegroundColor Yellow
Write-Host "   - The IP might have been released" -ForegroundColor Yellow
Write-Host "   - You need to allocate a new Elastic IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "WHAT TO DO NEXT:" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host ""
Write-Host "If NAT Gateway found with the IP:" -ForegroundColor Cyan
Write-Host "1. Go to EC2 > Elastic IPs" -ForegroundColor White
Write-Host "2. Find IP $TARGET_IP" -ForegroundColor White
Write-Host "3. Disassociate from NAT Gateway" -ForegroundColor White
Write-Host "4. Associate with your EC2 instance" -ForegroundColor White
Write-Host "5. Run: .\scripts\associate-whitelisted-ip.ps1" -ForegroundColor White
Write-Host ""

Write-Host "If NAT Gateway NOT found:" -ForegroundColor Cyan
Write-Host "1. Check other regions" -ForegroundColor White
Write-Host "2. Or allocate new Elastic IP" -ForegroundColor White
Write-Host "3. Run: .\scripts\allocate-new-elastic-ip.ps1" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "==========" -ForegroundColor Red
Write-Host "Moving the IP from NAT Gateway to EC2 will:" -ForegroundColor White
Write-Host "- Break your Lambda's static IP access" -ForegroundColor Yellow
Write-Host "- Give your EC2 instance the whitelisted IP" -ForegroundColor Green
Write-Host "- Allow you to run Tourplan API from EC2" -ForegroundColor Green
Write-Host ""

Write-Host "Ready to check? Go to VPC Console now!" -ForegroundColor Green
Write-Host "https://console.aws.amazon.com/vpc/home?region=ap-southeast-2#NatGateways:" -ForegroundColor Cyan
