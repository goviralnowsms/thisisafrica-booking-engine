"use client"

import React, { useState, useEffect } from 'react'
// Temporary fix for lucide-react module resolution issue
// import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PricingCalendarProps {
  productCode: string
  onDateSelect?: (date: string, pricing: any) => void
}

interface CalendarDay {
  date: string
  dayOfWeek: number
  available: boolean
  validDay: boolean
  displayPrice: string
  singleRate?: number
  twinRate?: number
  currency?: string
  rateName?: string
}

interface CalendarData {
  calendar: CalendarDay[]
  dateRanges: any[]
}

export default function PricingCalendar({ productCode, onDateSelect }: PricingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [loading, setLoading] = useState(false)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [roomType, setRoomType] = useState('DB')
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')

  // Check if this is a rail product
  const isRail = productCode?.includes('RLROV') ||     // Rovos Rail codes like CPTRLROV001CTPPUL
               productCode?.includes('RAIL') ||      // General rail codes
               productCode?.toLowerCase().includes('rail') ||
               productCode?.includes('BLUE') ||      // Blue Train codes
               productCode?.includes('PREMIER')      // Premier Classe codes

  // Check if this is an accommodation product (disable calendar view for these)
  const isAccommodation = productCode?.includes('GKPSPSABBLDSABBLS') || // Sabi Sabi Bush Lodge
                          productCode?.includes('GKPSPSAV002SAVLHM') ||   // Savanna Lodge
                          productCode?.includes('ACCOMMODATION') ||
                          productCode?.includes('LODGE') ||
                          productCode?.includes('HOTEL')

  // Check if this is a group tour (allow calendar view for these)
  const isGroupTour = productCode?.includes('GTARP') ||     // Group tour codes like NBOGTARP001CKSE
                     productCode?.includes('GROUP') ||      // General group codes
                     productCode?.toLowerCase().includes('group')

  useEffect(() => {
    fetchPricingData()
  }, [productCode, adults, children, roomType])

  const fetchPricingData = async () => {
    setLoading(true)
    try {
      // Get 6 months of data starting from current month
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 6, 0)
      
      const params = new URLSearchParams({
        dateFrom: startDate.toISOString().split('T')[0],
        dateTo: endDate.toISOString().split('T')[0],
        adults: adults.toString(),
        children: children.toString(),
        roomType,
        _t: Date.now().toString() // Cache busting parameter
      })

      const response = await fetch(`/api/tourplan/pricing/${productCode}?${params}`, {
        cache: 'no-store' // Ensure no caching
      })
      const result = await response.json()

      if (result.success) {
        console.log('📅 Booking calendar API response:', result.data)
        
        // Debug the raw date ranges from API
        if (result.data?.dateRanges) {
          console.log('📅 Raw dateRanges from API:', result.data.dateRanges.length, 'ranges')
          result.data.dateRanges.forEach((range: any, index: number) => {
            console.log(`📅 Range ${index}:`, {
              dateFrom: range.dateFrom,
              dateTo: range.dateTo,
              appliesDaysOfWeek: range.appliesDaysOfWeek
            })
          })
        }
        
        if (result.data?.calendar) {
          console.log('📅 Processed calendar data:', result.data.calendar.length, 'days')
          result.data.calendar.forEach((day: any) => {
            if (day.validDay && day.available) {
              // Create date in local timezone to avoid UTC conversion issues
              const [year, month, dayNum] = day.date.split('-').map(Number)
              const localDate = new Date(year, month - 1, dayNum)
              const dayOfWeek = localDate.toLocaleDateString('en-US', { weekday: 'long' })
              console.log('📅 Valid date found:', day.date, dayOfWeek, 'validDay:', day.validDay, 'available:', day.available)
            }
          })
        }
        setCalendarData(result.data)
      } else {
        console.error('Failed to fetch pricing data:', result.error)
        console.error('Full result:', result)
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (day: CalendarDay) => {
    if (day.validDay && onDateSelect) {
      onDateSelect(day.date, day)
    }
  }

  // Format rate for display - handle special pricing corrections
  const formatRateForDisplay = (rate: number, type: 'single' | 'twin'): number => {
    // For Classic Kruger Package, Kenya tours, Sabi Sabi and Savanna Lodge, rates are already corrected in dollars
    if (productCode === 'HDSSPMAKUTSMSSCLS' || productCode === 'NBOGTARP001CKEKEE' || productCode === 'NBOGTARP001CKSE' || productCode === 'NBOGPARP001CKSLP' || productCode === 'GKPSPSABBLDSABBLS' || productCode === 'GKPSPSAV002SAVLHM') {
      if (type === 'twin') {
        // Twin rate is total for room, show per person
        return Math.round(rate / 2)
      }
      return Math.round(rate)
    }
    
    // Rates are already converted from cents to dollars in services.ts
    if (type === 'twin') {
      return Math.round(rate / 2)
    }
    return Math.round(rate)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentMonth(newMonth)
    
    // Refetch data for new month range
    setTimeout(fetchPricingData, 100)
  }

  const renderTableView = () => {
    if (!calendarData?.dateRanges) {
      console.log('No dateRanges in calendar data:', calendarData)
      return null
    }
    
    console.log('Rendering table with dateRanges:', calendarData.dateRanges.length)

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 text-amber-600 font-semibold">Date Range</th>
                <th className="text-right py-3 px-2 text-amber-600 font-semibold">
                  Single<br/><span className="text-xs font-normal text-gray-500">per person</span>
                </th>
                <th className="text-right py-3 px-2 text-amber-600 font-semibold">
                  Twin Share<br/><span className="text-xs font-normal text-gray-500">per person</span>
                </th>
                <th className="text-center py-3 px-2 text-amber-600 font-semibold">Availability</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.dateRanges.map((range, index) => {
                const fromDate = new Date(range.dateFrom)
                const toDate = new Date(range.dateTo)
                const dateDisplay = range.dateFrom === range.dateTo
                  ? fromDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })
                  : `${fromDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })} - ${toDate.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}`

                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 text-gray-700 font-medium">{dateDisplay}</td>
                    <td className="text-right py-3 px-2 font-semibold text-gray-800">
                      {range.singleRate && range.singleRate > 0 ? `${range.currency} $${formatRateForDisplay(range.singleRate, 'single').toLocaleString()}` : 'POA'}
                    </td>
                    <td className="text-right py-3 px-2 font-semibold text-green-600">
                      {range.twinRate && range.twinRate > 0 ? `${range.currency} $${formatRateForDisplay(range.twinRate, 'twin').toLocaleString()}` : 'POA'}
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        range.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isRail 
                          ? (range.available ? 'On Request' : 'Closed')
                          : (range.available ? 'Available' : 'Closed')
                        }
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {isRail && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>🚂 Rail Journey Booking:</strong> All rail bookings require manual confirmation by our team. 
              Dates shown indicate scheduled departure periods. Final availability and confirmation will be provided after booking.
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderCalendarView = () => {
    if (!calendarData?.calendar) return null

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const monthName = currentMonth.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })

    const calendarDays = calendarData.calendar.filter(day => {
      // Create date in local timezone to avoid UTC conversion issues
      const [year, month, dayNum] = day.date.split('-').map(Number)
      const dayDate = new Date(year, month - 1, dayNum)
      return dayDate.getMonth() === currentMonth.getMonth() && dayDate.getFullYear() === currentMonth.getFullYear()
    })

    const weeks = []
    let week = Array(7).fill(null)
    
    // Fill in the calendar days
    calendarDays.forEach(day => {
      // Create date in local timezone to avoid UTC conversion issues
      const [year, month, dayNum] = day.date.split('-').map(Number)
      const dayDate = new Date(year, month - 1, dayNum)
      const dayOfMonth = dayDate.getDate()
      const dayIndex = (firstDayOfMonth + dayOfMonth - 1) % 7
      const weekIndex = Math.floor((firstDayOfMonth + dayOfMonth - 1) / 7)
      
      if (!weeks[weekIndex]) weeks[weekIndex] = Array(7).fill(null)
      weeks[weekIndex][dayIndex] = day
    })

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <span className="text-lg">‹</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <span className="text-lg">›</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {weeks.map((week, weekIndex) => 
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`p-2 min-h-[80px] border border-gray-200 ${
                  day?.validDay 
                    ? 'cursor-pointer hover:bg-amber-50 hover:border-amber-300' 
                    : 'bg-gray-50'
                }`}
                onClick={() => day && handleDateClick(day)}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <div className="text-sm font-medium text-gray-900">
                      {(() => {
                        // Create date in local timezone to avoid UTC conversion issues
                        const [year, month, dayNum] = day.date.split('-').map(Number)
                        const localDate = new Date(year, month - 1, dayNum)
                        return localDate.getDate()
                      })()}
                    </div>
                    <div className={`text-xs mt-1 ${
                      day.validDay ? 'text-green-600 font-medium' : 'text-gray-400'
                    }`}>
                      {day.displayPrice}
                    </div>
                    {day.validDay && (
                      <div className="text-xs text-green-500 mt-auto">Available</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">👥</span>
          <Select value={adults.toString()} onValueChange={(value) => setAdults(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Adults</span>
        </div>

        <div className="flex items-center gap-2">
          <Select value={children.toString()} onValueChange={(value) => setChildren(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0,1,2,3,4].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Children</span>
        </div>

        <div className="flex items-center gap-2">
          <Select value={roomType} onValueChange={setRoomType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SG">Single</SelectItem>
              <SelectItem value="DB">Double</SelectItem>
              <SelectItem value="TW">Twin</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Room</span>
        </div>

        {isGroupTour && (
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin text-amber-500 border-2 border-amber-500 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-600">Loading pricing data...</span>
        </div>
      )}

      {/* Content */}
      {!loading && calendarData && (
        <div>
          {(viewMode === 'table' || isAccommodation || isRail || !isGroupTour) ? renderTableView() : renderCalendarView()}
        </div>
      )}

      {/* No Data */}
      {!loading && !calendarData && (
        <div className="text-center py-8 text-gray-500">
          No pricing data available for this product.
        </div>
      )}
    </div>
  )
}