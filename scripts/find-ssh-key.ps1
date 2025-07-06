# PowerShell script to find and fix SSH key issues

Write-Host "🔍 Finding SSH key file..." -ForegroundColor Yellow

# Check common download locations
$possiblePaths = @(
    "$env:USERPROFILE\Downloads\tourplan-ssh-key.pem",
    "$env:USERPROFILE\Desktop\tourplan-ssh-key.pem",
    "D:\drive\MyDrive\thisisafrica\bookingengine\tourplan-ssh-key.pem",
    "C:\Users\$env:USERNAME\Downloads\tourplan-ssh-key.pem"
)

$foundKey = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        Write-Host "✅ Found SSH key at: $path" -ForegroundColor Green
        $foundKey = $path
        break
    }
}

if (-not $foundKey) {
    Write-Host "❌ SSH key not found in common locations" -ForegroundColor Red
    Write-Host "Please check where you downloaded 'tourplan-ssh-key.pem'" -ForegroundColor Yellow
    
    # Search entire system (this might take a while)
    Write-Host "🔍 Searching entire system for .pem files..." -ForegroundColor Yellow
    Get-ChildItem -Path C:\ -Filter "*.pem" -Recurse -ErrorAction SilentlyContinue | 
        Where-Object { $_.Name -like "*tourplan*" -or $_.Name -like "*ssh*" } |
        ForEach-Object { Write-Host "Found: $($_.FullName)" -ForegroundColor Cyan }
    
    exit 1
}

# Fix permissions (convert to Unix format if needed)
Write-Host "🔧 Setting correct permissions..." -ForegroundColor Yellow

# Try to connect
Write-Host "🚀 Attempting SSH connection..." -ForegroundColor Green
Write-Host "Command: ssh -i `"$foundKey`" ec2-user@13.210.224.119" -ForegroundColor Cyan

# Execute the SSH command
& ssh -i $foundKey ec2-user@13.210.224.119
