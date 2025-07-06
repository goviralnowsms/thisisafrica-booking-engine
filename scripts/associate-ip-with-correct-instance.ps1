# Associate the Elastic IP with the correct instance after deciding which to keep

Write-Host "=== ASSOCIATE ELASTIC IP WITH CORRECT INSTANCE ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"

Write-Host "Elastic IP to associate: $NEW_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: Identify Your Instances" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to EC2 > Instances and identify:" -ForegroundColor White
Write-Host ""
Write-Host "Instance 1: 'Tourplan'" -ForegroundColor Yellow
Write-Host "• Instance ID: i-xxxxxxxxx" -ForegroundColor Gray
Write-Host "• State: ?" -ForegroundColor Gray
Write-Host "• Public IP: ?" -ForegroundColor Gray
Write-Host "• Key Name: ?" -ForegroundColor Gray
Write-Host ""
Write-Host "Instance 2: 'tourplan-instance'" -ForegroundColor Yellow
Write-Host "• Instance ID: i-yyyyyyyyy" -ForegroundColor Gray
Write-Host "• State: ?" -ForegroundColor Gray
Write-Host "• Public IP: ?" -ForegroundColor Gray
Write-Host "• Key Name: ?" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: Choose Which Instance to Keep" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Decision criteria (choose the instance with):" -ForegroundColor White
Write-Host ""
Write-Host "✓ State: Running" -ForegroundColor Green
Write-Host "✓ Key Name: tourplan-ubuntu-key" -ForegroundColor Green
Write-Host "✓ More recent Launch Time" -ForegroundColor Green
Write-Host "✓ Better Instance Type (t3.micro > t2.micro)" -ForegroundColor Green
Write-Host "✓ SSH access works" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 3: Associate Elastic IP" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once you've decided which instance to keep:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Elastic IPs" -ForegroundColor Gray
Write-Host "   https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Find the row with IP: $NEW_IP" -ForegroundColor Gray
Write-Host "   Name: tourplan-proxy-api" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Select the checkbox next to this IP" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Click 'Actions' dropdown" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Click 'Associate Elastic IP address'" -ForegroundColor Gray
Write-Host ""
Write-Host "6. In the association dialog:" -ForegroundColor Gray
Write-Host "   • Resource type: Instance" -ForegroundColor White
Write-Host "   • Instance: [Choose your KEEP instance]" -ForegroundColor White
Write-Host "   • Private IP address: [Leave default]" -ForegroundColor White
Write-Host "   • Allow reassociation: ✓ Check this box" -ForegroundColor White
Write-Host ""
Write-Host "7. Click 'Associate'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Verify Association" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After association:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go back to EC2 > Instances" -ForegroundColor Gray
Write-Host "2. Your chosen instance should now show:" -ForegroundColor Gray
Write-Host "   • Public IPv4 address: $NEW_IP" -ForegroundColor White
Write-Host "   • Public IPv4 DNS: ec2-13-211-226-114.ap-southeast-2.compute.amazonaws.com" -ForegroundColor White
Write-Host ""
Write-Host "3. The other instance should show:" -ForegroundColor Gray
Write-Host "   • Public IPv4 address: [different IP or none]" -ForegroundColor White
Write-Host ""

Write-Host "STEP 5: Test SSH Connection" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test SSH to your instance with the new IP:" -ForegroundColor White
Write-Host ""
Write-Host "ssh -i ~/.ssh/tourplan-ubuntu-key.pem ubuntu@$NEW_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "If successful:" -ForegroundColor Green
Write-Host "✓ Elastic IP is properly associated" -ForegroundColor White
Write-Host "✓ Security group allows SSH" -ForegroundColor White
Write-Host "✓ Key pair is correct" -ForegroundColor White
Write-Host ""
Write-Host "If it fails:" -ForegroundColor Red
Write-Host "✗ Check security group rules" -ForegroundColor White
Write-Host "✗ Verify key file path and permissions" -ForegroundColor White
Write-Host "✗ Confirm IP association in EC2 console" -ForegroundColor White
Write-Host ""

Write-Host "STEP 6: Test from Inside Instance" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once SSH works, test the public IP from inside:" -ForegroundColor White
Write-Host ""
Write-Host "# Check what IP the world sees" -ForegroundColor Gray
Write-Host "curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected result: $NEW_IP" -ForegroundColor Green
Write-Host ""
Write-Host "If you get a different IP:" -ForegroundColor Red
Write-Host "✗ Elastic IP not properly associated" -ForegroundColor White
Write-Host "✗ Instance might be using a different network interface" -ForegroundColor White
Write-Host ""

Write-Host "STEP 7: Delete the Other Instance" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After confirming the correct instance works:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Instances" -ForegroundColor Gray
Write-Host "2. Select the instance you DON'T want (the one without $NEW_IP)" -ForegroundColor Gray
Write-Host "3. Instance State > Terminate instance" -ForegroundColor Gray
Write-Host "4. Type 'terminate' to confirm" -ForegroundColor Gray
Write-Host "5. Click 'Terminate'" -ForegroundColor Gray
Write-Host ""
Write-Host "💰 This will save you ~$8.50/month!" -ForegroundColor Green
Write-Host ""

Write-Host "TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "================" -ForegroundColor Red
Write-Host ""
Write-Host "Problem: Can't see instances in dropdown" -ForegroundColor Yellow
Write-Host "Solution: Make sure instances are in 'running' state" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Association fails" -ForegroundColor Yellow
Write-Host "Solution: Check if another IP is already associated" -ForegroundColor White
Write-Host ""
Write-Host "Problem: SSH fails after association" -ForegroundColor Yellow
Write-Host "Solution: Update security group to allow SSH from your IP" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Wrong IP returned by curl" -ForegroundColor Yellow
Write-Host "Solution: Wait 2-3 minutes for association to propagate" -ForegroundColor White
Write-Host ""

Write-Host "NEXT STEPS AFTER ASSOCIATION:" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""
Write-Host "1. ✓ Associate IP with correct instance" -ForegroundColor White
Write-Host "2. ✓ Test SSH connection" -ForegroundColor White
Write-Host "3. ✓ Verify public IP from instance" -ForegroundColor White
Write-Host "4. ✓ Delete unnecessary instance" -ForegroundColor White
Write-Host "5. → Contact Tourplan with new IP" -ForegroundColor White
Write-Host "6. → Deploy your booking engine" -ForegroundColor White
Write-Host ""

Write-Host "Ready to associate? Go to EC2 Console!" -ForegroundColor Green
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Cyan
