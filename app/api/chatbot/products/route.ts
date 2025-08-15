import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const destination = searchParams.get('destination')
    const productType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '5')

    console.log('🤖 Chatbot product search:', { query, destination, productType, limit })

    // Return pre-built product data with real codes but static info for reliability
    const featuredProductsWithDetails = [
      {
        code: 'NBOGTARP001CKSE',
        name: 'Classic Kenya - Serena Lodges',
        description: 'Experience the ultimate Kenyan safari with Big Five game viewing, Maasai village visit, and stunning landscapes at premium Serena lodges.',
        supplier: 'Alpha Travel (UK) Ltd',
        duration: '6 days',
        price: 'From AUD $5,800',
        location: 'Kenya',
        url: '/products/NBOGTARP001CKSE'
      },
      {
        code: 'NBOGTARP001CKEKEE',
        name: 'Classic Kenya - Keekorok Lodges',
        description: 'Classic Kenya safari experience at Keekorok lodges with game drives in Masai Mara, Lake Nakuru, and Amboseli.',
        supplier: 'Alpha Travel (UK) Ltd',
        duration: '6 days',
        price: 'From AUD $5,447',
        location: 'Kenya',
        url: '/products/NBOGTARP001CKEKEE'
      },
      {
        code: 'NBOGTSOAEASSNM061',
        name: 'East Africa Explorer',
        description: 'Comprehensive East African adventure covering Kenya and Tanzania with exceptional wildlife viewing opportunities.',
        supplier: 'Sonoma Safaris',
        duration: '11 days',
        price: 'From AUD $6,200',
        location: 'Kenya & Tanzania',
        url: '/products/NBOGTSOAEASSNM061'
      },
      {
        code: 'BBKCRCHO018TIACP3',
        name: 'Chobe Princess 3-Night Cruise',
        description: 'Luxury river cruise through pristine Chobe wilderness with exceptional wildlife viewing from the water.',
        supplier: 'Chobe Holdings',
        duration: '3 days',
        price: 'From AUD $1,800',
        location: 'Botswana',
        url: '/products/BBKCRCHO018TIACP3'
      },
      {
        code: 'VFARLROV001VFPRDX',
        name: 'Rovos Rail - Victoria Falls to Pretoria',
        description: 'Luxury rail journey through southern Africa aboard the world-renowned Rovos Rail.',
        supplier: 'Rovos Rail',
        duration: '4 days',
        price: 'From AUD $4,200',
        location: 'South Africa',
        url: '/products/VFARLROV001VFPRDX'
      },
      {
        code: 'BBKCRTVT001ZAM2NS',
        name: 'Zambezi Queen 2-Night Cruise',
        description: 'Zambezi River cruise with luxury accommodations and exceptional wildlife viewing opportunities.',
        supplier: 'Travel Ventures',
        duration: '2 nights',
        price: 'From AUD $1,400',
        location: 'Botswana',
        url: '/products/BBKCRTVT001ZAM2NS'
      }
    ]

    // Filter products based on query if provided
    let filteredProducts = featuredProductsWithDetails
    
    if (query) {
      const searchTerm = query.toLowerCase()
      filteredProducts = featuredProductsWithDetails.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.location.toLowerCase().includes(searchTerm) ||
        (searchTerm.includes('safari') && product.description.toLowerCase().includes('safari')) ||
        (searchTerm.includes('cruise') && product.description.toLowerCase().includes('cruise')) ||
        (searchTerm.includes('rail') && product.description.toLowerCase().includes('rail')) ||
        (searchTerm.includes('kenya') && product.location.toLowerCase().includes('kenya')) ||
        (searchTerm.includes('botswana') && product.location.toLowerCase().includes('botswana'))
      )
    }

    // If no matches or no query, return the first few products
    if (filteredProducts.length === 0) {
      filteredProducts = featuredProductsWithDetails.slice(0, limit)
    } else {
      filteredProducts = filteredProducts.slice(0, limit)
    }

    console.log(`🤖 Returning ${filteredProducts.length} products for chatbot (query: "${query}")`)

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      count: filteredProducts.length,
      isStatic: true // Indicate this is static data for now
    })

  } catch (error) {
    console.error('🤖 Chatbot products API error:', error)
    
    // Return minimal fallback
    const fallbackProducts = [
      {
        code: 'GENERAL001',
        name: 'African Safari Adventures',
        description: 'Explore our collection of African safaris and adventures. Contact us for personalized recommendations.',
        supplier: 'This is Africa',
        duration: 'Various',
        price: 'From AUD $2,000',
        location: 'Africa',
        url: '/booking'
      }
    ]

    return NextResponse.json({
      success: true,
      products: fallbackProducts,
      count: fallbackProducts.length,
      fallback: true
    })
  }
}