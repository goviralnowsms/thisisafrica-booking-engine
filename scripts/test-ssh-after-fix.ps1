# Test SSH connection after fixing permissions

Write-Host "=== TEST SSH AFTER PERMISSION FIX ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$keyPath = ".\tourplan-ubuntu-key.pem"

Write-Host "Testing SSH connection to: $NEW_IP" -ForegroundColor Yellow
Write-Host "Using key: $keyPath" -ForegroundColor Yellow
Write-Host ""

if (Test-Path $keyPath) {
    Write-Host "SSH key found" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "SSH COMMAND:" -ForegroundColor Cyan
    Write-Host "============" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ssh -i `"$keyPath`" ubuntu@$NEW_IP" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "WHAT TO EXPECT:" -ForegroundColor Cyan
    Write-Host "===============" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "SUCCESS INDICATORS:" -ForegroundColor Green
    Write-Host "  • No permission warnings" -ForegroundColor White
    Write-Host "  • Ubuntu welcome message" -ForegroundColor White
    Write-Host "  • Command prompt: ubuntu@ip-172-31-1-109:~$" -ForegroundColor White
    Write-Host ""
    Write-Host "FAILURE INDICATORS:" -ForegroundColor Red
    Write-Host "  • bad permissions error" -ForegroundColor White
    Write-Host "  • Permission denied publickey" -ForegroundColor White
    Write-Host "  • Connection timeout" -ForegroundColor White
    Write-Host ""
    
    Write-Host "ONCE SSH WORKS:" -ForegroundColor Cyan
    Write-Host "===============" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Verify your public IP from inside the instance:" -ForegroundColor White
    Write-Host "   curl https://api.ipify.org" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Expected result: $NEW_IP" -ForegroundColor Green
    Write-Host ""
    Write-Host "3. This confirms Tourplan will see API calls from: $NEW_IP" -ForegroundColor White
    Write-Host ""
    
    Write-Host "TROUBLESHOOTING:" -ForegroundColor Red
    Write-Host "================" -ForegroundColor Red
    Write-Host ""
    Write-Host "If still getting permission errors:" -ForegroundColor White
    Write-Host "• Run: .\scripts\fix-ssh-key-permissions.ps1 again" -ForegroundColor Yellow
    Write-Host "• Or fix manually via file Properties > Security" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If connection refused:" -ForegroundColor White
    Write-Host "• Check EC2 > Security Groups > Inbound rules" -ForegroundColor Yellow
    Write-Host "• Ensure SSH port 22 allows your IP" -ForegroundColor Yellow
    Write-Host ""
    
} else {
    Write-Host "SSH key not found at: $keyPath" -ForegroundColor Red
}

Write-Host "Try the SSH connection now!" -ForegroundColor Green
