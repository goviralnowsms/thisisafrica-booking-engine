"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react"
import type { Tour, SearchCriteria, BookingData } from "@/app/page"

interface BookingFormProps {
  tour: Tour
  searchCriteria: SearchCriteria
  onSubmit: (booking: BookingData) => void
  onBack: () => void
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
    address: "",
  })

  const handleExtraToggle = (extraId: string, isCompulsory: boolean) => {
    if (isCompulsory) return // Can't toggle compulsory extras

    setSelectedExtras((prev) => (prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]))
  }

  const calculateTotal = () => {
    const basePrice = tour.price * (searchCriteria.adults || 1)
    const extrasPrice = selectedExtras.reduce((total, extraId) => {
      const extra = tour.extras.find((e) => e.id === extraId)
      return total + (extra ? extra.price : 0)
    }, 0)
    return basePrice + extrasPrice
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const totalPrice = calculateTotal()
    const depositAmount = Math.round(totalPrice * 0.3) // 30% deposit

    const booking: BookingData = {
      tour,
      selectedExtras,
      customerDetails,
      totalPrice,
      depositAmount,
    }

    onSubmit(booking)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "basic":
        return "bg-blue-100 text-blue-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "luxury":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tour Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">{tour.name}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tour.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {tour.duration} days
                </div>
              </div>
              <Badge className={getLevelColor(tour.level)} variant="secondary" className="w-fit">
                {tour.level}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Travelers</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {searchCriteria.adults || 1} Adult{(searchCriteria.adults || 1) > 1 ? "s" : ""}
                    {searchCriteria.children && searchCriteria.children > 0 && (
                      <span>
                        , {searchCriteria.children} Child{searchCriteria.children > 1 ? "ren" : ""}
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Price Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>
                        Base price ({searchCriteria.adults || 1} adult{(searchCriteria.adults || 1) > 1 ? "s" : ""})
                      </span>
                      <span>${tour.price * (searchCriteria.adults || 1)}</span>
                    </div>
                    {selectedExtras.map((extraId) => {
                      const extra = tour.extras.find((e) => e.id === extraId)
                      return extra ? (
                        <div key={extraId} className="flex justify-between">
                          <span>{extra.name}</span>
                          <span>${extra.price}</span>
                        </div>
                      ) : null
                    })}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Deposit (30%)</span>
                      <span>${Math.round(calculateTotal() * 0.3)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tour Extras */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Extras</CardTitle>
                <CardDescription>Enhance your experience with these optional extras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tour.extras.map((extra) => (
                    <div key={extra.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={extra.id}
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={() => handleExtraToggle(extra.id, extra.isCompulsory)}
                        disabled={extra.isCompulsory}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={extra.id} className="font-medium">
                            {extra.name}
                            {extra.isCompulsory && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Required
                              </Badge>
                            )}
                          </Label>
                          <span className="font-semibold">${extra.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{extra.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
                <CardDescription>Please provide your contact information for the booking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={customerDetails.firstName}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={customerDetails.lastName}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={customerDetails.email}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      required
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full bg-orange-500 hover:bg-orange-600">
              Proceed to Payment - ${Math.round(calculateTotal() * 0.3)} Deposit
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
