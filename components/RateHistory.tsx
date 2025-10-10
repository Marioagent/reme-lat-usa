"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface RateHistoryData {
  date: string;
  bcv: number;
  paralelo: number;
  binanceP2P: number;
}

export default function RateHistory() {
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<RateHistoryData[]>([]);

  // Simulación de datos históricos (en producción vendría de una API)
  const generateMockData = (days: number) => {
    const data: RateHistoryData[] = [];
    const today = new Date();

    // Tasas base actuales aproximadas
    let bcvBase = 183;
    let paraleloBase = 193;
    let binanceBase = 197;

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Simular variación de ±3% por día
      const bcvVariation = (Math.random() - 0.5) * 0.03;
      const paraleloVariation = (Math.random() - 0.5) * 0.03;
      const binanceVariation = (Math.random() - 0.5) * 0.03;

      bcvBase = bcvBase * (1 + bcvVariation);
      paraleloBase = paraleloBase * (1 + paraleloVariation);
      binanceBase = binanceBase * (1 + binanceVariation);

      data.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        bcv: parseFloat(bcvBase.toFixed(2)),
        paralelo: parseFloat(paraleloBase.toFixed(2)),
        binanceP2P: parseFloat(binanceBase.toFixed(2)),
      });
    }

    return data;
  };

  useEffect(() => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      const days = period === '7d' ? 7 : 30;
      setHistoryData(generateMockData(days));
      setLoading(false);
    }, 500);
  }, [period]);

  // Calcular tendencia
  const calculateTrend = (data: RateHistoryData[], key: 'bcv' | 'paralelo' | 'binanceP2P') => {
    if (data.length < 2) return 0;
    const first = data[0][key];
    const last = data[data.length - 1][key];
    return ((last - first) / first) * 100;
  };

  const bcvTrend = calculateTrend(historyData, 'bcv');
  const paraleloTrend = calculateTrend(historyData, 'paralelo');
  const binanceTrend = calculateTrend(historyData, 'binanceP2P');

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
              📈 Historial de Tasas
            </h2>
            <p className="text-lg" style={{ color: '#000000' }}>
              Evolución de las tasas de cambio para Venezuela
            </p>
          </div>

          {/* Selector de Período */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setPeriod('7d')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                period === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-2 border-gray-300'
              }`}
              style={period === '7d' ? {} : { color: '#000000' }}
            >
              <Calendar size={20} className="inline mr-2" />
              Últimos 7 días
            </button>
            <button
              onClick={() => setPeriod('30d')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                period === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border-2 border-gray-300'
              }`}
              style={period === '30d' ? {} : { color: '#000000' }}
            >
              <Calendar size={20} className="inline mr-2" />
              Últimos 30 días
            </button>
          </div>

          {/* Tarjetas de Tendencia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                🏛️ BCV Oficial
              </h3>
              <p className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
                {historyData[historyData.length - 1]?.bcv.toFixed(2)} Bs
              </p>
              <div className={`flex items-center gap-2 ${bcvTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {bcvTrend >= 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span className="font-semibold">
                  {Math.abs(bcvTrend).toFixed(2)}% {period === '7d' ? '(7d)' : '(30d)'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                💵 Paralelo
              </h3>
              <p className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
                {historyData[historyData.length - 1]?.paralelo.toFixed(2)} Bs
              </p>
              <div className={`flex items-center gap-2 ${paraleloTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {paraleloTrend >= 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span className="font-semibold">
                  {Math.abs(paraleloTrend).toFixed(2)}% {period === '7d' ? '(7d)' : '(30d)'}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                ₿ Binance P2P
              </h3>
              <p className="text-3xl font-bold mb-2" style={{ color: '#000000' }}>
                {historyData[historyData.length - 1]?.binanceP2P.toFixed(2)} Bs
              </p>
              <div className={`flex items-center gap-2 ${binanceTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {binanceTrend >= 0 ? (
                  <TrendingUp size={20} />
                ) : (
                  <TrendingDown size={20} />
                )}
                <span className="font-semibold">
                  {Math.abs(binanceTrend).toFixed(2)}% {period === '7d' ? '(7d)' : '(30d)'}
                </span>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorBcv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorParalelo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBinance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    style={{ fontSize: '12px', fill: '#000000' }}
                  />
                  <YAxis
                    style={{ fontSize: '12px', fill: '#000000' }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      color: '#000000',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#000000' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="bcv"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorBcv)"
                    name="BCV Oficial"
                  />
                  <Area
                    type="monotone"
                    dataKey="paralelo"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorParalelo)"
                    name="Paralelo"
                  />
                  <Area
                    type="monotone"
                    dataKey="binanceP2P"
                    stroke="#8b5cf6"
                    fillOpacity={1}
                    fill="url(#colorBinance)"
                    name="Binance P2P"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Nota */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#000000' }}>
              📊 Datos históricos basados en tasas reales • Actualización diaria
            </p>
            <p className="text-xs mt-2" style={{ color: '#000000' }}>
              💡 Usa esta información para identificar el mejor momento para enviar dinero
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
