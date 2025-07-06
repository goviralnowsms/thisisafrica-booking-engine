# Solution for Lambda with No VPC Configuration
# This script explains what to do when your Lambda doesn't have a static IP

Write-Host "=== LAMBDA NO VPC CONFIGURATION DETECTED ===" -ForegroundColor Red
Write-Host ""

Write-Host "SITUATION ANALYSIS:" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Your Lambda function: tourplan-api-proxy" -ForegroundColor White
Write-Host "✓ VPC Configuration: No VPC" -ForegroundColor Red
Write-Host "✓ Static IP: None (Lambda gets random IPs)" -ForegroundColor Red
Write-Host "✓ Whitelisted IP 13.210.224.119: NOT from this Lambda" -ForegroundColor Red
Write-Host ""

Write-Host "WHAT THIS MEANS:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Your Lambda function does NOT have a static IP address" -ForegroundColor White
Write-Host "2. Each Lambda execution gets a random IP from AWS's pool" -ForegroundColor White
Write-Host "3. The IP 13.210.224.119 that Tourplan whitelisted is NOT from your Lambda" -ForegroundColor White
Write-Host "4. Your Lambda cannot reliably access Tourplan API" -ForegroundColor White
Write-Host ""

Write-Host "WHERE IS IP 13.210.224.119?" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow
Write-Host ""
Write-Host "The whitelisted IP might be:" -ForegroundColor White
Write-Host "• From a different AWS service in your account" -ForegroundColor Gray
Write-Host "• From a different AWS region" -ForegroundColor Gray
Write-Host "• From a different AWS account" -ForegroundColor Gray
Write-Host "• Never actually allocated to your account" -ForegroundColor Gray
Write-Host "• Already released/deleted" -ForegroundColor Gray
Write-Host ""

Write-Host "SOLUTION OPTIONS:" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
Write-Host ""
Write-Host "OPTION 1: Move to EC2 (Recommended)" -ForegroundColor Cyan
Write-Host "------------------------------------" -ForegroundColor Cyan
Write-Host "• Allocate new Elastic IP for EC2 instance" -ForegroundColor White
Write-Host "• Deploy your booking engine on EC2" -ForegroundColor White
Write-Host "• Get new IP whitelisted by Tourplan" -ForegroundColor White
Write-Host "• More control and predictable networking" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2: Configure Lambda VPC (Complex)" -ForegroundColor Cyan
Write-Host "-----------------------------------------" -ForegroundColor Cyan
Write-Host "• Create VPC with private subnets" -ForegroundColor White
Write-Host "• Create NAT Gateway with Elastic IP" -ForegroundColor White
Write-Host "• Configure Lambda to use the VPC" -ForegroundColor White
Write-Host "• More expensive and complex setup" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 3: Find Existing IP (If it exists)" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Cyan
Write-Host "• Search all AWS regions for IP 13.210.224.119" -ForegroundColor White
Write-Host "• Check NAT Gateways, EC2 instances, Load Balancers" -ForegroundColor White
Write-Host "• Move the IP to your EC2 instance" -ForegroundColor White
Write-Host ""

Write-Host "RECOMMENDED IMMEDIATE ACTIONS:" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Search for the existing IP:" -ForegroundColor Yellow
Write-Host "   .\scripts\find-nat-gateway-ip.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. If IP not found, allocate new one:" -ForegroundColor Yellow
Write-Host "   .\scripts\allocate-new-elastic-ip.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Set up EC2 instance with the IP:" -ForegroundColor Yellow
Write-Host "   .\scripts\setup-ec2-with-elastic-ip.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Contact Tourplan with new IP:" -ForegroundColor Yellow
Write-Host "   .\scripts\generate-tourplan-email.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "WHY EC2 IS BETTER THAN LAMBDA FOR THIS:" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Static IP address (required for Tourplan)" -ForegroundColor White
Write-Host "✓ Always-on service (better for booking engine)" -ForegroundColor White
Write-Host "✓ More control over networking" -ForegroundColor White
Write-Host "✓ Easier to debug and monitor" -ForegroundColor White
Write-Host "✓ Can run full Next.js application" -ForegroundColor White
Write-Host "✓ Better for database connections" -ForegroundColor White
Write-Host ""

Write-Host "COST COMPARISON:" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Yellow
Write-Host ""
Write-Host "Lambda with VPC:" -ForegroundColor White
Write-Host "• Lambda execution costs" -ForegroundColor Gray
Write-Host "• NAT Gateway: ~$45/month" -ForegroundColor Gray
Write-Host "• Elastic IP: ~$3.6/month" -ForegroundColor Gray
Write-Host "• Total: ~$50+/month" -ForegroundColor Gray
Write-Host ""
Write-Host "EC2 t3.micro:" -ForegroundColor White
Write-Host "• EC2 instance: ~$8.5/month" -ForegroundColor Gray
Write-Host "• Elastic IP: ~$3.6/month (when associated)" -ForegroundColor Gray
Write-Host "• Total: ~$12/month" -ForegroundColor Gray
Write-Host ""

Write-Host "DECISION TIME:" -ForegroundColor Red
Write-Host "==============" -ForegroundColor Red
Write-Host ""
Write-Host "Choose your path:" -ForegroundColor White
Write-Host "A) Search for existing IP 13.210.224.119" -ForegroundColor Gray
Write-Host "B) Allocate new IP and use EC2" -ForegroundColor Gray
Write-Host "C) Configure Lambda VPC (not recommended)" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter A, B, or C"

switch ($choice.ToUpper()) {
    "A" {
        Write-Host ""
        Write-Host "Searching for existing IP..." -ForegroundColor Yellow
        Write-Host "Run: .\scripts\find-nat-gateway-ip.ps1" -ForegroundColor Cyan
    }
    "B" {
        Write-Host ""
        Write-Host "Setting up new EC2 solution..." -ForegroundColor Yellow
        Write-Host "Run: .\scripts\allocate-new-elastic-ip.ps1" -ForegroundColor Cyan
    }
    "C" {
        Write-Host ""
        Write-Host "Lambda VPC configuration is complex and expensive." -ForegroundColor Red
        Write-Host "Are you sure? EC2 is recommended." -ForegroundColor Yellow
        Write-Host "Contact support if you need Lambda VPC setup." -ForegroundColor White
    }
    default {
        Write-Host ""
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}
