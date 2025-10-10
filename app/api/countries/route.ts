import { NextRequest, NextResponse } from 'next/server';
import { COUNTRIES } from '@/lib/constants';

// GET /api/countries - Obtener todos los países disponibles
// Query params opcionales:
// - region: Filtrar por región (central-america, south-america, caribbean, north-america)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');

    let countries = [...COUNTRIES];

    // Filtrar por región si se especifica
    if (region) {
      countries = countries.filter(country => country.region === region);
    }

    return NextResponse.json({
      success: true,
      count: countries.length,
      data: countries,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los países',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
