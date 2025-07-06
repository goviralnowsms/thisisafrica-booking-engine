# Fix SSH key permissions on Windows

Write-Host "=== FIXING SSH KEY PERMISSIONS ON WINDOWS ===" -ForegroundColor Green
Write-Host ""

$keyPath = ".\tourplan-ubuntu-key.pem"
$fullPath = (Resolve-Path $keyPath).Path

Write-Host "SSH Key Location: $fullPath" -ForegroundColor Yellow
Write-Host ""

if (Test-Path $keyPath) {
    Write-Host "SSH key found" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "FIXING PERMISSIONS..." -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Remove inheritance
        Write-Host "1. Removing inheritance..." -ForegroundColor Yellow
        icacls $fullPath /inheritance:r
        
        # Remove all users except current user
        Write-Host "2. Removing NT AUTHORITY\Authenticated Users..." -ForegroundColor Yellow
        icacls $fullPath /remove "NT AUTHORITY\Authenticated Users"
        
        Write-Host "3. Removing BUILTIN\Users..." -ForegroundColor Yellow
        icacls $fullPath /remove "BUILTIN\Users"
        
        Write-Host "4. Removing Everyone..." -ForegroundColor Yellow
        icacls $fullPath /remove "Everyone"
        
        # Grant read permission to current user only
        Write-Host "5. Granting read permission to current user..." -ForegroundColor Yellow
        icacls $fullPath /grant:r "$env:USERNAME:(R)"
        
        Write-Host ""
        Write-Host "PERMISSIONS FIXED SUCCESSFULLY!" -ForegroundColor Green
        Write-Host ""
        
        Write-Host "CURRENT PERMISSIONS:" -ForegroundColor Cyan
        Write-Host "===================" -ForegroundColor Cyan
        icacls $fullPath
        Write-Host ""
        
        Write-Host "NOW TRY SSH CONNECTION:" -ForegroundColor Green
        Write-Host "=======================" -ForegroundColor Green
        Write-Host ""
        Write-Host "ssh -i `"$keyPath`" ubuntu@13.211.226.114" -ForegroundColor Yellow
        Write-Host ""
        
        Write-Host "EXPECTED RESULT:" -ForegroundColor Cyan
        Write-Host "===============" -ForegroundColor Cyan
        Write-Host "No permission warnings" -ForegroundColor Green
        Write-Host "Ubuntu welcome message" -ForegroundColor Green
        Write-Host "Command prompt: ubuntu@ip-172-31-1-109:~$" -ForegroundColor Green
        Write-Host ""
        
    } catch {
        Write-Host "Error fixing permissions: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "MANUAL FIX:" -ForegroundColor Yellow
        Write-Host "===========" -ForegroundColor Yellow
        Write-Host "1. Right-click on tourplan-ubuntu-key.pem" -ForegroundColor White
        Write-Host "2. Properties > Security tab" -ForegroundColor White
        Write-Host "3. Advanced > Disable inheritance" -ForegroundColor White
        Write-Host "4. Remove all users except your username" -ForegroundColor White
        Write-Host "5. Give your user Read permission only" -ForegroundColor White
        Write-Host ""
    }
    
} else {
    Write-Host "SSH key not found at: $keyPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure the key file is in the correct location." -ForegroundColor White
}

Write-Host "AFTER FIXING PERMISSIONS:" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Test SSH connection:" -ForegroundColor White
Write-Host "   ssh -i `"$keyPath`" ubuntu@13.211.226.114" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Once connected, verify public IP:" -ForegroundColor White
Write-Host "   curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Expected result: 13.211.226.114" -ForegroundColor Green
Write-Host ""
Write-Host "4. Generate Tourplan email:" -ForegroundColor White
Write-Host "   .\scripts\generate-tourplan-whitelist-email.ps1" -ForegroundColor Yellow
Write-Host ""
