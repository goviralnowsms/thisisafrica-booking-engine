"use client"

import type React from "react"

import { useState } from "react"
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
import { CalendarIcon, Clock, MapPin, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

// Mock data for tour
const MOCK_TOUR = {
  id: "tour-001",
  name: "Luxury Safari Experience",
  destination: "Kenya & Tanzania",
  duration: 10,
  price: 3499,
  description: "Experience the ultimate African safari across Kenya and Tanzania's most iconic wildlife reserves.",
  image: "/images/safari-lion.png",
  available: true,
  highlights: [
    "Game drives in Masai Mara and Serengeti",
    "Visit to Ngorongoro Crater",
    "Luxury tented camps and lodges",
    "Professional wildlife guides",
  ],
  departureDates: ["2025-06-15", "2025-07-10", "2025-08-05", "2025-09-12", "2025-10-08"],
  accommodationOptions: [
    {
      id: "standard",
      name: "Standard Lodges",
      priceAdjustment: 0,
      description: "Comfortable lodges with all amenities",
    },
    {
      id: "luxury",
      name: "Luxury Lodges",
      priceAdjustment: 800,
      description: "Premium lodges with exceptional service",
    },
    {
      id: "deluxe",
      name: "Deluxe Tented Camps",
      priceAdjustment: 1200,
      description: "Exclusive tented camps in prime locations",
    },
  ],
  activities: [
    {
      id: "balloon",
      name: "Hot Air Balloon Safari",
      price: 450,
      description: "Sunrise balloon safari over the Masai Mara",
    },
    {
      id: "cultural",
      name: "Maasai Village Visit",
      price: 120,
      description: "Cultural experience with the Maasai people",
    },
    {
      id: "photography",
      name: "Photography Workshop",
      price: 250,
      description: "Wildlife photography workshop with a professional",
    },
  ],
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
  const tourId = searchParams.get("tourId") || "tour-001" // Default to our mock tour

  // State for the booking process
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    // Tour selection
    tourId: tourId,
    departureDate: null as Date | null,
    travelers: "2",
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

  // Initialize travelers array when number of travelers changes
  const initializeTravelers = (count: number) => {
    const newTravelers = []
    for (let i = 0; i < count; i++) {
      newTravelers.push({
        firstName: i === 0 ? formData.contactInfo.firstName : "",
        lastName: i === 0 ? formData.contactInfo.lastName : "",
        dob: "",
        passport: "",
        passportExpiry: "",
        nationality: "",
        dietaryRequirements: "",
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

  // Handle travelers count change
  const handleTravelersChange = (value: string) => {
    setFormData((prev) => ({ ...prev, travelers: value }))
    initializeTravelers(Number.parseInt(value))
  }

  // Calculate total price
  const calculateTotal = () => {
    const basePrice = MOCK_TOUR.price * Number.parseInt(formData.travelers)

    // Add accommodation upgrade cost if selected
    const selectedAccommodation = MOCK_TOUR.accommodationOptions.find(
      (option) => option.id === formData.accommodationType,
    )
    const accommodationCost = (selectedAccommodation?.priceAdjustment || 0) * Number.parseInt(formData.travelers)

    // Add optional activities
    const activitiesCost = formData.selectedActivities.reduce((total, activityId) => {
      const activity = MOCK_TOUR.activities.find((a) => a.id === activityId)
      return total + (activity?.price || 0) * Number.parseInt(formData.travelers)
    }, 0)

    const subtotal = basePrice + accommodationCost + activitiesCost
    const taxes = subtotal * 0.15 // 15% tax

    return {
      basePrice,
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
      // Validate payment info
      const { cardholderName, cardNumber, expiryDate, cvv } = formData.cardInfo
      if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
        alert("Please fill in all required payment information")
        return
      }
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
  const handleSubmitBooking = () => {
    setIsSubmitting(true)

    // Simulate API call delay
    setTimeout(() => {
      console.log("Booking data:", formData)
      setIsSubmitting(false)
      setBookingComplete(true)
      setBookingReference(`TIA-${Math.floor(100000 + Math.random() * 900000)}`)
      setCurrentStep(BOOKING_STEPS.length - 1)
    }, 2000)
  }

  const { basePrice, accommodationCost, activitiesCost, subtotal, taxes, total } = calculateTotal()

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
                        src={MOCK_TOUR.image || "/placeholder.svg"}
                        alt={MOCK_TOUR.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:w-2/3">
                    <h3 className="text-lg font-bold mb-2">{MOCK_TOUR.name}</h3>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{MOCK_TOUR.destination}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{MOCK_TOUR.duration} days</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{MOCK_TOUR.description}</p>
                    <div className="text-lg font-bold">From ${MOCK_TOUR.price} per person</div>
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
                            // Only allow dates from the departureDates array
                            return !MOCK_TOUR.departureDates.includes(format(date, "yyyy-MM-dd"))
                          }}
                        />
                        <div className="p-3 border-t border-gray-100">
                          <p className="text-sm text-gray-500">Available departure dates highlighted</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Select value={formData.travelers} onValueChange={handleTravelersChange}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select number of travelers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Traveler</SelectItem>
                        <SelectItem value="2">2 Travelers</SelectItem>
                        <SelectItem value="3">3 Travelers</SelectItem>
                        <SelectItem value="4">4 Travelers</SelectItem>
                        <SelectItem value="5">5 Travelers</SelectItem>
                        <SelectItem value="6">6 Travelers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="accommodation-type">Accommodation Type</Label>
                  <RadioGroup
                    value={formData.accommodationType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, accommodationType: value }))}
                    className="mt-2 space-y-4"
                  >
                    {MOCK_TOUR.accommodationOptions.map((option) => (
                      <div key={option.id} className="flex items-start space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                        <div className="grid gap-1.5">
                          <Label htmlFor={option.id} className="font-medium">
                            {option.name}
                            {option.priceAdjustment > 0 && (
                              <span className="text-amber-600 ml-2">+${option.priceAdjustment} per person</span>
                            )}
                          </Label>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                    ))}
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
                {formData.travelersInfo.map((traveler, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">
                      {index === 0 ? "Lead Traveler" : `Traveler ${index + 1}`}
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
                ))}
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

                  <div className="space-y-4">
                    {MOCK_TOUR.activities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={activity.id}
                          checked={formData.selectedActivities.includes(activity.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(activity.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor={activity.id} className="font-medium">
                            {activity.name}
                            <span className="text-amber-600 ml-2">+${activity.price} per person</span>
                          </Label>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.paymentMethod === "credit-card" && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Card Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardholderName">Cardholder Name</Label>
                        <Input
                          id="cardholderName"
                          name="cardholderName"
                          value={formData.cardInfo.cardholderName}
                          onChange={(e) => handleInputChange(e, "cardInfo")}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardInfo.cardNumber}
                          onChange={(e) => handleInputChange(e, "cardInfo")}
                          required
                          className="mt-1"
                          placeholder="XXXX XXXX XXXX XXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.cardInfo.expiryDate}
                          onChange={(e) => handleInputChange(e, "cardInfo")}
                          required
                          className="mt-1"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={formData.cardInfo.cvv}
                          onChange={(e) => handleInputChange(e, "cardInfo")}
                          required
                          className="mt-1"
                          placeholder="XXX"
                        />
                      </div>
                    </div>
                  </div>
                )}

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
                      <span>Base Tour Price ({formData.travelers} travelers)</span>
                      <span>${basePrice.toLocaleString()}</span>
                    </div>

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
                  <Button onClick={() => router.push("/my-bookings")} className="bg-amber-500 hover:bg-amber-600">
                    View My Bookings
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
