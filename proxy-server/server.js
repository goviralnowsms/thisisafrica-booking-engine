const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const TOURPLAN_API_URL = 'https://pa-thisis.nx.tourplan.net';
const API_KEY = process.env.API_KEY || 'your-secret-api-key-here';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,https://thisisafrica.com.au').split(',');

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// CORS and API key validation middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const apiKey = req.headers['x-api-key'];
  
  // Check API key
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  // Set CORS headers
  if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Proxy configuration
const proxyOptions = {
  target: TOURPLAN_API_URL,
  changeOrigin: true,
  secure: true,
  logLevel: 'info',
  timeout: 30000, // 30 second timeout
  proxyTimeout: 30000,
  onProxyReq: (proxyReq, req, res) => {
    // Remove the API key header before forwarding
    proxyReq.removeHeader('x-api-key');
    
    // Log the request
    console.log(`[${new Date().toISOString()}] Proxying: ${req.method} ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the response
    console.log(`[${new Date().toISOString()}] Response: ${proxyRes.statusCode} for ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`[${new Date().toISOString()}] Proxy error:`, err.message);
    
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Proxy error',
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
  }
};

// Apply proxy to all routes except health check
app.use('/hostconnect', createProxyMiddleware(proxyOptions));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found', 
    path: req.path,
    message: 'Use /hostconnect/* for TourPlan API proxy' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TourPlan proxy server running on port ${PORT}`);
  console.log(`Proxying to: ${TOURPLAN_API_URL}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});