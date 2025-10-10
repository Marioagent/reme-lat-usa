"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Smartphone, Check, X } from "lucide-react";
import { COUNTRIES } from "@/lib/constants";

interface Alert {
  id: string;
  country: string;
  targetRate: number;
  notifyMethod: 'email' | 'sms' | 'both';
  email?: string;
  phone?: string;
  active: boolean;
}

export default function RateAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    country: 'VE',
    targetRate: 200,
    notifyMethod: 'email',
    active: true,
  });

  const handleCreateAlert = () => {
    if (!newAlert.country || !newAlert.targetRate) return;

    const alert: Alert = {
      id: Date.now().toString(),
      country: newAlert.country,
      targetRate: newAlert.targetRate,
      notifyMethod: newAlert.notifyMethod || 'email',
      email: newAlert.email,
      phone: newAlert.phone,
      active: true,
    };

    setAlerts([...alerts, alert]);
    setShowForm(false);
    setNewAlert({
      country: 'VE',
      targetRate: 200,
      notifyMethod: 'email',
      active: true,
    });

    // En producción, esto iría a una API
    // await fetch('/api/alerts', { method: 'POST', body: JSON.stringify(alert) });
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getCountryName = (code: string) => {
    return COUNTRIES.find(c => c.code === code)?.name || code;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
              🔔 Alertas de Tasa Favorable
            </h2>
            <p className="text-lg" style={{ color: '#000000' }}>
              Te notificamos cuando la tasa llegue a tu objetivo
            </p>
          </div>

          {/* Botón para crear nueva alerta */}
          {!showForm && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg"
              >
                <Bell size={24} className="inline mr-2" />
                Crear Nueva Alerta
              </button>
            </div>
          )}

          {/* Formulario de nueva alerta */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-xl p-8 mb-8"
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
                Nueva Alerta
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* País */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                    País
                  </label>
                  <select
                    value={newAlert.country}
                    onChange={(e) => setNewAlert({ ...newAlert, country: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                    style={{ color: '#000000' }}
                  >
                    {COUNTRIES.filter(c => c.code !== 'US').map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tasa Objetivo */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                    Tasa Objetivo (Bs/$)
                  </label>
                  <input
                    type="number"
                    value={newAlert.targetRate}
                    onChange={(e) => setNewAlert({ ...newAlert, targetRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-semibold"
                    style={{ color: '#000000' }}
                    step="0.01"
                  />
                </div>
              </div>

              {/* Método de Notificación */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                  Notificarme por
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setNewAlert({ ...newAlert, notifyMethod: 'email' })}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                      newAlert.notifyMethod === 'email'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-gray-300'
                    }`}
                    style={newAlert.notifyMethod === 'email' ? {} : { color: '#000000' }}
                  >
                    <Mail size={20} className="inline mr-2" />
                    Email
                  </button>
                  <button
                    onClick={() => setNewAlert({ ...newAlert, notifyMethod: 'sms' })}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                      newAlert.notifyMethod === 'sms'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-gray-300'
                    }`}
                    style={newAlert.notifyMethod === 'sms' ? {} : { color: '#000000' }}
                  >
                    <Smartphone size={20} className="inline mr-2" />
                    SMS
                  </button>
                  <button
                    onClick={() => setNewAlert({ ...newAlert, notifyMethod: 'both' })}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                      newAlert.notifyMethod === 'both'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-gray-300'
                    }`}
                    style={newAlert.notifyMethod === 'both' ? {} : { color: '#000000' }}
                  >
                    Ambos
                  </button>
                </div>
              </div>

              {/* Email o Teléfono */}
              {(newAlert.notifyMethod === 'email' || newAlert.notifyMethod === 'both') && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={newAlert.email || ''}
                    onChange={(e) => setNewAlert({ ...newAlert, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                    style={{ color: '#000000' }}
                    placeholder="tu@email.com"
                  />
                </div>
              )}

              {(newAlert.notifyMethod === 'sms' || newAlert.notifyMethod === 'both') && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#000000' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={newAlert.phone || ''}
                    onChange={(e) => setNewAlert({ ...newAlert, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                    style={{ color: '#000000' }}
                    placeholder="+1234567890"
                  />
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  onClick={handleCreateAlert}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  <Check size={20} className="inline mr-2" />
                  Crear Alerta
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                  style={{ color: '#000000' }}
                >
                  <X size={20} className="inline mr-2" />
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}

          {/* Lista de Alertas Activas */}
          {alerts.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#000000' }}>
                Mis Alertas ({alerts.length})
              </h3>

              <div className="space-y-4">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-white rounded-xl shadow-lg p-6 ${
                      alert.active ? 'border-2 border-green-500' : 'border-2 border-gray-300 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="text-xl font-bold" style={{ color: '#000000' }}>
                            {getCountryName(alert.country)}
                          </h4>
                          {alert.active && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              Activa
                            </span>
                          )}
                        </div>
                        <p className="text-lg" style={{ color: '#000000' }}>
                          Te notificaremos cuando la tasa llegue a <strong>{alert.targetRate.toFixed(2)} Bs/$</strong>
                        </p>
                        <p className="text-sm mt-2" style={{ color: '#000000' }}>
                          Notificación: {alert.notifyMethod === 'email' && '📧 Email'}
                          {alert.notifyMethod === 'sms' && '📱 SMS'}
                          {alert.notifyMethod === 'both' && '📧 Email + 📱 SMS'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            alert.active ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'
                          }`}
                        >
                          {alert.active ? 'Pausar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje si no hay alertas */}
          {alerts.length === 0 && !showForm && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Bell size={64} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>
                No tienes alertas configuradas
              </p>
              <p style={{ color: '#000000' }}>
                Crea una alerta y te notificaremos cuando la tasa sea favorable
              </p>
            </div>
          )}

          {/* Nota */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm font-semibold mb-2" style={{ color: '#000000' }}>
              💡 ¿Cómo funcionan las alertas?
            </p>
            <ul className="text-sm space-y-1" style={{ color: '#000000' }}>
              <li>✅ Monitoreamos las tasas cada 5 minutos</li>
              <li>✅ Te notificamos instantáneamente cuando se alcanza tu objetivo</li>
              <li>✅ Puedes tener múltiples alertas activas</li>
              <li>✅ Puedes pausar o eliminar alertas en cualquier momento</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
