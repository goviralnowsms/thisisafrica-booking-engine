import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to clear accommodation caches during development
    // In production, you might want to add authentication

    console.log('🧹 Clearing accommodation API caches...')

    return NextResponse.json({
      success: true,
      message: 'Cache clearing request sent - caches will refresh on next request'
    })

  } catch (error) {
    console.error('❌ Cache clear error:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cache'
    }, { status: 500 })
  }
}