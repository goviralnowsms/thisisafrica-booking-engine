'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TestEmailsPage() {
  const [loading, setLoading] = useState(false);
  const [emailType, setEmailType] = useState('basic');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [emailConfig, setEmailConfig] = useState<any>(null);

  // Fetch email configuration on component mount
  React.useEffect(() => {
    fetch('/api/email-config')
      .then(res => res.json())
      .then(config => setEmailConfig(config))
      .catch(err => console.error('Failed to fetch email config:', err));
  }, []);

  const sendTestEmail = async () => {
    if (!recipientEmail) {
      toast.error('Please enter a recipient email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          to: recipientEmail,
          customerName: 'Test Customer',
          reference: `TEST-${Date.now()}`,
          productName: 'Test Safari Product',
          dateFrom: '2025-10-15',
          dateTo: '2025-10-22',
          totalCost: 345000,
          currency: 'AUD',
          requiresManualConfirmation: emailType === 'admin',
          tourplanStatus: emailType === 'admin' ? 'NO' : 'OK'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`${emailType} email sent successfully!`);
        setTestResults(prev => [{
          ...result,
          recipientEmail,
          time: new Date().toLocaleTimeString()
        }, ...prev]);
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      toast.error('Error sending test email');
      console.error('Test email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAllEmails = async () => {
    const types = ['basic', 'booking', 'quote', 'admin'];
    
    for (const type of types) {
      setEmailType(type);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await sendTestEmail();
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Email Testing Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send Test Email</CardTitle>
            <CardDescription>Test different email templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Recipient Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="type">Email Type</Label>
              <Select value={emailType} onValueChange={setEmailType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Test Email</SelectItem>
                  <SelectItem value="booking">Booking Confirmation</SelectItem>
                  <SelectItem value="quote">Quote Email</SelectItem>
                  <SelectItem value="admin">Admin Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={sendTestEmail} 
                disabled={loading || !recipientEmail}
                className="flex-1"
              >
                {loading ? 'Sending...' : `Send ${emailType} Email`}
              </Button>
              
              <Button 
                onClick={testAllEmails} 
                disabled={loading || !recipientEmail}
                variant="outline"
              >
                Test All Types
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>Current email settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Service:</span> Resend
              </div>
              <div>
                <span className="font-semibold">From:</span> {emailConfig?.fromEmail || 'noreply@thisisafrica.com.au'}
              </div>
              <div>
                <span className="font-semibold">Admin Emails:</span> {emailConfig?.adminEmails || 'sales@thisisafrica.com.au'}
              </div>
              <div>
                <span className="font-semibold">API Key:</span> {
                  emailConfig === null ? '⏳ Loading...' : 
                  emailConfig?.hasResendKey ? '✅ Configured' : '❌ Not configured'
                }
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> In demo mode, emails are logged to console instead of being sent.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {testResults.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Recent email test attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-semibold">{result.type}</span> to {result.recipientEmail}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{result.time}</span>
                    {result.success ? (
                      <span className="text-green-600">✅ Sent</span>
                    ) : (
                      <span className="text-red-600">❌ Failed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Email Templates Preview</CardTitle>
          <CardDescription>What each email type contains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Basic Test Email</h3>
              <p className="text-sm text-gray-600">Simple test email to verify delivery</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Booking Confirmation</h3>
              <p className="text-sm text-gray-600">
                Sent to customers after booking. Includes booking reference, product details, dates, and total cost.
                For manual bookings (cruise/rail), includes notice about 48-hour confirmation.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Quote Email</h3>
              <p className="text-sm text-gray-600">
                Sent when customer requests a quote. Includes product details, dates, pricing, and instructions to book.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold">Admin Notification</h3>
              <p className="text-sm text-gray-600">
                Sent to admin team when booking is created. Highlights manual processing requirements for cruise/rail.
                Shows TourPlan status and required actions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}