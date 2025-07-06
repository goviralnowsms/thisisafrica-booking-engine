# Associate the Elastic IP with whatever instance you have left

Write-Host "=== ASSOCIATE ELASTIC IP WITH REMAINING INSTANCE ===" -ForegroundColor Green
Write-Host ""

$ELASTIC_IP = "13.211.226.114"

Write-Host "ELASTIC IP TO ASSOCIATE: $ELASTIC_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: FIND YOUR REMAINING INSTANCE" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to AWS Console > EC2 > Instances" -ForegroundColor White
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Look for any instance with:" -ForegroundColor White
Write-Host "• State: running" -ForegroundColor Gray
Write-Host "• Instance type: t2.micro, t3.micro, etc." -ForegroundColor Gray
Write-Host "• Key name: tourplan-ubuntu-key (preferred)" -ForegroundColor Gray
Write-Host ""
Write-Host "Note down:" -ForegroundColor Yellow
Write-Host "• Instance ID: i-xxxxxxxxx" -ForegroundColor White
Write-Host "• Current Public IP: xxx.xxx.xxx.xxx" -ForegroundColor White
Write-Host "• Instance name" -ForegroundColor White
Write-Host ""

Write-Host "STEP 2: CHECK ELASTIC IP STATUS" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to AWS Console > EC2 > Elastic IPs" -ForegroundColor White
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Find the row with: $ELASTIC_IP" -ForegroundColor White
Write-Host ""
Write-Host "Check 'Associated with' column:" -ForegroundColor Yellow
Write-Host "• 'Not associated' = Ready to associate ✓" -ForegroundColor Green
Write-Host "• 'i-xxxxxxxxx' = Already associated with an instance" -ForegroundColor White
Write-Host "• 'eni-xxxxxxxxx' = Associated with network interface" -ForegroundColor White
Write-Host ""

Write-Host "STEP 3: ASSOCIATE THE IP" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Select the checkbox next to $ELASTIC_IP" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Click 'Actions' dropdown" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Click 'Associate Elastic IP address'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. In the dialog:" -ForegroundColor Gray
Write-Host "   • Resource type: Instance" -ForegroundColor White
Write-Host "   • Instance: [Choose your remaining instance]" -ForegroundColor White
Write-Host "   • Private IP address: [Leave default]" -ForegroundColor White
Write-Host "   • Allow reassociation: ✓ Check this" -ForegroundColor White
Write-Host ""
Write-Host "5. Click 'Associate'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: VERIFY ASSOCIATION" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After clicking 'Associate':" -ForegroundColor White
Write-Host ""
Write-Host "1. Go back to EC2 > Instances" -ForegroundColor Gray
Write-Host "2. Find your instance" -ForegroundColor Gray
Write-Host "3. Check 'Public IPv4 address' column" -ForegroundColor Gray
Write-Host ""
Write-Host "Expected result: $ELASTIC_IP" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 5: TEST SSH CONNECTION" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test SSH with the Elastic IP:" -ForegroundColor White
Write-Host ""
Write-Host "ssh -i `"path/to/tourplan-ubuntu-key.pem`" ubuntu@$ELASTIC_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "If SSH works:" -ForegroundColor Green
Write-Host "✓ Association successful" -ForegroundColor White
Write-Host "✓ Instance is accessible" -ForegroundColor White
Write-Host "✓ Ready for Tourplan whitelist request" -ForegroundColor White
Write-Host ""

Write-Host "STEP 6: VERIFY OUTBOUND IP" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once SSH works, run this on the server:" -ForegroundColor White
Write-Host ""
Write-Host "curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected output: $ELASTIC_IP" -ForegroundColor Green
Write-Host ""
Write-Host "This confirms that when your booking engine makes API calls," -ForegroundColor White
Write-Host "Tourplan will see requests coming from: $ELASTIC_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "================" -ForegroundColor Red
Write-Host ""
Write-Host "Problem: No instances found" -ForegroundColor Yellow
Write-Host "Solution: Create a new instance using the create-new-instance script" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Association fails" -ForegroundColor Yellow
Write-Host "Solution: Make sure instance is in 'running' state" -ForegroundColor White
Write-Host ""
Write-Host "Problem: SSH connection refused" -ForegroundColor Yellow
Write-Host "Solution: Update security group to allow SSH from your IP" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Wrong outbound IP" -ForegroundColor Yellow
Write-Host "Solution: Wait 2-3 minutes for association to propagate" -ForegroundColor White
Write-Host ""

Write-Host "NEXT STEPS AFTER SUCCESSFUL ASSOCIATION:" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. ✓ Associate $ELASTIC_IP with your instance" -ForegroundColor White
Write-Host "2. ✓ Test SSH connection" -ForegroundColor White
Write-Host "3. ✓ Verify outbound IP matches" -ForegroundColor White
Write-Host "4. → Deploy your booking engine" -ForegroundColor White
Write-Host "5. → Contact Tourplan to whitelist $ELASTIC_IP" -ForegroundColor White
Write-Host "6. → Test Tourplan API calls" -ForegroundColor White
Write-Host ""

Write-Host "Go check your AWS Console and see what instances you have!" -ForegroundColor Green
