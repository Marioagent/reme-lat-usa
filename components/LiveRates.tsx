"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExchangeAPIClient } from "@/lib/api-client";
import { RefreshCw } from "lucide-react";

interface RateCard {
  title: string;
  icon: string;
  rate: number;
  description: string;
  color: string;
  source: string;
}

export default function LiveRates() {
  const [rates, setRates] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const updateRates = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const venezuelaRates = await ExchangeAPIClient.getVenezuelaRates();

      setRates([
        {
          title: "Tasa BCV",
          icon: "🏛️",
          rate: venezuelaRates.bcv,
          description: "Banco Central de Venezuela",
          color: "text-blue-600",
          source: "BCV Oficial",
        },
        {
          title: "Paralelo",
          icon: "💵",
          rate: venezuelaRates.paralelo,
          description: "Monitor Dólar / EnParaleloVzla",
          color: "text-green-600",
          source: "Mercado Paralelo",
        },
        {
          title: "Binance P2P",
          icon: "₿",
          rate: venezuelaRates.binanceP2P,
          description: "Binance Public API",
          color: "text-purple-600",
          source: "Crypto P2P",
        },
      ]);

      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Error updating rates:', err);
      setError('Error al obtener tasas. Reintentando...');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    updateRates();
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => updateRates(), 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading && rates.length === 0) {
    return (
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-32 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tasas en Vivo</h2>
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
            </p>
          )}
        </div>
        <button
          onClick={() => updateRates(true)}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rates.map((rate, index) => (
          <motion.div
            key={rate.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{rate.icon}</span>
              <span className="flex items-center gap-1 text-sm text-green-600 font-semibold">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                EN VIVO
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{rate.title}</h3>
            <p className={`text-3xl font-bold ${rate.color} mb-2`}>
              {rate.rate.toFixed(2)} Bs
            </p>
            <p className="text-xs text-gray-600 mb-1">{rate.description}</p>
            <p className="text-xs text-gray-500 italic">Fuente: {rate.source}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        📊 Datos reales obtenidos de fuentes oficiales • Actualización automática cada 2 minutos
      </div>
    </div>
  );
}
