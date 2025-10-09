"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExchangeAPIClient } from "@/lib/api-client";

interface RateCard {
  title: string;
  icon: string;
  rate: number;
  description: string;
  color: string;
}

export default function LiveRates() {
  const [rates, setRates] = useState<RateCard[]>([
    { title: "Tasa BCV", icon: "🏛️", rate: 38.45, description: "Tasa oficial Venezuela", color: "text-blue-600" },
    { title: "Paralelo", icon: "💵", rate: 52.80, description: "Mercado paralelo", color: "text-green-600" },
    { title: "Binance P2P", icon: "₿", rate: 51.25, description: "Tasa crypto", color: "text-purple-600" },
  ]);

  useEffect(() => {
    const updateRates = async () => {
      const bcvRate = await ExchangeAPIClient.getBCVRate();
      const paraleloRate = await ExchangeAPIClient.getParaleloRate();
      const binanceRate = await ExchangeAPIClient.getBinanceP2PRate("VES");

      setRates([
        { title: "Tasa BCV", icon: "🏛️", rate: bcvRate, description: "Tasa oficial Venezuela", color: "text-blue-600" },
        { title: "Paralelo", icon: "💵", rate: paraleloRate, description: "Mercado paralelo", color: "text-green-600" },
        { title: "Binance P2P", icon: "₿", rate: binanceRate, description: "Tasa crypto", color: "text-purple-600" },
      ]);
    };

    updateRates();
    const interval = setInterval(updateRates, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <span className="text-sm text-green-600 font-semibold">EN VIVO</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{rate.title}</h3>
          <p className={`text-3xl font-bold ${rate.color}`}>
            {rate.rate.toFixed(2)} Bs
          </p>
          <p className="text-sm text-gray-500 mt-2">{rate.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
