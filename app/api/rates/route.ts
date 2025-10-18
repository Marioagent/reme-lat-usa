import { NextResponse } from 'next/server';
import { getAllRates } from '@/lib/exchange-rates';

// API Route para obtener TODAS las tasas en tiempo real
export async function GET() {
  try {
    const { standard, venezuela } = await getAllRates();

    return NextResponse.json({
      success: true,
      data: {
        standard,
        venezuela,
        timestamp: Date.now(),
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching rates:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch exchange rates'
      },
      { status: 500 }
    );
  }
}

// Cache para Edge Runtime
export const runtime = 'edge';
export const revalidate = 60; // Revalidar cada 60 segundos
