import axios from "axios";
import { ExchangeRate } from "@/types";

const EXCHANGE_API_BASE = "https://api.exchangerate-api.com/v4/latest";
const BINANCE_API_BASE = "https://api.binance.com/api/v3";

export class ExchangeAPIClient {
  /**
   * Obtiene tasas de cambio desde Exchange Rate API
   */
  static async getExchangeRates(baseCurrency: string = "USD"): Promise<ExchangeRate[]> {
    try {
      const response = await axios.get(`${EXCHANGE_API_BASE}/${baseCurrency}`);
      const rates = response.data.rates;

      return Object.entries(rates).map(([currency, rate]) => ({
        currency,
        rate: rate as number,
        source: "ExchangeRateAPI",
        timestamp: new Date(response.data.date),
      }));
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return [];
    }
  }

  /**
   * Obtiene tasa de Binance P2P (simulada por ahora)
   */
  static async getBinanceP2PRate(fiat: string = "VES"): Promise<number> {
    try {
      // API de Binance requiere autenticación para P2P
      // Por ahora retornamos tasas estimadas basadas en mercado
      const rates: Record<string, number> = {
        VES: 51.25,
        COP: 4200,
        ARS: 1050,
        BRL: 5.2,
        PEN: 3.75,
        CLP: 950,
      };

      return rates[fiat] || 1;
    } catch (error) {
      console.error("Error fetching Binance rate:", error);
      return 0;
    }
  }

  /**
   * Obtiene tasa BCV oficial de Venezuela
   */
  static async getBCVRate(): Promise<number> {
    try {
      // API del BCV (si está disponible)
      // Por ahora retornamos tasa fija
      return 38.45;
    } catch (error) {
      console.error("Error fetching BCV rate:", error);
      return 38.45;
    }
  }

  /**
   * Obtiene tasa paralelo de Venezuela
   */
  static async getParaleloRate(): Promise<number> {
    try {
      // API de DolarToday o Monitor Dólar
      // Por ahora retornamos tasa simulada
      return 52.8 + (Math.random() - 0.5) * 0.5;
    } catch (error) {
      console.error("Error fetching paralelo rate:", error);
      return 52.8;
    }
  }
}
