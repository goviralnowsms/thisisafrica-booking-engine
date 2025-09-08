/**
 * Script to fix the employment page by adding _key properties to all blocks
 * Usage: node scripts/fix-employment-page.js
 */

const { createClient } = require('@sanity/client');
const { nanoid } = require('nanoid');

// Sanity client configuration
const client = createClient({
  projectId: 'h4qu7hkw',
  dataset: 'production',
  apiVersion: '2024-09-04',
  token: 'skUREaXA9lNLT1nmAZljtznXRIhMhsjsV3W2bmMmB9VdZGqUvfE7YasI6hoaYk1dppUKnHTz7KOpbxm4SkIQMi9XKiReiyL2861TwfhX6JshNHCKkAnuX6jYcQqziFsUIYaD3YT0gZV6djEzq1mHzWuMw13p9VZPBq7fxNfPWP4pzsrBE1ZP',
  useCdn: false,
});

// Helper to generate unique keys
function generateKey() {
  return nanoid(12);
}

// Add _key to all blocks and spans
function addKeysToContent(content) {
  if (!Array.isArray(content)) return content;
  
  return content.map(block => {
    // Add key to block
    if (!block._key) {
      block._key = generateKey();
    }
    
    // Add keys to children (spans)
    if (block.children && Array.isArray(block.children)) {
      block.children = block.children.map(child => {
        if (!child._key) {
          child._key = generateKey();
        }
        return child;
      });
    }
    
    // Add keys to marks if they're objects
    if (block.marks && Array.isArray(block.marks)) {
      block.marks = block.marks.map(mark => {
        if (typeof mark === 'object' && !mark._key) {
          mark._key = generateKey();
        }
        return mark;
      });
    }
    
    return block;
  });
}

async function fixEmploymentPage() {
  try {
    console.log('🔧 Fixing Employment page keys...');
    
    // Fetch the employment page
    const employmentPage = await client.fetch('*[_type == "staticPage" && slug.current == "employment"][0]');
    
    if (!employmentPage) {
      console.log('❌ Employment page not found');
      return;
    }
    
    console.log(`📄 Found employment page: ${employmentPage._id}`);
    
    // Fix the content array
    const fixedContent = addKeysToContent(employmentPage.content);
    
    // Update the document
    const result = await client
      .patch(employmentPage._id)
      .set({ content: fixedContent })
      .commit();
    
    console.log('✅ Employment page fixed successfully!');
    console.log(`   Updated ${fixedContent.length} content blocks`);
    console.log('\n🎉 You can now edit the employment page in Sanity Studio');
    
  } catch (error) {
    console.error('❌ Error fixing employment page:', error.message);
    process.exit(1);
  }
}

// Run the fix
fixEmploymentPage();