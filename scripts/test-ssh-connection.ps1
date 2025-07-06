# Detailed SSH connection test with advanced diagnostics
# This is the most comprehensive test script

Write-Host "🔍 Advanced SSH Connection Diagnostics" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

$KEY_PATH = ".\tourplan-ubuntu-key.pem"
$INSTANCE_IP = "13.210.224.119"
$EXPECTED_LOCAL_IP = "110.175.119.93"

Write-Host "Starting comprehensive SSH diagnostics..." -ForegroundColor Cyan
Write-Host ""

# System Information
Write-Host "System Information:" -ForegroundColor Yellow
Write-Host "  OS: $([System.Environment]::OSVersion.VersionString)" -ForegroundColor Gray
Write-Host "  PowerShell: $($PSVersionTable.PSVersion)" -ForegroundColor Gray
Write-Host "  User: $env:USERNAME" -ForegroundColor Gray
Write-Host "  Domain: $env:USERDOMAIN" -ForegroundColor Gray
Write-Host ""

# Network Diagnostics
Write-Host "Network Diagnostics:" -ForegroundColor Yellow

# Check internet connectivity
try {
    $internetTest = Test-NetConnection -ComputerName "8.8.8.8" -Port 53 -WarningAction SilentlyContinue
    if ($internetTest.TcpTestSucceeded) {
        Write-Host "  ✅ Internet connectivity: OK" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Internet connectivity: FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host "  ⚠️  Internet connectivity: UNKNOWN" -ForegroundColor Yellow
}

# Check DNS resolution
try {
    $dnsTest = Resolve-DnsName -Name $INSTANCE_IP -ErrorAction Stop
    Write-Host "  ✅ DNS resolution: OK" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  DNS resolution: Using IP directly" -ForegroundColor Yellow
}

# Check current public IP
try {
    $currentIP = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing -TimeoutSec 10).Content.Trim()
    Write-Host "  ✅ Current public IP: $currentIP" -ForegroundColor Green
    
    if ($currentIP -eq $EXPECTED_LOCAL_IP) {
        Write-Host "  ✅ IP matches expected: $EXPECTED_LOCAL_IP" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  IP mismatch - Expected: $EXPECTED_LOCAL_IP, Got: $currentIP" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Could not determine public IP" -ForegroundColor Red
}

Write-Host ""

# SSH Client Diagnostics
Write-Host "SSH Client Diagnostics:" -ForegroundColor Yellow

# Check SSH availability
try {
    $sshVersion = ssh -V 2>&1
    Write-Host "  ✅ SSH client: $sshVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ SSH client not found" -ForegroundColor Red
    Write-Host "     Please install OpenSSH for Windows" -ForegroundColor Gray
    exit 1
}

# Check SSH config
$sshConfigPath = "$env:USERPROFILE\.ssh\config"
if (Test-Path $sshConfigPath) {
    Write-Host "  ✅ SSH config found: $sshConfigPath" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  No SSH config file (this is normal)" -ForegroundColor Yellow
}

# Check known_hosts
$knownHostsPath = "$env:USERPROFILE\.ssh\known_hosts"
if (Test-Path $knownHostsPath) {
    $knownHosts = Get-Content $knownHostsPath | Where-Object { $_ -match $INSTANCE_IP }
    if ($knownHosts) {
        Write-Host "  ✅ Host key already known" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Host key not in known_hosts (first connection)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠️  No known_hosts file (first SSH connection)" -ForegroundColor Yellow
}

Write-Host ""

# Key File Diagnostics
Write-Host "SSH Key File Diagnostics:" -ForegroundColor Yellow

if (Test-Path $KEY_PATH) {
    $keyInfo = Get-Item $KEY_PATH
    Write-Host "  ✅ Key file found: $($keyInfo.FullName)" -ForegroundColor Green
    Write-Host "     Size: $($keyInfo.Length) bytes" -ForegroundColor Gray
    Write-Host "     Created: $($keyInfo.CreationTime)" -ForegroundColor Gray
    Write-Host "     Modified: $($keyInfo.LastWriteTime)" -ForegroundColor Gray
    
    # Check file content
    $keyContent = Get-Content $KEY_PATH -Raw
    if ($keyContent -match "BEGIN.*PRIVATE KEY") {
        Write-Host "  ✅ Key file format appears valid" -ForegroundColor Green
        
        # Determine key type
        if ($keyContent -match "BEGIN RSA PRIVATE KEY") {
            Write-Host "     Key type: RSA" -ForegroundColor Gray
        } elseif ($keyContent -match "BEGIN OPENSSH PRIVATE KEY") {
            Write-Host "     Key type: OpenSSH" -ForegroundColor Gray
        } elseif ($keyContent -match "BEGIN EC PRIVATE KEY") {
            Write-Host "     Key type: EC" -ForegroundColor Gray
        } else {
            Write-Host "     Key type: Unknown" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ Key file format appears invalid" -ForegroundColor Red
    }
    
    # Check permissions
    $acl = Get-Acl $KEY_PATH
    $accessRules = $acl.Access
    Write-Host "  File permissions:" -ForegroundColor Gray
    foreach ($rule in $accessRules) {
        $identity = $rule.IdentityReference
        $rights = $rule.FileSystemRights
        $type = $rule.AccessControlType
        Write-Host "     $identity`: $rights ($type)" -ForegroundColor Gray
    }
    
    # Check if permissions are too open
    $everyoneAccess = $accessRules | Where-Object { $_.IdentityReference -eq "Everyone" }
    $usersAccess = $accessRules | Where-Object { $_.IdentityReference -eq "BUILTIN\Users" }
    
    if ($everyoneAccess -or $usersAccess) {
        Write-Host "  ⚠️  Key file permissions may be too open" -ForegroundColor Yellow
        Write-Host "     Attempting to fix..." -ForegroundColor Gray
        
        try {
            icacls $KEY_PATH /inheritance:r 2>$null | Out-Null
            icacls $KEY_PATH /grant:r "$env:USERNAME:(R)" 2>$null | Out-Null
            icacls $KEY_PATH /remove "Everyone" 2>$null | Out-Null
            icacls $KEY_PATH /remove "BUILTIN\Users" 2>$null | Out-Null
            Write-Host "  ✅ Permissions fixed" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ Could not fix permissions: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ✅ Key file permissions look secure" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ Key file not found: $KEY_PATH" -ForegroundColor Red
    Write-Host "     Please run: .\scripts\copy-key-file.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Target Host Diagnostics
Write-Host "Target Host Diagnostics:" -ForegroundColor Yellow

# Basic connectivity test
Write-Host "  Testing basic connectivity..." -ForegroundColor Gray
try {
    $pingResult = Test-Connection -ComputerName $INSTANCE_IP -Count 2 -Quiet
    if ($pingResult) {
        Write-Host "  ✅ Host is reachable (ping successful)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Host is not reachable (ping failed)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Ping test failed: $_" -ForegroundColor Red
}

# Port 22 connectivity test
Write-Host "  Testing SSH port (22)..." -ForegroundColor Gray
try {
    $portTest = Test-NetConnection -ComputerName $INSTANCE_IP -Port 22 -WarningAction SilentlyContinue
    if ($portTest.TcpTestSucceeded) {
        Write-Host "  ✅ SSH port 22 is open and reachable" -ForegroundColor Green
        Write-Host "     Remote address: $($portTest.RemoteAddress)" -ForegroundColor Gray
        Write-Host "     Remote port: $($portTest.RemotePort)" -ForegroundColor Gray
    } else {
        Write-Host "  ❌ SSH port 22 is not reachable" -ForegroundColor Red
        Write-Host "     This indicates:" -ForegroundColor Yellow
        Write-Host "     - EC2 instance may not be running" -ForegroundColor Gray
        Write-Host "     - Security group blocking SSH access" -ForegroundColor Gray
        Write-Host "     - SSH service not running on instance" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ❌ Port test failed: $_" -ForegroundColor Red
}

# Test other common ports
$commonPorts = @(80, 443, 3000)
foreach ($port in $commonPorts) {
    try {
        $result = Test-NetConnection -ComputerName $INSTANCE_IP -Port $port -WarningAction SilentlyContinue
        if ($result.TcpTestSucceeded) {
            Write-Host "  ✅ Port $port is open" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Port $port is closed" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ❌ Port $port test failed" -ForegroundColor Gray
    }
}

Write-Host ""

# SSH Connection Test
Write-Host "SSH Connection Test:" -ForegroundColor Yellow

$usernames = @("ubuntu", "ec2-user", "admin", "root")
$successfulConnection = $false

foreach ($username in $usernames) {
    Write-Host "  Testing connection as '$username'..." -ForegroundColor Gray
    
    try {
        # Create a temporary script for SSH test
        $testScript = @"
ssh -i "$KEY_PATH" -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o BatchMode=yes $username@$INSTANCE_IP "echo 'Connection successful as $username'; whoami; uname -a" 2>&1
"@
        
        $result = Invoke-Expression $testScript
        
        if ($result -match "Connection successful") {
            Write-Host "  ✅ Successfully connected as '$username'" -ForegroundColor Green
            Write-Host "     Server response: $result" -ForegroundColor Gray
            $successfulConnection = $true
            $workingUsername = $username
            break
        } else {
            if ($result -match "Permission denied") {
                Write-Host "  ❌ Permission denied for '$username'" -ForegroundColor Red
            } elseif ($result -match "Connection refused") {
                Write-Host "  ❌ Connection refused for '$username'" -ForegroundColor Red
            } elseif ($result -match "Connection timed out") {
                Write-Host "  ❌ Connection timed out for '$username'" -ForegroundColor Red
            } else {
                Write-Host "  ❌ Failed for '$username': $result" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "  ❌ Error testing '$username': $_" -ForegroundColor Red
    }
}

Write-Host ""

# Final Report
Write-Host "========================================" -ForegroundColor Green
Write-Host "DIAGNOSTIC REPORT SUMMARY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

if ($successfulConnection) {
    Write-Host "🎉 SSH CONNECTION: SUCCESS!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Working connection command:" -ForegroundColor Cyan
    Write-Host "ssh -i `"$KEY_PATH`" $workingUsername@$INSTANCE_IP" -ForegroundColor White
    Write-Host ""
    Write-Host "Quick connect script:" -ForegroundColor Cyan
    Write-Host ".\scripts\simple-ssh-connect.ps1" -ForegroundColor White
} else {
    Write-Host "❌ SSH CONNECTION: FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting recommendations:" -ForegroundColor Yellow
    Write-Host ""
    
    # Specific recommendations based on test results
    if (-not $pingResult) {
        Write-Host "🔧 HOST UNREACHABLE:" -ForegroundColor Red
        Write-Host "   1. Check if EC2 instance is running in AWS Console" -ForegroundColor White
        Write-Host "   2. Verify Elastic IP $INSTANCE_IP is associated" -ForegroundColor White
        Write-Host "   3. Check instance status and system logs" -ForegroundColor White
    } elseif (-not $portTest.TcpTestSucceeded) {
        Write-Host "🔧 SSH PORT BLOCKED:" -ForegroundColor Red
        Write-Host "   1. Check EC2 Security Group allows SSH (port 22) from your IP" -ForegroundColor White
        Write-Host "   2. Verify Network ACLs allow SSH traffic" -ForegroundColor White
        Write-Host "   3. Check if SSH service is running on the instance" -ForegroundColor White
    } else {
        Write-Host "🔧 AUTHENTICATION FAILED:" -ForegroundColor Red
        Write-Host "   1. Verify you're using the correct SSH key file" -ForegroundColor White
        Write-Host "   2. Check if the key pair matches the EC2 instance" -ForegroundColor White
        Write-Host "   3. Try different usernames (ubuntu, ec2-user, admin)" -ForegroundColor White
        Write-Host "   4. Check key file permissions and format" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Alternative connection methods:" -ForegroundColor Cyan
    Write-Host "• AWS Session Manager (no SSH key required)" -ForegroundColor White
    Write-Host "• EC2 Instance Connect from AWS Console" -ForegroundColor White
    Write-Host "• AWS CloudShell with AWS CLI" -ForegroundColor White
    
    Write-Host ""
    Write-Host "For verbose SSH debugging, run:" -ForegroundColor Cyan
    Write-Host "ssh -vvv -i `"$KEY_PATH`" ubuntu@$INSTANCE_IP" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
