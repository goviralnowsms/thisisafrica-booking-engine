interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

interface Booking {
  id: string
  customerId: string
  tourId: string
  tourName: string
  startDate: string
  endDate: string
  adults: number
  children: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
}

interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  paymentMethod: string
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

// Mock database service for demo purposes
const db = {
  async query(sql: string, params?: any[]) {
    console.log("Mock DB Query:", sql, params)
    return { rows: [], rowCount: 0 }
  },

  async insert(table: string, data: any) {
    console.log("Mock DB Insert:", table, data)
    return { id: Math.random().toString(36).substr(2, 9) }
  },

  async update(table: string, id: string, data: any) {
    console.log("Mock DB Update:", table, id, data)
    return { success: true }
  },

  async delete(table: string, id: string) {
    console.log("Mock DB Delete:", table, id)
    return { success: true }
  },

  async find(table: string, conditions: any) {
    console.log("Mock DB Find:", table, conditions)
    return []
  },
}

export class DatabaseService {
  // Customer operations
  async createCustomer(customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">): Promise<Customer> {
    const customer: Customer = {
      ...customerData,
      id: `cust_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert("customers", customer)
    return customer
  }

  async getCustomer(id: string): Promise<Customer | null> {
    const result = await db.find("customers", { id })
    return result.length > 0 ? result[0] : null
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const result = await db.find("customers", { email })
    return result.length > 0 ? result[0] : null
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const result = await db.update("customers", id, updates)
    if (result.success) {
      const updatedCustomer = { ...updates, id, updatedAt: new Date() }
      return updatedCustomer
    }
    return null
  }

  // Booking operations
  async createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
    const booking: Booking = {
      ...bookingData,
      id: `book_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert("bookings", booking)
    return booking
  }

  async getBooking(id: string): Promise<Booking | null> {
    const result = await db.find("bookings", { id })
    return result.length > 0 ? result[0] : null
  }

  async getBookingsByCustomer(customerId: string): Promise<Booking[]> {
    return await db.find("bookings", { customerId })
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const result = await db.update("bookings", id, updates)
    if (result.success) {
      const updatedBooking = { ...updates, id, updatedAt: new Date() }
      return updatedBooking
    }
    return null
  }

  // Payment operations
  async createPayment(paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
    const payment: Payment = {
      ...paymentData,
      id: `pay_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.insert("payments", payment)
    return payment
  }

  async getPayment(id: string): Promise<Payment | null> {
    const result = await db.find("payments", { id })
    return result.length > 0 ? result[0] : null
  }

  async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
    return await db.find("payments", { bookingId })
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | null> {
    const result = await db.update("payments", id, updates)
    if (result.success) {
      const updatedPayment = { ...updates, id, updatedAt: new Date() }
      return updatedPayment
    }
    return null
  }

  // Generic operations
  async create(table: string, data: any): Promise<any> {
    return await db.insert(table, data)
  }

  async findById(table: string, id: string): Promise<any | null> {
    const result = await db.find(table, { id })
    return result.length > 0 ? result[0] : null
  }

  async update(table: string, id: string, data: any): Promise<any> {
    return await db.update(table, id, data)
  }

  async delete(table: string, id: string): Promise<boolean> {
    const result = await db.delete(table, id)
    return result.success
  }

  async query(sql: string, params?: any[]): Promise<any> {
    return await db.query(sql, params)
  }

  // Health check
  async testConnection(): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: "Database connection successful (mock mode)",
    }
  }
}

// Legacy exports for backward compatibility
export async function createCustomer(customerData: any) {
  return new DatabaseService().createCustomer(customerData)
}

export async function getCustomer(id: string) {
  return new DatabaseService().getCustomer(id)
}

export async function getCustomerByEmail(email: string) {
  return new DatabaseService().getCustomerByEmail(email)
}

export async function updateCustomer(id: string, updates: any) {
  return new DatabaseService().updateCustomer(id, updates)
}

export async function createBooking(bookingData: any) {
  return new DatabaseService().createBooking(bookingData)
}

export async function getBooking(id: string) {
  return new DatabaseService().getBooking(id)
}

export async function getBookingsByCustomer(customerId: string) {
  return new DatabaseService().getBookingsByCustomer(customerId)
}

export async function updateBooking(id: string, updates: any) {
  return new DatabaseService().updateBooking(id, updates)
}

export async function createPayment(paymentData: any) {
  return new DatabaseService().createPayment(paymentData)
}

export async function getPayment(id: string) {
  return new DatabaseService().getPayment(id)
}

export async function getPaymentsByBooking(bookingId: string) {
  return new DatabaseService().getPaymentsByBooking(bookingId)
}

export async function updatePayment(id: string, updates: any) {
  return new DatabaseService().updatePayment(id, updates)
}

export async function testDatabaseConnection() {
  return new DatabaseService().testConnection()
}

// Export the singleton instance
export { db }
