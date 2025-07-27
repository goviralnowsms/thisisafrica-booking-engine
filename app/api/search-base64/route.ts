import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '../tourplan/utils';

// Simple base64 image finder for testing
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return errorResponse('Content is required', 400);
    }
    
    // Search for base64 images in the provided content
    const base64Regex = /data:image\/([^;]+);base64,([A-Za-z0-9+/=]+)/g;
    const matches = [];
    let match;

    while ((match = base64Regex.exec(content)) !== null) {
      matches.push({
        format: match[1], // png, jpg, etc
        data: match[2],   // base64 data
        fullMatch: match[0],
        position: match.index,
        size: Math.round(match[2].length * 0.75), // Approximate bytes
        preview: match[0].substring(0, 100) + '...'
      });
    }
    
    return successResponse({
      found: matches.length,
      matches: matches.map(m => ({
        format: m.format,
        size: m.size,
        position: m.position,
        preview: m.preview,
        // Include full data only for first 3 matches to avoid huge responses
        data: matches.indexOf(m) < 3 ? m.data : '[truncated - too large for response]'
      })),
      sql_queries: [
        "SELECT ID, post_title, post_content FROM wp_posts WHERE post_content LIKE '%data:image%' LIMIT 10;",
        "SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE meta_value LIKE '%data:image%' LIMIT 10;",
        "SELECT option_name, option_value FROM wp_options WHERE option_value LIKE '%data:image%' LIMIT 10;"
      ]
    });
    
  } catch (error) {
    return errorResponse('Search failed', 500, { 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// GET endpoint with sample content for testing
export async function GET() {
  const sampleContent = `
    <div>
      <p>Some content here</p>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="sample">
      <p>More content</p>
    </div>
  `;
  
  // Test the search function
  const response = await POST(new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: sampleContent })
  }));
  
  return response;
}