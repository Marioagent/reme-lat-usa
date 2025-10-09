"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "@/lib/supabase";
import {
  LogOut,
  TrendingUp,
  Bell,
  History,
  Plus,
  Trash2,
  DollarSign,
} from "lucide-react";
import { COUNTRIES } from "@/lib/constants";
import Link from "next/link";
import ReferralSection from "./ReferralSection";

interface RemittanceHistoryItem {
  id: string;
  amount: number;
  country_code: string;
  rate: number;
  service: string;
  created_at: string;
  total_received: number;
  to_currency: string;
}

interface RateAlert {
  id: string;
  country_code: string;
  target_rate: number;
  condition: string;
  active: boolean;
  currency: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<RemittanceHistoryItem[]>([]);
  const [alerts, setAlerts] = useState<RateAlert[]>([]);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    country_code: "VE",
    target_rate: 53,
    condition: "above",
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await auth.getUser();
    if (!currentUser) {
      router.push("/auth");
      return;
    }
    setUser(currentUser);
    loadData(currentUser.id);
  };

  const loadData = async (userId: string) => {
    setLoading(true);
    const { data: historyData } = await db.getRemittanceHistory(userId);
    const { data: alertsData } = await db.getRateAlerts(userId);

    if (historyData) setHistory(historyData);
    if (alertsData) setAlerts(alertsData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleCreateAlert = async () => {
    if (!user) return;

    const country = COUNTRIES.find((c) => c.code === newAlert.country_code);
    const alert = {
      ...newAlert,
      user_id: user.id,
      currency: country?.currency || "VES",
      active: true,
    };

    await db.addRateAlert(alert);
    setShowNewAlert(false);
    loadData(user.id);
  };

  const handleDeleteAlert = async (alertId: string) => {
    await db.deleteRateAlert(alertId);
    if (user) loadData(user.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">💧</span>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                REME LAT-USA
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={20} />
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Mi Dashboard
          </h1>

          {/* Referral Program */}
          {user && <ReferralSection userId={user.id} />}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Enviado</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${history.reduce((sum, h) => sum + h.amount, 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="text-blue-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Remesas</p>
                  <p className="text-3xl font-bold text-green-600">{history.length}</p>
                </div>
                <TrendingUp className="text-green-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Alertas Activas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {alerts.filter((a) => a.active).length}
                  </p>
                </div>
                <Bell className="text-purple-600" size={40} />
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Bell size={24} />
                Alertas de Tasas
              </h2>
              <button
                onClick={() => setShowNewAlert(!showNewAlert)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Nueva Alerta
              </button>
            </div>

            {showNewAlert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-blue-50 rounded-lg p-6 mb-6"
              >
                <h3 className="font-bold mb-4">Crear Nueva Alerta</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">País</label>
                    <select
                      value={newAlert.country_code}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, country_code: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {COUNTRIES.filter((c) => c.active).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tasa Objetivo</label>
                    <input
                      type="number"
                      value={newAlert.target_rate}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, target_rate: parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Condición</label>
                    <select
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="above">Por encima de</option>
                      <option value="below">Por debajo de</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCreateAlert}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Crear Alerta
                  </button>
                  <button
                    onClick={() => setShowNewAlert(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No tienes alertas configuradas. Crea una para recibir notificaciones.
                </p>
              ) : (
                alerts.map((alert) => {
                  const country = COUNTRIES.find((c) => c.code === alert.country_code);
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{country?.flag}</span>
                        <div>
                          <p className="font-semibold">{country?.name}</p>
                          <p className="text-sm text-gray-600">
                            Alerta cuando la tasa esté {alert.condition === "above" ? "por encima de" : "por debajo de"}{" "}
                            {alert.target_rate} {alert.currency}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <History size={24} />
              Historial de Remesas
            </h2>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No tienes historial de remesas aún</p>
                <Link
                  href="/#calculadora"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition"
                >
                  Calcular mi primera remesa
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Fecha</th>
                      <th className="text-left py-3 px-4">País</th>
                      <th className="text-right py-3 px-4">Enviado</th>
                      <th className="text-right py-3 px-4">Tasa</th>
                      <th className="text-right py-3 px-4">Recibido</th>
                      <th className="text-left py-3 px-4">Servicio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => {
                      const country = COUNTRIES.find((c) => c.code === item.country_code);
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {new Date(item.created_at).toLocaleDateString("es-ES")}
                          </td>
                          <td className="py-3 px-4">
                            {country?.flag} {country?.name}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right">{item.rate.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-semibold text-green-600">
                            {item.total_received.toFixed(2)} {item.to_currency}
                          </td>
                          <td className="py-3 px-4">{item.service}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
