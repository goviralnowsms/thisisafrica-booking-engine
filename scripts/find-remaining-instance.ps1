# Find what EC2 instances you have left after deletion

Write-Host "=== FIND REMAINING EC2 INSTANCES ===" -ForegroundColor Green
Write-Host ""

$ELASTIC_IP = "13.211.226.114"

Write-Host "CURRENT SITUATION:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-Host ""
Write-Host "• You deleted the wrong EC2 instance" -ForegroundColor Red
Write-Host "• You have Elastic IP: $ELASTIC_IP (allocated but maybe not associated)" -ForegroundColor White
Write-Host "• You need to find your remaining instance and associate the IP" -ForegroundColor White
Write-Host ""

Write-Host "STEP 1: CHECK YOUR REMAINING INSTANCES" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to AWS Console > EC2 > Instances" -ForegroundColor White
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Look for:" -ForegroundColor White
Write-Host "• Any instances in 'running' state" -ForegroundColor Gray
Write-Host "• Instance names: 'Tourplan' or 'tourplan-instance'" -ForegroundColor Gray
Write-Host "• Note the Instance ID (i-xxxxxxxxx)" -ForegroundColor Gray
Write-Host "• Note the current Public IPv4 address" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: CHECK ELASTIC IP STATUS" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to AWS Console > EC2 > Elastic IPs" -ForegroundColor White
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Find IP: $ELASTIC_IP" -ForegroundColor White
Write-Host "Check the 'Associated with' column:" -ForegroundColor White
Write-Host ""
Write-Host "Possible statuses:" -ForegroundColor Yellow
Write-Host "• 'Not associated' = IP is available to associate" -ForegroundColor Green
Write-Host "• 'i-xxxxxxxxx' = IP is associated with an instance" -ForegroundColor White
Write-Host "• 'eni-xxxxxxxxx' = IP is associated with a network interface" -ForegroundColor White
Write-Host ""

Write-Host "STEP 3: ASSOCIATE IP WITH REMAINING INSTANCE" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you have a remaining instance:" -ForegroundColor White
Write-Host ""
Write-Host "1. In Elastic IPs, select $ELASTIC_IP" -ForegroundColor Gray
Write-Host "2. Actions > Associate Elastic IP address" -ForegroundColor Gray
Write-Host "3. Resource type: Instance" -ForegroundColor Gray
Write-Host "4. Instance: [Choose your remaining instance]" -ForegroundColor Gray
Write-Host "5. Click 'Associate'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: TEST SSH CONNECTION" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After association, test SSH:" -ForegroundColor White
Write-Host ""
Write-Host "ssh -i `"path/to/your/key.pem`" ubuntu@$ELASTIC_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "WHAT IF YOU HAVE NO INSTANCES LEFT?" -ForegroundColor Red
Write-Host "====================================" -ForegroundColor Red
Write-Host ""
Write-Host "If you accidentally deleted all instances:" -ForegroundColor White
Write-Host ""
Write-Host "1. Create a new EC2 instance" -ForegroundColor Gray
Write-Host "2. Use the same key pair (tourplan-ubuntu-key)" -ForegroundColor Gray
Write-Host "3. Associate the Elastic IP $ELASTIC_IP" -ForegroundColor Gray
Write-Host "4. Set up your booking engine again" -ForegroundColor Gray
Write-Host ""

Write-Host "RECOVERY OPTIONS:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Use remaining instance (if any)" -ForegroundColor Green
Write-Host "• Associate $ELASTIC_IP with it" -ForegroundColor White
Write-Host "• Deploy your booking engine" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Create new instance" -ForegroundColor Yellow
Write-Host "• Launch new Ubuntu instance" -ForegroundColor White
Write-Host "• Use existing key pair" -ForegroundColor White
Write-Host "• Associate $ELASTIC_IP" -ForegroundColor White
Write-Host "• Redeploy booking engine" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "==========" -ForegroundColor Red
Write-Host ""
Write-Host "• The Elastic IP $ELASTIC_IP still exists in your account" -ForegroundColor Green
Write-Host "• You're not losing the IP - just need to associate it correctly" -ForegroundColor Green
Write-Host "• Once associated, this IP is what Tourplan needs to whitelist" -ForegroundColor Green
Write-Host ""

Write-Host "Check your AWS Console now and report back what you see!" -ForegroundColor Green
