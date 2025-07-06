Write-Host "=== ALLOCATING NEW ELASTIC IP ===" -ForegroundColor Green
Write-Host ""

Write-Host "Current region: ap-southeast-2 (Sydney)" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Allocate Elastic IP" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to EC2 Console:" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Click the orange 'Allocate Elastic IP address' button" -ForegroundColor White
Write-Host ""
Write-Host "3. Configuration:" -ForegroundColor White
Write-Host "   - Public IPv4 address pool: Amazon's pool of IPv4 addresses" -ForegroundColor Gray
Write-Host "   - Network Border Group: ap-southeast-2" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Add tags (recommended):" -ForegroundColor White
Write-Host "   - Key: Name, Value: tourplan-whitelisted-ip" -ForegroundColor Gray
Write-Host "   - Key: Purpose, Value: Tourplan API access" -ForegroundColor Gray
Write-Host "   - Key: Project, Value: booking-engine" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Click 'Allocate'" -ForegroundColor White
Write-Host ""

Write-Host "STEP 2: Note the New IP Address" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "After allocation, you'll see something like:" -ForegroundColor White
Write-Host "- Allocated IPv4 address: 13.xxx.xxx.xxx" -ForegroundColor Gray
Write-Host "- Allocation ID: eipalloc-xxxxxxxxx" -ForegroundColor Gray
Write-Host ""
Write-Host "WRITE DOWN THE NEW IP ADDRESS!" -ForegroundColor Red
Write-Host ""

Write-Host "STEP 3: Associate with EC2 Instance" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Select the newly allocated IP" -ForegroundColor White
Write-Host "2. Click 'Actions' > 'Associate Elastic IP address'" -ForegroundColor White
Write-Host "3. Configuration:" -ForegroundColor White
Write-Host "   - Resource type: Instance" -ForegroundColor Gray
Write-Host "   - Instance: Select your running EC2 instance" -ForegroundColor Gray
Write-Host "   - Private IP address: (leave default)" -ForegroundColor Gray
Write-Host "4. Click 'Associate'" -ForegroundColor White
Write-Host ""

Write-Host "STEP 4: Update Tourplan Whitelist" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Contact Tourplan support with:" -ForegroundColor White
Write-Host "- Old IP (if any): 13.210.224.119" -ForegroundColor Gray
Write-Host "- New IP: [Your newly allocated IP]" -ForegroundColor Gray
Write-Host "- Request: Please update IP whitelist for agent SAMAGT" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 5: Test the Setup" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
Write-Host ""
Write-Host "After Tourplan confirms the whitelist update:" -ForegroundColor White
Write-Host "1. SSH to your EC2 instance" -ForegroundColor Gray
Write-Host "2. Test Tourplan API connection" -ForegroundColor Gray
Write-Host "3. Deploy your booking engine" -ForegroundColor Gray
Write-Host ""

Write-Host "COST WARNING:" -ForegroundColor Red
Write-Host "=============" -ForegroundColor Red
Write-Host "- Elastic IPs cost $0.005/hour when not associated" -ForegroundColor White
Write-Host "- Always associate with a running instance" -ForegroundColor White
Write-Host "- Release unused IPs to avoid charges" -ForegroundColor White
Write-Host ""

Write-Host "Ready to allocate? Go to EC2 Console!" -ForegroundColor Green
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Cyan
Write-Host ""

Write-Host "After allocation, run: .\scripts\test-new-ip-setup.ps1" -ForegroundColor Yellow
