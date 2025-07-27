// lib/map-index.ts
// Map index utilities for tour route maps

import fs from 'fs';
import path from 'path';

interface MapEntry {
  productCode: string;
  mapFile: string;
  destination: string;
  region?: string;
  status: 'exists' | 'missing';
}

interface MapIndex {
  [productCode: string]: MapEntry;
}

// Destination/region mapping for fallback maps
const DESTINATION_MAPS: { [key: string]: string } = {
  // Kenya regions
  'kenya': 'kenya.png',
  'masai-mara': 'masai-mara.png',
  'amboseli': 'amboseli.png',
  'lake-nakuru': 'lake-nakuru.png',
  'tsavo': 'tsavo.png',
  'samburu': 'samburu.png',
  
  // Tanzania regions
  'tanzania': 'tanzania.png',
  'serengeti': 'serengeti.png',
  'ngorongoro': 'ngorongoro.png',
  'tarangire': 'tarangire.png',
  'lake-manyara': 'lake-manyara.png',
  
  // Other African destinations
  'botswana': 'botswana.png',
  'namibia': 'namibia.png',
  'south-africa': 'south-africa.png',
  'zambia': 'zambia.png',
  'zimbabwe': 'zimbabwe.png',
  'uganda': 'uganda.png',
  'rwanda': 'rwanda.png'
};

let mapIndexCache: MapIndex | null = null;

/**
 * Load the map index from the JSON file
 */
export function loadMapIndex(): MapIndex {
  if (mapIndexCache) {
    return mapIndexCache;
  }

  try {
    const indexPath = path.join(process.cwd(), 'public', 'images', 'maps', 'map-index.json');
    
    if (!fs.existsSync(indexPath)) {
      console.warn('Map index not found, creating empty index');
      return {};
    }

    const indexData = fs.readFileSync(indexPath, 'utf8');
    mapIndexCache = JSON.parse(indexData);
    return mapIndexCache || {};
  } catch (error) {
    console.error('Error loading map index:', error);
    return {};
  }
}

/**
 * Get map file for a product code
 */
export function getProductMap(productCode: string): string | null {
  // First check if there's a specific map for this product
  const mapsDir = path.join(process.cwd(), 'public', 'images', 'maps');
  
  // Try product-specific map first
  const productMapFile = `${productCode}.png`;
  const productMapPath = path.join(mapsDir, productMapFile);
  
  if (fs.existsSync(productMapPath)) {
    return `/images/maps/${productMapFile}`;
  }

  // Try alternative formats
  const alternativeFormats = [
    `${productCode}.jpg`,
    `${productCode}.jpeg`,
    `${productCode.toLowerCase()}.png`,
  ];

  for (const format of alternativeFormats) {
    const altPath = path.join(mapsDir, format);
    if (fs.existsSync(altPath)) {
      return `/images/maps/${format}`;
    }
  }

  // Fallback to destination/region maps based on product code patterns
  return getDestinationMap(productCode);
}

/**
 * Get destination map based on product code patterns
 */
export function getDestinationMap(productCode: string): string | null {
  const code = productCode.toLowerCase();
  
  // Kenya products (NBO = Nairobi)
  if (code.startsWith('nbo')) {
    // Try to determine specific region from product code
    if (code.includes('mara') || code.includes('mm')) {
      return checkMapExists('masai-mara.png') || checkMapExists('kenya.png');
    }
    if (code.includes('amboseli') || code.includes('amb')) {
      return checkMapExists('amboseli.png') || checkMapExists('kenya.png');
    }
    if (code.includes('nakuru') || code.includes('nak')) {
      return checkMapExists('lake-nakuru.png') || checkMapExists('kenya.png');
    }
    if (code.includes('tsavo') || code.includes('tsa')) {
      return checkMapExists('tsavo.png') || checkMapExists('kenya.png');
    }
    if (code.includes('samburu') || code.includes('sam')) {
      return checkMapExists('samburu.png') || checkMapExists('kenya.png');
    }
    return checkMapExists('kenya.png');
  }
  
  // Tanzania products (ARK = Arusha)
  if (code.startsWith('ark') || code.startsWith('jro')) {
    if (code.includes('serengeti') || code.includes('ser')) {
      return checkMapExists('serengeti.png') || checkMapExists('tanzania.png');
    }
    if (code.includes('ngorongoro') || code.includes('ngo')) {
      return checkMapExists('ngorongoro.png') || checkMapExists('tanzania.png');
    }
    if (code.includes('tarangire') || code.includes('tar')) {
      return checkMapExists('tarangire.png') || checkMapExists('tanzania.png');
    }
    if (code.includes('manyara') || code.includes('man')) {
      return checkMapExists('lake-manyara.png') || checkMapExists('tanzania.png');
    }
    return checkMapExists('tanzania.png');
  }
  
  // Other destinations
  if (code.startsWith('gab') || code.includes('botswana')) {
    return checkMapExists('botswana.png');
  }
  if (code.startsWith('wdh') || code.includes('namibia')) {
    return checkMapExists('namibia.png');
  }
  if (code.startsWith('cpt') || code.startsWith('jnb') || code.includes('south-africa')) {
    return checkMapExists('south-africa.png');
  }
  
  return null;
}

/**
 * Check if a map file exists and return the path
 */
function checkMapExists(filename: string): string | null {
  const mapPath = path.join(process.cwd(), 'public', 'images', 'maps', filename);
  return fs.existsSync(mapPath) ? `/images/maps/${filename}` : null;
}

/**
 * Get all available maps
 */
export function getAvailableMaps(): string[] {
  const mapsDir = path.join(process.cwd(), 'public', 'images', 'maps');
  
  if (!fs.existsSync(mapsDir)) {
    return [];
  }
  
  return fs.readdirSync(mapsDir)
    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
    .map(file => `/images/maps/${file}`);
}

/**
 * Clear the map index cache (useful for development)
 */
export function clearMapIndexCache(): void {
  mapIndexCache = null;
}