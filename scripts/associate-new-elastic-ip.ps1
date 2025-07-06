# Associate the newly allocated Elastic IP with EC2 instance
# IP: 13.211.226.114 (tourplan-proxy-api)

Write-Host "=== ASSOCIATING ELASTIC IP WITH EC2 INSTANCE ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$IP_NAME = "tourplan-proxy-api"

Write-Host "New Elastic IP: $NEW_IP" -ForegroundColor Yellow
Write-Host "IP Name: $IP_NAME" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: Associate IP with EC2 Instance" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. You should already be in EC2 > Elastic IPs" -ForegroundColor White
Write-Host "2. Find the row with IP: $NEW_IP" -ForegroundColor White
Write-Host "3. The 'Associated with' column should show 'Not associated'" -ForegroundColor White
Write-Host ""
Write-Host "4. Select the checkbox next to IP: $NEW_IP" -ForegroundColor White
Write-Host "5. Click 'Actions' dropdown button" -ForegroundColor White
Write-Host "6. Click 'Associate Elastic IP address'" -ForegroundColor White
Write-Host ""
Write-Host "7. In the dialog that opens:" -ForegroundColor White
Write-Host "   - Resource type: Select 'Instance'" -ForegroundColor Gray
Write-Host "   - Instance: Choose your running EC2 instance" -ForegroundColor Gray
Write-Host "   - Private IP address: Leave as default" -ForegroundColor Gray
Write-Host "   - Allow this Elastic IP to be reassociated: Check this box" -ForegroundColor Gray
Write-Host ""
Write-Host "8. Click 'Associate'" -ForegroundColor White
Write-Host ""

Write-Host "STEP 2: Verify the Association" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After association:" -ForegroundColor White
Write-Host "1. The 'Associated with' column should show your instance ID" -ForegroundColor Gray
Write-Host "2. Go to EC2 > Instances" -ForegroundColor Gray
Write-Host "3. Your instance's 'Public IPv4 address' should now be: $NEW_IP" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: Test SSH Connection" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test SSH with the new IP:" -ForegroundColor White
Write-Host ""
Write-Host "ssh -i ~/.ssh/your-key.pem ubuntu@$NEW_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "If SSH works:" -ForegroundColor Green
Write-Host "✓ Elastic IP is properly associated" -ForegroundColor White
Write-Host "✓ Security group allows SSH from your IP" -ForegroundColor White
Write-Host "✓ Ready for next steps" -ForegroundColor White
Write-Host ""

Write-Host "STEP 4: Update Security Group (If Needed)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Security groups are SEPARATE from Elastic IP allocation." -ForegroundColor Yellow
Write-Host "You may need to update your security group rules:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Security Groups" -ForegroundColor Gray
Write-Host "2. Find your instance's security group" -ForegroundColor Gray
Write-Host "3. Check Inbound Rules:" -ForegroundColor Gray
Write-Host "   - SSH (port 22) from your local IP" -ForegroundColor White
Write-Host "   - HTTP (port 80) from anywhere (0.0.0.0/0)" -ForegroundColor White
Write-Host "   - HTTPS (port 443) from anywhere (0.0.0.0/0)" -ForegroundColor White
Write-Host "   - Custom TCP (port 3000) from anywhere (0.0.0.0/0)" -ForegroundColor White
Write-Host ""

Write-Host "STEP 5: Contact Tourplan" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Send this information to Tourplan support:" -ForegroundColor White
Write-Host ""
Write-Host "Subject: IP Whitelist Update Request - Agent SAMAGT" -ForegroundColor Gray
Write-Host ""
Write-Host "Dear Tourplan Support," -ForegroundColor Gray
Write-Host ""
Write-Host "Please update the IP whitelist for our agent account:" -ForegroundColor Gray
Write-Host ""
Write-Host "Agent ID: SAMAGT" -ForegroundColor Gray
Write-Host "Old IP (if any): 13.210.224.119" -ForegroundColor Gray
Write-Host "New IP: $NEW_IP" -ForegroundColor Gray
Write-Host "Purpose: Tourplan API access for booking engine" -ForegroundColor Gray
Write-Host ""
Write-Host "Please confirm when the whitelist has been updated." -ForegroundColor Gray
Write-Host ""
Write-Host "Thank you," -ForegroundColor Gray
Write-Host "[Your Name]" -ForegroundColor Gray
Write-Host ""

Write-Host "TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "================" -ForegroundColor Red
Write-Host ""
Write-Host "Problem: Can't find your EC2 instance in the dropdown" -ForegroundColor Yellow
Write-Host "Solution: Make sure your EC2 instance is running" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Association fails" -ForegroundColor Yellow
Write-Host "Solution: Check if another IP is already associated with the instance" -ForegroundColor White
Write-Host ""
Write-Host "Problem: SSH connection refused after association" -ForegroundColor Yellow
Write-Host "Solution: Update security group to allow SSH from your IP" -ForegroundColor White
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Green
Write-Host "===========" -ForegroundColor Green
Write-Host "1. Associate the IP with your EC2 instance (above)" -ForegroundColor White
Write-Host "2. Test SSH connection" -ForegroundColor White
Write-Host "3. Update security group if needed" -ForegroundColor White
Write-Host "4. Contact Tourplan with new IP" -ForegroundColor White
Write-Host "5. Wait for Tourplan confirmation" -ForegroundColor White
Write-Host "6. Test Tourplan API connection" -ForegroundColor White
Write-Host "7. Deploy your booking engine" -ForegroundColor White
Write-Host ""

Write-Host "Ready to associate? Go to EC2 Console now!" -ForegroundColor Green
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Addresses:" -ForegroundColor Cyan
