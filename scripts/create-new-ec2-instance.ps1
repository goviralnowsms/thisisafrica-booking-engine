# PowerShell script to guide creating a new EC2 instance

Write-Host "🚀 Creating New EC2 Instance with Proper SSH Key" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Follow these steps in AWS Console:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to AWS Console → EC2 → Instances" -ForegroundColor White
Write-Host "2. Click 'Launch instances'" -ForegroundColor White
Write-Host "3. Configure as follows:" -ForegroundColor White
Write-Host ""
Write-Host "   Name: tourplan-booking-engine-v2" -ForegroundColor Cyan
Write-Host "   AMI: Amazon Linux 2023 AMI" -ForegroundColor Cyan
Write-Host "   Instance type: t2.micro (Free tier)" -ForegroundColor Cyan
Write-Host "   Key pair: Create new key pair" -ForegroundColor Cyan
Write-Host "     - Name: tourplan-new-key" -ForegroundColor Cyan
Write-Host "     - Type: RSA" -ForegroundColor Cyan
Write-Host "     - Format: .pem" -ForegroundColor Cyan
Write-Host "   Security group: Create new or use existing" -ForegroundColor Cyan
Write-Host "     - SSH (22) from Your IP" -ForegroundColor Cyan
Write-Host "     - HTTP (80) from Anywhere" -ForegroundColor Cyan
Write-Host "     - Custom TCP (3000) from Anywhere" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Launch the instance" -ForegroundColor White
Write-Host "5. Download the new .pem file to Downloads folder" -ForegroundColor White
Write-Host "6. Note the new Public IP address" -ForegroundColor White
Write-Host ""
Write-Host "After creating the instance, run:" -ForegroundColor Yellow
Write-Host "ssh -i `"C:\Users\Tess\Downloads\tourplan-new-key.pem`" ec2-user@NEW_IP_ADDRESS" -ForegroundColor Green
Write-Host ""
Write-Host "This will ensure you have a working SSH connection!" -ForegroundColor Green
