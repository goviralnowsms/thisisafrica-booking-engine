# Quick SSH Connection Test for Tourplan Booking Engine
# Tests connection to EC2 instance with whitelisted IP

Write-Host "Quick SSH Connection Test" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

# Configuration - WHITELISTED IP
$EC2_IP = "13.210.224.119"  # This is your WHITELISTED Elastic IP
$SSH_USER = "ubuntu"
$SSH_KEY = ".\tourplan-ubuntu-key.pem"

Write-Host "Target: $SSH_USER@$EC2_IP" -ForegroundColor Yellow
Write-Host "SSH Key: $SSH_KEY" -ForegroundColor Yellow
Write-Host ""

# Step 1: Check if SSH key exists
Write-Host "Step 1: Checking SSH key file..." -ForegroundColor Cyan

if (Test-Path $SSH_KEY) {
    $keySize = (Get-Item $SSH_KEY).Length
    Write-Host "SSH key found!" -ForegroundColor Green
    Write-Host "   Size: $keySize bytes" -ForegroundColor White
    Write-Host "   Location: $(Resolve-Path $SSH_KEY)" -ForegroundColor White
} else {
    Write-Host "SSH key not found!" -ForegroundColor Red
    Write-Host "   Expected location: $(Resolve-Path $SSH_KEY -ErrorAction SilentlyContinue)" -ForegroundColor White
    Write-Host "   Run: .\scripts\copy-key-file.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 2: Test network connectivity
Write-Host "Step 2: Testing network connectivity..." -ForegroundColor Cyan

try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connect = $tcpClient.BeginConnect($EC2_IP, 22, $null, $null)
    $wait = $connect.AsyncWaitHandle.WaitOne(5000, $false)
    
    if ($wait) {
        $tcpClient.EndConnect($connect)
        $tcpClient.Close()
        Write-Host "Network connection successful!" -ForegroundColor Green
        Write-Host "   Port 22 (SSH) is open and reachable" -ForegroundColor White
    } else {
        throw "Connection timeout"
    }
} catch {
    Write-Host "Network connection failed!" -ForegroundColor Red
    Write-Host "   Port 22 (SSH) is not reachable" -ForegroundColor White
    Write-Host "   Check if your EC2 instance is using the whitelisted IP" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANT: Your EC2 instance must use the whitelisted IP: $EC2_IP" -ForegroundColor Red
    Write-Host "Current instance IP might be different. Check AWS Console:" -ForegroundColor Yellow
    Write-Host "1. Go to EC2 -> Elastic IPs" -ForegroundColor White
    Write-Host "2. Associate $EC2_IP with your running instance" -ForegroundColor White
    Write-Host "3. Update security group to allow SSH from your current IP" -ForegroundColor White
    exit 1
}

Write-Host ""

# Step 3: Test SSH connection
Write-Host "Step 3: Testing SSH connection..." -ForegroundColor Cyan

try {
    # Test SSH connection with timeout
    $sshTest = Start-Process -FilePath "ssh" -ArgumentList @(
        "-i", $SSH_KEY,
        "-o", "ConnectTimeout=10",
        "-o", "StrictHostKeyChecking=no",
        "-o", "BatchMode=yes",
        "$SSH_USER@$EC2_IP",
        "echo 'SSH connection successful'"
    ) -Wait -PassThru -NoNewWindow -RedirectStandardOutput "ssh_test_output.txt" -RedirectStandardError "ssh_test_error.txt"

    if ($sshTest.ExitCode -eq 0) {
        $output = Get-Content "ssh_test_output.txt" -ErrorAction SilentlyContinue
        Write-Host "SSH connection successful!" -ForegroundColor Green
        Write-Host "   Server response: $output" -ForegroundColor White
        
        # Cleanup temp files
        Remove-Item "ssh_test_output.txt" -ErrorAction SilentlyContinue
        Remove-Item "ssh_test_error.txt" -ErrorAction SilentlyContinue
        
        Write-Host ""
        Write-Host "All tests passed! You can now connect using:" -ForegroundColor Green
        Write-Host "   .\scripts\simple-ssh-connect.ps1" -ForegroundColor Yellow
        
    } else {
        $error = Get-Content "ssh_test_error.txt" -ErrorAction SilentlyContinue
        Write-Host "SSH connection failed!" -ForegroundColor Red
        Write-Host "   Error: $error" -ForegroundColor White
        
        # Cleanup temp files
        Remove-Item "ssh_test_output.txt" -ErrorAction SilentlyContinue
        Remove-Item "ssh_test_error.txt" -ErrorAction SilentlyContinue
        
        Write-Host ""
        Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
        Write-Host "1. Ensure EC2 instance is using IP: $EC2_IP" -ForegroundColor White
        Write-Host "2. Check security group allows SSH from your IP" -ForegroundColor White
        Write-Host "3. Verify you're using the correct SSH key file" -ForegroundColor White
        exit 1
    }
} catch {
    Write-Host "SSH test failed with exception: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Connection test completed successfully!" -ForegroundColor Green
