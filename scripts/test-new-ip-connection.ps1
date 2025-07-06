# Test the new Elastic IP connection and setup
# IP: 13.211.226.114

Write-Host "=== TESTING NEW ELASTIC IP CONNECTION ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$LOCAL_IP = "110.175.119.93"

Write-Host "Testing IP: $NEW_IP" -ForegroundColor Yellow
Write-Host "Your Local IP: $LOCAL_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "TEST 1: SSH Connection" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try to connect to your EC2 instance:" -ForegroundColor White
Write-Host ""
Write-Host "ssh -i ~/.ssh/your-key.pem ubuntu@$NEW_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected results:" -ForegroundColor White
Write-Host "✓ Connection successful = IP is properly associated" -ForegroundColor Green
Write-Host "✗ Connection refused = Security group issue" -ForegroundColor Red
Write-Host "✗ Timeout = Wrong IP or instance not running" -ForegroundColor Red
Write-Host ""

Write-Host "TEST 2: Check Public IP from EC2" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once connected via SSH, run this on your EC2 instance:" -ForegroundColor White
Write-Host ""
Write-Host "curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected result: $NEW_IP" -ForegroundColor Green
Write-Host ""

Write-Host "TEST 3: Test Internet Connectivity" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "From your EC2 instance:" -ForegroundColor White
Write-Host ""
Write-Host "# Test basic connectivity" -ForegroundColor Gray
Write-Host "curl -I https://google.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Test Tourplan server connectivity" -ForegroundColor Gray
Write-Host "curl -I https://pa-thisis.nx.tourplan.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected: Both should return HTTP 200 or similar" -ForegroundColor Green
Write-Host ""

Write-Host "TEST 4: Security Group Check" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If SSH fails, check your security group:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to EC2 > Security Groups" -ForegroundColor Gray
Write-Host "2. Find your instance's security group" -ForegroundColor Gray
Write-Host "3. Check Inbound Rules should include:" -ForegroundColor Gray
Write-Host ""
Write-Host "   Type        Protocol    Port    Source" -ForegroundColor White
Write-Host "   SSH         TCP         22      $LOCAL_IP/32" -ForegroundColor Gray
Write-Host "   HTTP        TCP         80      0.0.0.0/0" -ForegroundColor Gray
Write-Host "   HTTPS       TCP         443     0.0.0.0/0" -ForegroundColor Gray
Write-Host "   Custom TCP  TCP         3000    0.0.0.0/0" -ForegroundColor Gray
Write-Host ""

Write-Host "TEST 5: Tourplan API Test (After Whitelist)" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ONLY run this AFTER Tourplan confirms IP whitelist update:" -ForegroundColor Red
Write-Host ""
Write-Host "From your EC2 instance:" -ForegroundColor White
Write-Host ""
Write-Host 'curl -X POST https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi \' -ForegroundColor Yellow
Write-Host "  -H 'Content-Type: application/xml' \\" -ForegroundColor Yellow
Write-Host "  -d '<?xml version=\"1.0\"?><!DOCTYPE Request SYSTEM \"hostConnect_5_05_000.dtd\"><Request><AgentInfoRequest><AgentID>SAMAGT</AgentID><Password>S@MAgt01</Password></AgentInfoRequest></Request>'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected: XML response with agent info (success)" -ForegroundColor Green
Write-Host "Error: IP whitelist error (need to wait for Tourplan)" -ForegroundColor Red
Write-Host ""

Write-Host "COMMON ISSUES AND SOLUTIONS:" -ForegroundColor Red
Write-Host "============================" -ForegroundColor Red
Write-Host ""
Write-Host "Issue: SSH connection refused" -ForegroundColor Yellow
Write-Host "Fix: Add your IP ($LOCAL_IP/32) to security group SSH rule" -ForegroundColor White
Write-Host ""
Write-Host "Issue: curl https://api.ipify.org returns wrong IP" -ForegroundColor Yellow
Write-Host "Fix: Elastic IP not properly associated, re-associate in EC2 console" -ForegroundColor White
Write-Host ""
Write-Host "Issue: Can't reach internet from EC2" -ForegroundColor Yellow
Write-Host "Fix: Check route table has internet gateway route (0.0.0.0/0)" -ForegroundColor White
Write-Host ""
Write-Host "Issue: Tourplan API returns IP error" -ForegroundColor Yellow
Write-Host "Fix: Wait for Tourplan to confirm whitelist update" -ForegroundColor White
Write-Host ""

Write-Host "SUCCESS CHECKLIST:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "□ SSH connection works with new IP" -ForegroundColor White
Write-Host "□ curl https://api.ipify.org returns $NEW_IP" -ForegroundColor White
Write-Host "□ Internet connectivity works from EC2" -ForegroundColor White
Write-Host "□ Tourplan server is reachable" -ForegroundColor White
Write-Host "□ Tourplan confirmed IP whitelist update" -ForegroundColor White
Write-Host "□ Tourplan API calls work without errors" -ForegroundColor White
Write-Host ""

Write-Host "When all tests pass, you're ready to deploy your booking engine!" -ForegroundColor Green
