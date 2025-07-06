# EC2 Connection Troubleshooting

## Issue: "Failed to connect to your instance"

### Quick Fixes:

1. **Check Security Group**
   - Go to AWS Console → EC2 → Instances
   - Click your instance → Security tab
   - Click the security group link
   - Ensure these inbound rules exist:
     - SSH (port 22) from 0.0.0.0/0
     - HTTP (port 80) from 0.0.0.0/0  
     - Custom TCP (port 3000) from 0.0.0.0/0

2. **Check Instance Status**
   - Instance State: should be "running"
   - Status Checks: should be "2/2 checks passed"
   - If failing, try stopping and starting (not rebooting)

3. **Alternative Connection Methods**
   - Try different browser
   - Clear browser cache
   - Try incognito/private mode
   - Use SSH with key file instead

### If you have SSH key file:
```bash
# In PowerShell (replace with your actual key file path)
ssh -i "C:\Users\YourName\Downloads\your-key.pem" ec2-user@13.210.224.119
