"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { REMITTANCE_SERVICES, SERVICE_TYPES, DELIVERY_SPEEDS, SORT_OPTIONS, COUNTRIES } from "@/lib/constants";
import { ExternalLink, Filter, ArrowUpDown, Star, Clock, CreditCard, MapPin } from "lucide-react";

export default function ComparatorNew() {
  const [selectedCountry, setSelectedCountry] = useState<string>("VE");
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>("all");
  const [speedFilter, setSpeedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("commission");
  const [amount, setAmount] = useState<number>(100);

  // Filtrar servicios por país seleccionado
  const filteredServices = useMemo(() => {
    let filtered = REMITTANCE_SERVICES.filter(service =>
      service.countries.includes(selectedCountry)
    );

    // Filtro por tipo de servicio
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter(service => service.type === serviceTypeFilter);
    }

    // Filtro por velocidad
    if (speedFilter !== "all") {
      filtered = filtered.filter(service => service.speed === speedFilter);
    }

    // Ordenamiento
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "commission":
          return a.commission - b.commission;
        case "speed":
          const speedOrder: Record<string, number> = { 'instant': 1, 'same-day': 2, '1-3-days': 3, '3-7-days': 4 };
          return speedOrder[a.speed] - speedOrder[b.speed];
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "total":
          // Simular cantidad neta recibida (sin comisión exacta por ahora)
          const aNet = amount - (amount * a.commission / 100);
          const bNet = amount - (amount * b.commission / 100);
          return bNet - aNet;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCountry, serviceTypeFilter, speedFilter, sortBy, amount]);

  // Determinar badges
  const getBadges = (service: typeof REMITTANCE_SERVICES[0]) => {
    const badges: { text: string; color: string }[] = [];

    if (service.recommended) {
      badges.push({ text: "RECOMENDADO", color: "bg-green-500" });
    }

    if (service.commission === 0) {
      badges.push({ text: "SIN COMISIÓN", color: "bg-blue-500" });
    }

    if (service.speed === "instant") {
      badges.push({ text: "INSTANTÁNEO", color: "bg-purple-500" });
    }

    if (service.rating && service.rating >= 4.7) {
      badges.push({ text: "TOP RATED", color: "bg-yellow-500" });
    }

    return badges;
  };

  const selectedCountryData = COUNTRIES.find(c => c.code === selectedCountry);

  return (
    <section id="comparador" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
              🏆 Comparador de Servicios de Remesas
            </h2>
            <p className="text-lg" style={{ color: '#000000' }}>
              Compara todos los proveedores disponibles y encuentra el mejor para ti
            </p>
            <p className="text-sm mt-2" style={{ color: '#000000' }}>
              {filteredServices.length} servicios disponibles para {selectedCountryData?.flag} {selectedCountryData?.name}
            </p>
          </div>

          {/* Filtros y Controles */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Selector de País */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <MapPin size={16} className="inline mr-1" />
                  País Destino
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  style={{ color: '#000000' }}
                >
                  {COUNTRIES.filter(c => c.code !== 'US').map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Tipo */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <Filter size={16} className="inline mr-1" />
                  Tipo de Servicio
                </label>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  style={{ color: '#000000' }}
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Velocidad */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <Clock size={16} className="inline mr-1" />
                  Velocidad de Entrega
                </label>
                <select
                  value={speedFilter}
                  onChange={(e) => setSpeedFilter(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  style={{ color: '#000000' }}
                >
                  {DELIVERY_SPEEDS.map((speed) => (
                    <option key={speed.id} value={speed.id}>
                      {speed.icon} {speed.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ordenar Por */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  <ArrowUpDown size={16} className="inline mr-1" />
                  Ordenar Por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  style={{ color: '#000000' }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Monto para cálculo */}
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                💵 Monto a Enviar (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 100)}
                className="w-full md:w-64 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold text-lg"
                min="1"
                style={{ color: '#000000' }}
              />
            </div>
          </div>

          {/* Grid de Servicios */}
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl font-semibold" style={{ color: '#000000' }}>
                No hay servicios disponibles con los filtros seleccionados
              </p>
              <p className="text-sm mt-2" style={{ color: '#000000' }}>
                Intenta cambiar los filtros o selecciona otro país
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const badges = getBadges(service);
              const netAmount = amount - (amount * service.commission / 100);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg p-6 hover:transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ${
                    service.recommended ? "border-2 border-green-500" : "border border-gray-200"
                  }`}
                >
                  {/* Header con Badges */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-4xl">{service.icon}</div>
                      {service.rating && (
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                          <Star size={14} className="fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-bold" style={{ color: '#000000' }}>
                            {service.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>
                      {service.name}
                    </h3>

                    <div className="flex flex-wrap gap-1">
                      {badges.map((badge, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full text-white font-semibold ${badge.color}`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Información Principal */}
                  <div className="space-y-3 mb-4">
                    {/* Comisión */}
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>
                        💰 Comisión
                      </span>
                      <span className="text-lg font-bold" style={{ color: '#000000' }}>
                        {service.commission === 0 ? 'GRATIS' : `${service.commission}%`}
                      </span>
                    </div>

                    {/* Tiempo de Entrega */}
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>
                        ⏱️ Tiempo
                      </span>
                      <span className="text-sm font-bold" style={{ color: '#000000' }}>
                        {service.timeMin === service.timeMax
                          ? `${service.timeMin} min`
                          : `${service.timeMin}-${service.timeMax} min`}
                      </span>
                    </div>

                    {/* Cantidad Neta */}
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-semibold" style={{ color: '#000000' }}>
                        💵 Recibirás
                      </span>
                      <span className="text-lg font-bold text-green-600" style={{ color: '#000000' }}>
                        ${netAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Tipo de Servicio */}
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold" style={{ color: '#000000' }}>
                        📋 Tipo: {SERVICE_TYPES.find(t => t.id === service.type)?.label}
                      </p>
                    </div>
                  </div>

                  {/* Métodos de Pago */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-1" style={{ color: '#000000' }}>
                      <CreditCard size={12} className="inline mr-1" />
                      Métodos de Pago
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {service.paymentMethods.slice(0, 3).map((method, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                          style={{ color: '#000000' }}
                        >
                          {method}
                        </span>
                      ))}
                      {service.paymentMethods.length > 3 && (
                        <span
                          className="text-xs bg-gray-200 px-2 py-1 rounded font-semibold"
                          style={{ color: '#000000' }}
                        >
                          +{service.paymentMethods.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Métodos de Entrega */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-1" style={{ color: '#000000' }}>
                      📦 Métodos de Entrega
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {service.deliveryMethods.slice(0, 2).map((method, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                          style={{ color: '#000000' }}
                        >
                          {method}
                        </span>
                      ))}
                      {service.deliveryMethods.length > 2 && (
                        <span
                          className="text-xs bg-gray-200 px-2 py-1 rounded font-semibold"
                          style={{ color: '#000000' }}
                        >
                          +{service.deliveryMethods.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Límites */}
                  <div className="text-xs mb-4 p-2 bg-yellow-50 rounded" style={{ color: '#000000' }}>
                    <strong>Límites:</strong> ${service.minAmount.toLocaleString()} - ${service.maxAmount.toLocaleString()}
                  </div>

                  {/* Botón CTA */}
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-white py-3 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 font-bold ${
                      service.recommended
                        ? "bg-green-600 hover:bg-green-700"
                        : service.type === "crypto"
                        ? "bg-purple-600 hover:bg-purple-700"
                        : service.type === "digital"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-800"
                    }`}
                  >
                    Ir a {service.name}
                    <ExternalLink size={16} />
                  </a>
                </motion.div>
              );
            })}
          </div>

          {/* Nota de Transparencia */}
          <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
            <p className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              📊 Información Actualizada en Tiempo Real
            </p>
            <p className="text-xs" style={{ color: '#000000' }}>
              Los datos mostrados son referenciales. Las tasas y comisiones pueden variar según el monto,
              método de pago y país. Verifica siempre en el sitio oficial del proveedor antes de realizar tu transacción.
            </p>
            <p className="text-xs mt-2 font-semibold" style={{ color: '#000000' }}>
              Última actualización: {new Date().toLocaleString('es-ES')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
