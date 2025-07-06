# Test Tourplan API connection from the EC2 instance
# Run this AFTER successfully SSH'ing into your EC2 instance

Write-Host "🔗 Testing Tourplan API Connection from EC2" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$TOURPLAN_API_URL = "https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi"
$AGENT_ID = "SAMAGT"
$PASSWORD = "S@MAgt01"

Write-Host "Connection Details:" -ForegroundColor Yellow
Write-Host "  Your Public IP: $NEW_IP" -ForegroundColor White
Write-Host "  Tourplan API: $TOURPLAN_API_URL" -ForegroundColor White
Write-Host "  Agent ID: $AGENT_ID" -ForegroundColor White
Write-Host ""

Write-Host "STEP 1: SSH into your EC2 instance" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ssh -i `".\tourplan-ubuntu-key.pem`" ubuntu@$NEW_IP" -ForegroundColor White
Write-Host ""

Write-Host "STEP 2: Once connected, verify your public IP" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "curl https://api.ipify.org" -ForegroundColor White
Write-Host "# Should return: $NEW_IP" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: Test Tourplan API connection" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$xmlRequest = @"
<?xml version="1.0"?>
<!DOCTYPE Request SYSTEM "hostConnect_5_05_000.dtd">
<Request>
    <AgentInfoRequest>
        <AgentID>$AGENT_ID</AgentID>
        <Password>$PASSWORD</Password>
        <ReturnAccountInfo>Y</ReturnAccountInfo>
    </AgentInfoRequest>
</Request>
"@

Write-Host "Run this curl command on your EC2 instance:" -ForegroundColor White
Write-Host ""
Write-Host "curl -X POST \\" -ForegroundColor White
Write-Host "  -H `"Content-Type: application/xml`" \\" -ForegroundColor White
Write-Host "  -H `"Accept: application/xml`" \\" -ForegroundColor White
Write-Host "  -H `"User-Agent: Tourplan-Booking-Engine/1.0`" \\" -ForegroundColor White
Write-Host "  -d '$($xmlRequest -replace "`n", "")' \\" -ForegroundColor White
Write-Host "  `"$TOURPLAN_API_URL`"" -ForegroundColor White
Write-Host ""

Write-Host "EXPECTED RESULTS:" -ForegroundColor Yellow
Write-Host "=================" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ SUCCESS: XML response with <AgentInfoReply>" -ForegroundColor Green
Write-Host "❌ IP NOT WHITELISTED: Error about IP access or whitelist" -ForegroundColor Red
Write-Host "❌ AUTH FAILED: Invalid agent credentials" -ForegroundColor Red
Write-Host ""

Write-Host "STEP 4: If IP not whitelisted, generate email" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host ".\scripts\generate-tourplan-whitelist-email.ps1" -ForegroundColor White
Write-Host ""

Write-Host "STEP 5: Deploy your booking engine" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "# On your EC2 instance:" -ForegroundColor Gray
Write-Host "git clone https://github.com/your-repo/tourplan-booking-engine.git" -ForegroundColor White
Write-Host "cd tourplan-booking-engine" -ForegroundColor White
Write-Host "npm install" -ForegroundColor White
Write-Host "npm run build" -ForegroundColor White
Write-Host "npm start" -ForegroundColor White
Write-Host ""

Write-Host "Your EC2 instance is ready! 🎉" -ForegroundColor Green
