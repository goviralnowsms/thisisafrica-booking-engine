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
  localFilename: string;
  localPath: string;
  id: number;
  status: 'exists' | 'missing';
}

interface ImageIndex {
  [productCode: string]: ImageIndexEntry[];
}

interface PDFIndex {
  [productCode: string]: PDFIndexEntry[];
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
let pdfIndexCache: PDFIndex | null = null;

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
 * Load the PDF index from the JSON file
 */
function loadPDFIndex(): PDFIndex {
  if (pdfIndexCache) {
    return pdfIndexCache;
  }

  try {
    const indexPath = path.join(process.cwd(), 'public', 'pdfs', 'product-pdf-index.json');
    
    if (!fs.existsSync(indexPath)) {
      console.warn('PDF index not found, creating empty index');
      return {};
    }

    const indexData = fs.readFileSync(indexPath, 'utf8');
    pdfIndexCache = JSON.parse(indexData);
    return pdfIndexCache || {};
  } catch (error) {
    console.error('Error loading PDF index:', error);
    return {};
  }
}

// Removed private getPDFsForProduct function - now exported at bottom of file

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
  pdfIndexCache = null;
}

/**
 * Get PDFs for a product code - exported for direct use
 */
export function getPDFsForProduct(productCode: string): Array<{
  url: string;
  name: string;
  originalName: string;
  status: string;
}> {
  // Clear cache to get fresh data
  pdfIndexCache = null;
  
  const pdfIndex = loadPDFIndex();
  
  // Try exact match first
  let productPDFs = pdfIndex[productCode];
  
  // Try with trailing spaces (as seen in the index)
  if (!productPDFs && pdfIndex[`${productCode}  `]) {
    productPDFs = pdfIndex[`${productCode}  `];
  }
  
  if (!productPDFs || productPDFs.length === 0) {
    return [];
  }

  // Transform to match the expected format
  return productPDFs
    .filter(pdf => pdf.status === 'exists' && pdf.localPath)
    .map(pdf => ({
      url: pdf.localPath,
      name: pdf.originalName.includes('itinerary') ? 'Tour Itinerary' : 'Tour Brochure',
      originalName: pdf.originalName,
      status: pdf.status
    }));
}