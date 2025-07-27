"use client"

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
  
  // State for product data
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [productError, setProductError] = useState<string | null>(null)

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
        const response = await fetch(`/api/tourplan/product/${tourId}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          const productData = result.data.data || result.data
          setProduct(productData)
          setFormData(prev => ({ ...prev, tourId }))
        } else {
          setProductError(result.error || "Failed to load tour details")
        }
      } catch (err) {
        setProductError("Failed to load tour details")
        console.error(err)
      } finally {
        setIsLoadingProduct(false)
      }
    }
    
    fetchProductDetails()
  }, [tourId])

  // Initialize travelers array when number of travelers changes
  const initializeTravelers = (adults: number, children: Array<{age: number, dateOfBirth: string}>) => {
    const newTravelers = []
    const totalTravelers = adults + children.length
    
    for (let i = 0; i < totalTravelers; i++) {
      const isChild = i >= adults
      const childIndex = isChild ? i - adults : -1
      
      newTravelers.push({
        firstName: i === 0 ? formData.contactInfo.firstName : "",
        lastName: i === 0 ? formData.contactInfo.lastName : "",
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
  }

  // Handle children change
  const handleChildrenChange = (children: Array<{age: number, dateOfBirth: string}>) => {
    setFormData((prev) => ({ ...prev, children }))
    initializeTravelers(formData.adults, children)
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
      console.log('❌ No rates found, product:', product?.name, 'rates:', product?.rates)
      return 0
    }
    const rate = product.rates[0]
    console.log('✅ Rate found:', rate)
    
    // Try different rate types in order of preference
    const baseRate = rate.twinRateTotal || rate.twinRate || rate.doubleRate || rate.singleRate || 0
    const price = typeof baseRate === 'string' ? parseFloat(baseRate) : baseRate
    console.log('💰 Final price:', price, 'from:', rate.twinRateTotal ? 'twinRateTotal' : rate.twinRate ? 'twinRate' : rate.doubleRate ? 'doubleRate' : rate.singleRate ? 'singleRate' : 'none')
    return price
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
      // Validate contact info
      const { firstName, lastName, email, phone } = formData.contactInfo
      if (!firstName || !lastName || !email || !phone) {
        alert("Please fill in all required contact information")
        return
      }
    }

    if (currentStep === 3) {
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
      // Get the first available rate ID from the product
      const rateId = product?.rates?.[0]?.id || 'STANDARD'
      
      // Create booking via TourPlan API
      const bookingData = {
        customerName: `${formData.contactInfo.firstName} ${formData.contactInfo.lastName}`,
        email: formData.contactInfo.email,
        mobile: formData.contactInfo.phone,
        bookingType: 'quote', // Start as quote, convert to booking after payment
        productCode: tourId,
        rateId: rateId,
        dateFrom: formData.departureDate ? format(formData.departureDate, 'yyyy-MM-dd') : '',
        dateTo: formData.departureDate ? format(formData.departureDate, 'yyyy-MM-dd') : '',
        adults: formData.adults,
        children: formData.children.length,
        infants: formData.children.filter(c => c.age < 2).length,
        note: formData.specialRequests,
      }

      console.log('Submitting booking:', bookingData)

      const response = await fetch('/api/tourplan/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success && result.data) {
        setBookingReference(result.data.bookingRef || result.data.bookingReference || result.data.id)
        setBookingId(result.data.bookingId || result.data.id)
        setBookingComplete(true)
        setCurrentStep(BOOKING_STEPS.length - 1)
        
        // Redirect to confirmation page
        router.push(`/booking-confirmation?reference=${result.data.bookingRef || result.data.bookingReference || result.data.id}`)
      } else {
        console.error("Booking error:", result)
        alert(result.error || result.details || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
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
                      {product.rates?.[0]?.twinRateFormatted ? (
                        product.rates[0].twinRateFormatted
                      ) : (
                        <Button className="bg-amber-500 hover:bg-amber-600">Book Now</Button>
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
                            // Allow any future date
                            return date < new Date()
                          }}
                        />
                        <div className="p-3 border-t border-gray-100">
                          <p className="text-sm text-gray-500">Available departure dates highlighted</p>
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

                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.contactInfo.firstName}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.contactInfo.lastName}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.contactInfo.address}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.contactInfo.city}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.contactInfo.postalCode}
                        onChange={(e) => handleInputChange(e, "contactInfo")}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={formData.contactInfo.country}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, country: value },
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
                </div>

                {/* Traveler details */}
                {formData.travelersInfo.map((traveler, index) => {
                  const isFirstAdult = index === 0
                  const isChild = traveler.isChild
                  const childIndex = isChild ? index - formData.adults + 1 : 0
                  const adultIndex = !isChild ? index + 1 : 0
                  
                  return (
                  <div key={index} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      {isFirstAdult 
                        ? "Lead Traveler (Adult)" 
                        : isChild 
                          ? `Child ${childIndex} (Age ${traveler.age})` 
                          : `Adult ${adultIndex}`}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`traveler-${index}-firstName`}>First Name</Label>
                        <Input
                          id={`traveler-${index}-firstName`}
                          name="firstName"
                          value={traveler.firstName}
                          onChange={(e) => handleInputChange(e, "traveler", index)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`traveler-${index}-lastName`}>Last Name</Label>
                        <Input
                          id={`traveler-${index}-lastName`}
                          name="lastName"
                          value={traveler.lastName}
                          onChange={(e) => handleInputChange(e, "traveler", index)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`traveler-${index}-dob`}>Date of Birth</Label>
                        <Input
                          id={`traveler-${index}-dob`}
                          name="dob"
                          type="date"
                          value={traveler.dob}
                          onChange={(e) => handleInputChange(e, "traveler", index)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`traveler-${index}-nationality`}>Nationality</Label>
                        <Select
                          value={traveler.nationality}
                          onValueChange={(value) => {
                            const updatedTravelers = [...formData.travelersInfo]
                            updatedTravelers[index] = { ...updatedTravelers[index], nationality: value }
                            setFormData((prev) => ({ ...prev, travelersInfo: updatedTravelers }))
                          }}
                        >
                          <SelectTrigger className="w-full mt-1">
                            <SelectValue placeholder="Select nationality" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="australian">Australian</SelectItem>
                            <SelectItem value="new-zealander">New Zealander</SelectItem>
                            <SelectItem value="american">American</SelectItem>
                            <SelectItem value="canadian">Canadian</SelectItem>
                            <SelectItem value="british">British</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`traveler-${index}-passport`}>Passport Number</Label>
                        <Input
                          id={`traveler-${index}-passport`}
                          name="passport"
                          value={traveler.passport}
                          onChange={(e) => handleInputChange(e, "traveler", index)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`traveler-${index}-passportExpiry`}>Passport Expiry Date</Label>
                        <Input
                          id={`traveler-${index}-passportExpiry`}
                          name="passportExpiry"
                          type="date"
                          value={traveler.passportExpiry}
                          onChange={(e) => handleInputChange(e, "traveler", index)}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`traveler-${index}-dietaryRequirements`}>Dietary Requirements (Optional)</Label>
                        <Input
                          id={`traveler-${index}-dietaryRequirements`}
                          name="dietaryRequirements"
                          value={traveler.dietaryRequirements}
                          onChange={(e) => handleInputChange(e, "traveler", index)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    {index < formData.travelersInfo.length - 1 && <Separator className="mt-6" />}
                  </div>
                  )
                })}
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
                  
                  {total > 0 ? (
                    <StripePaymentForm
                      amount={total * 0.3} // 30% deposit
                      onSuccess={(paymentIntentId) => {
                        console.log('Payment successful:', paymentIntentId)
                        handleSubmitBooking()
                      }}
                      onError={(error) => {
                        console.error('Payment error:', error)
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
                  We've sent a confirmation email to {formData.contactInfo.email} with all the details of your booking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => router.push("/")} variant="outline">
                    Return to Homepage
                  </Button>
                  <Button onClick={() => router.push(`/booking/confirmation?bookingId=${bookingId}`)} className="bg-amber-500 hover:bg-amber-600">
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
