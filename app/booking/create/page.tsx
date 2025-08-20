"use client"

// Disable static generation for this dynamic page
export const dynamic = 'force-dynamic'

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Clock, MapPin, ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import StripePaymentForm from "@/components/booking/StripePaymentForm"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createBookingRecord, updateBookingWithTourPlan, type BookingRecord } from "@/lib/supabase"

// Product Details Interface
interface ProductDetails {
  id: string
  code: string
  name: string
  description?: string
  supplier?: string
  supplierName?: string
  duration?: string
  periods?: number
  location?: string
  rates?: Array<{
    currency?: string
    singleRate?: number
    twinRate?: string | number
    twinRateTotal?: number
    twinRateFormatted?: string
    dateRange?: string
    dateFrom?: string
    dateTo?: string
  }>
  notes?: Array<{
    category: string
    text: string
  }>
  content?: {
    introduction?: string
    details?: string
    inclusions?: string
    highlights?: string
    exclusions?: string
    terms?: string
  }
  localAssets?: {
    images: Array<{
      url: string
      originalName: string
      status?: string
    }>
    pdfs: Array<{
      url: string
      name: string
      originalName: string
      status: string
    }>
  }
}

// Steps in the booking process
const BOOKING_STEPS = [
  { id: "tour", title: "Tour Selection" },
  { id: "travelers", title: "Traveler Information" },
  { id: "options", title: "Tour Options" },
  { id: "payment", title: "Payment" },
  { id: "confirmation", title: "Confirmation" },
]

