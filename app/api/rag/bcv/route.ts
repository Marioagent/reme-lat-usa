import { NextRequest, NextResponse } from 'next/server';

// RAGSearch1 Integration - BCV Rates from RAG System
// Get Venezuela rates from RAGSearch1 (which has real-time BCV data)

const RAGSEARCH1_API = process.env.RAGSEARCH1_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Call RAGSearch1 BCV API
    const response = await fetch(`${RAGSEARCH1_API}/api/v1/bcv/rates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 120 } // Cache for 2 minutes
    });

    if (!response.ok) {
      throw new Error(`RAGSearch1 API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        bcv_oficial: data.bcv_oficial,
        paralelo: data.paralelo,
        binance_p2p: data.binance_p2p,
        sources: data.sources
      },
      timestamp: data.timestamp || Date.now(),
      source: 'RAGSearch1 (Multi-source validated)'
    });

  } catch (error) {
    console.error('RAG BCV error:', error);

    // Fallback to local BCV API if RAGSearch1 is unavailable
    try {
      const fallbackUrl = new URL('/api/rates/venezuela', request.url);
      const fallbackResponse = await fetch(fallbackUrl.toString());
      const fallbackData = await fallbackResponse.json();

      return NextResponse.json({
        success: true,
        data: {
          bcv_oficial: fallbackData.data.bcv.rate,
          paralelo: fallbackData.data.paralelo.rate,
          binance_p2p: fallbackData.data.binanceP2P.rate,
        },
        timestamp: Date.now(),
        source: 'Local fallback (RAGSearch1 unavailable)',
        fallback: true
      });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get BCV rates from both RAGSearch1 and local API',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}
