"use client";

import { motion } from "framer-motion";
import { Zap, Shield, DollarSign } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Super Rápido",
    description: "Comparación en tiempo real en menos de 3 segundos",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "No procesamos pagos, solo comparamos y redirigimos",
  },
  {
    icon: DollarSign,
    title: "Ahorra Dinero",
    description: "Encuentra la mejor tasa y ahorra hasta 5% por envío",
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12" style={{ color: '#000000' }}>
          ¿Por qué REME-LAT-USA?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                    <Icon size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#000000' }}>
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
