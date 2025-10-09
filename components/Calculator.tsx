"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";
import { Calculator as CalcIcon } from "lucide-react";

export default function Calculator() {
  const [amount, setAmount] = useState<number>(100);
  const [country, setCountry] = useState<string>("VE");
  const [rateType, setRateType] = useState<string>("paralelo");
  const [result, setResult] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const rates: Record<string, Record<string, number>> = {
    VE: { bcv: 38.45, paralelo: 52.80, binance: 51.25 },
    CO: { bcv: 4200, paralelo: 4250, binance: 4230 },
    AR: { bcv: 1050, paralelo: 1080, binance: 1070 },
    BR: { bcv: 5.2, paralelo: 5.3, binance: 5.25 },
    PE: { bcv: 3.75, paralelo: 3.78, binance: 3.76 },
    CL: { bcv: 950, paralelo: 960, binance: 955 },
    EC: { bcv: 1, paralelo: 1, binance: 1 },
  };

  const handleCalculate = () => {
    const rate = rates[country]?.[rateType] || 0;
    const calculated = amount * rate;
    setResult(calculated);
    setShowResult(true);
  };

  const selectedCountry = COUNTRIES.find(c => c.code === country);

  return (
    <section id="calculadora" className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            💱 Calculadora de Remesas
          </h2>

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

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Tasa
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

            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2"
            >
              <CalcIcon size={20} />
              Calcular Remesa
            </button>

            {showResult && (
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
                  <p className="text-sm text-gray-500">
                    {amount} USD × {rates[country]?.[rateType]} {selectedCountry?.currency}/USD = {result.toFixed(2)}{" "}
                    {selectedCountry?.currency}
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
