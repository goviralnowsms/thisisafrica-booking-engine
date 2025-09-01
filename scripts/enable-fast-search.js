#!/usr/bin/env node
/**
 * Script to enable/disable optimized search
 * Usage: node scripts/enable-fast-search.js [enable|disable|status]
 */

const fs = require('fs');
const path = require('path');

const SEARCH_ROUTE_PATH = path.join(__dirname, '..', 'app', 'api', 'tourplan', 'search', 'route.ts');
const CONFIG_PATH = path.join(__dirname, '..', 'lib', 'tourplan', 'config.ts');

function getCurrentStatus() {
  const content = fs.readFileSync(SEARCH_ROUTE_PATH, 'utf-8');
  const isOptimized = content.includes('searchProductsOptimized as searchProducts');
  return isOptimized ? 'optimized' : 'original';
}

function enableOptimized() {
  let content = fs.readFileSync(SEARCH_ROUTE_PATH, 'utf-8');
  
  // Comment out original import
  content = content.replace(
    "import { searchProducts } from '@/lib/tourplan/services';",
    "// import { searchProducts } from '@/lib/tourplan/services';"
  );
  
  // Uncomment optimized import
  content = content.replace(
    "// import { searchProductsOptimized as searchProducts } from '@/lib/tourplan/services-optimized';",
    "import { searchProductsOptimized as searchProducts } from '@/lib/tourplan/services-optimized';"
  );
  
  fs.writeFileSync(SEARCH_ROUTE_PATH, content);
  console.log('✅ Optimized search enabled');
}

function disableOptimized() {
  let content = fs.readFileSync(SEARCH_ROUTE_PATH, 'utf-8');
  
  // Uncomment original import
  content = content.replace(
    "// import { searchProducts } from '@/lib/tourplan/services';",
    "import { searchProducts } from '@/lib/tourplan/services';"
  );
  
  // Comment out optimized import
  content = content.replace(
    "import { searchProductsOptimized as searchProducts } from '@/lib/tourplan/services-optimized';",
    "// import { searchProductsOptimized as searchProducts } from '@/lib/tourplan/services-optimized';"
  );
  
  fs.writeFileSync(SEARCH_ROUTE_PATH, content);
  console.log('✅ Original search restored');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'enable':
    enableOptimized();
    break;
  case 'disable':
    disableOptimized();
    break;
  case 'status':
  default:
    const status = getCurrentStatus();
    console.log(`Current search implementation: ${status}`);
    console.log('\nUsage:');
    console.log('  node scripts/enable-fast-search.js enable   - Use optimized search');
    console.log('  node scripts/enable-fast-search.js disable  - Use original search');
    console.log('  node scripts/enable-fast-search.js status   - Check current status');
}