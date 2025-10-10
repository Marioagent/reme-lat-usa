// Real-Time Exchange Rate Client
// This client fetches REAL rates from our Next.js API routes
// NO MOCKS - NO DEMOS - ONLY REAL DATA

import axios from "axios";
import { ExchangeRate } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || '';

export class ExchangeAPIClient {
  /**
   * Get all real-time rates from our API
   * This includes Venezuela rates, Euro, and all country rates
   */
  static async getAllRates(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE}/api/rates`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to fetch rates');
    } catch (error) {
      console.error("Error fetching all rates:", error);
      throw error;
    }
  }

  /**
   * Get only Venezuela rates (BCV, Paralelo, Binance P2P)
   * All rates are fetched in real-time from actual sources
   */
  static async getVenezuelaRates(): Promise<{
    bcv: number;
    paralelo: number;
    binanceP2P: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE}/api/rates/venezuela`);
      if (response.data.success) {
        return {
          bcv: response.data.data.bcv.rate,
          paralelo: response.data.data.paralelo.rate,
          binanceP2P: response.data.data.binanceP2P.rate,
        };
      }
      throw new Error('Failed to fetch Venezuela rates');
    } catch (error) {
      console.error("Error fetching Venezuela rates:", error);
      throw error;
    }
  }

  /**
   * Get BCV Official Rate - REAL from Banco Central de Venezuela
   */
  static async getBCVRate(): Promise<number> {
    try {
      const rates = await this.getVenezuelaRates();
      return rates.bcv;
    } catch (error) {
      console.error("Error fetching BCV rate:", error);
      throw error;
    }
  }

  /**
   * Get Paralelo Rate - REAL from Monitor Dólar / EnParaleloVzla
   */
  static async getParaleloRate(): Promise<number> {
    try {
      const rates = await this.getVenezuelaRates();
      return rates.paralelo;
    } catch (error) {
      console.error("Error fetching Paralelo rate:", error);
      throw error;
    }
  }

  /**
   * Get Binance P2P Rate - REAL from Binance Public API
   */
  static async getBinanceP2PRate(fiat: string = "VES"): Promise<number> {
    try {
      if (fiat === "VES") {
        const rates = await this.getVenezuelaRates();
        return rates.binanceP2P;
      }
      // For other currencies, use the general rates endpoint
      const allRates = await this.getAllRates();
      return allRates.countries[fiat] || 0;
    } catch (error) {
      console.error("Error fetching Binance rate:", error);
      throw error;
    }
  }

  /**
   * Get exchange rates for multiple countries - REAL from ExchangeRate-API
   */
  static async getExchangeRates(baseCurrency: string = "USD"): Promise<ExchangeRate[]> {
    try {
      const allRates = await this.getAllRates();
      const rates = allRates.countries;

      return Object.entries(rates).map(([currency, rate]) => ({
        currency,
        rate: rate as number,
        source: "ExchangeRateAPI",
        timestamp: new Date(allRates.timestamp),
      }));
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return [];
    }
  }

  /**
   * Get Euro to USD rate - REAL from European Central Bank / ExchangeRate-API
   */
  static async getEuroRate(): Promise<number> {
    try {
      const allRates = await this.getAllRates();
      return allRates.euro;
    } catch (error) {
      console.error("Error fetching Euro rate:", error);
      throw error;
    }
  }

  /**
   * Force refresh all rates (bypass cache)
   */
  static async refreshRates(): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE}/api/rates?refresh=true`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error('Failed to refresh rates');
    } catch (error) {
      console.error("Error refreshing rates:", error);
      throw error;
    }
  }
}

// Export a simpler interface for hooks
export async function useRealTimeRates() {
  return await ExchangeAPIClient.getAllRates();
}

export async function useVenezuelaRates() {
  return await ExchangeAPIClient.getVenezuelaRates();
}
