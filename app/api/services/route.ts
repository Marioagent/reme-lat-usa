import { NextRequest, NextResponse } from 'next/server';
import { REMITTANCE_SERVICES } from '@/lib/constants';

// GET /api/services - Obtener todos los servicios de remesas
// Query params opcionales:
// - country: Filtrar por país (ej: VE, MX, CO)
// - type: Filtrar por tipo (digital, crypto, traditional, fintech)
// - limit: Limitar número de resultados
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    let services = [...REMITTANCE_SERVICES];

    // Filtrar por país si se especifica
    if (country) {
      services = services.filter(service =>
        service.countries.includes(country.toUpperCase())
      );
    }

    // Filtrar por tipo si se especifica
    if (type) {
      services = services.filter(service => service.type === type);
    }

    // Limitar resultados si se especifica
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        services = services.slice(0, limitNum);
      }
    }

    return NextResponse.json({
      success: true,
      count: services.length,
      data: services,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los servicios',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
