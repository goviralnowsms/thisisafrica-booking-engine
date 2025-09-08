/**
 * Script to import product images into Sanity CMS
 * Usage: node scripts/import-product-images-to-sanity.js
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');

// Sanity client configuration
const client = createClient({
  projectId: 'h4qu7hkw',
  dataset: 'production',
  apiVersion: '2024-09-04',
  token: 'skUREaXA9lNLT1nmAZljtznXRIhMhsjsV3W2bmMmB9VdZGqUvfE7YasI6hoaYk1dppUKnHTz7KOpbxm4SkIQMi9XKiReiyL2861TwfhX6JshNHCKkAnuX6jYcQqziFsUIYaD3YT0gZV6djEzq1mHzWuMw13p9VZPBq7fxNfPWP4pzsrBE1ZP',
  useCdn: false,
});

// Directory containing product images
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Product code to image mapping (you can expand this based on your products)
const productImageMap = {
  // Group Tours
  'NBOGTARP001CKSE': ['kenya-safari.jpg', 'serena-lodges.jpg'],
  'NBOGTARP001CKEKEE': ['kenya-safari.jpg', 'keekorok-lodge.jpg'],
  'NBOGTARP001CKSM': ['kenya-safari.jpg', 'mixed-lodges.jpg'],
  
  // Cruises
  'BBKCRCHO018TIACP3': ['chobe-princess.jpg', 'river-cruise.jpg'],
  'BBKCRTVT001ZAM2NS': ['zambezi-queen.jpg', 'zambezi-cruise.jpg'],
  
  // Rail
  'VFARLROV001VFPRDX': ['rovos-rail.jpg', 'victoria-falls.jpg'],
  
  // Add more mappings as needed
};

async function uploadImageToSanity(filePath, fileName) {
  try {
    console.log(`Uploading ${fileName}...`);
    
    // Upload the image asset
    const imageAsset = await client.assets.upload('image', createReadStream(filePath), {
      filename: fileName
    });
    
    console.log(`✅ Uploaded ${fileName} with ID: ${imageAsset._id}`);
    return imageAsset;
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

async function createProductImageDocument(imageAsset, productCode, title) {
  try {
    const doc = {
      _type: 'productImage',
      title: title || `Image for ${productCode}`,
      productCode: productCode,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        }
      },
      alt: title || `Product image for ${productCode}`,
      isHero: false, // You can set specific images as hero images
    };
    
    const result = await client.create(doc);
    console.log(`✅ Created product image document for ${productCode}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create document for ${productCode}:`, error.message);
    return null;
  }
}

async function importAllImages() {
  console.log('🚀 Starting product image import to Sanity...\n');
  
  // Get all image files
  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  
  console.log(`Found ${imageFiles.length} images in ${IMAGES_DIR}\n`);
  
  // Upload images and create documents
  let uploadedCount = 0;
  let failedCount = 0;
  
  // Process mapped products first
  for (const [productCode, imageNames] of Object.entries(productImageMap)) {
    console.log(`\n📦 Processing product ${productCode}...`);
    
    for (const imageName of imageNames) {
      const imagePath = path.join(IMAGES_DIR, imageName);
      
      if (fs.existsSync(imagePath)) {
        const asset = await uploadImageToSanity(imagePath, imageName);
        if (asset) {
          const doc = await createProductImageDocument(asset, productCode, imageName.replace(/\.(jpg|jpeg|png|webp)$/i, ''));
          if (doc) {
            uploadedCount++;
          } else {
            failedCount++;
          }
        } else {
          failedCount++;
        }
      } else {
        console.log(`⚠️ Image ${imageName} not found for product ${productCode}`);
      }
    }
  }
  
  // Optionally, upload remaining unmapped images as general gallery images
  console.log('\n📸 Uploading general gallery images...\n');
  
  const generalImages = imageFiles.slice(0, 20); // Limit to first 20 for testing
  
  for (const fileName of generalImages) {
    const filePath = path.join(IMAGES_DIR, fileName);
    const asset = await uploadImageToSanity(filePath, fileName);
    
    if (asset) {
      // Create a general gallery image document
      const doc = {
        _type: 'galleryImage',
        title: fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' '),
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        },
        alt: fileName.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/[-_]/g, ' '),
        category: 'product', // You can categorize as needed
      };
      
      try {
        await client.create(doc);
        uploadedCount++;
        console.log(`✅ Created gallery image: ${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to create gallery document for ${fileName}:`, error.message);
        failedCount++;
      }
    } else {
      failedCount++;
    }
  }
  
  console.log('\n========================================');
  console.log(`✅ Successfully uploaded: ${uploadedCount} images`);
  console.log(`❌ Failed: ${failedCount} images`);
  console.log('========================================\n');
  
  console.log('🎉 Import complete!');
  console.log('Visit https://h4qu7hkw.sanity.studio to view your images');
}

// Check if we need to create the schema first
async function checkAndCreateSchemas() {
  console.log('Checking if required schemas exist...\n');
  
  // Note: Schemas should be defined in your Sanity Studio configuration
  // This is just to check if documents of these types can be created
  
  try {
    // Try to query for existing product images
    const existingProductImages = await client.fetch('*[_type == "productImage"][0]');
    const existingGalleryImages = await client.fetch('*[_type == "galleryImage"][0]');
    
    console.log('✅ Schemas appear to be ready\n');
    return true;
  } catch (error) {
    console.log('⚠️ Schemas might not be set up. Make sure you have:');
    console.log('   - productImage schema');
    console.log('   - galleryImage schema');
    console.log('   defined in your Sanity Studio\n');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    return new Promise((resolve) => {
      readline.question('Continue anyway? (y/n): ', (answer) => {
        readline.close();
        resolve(answer.toLowerCase() === 'y');
      });
    });
  }
}

// Main execution
async function main() {
  try {
    const shouldContinue = await checkAndCreateSchemas();
    
    if (shouldContinue) {
      await importAllImages();
    } else {
      console.log('Import cancelled.');
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the import
main();