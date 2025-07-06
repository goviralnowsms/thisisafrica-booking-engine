# PowerShell script to fix SSH key permissions on Windows

param(
    [string]$KeyPath = "C:\Users\Tess\tourplan-ubuntu-key.pem"
)

Write-Host "🔧 Fixing SSH Key Permissions on Windows" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

if (-not (Test-Path $KeyPath)) {
    Write-Host "❌ Key file not found: $KeyPath" -ForegroundColor Red
    exit 1
}

Write-Host "Key file: $KeyPath" -ForegroundColor Yellow

try {
    Write-Host "Removing inheritance..." -ForegroundColor Cyan
    icacls $KeyPath /inheritance:r

    Write-Host "Removing all users except owner..." -ForegroundColor Cyan
    icacls $KeyPath /remove "NT AUTHORITY\Authenticated Users"
    icacls $KeyPath /remove "BUILTIN\Users"
    icacls $KeyPath /remove "Everyone"
    icacls $KeyPath /remove "BUILTIN\Administrators"

    Write-Host "Granting read access to current user..." -ForegroundColor Cyan
    icacls $KeyPath /grant:r "$env:USERNAME:(R)"

    Write-Host "✅ Permissions fixed successfully!" -ForegroundColor Green
    
    Write-Host "Current permissions:" -ForegroundColor Cyan
    icacls $KeyPath
    
} catch {
    Write-Host "❌ Error fixing permissions: $_" -ForegroundColor Red
    Write-Host "Try running PowerShell as Administrator" -ForegroundColor Yellow
}
