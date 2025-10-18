"use client";

import { Info } from "lucide-react";
import { motion } from "framer-motion";

export default function InfoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 border-b border-blue-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2 text-sm text-blue-800">
          <Info size={16} className="flex-shrink-0" />
          <p className="text-center">
            <strong>Plataforma 100% Informativa</strong> - Esta PWA proporciona información y comparación de tasas de cambio.{" "}
            <span className="font-semibold">NO realizamos transacciones ni procesamos pagos</span>.
            Consulta siempre con las instituciones financieras oficiales.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
