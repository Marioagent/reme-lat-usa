import { NextResponse } from 'next/server';
import { getCachedRates, forceRefreshRates } from '@/lib/exchange-api';

// API Route: /api/rates
// Returns real-time exchange rates from all sources

export const runtime = 'edge'; // Use edge runtime for faster responses
export const revalidate = 120; // Revalidate every 2 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Get rates (cached or fresh)
    const rates = forceRefresh
      ? await forceRefreshRates()
      : await getCachedRates();

    return NextResponse.json({
      success: true,
      data: rates,
      cached: !forceRefresh,
      message: 'Real-time rates fetched successfully',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/rates:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch real-time rates',
      message: error.message,
      timestamp: Date.now(),
    }, {
      status: 500,
    });
  }
}
