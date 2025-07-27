// scripts/find-base64-images.js
// Utility to find and extract base64 images from WordPress

const fs = require('fs');
const path = require('path');

/**
 * Search for base64 images in text content
 */
function findBase64Images(content, source = 'unknown') {
  const base64Regex = /data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g;
  const matches = [];
  let match;

  while ((match = base64Regex.exec(content)) !== null) {
    matches.push({
      source,
      format: match[1], // png, jpg, etc
      data: match[2],   // base64 data
      fullMatch: match[0],
      position: match.index
    });
  }

  return matches;
}

/**
 * Search for base64 images in WordPress files
 */
function searchWordPressFiles(wpPath) {
  const results = [];
  
  // Common WordPress locations for base64 images
  const searchPaths = [
    'wp-content/themes',
    'wp-content/plugins', 
    'wp-content/uploads',
    'wp-includes',
  ];

  searchPaths.forEach(searchPath => {
    const fullPath = path.join(wpPath, searchPath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`Searching ${fullPath}...`);
      searchDirectory(fullPath, results);
    }
  });

  return results;
}

/**
 * Recursively search directory for base64 images
 */
function searchDirectory(dirPath, results) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip common non-relevant directories
        if (!['node_modules', '.git', 'cache', 'tmp'].includes(item)) {
          searchDirectory(itemPath, results);
        }
      } else if (stat.isFile()) {
        // Search text files for base64 content
        const ext = path.extname(item).toLowerCase();
        const textExtensions = ['.php', '.js', '.html', '.css', '.txt', '.sql', '.json'];
        
        if (textExtensions.includes(ext)) {
          searchFile(itemPath, results);
        }
      }
    });
  } catch (error) {
    console.warn(`Error searching ${dirPath}:`, error.message);
  }
}

/**
 * Search individual file for base64 images
 */
function searchFile(filePath, results) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = findBase64Images(content, filePath);
    
    if (matches.length > 0) {
      console.log(`Found ${matches.length} base64 image(s) in: ${filePath}`);
      results.push(...matches);
    }
  } catch (error) {
    // Skip binary files or files we can't read
  }
}

/**
 * Extract and save base64 images
 */
function extractBase64Images(matches, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  matches.forEach((match, index) => {
    try {
      const buffer = Buffer.from(match.data, 'base64');
      const filename = `extracted-map-${index + 1}.${match.format}`;
      const outputPath = path.join(outputDir, filename);
      
      fs.writeFileSync(outputPath, buffer);
      console.log(`Extracted: ${filename} (${buffer.length} bytes) from ${match.source}`);
    } catch (error) {
      console.error(`Error extracting image ${index + 1}:`, error.message);
    }
  });
}

/**
 * Main search function
 */
function searchForMaps(wpPath, outputDir) {
  console.log('🔍 Searching for base64 images in WordPress...');
  console.log(`WordPress path: ${wpPath}`);
  console.log(`Output directory: ${outputDir}`);
  console.log('');

  const results = searchWordPressFiles(wpPath);
  
  console.log('');
  console.log(`📊 Search Results:`);
  console.log(`Found ${results.length} base64 images total`);
  
  if (results.length > 0) {
    console.log('');
    console.log('📁 Extracting images...');
    extractBase64Images(results, outputDir);
    
    console.log('');
    console.log('✅ Search complete!');
    console.log(`Check ${outputDir} for extracted map images.`);
  } else {
    console.log('❌ No base64 images found in WordPress files.');
    console.log('');
    console.log('💡 Try searching the database directly:');
    console.log('1. Access phpMyAdmin or database tool');
    console.log('2. Search wp_posts table for: data:image');
    console.log('3. Search wp_postmeta table for: data:image');
    console.log('4. Search custom plugin tables for base64 content');
  }
}

// Export for use as module
module.exports = {
  findBase64Images,
  searchWordPressFiles,
  extractBase64Images,
  searchForMaps
};

// Command line usage
if (require.main === module) {
  const wpPath = process.argv[2];
  const outputDir = process.argv[3] || './extracted-maps';
  
  if (!wpPath) {
    console.log('Usage: node find-base64-images.js <wordpress-path> [output-dir]');
    console.log('');
    console.log('Example:');
    console.log('node find-base64-images.js /home/user/public_html ./maps');
    process.exit(1);
  }
  
  if (!fs.existsSync(wpPath)) {
    console.error(`Error: WordPress path not found: ${wpPath}`);
    process.exit(1);
  }
  
  searchForMaps(wpPath, outputDir);
}