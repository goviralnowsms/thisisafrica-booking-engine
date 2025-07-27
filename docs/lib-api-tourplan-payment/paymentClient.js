// Simple payment client that doesn't require external integrations
class PaymentClient {
  constructor() {
    this.provider = process.env.PAYMENT_PROVIDER || "mock"
  }

  async processPayment(paymentData) {
    // For now, return mock success
    // This will be replaced with actual payment processing later
    return {
      success: true,
      transactionId: `mock_${Date.now()}`,
      message: "Payment processed successfully (mock)",
      amount: paymentData.amount,
      currency: paymentData.currency || "AUD",
    }
  }

  async createPaymentIntent(amount, currency = "AUD") {
    // Mock payment intent
    return {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret`,
      amount,
      currency,
    }
  }
}

module.exports = { PaymentClient }
