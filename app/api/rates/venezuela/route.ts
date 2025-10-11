import { NextResponse } from 'next/server';
import { getVenezuelaRatesValidated } from '@/lib/bcv-api';

// API Route: /api/rates/venezuela
// Returns Venezuela-specific rates with official sources and validation

export const runtime = 'edge';
export const revalidate = 120;

export async function GET() {
  try {
    // Fetch Venezuela rates with validation
    const rates = await getVenezuelaRatesValidated();

    return NextResponse.json({
      success: true,
      data: {
        bcv: {
          rate: rates.bcv.rate,
          name: 'BCV Oficial',
          source: rates.bcv.source,
          confidence: rates.bcv.confidence,
        },
        paralelo: {
          rate: rates.paralelo.rate,
          name: 'Paralelo',
          source: rates.paralelo.source,
          confidence: rates.paralelo.confidence,
        },
        binanceP2P: {
          rate: rates.binanceP2P.rate,
          name: 'Binance P2P',
          source: rates.binanceP2P.source,
          confidence: rates.binanceP2P.confidence,
        },
        validation: {
          bcvParaleloDiff: rates.validation.bcvParaleloDiff,
          binanceParaleloDiff: rates.validation.binanceParaleloDiff,
          alert: rates.validation.alert,
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
