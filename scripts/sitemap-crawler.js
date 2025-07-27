// scripts/sitemap-crawler.js
// Crawl WordPress site to extract all base64 images automatically

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

/**
 * Configuration
 */
const CONFIG = {
  // WordPress site URL
  siteUrl: 'https://thisisafrica.com.au',
  
  // Product page patterns to crawl
  productPatterns: [
    '/tours/',
    '/safari/',
    '/product/',
    // Add more patterns as needed
  ],
  
  // Output directory
  outputDir: path.join(__dirname, '..', 'public', 'images', 'maps', 'crawled'),
  
  // Request settings
  maxPages: 100,
  delayBetweenRequests: 1000, // 1 second delay between requests
};

/**
 * Crawl WordPress site for product pages and extract maps
 */
async function crawlSiteForMaps() {
  console.log('🕷️  Starting WordPress site crawl...');
  console.log(`Site: ${CONFIG.siteUrl}`);
  console.log(`Max pages: ${CONFIG.maxPages}`);
  console.log('');
  
  try {
    // Get sitemap or discover product URLs
    const productUrls = await discoverProductUrls();
    
    console.log(`Found ${productUrls.length} potential product pages`);
    
    if (productUrls.length === 0) {
      console.log('❌ No product pages found');
      console.log('💡 Try updating the productPatterns in the config');
      return;
    }
    
    // Create output directory
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }
    
    const allImages = [];
    
    // Crawl each product page
    for (let i = 0; i < Math.min(productUrls.length, CONFIG.maxPages); i++) {
      const url = productUrls[i];
      console.log(`\n📄 [${i + 1}/${Math.min(productUrls.length, CONFIG.maxPages)}] Crawling: ${url}`);
      
      try {
        const html = await fetchPage(url);
        const images = extractBase64FromHtml(html, url);
        
        if (images.length > 0) {
          console.log(`   ✅ Found ${images.length} base64 image(s)`);
          allImages.push(...images);
        } else {
          console.log(`   ➖ No base64 images found`);
        }
        
        // Delay between requests
        if (i < productUrls.length - 1) {
          await sleep(CONFIG.delayBetweenRequests);
        }
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log(`\n🎯 Crawl complete! Found ${allImages.length} total images`);
    
    if (allImages.length > 0) {
      await saveExtractedImages(allImages);
    }
    
  } catch (error) {
    console.error('❌ Crawl failed:', error.message);
  }
}

/**
 * Discover product URLs from sitemap or by crawling
 */
async function discoverProductUrls() {
  console.log('🔍 Discovering product URLs...');
  
  try {
    // Try to get sitemap first
    const sitemapUrls = await getSitemapUrls();
    if (sitemapUrls.length > 0) {
      return sitemapUrls;
    }
  } catch (error) {
    console.log('⚠️  Sitemap not found, trying manual discovery...');
  }
  
  // Fallback: manual URL patterns
  return generateUrlPatterns();
}

/**
 * Get URLs from WordPress sitemap
 */
async function getSitemapUrls() {
  const sitemapUrls = [
    `${CONFIG.siteUrl}/sitemap.xml`,
    `${CONFIG.siteUrl}/sitemap_index.xml`,
    `${CONFIG.siteUrl}/wp-sitemap.xml`,
  ];
  
  for (const sitemapUrl of sitemapUrls) {
    try {
      const sitemapXml = await fetchPage(sitemapUrl);
      const urls = parseSitemapUrls(sitemapXml);
      
      if (urls.length > 0) {
        console.log(`   ✅ Found ${urls.length} URLs in sitemap`);
        return filterProductUrls(urls);
      }
    } catch (error) {
      continue;
    }
  }
  
  return [];
}

/**
 * Parse URLs from sitemap XML
 */
function parseSitemapUrls(xml) {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  
  while ((match = urlRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

/**
 * Filter URLs to product pages only
 */
function filterProductUrls(urls) {
  return urls.filter(url => {
    return CONFIG.productPatterns.some(pattern => 
      url.includes(pattern)
    );
  });
}

/**
 * Generate URL patterns if sitemap not available
 */
function generateUrlPatterns() {
  console.log('   🔧 Generating URL patterns...');
  
  // You can customize these based on your WordPress URL structure
  const urls = [];
  
  // Common WordPress tour/product URL patterns
  const patterns = [
    '/tours/kenya/',
    '/tours/tanzania/', 
    '/safari/kenya/',
    '/safari/tanzania/',
    '/product/kenya/',
    '/product/tanzania/',
  ];
  
  patterns.forEach(pattern => {
    urls.push(`${CONFIG.siteUrl}${pattern}`);
  });
  
  console.log(`   📝 Generated ${urls.length} URL patterns`);
  return urls;
}

/**
 * Fetch page content
 */
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Extract base64 images from HTML
 */
function extractBase64FromHtml(html, sourceUrl) {
  const base64Regex = /data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g;
  const images = [];
  let match;

  while ((match = base64Regex.exec(html)) !== null) {
    images.push({
      format: match[1],
      data: match[2],
      sourceUrl,
      size: Math.round(match[2].length * 0.75)
    });
  }

  return images;
}

/**
 * Save extracted images
 */
async function saveExtractedImages(images) {
  console.log(`\n💾 Saving ${images.length} images...`);
  
  const manifest = [];
  
  images.forEach((image, index) => {
    try {
      const buffer = Buffer.from(image.data, 'base64');
      const urlPath = new URL(image.sourceUrl).pathname;
      const pageName = urlPath.split('/').filter(Boolean).pop() || 'unknown';
      const filename = `${pageName}-${index}.${image.format}`;
      const filePath = path.join(CONFIG.outputDir, filename);
      
      fs.writeFileSync(filePath, buffer);
      
      manifest.push({
        filename,
        sourceUrl: image.sourceUrl,
        size: buffer.length,
        format: image.format
      });
      
      console.log(`   ✅ ${filename} (${Math.round(buffer.length/1024)}KB)`);
      
    } catch (error) {
      console.error(`   ❌ Failed to save image ${index}:`, error.message);
    }
  });
  
  // Save manifest
  const manifestPath = path.join(CONFIG.outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`\n📋 Manifest saved: ${manifestPath}`);
  console.log(`\n🎉 Crawl complete!`);
  console.log(`\n📁 Next steps:`);
  console.log(`1. Review images in: ${CONFIG.outputDir}`);
  console.log(`2. Rename to product codes: NBOGTARP001CKSE.png`);
  console.log(`3. Move to: public/images/maps/`);
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the crawler
if (require.main === module) {
  if (process.argv.includes('--help')) {
    console.log('WordPress Site Crawler for Base64 Maps');
    console.log('');
    console.log('Usage: node scripts/sitemap-crawler.js');
    console.log('');
    console.log('Before running:');
    console.log('1. Update CONFIG.siteUrl in this file');
    console.log('2. Update productPatterns if needed');
    console.log('3. Run the script');
    console.log('');
  } else {
    crawlSiteForMaps();
  }
}