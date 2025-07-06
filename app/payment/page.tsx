"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { verifyPaymentStatus } from '@/lib/tourplanAPI'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function PaymentStatusPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR' | 'CANCELLED'>('LOADING')
  const [message, setMessage] = useState('')
  const [reference, setReference] = useState('')

  useEffect(() => {
    // Check the URL parameters for payment status
    const checkPaymentStatus = async () => {
      // Extract parameters from URL
      const params = new URLSearchParams(window.location.search)
      const paymentStatus = params.get('status')
      const paymentId = params.get('paymentId')
      const errorMessage = params.get('message')
      
      if (paymentStatus === 'CANCELLED') {
        setStatus('CANCELLED')
        setMessage('Your payment was cancelled. You can try again or contact customer support.')
        return
      }
      
      if (paymentStatus === 'ERROR' || errorMessage) {
        setStatus('ERROR')
        setMessage(errorMessage || 'There was an error processing your payment. Please try again.')
        return
      }
      
      if (paymentId) {
        try {
          // Verify the payment status with our API
          const result = await verifyPaymentStatus(paymentId)
          
          if (result.status === 'COMPLETED') {
            setStatus('SUCCESS')
            setReference(result.reference)
            
            // Store the booking reference in session storage for the confirmation page
            sessionStorage.setItem('bookingReference', result.reference)
            
            // After a short delay, redirect to the confirmation page
            setTimeout(() => {
              router.push('/confirmation')
            }, 3000)
          } else {
            setStatus('ERROR')
            setMessage('Your payment was not completed. Please try again.')
          }
        } catch (error) {
          console.error('Error verifying payment:', error)
          setStatus('ERROR')
          setMessage('There was an error verifying your payment. Please contact customer support.')
        }
      } else {
        setStatus('ERROR')
        setMessage('Invalid payment information. Please try again.')
      }
    }
    
    checkPaymentStatus()
  }, [router])

  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'LOADING' && 'Processing Payment...'}
            {status === 'SUCCESS' && 'Payment Successful!'}
            {status === 'ERROR' && 'Payment Failed'}
            {status === 'CANCELLED' && 'Payment Cancelled'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'LOADING' && (
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          )}
          
          {status === 'SUCCESS' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500" />
              <p className="text-center">Your payment was successful. Booking reference: {reference}</p>
              <p className="text-center text-sm text-gray-500">Redirecting to your booking confirmation...</p>
            </>
          )}
          
          {status === 'ERROR' && (
            <>
              <XCircle className="w-16 h-16 text-red-500" />
              <p className="text-center">{message}</p>
              <Button onClick={() => router.push('/')}>Return to Home</Button>
            </>
          )}
          
          {status === 'CANCELLED' && (
            <>
              <XCircle className="w-16 h-16 text-orange-500" />
              <p className="text-center">{message}</p>
              <Button onClick={() => router.push('/')}>Return to Home</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
