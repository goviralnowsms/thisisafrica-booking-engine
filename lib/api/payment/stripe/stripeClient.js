/**
 * Stripe Payment Client
 * Handles interactions with the Stripe API
 */

const stripe = require('stripe');
const { STRIPE_CONFIG } = require('../../config');

class StripeClient {
  constructor() {
    this.stripeClient = stripe(STRIPE_CONFIG.API_KEY);
  }

  /**
   * Create a payment session with Stripe Checkout
   * @param {Object} paymentDetails - Payment details
   * @param {number} paymentDetails.amount - Amount in smallest currency unit (cents)
   * @param {string} paymentDetails.currency - Currency code (e.g., 'usd', 'aud')
   * @param {string} paymentDetails.description - Description of the payment
   * @param {string} paymentDetails.reference - Your internal reference ID
   * @returns {Promise<Object>} Payment session data including redirect URL
   */
  async createPaymentSession(paymentDetails) {
    try {
      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: paymentDetails.currency,
              product_data: {
                name: paymentDetails.description,
              },
              unit_amount: paymentDetails.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: STRIPE_CONFIG.REDIRECT_URL + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: STRIPE_CONFIG.CANCEL_URL,
        metadata: {
          reference: paymentDetails.reference,
        },
      });

      return {
        success: true,
        sessionId: session.id,
        redirectUrl: session.url,
        provider: 'stripe',
      };
    } catch (error) {
      console.error('Stripe payment creation error:', error);
      return {
        success: false,
        error: error.message,
        provider: 'stripe',
      };
    }
  }

  /**
   * Process a payment callback from Stripe
   * @param {Object} callbackData - Data received from Stripe callback
   * @returns {Promise<Object>} Processed payment result
   */
  async processCallback(callbackData) {
    try {
      // For redirect flow, we get a session_id parameter
      if (callbackData.session_id) {
        const session = await this.stripeClient.checkout.sessions.retrieve(
          callbackData.session_id
        );
        
        return {
          success: true,
          paymentId: session.id,
          status: session.payment_status,
          reference: session.metadata?.reference,
          amountPaid: session.amount_total,
          currency: session.currency,
          provider: 'stripe',
        };
      }
      
      // For webhook flow, we would handle Stripe signature verification
      // and event processing here
      
      return {
        success: false,
        error: 'Unsupported callback type',
        provider: 'stripe',
      };
    } catch (error) {
      console.error('Stripe callback processing error:', error);
      return {
        success: false,
        error: error.message,
        provider: 'stripe',
      };
    }
  }

  /**
   * Verify payment status
   * @param {string} paymentId - Stripe session ID
   * @returns {Promise<Object>} Payment status and details
   */
  async verifyPayment(paymentId) {
    try {
      const session = await this.stripeClient.checkout.sessions.retrieve(paymentId);
      
      return {
        success: true,
        paymentId: session.id,
        status: session.payment_status,
        reference: session.metadata?.reference,
        amountPaid: session.amount_total,
        currency: session.currency,
        provider: 'stripe',
      };
    } catch (error) {
      console.error('Stripe payment verification error:', error);
      return {
        success: false,
        error: error.message,
        provider: 'stripe',
      };
    }
  }

  /**
   * Cancel a payment
   * @param {string} paymentId - Stripe session ID to cancel
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelPayment(paymentId) {
    try {
      // For Stripe, we can expire a checkout session
      const session = await this.stripeClient.checkout.sessions.expire(paymentId);
      
      return {
        success: true,
        paymentId: session.id,
        status: 'cancelled',
        provider: 'stripe',
      };
    } catch (error) {
      console.error('Stripe payment cancellation error:', error);
      return {
        success: false,
        error: error.message,
        provider: 'stripe',
      };
    }
  }
}

module.exports = new StripeClient();
