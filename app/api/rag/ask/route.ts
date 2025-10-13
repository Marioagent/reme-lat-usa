import { NextRequest, NextResponse } from 'next/server';

// RAGSearch1 Integration - AI-Powered Questions
// Ask questions about financial institutions using RAG

const RAGSEARCH1_API = process.env.RAGSEARCH1_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error: 'Question is required'
        },
        { status: 400 }
      );
    }

    // Call RAGSearch1 API
    const response = await fetch(`${RAGSEARCH1_API}/api/v1/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question
      })
    });

    if (!response.ok) {
      throw new Error(`RAGSearch1 API error: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      question: data.question,
      answer: data.answer,
      sources: data.sources || [],
      confidence: data.confidence || 0,
      powered_by: 'RAGSearch1 + OpenAI'
    });

  } catch (error) {
    console.error('RAG Ask error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get AI answer',
        message: error instanceof Error ? error.message : 'Unknown error',
        fallback_message: 'RAGSearch1 API is not available. Please try again later.'
      },
      { status: 500 }
    );
  }
}
