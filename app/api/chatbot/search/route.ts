import { NextRequest, NextResponse } from 'next/server'
import { searchProducts, getProductDetails } from '@/lib/tourplan/services'

interface SearchRequest {
  query: string
  destination?: string
  budget?: string
  travelers?: string
  duration?: string
  interests?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, destination, budget, travelers, duration, interests } = body

    console.log('🤖 Advanced chatbot search:', body)

    // Parse user query to extract intent and parameters
    const searchIntent = parseSearchIntent(query)
    
    // Map intent to product types and destinations
    const searchParams = mapIntentToSearchParams(searchIntent, {
      destination,
      budget,
      travelers,
      duration,
      interests
    })

    console.log('🤖 Mapped search params:', searchParams)

    let allProducts: any[] = []

    // Try multiple search strategies
    for (const params of searchParams) {
      try {
        const searchResults = await searchProducts(params)
        if (searchResults.success && searchResults.products) {
          allProducts = allProducts.concat(searchResults.products)
        }
      } catch (err) {
        console.warn('Search strategy failed:', params, err)
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueProducts = deduplicateProducts(allProducts)
    const rankedProducts = rankProductsByRelevance(uniqueProducts, searchIntent, {
      destination,
      budget,
      travelers,
      duration,
      interests
    })

    // Format for chatbot consumption
    const formattedProducts = rankedProducts.slice(0, 5).map(product => {
      const bestRate = product.rates?.[0]
      const price = bestRate?.twinRate 
        ? `AUD $${Math.round(bestRate.twinRate / 200).toLocaleString()}` 
        : 'Contact for pricing'

      return {
        code: product.code || product.id,
        name: product.name,
        description: product.description?.substring(0, 200) + (product.description?.length > 200 ? '...' : ''),
        supplier: product.supplierName || product.supplier,
        duration: product.duration,
        price,
        location: product.location || extractLocationFromDescription(product.description),
        url: `/products/${product.code || product.id}`,
        relevanceScore: product.relevanceScore || 0
      }
    })

    // Generate contextual response based on search intent
    const contextualResponse = generateContextualResponse(searchIntent, formattedProducts, body)

    return NextResponse.json({
      success: true,
      intent: searchIntent,
      products: formattedProducts,
      response: contextualResponse,
      searchParams: searchParams,
      count: formattedProducts.length
    })

  } catch (error) {
    console.error('🤖 Advanced search API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Search failed',
      products: [],
      response: "I encountered an issue while searching. Let me show you some popular options instead."
    }, { status: 500 })
  }
}

function parseSearchIntent(query: string): any {
  const lowerQuery = query.toLowerCase()
  
  const intent = {
    type: 'general',
    destinations: [] as string[],
    activities: [] as string[],
    accommodation: [] as string[],
    duration: null as string | null,
    budget: null as string | null,
    urgency: 'normal'
  }

  // Destination detection
  const destinations = [
    { keywords: ['kenya', 'nairobi', 'masai mara', 'mara'], name: 'Kenya' },
    { keywords: ['tanzania', 'serengeti', 'ngorongoro', 'kilimanjaro'], name: 'Tanzania' },
    { keywords: ['botswana', 'okavango', 'chobe', 'delta'], name: 'Botswana' },
    { keywords: ['south africa', 'kruger', 'cape town', 'johannesburg'], name: 'South Africa' },
    { keywords: ['namibia', 'windhoek', 'sossusvlei'], name: 'Namibia' },
    { keywords: ['zimbabwe', 'victoria falls', 'falls'], name: 'Zimbabwe' },
    { keywords: ['zambia', 'lusaka'], name: 'Zambia' },
    { keywords: ['rwanda', 'kigali', 'gorilla'], name: 'Rwanda' },
    { keywords: ['uganda', 'kampala'], name: 'Uganda' }
  ]

  destinations.forEach(dest => {
    if (dest.keywords.some(keyword => lowerQuery.includes(keyword))) {
      intent.destinations.push(dest.name)
    }
  })

  // Activity detection
  const activities = [
    { keywords: ['safari', 'game drive', 'wildlife', 'big five'], type: 'safari' },
    { keywords: ['cruise', 'river cruise', 'boat', 'zambezi'], type: 'cruise' },
    { keywords: ['train', 'rail', 'railway', 'blue train'], type: 'rail' },
    { keywords: ['beach', 'coast', 'island', 'zanzibar'], type: 'beach' },
    { keywords: ['gorilla', 'trekking', 'primate'], type: 'gorilla' },
    { keywords: ['cultural', 'village', 'local', 'maasai'], type: 'cultural' },
    { keywords: ['luxury', 'premium', 'deluxe'], type: 'luxury' },
    { keywords: ['adventure', 'active', 'hiking'], type: 'adventure' }
  ]

  activities.forEach(activity => {
    if (activity.keywords.some(keyword => lowerQuery.includes(keyword))) {
      intent.activities.push(activity.type)
    }
  })

  // Type detection
  if (intent.activities.includes('safari') || lowerQuery.includes('game')) {
    intent.type = 'safari'
  } else if (intent.activities.includes('cruise')) {
    intent.type = 'cruise'
  } else if (intent.activities.includes('rail')) {
    intent.type = 'rail'
  } else if (intent.activities.includes('beach')) {
    intent.type = 'beach'
  }

  // Duration detection
  const durationMatch = lowerQuery.match(/(\d+)\s*(day|week|night)/i)
  if (durationMatch) {
    intent.duration = durationMatch[0]
  }

  // Budget detection
  const budgetMatch = lowerQuery.match(/\$(\d+(?:,\d+)?)/i)
  if (budgetMatch) {
    intent.budget = budgetMatch[0]
  }

  // Urgency detection
  if (lowerQuery.includes('urgent') || lowerQuery.includes('asap') || lowerQuery.includes('soon')) {
    intent.urgency = 'high'
  }

  return intent
}

