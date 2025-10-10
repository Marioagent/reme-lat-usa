"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { REMITTANCE_SERVICES } from "@/lib/constants";
import { TrendingUp, DollarSign, Calendar, Award } from "lucide-react";

export default function RecurringRemittanceComparator() {
  const [amount, setAmount] = useState<number>(100);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');
  const [duration, setDuration] = useState<number>(12); // months

  // Calcular número de envíos
  const numberOfSends = useMemo(() => {
    const weeksInMonth = 4.33;
    switch (frequency) {
      case 'weekly':
        return duration * weeksInMonth;
      case 'biweekly':
        return duration * (weeksInMonth / 2);
      case 'monthly':
        return duration;
      default:
        return duration;
    }
  }, [frequency, duration]);

  // Calcular costos totales por proveedor
  const providerCosts = useMemo(() => {
    return REMITTANCE_SERVICES.map(service => {
      const commissionPerSend = (amount * service.commission) / 100;
      const totalCommissions = commissionPerSend * numberOfSends;
      const totalSent = amount * numberOfSends;
      const totalReceived = totalSent - totalCommissions;

      return {
        ...service,
        commissionPerSend,
        totalCommissions,
        totalSent,
        totalReceived,
        savingsVsBest: 0, // Se calcula después
      };
    }).sort((a, b) => a.totalCommissions - b.totalCommissions);
  }, [amount, numberOfSends]);

  // Calcular ahorro vs el mejor
  const costsWithSavings = useMemo(() => {
    const bestCost = providerCosts[0].totalCommissions;
    return providerCosts.map(provider => ({
      ...provider,
      savingsVsBest: provider.totalCommissions - bestCost,
    }));
  }, [providerCosts]);

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'weekly':
        return 'Semanal';
      case 'biweekly':
        return 'Quincenal';
      case 'monthly':
        return 'Mensual';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
              💰 Comparador de Costos Acumulados
            </h2>
            <p className="text-lg" style={{ color: '#000000' }}>
              Calcula cuánto ahorrarás enviando dinero de forma recurrente
            </p>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
              Configura tu Envío Recurrente
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monto por Envío */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <DollarSign size={18} className="inline mr-1" />
                  Monto por Envío (USD)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 100)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl font-semibold"
                  style={{ color: '#000000' }}
                  min="1"
                />
              </div>

              {/* Frecuencia */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <Calendar size={18} className="inline mr-1" />
                  Frecuencia
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                  style={{ color: '#000000' }}
                >
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>

              {/* Duración */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <TrendingUp size={18} className="inline mr-1" />
                  Duración (meses)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 12)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl font-semibold"
                  style={{ color: '#000000' }}
                  min="1"
                  max="60"
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                📊 Resumen: Enviarás <strong>${amount}</strong> {getFrequencyLabel().toLowerCase()} durante{' '}
                <strong>{duration} meses</strong> = <strong>{Math.round(numberOfSends)} envíos</strong> totales
              </p>
              <p className="text-sm mt-2" style={{ color: '#000000' }}>
                Total a enviar: <strong>${(amount * numberOfSends).toLocaleString('es-ES', { minimumFractionDigits: 2 })} USD</strong>
              </p>
            </div>
          </div>

          {/* Comparación de Proveedores */}
          <div>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
              📈 Comparación de Costos Totales
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {costsWithSavings.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg p-6 ${
                    index === 0 ? 'border-4 border-green-500' : 'border-2 border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Proveedor */}
                    <div className="md:col-span-1">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{provider.icon}</span>
                        <div>
                          <h4 className="font-bold text-lg" style={{ color: '#000000' }}>
                            {provider.name}
                          </h4>
                          {index === 0 && (
                            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold mt-1">
                              <Award size={12} />
                              MÁS BARATO
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Comisión por Envío */}
                    <div className="text-center">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#000000' }}>
                        Por Envío
                      </p>
                      <p className="text-lg font-bold" style={{ color: '#000000' }}>
                        ${provider.commissionPerSend.toFixed(2)}
                      </p>
                      <p className="text-xs" style={{ color: '#000000' }}>
                        ({provider.commission}%)
                      </p>
                    </div>

                    {/* Comisiones Totales */}
                    <div className="text-center">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#000000' }}>
                        Comisiones Totales
                      </p>
                      <p className="text-2xl font-bold text-red-600" style={{ color: index === 0 ? '#10b981' : '#ef4444' }}>
                        ${provider.totalCommissions.toFixed(2)}
                      </p>
                    </div>

                    {/* Total a Recibir */}
                    <div className="text-center">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#000000' }}>
                        Total a Recibir
                      </p>
                      <p className="text-2xl font-bold text-green-600" style={{ color: '#10b981' }}>
                        ${provider.totalReceived.toFixed(2)}
                      </p>
                    </div>

                    {/* Ahorro/Costo Extra */}
                    <div className="text-center">
                      {index === 0 ? (
                        <div className="bg-green-100 rounded-lg p-3">
                          <p className="text-xs font-semibold text-green-700">
                            ✅ MEJOR OPCIÓN
                          </p>
                          <p className="text-lg font-bold text-green-700">
                            $0.00
                          </p>
                        </div>
                      ) : (
                        <div className="bg-red-100 rounded-lg p-3">
                          <p className="text-xs font-semibold text-red-700">
                            Costo Extra
                          </p>
                          <p className="text-lg font-bold text-red-700">
                            +${provider.savingsVsBest.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold mb-2" style={{ color: '#000000' }}>
                💡 Mejor Opción
              </h4>
              <p className="text-2xl font-bold text-green-600 mb-2" style={{ color: '#10b981' }}>
                {costsWithSavings[0].name}
              </p>
              <p className="text-sm" style={{ color: '#000000' }}>
                Ahorra hasta ${costsWithSavings[costsWithSavings.length - 1].savingsVsBest.toFixed(2)} vs la opción más cara
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold mb-2" style={{ color: '#000000' }}>
                📊 Promedio de Comisión
              </h4>
              <p className="text-2xl font-bold mb-2" style={{ color: '#000000' }}>
                {(costsWithSavings.reduce((acc, p) => acc + p.commission, 0) / costsWithSavings.length).toFixed(2)}%
              </p>
              <p className="text-sm" style={{ color: '#000000' }}>
                Por envío en todos los proveedores
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="font-bold mb-2" style={{ color: '#000000' }}>
                💰 Ahorro Potencial
              </h4>
              <p className="text-2xl font-bold text-green-600 mb-2" style={{ color: '#10b981' }}>
                ${(costsWithSavings[costsWithSavings.length - 1].totalCommissions - costsWithSavings[0].totalCommissions).toFixed(2)}
              </p>
              <p className="text-sm" style={{ color: '#000000' }}>
                Eligiendo el mejor proveedor
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-2">
              ¿Envías dinero regularmente?
            </h3>
            <p className="mb-4">
              Elige el proveedor correcto y ahorra cientos de dólares al año
            </p>
            <a
              href="#comparador"
              className="inline-block px-8 py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Ver Todos los Proveedores
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
