# PowerShell script to fix SSH key permissions and connect to EC2

Write-Host "🔧 Fixing SSH Key Permissions..." -ForegroundColor Green

# Set the path to the SSH key
$keyPath = "$env:USERPROFILE\Downloads\tourplan-ssh-key.pem"

# Check if file exists
if (Test-Path $keyPath) {
    Write-Host "✅ SSH key found at: $keyPath" -ForegroundColor Green
    
    # Remove inheritance and set proper permissions
    try {
        icacls $keyPath /inheritance:r
        icacls $keyPath /remove "NT AUTHORITY\Authenticated Users"
        icacls $keyPath /remove "BUILTIN\Users"
        icacls $keyPath /remove "Everyone"
        icacls $keyPath /grant:r "$env:USERNAME:(R)"
        
        Write-Host "✅ Permissions fixed successfully!" -ForegroundColor Green
        
        # Try to connect
        Write-Host "🔗 Attempting SSH connection..." -ForegroundColor Yellow
        ssh -i $keyPath ec2-user@13.210.224.119
        
    } catch {
        Write-Host "❌ Error fixing permissions: $_" -ForegroundColor Red
    }
} else {
    Write-Host "❌ SSH key not found at: $keyPath" -ForegroundColor Red
    Write-Host "Please copy the .pem file to your Downloads folder first." -ForegroundColor Yellow
}