function mapIntentToSearchParams(intent: any, userPrefs: any): any[] {
  const searchParams = []

  // Primary search based on intent type
  if (intent.type === 'safari') {
    searchParams.push({
      productType: 'Group Tours',
      destination: intent.destinations[0] || userPrefs.destination,
      limit: 10
    })
  } else if (intent.type === 'cruise') {
    searchParams.push({
      productType: 'Cruises',
      limit: 10
    })
  } else if (intent.type === 'rail') {
    searchParams.push({
      productType: 'Rail',
      limit: 10
    })
  }

  // Secondary search for packages if we have destinations
  if (intent.destinations.length > 0) {
    searchParams.push({
      productType: 'Packages',
      destination: intent.destinations[0],
      limit: 5
    })
  }

  // Fallback general search
  if (searchParams.length === 0) {
    searchParams.push({
      productType: 'Group Tours',
      limit: 8
    })
  }

  return searchParams
}

function deduplicateProducts(products: any[]): any[] {
  const seen = new Set()
  return products.filter(product => {
    const key = product.code || product.id || product.name
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function rankProductsByRelevance(products: any[], intent: any, userPrefs: any): any[] {
  return products.map(product => {
    let score = 0
    
    // Location relevance
    if (intent.destinations.length > 0) {
      const productLocation = (product.description || '').toLowerCase()
      intent.destinations.forEach((dest: string) => {
        if (productLocation.includes(dest.toLowerCase())) {
          score += 10
        }
      })
    }

    // Activity relevance
    if (intent.activities.length > 0) {
      const productText = ((product.name || '') + ' ' + (product.description || '')).toLowerCase()
      intent.activities.forEach((activity: string) => {
        if (productText.includes(activity)) {
          score += 5
        }
      })
    }

    // Budget relevance (if product has pricing)
    if (userPrefs.budget && product.rates?.[0]?.twinRate) {
      const productPrice = Math.round(product.rates[0].twinRate / 200)
      const budgetMatch = userPrefs.budget.match(/\$(\d+(?:,\d+)?)/i)
      if (budgetMatch) {
        const budgetAmount = parseInt(budgetMatch[1].replace(',', ''))
        if (productPrice <= budgetAmount * 1.2) { // Within 20% of budget
          score += 3
        }
      }
    }

    // Recency/popularity boost for featured products
    const featuredCodes = ['NBOGTARP001CKSE', 'NBOGTARP001CKEKEE', 'BBKCRCHO018TIACP3']
    if (featuredCodes.includes(product.code)) {
      score += 2
    }

    return { ...product, relevanceScore: score }
  }).sort((a, b) => b.relevanceScore - a.relevanceScore)
}

function extractLocationFromDescription(description: string): string {
  if (!description) return 'Africa'
  
  const locations = ['Kenya', 'Tanzania', 'Botswana', 'South Africa', 'Namibia', 'Zimbabwe', 'Zambia', 'Rwanda', 'Uganda']
  for (const location of locations) {
    if (description.includes(location)) {
      return location
    }
  }
  return 'Africa'
}

function generateContextualResponse(intent: any, products: any[], searchRequest: any): string {
  const productCount = products.length
  
  if (productCount === 0) {
    return "I couldn't find specific matches for your request, but I can show you some popular alternatives or help you refine your search."
  }

  let response = `I found ${productCount} excellent option${productCount > 1 ? 's' : ''} `

  if (intent.destinations.length > 0) {
    response += `for ${intent.destinations.join(' and ')} `
  }

  if (intent.type !== 'general') {
    response += `focusing on ${intent.type} experiences `
  }

  if (searchRequest.budget) {
    response += `within your ${searchRequest.budget} budget range `
  }

  response += "from our live inventory:"

  return response
}