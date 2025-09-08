/**
 * Script to parse product images SQL file and create improved import mapping
 * Usage: node scripts/parse-product-images.js
 */

const fs = require('fs');
const path = require('path');

// Paths
const SQL_FILE = path.join(__dirname, '..', 'docs', 'scripts', 'af_product_images.sql');
const OUTPUT_FILE = path.join(__dirname, 'product-image-mapping.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

function parseProductImagesSQL(filePath) {
  console.log('📖 Reading SQL file...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  const insertPattern = /\((\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)'\)/g;
  
  const productMap = {};
  let match;
  
  while ((match = insertPattern.exec(content)) !== null) {
    const [_, id, productCode, imageName, status, createdDate] = match;
    
    // Clean up product code (remove trailing spaces)
    const cleanProductCode = productCode.trim();
    
    if (status === '1') { // Only include active images
      if (!productMap[cleanProductCode]) {
        productMap[cleanProductCode] = {
          productCode: cleanProductCode,
          images: [],
          totalImages: 0
        };
      }
      
      productMap[cleanProductCode].images.push({
        id: parseInt(id),
        fileName: imageName,
        createdDate: createdDate,
        exists: false // Will check existence later
      });
      
      productMap[cleanProductCode].totalImages++;
    }
  }
  
  console.log(`✅ Parsed ${Object.keys(productMap).length} unique product codes`);
  return productMap;
}

function checkImageExistence(productMap) {
  console.log('🔍 Checking which images exist in the filesystem...');
  
  let existingCount = 0;
  let missingCount = 0;
  const missingImages = [];
  
  // Get all available image files
  const availableImages = fs.existsSync(IMAGES_DIR) 
    ? fs.readdirSync(IMAGES_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    : [];
    
  console.log(`📁 Found ${availableImages.length} images in products directory`);
  
  for (const [productCode, data] of Object.entries(productMap)) {
    data.existingImages = [];
    data.missingImages = [];
    
    for (const image of data.images) {
      if (availableImages.includes(image.fileName)) {
        image.exists = true;
        data.existingImages.push(image);
        existingCount++;
      } else {
        data.missingImages.push(image);
        missingImages.push({ productCode, fileName: image.fileName });
        missingCount++;
      }
    }
  }
  
  console.log(`✅ Found: ${existingCount} existing images`);
  console.log(`❌ Missing: ${missingCount} images`);
  
  if (missingCount > 0) {
    console.log('\n⚠️ Missing images by product:');
    const missingByProduct = {};
    missingImages.forEach(({ productCode, fileName }) => {
      if (!missingByProduct[productCode]) missingByProduct[productCode] = [];
      missingByProduct[productCode].push(fileName);
    });
    
    Object.entries(missingByProduct).slice(0, 10).forEach(([code, files]) => {
      console.log(`   ${code}: ${files.length} missing (${files.slice(0, 3).join(', ')}${files.length > 3 ? '...' : ''})`);
    });
    
    if (Object.keys(missingByProduct).length > 10) {
      console.log(`   ... and ${Object.keys(missingByProduct).length - 10} more products`);
    }
  }
  
  return productMap;
}

function generateImportMapping(productMap) {
  console.log('🏗️ Generating import mapping...');
  
  const importMapping = {};
  const statistics = {
    totalProducts: 0,
    productsWithImages: 0,
    totalExistingImages: 0,
    productTypes: {}
  };
  
  for (const [productCode, data] of Object.entries(productMap)) {
    if (data.existingImages.length > 0) {
      // Determine product type from code
      let productType = 'unknown';
      if (productCode.includes('GT')) productType = 'group-tour';
      else if (productCode.includes('CR')) productType = 'cruise';
      else if (productCode.includes('RL')) productType = 'rail';
      else if (productCode.includes('AC')) productType = 'accommodation';
      else if (productCode.includes('DT')) productType = 'day-tour';
      else if (productCode.includes('PK')) productType = 'package';
      
      importMapping[productCode] = {
        productCode: productCode,
        productType: productType,
        primaryImage: data.existingImages[0].fileName, // Use first image as primary
        galleryImages: data.existingImages.slice(1).map(img => img.fileName),
        allImages: data.existingImages.map(img => img.fileName),
        imageCount: data.existingImages.length
      };
      
      statistics.productsWithImages++;
      statistics.totalExistingImages += data.existingImages.length;
      statistics.productTypes[productType] = (statistics.productTypes[productType] || 0) + 1;
    }
    statistics.totalProducts++;
  }
  
  console.log('\n📊 Import Statistics:');
  console.log(`   Total products in SQL: ${statistics.totalProducts}`);
  console.log(`   Products with existing images: ${statistics.productsWithImages}`);
  console.log(`   Total existing images: ${statistics.totalExistingImages}`);
  console.log(`   Average images per product: ${(statistics.totalExistingImages / statistics.productsWithImages).toFixed(1)}`);
  
  console.log('\n📈 Product types:');
  Object.entries(statistics.productTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count} products`);
    });
  
  return { importMapping, statistics };
}

function saveMapping(mapping, statistics) {
  const output = {
    generatedAt: new Date().toISOString(),
    statistics: statistics,
    products: mapping
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`\n💾 Saved mapping to: ${OUTPUT_FILE}`);
  console.log(`   Ready for import with ${Object.keys(mapping).length} products`);
}

function generateSampleImportScript(mapping) {
  const sampleProducts = Object.entries(mapping).slice(0, 5);
  
  console.log('\n🚀 Sample import script usage:');
  console.log('```javascript');
  console.log('const mapping = require("./scripts/product-image-mapping.json");');
  console.log('const products = mapping.products;');
  console.log('');
  console.log('// Sample products to import:');
  sampleProducts.forEach(([code, data]) => {
    console.log(`// ${code}: ${data.imageCount} images (${data.productType})`);
  });
  console.log('```');
}

async function main() {
  try {
    console.log('🚀 Starting product image mapping generation...\n');
    
    // Parse SQL file
    const productMap = parseProductImagesSQL(SQL_FILE);
    
    // Check which images exist
    const updatedMap = checkImageExistence(productMap);
    
    // Generate import mapping
    const { importMapping, statistics } = generateImportMapping(updatedMap);
    
    // Save the mapping
    saveMapping(importMapping, statistics);
    
    // Generate sample usage
    generateSampleImportScript(importMapping);
    
    console.log('\n✨ Mapping generation complete!');
    console.log('\nNext steps:');
    console.log('1. Review the generated mapping file');
    console.log('2. Run the import script with this mapping');
    console.log('3. Access Sanity Studio to organize images');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();