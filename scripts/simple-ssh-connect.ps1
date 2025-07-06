# Simple SSH Connection Script for Tourplan Booking Engine
# Connects to EC2 instance with whitelisted IP

Write-Host "Connecting to Tourplan EC2 Instance..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Configuration - WHITELISTED IP
$EC2_IP = "13.210.224.119"  # This is your WHITELISTED Elastic IP
$SSH_USER = "ubuntu"
$SSH_KEY = ".\tourplan-ubuntu-key.pem"

Write-Host "Target: $SSH_USER@$EC2_IP" -ForegroundColor Yellow
Write-Host "SSH Key: $SSH_KEY" -ForegroundColor Yellow
Write-Host ""

# Check if SSH key exists
if (-not (Test-Path $SSH_KEY)) {
    Write-Host "SSH key not found!" -ForegroundColor Red
    Write-Host "Run: .\scripts\copy-key-file.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Establishing SSH connection..." -ForegroundColor Cyan
Write-Host "Press Ctrl+D or type 'exit' to disconnect" -ForegroundColor Gray
Write-Host ""

# Connect to EC2 instance
try {
    & ssh -i $SSH_KEY -o "StrictHostKeyChecking=no" "$SSH_USER@$EC2_IP"
} catch {
    Write-Host ""
    Write-Host "Connection failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor White
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Run: .\scripts\quick-ssh-test.ps1" -ForegroundColor White
    Write-Host "2. Check if EC2 instance is using whitelisted IP: $EC2_IP" -ForegroundColor White
    Write-Host "3. Verify security group allows SSH from your current IP" -ForegroundColor White
    exit 1
}
