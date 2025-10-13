import { NextRequest, NextResponse } from 'next/server';

// RAGSearch1 Integration - Intelligent Financial Institution Search
// Connects to RAGSearch1 API for AI-powered search

const RAGSEARCH1_API = process.env.RAGSEARCH1_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 5, country, type } = body;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query parameter is required'
        },
        { status: 400 }
      );
    }

    // Call RAGSearch1 API
    const response = await fetch(`${RAGSEARCH1_API}/api/v1/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit,
        filters: {
          country,
          type
        }
      })
    });

    if (!response.ok) {
      throw new Error(`RAGSearch1 API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.results || [],
      total: data.total || 0,
      query: data.query,
      source: 'RAGSearch1'
    });

  } catch (error) {
    console.error('RAG Search error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform AI search',
        message: error instanceof Error ? error.message : 'Unknown error',
        fallback: true
      },
      { status: 500 }
    );
  }
}

// GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '5');
  const country = searchParams.get('country');
  const type = searchParams.get('type');

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error: 'Query parameter (q) is required'
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${RAGSEARCH1_API}/api/v1/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit,
        filters: {
          country,
          type
        }
      })
    });

    if (!response.ok) {
      throw new Error(`RAGSearch1 API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.results || [],
      total: data.total || 0,
      query: data.query,
      source: 'RAGSearch1'
    });

  } catch (error) {
    console.error('RAG Search error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform AI search',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
