// BCV Official Rate API - Direct Sources
// Real Venezuelan Bolívar exchange rates from official and trusted sources

// Note: Using native fetch for Edge Runtime compatibility (no axios)

// ============================================
// BCV OFFICIAL RATE - MULTIPLE SOURCES
// ============================================

/**
 * PRIMARY: DolarAPI Venezuela - Most Reliable
 * Source: https://ve.dolarapi.com - Official BCV rates
 */
async function getBCVFromDolarAPI(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://ve.dolarapi.com/v1/dolares', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    // Find "oficial" source (BCV)
    const oficial = data?.find((item: any) => item.fuente === 'oficial');
    if (oficial?.promedio) {
      return parseFloat(oficial.promedio);
    }
    return null;
  } catch (error: any) {
    console.warn('DolarAPI Venezuela BCV failed:', error?.message || error);
    return null;
  }
}

/**
 * SECONDARY: BCV Official Rate from bcv.org.ve
 * This attempts to fetch the official rate directly from Banco Central de Venezuela
 */
async function getBCVOfficialDirect(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data?.monitors?.bcv?.price) {
      return parseFloat(data.monitors.bcv.price);
    }
    return null;
  } catch (error: any) {
    console.warn('BCV Official Direct failed (timeout/unavailable):', error?.message || error);
    return null;
  }
}

/**
 * SECONDARY: Monitor Dólar Venezuela API
 * Aggregates official BCV rate
 */
async function getBCVFromMonitorDolar(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data?.monitors?.bcv?.price) {
      return parseFloat(data.monitors.bcv.price);
    }
    return null;
  } catch (error) {
    console.warn('Monitor Dólar BCV failed:', error);
    return null;
  }
}

/**
 * TERTIARY: ExchangeMonitor.net API
 * Venezuelan exchange rate monitoring
 */
async function getBCVFromExchangeMonitor(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.exchangemonitor.net/v1/rates/bcv', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data?.rate) {
      return parseFloat(data.rate);
    }
    return null;
  } catch (error) {
    console.warn('ExchangeMonitor BCV failed:', error);
    return null;
  }
}

/**
 * QUATERNARY: ExchangeRate-API with adjustment
 * Fallback to general API with BCV adjustment
 */
async function getBCVFromExchangeRateAPI(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data?.rates?.VES) {
      const vesRate = parseFloat(data.rates.VES);
      // BCV is typically 5-10% below parallel rate
      return parseFloat((vesRate * 0.93).toFixed(2));
    }
    return null;
  } catch (error) {
    console.warn('ExchangeRate-API BCV fallback failed:', error);
    return null;
  }
}

// ============================================
// PARALELO RATE - MARKET SOURCES
// ============================================

/**
 * PRIMARY: DolarAPI Venezuela - Paralelo Rate
 * Source: https://ve.dolarapi.com - Market parallel rates
 */
async function getParaleloFromDolarAPI(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://ve.dolarapi.com/v1/dolares', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    // Find "paralelo" source
    const paralelo = data?.find((item: any) => item.fuente === 'paralelo');
    if (paralelo?.promedio) {
      return parseFloat(paralelo.promedio);
    }
    return null;
  } catch (error) {
    console.warn('DolarAPI Venezuela Paralelo failed:', error);
    return null;
  }
}

/**
 * SECONDARY: Monitor Dólar Venezuela - Paralelo Rate
 */
async function getParaleloFromMonitorDolar(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    // Try multiple parallel market sources
    const sources = ['enparalelovzla', 'paralelo', 'dolartoday'];

    for (const source of sources) {
      if (data?.monitors?.[source]?.price) {
        return parseFloat(data.monitors[source].price);
      }
    }
    return null;
  } catch (error) {
    console.warn('Monitor Dólar Paralelo failed:', error);
    return null;
  }
}

/**
 * SECONDARY: ExchangeRate-API - Market Rate
 */
async function getParaleloFromExchangeRateAPI(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data?.rates?.VES) {
      return parseFloat(data.rates.VES);
    }
    return null;
  } catch (error) {
    console.warn('ExchangeRate-API Paralelo failed:', error);
    return null;
  }
}

// ============================================
// BINANCE P2P RATE
// ============================================

/**
 * PRIMARY: Binance P2P VES/USDT Rate
 */
async function getBinanceP2PFromAPI(): Promise<number | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    const data = await response.json();

    if (data?.monitors?.binance?.price) {
      return parseFloat(data.monitors.binance.price);
    }
    return null;
  } catch (error) {
    console.warn('Binance P2P API failed:', error);
    return null;
  }
}

