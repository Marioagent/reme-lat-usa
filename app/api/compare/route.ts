import { NextRequest, NextResponse } from 'next/server';
import { REMITTANCE_SERVICES } from '@/lib/constants';

// GET /api/compare - Comparar servicios con filtros avanzados
// Query params requeridos:
// - country: País destino (requerido)
// - amount: Monto a enviar en USD (requerido)
// Query params opcionales:
// - type: Tipo de servicio (digital, crypto, traditional, fintech)
// - speed: Velocidad (instant, same-day, 1-3-days, 3-7-days)
// - sortBy: Ordenar por (commission, speed, rating, total)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const country = searchParams.get('country');
    const amount = searchParams.get('amount');
    const type = searchParams.get('type');
    const speed = searchParams.get('speed');
    const sortBy = searchParams.get('sortBy') || 'commission';

    // Validar parámetros requeridos
    if (!country) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetro "country" es requerido'
        },
        { status: 400 }
      );
    }

    if (!amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetro "amount" es requerido'
        },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'El monto debe ser un número positivo'
        },
        { status: 400 }
      );
    }

    // Filtrar servicios
    let services = REMITTANCE_SERVICES.filter(service =>
      service.countries.includes(country.toUpperCase())
    );

    // Filtrar por tipo
    if (type) {
      services = services.filter(service => service.type === type);
    }

    // Filtrar por velocidad
    if (speed) {
      services = services.filter(service => service.speed === speed);
    }

    // Calcular costos y cantidad neta
    const servicesWithCalcs = services.map(service => {
      const commissionAmount = (amountNum * service.commission) / 100;
      const netAmount = amountNum - commissionAmount;

      return {
        ...service,
        calculations: {
          sendAmount: amountNum,
          commissionAmount: parseFloat(commissionAmount.toFixed(2)),
          netAmount: parseFloat(netAmount.toFixed(2)),
        }
      };
    });

    // Ordenar
    const sorted = [...servicesWithCalcs].sort((a, b) => {
      switch (sortBy) {
        case 'commission':
          return a.commission - b.commission;
        case 'speed':
          const speedOrder: Record<string, number> = {
            'instant': 1,
            'same-day': 2,
            '1-3-days': 3,
            '3-7-days': 4
          };
          return speedOrder[a.speed] - speedOrder[b.speed];
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'total':
          return b.calculations.netAmount - a.calculations.netAmount;
        default:
          return 0;
      }
    });

    // Identificar el mejor servicio
    const best = sorted[0];

    return NextResponse.json({
      success: true,
      count: sorted.length,
      data: sorted,
      best: {
        service: best.name,
        id: best.id,
        savings: sorted.length > 1
          ? parseFloat((sorted[sorted.length - 1].calculations.commissionAmount - best.calculations.commissionAmount).toFixed(2))
          : 0
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        filters: {
          country,
          amount: amountNum,
          type: type || 'all',
          speed: speed || 'all',
          sortBy
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al comparar servicios',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
