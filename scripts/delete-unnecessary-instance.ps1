# Guide for safely deleting the unnecessary EC2 instance

Write-Host "=== SAFELY DELETE UNNECESSARY INSTANCE ===" -ForegroundColor Green
Write-Host ""

Write-Host "⚠️  IMPORTANT: Only run this AFTER you've decided which instance to delete!" -ForegroundColor Red
Write-Host ""

Write-Host "BEFORE DELETING - FINAL CHECKLIST:" -ForegroundColor Yellow
Write-Host "===================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "□ I have identified which instance to KEEP" -ForegroundColor White
Write-Host "□ I have identified which instance to DELETE" -ForegroundColor White
Write-Host "□ The KEEP instance is running" -ForegroundColor White
Write-Host "□ SSH works to the KEEP instance" -ForegroundColor White
Write-Host "□ Elastic IP is associated with KEEP instance" -ForegroundColor White
Write-Host "□ I have tested the KEEP instance thoroughly" -ForegroundColor White
Write-Host ""

Write-Host "If ALL boxes are checked, proceed with deletion:" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 1: Final Verification" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Double-check which instance has your Elastic IP:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Instances" -ForegroundColor Gray
Write-Host "2. Look at the 'Public IPv4 address' column" -ForegroundColor Gray
Write-Host "3. The instance with IP 13.211.226.114 is your KEEP instance" -ForegroundColor Gray
Write-Host "4. The instance with a different IP (or no IP) can be deleted" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: Stop the Instance First (Optional)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To be extra safe, stop the instance before terminating:" -ForegroundColor White
Write-Host ""
Write-Host "1. Select the instance you want to DELETE" -ForegroundColor Gray
Write-Host "2. Instance State > Stop instance" -ForegroundColor Gray
Write-Host "3. Wait for it to stop" -ForegroundColor Gray
Write-Host "4. Verify your KEEP instance still works" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: Terminate the Instance" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  THIS IS PERMANENT AND CANNOT BE UNDONE!" -ForegroundColor Red
Write-Host ""
Write-Host "1. Select the instance you want to DELETE" -ForegroundColor Gray
Write-Host "2. Instance State > Terminate instance" -ForegroundColor Gray
Write-Host "3. A dialog will appear asking for confirmation" -ForegroundColor Gray
Write-Host "4. Type 'terminate' in the text box" -ForegroundColor Gray
Write-Host "5. Click 'Terminate'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Verify Deletion" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After termination:" -ForegroundColor White
Write-Host ""
Write-Host "1. The instance state will change to 'Shutting-down'" -ForegroundColor Gray
Write-Host "2. Then it will change to 'Terminated'" -ForegroundColor Gray
Write-Host "3. After a few minutes, it will disappear from the list" -ForegroundColor Gray
Write-Host "4. You will stop being charged for that instance" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 5: Test Your Remaining Instance" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After deletion, test your remaining instance:" -ForegroundColor White
Write-Host ""
Write-Host "# SSH test" -ForegroundColor Gray
Write-Host "ssh -i ~/.ssh/tourplan-ubuntu-key.pem ubuntu@13.211.226.114" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Check public IP from inside instance" -ForegroundColor Gray
Write-Host "curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected result: 13.211.226.114" -ForegroundColor Green
Write-Host ""

Write-Host "WHAT GETS DELETED:" -ForegroundColor Red
Write-Host "==================" -ForegroundColor Red
Write-Host ""
Write-Host "When you terminate an instance:" -ForegroundColor White
Write-Host "✗ The virtual machine is destroyed" -ForegroundColor Gray
Write-Host "✗ All data on the instance is lost" -ForegroundColor Gray
Write-Host "✗ The instance ID becomes invalid" -ForegroundColor Gray
Write-Host "✗ Any attached EBS volumes (if not set to persist)" -ForegroundColor Gray
Write-Host ""
Write-Host "What is NOT deleted:" -ForegroundColor Green
Write-Host "✓ Elastic IP addresses (they remain in your account)" -ForegroundColor Gray
Write-Host "✓ Security groups" -ForegroundColor Gray
Write-Host "✓ Key pairs" -ForegroundColor Gray
Write-Host "✓ EBS volumes (if set to persist)" -ForegroundColor Gray
Write-Host ""

Write-Host "COST IMPACT:" -ForegroundColor Green
Write-Host "============" -ForegroundColor Green
Write-Host ""
Write-Host "After deleting one instance:" -ForegroundColor White
Write-Host "💰 Monthly savings: ~$8.50" -ForegroundColor Green
Write-Host "💰 Annual savings: ~$102" -ForegroundColor Green
Write-Host ""
Write-Host "Your remaining costs:" -ForegroundColor White
Write-Host "• 1 EC2 instance: ~$8.50/month" -ForegroundColor Gray
Write-Host "• 1 Elastic IP: $0 (while associated)" -ForegroundColor Gray
Write-Host "• Data transfer: minimal" -ForegroundColor Gray
Write-Host ""

Write-Host "EMERGENCY RECOVERY:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you accidentally delete the wrong instance:" -ForegroundColor Red
Write-Host ""
Write-Host "1. You CANNOT recover a terminated instance" -ForegroundColor White
Write-Host "2. You'll need to create a new instance" -ForegroundColor White
Write-Host "3. Re-associate your Elastic IP" -ForegroundColor White
Write-Host "4. Reinstall your application" -ForegroundColor White
Write-Host ""
Write-Host "That's why it's important to be 100% sure before terminating!" -ForegroundColor Red
Write-Host ""

Write-Host "READY TO DELETE?" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host ""
Write-Host "Only proceed if you're absolutely certain which instance to delete." -ForegroundColor White
Write-Host "Go to EC2 Console > Instances and terminate the unnecessary one." -ForegroundColor White
Write-Host ""
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:" -ForegroundColor Cyan
