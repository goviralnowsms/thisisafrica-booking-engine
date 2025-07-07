"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Users, Clock } from "lucide-react"
import type { SearchCriteria, Tour, BookingData, ChildInfo } from "@/app/page"

interface BookingFormProps {
  tour: Tour
  searchCriteria: SearchCriteria
  onSubmit: (booking: BookingData) => void
  onBack: () => void
  onError?: (errorMessage: string) => void
}

export function BookingForm({ tour, searchCriteria, onSubmit, onBack }: BookingFormProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    tour.extras.filter((extra) => extra.isCompulsory).map((extra) => extra.id),
  )
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const handleExtraToggle = (extraId: string, isCompulsory: boolean) => {
    if (isCompulsory) return

    setSelectedExtras((prev) => (prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]))
  }

  // Helper function to calculate child pricing based on age
  const getChildPriceMultiplier = (age: number) => {
    if (age <= 2) return 0 // Infants travel free
    if (age <= 5) return 0.25 // 25% of adult price for young children
    if (age <= 11) return 0.5 // 50% of adult price for children
    if (age <= 17) return 0.75 // 75% of adult price for teens
    return 1 // Full adult price for 18+
  }

  const calculateTotal = () => {
    const adults = searchCriteria.adults || 2
    const childrenAges = searchCriteria.childrenAges || []
    
    // Calculate adult pricing
    const adultPrice = tour.price * adults
    
    // Calculate children pricing based on ages
    const childrenPrice = childrenAges.reduce((total, child) => {
      return total + (tour.price * getChildPriceMultiplier(child.age))
    }, 0)
    
    const basePrice = adultPrice + childrenPrice
    
    // Calculate extras pricing (same logic for adults and children)
    const totalPeople = adults + childrenAges.length
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = tour.extras.find((e) => e.id === extraId)
      if (!extra) return total
      
      // Apply same age-based pricing for extras
      const adultExtrasPrice = extra.price * adults
      const childrenExtrasPrice = childrenAges.reduce((childTotal, child) => {
        return childTotal + (extra.price * getChildPriceMultiplier(child.age))
      }, 0)
      
      return total + adultExtrasPrice + childrenExtrasPrice
    }, 0)
    
    return basePrice + extrasPrice
  }

  const totalPrice = calculateTotal()
  const depositAmount = Math.round(totalPrice * 0.3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email) {
      alert("Please fill in all required fields")
      return
    }

    const bookingData: BookingData = {
      tour,
      selectedExtras,
      customerDetails: {
        ...customerDetails,
        address: "", // Address will be collected during payment
      },
      totalPrice,
      depositAmount,
    }

    onSubmit(bookingData)
  }

  const adults = searchCriteria.adults || 2
  const children = searchCriteria.children || 0
  const childrenAges = searchCriteria.childrenAges || []

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tour Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{tour.name}</h3>
                  <p className="text-gray-600">{tour.description}</p>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {searchCriteria.startDate} to {searchCriteria.endDate}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {tour.duration} days
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {adults} adults
                    {children > 0 && (
                      <span>
                        , {children} children
                        {childrenAges.length > 0 && (
                          <span className="text-xs text-gray-500 ml-1">
                            (ages: {childrenAges.map(child => child.age).join(', ')})
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Age-based pricing information */}
                {childrenAges.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Children's Pricing</h4>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>• Ages 0-2: Free</div>
                      <div>• Ages 3-5: 25% of adult price</div>
                      <div>• Ages 6-11: 50% of adult price</div>
                      <div>• Ages 12-17: 75% of adult price</div>
                      <div>• Ages 18+: Full adult price</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Extras</CardTitle>
              <CardDescription>Enhance your tour with additional experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tour.extras.map((extra) => (
                  <div key={extra.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedExtras.includes(extra.id)}
                      onCheckedChange={() => handleExtraToggle(extra.id, extra.isCompulsory)}
                      disabled={extra.isCompulsory}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{extra.name}</h4>
                        {extra.isCompulsory && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{extra.description}</p>
                      <p className="text-sm font-medium text-green-600">+${extra.price} per person</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
              <CardDescription>Please provide your contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerDetails.firstName}
                      onChange={(e) =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerDetails.lastName}
                      onChange={(e) =>
                        setCustomerDetails((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerDetails.phone}
                    onChange={(e) =>
                      setCustomerDetails((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>

              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{tour.name}</h4>
                <p className="text-sm text-gray-600">{tour.level} level</p>
              </div>

              <Separator />

              <div className="space-y-2">
                {/* Adult pricing */}
                <div className="flex justify-between text-sm">
                  <span>Adults ({adults} × ${tour.price})</span>
                  <span>${tour.price * adults}</span>
                </div>

                {/* Children pricing breakdown */}
                {childrenAges.length > 0 && (
                  <>
                    {childrenAges.map((child, index) => {
                      const childPrice = tour.price * getChildPriceMultiplier(child.age)
                      const discountPercent = Math.round((1 - getChildPriceMultiplier(child.age)) * 100)
                      return (
                        <div key={child.id} className="flex justify-between text-sm">
                          <span>
                            Child {index + 1} (age {child.age})
                            {discountPercent > 0 && (
                              <span className="text-green-600 ml-1">
                                -{discountPercent}%
                              </span>
                            )}
                            {child.age <= 2 && (
                              <span className="text-green-600 ml-1">FREE</span>
                            )}
                          </span>
                          <span>${childPrice}</span>
                        </div>
                      )
                    })}
                  </>
                )}

                {/* Extras pricing */}
                {selectedExtras.map((extraId) => {
                  const extra = tour.extras.find((e) => e.id === extraId)
                  if (!extra) return null
                  
                  const adultExtrasPrice = extra.price * adults
                  const childrenExtrasPrice = childrenAges.reduce((total, child) => {
                    return total + (extra.price * getChildPriceMultiplier(child.age))
                  }, 0)
                  const totalExtrasPrice = adultExtrasPrice + childrenExtrasPrice
                  
                  return (
                    <div key={extraId} className="flex justify-between text-sm">
                      <span>{extra.name}</span>
                      <span>+${totalExtrasPrice}</span>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Total Price</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Deposit Required (30%)</span>
                  <span>${depositAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Remaining Balance</span>
                  <span>${totalPrice - depositAmount}</span>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                size="lg"
                disabled={!customerDetails.firstName || !customerDetails.lastName || !customerDetails.email}
              >
                Proceed to Payment
              </Button>

              <p className="text-xs text-gray-500 text-center">
                You will only be charged the deposit amount today. The remaining balance is due 2-4 weeks before
                departure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
