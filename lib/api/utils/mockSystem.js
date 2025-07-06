/**
 * Mock System
 * Provides functionality for mocking API responses during development
 */

const fs = require('fs');
const path = require('path');
const { MOCK_CONFIG } = require('../config');

class MockSystem {
  constructor(basePath) {
    this.basePath = basePath || path.join(__dirname, '..', '..', MOCK_CONFIG.DIRECTORY);
    this.enabled = MOCK_CONFIG.ENABLED;
    this.delay = MOCK_CONFIG.DELAY;
    
    // Create the mock directory if it doesn't exist
    if (this.enabled && !fs.existsSync(this.basePath)) {
      try {
        fs.mkdirSync(this.basePath, { recursive: true });
        console.log('Created mock directory:', this.basePath);
      } catch (err) {
        console.error('Error creating mock directory:', err);
      }
    }
  }

  /**
   * Save a mock response to the filesystem
   * @param {string} identifier - Unique identifier for this mock response
   * @param {any} requestData - The request data that generated this response
   * @param {any} responseData - The response data to save
   * @returns {boolean} - Whether the save was successful
   */
  saveMockResponse(identifier, requestData, responseData) {
    if (!this.enabled) return false;
    
    try {
      const filename = path.join(this.basePath, `${identifier}.json`);
      fs.writeFileSync(
        filename, 
        JSON.stringify({
          request: requestData,
          response: responseData,
          timestamp: new Date().toISOString()
        }, null, 2)
      );
      console.log(`Mock response saved to ${filename}`);
      return true;
    } catch (err) {
      console.error('Error saving mock response:', err);
      return false;
    }
  }

  /**
   * Get a mock response from the filesystem
   * @param {string} identifier - Unique identifier for the mock response
   * @returns {any|null} - The mock response data or null if not found
   */
  getMockResponse(identifier) {
    if (!this.enabled) return null;
    
    try {
      const filename = path.join(this.basePath, `${identifier}.json`);
      if (fs.existsSync(filename)) {
        const mockData = JSON.parse(fs.readFileSync(filename, 'utf8'));
        console.log(`Using mock response from ${filename}`);
        return mockData.response;
      }
    } catch (err) {
      console.error('Error reading mock response:', err);
    }
    return null;
  }

  /**
   * Simulates a network delay
   * @returns {Promise<void>}
   */
  async simulateDelay() {
    if (this.enabled && this.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.delay));
    }
  }

  /**
   * Generate mock data for a specific scenario
   * @param {string} scenario - The scenario to generate mock data for
   * @param {Object} options - Options for the generated data
   * @returns {any} - The generated mock data
   */
  generateMockData(scenario, options = {}) {
    // Override this method in subclasses for specific mock data generation
    throw new Error('generateMockData must be implemented by subclasses');
  }
}

module.exports = MockSystem;
