// lib/image-index.ts
// Image index utilities for local image handling

import fs from 'fs';
import path from 'path';

interface ImageIndexEntry {
  originalName: string;
  localFilename: string;
  localPath: string | null;
  id: number;
  status: 'exists' | 'missing';
}

interface PDFIndexEntry {
  originalName: string;
  localPath: string;
  name: string;
  status: 'exists' | 'missing';
}

interface ImageIndex {
  [productCode: string]: ImageIndexEntry[];
}

interface ProductAssets {
  images: Array<{
    url: string;
    type: string;
    category: string;
    originalName: string;
    status?: string;
  }>;
  pdfs: Array<{
    url: string;
    name: string;
    originalName: string;
    status: string;
  }>;
}

let imageIndexCache: ImageIndex | null = null;

/**
 * Load the image index from the JSON file
 */
export function loadImageIndex(): ImageIndex {
  if (imageIndexCache) {
    return imageIndexCache;
  }

  try {
    const indexPath = path.join(process.cwd(), 'public', 'images', 'product-image-index.json');
    
    if (!fs.existsSync(indexPath)) {
      console.warn('Image index not found, creating empty index');
      return {};
    }

    const indexData = fs.readFileSync(indexPath, 'utf8');
    imageIndexCache = JSON.parse(indexData);
    return imageIndexCache || {};
  } catch (error) {
    console.error('Error loading image index:', error);
    return {};
  }
}

/**
 * Get local assets for a product code
 */
export function getLocalAssets(productCode: string): ProductAssets {
  const imageIndex = loadImageIndex();
  const productImages = imageIndex[productCode] || [];

  // Transform to match the expected format from the docs
  const images = productImages
    .filter(img => img.status === 'exists' && img.localPath)
    .map(img => ({
      url: img.localPath!,
      type: 'image',
      category: 'product',
      originalName: img.originalName,
      status: img.status
    }));

  // For PDFs, we'll check common patterns
  const pdfs = getPDFsForProduct(productCode);

  return {
    images,
    pdfs
  };
}

/**
 * Get PDF files for a product (check common patterns)
 */
function getPDFsForProduct(productCode: string): Array<{
  url: string;
  name: string;
  originalName: string;
  status: string;
}> {
  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  const pdfs = [];

  // Common PDF patterns for TourPlan products
  const pdfPatterns = [
    `${productCode}.pdf`,
    `${productCode}_itinerary.pdf`,
    `${productCode}_brochure.pdf`,
    `itinerary_${productCode}.pdf`
  ];

  for (const pattern of pdfPatterns) {
    const pdfPath = path.join(pdfDir, pattern);
    
    if (fs.existsSync(pdfPath)) {
      pdfs.push({
        url: `/pdfs/${pattern}`,
        name: pattern.includes('itinerary') ? 'Itinerary' : 'Product Brochure',
        originalName: pattern,
        status: 'exists'
      });
    }
  }

  return pdfs;
}

/**
 * Check if a product has images available
 */
export function hasImages(productCode: string): boolean {
  const assets = getLocalAssets(productCode);
  return assets.images.length > 0;
}

/**
 * Get the primary image for a product
 */
export function getPrimaryImage(productCode: string): string | null {
  const assets = getLocalAssets(productCode);
  return assets.images.length > 0 ? assets.images[0].url : null;
}

/**
 * Clear the image index cache (useful for development)
 */
export function clearImageIndexCache(): void {
  imageIndexCache = null;
}