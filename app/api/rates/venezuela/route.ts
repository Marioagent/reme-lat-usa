import { NextResponse } from 'next/server';
import { getVenezuelaRates, getBestVenezuelaRate } from '@/lib/exchange-rates';

// API específica para tasas de Venezuela (BCV, Paralelo, Binance)
export async function GET() {
  try {
    const [rates, best] = await Promise.all([
      getVenezuelaRates(),
      getBestVenezuelaRate()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bcv: {
          rate: rates.bcv,
          source: 'Banco Central de Venezuela',
          official: true
        },
        paralelo: {
          rate: rates.paralelo,
          source: 'DolarToday / Monitor Dólar',
          official: false
        },
        binance: {
          rate: rates.binance,
          source: 'Binance P2P',
          official: false
        },
        best: {
          rate: best.rate,
          source: best.source,
          recommended: true
        },
        timestamp: rates.timestamp,
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching Venezuela rates:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Venezuela rates'
      },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const revalidate = 60;