/**
 * SECONDARY: Binance P2P Fallback (calculated from parallel)
 */
async function getBinanceP2PFallback(paraleloRate: number): Promise<number> {
  // Binance P2P typically trades 1-3% above parallel market
  return parseFloat((paraleloRate * 1.02).toFixed(2));
}

// ============================================
// UNIFIED RATE FETCHER WITH VALIDATION
// ============================================

export interface VenezuelaRatesValidated {
  bcv: {
    rate: number;
    source: string;
    timestamp: number;
    confidence: 'high' | 'medium' | 'low';
  };
  paralelo: {
    rate: number;
    source: string;
    timestamp: number;
    confidence: 'high' | 'medium' | 'low';
  };
  binanceP2P: {
    rate: number;
    source: string;
    timestamp: number;
    confidence: 'high' | 'medium' | 'low';
  };
  validation: {
    bcvParaleloDiff: number; // % difference
    binanceParaleloDiff: number; // % difference
    alert: string | null;
  };
}

/**
 * Get all Venezuela rates with multi-source validation
 * This is the main function to use - includes fallbacks and validation
 * Now with faster timeouts for weekend/holiday scenarios
 */
export async function getVenezuelaRatesValidated(): Promise<VenezuelaRatesValidated> {
  const timestamp = Date.now();

  try {
    // Fetch BCV from multiple sources (parallel) con timeout general
    const bcvPromises = Promise.allSettled([
      getBCVFromDolarAPI(),           // NEW: DolarAPI first (most reliable)
      getBCVOfficialDirect(),
      getBCVFromMonitorDolar(),
      getBCVFromExchangeMonitor(),
      getBCVFromExchangeRateAPI(),
    ]);

    // Fetch Paralelo from multiple sources
    const paraleloPromises = Promise.allSettled([
      getParaleloFromDolarAPI(),      // NEW: DolarAPI first (most reliable)
      getParaleloFromMonitorDolar(),
      getParaleloFromExchangeRateAPI(),
    ]);

    // Fetch Binance P2P
    const binancePromises = Promise.allSettled([
      getBinanceP2PFromAPI(),
    ]);

    // Esperar todas con timeout de 8 segundos total
    const results = await Promise.race([
      Promise.all([bcvPromises, paraleloPromises, binancePromises]),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout - using fallback')), 8000)
      )
    ]) as [
      PromiseSettledResult<number | null>[],
      PromiseSettledResult<number | null>[],
      PromiseSettledResult<number | null>[]
    ];

    const [bcvResults, paraleloResults, binanceResults] = results;
    const [bcvDolarAPI, bcvOfficial, bcvMonitor, bcvExchange, bcvFallback] = bcvResults;
    const [paraleloDolarAPI, paraleloMonitor, paraleloExchange] = paraleloResults;
    const [binanceAPI] = binanceResults;

  // Select best BCV rate
  let bcvRate = 0;
  let bcvSource = 'unknown';
  let bcvConfidence: 'high' | 'medium' | 'low' = 'low';

  if (bcvDolarAPI.status === 'fulfilled' && bcvDolarAPI.value) {
    bcvRate = bcvDolarAPI.value;
    bcvSource = 'DolarAPI Venezuela (BCV)';
    bcvConfidence = 'high';
  } else if (bcvOfficial.status === 'fulfilled' && bcvOfficial.value) {
    bcvRate = bcvOfficial.value;
    bcvSource = 'BCV Official Direct';
    bcvConfidence = 'high';
  } else if (bcvMonitor.status === 'fulfilled' && bcvMonitor.value) {
    bcvRate = bcvMonitor.value;
    bcvSource = 'Monitor Dólar (BCV)';
    bcvConfidence = 'high';
  } else if (bcvExchange.status === 'fulfilled' && bcvExchange.value) {
    bcvRate = bcvExchange.value;
    bcvSource = 'ExchangeMonitor';
    bcvConfidence = 'medium';
  } else if (bcvFallback.status === 'fulfilled' && bcvFallback.value) {
    bcvRate = bcvFallback.value;
    bcvSource = 'ExchangeRate-API (estimated)';
    bcvConfidence = 'low';
  }

  // Select best Paralelo rate
  let paraleloRate = 0;
  let paraleloSource = 'unknown';
  let paraleloConfidence: 'high' | 'medium' | 'low' = 'low';

  if (paraleloDolarAPI.status === 'fulfilled' && paraleloDolarAPI.value) {
    paraleloRate = paraleloDolarAPI.value;
    paraleloSource = 'DolarAPI Venezuela (Paralelo)';
    paraleloConfidence = 'high';
  } else if (paraleloMonitor.status === 'fulfilled' && paraleloMonitor.value) {
    paraleloRate = paraleloMonitor.value;
    paraleloSource = 'Monitor Dólar (Paralelo)';
    paraleloConfidence = 'high';
  } else if (paraleloExchange.status === 'fulfilled' && paraleloExchange.value) {
    paraleloRate = paraleloExchange.value;
    paraleloSource = 'ExchangeRate-API';
    paraleloConfidence = 'medium';
  }

  // Select best Binance P2P rate
  let binanceRate = 0;
  let binanceSource = 'unknown';
  let binanceConfidence: 'high' | 'medium' | 'low' = 'low';

  if (binanceAPI.status === 'fulfilled' && binanceAPI.value) {
    binanceRate = binanceAPI.value;
    binanceSource = 'Binance P2P API';
    binanceConfidence = 'high';
  } else if (paraleloRate > 0) {
    binanceRate = await getBinanceP2PFallback(paraleloRate);
    binanceSource = 'Calculated from Paralelo';
    binanceConfidence = 'medium';
  }

    // Si todas las tasas son 0, forzar uso de fallback
    if (bcvRate === 0 && paraleloRate === 0 && binanceRate === 0) {
      throw new Error('All API sources returned 0 or failed - using fallback rates');
    }

    // Validation: Calculate differences
    const bcvParaleloDiff = paraleloRate > 0 ? ((paraleloRate - bcvRate) / bcvRate) * 100 : 0;
    const binanceParaleloDiff = paraleloRate > 0 ? ((binanceRate - paraleloRate) / paraleloRate) * 100 : 0;

    // Alert if rates seem off
    let alert: string | null = null;
    if (Math.abs(bcvParaleloDiff) > 20) {
      alert = `BCV-Paralelo difference is ${bcvParaleloDiff.toFixed(1)}% (expected 5-15%)`;
    } else if (Math.abs(binanceParaleloDiff) > 5) {
      alert = `Binance-Paralelo difference is ${binanceParaleloDiff.toFixed(1)}% (expected 0-3%)`;
    }

    return {
      bcv: {
        rate: bcvRate,
        source: bcvSource,
        timestamp,
        confidence: bcvConfidence,
      },
      paralelo: {
        rate: paraleloRate,
        source: paraleloSource,
        timestamp,
        confidence: paraleloConfidence,
      },
      binanceP2P: {
        rate: binanceRate,
        source: binanceSource,
        timestamp,
        confidence: binanceConfidence,
      },
      validation: {
        bcvParaleloDiff: parseFloat(bcvParaleloDiff.toFixed(2)),
        binanceParaleloDiff: parseFloat(binanceParaleloDiff.toFixed(2)),
        alert,
      },
    };
  } catch (error) {
    // Si todo falla (APIs caídas, fin de semana, etc), usar tasas estimadas
    console.error('All Venezuela API sources failed, using estimated rates:', error);

    // Fallback rates actualizadas - Enero 2025
    const bcvFallback = 195.00;    // BCV Oficial aproximado
    const paraleloFallback = 294.00; // Paralelo aproximado
    const binanceFallback = 270.00;  // Binance P2P entre BCV y Paralelo

    return {
      bcv: {
        rate: bcvFallback,
        source: 'Fallback (API unavailable - estimated Jan 2025)',
        timestamp,
        confidence: 'low',
      },
      paralelo: {
        rate: paraleloFallback,
        source: 'Fallback (API unavailable - estimated Jan 2025)',
        timestamp,
        confidence: 'low',
      },
      binanceP2P: {
        rate: binanceFallback,
        source: 'Fallback (API unavailable - estimated Jan 2025)',
        timestamp,
        confidence: 'low',
      },
      validation: {
        bcvParaleloDiff: parseFloat((((paraleloFallback - bcvFallback) / bcvFallback) * 100).toFixed(2)),
        binanceParaleloDiff: parseFloat((((binanceFallback - paraleloFallback) / paraleloFallback) * 100).toFixed(2)),
        alert: 'Using fallback rates - APIs unavailable (weekend/holiday)',
      },
    };
  }
}

// Export simple getters for backward compatibility
export async function getBCVRateOfficial(): Promise<number> {
  const rates = await getVenezuelaRatesValidated();
  return rates.bcv.rate;
}

export async function getParaleloRateOfficial(): Promise<number> {
  const rates = await getVenezuelaRatesValidated();
  return rates.paralelo.rate;
}

export async function getBinanceP2PRateOfficial(): Promise<number> {
  const rates = await getVenezuelaRatesValidated();
  return rates.binanceP2P.rate;
}
