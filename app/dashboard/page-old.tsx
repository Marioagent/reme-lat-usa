"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Crown,
  CheckCircle,
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

interface Subscription {
  id: string;
  status: string;
  plan: string;
  expires_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<RemittanceHistoryItem[]>([]);
  const [alerts, setAlerts] = useState<RateAlert[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newAlert, setNewAlert] = useState({
    country_code: "VE",
    target_rate: 53,
    condition: "above",
  });

  useEffect(() => {
    checkUser();
    if (searchParams?.get("subscription") === "success") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

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
    const { data: subData } = await db.getUserSubscription(userId);

    if (historyData) setHistory(historyData);
    if (alertsData) setAlerts(alertsData);
    if (subData) setSubscription(subData);
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
        <div className="text-2xl font-bold text-black">Cargando...</div>
      </div>
    );
  }

  const getPlanName = (plan: string) => {
    const plans: Record<string, string> = {
      monthly: "Mensual",
      yearly: "Anual",
      lifetime: "De por vida",
      free_trial: "Prueba Gratis",
    };
    return plans[plan] || plan;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">💧</span>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                REME LAT-USA PRO
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-black font-medium">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold"
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
          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border-2 border-green-500 p-4 rounded-lg flex items-center space-x-2"
            >
              <CheckCircle className="text-green-500" size={24} />
              <p className="text-black font-bold">
                ¡Suscripción activada exitosamente! Bienvenido a REME LAT-USA PRO
              </p>
            </motion.div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-black">
              Mi Dashboard
            </h1>
            {subscription && (
              <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg">
                <Crown size={20} />
                <span className="font-bold">Plan {getPlanName(subscription.plan)}</span>
              </div>
            )}
          </div>

          {/* Subscription Status */}
          {subscription && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Estado de Suscripción</h3>
                  <p className="text-black font-medium">
                    Plan activo hasta: {new Date(subscription.expires_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Link
                  href="/subscription"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Gestionar Plan
                </Link>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-bold text-black mb-6">Estadísticas</h2>

          {/* Referral Program */}
          {user && <ReferralSection userId={user.id} />}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black font-medium text-sm mb-1">Total Enviado</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${history.reduce((sum, h) => sum + h.amount, 0).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="text-blue-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black font-medium text-sm mb-1">Remesas</p>
                  <p className="text-3xl font-bold text-green-600">{history.length}</p>
                </div>
                <TrendingUp className="text-green-600" size={40} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-black font-medium text-sm mb-1">Alertas Activas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {alerts.filter((a) => a.active).length}
                  </p>
                </div>
                <Bell className="text-purple-600" size={40} />
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-black">
                <Bell size={24} className="text-black" />
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
                className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200"
              >
                <h3 className="font-bold mb-4 text-black">Crear Nueva Alerta</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black">País</label>
                    <select
                      value={newAlert.country_code}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, country_code: e.target.value })
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-black font-medium"
                    >
                      {COUNTRIES.filter((c) => c.active).map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black">Tasa Objetivo</label>
                    <input
                      type="number"
                      value={newAlert.target_rate}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, target_rate: parseFloat(e.target.value) })
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-black font-medium"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black">Condición</label>
                    <select
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-black font-medium"
                    >
                      <option value="above">Por encima de</option>
                      <option value="below">Por debajo de</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleCreateAlert}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold"
                  >
                    Crear Alerta
                  </button>
                  <button
                    onClick={() => setShowNewAlert(false)}
                    className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-black text-center py-8 font-medium">
                  No tienes alertas configuradas. Crea una para recibir notificaciones.
                </p>
              ) : (
                alerts.map((alert) => {
                  const country = COUNTRIES.find((c) => c.code === alert.country_code);
                  return (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{country?.flag}</span>
                        <div>
                          <p className="font-bold text-black">{country?.name}</p>
                          <p className="text-sm text-black font-medium">
                            Alerta cuando la tasa esté {alert.condition === "above" ? "por encima de" : "por debajo de"}{" "}
                            {alert.target_rate} {alert.currency}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700 font-bold"
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
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
              <History size={24} className="text-black" />
              Historial de Remesas
            </h2>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-black mb-4 font-medium">No tienes historial de remesas aún</p>
                <Link
                  href="/#calculadora"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition font-bold"
                >
                  Calcular mi primera remesa
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4 text-black font-bold">Fecha</th>
                      <th className="text-left py-3 px-4 text-black font-bold">País</th>
                      <th className="text-right py-3 px-4 text-black font-bold">Enviado</th>
                      <th className="text-right py-3 px-4 text-black font-bold">Tasa</th>
                      <th className="text-right py-3 px-4 text-black font-bold">Recibido</th>
                      <th className="text-left py-3 px-4 text-black font-bold">Servicio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => {
                      const country = COUNTRIES.find((c) => c.code === item.country_code);
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-black font-medium">
                            {new Date(item.created_at).toLocaleDateString("es-ES")}
                          </td>
                          <td className="py-3 px-4 text-black font-medium">
                            {country?.flag} {country?.name}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-black">
                            ${item.amount.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right text-black font-medium">{item.rate.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600">
                            {item.total_received.toFixed(2)} {item.to_currency}
                          </td>
                          <td className="py-3 px-4 text-black font-medium">{item.service}</td>
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-black">Cargando...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
