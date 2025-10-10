// Real-time Exchange Rate APIs - NO MOCKS, NO DEMOS
// All rates are fetched from real sources in real-time

import axios from 'axios';

// ============================================
// VENEZUELA RATES - REAL SOURCES
// ============================================

/**
 * BCV Official Rate (Banco Central de Venezuela)
 * Source: BCV Official API
 */
export async function getBCVRate(): Promise<number> {
  try {
    // Using Venezuela's official BCV API
    const response = await axios.get('https://s3.amazonaws.com/dolartoday/data.json');
    const bcvRate = response.data.USD.promedio_real || response.data.USD.sicad2;
    return parseFloat(bcvRate);
  } catch (error) {
    console.error('Error fetching BCV rate:', error);
    // Fallback to monitor dolar
    try {
      const fallback = await axios.get('https://pydolarve.org/api/v1/dollar?page=bcv');
      return parseFloat(fallback.data.monitors.usd.price);
    } catch {
      throw new Error('Unable to fetch BCV rate');
    }
  }
}

/**
 * Paralelo Rate (Parallel Market Venezuela)
 * Source: EnParaleloVzla / Monitor Dolar
 */
export async function getParaleloRate(): Promise<number> {
  try {
    // Primary source: Monitor Dolar API
    const response = await axios.get('https://pydolarve.org/api/v1/dollar?page=enparalelovzla');
    return parseFloat(response.data.monitors.usd.price);
  } catch (error) {
    console.error('Error fetching Paralelo rate:', error);
    // Fallback to DolarToday
    try {
      const fallback = await axios.get('https://s3.amazonaws.com/dolartoday/data.json');
      return parseFloat(fallback.data.USD.transferencia);
    } catch {
      throw new Error('Unable to fetch Paralelo rate');
    }
  }
}

/**
 * Binance P2P Rate for Venezuela (VES/USDT)
 * Source: Binance Public API
 */
export async function getBinanceP2PRate(): Promise<number> {
  try {
    const response = await axios.post(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        page: 1,
        rows: 10,
        payTypes: [],
        countries: [],
        publisherType: null,
        asset: 'USDT',
        fiat: 'VES',
        tradeType: 'SELL',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const ads = response.data.data;
    if (ads && ads.length > 0) {
      // Calculate average of top 5 ads
      const topAds = ads.slice(0, 5);
      const sum = topAds.reduce((acc: number, ad: any) => acc + parseFloat(ad.adv.price), 0);
      return sum / topAds.length;
    }
    throw new Error('No Binance P2P ads available');
  } catch (error) {
    console.error('Error fetching Binance P2P rate:', error);
    throw new Error('Unable to fetch Binance P2P rate');
  }
}

// ============================================
// EURO RATE - REAL SOURCE
// ============================================

/**
 * EUR/USD Rate
 * Source: ExchangeRate-API (Free tier: 1500 requests/month)
 */
export async function getEuroRate(): Promise<number> {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/EUR');
    return parseFloat(response.data.rates.USD);
  } catch (error) {
    console.error('Error fetching Euro rate:', error);
    // Fallback to European Central Bank
    try {
      const fallback = await axios.get('https://api.frankfurter.app/latest?from=EUR&to=USD');
      return parseFloat(fallback.data.rates.USD);
    } catch {
      throw new Error('Unable to fetch Euro rate');
    }
  }
}

// ============================================
// MULTI-COUNTRY RATES - REAL SOURCE
// ============================================

/**
 * Get real exchange rates for multiple countries
 * Source: ExchangeRate-API
 */
export async function getMultiCountryRates(): Promise<Record<string, number>> {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');

    return {
      ARS: parseFloat(response.data.rates.ARS), // Argentina Peso
      BOB: parseFloat(response.data.rates.BOB), // Bolivia Boliviano
      BRL: parseFloat(response.data.rates.BRL), // Brazil Real
      CLP: parseFloat(response.data.rates.CLP), // Chile Peso
      COP: parseFloat(response.data.rates.COP), // Colombia Peso
      PEN: parseFloat(response.data.rates.PEN), // Peru Sol
      UYU: parseFloat(response.data.rates.UYU), // Uruguay Peso
      PYG: parseFloat(response.data.rates.PYG), // Paraguay Guarani
      EUR: parseFloat(response.data.rates.EUR), // Euro
    };
  } catch (error) {
    console.error('Error fetching multi-country rates:', error);
    throw new Error('Unable to fetch exchange rates');
  }
}

// ============================================
// CONSOLIDATED RATES FETCHER
// ============================================

export interface AllRates {
  venezuela: {
    bcv: number;
    paralelo: number;
    binanceP2P: number;
  };
  euro: number;
  countries: Record<string, number>;
  timestamp: number;
}

/**
 * Fetch all real-time rates in one call
 * This is the main function to use in components
 */
export async function getAllRealTimeRates(): Promise<AllRates> {
  try {
    // Fetch all rates in parallel for better performance
    const [bcv, paralelo, binanceP2P, euro, countries] = await Promise.all([
      getBCVRate(),
      getParaleloRate(),
      getBinanceP2PRate(),
      getEuroRate(),
      getMultiCountryRates(),
    ]);

    return {
      venezuela: {
        bcv,
        paralelo,
        binanceP2P,
      },
      euro,
      countries,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error fetching all rates:', error);
    throw new Error('Unable to fetch real-time rates');
  }
}

// ============================================
// RATE REFRESH UTILITIES
// ============================================

/**
 * Get cached rates with automatic refresh
 * Caches rates for 2 minutes to avoid API rate limits
 */
let cachedRates: AllRates | null = null;
let lastFetch = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export async function getCachedRates(): Promise<AllRates> {
  const now = Date.now();

  if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
    return cachedRates;
  }

  const rates = await getAllRealTimeRates();
  cachedRates = rates;
  lastFetch = now;

  return rates;
}

/**
 * Force refresh rates (ignores cache)
 */
export async function forceRefreshRates(): Promise<AllRates> {
  const rates = await getAllRealTimeRates();
  cachedRates = rates;
  lastFetch = Date.now();
  return rates;
}
