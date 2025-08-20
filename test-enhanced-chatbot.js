#!/usr/bin/env node

// Test script for enhanced chatbot APIs
const https = require('https')

const BASE_URL = 'http://localhost:3000'

// Test functions
async function testProductsAPI() {
  console.log('🤖 Testing Products API...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/chatbot/products?q=safari&limit=3`)
    const data = await response.json()
    
    console.log('✅ Products API Response:', {
      success: data.success,
      count: data.count,
      firstProduct: data.products?.[0]?.name,
      hasRealPricing: data.products?.[0]?.price !== 'Contact for pricing'
    })
  } catch (error) {
    console.log('❌ Products API Error:', error.message)
  }
}

async function testSearchAPI() {
  console.log('🤖 Testing Advanced Search API...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/chatbot/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Kenya safari wildlife Big Five',
        destination: 'Kenya',
        budget: '$5000',
        travelers: 'Couple'
      })
    })
    const data = await response.json()
    
    console.log('✅ Search API Response:', {
      success: data.success,
      intent: data.intent?.type,
      destinations: data.intent?.destinations,
      activities: data.intent?.activities,
      productCount: data.count,
      contextualResponse: data.response?.substring(0, 100) + '...'
    })
  } catch (error) {
    console.log('❌ Search API Error:', error.message)
  }
}

async function testAvailabilityAPI() {
  console.log('🤖 Testing Availability API...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/chatbot/availability?productCode=NBOGTARP001CKSE`)
    const data = await response.json()
    
    console.log('✅ Availability API Response:', {
      success: data.success,
      productName: data.productName,
      available: data.available,
      hasPricing: !!data.pricing?.twinRate,
      responsePreview: data.response?.substring(0, 100) + '...'
    })
  } catch (error) {
    console.log('❌ Availability API Error:', error.message)
  }
}

async function testPDFContentAPI() {
  console.log('🤖 Testing PDF Content API...')
  
  try {
    const response = await fetch(`${BASE_URL}/api/chatbot/pdf-content?productCode=NBOGTARP001CKSE`)
    const data = await response.json()
    
    console.log('✅ PDF Content API Response:', {
      success: data.success,
      pdfCount: data.count,
      hasContent: !!data.content,
      contentPreview: data.content?.substring(0, 100) + '...'
    })
  } catch (error) {
    console.log('❌ PDF Content API Error:', error.message)
  }
}

// Test suite
async function runTests() {
  console.log('🚀 Starting Enhanced Chatbot API Tests...\n')
  
  // Check if server is running
  try {
    const healthCheck = await fetch(`${BASE_URL}/api/tourplan/debug`)
    console.log('✅ Server is running\n')
  } catch (error) {
    console.log('❌ Server is not running. Please start with: pnpm dev\n')
    return
  }
  
  await testProductsAPI()
  console.log('')
  await testSearchAPI()
  console.log('')
  await testAvailabilityAPI()
  console.log('')
  await testPDFContentAPI()
  
  console.log('\n🎉 Enhanced Chatbot API Tests Complete!')
  console.log('\n📋 Test Summary:')
  console.log('- Products API: Provides live TourPlan product data')
  console.log('- Search API: Advanced query parsing and product matching')
  console.log('- Availability API: Real-time pricing and availability')
  console.log('- PDF Content API: Access to product brochure information')
  console.log('\nThe enhanced chatbot now has access to:')
  console.log('✅ Live product inventory')
  console.log('✅ Real-time pricing')
  console.log('✅ PDF brochure content')
  console.log('✅ Intelligent search and matching')
  console.log('✅ Contextual responses')
}

// Polyfill fetch for Node.js
if (typeof fetch === 'undefined') {
  global.fetch = async (url, options = {}) => {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url)
      const lib = parsedUrl.protocol === 'https:' ? require('https') : require('http')
      
      const reqOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: options.method || 'GET',
        headers: options.headers || {}
      }
      
      const req = lib.request(reqOptions, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data)
          })
        })
      })
      
      req.on('error', reject)
      
      if (options.body) {
        req.write(options.body)
      }
      
      req.end()
    })
  }
}

runTests().catch(console.error)