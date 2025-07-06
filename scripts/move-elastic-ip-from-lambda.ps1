# Move Elastic IP from Lambda to EC2 Instance
# This script helps you reassign the whitelisted IP from Lambda to your EC2 instance

Write-Host "Move Elastic IP from Lambda to EC2" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

$WHITELISTED_IP = "13.210.224.119"
$CURRENT_EC2_IP = "52.62.181.111"

Write-Host "Whitelisted IP (currently with Lambda): $WHITELISTED_IP" -ForegroundColor Yellow
Write-Host "Current EC2 Instance IP: $CURRENT_EC2_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "IMPORTANT: Moving Elastic IP from Lambda to EC2" -ForegroundColor Red
Write-Host "This will affect your Lambda function's outbound IP!" -ForegroundColor Red
Write-Host ""

Write-Host "Steps to move the Elastic IP:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. FIRST - Disassociate from Lambda:" -ForegroundColor White
Write-Host "   a) Go to AWS Console -> VPC -> NAT Gateways" -ForegroundColor Gray
Write-Host "   b) Find the NAT Gateway using your Elastic IP" -ForegroundColor Gray
Write-Host "   c) Note down the NAT Gateway ID" -ForegroundColor Gray
Write-Host "   d) Go to EC2 -> Elastic IPs" -ForegroundColor Gray
Write-Host "   e) Find IP: $WHITELISTED_IP" -ForegroundColor Gray
Write-Host "   f) Click 'Actions' -> 'Disassociate Elastic IP address'" -ForegroundColor Gray
Write-Host ""

Write-Host "2. THEN - Associate with EC2:" -ForegroundColor White
Write-Host "   a) Still in EC2 -> Elastic IPs" -ForegroundColor Gray
Write-Host "   b) Select the now-unassociated IP: $WHITELISTED_IP" -ForegroundColor Gray
Write-Host "   c) Click 'Actions' -> 'Associate Elastic IP address'" -ForegroundColor Gray
Write-Host "   d) Resource type: 'Instance'" -ForegroundColor Gray
Write-Host "   e) Select your EC2 instance" -ForegroundColor Gray
Write-Host "   f) Click 'Associate'" -ForegroundColor Gray
Write-Host ""

Write-Host "3. FINALLY - Update Lambda (if needed):" -ForegroundColor White
Write-Host "   a) Your Lambda will lose the static IP" -ForegroundColor Gray
Write-Host "   b) If Lambda needs static IP, create a new Elastic IP" -ForegroundColor Gray
Write-Host "   c) Or use a different solution for Lambda outbound IP" -ForegroundColor Gray
Write-Host ""

Write-Host "Alternative AWS CLI commands (if AWS CLI is configured):" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Find what's using the Elastic IP" -ForegroundColor Gray
Write-Host "aws ec2 describe-addresses --public-ips $WHITELISTED_IP" -ForegroundColor Gray
Write-Host ""
Write-Host "# Disassociate from current resource" -ForegroundColor Gray
Write-Host "aws ec2 disassociate-address --public-ip $WHITELISTED_IP" -ForegroundColor Gray
Write-Host ""
Write-Host "# Associate with your EC2 instance (replace i-xxxxx with your instance ID)" -ForegroundColor Gray
Write-Host "aws ec2 associate-address --instance-id i-xxxxx --public-ip $WHITELISTED_IP" -ForegroundColor Gray
Write-Host ""

Write-Host "After moving the IP:" -ForegroundColor Green
Write-Host "- Your EC2 instance will have IP: $WHITELISTED_IP" -ForegroundColor White
Write-Host "- This IP is whitelisted with Tourplan" -ForegroundColor White
Write-Host "- Your booking engine will work from EC2" -ForegroundColor White
Write-Host "- Test with: .\scripts\quick-ssh-test.ps1" -ForegroundColor White
Write-Host ""

Write-Host "WARNING: Your Lambda function will lose its static outbound IP!" -ForegroundColor Red
Write-Host "Make sure this won't break any Lambda functionality." -ForegroundColor Yellow
Write-Host ""

Write-Host "Press any key to continue with the manual steps..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Manual Steps Summary:" -ForegroundColor Yellow
Write-Host "1. AWS Console -> EC2 -> Elastic IPs" -ForegroundColor White
Write-Host "2. Find $WHITELISTED_IP and disassociate it" -ForegroundColor White
Write-Host "3. Associate it with your EC2 instance" -ForegroundColor White
Write-Host "4. Run: .\scripts\quick-ssh-test.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Good luck!" -ForegroundColor Green
