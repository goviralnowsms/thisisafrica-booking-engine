# PowerShell script to connect to EC2 via SSH
# Set the correct path to your SSH key
$keyPath = "D:\drive\My Drive\thisisafrica\bookingengine\tourplan-ssh-key.pem"
$ec2Host = "ec2-user@13.210.224.119"

Write-Host "🔑 Checking SSH key file..." -ForegroundColor Yellow
if (Test-Path $keyPath) {
    Write-Host "✅ SSH key found at: $keyPath" -ForegroundColor Green
    
    # Fix permissions on Windows (SSH requires restrictive permissions)
    Write-Host "🔒 Setting correct permissions..." -ForegroundColor Yellow
    icacls $keyPath /inheritance:r
    icacls $keyPath /grant:r "$env:USERNAME:(R)"
    
    Write-Host "🚀 Connecting to EC2..." -ForegroundColor Green
    ssh -i "$keyPath" $ec2Host
} else {
    Write-Host "❌ SSH key not found at: $keyPath" -ForegroundColor Red
    Write-Host "Please check the file path and try again." -ForegroundColor Red
}
