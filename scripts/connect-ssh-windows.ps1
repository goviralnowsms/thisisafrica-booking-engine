# Simple PowerShell script to connect to your EC2 instance

$KEY_PATH = "C:\Users\Tess\tourplan-ubuntu-key.pem"
$INSTANCE_IP = "13.210.224.119"
$USERNAME = "ubuntu"

Write-Host "🔗 Connecting to EC2 Instance" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green
Write-Host "IP: $INSTANCE_IP" -ForegroundColor Yellow
Write-Host "Key: $KEY_PATH" -ForegroundColor Yellow
Write-Host "User: $USERNAME" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $KEY_PATH)) {
    Write-Host "❌ Key file not found: $KEY_PATH" -ForegroundColor Red
    Write-Host "Please check the file location." -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Attempting connection..." -ForegroundColor Green
Write-Host "Command: ssh -i `"$KEY_PATH`" $USERNAME@$INSTANCE_IP" -ForegroundColor Gray
Write-Host ""

# Connect with verbose output for troubleshooting
ssh -i $KEY_PATH -o StrictHostKeyChecking=no -v $USERNAME@$INSTANCE_IP

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Connection failed. Trying alternative usernames..." -ForegroundColor Red
    
    Write-Host "Trying 'ec2-user'..." -ForegroundColor Yellow
    ssh -i $KEY_PATH -o StrictHostKeyChecking=no ec2-user@$INSTANCE_IP
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Trying 'admin'..." -ForegroundColor Yellow
        ssh -i $KEY_PATH -o StrictHostKeyChecking=no admin@$INSTANCE_IP
    }
}
