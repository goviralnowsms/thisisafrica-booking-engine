# Verify that the public IP setup is working correctly

Write-Host "=== VERIFY PUBLIC IP SETUP ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$INSTANCE_ID = "i-0ab30f25c4eb53815"

Write-Host "VERIFICATION CHECKLIST:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. ELASTIC IP ASSOCIATION:" -ForegroundColor Yellow
Write-Host "Target IP: $NEW_IP" -ForegroundColor White
Write-Host "Instance: $INSTANCE_ID" -ForegroundColor White
Write-Host "Status: Associated (confirmed from AWS Console)" -ForegroundColor Green
Write-Host ""

Write-Host "2. SSH CONNECTION TEST:" -ForegroundColor Yellow
Write-Host "Command: ssh -i tourplan-ubuntu-key.pem ubuntu@$NEW_IP" -ForegroundColor White
Write-Host "Expected: Ubuntu welcome message" -ForegroundColor White
Write-Host "Status: Please test manually" -ForegroundColor Yellow
Write-Host ""

Write-Host "3. PUBLIC IP VERIFICATION:" -ForegroundColor Yellow
Write-Host "From inside EC2 instance, run: curl https://api.ipify.org" -ForegroundColor White
Write-Host "Expected result: $NEW_IP" -ForegroundColor White
Write-Host "Status: Please test after SSH connection works" -ForegroundColor Yellow
Write-Host ""

Write-Host "4. SECURITY GROUP CHECK:" -ForegroundColor Yellow
Write-Host "Required: SSH (port 22) allowed from your IP" -ForegroundColor White
Write-Host "Location: EC2 > Security Groups > Inbound rules" -ForegroundColor White
Write-Host "Status: Please verify in AWS Console" -ForegroundColor Yellow
Write-Host ""

Write-Host "5. INSTANCE STATE:" -ForegroundColor Yellow
Write-Host "Required: Instance must be 'running'" -ForegroundColor White
Write-Host "Location: EC2 > Instances" -ForegroundColor White
Write-Host "Status: Please verify in AWS Console" -ForegroundColor Yellow
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Test SSH connection to $NEW_IP" -ForegroundColor White
Write-Host "2. Once SSH works, verify public IP with curl command" -ForegroundColor White
Write-Host "3. Generate email to Tourplan requesting IP whitelist" -ForegroundColor White
Write-Host "4. Deploy your booking engine to the EC2 instance" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT:" -ForegroundColor Red
Write-Host "==========" -ForegroundColor Red
Write-Host ""
Write-Host "The IP $NEW_IP is now your static public IP." -ForegroundColor White
Write-Host "This is the IP that Tourplan needs to whitelist." -ForegroundColor White
Write-Host "All API calls from your EC2 instance will use this IP." -ForegroundColor White
Write-Host ""

Write-Host "Ready to generate Tourplan whitelist email!" -ForegroundColor Green
