# PowerShell script to copy SSH key file to project directory
Write-Host "SSH Key Setup for Tourplan EC2 Connection" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Configuration
$KEY_NAME = "tourplan-ubuntu-key.pem"
$DOWNLOADS_PATH = "$env:USERPROFILE\Downloads\$KEY_NAME"
$PROJECT_KEY_PATH = ".\$KEY_NAME"

Write-Host "Looking for SSH key..." -ForegroundColor Cyan
Write-Host "  Expected location: $DOWNLOADS_PATH" -ForegroundColor Gray
Write-Host ""

# Step 1: Check if key exists in Downloads
if (-not (Test-Path $DOWNLOADS_PATH)) {
    Write-Host "SSH key not found in Downloads folder!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure you have downloaded the SSH key file:" -ForegroundColor Yellow
    Write-Host "  File name: $KEY_NAME" -ForegroundColor White
    Write-Host "  Location: $DOWNLOADS_PATH" -ForegroundColor White
    Write-Host ""
    Write-Host "Download the key from AWS Console:" -ForegroundColor Cyan
    Write-Host "1. Go to EC2 -> Key Pairs" -ForegroundColor White
    Write-Host "2. Find your key pair" -ForegroundColor White
    Write-Host "3. Download the .pem file to your Downloads folder" -ForegroundColor White
    exit 1
}

# Step 2: Copy key to project directory
Write-Host "Step 1: Copying SSH key to project directory..." -ForegroundColor Cyan
try {
    Copy-Item $DOWNLOADS_PATH $PROJECT_KEY_PATH -Force
    Write-Host "SSH key copied successfully!" -ForegroundColor Green
    Write-Host "  From: $DOWNLOADS_PATH" -ForegroundColor Gray
    Write-Host "  To: $PROJECT_KEY_PATH" -ForegroundColor Gray
} catch {
    Write-Host "Failed to copy SSH key: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Set proper file permissions (Windows)
Write-Host "Step 2: Setting file permissions..." -ForegroundColor Cyan
try {
    # Remove inheritance and set owner-only permissions
    $acl = Get-Acl $PROJECT_KEY_PATH
    $acl.SetAccessRuleProtection($true, $false)
    
    # Remove all existing permissions
    $acl.Access | ForEach-Object { $acl.RemoveAccessRule($_) }
    
    # Add read permission for current user only
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        $env:USERNAME, "Read", "Allow"
    )
    $acl.SetAccessRule($accessRule)
    
    # Apply the permissions
    Set-Acl $PROJECT_KEY_PATH $acl
    
    Write-Host "File permissions set successfully!" -ForegroundColor Green
    Write-Host "  Only you can read this file" -ForegroundColor Gray
} catch {
    Write-Host "Warning: Could not set file permissions: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "The key should still work, but permissions may not be optimal" -ForegroundColor Gray
}

Write-Host ""

# Step 4: Add to .gitignore
Write-Host "Step 3: Adding SSH key to .gitignore..." -ForegroundColor Cyan
$gitignoreEntries = @(
    "",
    "# SSH Keys - Security",
    "*.pem",
    "*.key",
    "$KEY_NAME",
    ""
)

try {
    if (Test-Path ".gitignore") {
        $existingContent = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue
        if ($existingContent -notmatch [regex]::Escape($KEY_NAME)) {
            $gitignoreEntries | Out-File ".gitignore" -Append -Encoding UTF8
            Write-Host "Added SSH key to existing .gitignore" -ForegroundColor Green
        } else {
            Write-Host "SSH key already in .gitignore" -ForegroundColor Green
        }
    } else {
        $gitignoreEntries | Out-File ".gitignore" -Encoding UTF8
        Write-Host "Created .gitignore with SSH key entry" -ForegroundColor Green
    }
} catch {
    Write-Host "Warning: Could not update .gitignore: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Please manually add '$KEY_NAME' to your .gitignore file" -ForegroundColor Gray
}

Write-Host ""
Write-Host "SSH Key Setup Complete!" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green
Write-Host ""
Write-Host "Key file copied to project directory" -ForegroundColor White
Write-Host "File permissions configured" -ForegroundColor White
Write-Host "Added to .gitignore for security" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: .\scripts\quick-ssh-test.ps1" -ForegroundColor White
Write-Host "2. If successful, use: .\scripts\simple-ssh-connect.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Your SSH key is now ready to use from this project directory!" -ForegroundColor Green
