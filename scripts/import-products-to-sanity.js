/**
 * Enhanced script to import product images into Sanity CMS using parsed mapping
 * Usage: node scripts/import-products-to-sanity.js [--limit=10] [--type=group-tour] [--dry-run]
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const limit = args.find(arg => arg.startsWith('--limit='))?.split('=')[1] || null;
const typeFilter = args.find(arg => arg.startsWith('--type='))?.split('=')[1] || null;
const dryRun = args.includes('--dry-run');

// Sanity client configuration
const client = createClient({
  projectId: 'h4qu7hkw',
  dataset: 'production',
  apiVersion: '2024-09-04',
  token: 'skUREaXA9lNLT1nmAZljtznXRIhMhsjsV3W2bmMmB9VdZGqUvfE7YasI6hoaYk1dppUKnHTz7KOpbxm4SkIQMi9XKiReiyL2861TwfhX6JshNHCKkAnuX6jYcQqziFsUIYaD3YT0gZV6djEzq1mHzWuMw13p9VZPBq7fxNfPWP4pzsrBE1ZP',
  useCdn: false,
});

// Paths
const MAPPING_FILE = path.join(__dirname, 'product-image-mapping.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Load the mapping
let productMapping;
try {
  productMapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  console.log(`📋 Loaded mapping with ${Object.keys(productMapping.products).length} products`);
  console.log(`📊 Generated: ${new Date(productMapping.generatedAt).toLocaleString()}`);
} catch (error) {
  console.error('❌ Could not load product mapping. Run parse-product-images.js first.');
  process.exit(1);
}

// Helper function to get friendly product name
function getProductName(productCode, productType) {
  const codeMap = {
    // Group Tours - Kenya
    'NBOGTARP001CKSE': 'Classic Kenya - Serena Lodges',
    'NBOGTARP001CKEKEE': 'Classic Kenya - Keekorok Lodges', 
    'NBOGTARP001CKSM': 'Classic Kenya - Mixed Lodges',
    'NBOGTSOAEASSNM061': 'Kenya Combo Deal - 7 Days',
    'NBOGTSOAEASSNM131': 'East Africa Combo - 13 Days',
    
    // Cruises
    'BBKCRCHO018TIACP3': 'Chobe Princess 3-Night River Cruise',
    'BBKCRTVT001ZAM2NS': 'Zambezi Queen 2-Night Standard',
    
    // Rail
    'VFARLROV001VFPRDX': 'Rovos Rail - Victoria Falls to Pretoria',
    
    // Packages
    'GKPSPSAV002SAVLHM': 'Savanna Lodge Honeymoon Special',
    'GKPSPSABBLDSABBLS': 'Sabi Sabi Bush Lodge - Stay 4 Pay 3',
  };
  
  return codeMap[productCode] || `${productType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${productCode}`;
}

// Helper function to upload image to Sanity
async function uploadImageToSanity(filePath, fileName) {
  try {
    if (dryRun) {
      console.log(`[DRY RUN] Would upload: ${fileName}`);
      return { _id: `dry-run-${Date.now()}-${Math.random()}` };
    }
    
    const imageAsset = await client.assets.upload('image', createReadStream(filePath), {
      filename: fileName
    });
    
    return imageAsset;
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

// Helper function to create product image document
async function createProductImageDocument(productCode, productData, primaryAsset, galleryAssets, mapAsset = null) {
  try {
    const productName = getProductName(productCode, productData.productType);
    
    // Build gallery array
    const gallery = galleryAssets.map((asset, index) => ({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: `${productName} - Image ${index + 2}`,
      order: index + 1
    }));
    
    const doc = {
      _type: 'productImage',
      productCode: productCode,
      productName: productName,
      productType: productData.productType,
      primaryImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: primaryAsset._id
        },
        alt: `${productName} - Main Image`
      },
      gallery: gallery,
      active: true,
      tags: [productData.productType, 'imported'],
      notes: `Imported on ${new Date().toISOString()} with ${productData.imageCount} images`
    };
    
    // Add map image if available
    if (mapAsset) {
      doc.mapImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: mapAsset._id
        },
        alt: `${productName} - Map`
      };
    }
    
    if (dryRun) {
      console.log(`[DRY RUN] Would create document for: ${productCode}`);
      return { _id: `dry-run-doc-${productCode}` };
    }
    
    const result = await client.create(doc);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create document for ${productCode}:`, error.message);
    return null;
  }
}

// Main import function
async function importProducts() {
  console.log('🚀 Starting product import to Sanity...');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No actual changes will be made\n');
  }
  
  // Filter products based on criteria
  let productsToImport = Object.entries(productMapping.products);
  
  if (typeFilter) {
    productsToImport = productsToImport.filter(([code, data]) => data.productType === typeFilter);
    console.log(`🔎 Filtered to ${productsToImport.length} products of type: ${typeFilter}`);
  }
  
  if (limit) {
    const limitNum = parseInt(limit);
    productsToImport = productsToImport.slice(0, limitNum);
    console.log(`📏 Limited to first ${limitNum} products`);
  }
  
  console.log(`\n📦 Processing ${productsToImport.length} products...\n`);
  
  const stats = {
    processed: 0,
    successful: 0,
    failed: 0,
    imagesUploaded: 0,
    imagesFailed: 0
  };
  
  // Process each product
  for (const [productCode, productData] of productsToImport) {
    console.log(`\n📦 Processing ${productCode} (${productData.productType})...`);
    console.log(`   Images: ${productData.imageCount} (Primary: ${productData.primaryImage})`);
    
    stats.processed++;
    
    try {
      // Upload primary image
      const primaryPath = path.join(IMAGES_DIR, productData.primaryImage);
      const primaryAsset = await uploadImageToSanity(primaryPath, productData.primaryImage);
      
      if (!primaryAsset) {
        console.log(`❌ Failed to upload primary image for ${productCode}`);
        stats.failed++;
        continue;
      }
      
      stats.imagesUploaded++;
      
      // Upload gallery images
      const galleryAssets = [];
      
      for (const imageName of productData.galleryImages) {
        const imagePath = path.join(IMAGES_DIR, imageName);
        const asset = await uploadImageToSanity(imagePath, imageName);
        
        if (asset) {
          galleryAssets.push(asset);
          stats.imagesUploaded++;
        } else {
          stats.imagesFailed++;
        }
      }
      
      // Create the product document
      const document = await createProductImageDocument(
        productCode, 
        productData, 
        primaryAsset, 
        galleryAssets
      );
      
      if (document) {
        console.log(`✅ Created product: ${productCode} with ${galleryAssets.length + 1} images`);
        stats.successful++;
      } else {
        console.log(`❌ Failed to create document for ${productCode}`);
        stats.failed++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error processing ${productCode}:`, error.message);
      stats.failed++;
    }
  }
  
  // Final statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total processed: ${stats.processed}`);
  console.log(`✅ Successful: ${stats.successful}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log(`📸 Images uploaded: ${stats.imagesUploaded}`);
  console.log(`💥 Image failures: ${stats.imagesFailed}`);
  console.log(`📈 Success rate: ${((stats.successful / stats.processed) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  
  if (!dryRun) {
    console.log('\n🎉 Import complete!');
    console.log(`Visit http://localhost:3008/studio to view your imported products`);
    console.log(`Or visit https://h4qu7hkw.sanity.studio for the online studio`);
  } else {
    console.log('\n🔍 Dry run complete! Use without --dry-run to actually import.');
  }
}

// Check Sanity connection and schema
async function checkSanitySetup() {
  try {
    console.log('🔌 Checking Sanity connection...');
    
    if (dryRun) {
      console.log('✅ Skipping connection check in dry run mode\n');
      return true;
    }
    
    // Try to query existing documents
    const existingProducts = await client.fetch('*[_type == "productImage"] | order(_createdAt desc) [0...3]');
    console.log(`✅ Connected to Sanity. Found ${existingProducts.length} existing product images\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  try {
    console.log('🎯 Product Image Import to Sanity CMS');
    console.log(`📊 Available: ${Object.keys(productMapping.products).length} products, ${productMapping.statistics.totalExistingImages} images`);
    
    if (typeFilter) console.log(`🔎 Type filter: ${typeFilter}`);
    if (limit) console.log(`📏 Limit: ${limit} products`);
    if (dryRun) console.log(`🔍 Dry run mode: ON`);
    
    console.log('\n' + '-'.repeat(50));
    
    const isConnected = await checkSanitySetup();
    if (!isConnected) {
      process.exit(1);
    }
    
    await importProducts();
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Usage help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🎯 Product Image Import to Sanity CMS

Usage: node scripts/import-products-to-sanity.js [options]

Options:
  --limit=N        Import only first N products (e.g., --limit=10)
  --type=TYPE      Import only products of specific type:
                   • group-tour, package, cruise, rail, accommodation
  --dry-run        Preview what would be imported without making changes
  --help, -h       Show this help message

Examples:
  node scripts/import-products-to-sanity.js --dry-run
  node scripts/import-products-to-sanity.js --limit=5 --type=cruise
  node scripts/import-products-to-sanity.js --type=group-tour

Available product types from your data:
${Object.entries(productMapping.statistics.productTypes)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `  • ${type}: ${count} products`)
  .join('\n')}
  `);
  process.exit(0);
}

// Run the import
main();