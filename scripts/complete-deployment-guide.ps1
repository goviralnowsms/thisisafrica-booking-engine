# Complete deployment guide after successful SSH connection

Write-Host "🚀 COMPLETE DEPLOYMENT GUIDE" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$INSTANCE_ID = "i-0ab30f25c4eb53815"

Write-Host "CONGRATULATIONS! 🎉" -ForegroundColor Green
Write-Host "Your SSH connection is working perfectly!" -ForegroundColor Green
Write-Host ""

Write-Host "CURRENT STATUS:" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Yellow
Write-Host "✅ EC2 Instance: $INSTANCE_ID (running)" -ForegroundColor Green
Write-Host "✅ Public IP: $NEW_IP (static Elastic IP)" -ForegroundColor Green
Write-Host "✅ SSH Access: Working with ubuntu user" -ForegroundColor Green
Write-Host "✅ SSH Key: tourplan-ubuntu-key.pem (permissions fixed)" -ForegroundColor Green
Write-Host "✅ Operating System: Ubuntu 22.04.5 LTS" -ForegroundColor Green
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. CONNECT TO YOUR EC2 INSTANCE" -ForegroundColor White
Write-Host "   ssh -i `".\tourplan-ubuntu-key.pem`" ubuntu@$NEW_IP" -ForegroundColor Gray
Write-Host ""

Write-Host "2. VERIFY YOUR PUBLIC IP (should be $NEW_IP)" -ForegroundColor White
Write-Host "   curl https://api.ipify.org" -ForegroundColor Gray
Write-Host ""

Write-Host "3. UPDATE SYSTEM PACKAGES" -ForegroundColor White
Write-Host "   sudo apt update && sudo apt upgrade -y" -ForegroundColor Gray
Write-Host ""

Write-Host "4. INSTALL NODE.JS AND NPM" -ForegroundColor White
Write-Host "   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -" -ForegroundColor Gray
Write-Host "   sudo apt-get install -y nodejs" -ForegroundColor Gray
Write-Host "   node --version && npm --version" -ForegroundColor Gray
Write-Host ""

Write-Host "5. INSTALL GIT" -ForegroundColor White
Write-Host "   sudo apt install git -y" -ForegroundColor Gray
Write-Host ""

Write-Host "6. CLONE YOUR PROJECT" -ForegroundColor White
Write-Host "   git clone https://github.com/your-username/tourplan-booking-engine.git" -ForegroundColor Gray
Write-Host "   cd tourplan-booking-engine" -ForegroundColor Gray
Write-Host ""

Write-Host "7. INSTALL DEPENDENCIES" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""

Write-Host "8. SET UP ENVIRONMENT VARIABLES" -ForegroundColor White
Write-Host "   cp .env.example .env" -ForegroundColor Gray
Write-Host "   nano .env" -ForegroundColor Gray
Write-Host "   # Update with your actual values" -ForegroundColor Gray
Write-Host ""

Write-Host "9. TEST TOURPLAN API CONNECTION" -ForegroundColor White
Write-Host "   npm run test:tourplan" -ForegroundColor Gray
Write-Host "   # Or use the curl command from the previous script" -ForegroundColor Gray
Write-Host ""

Write-Host "10. BUILD AND START THE APPLICATION" -ForegroundColor White
Write-Host "    npm run build" -ForegroundColor Gray
Write-Host "    npm start" -ForegroundColor Gray
Write-Host ""

Write-Host "11. SET UP NGINX (OPTIONAL - FOR PRODUCTION)" -ForegroundColor White
Write-Host "    sudo apt install nginx -y" -ForegroundColor Gray
Write-Host "    sudo systemctl start nginx" -ForegroundColor Gray
Write-Host "    sudo systemctl enable nginx" -ForegroundColor Gray
Write-Host ""

Write-Host "12. SET UP SSL CERTIFICATE (OPTIONAL)" -ForegroundColor White
Write-Host "    sudo apt install certbot python3-certbot-nginx -y" -ForegroundColor Gray
Write-Host "    sudo certbot --nginx -d yourdomain.com" -ForegroundColor Gray
Write-Host ""

Write-Host "IMPORTANT REMINDERS:" -ForegroundColor Red
Write-Host "===================" -ForegroundColor Red
Write-Host ""
Write-Host "🔴 REQUEST TOURPLAN IP WHITELIST" -ForegroundColor Red
Write-Host "   Your new IP ($NEW_IP) needs to be whitelisted by Tourplan" -ForegroundColor White
Write-Host "   Run: .\scripts\generate-tourplan-whitelist-email.ps1" -ForegroundColor White
Write-Host ""
Write-Host "🔴 KEEP ELASTIC IP ASSOCIATED" -ForegroundColor Red
Write-Host "   Don't terminate the EC2 instance or you'll lose the IP" -ForegroundColor White
Write-Host "   The Elastic IP ($NEW_IP) must stay with this instance" -ForegroundColor White
Write-Host ""
Write-Host "🔴 SECURITY GROUP SETTINGS" -ForegroundColor Red
Write-Host "   Make sure your security group allows:" -ForegroundColor White
Write-Host "   - SSH (port 22) from your local IP" -ForegroundColor White
Write-Host "   - HTTP (port 80) from anywhere (0.0.0.0/0)" -ForegroundColor White
Write-Host "   - HTTPS (port 443) from anywhere (0.0.0.0/0)" -ForegroundColor White
Write-Host ""

Write-Host "QUICK REFERENCE COMMANDS:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connect to EC2:" -ForegroundColor White
Write-Host "ssh -i `".\tourplan-ubuntu-key.pem`" ubuntu@$NEW_IP" -ForegroundColor Gray
Write-Host ""
Write-Host "Check public IP:" -ForegroundColor White
Write-Host "curl https://api.ipify.org" -ForegroundColor Gray
Write-Host ""
Write-Host "Generate Tourplan email:" -ForegroundColor White
Write-Host ".\scripts\generate-tourplan-whitelist-email.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "You're all set! 🚀" -ForegroundColor Green
Write-Host "Your EC2 instance is ready for deployment!" -ForegroundColor Green
