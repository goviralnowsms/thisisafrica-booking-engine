# Test new Elastic IP setup for Tourplan API access
# This script helps verify that your new IP is working correctly

Write-Host "=== TESTING NEW ELASTIC IP SETUP ===" -ForegroundColor Green
Write-Host ""

Write-Host "This script helps you test your new Elastic IP configuration" -ForegroundColor White
Write-Host ""

Write-Host "PREREQUISITES:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host "✓ You have allocated a new Elastic IP" -ForegroundColor White
Write-Host "✓ You have associated it with your EC2 instance" -ForegroundColor White
Write-Host "✓ You have contacted Tourplan to whitelist the new IP" -ForegroundColor White
Write-Host "✓ Tourplan has confirmed the IP is whitelisted" -ForegroundColor White
Write-Host ""

Write-Host "STEP 1: Verify EC2 Instance IP" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to EC2 Console:" -ForegroundColor White
Write-Host "   https://console.aws.amazon.com/ec2/home?region=ap-southeast-2#Instances:" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Find your EC2 instance" -ForegroundColor White
Write-Host ""
Write-Host "3. Check the 'Public IPv4 address' column" -ForegroundColor White
Write-Host "   - This should show your new Elastic IP" -ForegroundColor Gray
Write-Host "   - If it shows a different IP, the association failed" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: Test SSH Connection" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test SSH to your EC2 instance using the new IP:" -ForegroundColor White
Write-Host ""
Write-Host "ssh -i ~/.ssh/your-key.pem ubuntu@[NEW_ELASTIC_IP]" -ForegroundColor Gray
Write-Host ""
Write-Host "Replace [NEW_ELASTIC_IP] with your actual IP address" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 3: Test Internet Connectivity from EC2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once connected to your EC2 instance via SSH:" -ForegroundColor White
Write-Host ""
Write-Host "# Check your public IP (should match your Elastic IP)" -ForegroundColor Gray
Write-Host "curl https://api.ipify.org" -ForegroundColor Gray
Write-Host ""
Write-Host "# Test basic internet connectivity" -ForegroundColor Gray
Write-Host "curl -I https://google.com" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Test Tourplan API Connection" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "From your EC2 instance, test the Tourplan API:" -ForegroundColor White
Write-Host ""
Write-Host "# Test basic connectivity to Tourplan" -ForegroundColor Gray
Write-Host "curl -I https://pa-thisis.nx.tourplan.net" -ForegroundColor Gray
Write-Host ""
Write-Host "# Test your booking engine API (if deployed)" -ForegroundColor Gray
Write-Host "curl http://localhost:3000/api/check-ip-status" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 5: Deploy and Test Booking Engine" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If the IP tests pass, deploy your booking engine:" -ForegroundColor White
Write-Host ""
Write-Host "# Clone your repository (if not already done)" -ForegroundColor Gray
Write-Host "git clone https://github.com/your-username/tourplan-booking-engine.git" -ForegroundColor Gray
Write-Host "cd tourplan-booking-engine" -ForegroundColor Gray
Write-Host ""
Write-Host "# Install dependencies" -ForegroundColor Gray
Write-Host "npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "# Set up environment variables" -ForegroundColor Gray
Write-Host "cp .env.example .env.local" -ForegroundColor Gray
Write-Host "nano .env.local  # Edit with your configuration" -ForegroundColor Gray
Write-Host ""
Write-Host "# Start the application" -ForegroundColor Gray
Write-Host "npm run dev" -ForegroundColor Gray
Write-Host ""

Write-Host "TROUBLESHOOTING:" -ForegroundColor Red
Write-Host "===============" -ForegroundColor Red
Write-Host ""
Write-Host "Problem: SSH connection refused" -ForegroundColor Yellow
Write-Host "Solution: Check security group allows SSH from your IP" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Wrong IP returned by curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host "Solution: Elastic IP association failed, re-associate in EC2 console" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Tourplan API returns IP whitelist error" -ForegroundColor Yellow
Write-Host "Solution: Contact Tourplan again with the correct IP address" -ForegroundColor White
Write-Host ""
Write-Host "Problem: Can't connect to Tourplan at all" -ForegroundColor Yellow
Write-Host "Solution: Check security group allows outbound HTTPS (port 443)" -ForegroundColor White
Write-Host ""

Write-Host "SUCCESS INDICATORS:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "✓ SSH works with new IP" -ForegroundColor White
Write-Host "✓ curl https://api.ipify.org returns your Elastic IP" -ForegroundColor White
Write-Host "✓ curl -I https://pa-thisis.nx.tourplan.net returns 200 OK" -ForegroundColor White
Write-Host "✓ Tourplan API calls work without IP whitelist errors" -ForegroundColor White
Write-Host "✓ Your booking engine can search for tours" -ForegroundColor White
Write-Host ""

Write-Host "NEXT STEPS AFTER SUCCESS:" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "1. Configure your domain name to point to the new IP" -ForegroundColor White
Write-Host "2. Set up SSL certificate" -ForegroundColor White
Write-Host "3. Configure production environment variables" -ForegroundColor White
Write-Host "4. Set up monitoring and logging" -ForegroundColor White
Write-Host "5. Test the complete booking flow" -ForegroundColor White
Write-Host ""

Write-Host "Ready to test? Start with SSH connection!" -ForegroundColor Green
