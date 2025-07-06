# Generate email content for Tourplan IP whitelist update

Write-Host "=== GENERATE TOURPLAN EMAIL ===" -ForegroundColor Green
Write-Host ""

$NEW_IP = "13.211.226.114"
$OLD_IP = "13.210.224.119"
$AGENT_ID = "SAMAGT"

Write-Host "Email content for Tourplan support:" -ForegroundColor Yellow
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "COPY THE TEXT BELOW AND SEND TO TOURPLAN SUPPORT:" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "To: support@tourplan.com" -ForegroundColor White
Write-Host "Subject: IP Whitelist Update Request - Agent $AGENT_ID" -ForegroundColor White
Write-Host ""
Write-Host "Dear Tourplan Support Team," -ForegroundColor White
Write-Host ""
Write-Host "I am requesting an update to the IP whitelist for our agent account." -ForegroundColor White
Write-Host ""
Write-Host "Account Details:" -ForegroundColor White
Write-Host "• Agent ID: $AGENT_ID" -ForegroundColor White
Write-Host "• Company: [Your Company Name]" -ForegroundColor White
Write-Host "• Contact: [Your Name]" -ForegroundColor White
Write-Host "• Email: [Your Email]" -ForegroundColor White
Write-Host ""
Write-Host "IP Address Change:" -ForegroundColor White
Write-Host "• Previous IP (if any): $OLD_IP" -ForegroundColor White
Write-Host "• New IP to whitelist: $NEW_IP" -ForegroundColor White
Write-Host "• Server location: AWS EC2 ap-southeast-2 (Sydney)" -ForegroundColor White
Write-Host "• Purpose: Tourplan API access for booking engine application" -ForegroundColor White
Write-Host ""
Write-Host "Technical Details:" -ForegroundColor White
Write-Host "• This is a static Elastic IP address" -ForegroundColor White
Write-Host "• The IP is associated with our production EC2 instance" -ForegroundColor White
Write-Host "• We will be making API calls to: https://pa-thisis.nx.tourplan.net" -ForegroundColor White
Write-Host "• API endpoints used: hostConnectApi, search, booking, option info" -ForegroundColor White
Write-Host ""
Write-Host "Request:" -ForegroundColor White
Write-Host "Please add IP address $NEW_IP to the whitelist for agent $AGENT_ID." -ForegroundColor White
Write-Host "If there was a previous IP ($OLD_IP) associated with our account," -ForegroundColor White
Write-Host "please remove it and replace it with the new IP." -ForegroundColor White
Write-Host ""
Write-Host "Please confirm when the whitelist has been updated so we can test" -ForegroundColor White
Write-Host "our API connections." -ForegroundColor White
Write-Host ""
Write-Host "Thank you for your assistance." -ForegroundColor White
Write-Host ""
Write-Host "Best regards," -ForegroundColor White
Write-Host "[Your Name]" -ForegroundColor White
Write-Host "[Your Title]" -ForegroundColor White
Write-Host "[Your Company]" -ForegroundColor White
Write-Host "[Your Phone Number]" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "END OF EMAIL CONTENT" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "IMPORTANT NOTES:" -ForegroundColor Red
Write-Host "================" -ForegroundColor Red
Write-Host ""
Write-Host "1. Replace [Your Company Name] with your actual company name" -ForegroundColor White
Write-Host "2. Replace [Your Name] with your actual name" -ForegroundColor White
Write-Host "3. Replace [Your Email] with your actual email address" -ForegroundColor White
Write-Host "4. Replace [Your Title] with your job title" -ForegroundColor White
Write-Host "5. Replace [Your Phone Number] with your phone number" -ForegroundColor White
Write-Host ""

Write-Host "ALTERNATIVE EMAIL ADDRESSES:" -ForegroundColor Yellow
Write-Host "============================" -ForegroundColor Yellow
Write-Host ""
Write-Host "If support@tourplan.com doesn't work, try:" -ForegroundColor White
Write-Host "• help@tourplan.com" -ForegroundColor Gray
Write-Host "• technical@tourplan.com" -ForegroundColor Gray
Write-Host "• api-support@tourplan.com" -ForegroundColor Gray
Write-Host "• hostconnect@tourplan.com" -ForegroundColor Gray
Write-Host ""

Write-Host "WHAT TO EXPECT:" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""
Write-Host "Response time: Usually 1-3 business days" -ForegroundColor White
Write-Host "Confirmation: They should confirm when whitelist is updated" -ForegroundColor White
Write-Host "Testing: You can test API calls after confirmation" -ForegroundColor White
Write-Host ""

Write-Host "TEST COMMAND (after whitelist update):" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Once Tourplan confirms the whitelist update, test with:" -ForegroundColor White
Write-Host ""
Write-Host 'curl -X POST https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi \' -ForegroundColor Yellow
Write-Host "  -H 'Content-Type: application/xml' \\" -ForegroundColor Yellow
Write-Host "  -d '<?xml version=\"1.0\"?><!DOCTYPE Request SYSTEM \"hostConnect_5_05_000.dtd\"><Request><AgentInfoRequest><AgentID>$AGENT_ID</AgentID><Password>S@MAgt01</Password></AgentInfoRequest></Request>'" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected: XML response with agent information" -ForegroundColor Green
Write-Host "Error: IP not whitelisted (wait for Tourplan confirmation)" -ForegroundColor Red
Write-Host ""

Write-Host "FOLLOW-UP ACTIONS:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "After sending the email:" -ForegroundColor White
Write-Host "1. Wait for Tourplan confirmation (1-3 days)" -ForegroundColor Gray
Write-Host "2. Test API connection once confirmed" -ForegroundColor Gray
Write-Host "3. Deploy your booking engine application" -ForegroundColor Gray
Write-Host "4. Update your application configuration with new IP" -ForegroundColor Gray
Write-Host ""

Write-Host "Ready to send? Copy the email content above!" -ForegroundColor Green