export default function BookingCreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tourId = searchParams.get("tourId")
  const preSelectedDate = searchParams.get("date")
  
  // State for product data
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [productError, setProductError] = useState<string | null>(null)
  
  // State for available dates
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set())
  const [isLoadingDates, setIsLoadingDates] = useState(false)

  // State for the booking process
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [bookingId, setBookingId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    // Tour selection
    tourId: tourId || "",
    departureDate: null as Date | null,
    adults: 2,
    children: [] as Array<{age: number, dateOfBirth: string}>,
    accommodationType: "standard",

    // Traveler information
    contactInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
    travelersInfo: [] as Array<{
      firstName: string
      lastName: string
      email?: string
      phone?: string
      dob: string
      passport: string
      passportExpiry: string
      nationality: string
      dietaryRequirements: string
      isChild?: boolean
      age?: number
    }>,

    // Tour options
    selectedActivities: [] as string[],
    specialRequests: "",
    agreeToTerms: false,

    // Payment
    paymentMethod: "credit-card",
    cardInfo: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    billingAddress: {
      sameAsContact: true,
      address: "",
      city: "",
      country: "",
      postalCode: "",
    },
  })

  // Fetch available dates for calendar highlighting
  const fetchAvailableDates = async (adults?: number, childrenCount?: number) => {
    if (!tourId) return
    
    try {
      setIsLoadingDates(true)
      // Use same date range logic as PricingCalendar to ensure consistency
      const currentDate = new Date()
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) // First day of month
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 6, 0) // 6 months ahead
      
      const params = new URLSearchParams({
        dateFrom: startDate.toISOString().split('T')[0],
        dateTo: endDate.toISOString().split('T')[0],
        adults: (adults || formData.adults).toString(),
        children: (childrenCount !== undefined ? childrenCount : formData.children.length).toString(),
        roomType: 'DB'
      })


      const response = await fetch(`/api/tourplan/pricing/${tourId}?${params}`)
      const result = await response.json()
      
      
      if (result.success && result.data?.calendar) {
        const validDates = new Set<string>()
        result.data.calendar.forEach((day: any) => {
          if (day.validDay && day.available) {
            validDates.add(day.date)
            // Create date in local timezone to avoid UTC conversion issues
            const [year, month, dayNum] = day.date.split('-').map(Number)
            const localDate = new Date(year, month - 1, dayNum)
            const dayOfWeek = localDate.toLocaleDateString('en-US', { weekday: 'long' })
          }
        })
        setAvailableDates(validDates)
      }
    } catch (error) {
    } finally {
      setIsLoadingDates(false)
    }
  }

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!tourId) {
        setProductError("No tour selected")
        setIsLoadingProduct(false)
        return
      }
      
      try {
        setIsLoadingProduct(true)
        const response = await fetch(`/api/tourplan/product/${encodeURIComponent(tourId)}`)
        
        if (!response.ok) {
          setProductError(`Failed to load tour details (${response.status})`)
          return
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          setProductError('Invalid response from server')
          return
        }
        
        const result = await response.json()
        
        if (result.success && result.data) {
          const productData = result.data.data || result.data
          setProduct(productData)
          
          // Pre-fill date if provided in URL
          let initialFormData = { ...formData, tourId }
          if (preSelectedDate) {
            try {
              const dateObj = new Date(preSelectedDate)
              if (!isNaN(dateObj.getTime())) {
                initialFormData.departureDate = dateObj
              }
            } catch (err) {
              console.warn('Invalid pre-selected date:', preSelectedDate)
            }
          }
          setFormData(initialFormData)
          
          // Fetch available dates after product is loaded
          fetchAvailableDates()
        } else {
          setProductError(result.error || "Failed to load tour details")
        }
      } catch (err) {
        setProductError("Failed to load tour details")
      } finally {
        setIsLoadingProduct(false)
      }
    }
    
    fetchProductDetails()
  }, [tourId, preSelectedDate])

  // Initialize travelers array when number of travelers changes
  const initializeTravelers = (adults: number, children: Array<{age: number, dateOfBirth: string}>) => {
    const newTravelers = []
    const totalTravelers = adults + children.length
    
    for (let i = 0; i < totalTravelers; i++) {
      const isChild = i >= adults
      const childIndex = isChild ? i - adults : -1
      
      newTravelers.push({
        firstName: "",
        lastName: "",
        dob: isChild && childIndex >= 0 ? children[childIndex].dateOfBirth : "",
        passport: "",
        passportExpiry: "",
        nationality: "",
        dietaryRequirements: "",
        isChild: isChild,
        age: isChild && childIndex >= 0 ? children[childIndex].age : undefined,
      })
    }
    setFormData((prev) => ({ ...prev, travelersInfo: newTravelers }))
  }

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: string,
    index?: number,
  ) => {
    const { name, value } = e.target

    if (section === "contactInfo") {
      setFormData((prev) => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value },
      }))
    } else if (section === "traveler" && typeof index === "number") {
      const updatedTravelers = [...formData.travelersInfo]
      updatedTravelers[index] = { ...updatedTravelers[index], [name]: value }
      setFormData((prev) => ({ ...prev, travelersInfo: updatedTravelers }))
    } else if (section === "cardInfo") {
      setFormData((prev) => ({
        ...prev,
        cardInfo: { ...prev.cardInfo, [name]: value },
      }))
    } else if (section === "billingAddress") {
      setFormData((prev) => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [name]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Handle checkbox changes
  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        selectedActivities: [...prev.selectedActivities, id],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedActivities: prev.selectedActivities.filter((activityId) => activityId !== id),
      }))
    }
  }

  // Handle billing address checkbox
  const handleBillingAddressSame = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        sameAsContact: checked,
        address: checked ? prev.contactInfo.address : prev.billingAddress.address,
        city: checked ? prev.contactInfo.city : prev.billingAddress.city,
        country: checked ? prev.contactInfo.country : prev.billingAddress.country,
        postalCode: checked ? prev.contactInfo.postalCode : prev.billingAddress.postalCode,
      },
    }))
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, departureDate: date }))
    }
  }

  // Handle adults count change
  const handleAdultsChange = (adults: number) => {
    setFormData((prev) => ({ ...prev, adults }))
    initializeTravelers(adults, formData.children)
    // Refresh available dates with new traveler count
    fetchAvailableDates(adults, formData.children.length)
  }

  // Handle children change
  const handleChildrenChange = (children: Array<{age: number, dateOfBirth: string}>) => {
    setFormData((prev) => ({ ...prev, children }))
    initializeTravelers(formData.adults, children)
    // Refresh available dates with new traveler count
    fetchAvailableDates(formData.adults, children.length)
  }

  // Add a child
  const addChild = (age: number) => {
    // Check minimum age requirement (default to 5 if not specified)
    const minimumAge = 5
    if (age < minimumAge) {
      alert(`This tour has a minimum age requirement of ${minimumAge} years.`)
      return
    }
    
    const today = new Date()
    const birthYear = today.getFullYear() - age
    const dateOfBirth = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    
    const newChildren = [...formData.children, { age, dateOfBirth }]
    handleChildrenChange(newChildren)
  }

  // Remove a child
  const removeChild = (index: number) => {
    const newChildren = formData.children.filter((_, i) => i !== index)
    handleChildrenChange(newChildren)
  }

  // Get base price from product
  const getBasePrice = () => {
    if (!product?.rates || product.rates.length === 0) {
      return 0
    }
    const rate = product.rates[0]
    
    // Check if this is a rail product
    const isRail = product.code?.includes('RLROV') ||     // Rovos Rail codes
                   product.code?.includes('RAIL') ||      // General rail codes
                   product.code?.toLowerCase().includes('rail') ||
                   product.code?.includes('BLUE') ||      // Blue Train codes
                   product.code?.includes('PREMIER')      // Premier Classe codes
    
    // Product type detection for pricing
    
    // Check if this product has corrected pricing (rates already in dollars)
    const hasCorrectedPricing = product.code === 'HDSSPMAKUTSMSSCLS' || 
                               product.code === 'NBOGTARP001CKEKEE' || 
                               product.code === 'NBOGTARP001CKSE' || 
                               product.code === 'NBOGPARP001CKSLP' ||
                               product.code === 'GKPSPSABBLDSABBLS' || 
                               product.code === 'GKPSPSAV002SAVLHM'
    
    // For rail products, twinRate is total for twin room, so divide by 2 for per person
    // For other products, twinRate might already be per person
    if (isRail && (rate.twinRateTotal || rate.twinRate)) {
      const twinRateTotal = rate.twinRateTotal || rate.twinRate || 0
      const price = typeof twinRateTotal === 'string' ? parseFloat(twinRateTotal) : twinRateTotal
      // Convert from cents to dollars, then divide by 2 for per person
      const perPersonPrice = price / 2 / 100
      return perPersonPrice
    } else if (hasCorrectedPricing) {
      // For products with corrected pricing, rates are already in dollars, divide twin rate by 2 for per person
      const baseRate = rate.twinRateTotal || rate.twinRate || rate.doubleRate || rate.singleRate || 0
      const price = typeof baseRate === 'string' ? parseFloat(baseRate) : baseRate
      const perPersonPrice = (rate.twinRateTotal || rate.twinRate) ? price / 2 : price // Divide twin rates by 2 for per person
      return perPersonPrice
    } else {
      // For standard products, rates are in cents and need conversion to dollars
      const baseRate = rate.twinRateTotal || rate.twinRate || rate.doubleRate || rate.singleRate || 0
      const price = typeof baseRate === 'string' ? parseFloat(baseRate) : baseRate
      // Convert from cents to dollars, then if using twinRateTotal, divide by 2 for per person
      const rateInDollars = price / 100
      const perPersonPrice = rate.twinRateTotal ? rateInDollars / 2 : rateInDollars
      return perPersonPrice
    }
  }

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = getBasePrice()
    
    // Base price for adults (full price)
    const adultPrice = basePrice * formData.adults
    
    // Children pricing (different rates by age)
    const childPrice = formData.children.reduce((total, child) => {
      if (child.age < 2) return total // Infants free
      if (child.age < 12) return total + (basePrice * 0.5) // Children 50% of adult price
      return total + (basePrice * 0.75) // Teens 75% of adult price
    }, 0)
    
    const totalPrice = adultPrice + childPrice
    const totalTravelers = formData.adults + formData.children.length

    // For now, no accommodation upgrades or activities from API
    const accommodationCost = 0
    const activitiesCost = 0

    const subtotal = totalPrice + accommodationCost + activitiesCost
    const taxes = subtotal * 0.15 // 15% tax

    return {
      basePrice: totalPrice,
      accommodationCost,
      activitiesCost,
      subtotal,
      taxes,
      total: subtotal + taxes,
    }
  }

  // Navigate to next step
  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 0 && !formData.departureDate) {
      alert("Please select a departure date")
      return
    }

    if (currentStep === 1) {
      // Validate lead traveler info
      const leadTraveler = formData.travelersInfo[0]
      if (!leadTraveler || !leadTraveler.firstName || !leadTraveler.lastName || !leadTraveler.email || !leadTraveler.phone) {
        alert("Please fill in all required lead traveler information (name, email, and phone)")
        return
      }
      
      
      // Validate other travelers have at least names
      for (let i = 1; i < formData.adults; i++) {
        const traveler = formData.travelersInfo[i]
        if (!traveler || !traveler.firstName || !traveler.lastName) {
          alert(`Please provide first and last name for Adult ${i + 1}`)
          return
        }
      }
      
      // Validate children have names and DOB
      for (let i = 0; i < formData.children.length; i++) {
        const childIndex = formData.adults + i
        const traveler = formData.travelersInfo[childIndex]
        if (!traveler || !traveler.firstName || !traveler.lastName || !traveler.dob) {
          alert(`Please provide first name, last name, and date of birth for Child ${i + 1}`)
          return
        }
      }
    }

    if (currentStep === 3) {
      // Validate terms agreement before payment
      if (!formData.agreeToTerms) {
        alert("Please agree to the Terms & Conditions and Privacy Policy to continue.")
        return
      }
      // Payment is handled by Stripe component, no manual validation needed
      return
    }

    // If we're on the last step, submit the booking
    if (currentStep === BOOKING_STEPS.length - 2) {
      handleSubmitBooking()
      return
    }

    // Otherwise, go to the next step
    setCurrentStep((prev) => prev + 1)
  }

  // Navigate to previous step
  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  // Submit booking
  const handleSubmitBooking = async () => {
    setIsSubmitting(true)

    try {
      // For TourPlan bookings, we need to get the actual RateId from rate details
      // The rateName from product might not be the correct RateId for booking
      let rateId = ''
      
      try {
        // Get rate details to find the correct RateId for booking
        if (!formData.departureDate) {
          throw new Error('No departure date selected')
        }
        const dateFromStr = format(formData.departureDate, 'yyyy-MM-dd')
        
        const rateResponse = await fetch(`/api/tourplan/rate-details?productCode=${tourId}&dateFrom=${dateFromStr}&adults=${formData.adults}&children=${formData.children.length}`)
        const rateResult = await rateResponse.json()
        
        if (rateResult.success && rateResult.data?.rateId) {
          const foundRateId = rateResult.data.rateId
          rateId = foundRateId
        } else {
          rateId = null // This will cause RateId element to be omitted
        }
      } catch (error) {
        rateId = null // Fallback to omitting RateId
      }
      
      
      // Skip Supabase pricing calculations - going directly to TourPlan
      // If needed for display, use: const { total, basePrice, accommodationCost, activitiesCost, subtotal, taxes } = calculateTotal()
      
      
      const leadTraveler = formData.travelersInfo[0]
      
      // Create booking via TourPlan API
      const bookingData = {
        customerName: `${leadTraveler?.firstName || ''} ${leadTraveler?.lastName || ''}`,
        email: leadTraveler?.email || '',
        mobile: leadTraveler?.phone || '',
        bookingType: 'quote', // Always use quote mode to match WQ status
        productCode: tourId,
        rateId: rateId,
        dateFrom: formData.departureDate ? format(formData.departureDate, 'yyyy-MM-dd') : '',
        dateTo: formData.departureDate ? format(formData.departureDate, 'yyyy-MM-dd') : '',
        adults: formData.adults,
        children: formData.children.length,
        infants: formData.children.filter(c => c.age < 2).length,
        note: formData.specialRequests,
      }

      
      console.log('🚨 BOOKING FORM - About to call API with data:', bookingData);
      console.log('🚨 BOOKING FORM - tourId from URL:', tourId);
      console.log('🚨 BOOKING FORM - productCode being sent:', bookingData.productCode);
      
      const response = await fetch('/api/tourplan/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      let result
      const responseText = await response.text()
      
      try {
        result = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        result = { error: 'Invalid JSON response', rawResponse: responseText }
      }

      // Handle both standard TourPlan responses and special cases like rail bookings
      // Rail bookings get double-wrapped by successResponse(), so check nested structure too
      const isRailBooking = result.data?.requiresManualConfirmation || result.data?.allowPayment;
      const isQuoteBooking = result.data?.requiresManualConfirmation || result.data?.status === 'WEBSITE_QUOTE' || result.data?.status === 'PENDING_CONFIRMATION';
      // Enhanced success detection - also check for quote bookings and manual confirmation bookings
      const isSuccess = result.success && (result.data || result.requiresManualConfirmation || result.allowPayment) || 
                       (result.data?.requiresManualConfirmation && result.data?.reference) ||
                       (result.data?.status === 'WEBSITE_QUOTE' && result.data?.reference);
      
      
      if (isSuccess) {
        // For quote bookings, rail bookings, and standard bookings, use appropriate data source
        const dataSource = isQuoteBooking || isRailBooking ? result.data : (result.data || result);
        const bookingRef = dataSource.bookingRef || dataSource.bookingReference || dataSource.reference || dataSource.id || `TEMP-${Date.now()}`;
        const bookingIdValue = dataSource.bookingId || dataSource.id || null;
        const requiresManualConfirmation = dataSource.requiresManualConfirmation || result.requiresManualConfirmation || false;
        const status = dataSource.status;
        const tourplanStatus = dataSource.tourplanStatus;
        
        
        setBookingReference(bookingRef);
        setBookingId(bookingIdValue);
        setBookingComplete(true);
        setCurrentStep(BOOKING_STEPS.length - 1);
        
        
        // Handle different booking scenarios
        if (requiresManualConfirmation || status === 'PENDING_CONFIRMATION' || status === 'WEBSITE_QUOTE' || tourplanStatus === 'NO' || tourplanStatus === 'WQ') {
          
          // Debug: Log product data to understand what's available
          console.log('Product data:', product);
          console.log('DataSource product details:', dataSource.productDetails);
          
          // Clear any previous booking data to prevent stale data issues
          sessionStorage.removeItem('manualConfirmationBooking');
          
          // Store booking data for confirmation page
          const bookingData = {
            reference: bookingRef,
            bookingId: bookingIdValue, // Include TourPlan BookingId for My Bookings access
            message: dataSource.message || 'Booking requires manual confirmation. You will be contacted within 48 hours.',
            productCode: dataSource.productDetails?.code || product?.code || tourId,
            productName: product?.name || dataSource.productDetails?.name || 'African Adventure',
            productLocation: product?.location || dataSource.productDetails?.location || 'Africa',
            productSupplier: product?.supplierName || product?.supplier || dataSource.productDetails?.supplier,
            dateFrom: formData.departureDate ? format(formData.departureDate, 'yyyy-MM-dd') : (dataSource.productDetails?.dateFrom || ''),
            adults: formData.adults || dataSource.productDetails?.adults || formData.travelersInfo.filter(t => t.type === 'Adult').length,
            children: formData.children?.length || dataSource.productDetails?.children || formData.travelersInfo.filter(t => t.type === 'Child').length,
            totalCost: dataSource.productDetails?.totalCost || (getBasePrice() * formData.travelersInfo.length * 100), // Store in cents
            customerName: `${formData.travelersInfo[0]?.firstName} ${formData.travelersInfo[0]?.lastName}`,
            customerEmail: formData.travelersInfo[0]?.email,
            customerPhone: formData.travelersInfo[0]?.phone
          };
          
          // Store for confirmation page
          sessionStorage.setItem('manualConfirmationBooking', JSON.stringify(bookingData));
          
          // For TIA bookings, also store in localStorage for My Bookings retrieval
          if (bookingRef.startsWith('TIA-')) {
            const tiaBookings = JSON.parse(localStorage.getItem('tiaBookings') || '{}');
            tiaBookings[bookingRef] = {
              ...bookingData,
              createdAt: new Date().toISOString(),
              status: 'pending-confirmation'
            };
            localStorage.setItem('tiaBookings', JSON.stringify(tiaBookings));
            console.log('📌 Stored TIA booking for My Bookings:', bookingRef);
          }
          
          // Check if this booking allows payment (e.g., rail products)
          if (dataSource.allowPayment || status === 'PAYMENT_PENDING') {
            // Stay on payment step - will redirect after successful payment
            // The payment success handler will redirect to confirmation
          } else {
            // Redirect to confirmation page with manual confirmation flag
            router.push(`/booking-confirmation?reference=${bookingRef}&bookingId=${bookingIdValue || ''}&manual=true`);
          }
        } else if (!bookingIdValue) {
          router.push(`/booking-confirmation?reference=${bookingRef}&bookingId=${bookingIdValue || ''}&status=partial`);
        } else {
          // Standard TourPlan booking success
          router.push(`/booking-confirmation?reference=${bookingRef}&bookingId=${bookingIdValue || ''}`);
        }
      } else if (result.success === false && result.message && result.message.includes('booking ID received')) {
        // Special case: "Invalid booking response - no booking ID received" 
        // This means the booking likely succeeded but we couldn't parse the ID
        
        const tempRef = `TEMP-${Date.now()}`;
        setBookingReference(tempRef);
        setBookingComplete(true);
        setCurrentStep(BOOKING_STEPS.length - 1);
        
        alert(`Booking appears to have been created but we couldn't retrieve the booking ID. Reference: ${tempRef}. Please contact support for confirmation.`);
        router.push(`/booking-confirmation?reference=${tempRef}&status=partial`);
      } else {
        
        // Check if this is actually a successful booking with unclear response structure
        const hasBookingReference = result.data?.bookingRef || result.data?.bookingReference || result.data?.reference || result.bookingRef || result.bookingReference || result.reference;
        const hasManualConfirmation = result.data?.requiresManualConfirmation;
        const isQuoteStatus = result.data?.status === 'WEBSITE_QUOTE' || result.data?.status === 'PENDING_CONFIRMATION';
        
        if (hasBookingReference || hasManualConfirmation || isQuoteStatus) {
          
          // Show less alarming message for successful bookings that need confirmation
          if (hasManualConfirmation || isQuoteStatus) {
            alert('Booking submitted successfully! Your quote is being prepared and you will be contacted within 48 hours.');
          } else {
            // Just a quick "Processing..." message instead of error
            alert('Processing complete. Redirecting to confirmation...');
          }
          
          setBookingReference(hasBookingReference || `TIA-${Date.now()}`);
          setBookingComplete(true);
          setCurrentStep(BOOKING_STEPS.length - 1);
          router.push(`/booking-confirmation?reference=${hasBookingReference || `TIA-${Date.now()}`}`);
          return;
        }
        
        // Only show error for actual failures
        let errorMsg = "Unable to complete booking at this time"
        if (result.message && !result.message.includes('booking')) {
          errorMsg = result.message
        } else if (result.error && !result.error.includes('booking')) {
          errorMsg = result.error
        } else if (response.status >= 500) {
          errorMsg = "Server temporarily unavailable - please try again"
        } else if (response.status === 400) {
          errorMsg = "Please check your information and try again"
        }
        
        // Only alert if this seems like a real error (no booking reference found)
        alert(errorMsg)
      }
    } catch (error) {
      alert("Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const { basePrice, accommodationCost, activitiesCost, subtotal, taxes, total } = calculateTotal()

  // Show loading state
  if (isLoadingProduct) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mr-3" />
                <span className="text-lg">Loading tour details...</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Show error state
  if (productError || !product || !tourId) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{productError || "Tour not found"}</p>
              <Button onClick={() => router.push('/booking')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tours
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 pt-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-6">Book Your African Adventure</h1>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress value={((currentStep + 1) / BOOKING_STEPS.length) * 100} className="h-2" />
            <div className="flex justify-between mt-2">
              {BOOKING_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-xs font-medium ${index <= currentStep ? "text-amber-600" : "text-gray-400"}`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          {/* Booking form */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* Step 1: Tour Selection */}
            {currentStep === 0 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Tour Selection</h2>

                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="md:w-1/3">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={product.localAssets?.images?.[0]?.url || "/images/safari-lion.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{product.location || product.supplierName || 'Africa'}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{product.duration === '6 days' ? '7 days' : product.duration || (product.periods ? `${product.periods} nights / ${product.periods + 1} days` : 'Multiple days')}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{product.comment || product.description || "Experience the magic of Africa"}</p>
                    <div className="text-lg font-bold">
                      {product.rates?.[0]?.twinRateFormatted && product.rates[0].twinRateFormatted !== 'Price on application' ? (
                        product.rates[0].twinRateFormatted
                      ) : (
                        <div className="text-amber-600">Price shown after date selection</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="departure-date">Departure Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !formData.departureDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.departureDate ? format(formData.departureDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.departureDate || undefined}
                          onSelect={handleDateSelect}
                          initialFocus
                          disabled={(date) => {
                            // Disable past dates
                            if (date < new Date()) return true
                            
                            // If we have available dates, only allow those
                            if (availableDates.size > 0) {
                              // Convert date to local timezone string for comparison
                              const year = date.getFullYear()
                              const month = String(date.getMonth() + 1).padStart(2, '0')
                              const day = String(date.getDate()).padStart(2, '0')
                              const dateStr = `${year}-${month}-${day}`
                              return !availableDates.has(dateStr)
                            }
                            
                            // Otherwise allow any future date
                            return false
                          }}
                          modifiers={{
                            available: (date) => {
                              // Convert date to local timezone string for comparison
                              const year = date.getFullYear()
                              const month = String(date.getMonth() + 1).padStart(2, '0')
                              const day = String(date.getDate()).padStart(2, '0')
                              const dateStr = `${year}-${month}-${day}`
                              return availableDates.has(dateStr)
                            }
                          }}
                          modifiersStyles={{
                            available: {
                              backgroundColor: '#10b981',
                              color: 'white',
                              fontWeight: 'bold'
                            }
                          }}
                        />
                        <div className="p-3 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <p className="text-sm text-gray-600">Available departure dates</p>
                          </div>
                          {isLoadingDates && (
                            <p className="text-xs text-gray-500 mt-1">Loading available dates...</p>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="adults">Adults (18+)</Label>
                    <Select value={formData.adults.toString()} onValueChange={(value) => handleAdultsChange(Number.parseInt(value))}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select number of adults" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4 Adults</SelectItem>
                        <SelectItem value="5">5 Adults</SelectItem>
                        <SelectItem value="6">6 Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Children Section */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label>Children (Ages at time of travel)</Label>
                    <div className="text-sm text-gray-600">
                      <div>Minimum age: 5 years</div>
                      <div>Ages 2-11: 50% of adult price</div>
                      <div>Ages 12-17: 75% of adult price</div>
                    </div>
                  </div>
                  
                  {formData.children.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {formData.children.map((child, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span>Child {index + 1}: Age {child.age}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChild(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addChild(6)}
                      className="text-sm"
                    >
                      + Child (5-11)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addChild(15)}
                      className="text-sm"
                    >
                      + Teen (12-17)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const age = prompt(`Enter child's age (minimum 5 years):`)
                        if (age) {
                          const ageNum = parseInt(age)
                          if (ageNum >= 5 && ageNum <= 17) {
                            addChild(ageNum)
                          } else {
                            alert(`Age must be between 5 and 17 years.`)
                          }
                        }
                      }}
                      className="text-sm"
                    >
                      + Custom Age
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="accommodation-type">Accommodation Type</Label>
                  <RadioGroup
                    value={formData.accommodationType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, accommodationType: value }))}
                    className="mt-2 space-y-4"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="standard" id="standard" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label htmlFor="standard" className="font-medium">
                          Standard Accommodation
                        </Label>
                        <p className="text-sm text-gray-500">As specified in the tour itinerary</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 2: Traveler Information */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Traveler Information</h2>


                {/* Lead Traveler Only */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Lead Traveler Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lead-firstName">First Name *</Label>
                      <Input
                        id="lead-firstName"
                        name="firstName"
                        value={formData.travelersInfo[0]?.firstName || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-lastName">Last Name *</Label>
                      <Input
                        id="lead-lastName"
                        name="lastName"
                        value={formData.travelersInfo[0]?.lastName || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-email">Email Address *</Label>
                      <Input
                        id="lead-email"
                        name="email"
                        type="email"
                        value={formData.travelersInfo[0]?.email || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-phone">Phone Number *</Label>
                      <Input
                        id="lead-phone"
                        name="phone"
                        value={formData.travelersInfo[0]?.phone || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        required
                        className="mt-1"
                        placeholder="+61 123 456 789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-nationality">Nationality (Optional)</Label>
                      <Input
                        id="lead-nationality"
                        name="nationality"
                        value={formData.travelersInfo[0]?.nationality || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        className="mt-1"
                        placeholder="e.g. Australian"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lead-passport">Passport Number (Optional)</Label>
                      <Input
                        id="lead-passport"
                        name="passport"
                        value={formData.travelersInfo[0]?.passport || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        className="mt-1"
                        placeholder="Can be provided later"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="lead-dietaryRequirements">Dietary Requirements (Optional)</Label>
                      <Input
                        id="lead-dietaryRequirements"
                        name="dietaryRequirements"
                        value={formData.travelersInfo[0]?.dietaryRequirements || ''}
                        onChange={(e) => handleInputChange(e, "traveler", 0)}
                        className="mt-1"
                        placeholder="Any special dietary needs for your group"
                      />
                    </div>
                  </div>
                </div>


                {/* Other Adult Travelers */}
                {formData.adults > 1 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Other Adult Travelers</h3>
                    <p className="text-gray-600 mb-4">Please provide names for all travelers. Other details are optional.</p>
                    {Array.from({ length: formData.adults - 1 }, (_, i) => {
                      const index = i + 1
                      return (
                        <div key={index} className="mb-6">
                          <h4 className="text-md font-medium mb-3">Adult {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`adult-${index}-firstName`}>First Name *</Label>
                              <Input
                                id={`adult-${index}-firstName`}
                                name="firstName"
                                value={formData.travelersInfo[index]?.firstName || ''}
                                onChange={(e) => handleInputChange(e, "traveler", index)}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`adult-${index}-lastName`}>Last Name *</Label>
                              <Input
                                id={`adult-${index}-lastName`}
                                name="lastName"
                                value={formData.travelersInfo[index]?.lastName || ''}
                                onChange={(e) => handleInputChange(e, "traveler", index)}
                                required
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Children */}
                {formData.children.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Children</h3>
                    <p className="text-gray-600 mb-4">Date of birth is required for children to confirm age eligibility.</p>
                    {formData.children.map((child, childIndex) => {
                      const travelerIndex = formData.adults + childIndex
                      return (
                        <div key={travelerIndex} className="mb-6">
                          <h4 className="text-md font-medium mb-3">Child {childIndex + 1} (Age {child.age})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`child-${childIndex}-firstName`}>First Name *</Label>
                              <Input
                                id={`child-${childIndex}-firstName`}
                                name="firstName"
                                value={formData.travelersInfo[travelerIndex]?.firstName || ''}
                                onChange={(e) => handleInputChange(e, "traveler", travelerIndex)}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`child-${childIndex}-lastName`}>Last Name *</Label>
                              <Input
                                id={`child-${childIndex}-lastName`}
                                name="lastName"
                                value={formData.travelersInfo[travelerIndex]?.lastName || ''}
                                onChange={(e) => handleInputChange(e, "traveler", travelerIndex)}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`child-${childIndex}-dob`}>Date of Birth *</Label>
                              <Input
                                id={`child-${childIndex}-dob`}
                                name="dob"
                                type="date"
                                value={formData.travelersInfo[travelerIndex]?.dob || child.dateOfBirth}
                                onChange={(e) => handleInputChange(e, "traveler", travelerIndex)}
                                required
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Tour Options */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Tour Options</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Optional Activities</h3>
                  <p className="text-gray-600 mb-4">
                    Enhance your tour with these optional activities (price is per person)
                  </p>

                  <p className="text-gray-600">Optional activities can be arranged separately. Please contact us for available options.</p>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    className="mt-1"
                    rows={4}
                    placeholder="Please let us know if you have any special requests or requirements for your tour"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => 
                        setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))
                      }
                      required
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm text-gray-600 cursor-pointer">
                      * I agree with{' '}
                      <a href="/terms-conditions" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
                        Privacy Policy
                      </a>
                      .
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold mb-6">Payment Information</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Deposit Required</h4>
                    <div className="text-blue-700">
                      <div className="flex justify-between">
                        <span>Deposit (30%):</span>
                        <span className="font-semibold">${(total * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="text-sm mt-2">
                        Remaining balance (${(total * 0.7).toLocaleString()}) due 60 days before departure
                      </div>
                    </div>
                  </div>
                  
                  {/* Important Disclaimer */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-1">Important Notice</h4>
                        <p className="text-amber-700 text-sm">
                          Please note that online bookings are subject to final confirmation from the This is Africa team.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {total > 0 ? (
                    <StripePaymentForm
                      amount={total * 0.3} // 30% deposit
                      onSuccess={async (paymentIntentId) => {
                        console.log('🚨🚨🚨 PAYMENT SUCCESS HANDLER TRIGGERED 🚨🚨🚨');
                        console.log('Payment Intent ID:', paymentIntentId);
                        
                        // Check if this is a manual confirmation booking that already exists
                        const manualBookingData = sessionStorage.getItem('manualConfirmationBooking')
                        console.log('Manual booking data exists:', !!manualBookingData);
                        if (manualBookingData) {
                          const bookingData = JSON.parse(manualBookingData)
                          console.log('Booking data:', bookingData)
                          
                          // Create Supabase record for rail booking so it appears in My Bookings
                          try {
                            const leadTraveler = formData.travelersInfo[0]
                            const supabaseBookingData: Omit<BookingRecord, 'id' | 'created_at' | 'updated_at'> = {
                              product_code: bookingData.productCode || product.code,
                              product_name: product.name,
                              departure_date: bookingData.dateFrom || formData.selectedDates?.start || formData.departureDate,
                              return_date: formData.selectedDates?.end,
                              adults: formData.adults,
                              children: formData.children.length,
                              lead_traveler_first_name: leadTraveler?.firstName || '',
                              lead_traveler_last_name: leadTraveler?.lastName || '',
                              lead_traveler_email: leadTraveler?.email || '',
                              lead_traveler_phone: leadTraveler?.phone || '',
                              special_requests: formData.specialRequests,
                              status: 'pending_confirmation', // Special status for manual rail bookings
                              total_price: Math.round(total * 100), // Store in cents
                              currency: 'AUD',
                              booking_source: 'website',
                              tourplan_reference: bookingData.bookingReference || bookingData.bookingRef || bookingData.id,
                              payment_status: 'deposit_paid',
                              accommodation_preferences: formData.accommodationPreferences,
                              dietary_requirements: formData.dietaryRequirements?.join(', ') || '',
                              user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
                            }
                            
                            const supabaseBooking = await createBookingRecord(supabaseBookingData)
                          } catch (supabaseError) {
                            // Don't fail the flow - payment was successful
                          }
                          
                          // Send confirmation email after successful payment
                          try {
                            console.log('📧 Sending confirmation email after payment success');
                            const leadTravelerForEmail = formData.travelersInfo[0];
                            console.log('📧 Lead traveler email:', leadTravelerForEmail?.email);
                            const emailResponse = await fetch('/api/test-email', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                type: 'booking', // CRITICAL: This tells the API to use the booking template
                                to: leadTravelerForEmail?.email || bookingData.customerEmail,
                                reference: bookingData.reference,
                                customerName: bookingData.customerName || `${leadTravelerForEmail?.firstName} ${leadTravelerForEmail?.lastName}`,
                                productName: product.name || bookingData.productName,
                                dateFrom: bookingData.dateFrom,
                                dateTo: bookingData.dateTo,
                                totalCost: Math.round((total * 0.3) * 100), // Deposit amount in cents
                                currency: 'AUD',
                                status: 'PENDING_CONFIRMATION',
                                requiresManualConfirmation: true
                              })
                            });
                            const emailResult = await emailResponse.json();
                            console.log('📧 Email result:', emailResult);
                          } catch (emailError) {
                            console.error('❌ Failed to send email:', emailError);
                          }

                          // Go directly to confirmation with payment success
                          const bookingRef = bookingData.reference || bookingData.bookingReference || bookingData.bookingRef || bookingData.id
                          router.push(`/booking-confirmation?reference=${bookingRef}&manual=true&paid=true`)
                        } else {
                          // Standard booking flow
                          handleSubmitBooking()
                        }
                      }}
                      onError={(error) => {
                        alert(`Payment failed: ${error}`)
                      }}
                    />
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800">Loading pricing information...</p>
                      <p className="text-sm text-yellow-600 mt-1">Please wait while we calculate your tour price.</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="billing-same"
                      checked={formData.billingAddress.sameAsContact}
                      onCheckedChange={(checked) => handleBillingAddressSame(checked as boolean)}
                    />
                    <Label htmlFor="billing-same">Same as contact address</Label>
                  </div>

                  {!formData.billingAddress.sameAsContact && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="billing-address">Address</Label>
                        <Input
                          id="billing-address"
                          name="address"
                          value={formData.billingAddress.address}
                          onChange={(e) => handleInputChange(e, "billingAddress")}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-city">City</Label>
                        <Input
                          id="billing-city"
                          name="city"
                          value={formData.billingAddress.city}
                          onChange={(e) => handleInputChange(e, "billingAddress")}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billing-postalCode">Postal Code</Label>
                        <Input
                          id="billing-postalCode"
                          name="postalCode"
                          value={formData.billingAddress.postalCode}
                          onChange={(e) => handleInputChange(e, "billingAddress")}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="billing-country">Country</Label>
                        <Select
                          value={formData.billingAddress.country}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              billingAddress: { ...prev.billingAddress, country: value },
                            }))
                          }
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="new-zealand">New Zealand</SelectItem>
                            <SelectItem value="united-states">United States</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Adults ({formData.adults})</span>
                      <span>{product.rates?.[0]?.currency || 'AUD'} ${(getBasePrice() * formData.adults).toLocaleString()}</span>
                    </div>
                    
                    {formData.children.length > 0 && formData.children.map((child, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>Child {index + 1} (Age {child.age})</span>
                        <span>
                          {child.age < 2 
                            ? 'Free' 
                            : child.age < 12 
                              ? `$${(getBasePrice() * 0.5).toLocaleString()}` 
                              : `$${(getBasePrice() * 0.75).toLocaleString()}`}
                        </span>
                      </div>
                    ))}

                    {accommodationCost > 0 && (
                      <div className="flex justify-between">
                        <span>Accommodation Upgrade</span>
                        <span>${accommodationCost.toLocaleString()}</span>
                      </div>
                    )}

                    {activitiesCost > 0 && (
                      <div className="flex justify-between">
                        <span>Optional Activities</span>
                        <span>${activitiesCost.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Taxes & Fees (15%)</span>
                      <span>${taxes.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                      <span>Total</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Payment Schedule</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div className="flex justify-between">
                          <span>Deposit (30%):</span>
                          <span className="font-semibold">${(total * 0.3).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Final Payment (70%):</span>
                          <span>${(total * 0.7).toLocaleString()}</span>
                        </div>
                        <div className="mt-2 text-xs">
                          Final payment due 60 days before departure
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for booking with This is Africa. Your booking reference is:
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-2xl font-bold text-amber-700">{bookingReference}</p>
                </div>
                <p className="text-gray-600 mb-8">
                  We've sent a confirmation email to {formData.travelersInfo[0]?.email} with all the details of your booking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => router.push("/")} variant="outline">
                    Return to Homepage
                  </Button>
                  <Button onClick={() => router.push(`/booking-confirmation?reference=${bookingReference}`)} className="bg-amber-500 hover:bg-amber-600">
                    View Booking Details
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {currentStep < BOOKING_STEPS.length - 1 && (
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleNextStep} className="bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : currentStep === BOOKING_STEPS.length - 2 ? (
                    <>Complete Booking</>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
