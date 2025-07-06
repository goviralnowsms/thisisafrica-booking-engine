# Complete setup checklist for Tourplan booking engine

Write-Host "=== COMPLETE SETUP CHECKLIST ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$INSTANCE_ID = "i-0ab30f25c4eb53815"

Write-Host "CURRENT STATUS: ELASTIC IP ASSOCIATED ✓" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Elastic IP $NEW_IP allocated" -ForegroundColor Green
Write-Host "✓ Associated with instance $INSTANCE_ID" -ForegroundColor Green
Write-Host "✓ AWS Console shows successful association" -ForegroundColor Green
Write-Host ""

Write-Host "REMAINING TASKS:" -ForegroundColor Yellow
Write-Host "================" -ForegroundColor Yellow
Write-Host ""

Write-Host "□ 1. TEST SSH CONNECTION" -ForegroundColor White
Write-Host "   Command: ssh -i tourplan-ubuntu-key.pem ubuntu@$NEW_IP" -ForegroundColor Gray
Write-Host "   Purpose: Verify instance is accessible" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 2. VERIFY PUBLIC IP" -ForegroundColor White
Write-Host "   Command: curl https://api.ipify.org (from inside instance)" -ForegroundColor Gray
Write-Host "   Expected: $NEW_IP" -ForegroundColor Gray
Write-Host "   Purpose: Confirm outbound traffic uses Elastic IP" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 3. TEST CONNECTIVITY" -ForegroundColor White
Write-Host "   Commands: curl https://google.com, curl https://pa-thisis.nx.tourplan.net" -ForegroundColor Gray
Write-Host "   Purpose: Verify internet and Tourplan server access" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 4. SEND TOURPLAN WHITELIST REQUEST" -ForegroundColor White
Write-Host "   Email: support@tourplan.com" -ForegroundColor Gray
Write-Host "   Content: Request to whitelist $NEW_IP for agent SAMAGT" -ForegroundColor Gray
Write-Host "   Purpose: Enable API access" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 5. WAIT FOR TOURPLAN CONFIRMATION" -ForegroundColor White
Write-Host "   Timeline: 1-2 business days" -ForegroundColor Gray
Write-Host "   Purpose: IP gets added to whitelist" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 6. TEST TOURPLAN API" -ForegroundColor White
Write-Host "   Command: AgentInfoRequest API call" -ForegroundColor Gray
Write-Host "   Purpose: Verify API access works" -ForegroundColor Gray
Write-Host ""

Write-Host "□ 7. DEPLOY BOOKING ENGINE" -ForegroundColor White
Write-Host "   Action: Upload and configure your Next.js application" -ForegroundColor Gray
Write-Host "   Purpose: Make booking engine live" -ForegroundColor Gray
Write-Host ""

Write-Host "SCRIPTS TO RUN:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Test SSH and verify setup:" -ForegroundColor White
Write-Host "   .\scripts\test-ssh-with-new-ip.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Run verification checklist:" -ForegroundColor White
Write-Host "   .\scripts\verify-public-ip-setup.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Generate Tourplan email:" -ForegroundColor White
Write-Host "   .\scripts\generate-tourplan-whitelist-email.ps1" -ForegroundColor Yellow
Write-Host ""

Write-Host "SUCCESS CRITERIA:" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ SSH works to $NEW_IP" -ForegroundColor White
Write-Host "✓ curl https://api.ipify.org returns $NEW_IP" -ForegroundColor White
Write-Host "✓ Internet connectivity confirmed" -ForegroundColor White
Write-Host "✓ Tourplan server reachable" -ForegroundColor White
Write-Host "✓ Email sent to Tourplan" -ForegroundColor White
Write-Host "✓ Tourplan confirms IP whitelisted" -ForegroundColor White
Write-Host "✓ API test calls work" -ForegroundColor White
Write-Host "✓ Booking engine deployed and functional" -ForegroundColor White
Write-Host ""

Write-Host "COST SUMMARY:" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monthly costs:" -ForegroundColor White
Write-Host "• 1 EC2 t3.micro instance: ~$8.50" -ForegroundColor Gray
Write-Host "• 1 Elastic IP (associated): $0.00" -ForegroundColor Gray
Write-Host "• Data transfer: minimal" -ForegroundColor Gray
Write-Host "• Total: ~$8.50/month" -ForegroundColor Green
Write-Host ""

Write-Host "You're almost done! Start with the SSH test." -ForegroundColor Green
