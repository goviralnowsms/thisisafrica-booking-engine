# Generate email to request Tourplan IP whitelist

Write-Host "=== GENERATE TOURPLAN WHITELIST EMAIL ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$OLD_IP = "13.210.224.119"
$INSTANCE_ID = "i-0ab30f25c4eb53815"
$PUBLIC_DNS = "ec2-13-211-226-114.ap-southeast-2.compute.amazonaws.com"
$CURRENT_DATE = Get-Date -Format "yyyy-MM-dd"

Write-Host "TOURPLAN IP WHITELIST REQUEST" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

$emailContent = @"
Subject: IP Whitelist Update Request - This is Africa Booking Engine

Dear Tourplan Support Team,

I hope this email finds you well. I am writing to request an update to our IP whitelist for the This is Africa booking engine integration.

CURRENT SITUATION:
==================
We have migrated our booking engine from AWS Lambda to a dedicated EC2 instance for better reliability and performance. This requires updating our whitelisted IP address.

ACCOUNT DETAILS:
================
Agent ID: SAMAGT
Company: This is Africa
Website: thisisafrica.com

IP ADDRESS CHANGE:
==================
Previous IP: $OLD_IP (no longer in use)
New Static IP: $NEW_IP
AWS Instance: $INSTANCE_ID
Public DNS: $PUBLIC_DNS
Region: Asia Pacific Sydney - ap-southeast-2
Date: $CURRENT_DATE

REQUEST:
========
Please update our IP whitelist to allow API access from:
$NEW_IP

This is our new static Elastic IP address that will be used for all Tourplan HostConnect API calls from our booking engine.

TECHNICAL DETAILS:
==================
Service: This is Africa Tour Booking Engine
Integration: Tourplan HostConnect API
IP Type: AWS Elastic IP (static - will not change)
Location: Sydney Australia
Purpose: Tour search availability and booking requests
API Endpoint: pa-thisis.nx.tourplan.net

VERIFICATION:
=============
You can verify this IP is active by checking that API calls originate from $NEW_IP when we test our integration.

URGENCY:
========
This update is required for our booking engine to function properly. Our customers are currently unable to search and book tours through our website until this IP is whitelisted.

Please confirm once the IP whitelist has been updated and let me know if you need any additional information.

Thank you for your assistance with this migration.

Best regards,
[Your Name]
[Your Company]
[Your Contact Information]

TECHNICAL CONTACT:
==================
Email: [Your Email]
Phone: [Your Phone]
Website: [Your Website]

Technical Reference:
- Agent: SAMAGT
- New IP: $NEW_IP
- Instance: $INSTANCE_ID
- Date: $CURRENT_DATE
"@

Write-Host $emailContent -ForegroundColor White
Write-Host ""

Write-Host "EMAIL CONTENT GENERATED!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host ""

# Save to file
$emailFile = "tourplan-whitelist-request-$CURRENT_DATE.txt"
$emailContent | Out-File -FilePath $emailFile -Encoding UTF8

Write-Host "EMAIL SAVED TO FILE: $emailFile" -ForegroundColor Green
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the email content above" -ForegroundColor White
Write-Host "2. Update the placeholder contact information" -ForegroundColor White
Write-Host "3. Send to Tourplan support using your usual contact method" -ForegroundColor White
Write-Host "4. Wait for confirmation of IP whitelist update" -ForegroundColor White
Write-Host "5. Test Tourplan API connection from your EC2 instance" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANT REMINDERS:" -ForegroundColor Red
Write-Host "===================" -ForegroundColor Red
Write-Host ""
Write-Host "Your new static IP is: $NEW_IP" -ForegroundColor Yellow
Write-Host "This IP must be whitelisted by Tourplan" -ForegroundColor Yellow
Write-Host "All API calls will come from this IP" -ForegroundColor Yellow
Write-Host "Keep this IP associated with your EC2 instance" -ForegroundColor Yellow
Write-Host ""

Write-Host "Email ready to send!" -ForegroundColor Green
