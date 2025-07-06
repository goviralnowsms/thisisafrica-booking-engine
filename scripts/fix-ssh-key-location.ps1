# Find and fix SSH key location issues

Write-Host "=== FIND SSH KEY LOCATION ===" -ForegroundColor Green
Write-Host ""

Write-Host "SEARCHING FOR SSH KEY FILES..." -ForegroundColor Yellow
Write-Host ""

$possibleLocations = @(
    ".\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Downloads\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Desktop\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Documents\tourplan-ubuntu-key.pem",
    "C:\Users\Tess\tourplan-ubuntu-key.pem",
    ".\scripts\tourplan-ubuntu-key.pem"
)

$foundKeys = @()

foreach ($location in $possibleLocations) {
    if (Test-Path $location) {
        Write-Host "✓ Found key at: $location" -ForegroundColor Green
        $foundKeys += $location
    } else {
        Write-Host "✗ Not found: $location" -ForegroundColor Gray
    }
}

Write-Host ""

if ($foundKeys.Count -gt 0) {
    Write-Host "SSH KEY FOUND!" -ForegroundColor Green
    Write-Host "==============" -ForegroundColor Green
    Write-Host ""
    
    $keyPath = $foundKeys[0]
    Write-Host "Using key: $keyPath" -ForegroundColor Yellow
    Write-Host ""
    
    # Check key permissions
    Write-Host "CHECKING KEY PERMISSIONS..." -ForegroundColor Cyan
    $acl = Get-Acl $keyPath
    Write-Host "Current permissions:" -ForegroundColor White
    $acl.Access | ForEach-Object {
        Write-Host "  $($_.IdentityReference): $($_.FileSystemRights)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "FIXING KEY PERMISSIONS..." -ForegroundColor Yellow
    
    # Remove inheritance and set proper permissions
    $acl.SetAccessRuleProtection($true, $false)
    $acl.Access | ForEach-Object { $acl.RemoveAccessRule($_) }
    
    # Add current user with full control
    $currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($currentUser, "FullControl", "Allow")
    $acl.SetAccessRule($accessRule)
    
    Set-Acl -Path $keyPath -AclObject $acl
    
    Write-Host "✓ Key permissions fixed" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "SSH COMMAND TEMPLATE:" -ForegroundColor Cyan
    Write-Host "====================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "ssh -i `"$keyPath`" ubuntu@YOUR_INSTANCE_IP" -ForegroundColor Yellow
    Write-Host ""
    
    # Save key path for other scripts
    $keyPath | Out-File "ssh-key-path.txt" -Encoding UTF8
    Write-Host "Key path saved to: ssh-key-path.txt" -ForegroundColor Green
    
} else {
    Write-Host "NO SSH KEY FOUND!" -ForegroundColor Red
    Write-Host "=================" -ForegroundColor Red
    Write-Host ""
    Write-Host "You need to download or create a new SSH key:" -ForegroundColor White
    Write-Host ""
    Write-Host "1. Go to EC2 > Key Pairs" -ForegroundColor Gray
    Write-Host "2. Create a new key pair or download existing one" -ForegroundColor Gray
    Write-Host "3. Save it to your Downloads folder" -ForegroundColor Gray
    Write-Host "4. Run this script again" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "NEXT STEPS:" -ForegroundColor Green
Write-Host "===========" -ForegroundColor Green
Write-Host ""
Write-Host "1. Find your remaining EC2 instance" -ForegroundColor White
Write-Host "2. Associate Elastic IP 13.211.226.114 with it" -ForegroundColor White
Write-Host "3. Test SSH connection" -ForegroundColor White
Write-Host "4. Contact Tourplan for IP whitelist" -ForegroundColor White
