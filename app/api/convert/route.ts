import { NextResponse } from 'next/server';
import { convertCurrency } from '@/lib/exchange-rates';

// API para conversión entre monedas en tiempo real
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const amount = parseFloat(searchParams.get('amount') || '100');
  const from = searchParams.get('from') || 'USD';
  const to = searchParams.get('to') || 'MXN';

  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { success: false, error: 'Invalid amount' },
      { status: 400 }
    );
  }

  try {
    const result = await convertCurrency(amount, from, to);

    return NextResponse.json({
      success: true,
      data: {
        from: { amount, currency: from },
        to: { amount: result, currency: to },
        rate: result / amount,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Error converting currency:', error);

    return NextResponse.json(
      { success: false, error: 'Conversion failed' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
