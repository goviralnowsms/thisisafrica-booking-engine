# Test SSH connection with the newly associated Elastic IP

Write-Host "=== TEST SSH WITH NEW ELASTIC IP ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$INSTANCE_ID = "i-0ab30f25c4eb53815"
$PRIVATE_IP = "172.31.1.109"
$PUBLIC_DNS = "ec2-13-211-226-114.ap-southeast-2.compute.amazonaws.com"

Write-Host "SUCCESS! ELASTIC IP ASSOCIATION COMPLETED" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Elastic IP: $NEW_IP" -ForegroundColor Green
Write-Host "Instance ID: $INSTANCE_ID" -ForegroundColor Green
Write-Host "Private IP: $PRIVATE_IP" -ForegroundColor Green
Write-Host "Public DNS: $PUBLIC_DNS" -ForegroundColor Green
Write-Host ""

Write-Host "NOW TEST SSH CONNECTION:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check for SSH key in common locations
Write-Host "Searching for SSH key..." -ForegroundColor Yellow

$keyLocations = @(
    ".\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Downloads\tourplan-ubuntu-key.pem",
    "$env:USERPROFILE\Desktop\tourplan-ubuntu-key.pem",
    "C:\Users\Tess\tourplan-ubuntu-key.pem"
)

$foundKey = $null

foreach ($location in $keyLocations) {
    if (Test-Path $location) {
        Write-Host "Found SSH key at: $location" -ForegroundColor Green
        $foundKey = $location
        break
    } else {
        Write-Host "Not found: $location" -ForegroundColor Gray
    }
}

if ($foundKey) {
    Write-Host ""
    Write-Host "SSH COMMAND TO USE:" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ssh -i `"$foundKey`" ubuntu@$NEW_IP" -ForegroundColor Green
    Write-Host ""
    Write-Host "Alternative using DNS name:" -ForegroundColor Gray
    Write-Host "ssh -i `"$foundKey`" ubuntu@$PUBLIC_DNS" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "EXPECTED RESULTS:" -ForegroundColor Cyan
    Write-Host "=================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "SUCCESS: You see Ubuntu welcome message and prompt" -ForegroundColor Green
    Write-Host "Connection established successfully" -ForegroundColor White
    Write-Host "Security group allows SSH from your IP" -ForegroundColor White
    Write-Host "Instance is running and accessible" -ForegroundColor White
    Write-Host ""
    Write-Host "FAILURE: Connection refused or timeout" -ForegroundColor Red
    Write-Host "Security group needs to be updated" -ForegroundColor White
    Write-Host "Your IP might not be allowed" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "SSH KEY NOT FOUND!" -ForegroundColor Red
    Write-Host "==================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please locate your tourplan-ubuntu-key.pem file first." -ForegroundColor White
    Write-Host "Common locations to check:" -ForegroundColor White
    Write-Host "Downloads folder" -ForegroundColor Gray
    Write-Host "Desktop" -ForegroundColor Gray
    Write-Host "Project directory" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Once found, use this command:" -ForegroundColor White
    Write-Host "ssh -i `"path/to/tourplan-ubuntu-key.pem`" ubuntu@$NEW_IP" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "AFTER SSH CONNECTION WORKS:" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test the public IP from inside the instance:" -ForegroundColor White
Write-Host ""
Write-Host "curl https://api.ipify.org" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected result: $NEW_IP" -ForegroundColor Green
Write-Host ""
Write-Host "This confirms that when your booking engine makes API calls," -ForegroundColor White
Write-Host "Tourplan will see requests coming from: $NEW_IP" -ForegroundColor Yellow
Write-Host ""

Write-Host "TROUBLESHOOTING SSH ISSUES:" -ForegroundColor Red
Write-Host "===========================" -ForegroundColor Red
Write-Host ""
Write-Host "If SSH connection fails:" -ForegroundColor White
Write-Host ""
Write-Host "1. Check Security Group:" -ForegroundColor Yellow
Write-Host "Go to EC2 > Security Groups" -ForegroundColor Gray
Write-Host "Find security group for instance $INSTANCE_ID" -ForegroundColor Gray
Write-Host "Ensure SSH (port 22) is allowed from your IP" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Check Instance State:" -ForegroundColor Yellow
Write-Host "Go to EC2 > Instances" -ForegroundColor Gray
Write-Host "Ensure instance $INSTANCE_ID is 'running'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check Key Permissions (if on Linux/Mac):" -ForegroundColor Yellow
Write-Host "chmod 400 tourplan-ubuntu-key.pem" -ForegroundColor Gray
Write-Host ""

Write-Host "Try the SSH connection now!" -ForegroundColor Green
