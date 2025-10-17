"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Bell, Shield, Zap, Globe } from "lucide-react";
import { COUNTRIES } from "@/lib/constants";

// Tasas de cambio aproximadas para la calculadora (demo)
const EXCHANGE_RATES: Record<string, number> = {
  MX: 17.5, GT: 7.8, HN: 24.5, SV: 1, NI: 36.5, CR: 520, PA: 1,
  CO: 4200, VE: 53, EC: 1, PE: 3.7, BO: 6.9, CL: 950, AR: 1050,
  UY: 39, PY: 7300, BR: 5.2, DO: 58, CU: 25, PR: 1, HT: 150
};

export default function Home() {
  const [amount, setAmount] = useState(100);
  const [fromCountry, setFromCountry] = useState("US");
  const [toCountry, setToCountry] = useState("VE");

  const activeCountries = COUNTRIES.filter(c => c.active);
  const selectedCountry = COUNTRIES.find(c => c.code === toCountry);
  const exchangeRate = selectedCountry ? (EXCHANGE_RATES[selectedCountry.code] || 1) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-4xl">💧</span>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                REME LAT-USA PRO
              </span>
            </div>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg transition"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-black mb-4">
            Compara Remesas en Tiempo Real
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            25+ proveedores | 23 países LAT | Mejor tasa garantizada
          </p>
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-12 border-4 border-gray-200 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="text-blue-600" size={32} />
            <h2 className="text-3xl font-bold text-black">Calculadora de Remesas</h2>
          </div>

          <div className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-lg font-bold text-black mb-2">
                Monto a enviar
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-2xl font-bold text-gray-600">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-black border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                  min="1"
                />
              </div>
            </div>

            {/* From/To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold text-black mb-2">Desde</label>
                <select
                  value={fromCountry}
                  onChange={(e) => setFromCountry(e.target.value)}
                  className="w-full px-4 py-4 text-lg font-bold text-black border-4 border-gray-300 rounded-xl focus:border-blue-500"
                >
                  <option value="US">🇺🇸 Estados Unidos (USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-black mb-2">Hacia</label>
                <select
                  value={toCountry}
                  onChange={(e) => setToCountry(e.target.value)}
                  className="w-full px-4 py-4 text-lg font-bold text-black border-4 border-gray-300 rounded-xl focus:border-blue-500"
                >
                  {activeCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name} ({country.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result */}
            {selectedCountry && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-4 border-green-300"
              >
                <p className="text-lg font-bold text-black mb-2">Recibirán aproximadamente:</p>
                <p className="text-4xl font-black text-green-600">
                  {selectedCountry.flag} {(amount * exchangeRate).toLocaleString()} {selectedCountry.currency}
                </p>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Tasa estimada: 1 USD = {exchangeRate} {selectedCountry.currency}
                </p>
              </motion.div>
            )}

            <Link
              href="/dashboard"
              className="block w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 rounded-xl text-xl font-bold text-center hover:shadow-2xl transition"
            >
              Ver Mejores Proveedores
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200"
          >
            <TrendingUp className="text-blue-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-black mb-2">Tasas en Tiempo Real</h3>
            <p className="text-gray-700 font-medium">
              Comparamos tasas de cambio actualizadas cada minuto de 25+ proveedores
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200"
          >
            <Bell className="text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-black mb-2">Alertas Personalizadas</h3>
            <p className="text-gray-700 font-medium">
              Recibe notificaciones cuando la tasa alcance tu objetivo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200"
          >
            <Shield className="text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-bold text-black mb-2">Seguro y Confiable</h3>
            <p className="text-gray-700 font-medium">
              Todos los proveedores están verificados y regulados
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl shadow-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">¿Listo para ahorrar en tus remesas?</h2>
          <p className="text-xl mb-8">Crea tu cuenta gratis y accede a todas las funcionalidades premium</p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transition"
          >
            Crear Cuenta Gratis
          </Link>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-medium">
            © 2025 REME LAT-USA PRO - Comparador de Remesas #1
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Tasas actualizadas en tiempo real | 25+ proveedores | 23 países
          </p>
        </div>
      </footer>
    </div>
  );
}
