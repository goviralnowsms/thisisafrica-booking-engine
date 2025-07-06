# Check both EC2 instances to decide which one to keep
# Help user choose between "Tourplan" and "tourplan-instance"

Write-Host "=== CHECKING YOUR EC2 INSTANCES ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"

Write-Host "You have 2 instances:" -ForegroundColor Yellow
Write-Host "1. Tourplan" -ForegroundColor White
Write-Host "2. tourplan-instance" -ForegroundColor White
Write-Host ""
Write-Host "Let's check which one to keep..." -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Check Instance Status" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to AWS Console > EC2 > Instances" -ForegroundColor White
Write-Host ""
Write-Host "For EACH instance, check:" -ForegroundColor White
Write-Host ""
Write-Host "Instance Details to Compare:" -ForegroundColor Yellow
Write-Host "┌─────────────────────────────────────────────────────────┐" -ForegroundColor Gray
Write-Host "│ Attribute          │ Tourplan    │ tourplan-instance   │" -ForegroundColor Gray
Write-Host "├─────────────────────────────────────────────────────────┤" -ForegroundColor Gray
Write-Host "│ Instance State     │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "│ Instance Type      │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "│ Launch Time        │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "│ Key Name           │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "│ Security Group     │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "│ Public IP          │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "│ Private IP         │ ?           │ ?                   │" -ForegroundColor Gray
Write-Host "└─────────────────────────────────────────────────────────┘" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: Decision Criteria" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Keep the instance that has:" -ForegroundColor Green
Write-Host "✓ State: Running (not stopped)" -ForegroundColor White
Write-Host "✓ Newer launch time (more recent)" -ForegroundColor White
Write-Host "✓ Correct key pair (tourplan-ubuntu-key)" -ForegroundColor White
Write-Host "✓ Better instance type (t3.micro or larger)" -ForegroundColor White
Write-Host "✓ Proper security group configured" -ForegroundColor White
Write-Host ""
Write-Host "Delete the instance that has:" -ForegroundColor Red
Write-Host "✗ State: Stopped" -ForegroundColor White
Write-Host "✗ Older launch time" -ForegroundColor White
Write-Host "✗ Wrong or missing key pair" -ForegroundColor White
Write-Host "✗ Smaller instance type (t2.nano)" -ForegroundColor White
Write-Host "✗ No security group or wrong configuration" -ForegroundColor White
Write-Host ""

Write-Host "STEP 3: Test SSH Access" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deleting, test SSH to both instances:" -ForegroundColor White
Write-Host ""
Write-Host "Get the Public IP of each instance from EC2 console, then test:" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Test Tourplan instance" -ForegroundColor Gray
Write-Host "ssh -i ~/.ssh/tourplan-ubuntu-key.pem ubuntu@TOURPLAN_PUBLIC_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Test tourplan-instance" -ForegroundColor Gray
Write-Host "ssh -i ~/.ssh/tourplan-ubuntu-key.pem ubuntu@TOURPLAN_INSTANCE_PUBLIC_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "Keep the one that:" -ForegroundColor Green
Write-Host "✓ SSH connection works" -ForegroundColor White
Write-Host "✓ Has your application files" -ForegroundColor White
Write-Host "✓ Has proper configuration" -ForegroundColor White
Write-Host ""

Write-Host "STEP 4: Associate Elastic IP" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once you decide which instance to keep:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Elastic IPs" -ForegroundColor Gray
Write-Host "2. Select IP: $NEW_IP" -ForegroundColor Gray
Write-Host "3. Actions > Associate Elastic IP address" -ForegroundColor Gray
Write-Host "4. Choose the instance you want to KEEP" -ForegroundColor Gray
Write-Host "5. Click Associate" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 5: Delete Unnecessary Instance" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After associating the IP with the good instance:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Instances" -ForegroundColor Gray
Write-Host "2. Select the instance you DON'T want" -ForegroundColor Gray
Write-Host "3. Instance State > Terminate instance" -ForegroundColor Gray
Write-Host "4. Type 'terminate' to confirm" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  WARNING: This is PERMANENT! Make sure you choose correctly!" -ForegroundColor Red
Write-Host ""

Write-Host "STEP 6: Cost Savings" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Running 2 instances costs:" -ForegroundColor Yellow
Write-Host "• t3.micro: ~$8.50/month each = $17/month total" -ForegroundColor White
Write-Host "• t2.micro: ~$8.50/month each = $17/month total" -ForegroundColor White
Write-Host ""
Write-Host "Running 1 instance costs:" -ForegroundColor Green
Write-Host "• t3.micro: ~$8.50/month" -ForegroundColor White
Write-Host "• t2.micro: ~$8.50/month (Free Tier eligible)" -ForegroundColor White
Write-Host ""
Write-Host "💰 Deleting one instance saves ~$8.50/month!" -ForegroundColor Green
Write-Host ""

Write-Host "RECOMMENDATION:" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""
Write-Host "1. Check both instances in EC2 console" -ForegroundColor White
Write-Host "2. Keep the one that's running and has SSH access" -ForegroundColor White
Write-Host "3. Associate Elastic IP with the good instance" -ForegroundColor White
Write-Host "4. Test SSH with new IP" -ForegroundColor White
Write-Host "5. Delete the other instance" -ForegroundColor White
Write-Host ""

Write-Host "COMMON SCENARIOS:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Scenario 1: Both instances running" -ForegroundColor White
Write-Host "→ Keep the newer one, delete the older one" -ForegroundColor Gray
Write-Host ""
Write-Host "Scenario 2: One running, one stopped" -ForegroundColor White
Write-Host "→ Keep the running one, delete the stopped one" -ForegroundColor Gray
Write-Host ""
Write-Host "Scenario 3: Both stopped" -ForegroundColor White
Write-Host "→ Start both, test SSH, keep the working one" -ForegroundColor Gray
Write-Host ""
Write-Host "Scenario 4: Different key pairs" -ForegroundColor White
Write-Host "→ Keep the one with 'tourplan-ubuntu-key'" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to check your instances? Go to EC2 Console!" -ForegroundColor Green
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:" -ForegroundColor Cyan
