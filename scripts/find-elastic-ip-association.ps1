Write-Host "=== FINDING ELASTIC IP ACROSS ALL REGIONS ===" -ForegroundColor Green
Write-Host ""

# List of common AWS regions
$regions = @(
    "ap-southeast-2",  # Sydney (current)
    "us-east-1",       # N. Virginia
    "us-west-2",       # Oregon
    "eu-west-1",       # Ireland
    "ap-southeast-1"   # Singapore
)

Write-Host "Checking for Elastic IPs in multiple regions..." -ForegroundColor Yellow
Write-Host ""

$foundIPs = @()

foreach ($region in $regions) {
    Write-Host "Checking region: $region" -ForegroundColor Cyan
    try {
        $eips = aws ec2 describe-addresses --region $region --output json 2>$null | ConvertFrom-Json
        if ($eips.Addresses.Count -gt 0) {
            Write-Host "  Found $($eips.Addresses.Count) Elastic IP(s):" -ForegroundColor Green
            foreach ($eip in $eips.Addresses) {
                $association = if ($eip.AssociationId) { $eip.AssociationId } else { "Not associated" }
                Write-Host "    IP: $($eip.PublicIp) - $association" -ForegroundColor White
                $foundIPs += @{
                    Region = $region
                    IP = $eip.PublicIp
                    Association = $association
                    AllocationId = $eip.AllocationId
                }
            }
        } else {
            Write-Host "  No Elastic IPs found" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  Error checking region $region" -ForegroundColor Red
    }
    Write-Host ""
}

if ($foundIPs.Count -eq 0) {
    Write-Host "=== NO ELASTIC IPS FOUND IN ANY REGION ===" -ForegroundColor Red
    Write-Host ""
    Write-Host "RECOMMENDATION: Allocate a new Elastic IP in ap-southeast-2 (Sydney)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Steps to allocate new Elastic IP:" -ForegroundColor Green
    Write-Host "1. In AWS Console, click 'Allocate Elastic IP address' button" -ForegroundColor White
    Write-Host "2. Select 'Amazon's pool of IPv4 addresses'" -ForegroundColor White
    Write-Host "3. Click 'Allocate'" -ForegroundColor White
    Write-Host "4. Note the new IP address" -ForegroundColor White
    Write-Host "5. Contact Tourplan to whitelist the NEW IP" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "=== FOUND ELASTIC IPS ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Looking for IP 13.210.224.119..." -ForegroundColor Yellow
    $targetIP = $foundIPs | Where-Object { $_.IP -eq "13.210.224.119" }
    
    if ($targetIP) {
        Write-Host "FOUND TARGET IP: 13.210.224.119 in region $($targetIP.Region)" -ForegroundColor Green
        Write-Host "Association: $($targetIP.Association)" -ForegroundColor White
        Write-Host ""
        Write-Host "To move this IP to your EC2 instance:" -ForegroundColor Yellow
        Write-Host "1. Switch to region: $($targetIP.Region)" -ForegroundColor White
        Write-Host "2. Disassociate from current resource" -ForegroundColor White
        Write-Host "3. Associate with your EC2 instance" -ForegroundColor White
    } else {
        Write-Host "IP 13.210.224.119 NOT FOUND in any region" -ForegroundColor Red
        Write-Host ""
        Write-Host "Available IPs:" -ForegroundColor Yellow
        foreach ($ip in $foundIPs) {
            Write-Host "  $($ip.IP) in $($ip.Region)" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Green
Write-Host "1. If no Elastic IPs found: Allocate new one" -ForegroundColor White
Write-Host "2. If found in different region: Switch regions" -ForegroundColor White
Write-Host "3. If 13.210.224.119 not found: Contact Tourplan with new IP" -ForegroundColor White
