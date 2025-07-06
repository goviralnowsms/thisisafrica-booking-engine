#!/usr/bin/env node

/**
 * Stripe Setup Validation Script
 * Validates that Stripe keys are properly configured
 */

require('dotenv').config({ path: '.env.local' });

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function validateStripeKeys() {
  console.log(`${colors.bold}🔍 Validating Stripe Configuration...${colors.reset}\n`);

  const checks = [
    {
      name: 'STRIPE_API_KEY exists',
      test: () => !!process.env.STRIPE_API_KEY,
      fix: 'Add STRIPE_API_KEY to your .env.local file'
    },
    {
      name: 'STRIPE_PUBLIC_KEY exists',
      test: () => !!process.env.STRIPE_PUBLIC_KEY,
      fix: 'Add STRIPE_PUBLIC_KEY to your .env.local file'
    },
    {
      name: 'Secret key format is correct',
      test: () => process.env.STRIPE_API_KEY?.startsWith('sk_'),
      fix: 'STRIPE_API_KEY should start with "sk_test_" for development or "sk_live_" for production'
    },
    {
      name: 'Public key format is correct',
      test: () => process.env.STRIPE_PUBLIC_KEY?.startsWith('pk_'),
      fix: 'STRIPE_PUBLIC_KEY should start with "pk_test_" for development or "pk_live_" for production'
    },
    {
      name: 'Using test keys (recommended for development)',
      test: () => process.env.STRIPE_API_KEY?.startsWith('sk_test_') && process.env.STRIPE_PUBLIC_KEY?.startsWith('pk_test_'),
      fix: 'Consider using test keys (sk_test_/pk_test_) for development',
      warning: true
    },
    {
      name: 'Keys are not placeholder values',
      test: () => {
        const apiKey = process.env.STRIPE_API_KEY;
        const publicKey = process.env.STRIPE_PUBLIC_KEY;
        return apiKey !== 'sk_test_your_test_key' && 
               publicKey !== 'pk_test_your_test_key' &&
               !apiKey?.includes('your_') &&
               !publicKey?.includes('your_');
      },
      fix: 'Replace placeholder values with your actual Stripe keys from the dashboard'
    }
  ];

  let passed = 0;
  let warnings = 0;

  checks.forEach((check, index) => {
    const result = check.test();
    const icon = result ? '✅' : (check.warning ? '⚠️' : '❌');
    const color = result ? colors.green : (check.warning ? colors.yellow : colors.red);
    
    log(color, `${icon} ${check.name}`);
    
    if (result) {
      passed++;
    } else if (check.warning) {
      warnings++;
      log(colors.yellow, `   💡 ${check.fix}`);
    } else {
      log(colors.red, `   🔧 ${check.fix}`);
    }
  });

  console.log('\n' + '─'.repeat(50));
  
  if (passed === checks.length) {
    log(colors.green, `🎉 All checks passed! Your Stripe setup looks good.`);
  } else {
    const failed = checks.length - passed - warnings;
    if (failed > 0) {
      log(colors.red, `❌ ${failed} check(s) failed. Please fix the issues above.`);
    }
    if (warnings > 0) {
      log(colors.yellow, `⚠️  ${warnings} warning(s). Consider addressing these for better security.`);
    }
  }

  console.log('\n📚 For detailed setup instructions, see: STRIPE_SETUP.md');
  
  return passed === checks.length;
}

// Test Stripe connection if keys are valid
async function testStripeConnection() {
  if (!process.env.STRIPE_API_KEY || process.env.STRIPE_API_KEY.includes('your_')) {
    return;
  }

  try {
    console.log(`\n${colors.bold}🔌 Testing Stripe Connection...${colors.reset}`);
    
    const stripe = require('stripe')(process.env.STRIPE_API_KEY);
    
    // Test API connection by retrieving account info
    const account = await stripe.accounts.retrieve();
    
    log(colors.green, `✅ Successfully connected to Stripe`);
    log(colors.blue, `   Account ID: ${account.id}`);
    log(colors.blue, `   Country: ${account.country}`);
    log(colors.blue, `   Test Mode: ${account.livemode ? 'No (Live)' : 'Yes (Test)'}`);
    
  } catch (error) {
    log(colors.red, `❌ Failed to connect to Stripe: ${error.message}`);
    log(colors.yellow, `   💡 Check that your STRIPE_API_KEY is correct and has the proper permissions`);
  }
}

// Main execution
async function main() {
  const isValid = validateStripeKeys();
  
  if (isValid) {
    await testStripeConnection();
  }
  
  process.exit(isValid ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateStripeKeys, testStripeConnection };
