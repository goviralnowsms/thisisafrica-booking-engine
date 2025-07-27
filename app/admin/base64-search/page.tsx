"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Base64SearchPage() {
  const [content, setContent] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const searchContent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/search-base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
      setResults({ error: 'Search failed' })
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = (base64Data: string, format: string, index: number) => {
    try {
      const binary = atob(base64Data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: `image/${format}` })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `map-${index + 1}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Base64 Image Search Tool</h1>
      
      <div className="space-y-6">
        {/* Search Input */}
        <Card>
          <CardHeader>
            <CardTitle>Search for Base64 Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Paste WordPress post content, database export, or any text that might contain base64 images
            </p>
            <Textarea
              placeholder="Paste content here (HTML, database export, etc.)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
            <Button onClick={searchContent} disabled={!content || loading}>
              {loading ? 'Searching...' : 'Search for Base64 Images'}
            </Button>
          </CardContent>
        </Card>

        {/* SQL Queries */}
        <Card>
          <CardHeader>
            <CardTitle>WordPress Database Search Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Run these SQL queries in phpMyAdmin to find base64 images:
            </p>
            <div className="space-y-3">
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                SELECT ID, post_title, post_content FROM wp_posts WHERE post_content LIKE '%data:image%' LIMIT 10;
              </div>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                SELECT post_id, meta_key, meta_value FROM wp_postmeta WHERE meta_value LIKE '%data:image%' LIMIT 10;
              </div>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                SELECT option_name, option_value FROM wp_options WHERE option_value LIKE '%data:image%' LIMIT 10;
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results.error ? (
                <p className="text-red-600">{results.error}</p>
              ) : results.data ? (
                <div className="space-y-4">
                  <p className="font-semibold">Found {results.data.found} base64 images</p>
                  
                  {results.data.matches.map((match: any, index: number) => (
                    <div key={index} className="border p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p><strong>Format:</strong> {match.format}</p>
                          <p><strong>Size:</strong> ~{Math.round(match.size / 1024)}KB</p>
                          <p><strong>Position:</strong> {match.position}</p>
                        </div>
                        {match.data !== '[truncated - too large for response]' && (
                          <Button 
                            size="sm"
                            onClick={() => downloadImage(match.data, match.format, index)}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                        {match.preview}
                      </div>
                      {match.data !== '[truncated - too large for response]' && (
                        <div className="mt-2">
                          <img 
                            src={`data:image/${match.format};base64,${match.data}`}
                            alt={`Found image ${index + 1}`}
                            className="max-w-xs max-h-48 border"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Extract Maps from WordPress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">Method 1: Database Search</h4>
              <p className="text-sm text-gray-600">
                1. Access phpMyAdmin in cPanel<br/>
                2. Select your WordPress database<br/>
                3. Run the SQL queries above<br/>
                4. Copy any base64 image data and paste it here
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Method 2: Page Source</h4>
              <p className="text-sm text-gray-600">
                1. Visit a WordPress product page with a map<br/>
                2. Right-click → View Page Source<br/>
                3. Search for "data:image"<br/>
                4. Copy the entire data:image string and paste it here
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Method 3: Browser Dev Tools</h4>
              <p className="text-sm text-gray-600">
                1. Right-click on the map → Inspect Element<br/>
                2. Find the img tag with src="data:image..."<br/>
                3. Copy the src attribute value and paste it here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}