"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Download, 
  Eye, 
  Search,
  Loader2,
  Lock,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle
} from "lucide-react"

type BookingStatus = 'confirmed' | 'pending' | 'quote' | 'cancelled' | 'pending-confirmation'

interface AdminBooking {
  id: string
  reference: string
  type: 'TAWB' | 'TIA'
  customerName: string
  email?: string
  phone?: string
  productName: string
  productCode: string
  productLocation: string
  dateFrom?: string
  totalAmount: number
  currency: string
  status: BookingStatus
  createdAt: string
  supplier?: string
  adults: number
  children?: number
  roomType?: string
  notes?: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  })
  
  // Booking dashboard state
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  
  // Check authentication on mount
  useEffect(() => {
    const isAdminLoggedIn = sessionStorage.getItem('adminAuthenticated')
    if (isAdminLoggedIn === 'true') {
      setIsAuthenticated(true)
      loadBookings()
    }
  }, [])

  // Filter bookings based on search and filters
  useEffect(() => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(booking => booking.type === typeFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, typeFilter])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError("")

    // Simple admin credentials (in production, this should use proper authentication)
    if (loginForm.username === "admin" && loginForm.password === "tia2025admin") {
      sessionStorage.setItem('adminAuthenticated', 'true')
      setIsAuthenticated(true)
      await loadBookings()
    } else {
      setLoginError("Invalid credentials. Please check your username and password.")
    }
    
    setIsLoggingIn(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated')
    setIsAuthenticated(false)
    setBookings([])
    setFilteredBookings([])
    setLoginForm({ username: "", password: "" })
  }

  const loadBookings = async () => {
    setIsLoading(true)
    
    try {
      // Load TIA bookings from localStorage
      const tiaBookingsStr = localStorage.getItem('tiaBookings')
      const tiaBookings = tiaBookingsStr ? JSON.parse(tiaBookingsStr) : {}
      
      const allBookings: AdminBooking[] = []
      
      // Add TIA bookings
      Object.keys(tiaBookings).forEach(reference => {
        const booking = tiaBookings[reference]
        allBookings.push({
          id: reference,
          reference: reference,
          type: 'TIA',
          customerName: booking.customerName || 'N/A',
          email: booking.email,
          phone: booking.phone,
          productName: booking.productName || 'African Adventure',
          productCode: booking.productCode || 'N/A',
          productLocation: booking.productLocation || 'Africa',
          dateFrom: booking.dateFrom,
          totalAmount: booking.totalCost ? Math.round(booking.totalCost / 100) : 0,
          currency: 'AUD',
          status: 'pending-confirmation',
          createdAt: booking.createdAt || new Date().toISOString(),
          supplier: booking.productSupplier,
          adults: booking.adults || 2,
          children: booking.children || 0,
          notes: 'Manual booking - requires staff confirmation'
        })
      })
      
      // Fetch TourPlan TAWB bookings from API
      try {
        const response = await fetch('/api/admin/bookings', {
          headers: {
            'Authorization': 'Bearer admin-token-tia2025'
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data.tourplanBookings) {
            console.log(`📋 Loaded ${result.data.tourplanBookings.length} TourPlan bookings`)
            allBookings.push(...result.data.tourplanBookings)
          }
        } else {
          console.warn('Failed to fetch TourPlan bookings:', response.status)
        }
      } catch (error) {
        console.error('Error fetching TourPlan bookings:', error)
      }
      
      // Sort by creation date (newest first)
      allBookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      console.log(`📊 Total bookings loaded: ${allBookings.length} (${allBookings.filter(b => b.type === 'TIA').length} TIA, ${allBookings.filter(b => b.type === 'TAWB').length} TAWB)`)
      setBookings(allBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
    }
    
    setIsLoading(false)
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>
      case "pending":
        return <Badge className="bg-amber-500"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>
      case "pending-confirmation":
        return <Badge className="bg-blue-500"><AlertCircle className="w-3 h-3 mr-1" />Awaiting Confirmation</Badge>
      case "quote":
        return <Badge className="bg-purple-500"><FileText className="w-3 h-3 mr-1" />Quote</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  const getTypeBadge = (type: 'TAWB' | 'TIA') => {
    if (type === 'TAWB') {
      return <Badge variant="outline" className="border-green-500 text-green-700">API Booking</Badge>
    }
    return <Badge variant="outline" className="border-orange-500 text-orange-700">Manual Booking</Badge>
  }

  const exportBookings = () => {
    const csvContent = [
      // CSV Header
      ['Reference', 'Type', 'Customer', 'Email', 'Phone', 'Product', 'Location', 'Date', 'Amount', 'Status', 'Created'].join(','),
      // CSV Data
      ...filteredBookings.map(booking => [
        booking.reference,
        booking.type,
        booking.customerName,
        booking.email || '',
        booking.phone || '',
        booking.productName,
        booking.productLocation,
        booking.dateFrom ? new Date(booking.dateFrom).toLocaleDateString() : '',
        `${booking.currency} ${booking.totalAmount.toLocaleString()}`,
        booking.status,
        new Date(booking.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 mx-auto">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <p className="text-gray-600">Enter your credentials to access the booking dashboard</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1"
                    disabled={isLoggingIn}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1"
                    disabled={isLoggingIn}
                    required
                  />
                </div>

                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{loginError}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Access dashboard
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  For admin access only. Contact IT support if you need credentials.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  // Admin dashboard
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking dashboard</h1>
            <p className="text-gray-600 mt-1">Manage all TourPlan and TIA bookings</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold">{bookings.length}</p>
                </div>
                <FileText className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">TIA Bookings</p>
                  <p className="text-3xl font-bold">{bookings.filter(b => b.type === 'TIA').length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">TAWB Bookings</p>
                  <p className="text-3xl font-bold">{bookings.filter(b => b.type === 'TAWB').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold">{bookings.filter(b => b.status.includes('pending')).length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Search Bookings
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by reference, customer, email, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pending-confirmation">Awaiting Confirmation</SelectItem>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="TAWB">API Bookings</SelectItem>
                    <SelectItem value="TIA">Manual Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={exportBookings} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Bookings ({filteredBookings.length})
              {isLoading && <Loader2 className="inline h-4 w-4 animate-spin ml-2" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Travel Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{booking.reference}</div>
                            <div className="flex items-center space-x-2">
                              {getTypeBadge(booking.type)}
                            </div>
                            {booking.productCode !== 'N/A' && (
                              <div className="text-xs text-gray-500">{booking.productCode}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{booking.customerName}</div>
                            {booking.email && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Mail className="w-3 h-3 mr-1" />
                                {booking.email}
                              </div>
                            )}
                            {booking.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <Phone className="w-3 h-3 mr-1" />
                                {booking.phone}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-3 h-3 mr-1" />
                              {booking.adults} Adults
                              {booking.children && booking.children > 0 && `, ${booking.children} Children`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-900">{booking.productName}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {booking.productLocation}
                            </div>
                            {booking.supplier && (
                              <div className="text-xs text-gray-500">via {booking.supplier}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {booking.dateFrom ? (
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                              {new Date(booking.dateFrom).toLocaleDateString('en-AU', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500">TBD</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {booking.totalAmount > 0 
                              ? `${booking.currency} $${booking.totalAmount.toLocaleString()}` 
                              : 'POA'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('en-AU', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isLoading ? 'Loading bookings...' : 'No bookings found'}
                </h3>
                <p className="text-gray-500">
                  {isLoading 
                    ? 'Please wait while we fetch the latest booking data.'
                    : searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Bookings will appear here as customers make reservations.'
                  }
                </p>
                {!isLoading && (
                  <Button 
                    onClick={loadBookings} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Refresh bookings
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}