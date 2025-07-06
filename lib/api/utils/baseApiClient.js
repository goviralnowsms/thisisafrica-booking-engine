/**
 * Base API Client
 * Provides common functionality for all API clients
 */

const axios = require('axios');
const MockSystem = require('./mockSystem');

class BaseApiClient {
  /**
   * @param {Object} config - Configuration for the API client
   * @param {string} config.baseUrl - Base URL for the API
   * @param {Object} config.headers - Default headers for requests
   * @param {number} config.timeout - Request timeout in milliseconds
   * @param {boolean} config.useMocks - Whether to use mock responses
   * @param {string} config.mockPath - Path to store mock responses
   */
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl;
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: config.headers || { 'Content-Type': 'application/json' },
      timeout: config.timeout || 30000,
    });
    
    // Set up mock system if enabled
    if (config.useMocks) {
      this.mockSystem = new MockSystem(config.mockPath);
    }
  }

  /**
   * Make an API request with proper error handling and mock support
   * @param {Object} options - Request options
   * @param {string} options.method - HTTP method (GET, POST, etc.)
   * @param {string} options.url - Request URL (will be appended to baseUrl)
   * @param {Object} options.data - Request data/body
   * @param {Object} options.params - URL parameters
   * @param {Object} options.headers - Request headers
   * @param {string} options.mockId - Identifier for mock responses
   * @returns {Promise<any>} - API response
   */
  async request({ method, url, data, params, headers, mockId }) {
    // Check for mock response if mockSystem is available
    if (this.mockSystem && mockId) {
      const mockResponse = this.mockSystem.getMockResponse(mockId);
      if (mockResponse) {
        await this.mockSystem.simulateDelay();
        return mockResponse;
      }
      console.log(`No mock found for ${mockId}, will make actual API call and save response`);
    }
    
    try {
      console.log(`Sending ${method} request to: ${this.baseUrl}${url}`);
      
      const response = await this.client({
        method,
        url,
        data,
        params,
        headers,
      });
      
      // Save successful response as mock for future use
      if (this.mockSystem && mockId) {
        this.mockSystem.saveMockResponse(mockId, { method, url, data, params }, response.data);
      }
      
      return response.data;
    } catch (error) {
      this.handleRequestError(error);
    }
  }
  
  /**
   * Handle API request errors
   * @param {Error} error - The error object
   * @throws {Error} - Rethrows the error with additional context
   */
  handleRequestError(error) {
    let errorMessage = 'API request failed';
    let statusCode = 500;
    let responseData = null;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      statusCode = error.response.status;
      responseData = error.response.data;
      errorMessage = `API error ${statusCode}: ${JSON.stringify(responseData)}`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response received from API server';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = `Error setting up request: ${error.message}`;
    }
    
    console.error(errorMessage, error);
    
    // Create an enhanced error object
    const enhancedError = new Error(errorMessage);
    enhancedError.statusCode = statusCode;
    enhancedError.responseData = responseData;
    enhancedError.originalError = error;
    
    throw enhancedError;
  }
}

module.exports = BaseApiClient;
