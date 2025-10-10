import { NextResponse } from 'next/server';
import { getBCVRate, getParaleloRate, getBinanceP2PRate } from '@/lib/exchange-api';

// API Route: /api/rates/venezuela
// Returns only Venezuela-specific rates

export const runtime = 'edge';
export const revalidate = 120;

export async function GET() {
  try {
    // Fetch Venezuela rates in parallel
    const [bcv, paralelo, binanceP2P] = await Promise.all([
      getBCVRate(),
      getParaleloRate(),
      getBinanceP2PRate(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bcv: {
          rate: bcv,
          name: 'BCV Oficial',
          source: 'Banco Central de Venezuela',
        },
        paralelo: {
          rate: paralelo,
          name: 'Paralelo',
          source: 'Monitor Dólar / EnParaleloVzla',
        },
        binanceP2P: {
          rate: binanceP2P,
          name: 'Binance P2P',
          source: 'Binance Public API',
        },
        timestamp: Date.now(),
        currency: 'VES',
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
      },
    });
  } catch (error: any) {
    console.error('Error fetching Venezuela rates:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Venezuela rates',
      message: error.message,
    }, {
      status: 500,
    });
  }
}
