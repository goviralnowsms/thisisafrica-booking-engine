# Guide to create a new EC2 instance if all were deleted

Write-Host "=== CREATE NEW EC2 INSTANCE (IF NEEDED) ===" -ForegroundColor Green
Write-Host ""

$ELASTIC_IP = "13.211.226.114"

Write-Host "IF YOU HAVE NO INSTANCES LEFT:" -ForegroundColor Red
Write-Host "==============================" -ForegroundColor Red
Write-Host ""
Write-Host "Don't panic! We can create a new instance and associate your Elastic IP." -ForegroundColor White
Write-Host ""

Write-Host "STEP 1: CREATE NEW EC2 INSTANCE" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to AWS Console > EC2 > Instances" -ForegroundColor White
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Click 'Launch instances'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure the instance:" -ForegroundColor Gray
Write-Host "   • Name: tourplan-booking-engine-v2" -ForegroundColor White
Write-Host "   • AMI: Ubuntu Server 22.04 LTS" -ForegroundColor White
Write-Host "   • Instance type: t3.micro (or t2.micro for free tier)" -ForegroundColor White
Write-Host "   • Key pair: tourplan-ubuntu-key (use existing)" -ForegroundColor White
Write-Host ""
Write-Host "3. Network settings:" -ForegroundColor Gray
Write-Host "   • VPC: Default VPC" -ForegroundColor White
Write-Host "   • Subnet: Default subnet" -ForegroundColor White
Write-Host "   • Auto-assign public IP: Enable" -ForegroundColor White
Write-Host ""
Write-Host "4. Security group:" -ForegroundColor Gray
Write-Host "   • Create new security group or use existing" -ForegroundColor White
Write-Host "   • Allow SSH (port 22) from your IP" -ForegroundColor White
Write-Host "   • Allow HTTP (port 80) from anywhere" -ForegroundColor White
Write-Host "   • Allow HTTPS (port 443) from anywhere" -ForegroundColor White
Write-Host "   • Allow Custom TCP (port 3000) from anywhere" -ForegroundColor White
Write-Host ""
Write-Host "5. Storage: 8 GB gp3 (default is fine)" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Click 'Launch instance'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: WAIT FOR INSTANCE TO START" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "• Wait for instance state to become 'running'" -ForegroundColor White
Write-Host "• Note the temporary public IP (will be replaced)" -ForegroundColor White
Write-Host "• Note the instance ID (i-xxxxxxxxx)" -ForegroundColor White
Write-Host ""

Write-Host "STEP 3: ASSOCIATE ELASTIC IP" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to EC2 > Elastic IPs" -ForegroundColor Gray
Write-Host "2. Select $ELASTIC_IP" -ForegroundColor Gray
Write-Host "3. Actions > Associate Elastic IP address" -ForegroundColor Gray
Write-Host "4. Resource type: Instance" -ForegroundColor Gray
Write-Host "5. Instance: [Choose your new instance]" -ForegroundColor Gray
Write-Host "6. Click 'Associate'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: TEST SSH CONNECTION" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ssh -i `"path/to/tourplan-ubuntu-key.pem`" ubuntu@$ELASTIC_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 5: DEPLOY BOOKING ENGINE" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once SSH works:" -ForegroundColor White
Write-Host ""
Write-Host "# Update system" -ForegroundColor Gray
Write-Host "sudo apt update && sudo apt upgrade -y" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Install Node.js" -ForegroundColor Gray
Write-Host "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -" -ForegroundColor Yellow
Write-Host "sudo apt-get install -y nodejs" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Install Git" -ForegroundColor Gray
Write-Host "sudo apt install git -y" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Clone your project (if you have it in Git)" -ForegroundColor Gray
Write-Host "git clone YOUR_REPOSITORY_URL" -ForegroundColor Yellow
Write-Host ""

Write-Host "COST IMPACT:" -ForegroundColor Green
Write-Host "============" -ForegroundColor Green
Write-Host ""
Write-Host "• New t3.micro instance: ~$8.50/month" -ForegroundColor White
Write-Host "• Elastic IP (while associated): $0" -ForegroundColor White
Write-Host "• Total monthly cost: ~$8.50" -ForegroundColor White
Write-Host ""

Write-Host "ADVANTAGES OF STARTING FRESH:" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "• Clean Ubuntu installation" -ForegroundColor White
Write-Host "• Latest security updates" -ForegroundColor White
Write-Host "• Proper configuration from the start" -ForegroundColor White
Write-Host "• Same Elastic IP ($ELASTIC_IP) for Tourplan whitelist" -ForegroundColor White
Write-Host ""

Write-Host "WHAT YOU KEEP:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host ""
Write-Host "✓ Elastic IP: $ELASTIC_IP" -ForegroundColor Green
Write-Host "✓ SSH Key: tourplan-ubuntu-key" -ForegroundColor Green
Write-Host "✓ Security groups" -ForegroundColor Green
Write-Host "✓ Your project code (if backed up)" -ForegroundColor Green
Write-Host ""

Write-Host "Ready to create a new instance? Go to AWS Console!" -ForegroundColor Green
