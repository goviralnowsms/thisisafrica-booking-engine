/**
 * API Configuration File
 * Contains configuration settings for all API integrations
 */

// TourPlan API Configuration
const TOURPLAN_CONFIG = {
  API_URL: process.env.TOURPLAN_API_URL || 'https://pa-thisis.nx.tourplan.net/hostconnect_test/api/hostConnectApi',
  AGENT_ID: process.env.TOURPLAN_AGENT_ID || 'SAMAGT',
  PASSWORD: process.env.TOURPLAN_PASSWORD || 'S@MAgt01',
  // Optional timeout in milliseconds
  TIMEOUT: 30000,
};

// Stripe Payment API Configuration
const STRIPE_CONFIG = {
  API_KEY: process.env.STRIPE_API_KEY || 'sk_test_your_test_key',
  PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || 'pk_test_your_test_key',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  REDIRECT_URL: `${process.env.APP_URL || 'http://localhost:3000'}/payment/callback`,
  CANCEL_URL: `${process.env.APP_URL || 'http://localhost:3000'}/payment/cancel`,
};

// Tyro Payment API Configuration
const TYRO_CONFIG = {
  API_URL: process.env.TYRO_API_URL || 'https://api.tyro.com',
  API_KEY: process.env.TYRO_API_KEY || 'test_api_key',
  WEBHOOK_SECRET: process.env.TYRO_WEBHOOK_SECRET,
  REDIRECT_URL: `${process.env.APP_URL || 'http://localhost:3000'}/payment/callback`,
  CANCEL_URL: `${process.env.APP_URL || 'http://localhost:3000'}/payment/cancel`,
};

// Payment Provider Selection
const PAYMENT_CONFIG = {
  PROVIDER: process.env.PAYMENT_PROVIDER || 'stripe', // 'stripe' or 'tyro'
};

// Mock System Configuration
const MOCK_CONFIG = {
  ENABLED: process.env.USE_MOCKS === 'true' || true, // Set to true for development
  DELAY: parseInt(process.env.MOCK_DELAY || '500', 10),
  DIRECTORY: process.env.MOCK_DIRECTORY || 'mocks',
};

module.exports = {
  TOURPLAN_CONFIG,
  STRIPE_CONFIG,
  TYRO_CONFIG,
  PAYMENT_CONFIG,
  MOCK_CONFIG,
};
