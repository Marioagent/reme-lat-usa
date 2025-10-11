"use client";

import { motion } from "framer-motion";
import { REMITTANCE_SERVICES } from "@/lib/constants";
import { ExternalLink } from "lucide-react";
import { getAffiliateLink, trackAffiliateClick } from "@/lib/affiliates";
import { trackAffiliateClick as trackGA } from "@/lib/analytics";

export default function Comparator() {
  const handleAffiliateClick = (serviceId: string) => {
    trackAffiliateClick(serviceId);
    trackGA(serviceId);

    // Abrir en nueva pestaña
    const link = getAffiliateLink(serviceId);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="comparador" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            🏆 Comparador de Servicios
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REMITTANCE_SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
                  service.recommended ? "border-2 border-green-500" : ""
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{service.icon}</div>
                  <h3 className="text-xl font-bold" style={{ color: '#000000' }}>{service.name}</h3>
                  {service.recommended && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full inline-block mt-1">
                      RECOMENDADO
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm mb-4" style={{ color: '#000000' }}>
                  <p>
                    <span className="font-semibold">Comisión:</span> {service.commission}%
                  </p>
                  <p>
                    <span className="font-semibold">Tiempo:</span> {service.timeMin}-{service.timeMax} min
                  </p>
                  <p>
                    <span className="font-semibold">Tasa:</span> {service.rate} Bs/$
                  </p>
                </div>
                <button
                  onClick={() => handleAffiliateClick(service.id)}
                  className={`w-full text-white py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 ${
                    service.recommended
                      ? "bg-green-600"
                      : service.id === "binance"
                      ? "bg-yellow-500"
                      : service.id === "reserve"
                      ? "bg-blue-600"
                      : "bg-purple-600"
                  }`}
                >
                  Ir a {service.name}
                  <ExternalLink size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
