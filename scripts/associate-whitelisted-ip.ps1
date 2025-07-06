# Associate the whitelisted Elastic IP with EC2 instance
# This script provides step-by-step instructions for associating the IP

Write-Host "Associate Whitelisted IP with EC2 Instance" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

$WHITELISTED_IP = "13.210.224.119"
$CURRENT_EC2_IP = "52.62.181.111"

Write-Host "Target Configuration:" -ForegroundColor Yellow
Write-Host "- Whitelisted IP (for Tourplan): $WHITELISTED_IP" -ForegroundColor White
Write-Host "- Current EC2 IP (will change): $CURRENT_EC2_IP" -ForegroundColor White
Write-Host ""

Write-Host "This process will:" -ForegroundColor Cyan
Write-Host "1. Give your EC2 instance the whitelisted IP" -ForegroundColor White
Write-Host "2. Enable Tourplan API access from your booking engine" -ForegroundColor White
Write-Host "3. Allow SSH access via the static IP" -ForegroundColor White
Write-Host ""

Write-Host "Step-by-Step Instructions:" -ForegroundColor Yellow
Write-Host ""

Write-Host "STEP 1: Open AWS Console" -ForegroundColor Cyan
Write-Host "- Go to https://console.aws.amazon.com" -ForegroundColor Gray
Write-Host "- Navigate to EC2 service" -ForegroundColor Gray
Write-Host "- Click on 'Elastic IPs' in the left sidebar" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: Find Your Elastic IP" -ForegroundColor Cyan
Write-Host "- Look for IP address: $WHITELISTED_IP" -ForegroundColor Gray
Write-Host "- Note what it's currently associated with" -ForegroundColor Gray
Write-Host "- If it shows 'Associated with NAT Gateway' or 'Lambda', that's expected" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: Disassociate Current Association" -ForegroundColor Cyan
Write-Host "- Select the Elastic IP: $WHITELISTED_IP" -ForegroundColor Gray
Write-Host "- Click 'Actions' dropdown" -ForegroundColor Gray
Write-Host "- Click 'Disassociate Elastic IP address'" -ForegroundColor Gray
Write-Host "- Confirm the disassociation" -ForegroundColor Gray
Write-Host "- The IP should now show as 'Not associated'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Associate with Your EC2 Instance" -ForegroundColor Cyan
Write-Host "- Keep the same Elastic IP selected: $WHITELISTED_IP" -ForegroundColor Gray
Write-Host "- Click 'Actions' dropdown" -ForegroundColor Gray
Write-Host "- Click 'Associate Elastic IP address'" -ForegroundColor Gray
Write-Host "- Resource type: Select 'Instance'" -ForegroundColor Gray
Write-Host "- Instance: Choose your running EC2 instance" -ForegroundColor Gray
Write-Host "- Private IP address: Leave as default" -ForegroundColor Gray
Write-Host "- Click 'Associate'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 5: Verify Association" -ForegroundColor Cyan
Write-Host "- The Elastic IP should now show 'Associated with instance i-xxxxx'" -ForegroundColor Gray
Write-Host "- Go to EC2 -> Instances" -ForegroundColor Gray
Write-Host "- Your instance should now show Public IP: $WHITELISTED_IP" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 6: Update Security Group" -ForegroundColor Cyan
Write-Host "- Still in EC2 console, click on your instance" -ForegroundColor Gray
Write-Host "- Click on the Security Group link" -ForegroundColor Gray
Write-Host "- Click 'Edit inbound rules'" -ForegroundColor Gray
Write-Host "- Ensure SSH (port 22) is allowed from your current IP" -ForegroundColor Gray
Write-Host "- Your current IP is: " -NoNewline -ForegroundColor Gray

try {
    $currentIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 5).Content.Trim()
    Write-Host "$currentIP" -ForegroundColor Yellow
} catch {
    Write-Host "Unable to detect (check manually)" -ForegroundColor Red
}

Write-Host ""

Write-Host "STEP 7: Test the Connection" -ForegroundColor Cyan
Write-Host "- Run: .\scripts\quick-ssh-test.ps1" -ForegroundColor Gray
Write-Host "- If successful, run: .\scripts\simple-ssh-connect.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "Expected Results:" -ForegroundColor Green
Write-Host "- EC2 instance accessible via SSH at $WHITELISTED_IP" -ForegroundColor White
Write-Host "- Tourplan API calls will work from this IP" -ForegroundColor White
Write-Host "- Your booking engine will have proper API access" -ForegroundColor White
Write-Host ""

Write-Host "Troubleshooting:" -ForegroundColor Red
Write-Host "- If SSH fails, check security group allows your IP" -ForegroundColor White
Write-Host "- If Tourplan API fails, verify IP is still whitelisted" -ForegroundColor White
Write-Host "- If association fails, ensure no other resource is using the IP" -ForegroundColor White
Write-Host ""

Write-Host "Ready to proceed? Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Go ahead and complete the steps in AWS Console!" -ForegroundColor Green
Write-Host "Then run: .\scripts\quick-ssh-test.ps1" -ForegroundColor Yellow
