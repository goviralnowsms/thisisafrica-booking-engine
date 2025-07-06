"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <XCircle className="w-16 h-16 text-orange-500" />
          <div className="text-center space-y-2">
            <p className="font-semibold">Your payment was cancelled</p>
            <p className="text-sm text-gray-600">
              No charges were made to your card. You can try again or contact us if you need assistance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
