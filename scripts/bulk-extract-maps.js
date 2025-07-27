// scripts/bulk-extract-maps.js
// Bulk extract all maps from WordPress database

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

/**
 * WordPress Database Configuration
 * Reading from .env.local file
 */
const DB_CONFIG = {
  host: process.env.WP_DB_HOST || 'localhost',
  user: process.env.WP_DB_USERNAME,
  password: process.env.WP_DB_PASSWORD,
  database: process.env.WP_DB,
  // port: 3306 // uncomment if using custom port
};

/**
 * Extract all base64 images from WordPress database
 */
async function bulkExtractMaps() {
  let connection;
  
  try {
    console.log('🔍 Connecting to WordPress database...');
    connection = await mysql.createConnection(DB_CONFIG);
    
    console.log('✅ Connected! Searching for base64 images...');
    
    // Search multiple tables for base64 images (using af_ prefix)
    const queries = [
      {
        name: 'Posts Content',
        sql: `SELECT ID, post_title, post_content, post_name 
              FROM af_posts 
              WHERE post_content LIKE '%data:image%' 
              AND post_status = 'publish'`
      },
      {
        name: 'Post Meta',
        sql: `SELECT pm.post_id, pm.meta_key, pm.meta_value, p.post_title, p.post_name
              FROM af_postmeta pm
              JOIN af_posts p ON pm.post_id = p.ID
              WHERE pm.meta_value LIKE '%data:image%'
              AND p.post_status = 'publish'`
      },
      {
        name: 'Options Table',
        sql: `SELECT option_name, option_value 
              FROM af_options 
              WHERE option_value LIKE '%data:image%'`
      }
    ];
    
    let totalFound = 0;
    const allImages = [];
    
    for (const query of queries) {
      console.log(`\n📊 Searching ${query.name}...`);
      const [rows] = await connection.execute(query.sql);
      
      console.log(`Found ${rows.length} records with base64 images`);
      
      rows.forEach((row, index) => {
        const content = row.post_content || row.meta_value || row.option_value;
        const images = extractBase64FromContent(content, {
          source: query.name,
          postId: row.ID || row.post_id,
          postTitle: row.post_title,
          postName: row.post_name,
          metaKey: row.meta_key,
          optionName: row.option_name
        });
        
        allImages.push(...images);
        totalFound += images.length;
      });
    }
    
    console.log(`\n🎯 Total base64 images found: ${totalFound}`);
    
    if (totalFound > 0) {
      await saveExtractedImages(allImages);
    } else {
      console.log('❌ No base64 images found in database');
      console.log('\n💡 Possible reasons:');
      console.log('1. Images might be stored as file URLs instead of base64');
      console.log('2. Database credentials might be incorrect');
      console.log('3. Table prefix might be different (try changing wp_ to your prefix)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Database connection failed. Please:');
      console.log('1. Check your database credentials in this file');
      console.log('2. Ensure MySQL is running');
      console.log('3. Check if remote connections are allowed');
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Access denied. Please:');
      console.log('1. Verify username and password');
      console.log('2. Ensure the user has SELECT permissions');
    }
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Extract base64 images from content
 */
function extractBase64FromContent(content, metadata) {
  const base64Regex = /data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g;
  const images = [];
  let match;

  while ((match = base64Regex.exec(content)) !== null) {
    images.push({
      format: match[1],
      data: match[2],
      metadata,
      size: Math.round(match[2].length * 0.75)
    });
  }

  return images;
}

/**
 * Save extracted images to disk
 */
async function saveExtractedImages(images) {
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'maps', 'extracted');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`\n💾 Saving images to: ${outputDir}`);
  
  const manifest = [];
  
  images.forEach((image, index) => {
    try {
      const buffer = Buffer.from(image.data, 'base64');
      const filename = generateFilename(image, index);
      const filePath = path.join(outputDir, filename);
      
      fs.writeFileSync(filePath, buffer);
      
      const manifestEntry = {
        filename,
        size: buffer.length,
        format: image.format,
        source: image.metadata.source,
        postTitle: image.metadata.postTitle,
        postName: image.metadata.postName,
        postId: image.metadata.postId,
        metaKey: image.metadata.metaKey
      };
      
      manifest.push(manifestEntry);
      
      console.log(`✅ Saved: ${filename} (${Math.round(buffer.length/1024)}KB) - ${image.metadata.postTitle || 'Unknown'}`);
      
    } catch (error) {
      console.error(`❌ Failed to save image ${index}:`, error.message);
    }
  });
  
  // Save manifest file
  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`\n📋 Manifest saved: ${manifestPath}`);
  console.log(`\n🎉 Extraction complete! ${images.length} images saved.`);
  console.log(`\n📁 Next steps:`);
  console.log(`1. Review extracted images in: ${outputDir}`);
  console.log(`2. Rename relevant maps to product codes (e.g., NBOGTARP001CKSE.png)`);
  console.log(`3. Move them to: public/images/maps/`);
  console.log(`4. Maps will automatically appear on product pages`);
}

/**
 * Generate filename for extracted image
 */
function generateFilename(image, index) {
  let name = `map-${String(index + 1).padStart(3, '0')}`;
  
  // Try to use post name or title for better naming
  if (image.metadata.postName) {
    name = image.metadata.postName.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  } else if (image.metadata.postTitle) {
    name = image.metadata.postTitle.replace(/[^a-z0-9-]/gi, '-').toLowerCase().substring(0, 50);
  }
  
  return `${name}.${image.format}`;
}

/**
 * Interactive setup for database credentials
 */
function setupCredentials() {
  console.log('🔧 WordPress Database Bulk Map Extractor');
  console.log('');
  console.log('Before running this script, please update the database credentials:');
  console.log('');
  console.log('1. Edit this file: scripts/bulk-extract-maps.js');
  console.log('2. Update the DB_CONFIG section with your cPanel database details:');
  console.log('   - host: usually "localhost" or your domain');
  console.log('   - user: your database username');
  console.log('   - password: your database password');
  console.log('   - database: your WordPress database name');
  console.log('');
  console.log('3. Run: npm install mysql2');
  console.log('4. Run: node scripts/bulk-extract-maps.js');
  console.log('');
  console.log('💡 You can find these details in:');
  console.log('   - cPanel → MySQL Databases');
  console.log('   - wp-config.php file');
}

// Check if mysql2 is available
try {
  require('mysql2/promise');
  
  if (process.argv.includes('--setup')) {
    setupCredentials();
  } else {
    bulkExtractMaps();
  }
} catch (error) {
  console.log('❌ mysql2 package not found');
  console.log('');
  console.log('Please install it first:');
  console.log('npm install mysql2');
  console.log('');
  console.log('Then run:');
  console.log('node scripts/bulk-extract-maps.js');
}