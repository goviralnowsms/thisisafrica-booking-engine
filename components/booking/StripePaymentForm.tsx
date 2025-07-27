'use client'

import { useState, useEffect } from 'react'
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripePaymentFormProps {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function PaymentForm({ amount, onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL after payment
        return_url: `${window.location.origin}/booking/confirmation`,
      },
      redirect: 'if_required',
    })

    if (error) {
      setErrorMessage(error.message || 'Payment failed')
      onError(error.message || 'Payment failed')
      setIsProcessing(false)
    } else {
      // Payment succeeded
      onSuccess('payment_success')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-4">
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {errorMessage}
        </div>
      )}
      
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-amber-500 hover:bg-amber-600"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
          }).format(amount)}`
        )}
      </Button>
    </form>
  )
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Create payment intent when component mounts
  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: props.amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        }
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err)
        props.onError('Failed to initialize payment')
      })
  }, [props.amount, props.onError])

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
        <span className="ml-2">Initializing payment...</span>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#f59e0b',
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  )
}