"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";
import { Calculator as CalcIcon, RefreshCw } from "lucide-react";
import { ExchangeAPIClient } from "@/lib/api-client";

interface RealTimeRates {
  venezuela: {
    bcv: number;
    paralelo: number;
    binanceP2P: number;
  };
  countries: Record<string, number>;
}

export default function Calculator() {
  const [amount, setAmount] = useState<number>(100);
  const [country, setCountry] = useState<string>("VE");
  const [rateType, setRateType] = useState<string>("paralelo");
  const [result, setResult] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [realRates, setRealRates] = useState<RealTimeRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time rates on component mount
  useEffect(() => {
    fetchRates();
    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchRates, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchRates = async () => {
    try {
      setError(null);
      const data = await ExchangeAPIClient.getAllRates();
      setRealRates(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching rates:', err);
      setError('Error al cargar tasas. Reintentando...');
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    if (!realRates) {
      setError('No hay tasas disponibles. Intenta refrescar.');
      return;
    }

    let rate = 0;

    // Para Venezuela, usar tasas específicas (bcv, paralelo, binance)
    if (country === 'VE') {
      if (rateType === 'bcv') {
        rate = realRates.venezuela.bcv;
      } else if (rateType === 'paralelo') {
        rate = realRates.venezuela.paralelo;
      } else if (rateType === 'binance') {
        rate = realRates.venezuela.binanceP2P;
      }
    } else {
      // Para otros países, usar la tasa del API según la moneda
      const selectedCountry = COUNTRIES.find(c => c.code === country);
      if (selectedCountry) {
        rate = realRates.countries[selectedCountry.currency] || 0;
      }
    }

    // Si la tasa es 0, mostrar error
    if (rate === 0) {
      setError(`No se pudo obtener la tasa para ${selectedCountry?.name}. Intenta refrescar.`);
      return;
    }

    const calculated = amount * rate;
    setResult(calculated);
    setShowResult(true);
    setError(null); // Limpiar errores previos
  };

  const selectedCountry = COUNTRIES.find(c => c.code === country);

  // Get the current rate for display
  const getCurrentRate = (): number => {
    if (!realRates) return 0;

    if (country === 'VE') {
      if (rateType === 'bcv') return realRates.venezuela.bcv;
      if (rateType === 'paralelo') return realRates.venezuela.paralelo;
      if (rateType === 'binance') return realRates.venezuela.binanceP2P;
    } else {
      const selectedCountry = COUNTRIES.find(c => c.code === country);
      if (selectedCountry) {
        return realRates.countries[selectedCountry.currency] || 0;
      }
    }
    return 0;
  };

  return (
    <section id="calculadora" className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              💱 Calculadora de Remesas
            </h2>
            {realRates && (
              <button
                onClick={fetchRates}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País Origen
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>🇺🇸 Estados Unidos (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País Destino
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {COUNTRIES.filter(c => c.active).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monto a Enviar (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-semibold"
                placeholder="100"
              />
            </div>

            {/* Tipo de Tasa - Solo para Venezuela */}
            {country === 'VE' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Tasa (Venezuela)
                </label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="paralelo">💵 Paralelo (Mejor)</option>
                  <option value="binance">₿ Binance P2P</option>
                  <option value="bcv">🏛️ BCV Oficial</option>
                </select>
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading || !realRates}
              className={`w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2 ${
                loading || !realRates ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <CalcIcon size={20} />
              {loading ? 'Cargando tasas...' : 'Calcular Remesa'}
            </button>

            {/* Loading skeleton */}
            {loading && (
              <div className="mt-6 p-6 bg-white rounded-lg shadow-lg animate-pulse">
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            )}

            {/* Real-time rate indicator */}
            {!loading && realRates && (
              <div className="mt-4 text-center text-sm" style={{ color: '#000000' }}>
                ⚡ Tasa en tiempo real: <strong>{getCurrentRate().toFixed(2)}</strong> {selectedCountry?.currency}/USD
              </div>
            )}

            {showResult && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-white rounded-lg shadow-lg"
              >
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Recibirás aproximadamente:</p>
                  <p className="text-5xl font-bold text-green-600 mb-4">
                    {result.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {selectedCountry?.currency}
                  </p>
                  <p className="text-sm" style={{ color: '#000000' }}>
                    {amount} USD × {getCurrentRate().toFixed(2)} {selectedCountry?.currency}/USD = {result.toFixed(2)}{" "}
                    {selectedCountry?.currency}
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    📊 Tasa real obtenida de fuentes oficiales
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
