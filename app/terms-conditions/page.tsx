'use client';

import { Button } from '@/components/ui/button';

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Welcome to This is Africa. These terms and conditions outline the rules and regulations 
            for the use of our website and services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using this website, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Booking and Payment Terms</h2>
          <p className="mb-4">
            All bookings are subject to availability and confirmation. Payment terms and 
            cancellation policies vary by product and will be clearly communicated at time of booking.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Travel Insurance</h2>
          <p className="mb-4">
            We strongly recommend that all travelers obtain comprehensive travel insurance 
            to protect against unforeseen circumstances.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Liability</h2>
          <p className="mb-4">
            This is Africa acts as an agent for various suppliers and is not responsible for 
            the acts or omissions of such suppliers.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Privacy Policy</h2>
          <p className="mb-4">
            Your privacy is important to us. Please review our Privacy Policy which also 
            governs your use of the website.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Information</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="mb-2"><strong>This is Africa</strong></p>
            <p className="mb-2">Phone: 1300 884 757</p>
            <p className="mb-2">Email: info@thisisafrica.com.au</p>
            <p>ABN: 36 165 885 388</p>
          </div>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-AU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}