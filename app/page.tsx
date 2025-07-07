"use client"
import { useState, useEffect } from "react"
import { EnhancedSearchForm } from "@/components/enhanced-search-form"
import { TourResults } from "@/components/tour-results"
import { FeaturedTours } from "@/components/featured-tours"
import { BookingForm } from "@/components/booking-form"
import { PaymentForm } from "@/components/payment-form"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export type BookingStep = "search" | "results" | "booking" | "payment" | "confirmation"

export interface ChildInfo {
  id: string
  age: number
}

export interface SearchCriteria {
  country?: string
  destination?: string
  tourLevel?: string
  tourType?: string
  duration?: string
  budget?: string
  startDate?: string
  endDate?: string
  adults?: number
  children?: number
  childrenAges?: ChildInfo[]
}

export interface Tour {
  id: string
  name: string
  description: string
  duration: number
  price: number
  level: string
  availability: "OK" | "RQ" | "NO"
  supplier: string
  location: string
  extras: TourExtra[]
}

export interface TourExtra {
  id: string
  name: string
  description: string
  price: number
  isCompulsory: boolean
}

export interface BookingData {
  tour: Tour
  selectedExtras: string[]
  customerDetails: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
  }
  totalPrice: number
  depositAmount: number
}

export default function BookingEngine() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("search")
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null)
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [bookingReference, setBookingReference] = useState<string>("")
  const [systemStatus, setSystemStatus] = useState<{
    database: "connected" | "demo" | "error"
    tourplan: "connected" | "demo" | "error"
    message: string
  }>({
    database: "demo",
    tourplan: "demo",
    message: "Demo mode - using sample data",
  })
  const [showStatus, setShowStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle URL parameters for direct tour links
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tourId = urlParams.get("tour")
    const country = urlParams.get("country")
    const destination = urlParams.get("destination")

    if (tourId || country || destination) {
      // Pre-populate search criteria from URL
      const criteria: SearchCriteria = {
        country: country || undefined,
        destination: destination || undefined,
      }

      if (Object.keys(criteria).some((key) => criteria[key as keyof SearchCriteria])) {
        setSearchCriteria(criteria)
        setCurrentStep("results")
      }
    }
  }, [])

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        // Check database status
        const dbResponse = await fetch("/api/test-db")
        const dbResult = await dbResponse.json()

        // Check Tourplan connection
        const tpResponse = await fetch("/api/check-tourplan-connection")
        const tpResult = await tpResponse.json()

        setSystemStatus({
          database: dbResult.success ? "connected" : "demo",
          tourplan: tpResult.success ? "connected" : "demo",
          message: dbResult.success && tpResult.success 
            ? "✅ All systems connected" 
            : "Demo mode - using sample data",
        })
      } catch (err) {
        setSystemStatus({
          database: "demo",
          tourplan: "demo",
          message: "Demo mode - using sample data",
        })
      }
    }

    checkSystemStatus()
  }, [])

  const handleSearch = async (criteria: SearchCriteria) => {
    setError(null)
    setSearchCriteria(criteria)
    setCurrentStep("results")
  }

  const handleTourSelect = (tour: Tour) => {
    setSelectedTour(tour)
    setCurrentStep("booking")
  }

  const handleBookingSubmit = (booking: BookingData) => {
    setBookingData(booking)
    setCurrentStep("payment")
  }

  const handlePaymentSuccess = (bookingResult: any) => {
    setBookingReference(bookingResult.bookingReference)
    setCurrentStep("confirmation")
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleBackToSearch = () => {
    setCurrentStep("search")
    setSearchCriteria(null)
    setSelectedTour(null)
    setBookingData(null)
    setBookingReference("")
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* System Status */}
      {showStatus && (
        <div className="container mx-auto px-4 py-2">
          <Alert className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {systemStatus.database === "connected" && systemStatus.tourplan === "connected" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
                <AlertDescription>{systemStatus.message}</AlertDescription>
              </div>
              <button 
                onClick={() => setShowStatus(false)} 
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Hide
              </button>
            </div>
          </Alert>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Status Check Link */}
        {!showStatus && currentStep === "search" && (
          <div className="text-center mb-4">
            <button
              onClick={() => setShowStatus(true)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Check system status
            </button>
          </div>
        )}

        {currentStep === "search" && (
          <>
            <EnhancedSearchForm onSearch={handleSearch} />
            <FeaturedTours onTourSelect={handleTourSelect} />
          </>
        )}

        {currentStep === "results" && searchCriteria && (
          <TourResults
            searchCriteria={searchCriteria}
            onTourSelect={handleTourSelect}
            onBackToSearch={handleBackToSearch}
            onError={handleError}
          />
        )}

        {currentStep === "booking" && selectedTour && searchCriteria && (
          <BookingForm
            tour={selectedTour}
            searchCriteria={searchCriteria}
            onSubmit={handleBookingSubmit}
            onBack={() => setCurrentStep("results")}
            onError={handleError}
          />
        )}

        {currentStep === "payment" && bookingData && (
          <PaymentForm
            bookingData={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        )}

        {currentStep === "confirmation" && bookingReference && (
          <BookingConfirmation
            bookingReference={bookingReference}
            onBackToSearch={handleBackToSearch}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
