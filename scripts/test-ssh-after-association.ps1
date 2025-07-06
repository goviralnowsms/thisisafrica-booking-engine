# Test SSH connection after Elastic IP association

Write-Host "=== TEST SSH CONNECTION AFTER IP ASSOCIATION ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$OLD_IP = "52.62.181.111"
$LOCAL_IP = "110.175.119.93"

Write-Host "ISSUE DETECTED:" -ForegroundColor Red
Write-Host "===============" -ForegroundColor Red
Write-Host ""
Write-Host "You tried to SSH to: $OLD_IP" -ForegroundColor Red
Write-Host "But you should SSH to: $NEW_IP" -ForegroundColor Green
Write-Host ""

Write-Host "SSH KEY ISSUE:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host ""
Write-Host "Error: Identity file C:\Users\Tess/.ssh/tourplan-ubuntu-key.pem not accessible" -ForegroundColor Red
Write-Host ""
Write-Host "The SSH key is not in the expected location." -ForegroundColor White
Write-Host "Let's find where your key actually is:" -ForegroundColor White
Write-Host ""

Write-Host "POSSIBLE KEY LOCATIONS:" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Project directory: .\tourplan-ubuntu-key.pem" -ForegroundColor White
Write-Host "2. Downloads folder: $env:USERPROFILE\Downloads\tourplan-ubuntu-key.pem" -ForegroundColor White
Write-Host "3. Desktop: $env:USERPROFILE\Desktop\tourplan-ubuntu-key.pem" -ForegroundColor White
Write-Host ""

Write-Host "CHECKING FOR KEY FILES..." -ForegroundColor Yellow

$keyLocations = @(
    ".\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Downloads\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Desktop\tourplan-ubuntu-key.pem",
    "C:\Users\Tess\tourplan-ubuntu-key.pem"
)

$foundKey = $null
foreach ($location in $keyLocations) {
    if (Test-Path $location) {
        Write-Host "✓ Found key at: $location" -ForegroundColor Green
        $foundKey = $location
        break
    } else {
        Write-Host "✗ Not found: $location" -ForegroundColor Gray
    }
}

Write-Host ""

if ($foundKey) {
    Write-Host "CORRECT SSH COMMANDS:" -ForegroundColor Green
    Write-Host "====================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Using found key at: $foundKey" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "OLD IP (don't use): ssh -i `"$foundKey`" ubuntu@$OLD_IP" -ForegroundColor Red
    Write-Host "NEW IP (use this):  ssh -i `"$foundKey`" ubuntu@$NEW_IP" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "STEP-BY-STEP:" -ForegroundColor Cyan
    Write-Host "=============" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. First, verify your instance's public IP changed to $NEW_IP in AWS Console" -ForegroundColor White
    Write-Host "2. Then try this SSH command:" -ForegroundColor White
    Write-Host ""
    Write-Host "   ssh -i `"$foundKey`" ubuntu@$NEW_IP" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. When prompted 'Are you sure you want to continue connecting?'" -ForegroundColor White
    Write-Host "   Type: yes" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host "KEY NOT FOUND!" -ForegroundColor Red
    Write-Host "==============" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please locate your tourplan-ubuntu-key.pem file and run:" -ForegroundColor White
    Write-Host ".\scripts\copy-key-file.ps1" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "EXPECTED RESULTS AFTER USING CORRECT IP:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ SUCCESS: Connection established, you see Ubuntu prompt" -ForegroundColor Green
Write-Host "  → IP association worked perfectly" -ForegroundColor White
Write-Host "  → Security group allows SSH from your IP" -ForegroundColor White
Write-Host "  → Ready to proceed with Tourplan setup" -ForegroundColor White
Write-Host ""
Write-Host "✗ FAILURE: Connection refused" -ForegroundColor Red
Write-Host "  → Security group doesn't allow SSH from $LOCAL_IP" -ForegroundColor White
Write-Host "  → Need to update security group rules" -ForegroundColor White
Write-Host ""

Write-Host "ONCE SSH WORKS, TEST PUBLIC IP:" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "After connecting via SSH, run this command on the server:" -ForegroundColor White
Write-Host ""
Write-Host "curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected output: $NEW_IP" -ForegroundColor Green
Write-Host ""
Write-Host "This confirms your instance's outbound traffic uses the Elastic IP." -ForegroundColor White
Write-Host "When your booking engine calls Tourplan API, they'll see: $NEW_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "Try the corrected SSH command now!" -ForegroundColor Green
