"use client";

import { motion } from "framer-motion";
import { COUNTRIES } from "@/lib/constants";

export default function Hero() {
  return (
    <section id="inicio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          Compara Remesas LAT-USA
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          La mejor tasa para enviar dinero a 13 países de Latinoamérica.
          Comparamos en tiempo real para que ahorres en cada transacción.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {COUNTRIES.map((country, index) => (
            <motion.span
              key={country.code}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-3xl"
            >
              {country.flag}
            </motion.span>
          ))}
          <span className="text-3xl">→</span>
          <span className="text-3xl">🇺🇸</span>
        </div>
      </motion.div>
    </section>
  );
}
