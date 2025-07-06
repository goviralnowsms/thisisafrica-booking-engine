# PowerShell script to check your EC2 instance status

Write-Host "🔍 Checking EC2 Instance Status" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

$WHITELISTED_IP = "13.210.224.119"

# Check if AWS CLI is installed
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "❌ AWS CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check AWS credentials
try {
    $identity = aws sts get-caller-identity --output json 2>$null | ConvertFrom-Json
    if ($identity) {
        Write-Host "✅ AWS CLI configured" -ForegroundColor Green
        Write-Host "Account: $($identity.Account)" -ForegroundColor Yellow
        Write-Host "User: $($identity.Arn)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ AWS CLI not configured. Run: aws configure" -ForegroundColor Red
    exit 1
}

# Get default region
$region = aws configure get region
if (-not $region) {
    $region = "ap-southeast-2"  # Default for Australia
    Write-Host "⚠️  No default region set, using: $region" -ForegroundColor Yellow
}

Write-Host "Region: $region" -ForegroundColor Yellow
Write-Host ""

# Find instances with the whitelisted IP
Write-Host "🔍 Looking for instances with IP $WHITELISTED_IP..." -ForegroundColor Cyan

try {
    $instances = aws ec2 describe-instances --region $region --filters "Name=ip-address,Values=$WHITELISTED_IP" --output json | ConvertFrom-Json
    
    if ($instances.Reservations.Count -eq 0) {
        Write-Host "❌ No instances found with IP $WHITELISTED_IP" -ForegroundColor Red
        Write-Host ""
        Write-Host "Checking all running instances..." -ForegroundColor Cyan
        
        $allInstances = aws ec2 describe-instances --region $region --filters "Name=instance-state-name,Values=running" --output json | ConvertFrom-Json
        
        if ($allInstances.Reservations.Count -gt 0) {
            Write-Host "Running instances found:" -ForegroundColor Green
            foreach ($reservation in $allInstances.Reservations) {
                foreach ($instance in $reservation.Instances) {
                    $name = ($instance.Tags | Where-Object { $_.Key -eq "Name" }).Value
                    if (-not $name) { $name = "(no name)" }
                    
                    Write-Host "  Instance ID: $($instance.InstanceId)" -ForegroundColor White
                    Write-Host "  Name: $name" -ForegroundColor White
                    Write-Host "  Public IP: $($instance.PublicIpAddress)" -ForegroundColor White
                    Write-Host "  State: $($instance.State.Name)" -ForegroundColor White
                    Write-Host "  Key Name: $($instance.KeyName)" -ForegroundColor White
                    Write-Host "  ---" -ForegroundColor Gray
                }
            }
        } else {
            Write-Host "❌ No running instances found in region $region" -ForegroundColor Red
        }
        
        Write-Host ""
        Write-Host "🔧 To associate the Elastic IP:" -ForegroundColor Cyan
        Write-Host "1. Go to AWS Console → EC2 → Elastic IPs" -ForegroundColor White
        Write-Host "2. Find IP $WHITELISTED_IP" -ForegroundColor White
        Write-Host "3. Click 'Associate Elastic IP address'" -ForegroundColor White
        Write-Host "4. Select your instance and associate" -ForegroundColor White
        
    } else {
        Write-Host "✅ Found instance with IP $WHITELISTED_IP" -ForegroundColor Green
        
        foreach ($reservation in $instances.Reservations) {
            foreach ($instance in $reservation.Instances) {
                $name = ($instance.Tags | Where-Object { $_.Key -eq "Name" }).Value
                if (-not $name) { $name = "(no name)" }
                
                Write-Host "Instance Details:" -ForegroundColor Yellow
                Write-Host "  Instance ID: $($instance.InstanceId)" -ForegroundColor White
                Write-Host "  Name: $name" -ForegroundColor White
                Write-Host "  Public IP: $($instance.PublicIpAddress)" -ForegroundColor White
                Write-Host "  Private IP: $($instance.PrivateIpAddress)" -ForegroundColor White
                Write-Host "  State: $($instance.State.Name)" -ForegroundColor White
                Write-Host "  Key Name: $($instance.KeyName)" -ForegroundColor White
                Write-Host "  Instance Type: $($instance.InstanceType)" -ForegroundColor White
                Write-Host "  Launch Time: $($instance.LaunchTime)" -ForegroundColor White
                
                if ($instance.State.Name -eq "running") {
                    Write-Host "✅ Instance is running and ready for SSH" -ForegroundColor Green
                } else {
                    Write-Host "⚠️  Instance is not running (State: $($instance.State.Name))" -ForegroundColor Yellow
                }
                
                if ($instance.KeyName -eq "tourplan-ubuntu-key") {
                    Write-Host "✅ Key name matches your key file" -ForegroundColor Green
                } else {
                    Write-Host "⚠️  Key name ($($instance.KeyName)) doesn't match 'tourplan-ubuntu-key'" -ForegroundColor Yellow
                }
            }
        }
    }
} catch {
    Write-Host "❌ Error checking instances: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\scripts\test-ssh-connection.ps1" -ForegroundColor White
Write-Host "2. If connection fails, run: .\scripts\fix-ssh-permissions-windows.ps1" -ForegroundColor White
