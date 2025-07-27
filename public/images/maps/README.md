# Tour Route Maps

This directory contains tour route maps for display on product pages.

## Map File Naming Convention

### Product-Specific Maps
- `{PRODUCT_CODE}.png` - Exact match for product code (e.g., `NBOGTARP001CKSE.png`)
- `{PRODUCT_CODE}.jpg` - Alternative format

### Regional/Destination Maps (Fallbacks)
- `kenya.png` - General Kenya map
- `tanzania.png` - General Tanzania map
- `masai-mara.png` - Masai Mara specific
- `serengeti.png` - Serengeti specific
- `amboseli.png` - Amboseli specific
- `lake-nakuru.png` - Lake Nakuru specific
- `ngorongoro.png` - Ngorongoro specific
- `botswana.png`, `namibia.png`, `south-africa.png`, etc.

## How to Extract Maps from WordPress

### Method 1: Via cPanel File Manager
1. Log into cPanel
2. Navigate to File Manager
3. Go to `public_html/wp-content/uploads/`
4. Look for map images (likely in yearly folders like `2020/`, `2021/`, etc.)
5. Download any map-related images

### Method 2: Via WordPress Admin
1. Log into WordPress admin
2. Go to Media Library
3. Search for "map" or filter by images
4. Download map images

### Method 3: Via Database
1. Access WordPress database via phpMyAdmin
2. Look in `wp_posts` table for posts with map images
3. Check `post_content` for base64 image data
4. Extract and convert base64 to image files

### Method 4: Check TourPlan Export
1. In TourPlan admin, look for export/backup functions
2. Export product data including media
3. Extract map images from the export

## Current Status
- System is set up to automatically detect and display local maps
- Fallback system in place for regional maps
- Ready to accept map files once extracted from WordPress

## Testing
Place a map file (e.g., `kenya.png`) in this directory and visit:
http://localhost:3003/products/NBOGTARP001CKSE

The map should appear on the left side of the hero section.