# Set up security group rules for the new Elastic IP setup

Write-Host "=== SECURITY GROUP SETUP FOR NEW IP ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$LOCAL_IP = "110.175.119.93"

Write-Host "New Elastic IP: $NEW_IP" -ForegroundColor Yellow
Write-Host "Your Local IP: $LOCAL_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "SECURITY GROUP CONFIGURATION NEEDED:" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your EC2 instance needs these inbound rules:" -ForegroundColor White
Write-Host ""

Write-Host "1. SSH Access (Port 22)" -ForegroundColor Yellow
Write-Host "   Type: SSH" -ForegroundColor Gray
Write-Host "   Protocol: TCP" -ForegroundColor Gray
Write-Host "   Port: 22" -ForegroundColor Gray
Write-Host "   Source: $LOCAL_IP/32 (your local IP only)" -ForegroundColor Gray
Write-Host "   Description: SSH access from local machine" -ForegroundColor Gray
Write-Host ""

Write-Host "2. HTTP Access (Port 80)" -ForegroundColor Yellow
Write-Host "   Type: HTTP" -ForegroundColor Gray
Write-Host "   Protocol: TCP" -ForegroundColor Gray
Write-Host "   Port: 80" -ForegroundColor Gray
Write-Host "   Source: 0.0.0.0/0 (anywhere)" -ForegroundColor Gray
Write-Host "   Description: Web traffic" -ForegroundColor Gray
Write-Host ""

Write-Host "3. HTTPS Access (Port 443)" -ForegroundColor Yellow
Write-Host "   Type: HTTPS" -ForegroundColor Gray
Write-Host "   Protocol: TCP" -ForegroundColor Gray
Write-Host "   Port: 443" -ForegroundColor Gray
Write-Host "   Source: 0.0.0.0/0 (anywhere)" -ForegroundColor Gray
Write-Host "   Description: Secure web traffic" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Application Access (Port 3000)" -ForegroundColor Yellow
Write-Host "   Type: Custom TCP" -ForegroundColor Gray
Write-Host "   Protocol: TCP" -ForegroundColor Gray
Write-Host "   Port: 3000" -ForegroundColor Gray
Write-Host "   Source: 0.0.0.0/0 (anywhere)" -ForegroundColor Gray
Write-Host "   Description: Next.js application" -ForegroundColor Gray
Write-Host ""

Write-Host "MANUAL SETUP STEPS:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to EC2 Console > Security Groups" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#SecurityGroups:" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Find your EC2 instance's security group" -ForegroundColor White
Write-Host "   (Go to EC2 > Instances, click your instance, note the Security Group)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Click on the Security Group ID" -ForegroundColor White
Write-Host ""
Write-Host "4. Click 'Inbound rules' tab" -ForegroundColor White
Write-Host ""
Write-Host "5. Click 'Edit inbound rules'" -ForegroundColor White
Write-Host ""
Write-Host "6. Add the rules listed above" -ForegroundColor White
Write-Host ""
Write-Host "7. Click 'Save rules'" -ForegroundColor White
Write-Host ""

Write-Host "VERIFICATION:" -ForegroundColor Green
Write-Host "=============" -ForegroundColor Green
Write-Host ""
Write-Host "After setting up security group rules:" -ForegroundColor White
Write-Host ""
Write-Host "Test SSH:" -ForegroundColor Yellow
Write-Host "ssh -i ~/.ssh/your-key.pem ubuntu@$NEW_IP" -ForegroundColor Gray
Write-Host ""
Write-Host "Test web access (after deploying app):" -ForegroundColor Yellow
Write-Host "http://$NEW_IP:3000" -ForegroundColor Gray
Write-Host ""

Write-Host "SECURITY BEST PRACTICES:" -ForegroundColor Red
Write-Host "========================" -ForegroundColor Red
Write-Host ""
Write-Host "✓ SSH restricted to your IP only ($LOCAL_IP/32)" -ForegroundColor Green
Write-Host "✓ Web ports open to everyone (needed for users)" -ForegroundColor Green
Write-Host "✗ Don't open SSH to 0.0.0.0/0 (security risk)" -ForegroundColor Red
Write-Host "✗ Don't open random ports unnecessarily" -ForegroundColor Red
Write-Host ""

Write-Host "TROUBLESHOOTING:" -ForegroundColor Yellow
Write-Host "================" -ForegroundColor Yellow
Write-Host ""
Write-Host "If SSH still fails after adding rules:" -ForegroundColor White
Write-Host "- Wait 1-2 minutes for rules to take effect" -ForegroundColor Gray
Write-Host "- Check your local IP hasn't changed" -ForegroundColor Gray
Write-Host "- Verify the security group is attached to your instance" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to configure? Go to Security Groups now!" -ForegroundColor Green
Write-Host "https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#SecurityGroups:" -ForegroundColor Cyan
