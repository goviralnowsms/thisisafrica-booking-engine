/**
 * Tyro Payment Gateway Client
 * Handles integration with Tyro for payment processing
 */

const axios = require('axios');
const MockSystem = require('../utils/mockSystem');
const { TYRO_CONFIG, MOCK_CONFIG } = require('../config');

class TyroPaymentClient {
  constructor() {
    this.apiUrl = TYRO_CONFIG.API_URL;
    this.apiKey = TYRO_CONFIG.API_KEY;
    this.redirectUrl = TYRO_CONFIG.REDIRECT_URL;
    this.cancelUrl = TYRO_CONFIG.CANCEL_URL;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      timeout: 30000
    });
    
    // Set up mock system if enabled
    this.useMocks = MOCK_CONFIG.ENABLED;
    if (this.useMocks) {
      this.mockSystem = new MockSystem();
    }
  }

  /**
   * Initialize a payment with Tyro
   * @param {Object} paymentData - Payment data
   * @param {number} paymentData.amount - Amount to charge in dollars
   * @param {string} paymentData.currency - Currency code (default: AUD)
   * @param {string} paymentData.description - Payment description
   * @param {Object} paymentData.customerDetails - Customer details
   * @returns {Promise<Object>} - Payment initialization response
   */
  async initiatePayment(paymentData) {
    const {
      amount,
      currency = 'AUD',
      description,
      orderReference = `TIA-${Date.now().toString().slice(-6)}`,
      customerDetails
    } = paymentData;
    
    // Validate required parameters
    if (!amount || !description || !customerDetails) {
      throw new Error('Missing required payment parameters');
    }
    
    // For mock mode, return a simulated Tyro payment URL
    if (this.useMocks) {
      const mockPaymentData = {
        paymentId: `TY-${Date.now()}`,
        redirectUrl: `https://tyro.com/payment-page?sessionId=MOCK-${Date.now()}&amount=${amount * 100}`,
        status: 'INITIATED',
        expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };
      
      // Save the mock response
      this.mockSystem.saveMockResponse('TyroPaymentInitiate', paymentData, mockPaymentData);
      
      // Simulate network delay
      await this.mockSystem.simulateDelay();
      
      return mockPaymentData;
    }
    
    try {
      // Real API call to Tyro to initialize a payment session
      const response = await this.client.post(
        '/payment-sessions',
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          description,
          orderReference,
          redirectUrl: this.redirectUrl,
          cancelUrl: this.cancelUrl,
          customerDetails: {
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            email: customerDetails.email,
            phone: customerDetails.phone
          }
        }
      );
      
      return response.data;
    } catch (error) {
      this.handleRequestError(error, 'initiatePayment');
    }
  }

  /**
   * Verify a payment status with Tyro
   * @param {string} paymentId - ID of the payment to verify
   * @returns {Promise<Object>} - Payment status
   */
  async verifyPaymentStatus(paymentId) {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }
    
    // For mock mode, return a successful payment status
    if (this.useMocks) {
      const mockStatusData = {
        paymentId,
        status: 'COMPLETED',
        reference: `TIA${Date.now().toString().slice(-6)}`,
        amount: 12990, // in cents
        currency: 'AUD',
        completedAt: new Date().toISOString()
      };
      
      // Save the mock response
      this.mockSystem.saveMockResponse('TyroPaymentVerify', paymentId, mockStatusData);
      
      // Simulate network delay
      await this.mockSystem.simulateDelay();
      
      return mockStatusData;
    }
    
    try {
      // Real API call to Tyro to check payment status
      const response = await this.client.get(`/payment-sessions/${paymentId}`);
      return response.data;
    } catch (error) {
      this.handleRequestError(error, 'verifyPaymentStatus');
    }
  }
  
  /**
   * Handle Tyro webhook event
   * @param {Object} webhookData - Webhook payload from Tyro
   * @param {string} signature - Webhook signature for verification
   * @returns {Object} - Processed webhook data
   */
  handleWebhook(webhookData, signature) {
    // Validate webhook signature if a secret is configured
    if (TYRO_CONFIG.WEBHOOK_SECRET) {
      // Implement signature verification logic here
      // This is a placeholder for actual signature verification
      if (!this.verifyWebhookSignature(webhookData, signature)) {
        throw new Error('Invalid webhook signature');
      }
    }
    
    // Process webhook based on event type
    switch (webhookData.eventType) {
      case 'payment.completed':
        return {
          status: 'COMPLETED',
          paymentId: webhookData.paymentId,
          amount: webhookData.amount,
          currency: webhookData.currency,
          completedAt: webhookData.timestamp
        };
      
      case 'payment.failed':
        return {
          status: 'FAILED',
          paymentId: webhookData.paymentId,
          errorCode: webhookData.errorCode,
          errorMessage: webhookData.errorMessage,
          failedAt: webhookData.timestamp
        };
      
      case 'payment.expired':
        return {
          status: 'EXPIRED',
          paymentId: webhookData.paymentId,
          expiredAt: webhookData.timestamp
        };
      
      default:
        return {
          status: 'UNKNOWN',
          eventType: webhookData.eventType,
          paymentId: webhookData.paymentId,
          raw: webhookData
        };
    }
  }
  
  /**
   * Verify webhook signature
   * @param {Object} webhookData - Webhook payload
   * @param {string} signature - Webhook signature from headers
   * @returns {boolean} - Whether the signature is valid
   */
  verifyWebhookSignature(webhookData, signature) {
    // This is a placeholder for actual signature verification logic
    // In a real implementation, you would verify the signature using the webhook secret
    // Example: Create an HMAC of the webhook payload using the secret and compare to the signature
    console.log('Verifying webhook signature (placeholder)');
    return true;
  }
  
  /**
   * Handle API request errors
   * @param {Error} error - The error object
   * @param {string} operation - The operation that failed
   * @throws {Error} - Rethrows the error with additional context
   */
  handleRequestError(error, operation) {
    let errorMessage = `Tyro API Error (${operation})`;
    let statusCode = 500;
    let responseData = null;
    
    if (error.response) {
      // The request was made and the server responded with an error
      statusCode = error.response.status;
      responseData = error.response.data;
      errorMessage = `Tyro API Error (${operation}): Status ${statusCode}`;
      
      // Extract more detailed error information if available
      if (responseData && responseData.error) {
        errorMessage = `Tyro API Error: ${responseData.error.message || responseData.error}`;
        if (responseData.error.code) {
          errorMessage += ` (${responseData.error.code})`;
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = `Tyro API Error (${operation}): No response received`;
    } else {
      // Something happened in setting up the request
      errorMessage = `Tyro API Error (${operation}): ${error.message}`;
    }
    
    console.error(errorMessage, error);
    
    // Create an enhanced error object
    const enhancedError = new Error(errorMessage);
    enhancedError.statusCode = statusCode;
    enhancedError.responseData = responseData;
    enhancedError.operation = operation;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
  
  /**
   * Create sample mock data for testing
   */
  createSampleMockData() {
    if (!this.useMocks || !this.mockSystem) return;
    
    // Sample mock response for payment initiation
    const samplePaymentResponse = {
      paymentId: 'TY-12345678',
      redirectUrl: 'https://tyro.com/payment-page?sessionId=MOCK-12345678&amount=129900',
      status: 'INITIATED',
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    };
    
    this.mockSystem.saveMockResponse('TyroPaymentInitiate', 'Sample payment request', samplePaymentResponse);
    
    // Sample mock response for payment verification
    const sampleVerifyResponse = {
      paymentId: 'TY-12345678',
      status: 'COMPLETED',
      reference: 'TIA123456',
      amount: 129900,
      currency: 'AUD',
      completedAt: new Date().toISOString()
    };
    
    this.mockSystem.saveMockResponse('TyroPaymentVerify', 'TY-12345678', sampleVerifyResponse);
    
    console.log('Created sample Tyro mock data');
  }
}

// Create a singleton instance
const tyroClient = new TyroPaymentClient();

// Create sample mock data if using mocks
if (MOCK_CONFIG.ENABLED) {
  tyroClient.createSampleMockData();
}

module.exports = tyroClient;
