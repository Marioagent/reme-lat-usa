"use client";

import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";

export default function HeroNew() {
  // Agrupar países por región
  const centralAmerica = COUNTRIES.filter(c => c.region === 'central-america');
  const southAmerica = COUNTRIES.filter(c => c.region === 'south-america');
  const caribbean = COUNTRIES.filter(c => c.region === 'caribbean');

  return (
    <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Título Principal */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{ color: '#000000' }}
        >
          REME-LAT-USA
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: '#000000' }}
        >
          Compara Remesas LAT ↔ USA
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl mb-4 max-w-4xl mx-auto font-medium"
          style={{ color: '#000000' }}
        >
          La mejor plataforma para comparar opciones de cambio de divisas y envío de remesas
          entre Estados Unidos y Latinoamérica
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg mb-8 max-w-3xl mx-auto"
          style={{ color: '#000000' }}
        >
          Comparamos TODAS las opciones disponibles en tiempo real para que ahorres en cada transacción
        </motion.p>

        {/* Cobertura Total */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
            🌎 Cobertura Total: {COUNTRIES.length - 1} Países Latinoamericanos
          </p>
        </motion.div>

        {/* Banderas por Región */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-6 mb-12"
        >
          {/* América Central */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
            <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
              📍 América Central
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {centralAmerica.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  title={`${country.name} (${country.currency})`}
                >
                  <span className="text-4xl mb-1">{country.flag}</span>
                  <span className="text-xs font-semibold" style={{ color: '#000000' }}>
                    {country.name}
                  </span>
                  <span className="text-xs" style={{ color: '#000000' }}>
                    {country.currency}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* América del Sur */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
            <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
              📍 América del Sur
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {southAmerica.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + index * 0.05 }}
                  className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                  title={`${country.name} (${country.currency})`}
                >
                  <span className="text-4xl mb-1">{country.flag}</span>
                  <span className="text-xs font-semibold" style={{ color: '#000000' }}>
                    {country.name}
                  </span>
                  <span className="text-xs" style={{ color: '#000000' }}>
                    {country.currency}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Caribe */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
            <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
              📍 Caribe
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {caribbean.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.05 }}
                  className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                  title={`${country.name} (${country.currency})`}
                >
                  <span className="text-4xl mb-1">{country.flag}</span>
                  <span className="text-xs font-semibold" style={{ color: '#000000' }}>
                    {country.name}
                  </span>
                  <span className="text-xs" style={{ color: '#000000' }}>
                    {country.currency}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Dirección Bidireccional */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-4 text-6xl mb-8"
        >
          <span>🌎</span>
          <span>⇄</span>
          <span>🇺🇸</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-lg font-semibold"
          style={{ color: '#000000' }}
        >
          Envía y recibe dinero en ambas direcciones con las mejores tasas
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <a
            href="#calculadora"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            🧮 Calcular Ahora
          </a>
          <a
            href="#comparador"
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            🏆 Comparar Servicios
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>
              {COUNTRIES.length - 1}
            </p>
            <p className="text-sm font-semibold" style={{ color: '#000000' }}>
              Países Cubiertos
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>
              25+
            </p>
            <p className="text-sm font-semibold" style={{ color: '#000000' }}>
              Proveedores Comparados
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-4xl font-bold mb-2" style={{ color: '#000000' }}>
              Real-Time
            </p>
            <p className="text-sm font-semibold" style={{ color: '#000000' }}>
              Tasas Actualizadas
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
