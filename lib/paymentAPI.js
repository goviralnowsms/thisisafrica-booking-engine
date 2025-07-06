/**
 * Payment API Interface
 * Provides a high-level interface for payment operations
 * that works with the underlying payment client abstraction
 */

const paymentClient = require('./api/payment/paymentClient');

/**
 * Initialize a payment session
 * @param {Object} bookingData - The booking data
 * @returns {Promise<Object>} Payment session data including redirect URL
 */
async function initiatePayment(bookingData) {
  try {
    // Extract payment details from booking data
    const paymentDetails = {
      amount: bookingData.depositAmount,
      currency: 'AUD', // Assuming AUD as default currency
      description: `Deposit for ${bookingData.tour.name}`,
      reference: `TIA-${Date.now().toString().slice(-6)}`,
      customerDetails: bookingData.customerDetails
    };

    // Call the payment client to create a payment session
    const result = await paymentClient.createPaymentSession(paymentDetails);

    if (!result.success) {
      throw new Error(result.error || 'Failed to initiate payment');
    }

    return {
      paymentId: result.sessionId,
      redirectUrl: result.redirectUrl,
      provider: result.provider,
      status: 'INITIATED'
    };
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
}

/**
 * Verify the status of a payment
 * @param {string} paymentId - The payment ID to verify
 * @returns {Promise<Object>} Payment verification result
 */
async function verifyPaymentStatus(paymentId) {
  try {
    const result = await paymentClient.verifyPayment(paymentId);

    if (!result.success) {
      throw new Error(result.error || 'Failed to verify payment');
    }

    return {
      status: result.status === 'paid' ? 'COMPLETED' : 'PENDING',
      reference: result.reference,
      amount: result.amountPaid,
      currency: result.currency,
      provider: result.provider
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/**
 * Process a payment callback (from redirect or webhook)
 * @param {Object} callbackData - Data received from payment provider callback
 * @returns {Promise<Object>} Processed payment result
 */
async function processPaymentCallback(callbackData) {
  try {
    const result = await paymentClient.processCallback(callbackData);

    if (!result.success) {
      throw new Error(result.error || 'Failed to process payment callback');
    }

    return {
      status: result.status === 'paid' ? 'COMPLETED' : 'PENDING',
      reference: result.reference,
      amount: result.amountPaid,
      currency: result.currency,
      provider: result.provider
    };
  } catch (error) {
    console.error('Error processing payment callback:', error);
    throw error;
  }
}

module.exports = {
  initiatePayment,
  verifyPaymentStatus,
  processPaymentCallback
};
