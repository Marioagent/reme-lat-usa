"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";
import { Calculator as CalcIcon, ArrowLeftRight, RefreshCw } from "lucide-react";
import { ExchangeAPIClient } from "@/lib/api-client";

export default function CalculatorNew() {
  const [fromCountry, setFromCountry] = useState<string>("US");
  const [toCountry, setToCountry] = useState<string>("VE");
  const [amount, setAmount] = useState<number>(100);
  const [result, setResult] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [realRates, setRealRates] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Obtener tasas reales
  useEffect(() => {
    loadRealRates();
  }, []);

  const loadRealRates = async () => {
    try {
      const rates = await ExchangeAPIClient.getAllRates();
      setRealRates(rates);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading rates:', error);
    }
  };

  const handleSwapCountries = () => {
    const temp = fromCountry;
    setFromCountry(toCountry);
    setToCountry(temp);
    setShowResult(false);
  };

  const handleReset = () => {
    setAmount(0);
    setTargetAmount(0);
    setResult(0);
    setShowResult(false);
  };

  const getRateForCountry = (countryCode: string): number => {
    if (!realRates) return 0;

    // Mapeo de códigos de país a códigos de moneda
    const currencyMap: Record<string, string> = {
      'VE': 'VES',
      'CO': 'COP',
      'AR': 'ARS',
      'BR': 'BRL',
      'PE': 'PEN',
      'CL': 'CLP',
      'MX': 'MXN',
      'UY': 'UYU',
      'PY': 'PYG',
      'BO': 'BOB',
      'GT': 'GTQ',
      'HN': 'HNL',
      'NI': 'NIO',
      'CR': 'CRC',
      'PA': 'PAB',
      'DO': 'DOP',
      'CU': 'CUP',
      'HT': 'HTG',
    };

    const currency = currencyMap[countryCode];
    if (!currency) return 1; // USD o países con USD

    // Para Venezuela usamos el paralelo
    if (countryCode === 'VE' && realRates.venezuela) {
      return realRates.venezuela.paralelo;
    }

    // Para otros países usamos el exchange rate
    if (realRates.countries && realRates.countries[currency]) {
      return realRates.countries[currency];
    }

    return 1;
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      // Si no hay tasas cargadas, cargar
      if (!realRates) {
        await loadRealRates();
      }

      const fromRate = getRateForCountry(fromCountry);
      const toRate = getRateForCountry(toCountry);

      let calculated = 0;

      if (fromCountry === "US") {
        // Desde USD a otra moneda
        calculated = amount * toRate;
      } else if (toCountry === "US") {
        // Desde otra moneda a USD
        calculated = amount / fromRate;
      } else {
        // Entre dos monedas no-USD
        const usdAmount = amount / fromRate;
        calculated = usdAmount * toRate;
      }

      setResult(calculated);
      setShowResult(true);
    } catch (error) {
      console.error('Error calculating:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculo inverso: cuánto enviar para que reciban X
  const [inverseMode, setInverseMode] = useState<boolean>(false);
  const [targetAmount, setTargetAmount] = useState<number>(0);

  const handleInverseCalculate = () => {
    if (!realRates || targetAmount === 0) return;

    const fromRate = getRateForCountry(fromCountry);
    const toRate = getRateForCountry(toCountry);

    let requiredAmount = 0;

    if (fromCountry === "US") {
      // Desde USD: cuántos USD para que reciban X en moneda destino
      requiredAmount = targetAmount / toRate;
    } else if (toCountry === "US") {
      // A USD: cuánta moneda origen para que reciban X USD
      requiredAmount = targetAmount * fromRate;
    } else {
      // Entre dos monedas no-USD
      const usdEquivalent = targetAmount / toRate;
      requiredAmount = usdEquivalent * fromRate;
    }

    setAmount(requiredAmount);
    setResult(targetAmount);
    setShowResult(true);
  };

  const fromCountryData = COUNTRIES.find(c => c.code === fromCountry);
  const toCountryData = COUNTRIES.find(c => c.code === toCountry);

  return (
    <section id="calculadora" className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
              💱 Calculadora de Remesas
            </h2>
            <p className="text-lg" style={{ color: '#000000' }}>
              Calcula cuánto recibirás con tasas reales en tiempo real
            </p>
            {lastUpdate && (
              <p className="text-sm mt-2" style={{ color: '#000000' }}>
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
                <button
                  onClick={loadRealRates}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  style={{ color: '#000000', textDecoration: 'underline' }}
                >
                  <RefreshCw size={14} className="inline" /> Actualizar
                </button>
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-xl p-8">
            {/* Modo Normal / Inverso */}
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setInverseMode(false)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  !inverseMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-300'
                }`}
                style={!inverseMode ? {} : { color: '#000000' }}
              >
                Cuánto recibiré
              </button>
              <button
                onClick={() => setInverseMode(true)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  inverseMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-300'
                }`}
                style={inverseMode ? {} : { color: '#000000' }}
              >
                Cuánto debo enviar
              </button>
            </div>

            {/* Selectores de País */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                  Desde
                </label>
                <select
                  value={fromCountry}
                  onChange={(e) => {
                    setFromCountry(e.target.value);
                    setShowResult(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                  style={{ color: '#000000' }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSwapCountries}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg"
                  title="Invertir países"
                >
                  <ArrowLeftRight size={24} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                  Hacia
                </label>
                <select
                  value={toCountry}
                  onChange={(e) => {
                    setToCountry(e.target.value);
                    setShowResult(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                  style={{ color: '#000000' }}
                >
                  {COUNTRIES.filter(c => c.code !== fromCountry).map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modo Normal: Cuánto envío */}
            {!inverseMode && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Monto a Enviar ({fromCountryData?.currency})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(parseFloat(e.target.value) || 0);
                      setShowResult(false);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-semibold"
                    placeholder="100"
                    min="0"
                    step="0.01"
                    style={{ color: '#000000' }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCalculate}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CalcIcon size={20} />
                    {loading ? 'Calculando...' : 'Calcular Remesa'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-lg transition"
                    title="Limpiar campos"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </>
            )}

            {/* Modo Inverso: Cuánto quiero que reciban */}
            {inverseMode && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: '#000000' }}>
                    Cantidad que quiero que reciban ({toCountryData?.currency})
                  </label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => {
                      setTargetAmount(parseFloat(e.target.value) || 0);
                      setShowResult(false);
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-semibold"
                    placeholder="5000"
                    min="0"
                    step="0.01"
                    style={{ color: '#000000' }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleInverseCalculate}
                    disabled={loading || !realRates}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CalcIcon size={20} />
                    Calcular Cuánto Enviar
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-lg transition"
                    title="Limpiar campos"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
              </>
            )}

            {/* Resultado */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-green-500"
              >
                <div className="text-center">
                  <p className="text-lg mb-2 font-semibold" style={{ color: '#000000' }}>
                    {inverseMode ? 'Debes enviar:' : 'Recibirás aproximadamente:'}
                  </p>

                  {!inverseMode && (
                    <>
                      <p className="text-5xl font-bold text-green-600 mb-2" style={{ color: '#000000' }}>
                        {toCountryData?.currencySymbol} {result.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {toCountryData?.currency}
                      </p>
                      <p className="text-sm mt-4" style={{ color: '#000000' }}>
                        Envías: {fromCountryData?.currencySymbol} {amount.toFixed(2)} {fromCountryData?.currency}
                      </p>
                    </>
                  )}

                  {inverseMode && (
                    <>
                      <p className="text-5xl font-bold text-blue-600 mb-2" style={{ color: '#000000' }}>
                        {fromCountryData?.currencySymbol} {amount.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {fromCountryData?.currency}
                      </p>
                      <p className="text-sm mt-4" style={{ color: '#000000' }}>
                        Para que reciban: {toCountryData?.currencySymbol} {targetAmount.toFixed(2)} {toCountryData?.currency}
                      </p>
                    </>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold mb-2" style={{ color: '#000000' }}>
                      ⚡ Tasa de Cambio Aplicada
                    </p>
                    <p className="text-sm" style={{ color: '#000000' }}>
                      {fromCountryData?.flag} 1 {fromCountryData?.currency} =
                      {toCountryData?.flag} {(getRateForCountry(toCountry) / getRateForCountry(fromCountry)).toFixed(4)} {toCountryData?.currency}
                    </p>
                    <p className="text-xs mt-2 italic" style={{ color: '#000000' }}>
                      ⚠️ Esta es la tasa base. Las comisiones de cada proveedor se aplican por separado.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Info adicional */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: '#000000' }}>
              📊 Tasas obtenidas de fuentes oficiales • 🔄 Actualización automática cada 2 minutos
            </p>
            <p className="text-xs mt-2" style={{ color: '#000000' }}>
              💡 Usa el comparador debajo para encontrar el mejor proveedor con la menor comisión
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
