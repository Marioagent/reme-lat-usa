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
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Dashboard states
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
    if (currentUser) {
      setUser(currentUser);
      loadData(currentUser.id);
    }
    setLoading(false);
  };

  const loadData = async (userId: string) => {
    const { data: historyData } = await db.getRemittanceHistory(userId);
    const { data: alertsData } = await db.getRateAlerts(userId);
    const { data: subData } = await db.getUserSubscription(userId);

    if (historyData) setHistory(historyData);
    if (alertsData) setAlerts(alertsData);
    if (subData) setSubscription(subData);
  };

  // Validación de email en tiempo real
  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("El email es requerido");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Ingresa un email válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validación de password en tiempo real
  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("La contraseña es requerida");
      return false;
    }
    if (value.length < 6) {
      setPasswordError("Mínimo 6 caracteres");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value) validatePassword(value);
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
    setEmailError("");
    setPasswordError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar antes de enviar
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid || !passwordValid) {
      return;
    }

    setAuthLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await auth.signIn(email, password);
        if (error) throw error;

        if (data?.user) {
          setSuccess("¡Login exitoso! Cargando dashboard...");
          clearFields();
          setUser(data.user);
          loadData(data.user.id);
        }
      } else {
        // REGISTRO
        const { data, error } = await auth.signUp(email, password);
        if (error) throw error;

        if (data?.user) {
          setSuccess("¡Cuenta creada! Confirma tu email y luego inicia sesión.");
          clearFields();
          setTimeout(() => {
            setIsLogin(true);
          }, 3000);
        }
      }
    } catch (err: any) {
      setError(err.message || "Error en autenticación");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setHistory([]);
    setAlerts([]);
    setSubscription(null);
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

  const getPlanName = (plan: string) => {
    const plans: Record<string, string> = {
      monthly: "Mensual",
      yearly: "Anual",
      lifetime: "De por vida",
      free_trial: "Prueba Gratis",
    };
    return plans[plan] || plan;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-black">Cargando...</div>
      </div>
    );
  }

  // Si NO está autenticado, mostrar formulario de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">💧</span>
            <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
              REME LAT-USA PRO
            </span>
            <h1 className="text-3xl font-bold text-black mt-6 mb-2">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h1>
            <p className="text-black font-medium">
              {isLogin
                ? "Ingresa para acceder a tu dashboard"
                : "Regístrate para comenzar"}
            </p>
          </div>

          {/* ACCESO DIRECTO FUNDADOR */}
          <div className="mb-6">
            <button
              onClick={() => {
                setUser({
                  id: 'founder-demo',
                  email: 'mac.global.apps@gmail.com',
                  role: 'founder'
                });
                setSuccess("¡Acceso fundador activado!");
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-lg rounded-xl font-black hover:shadow-2xl transition flex items-center justify-center gap-2"
            >
              <Crown size={24} />
              ACCESO FUNDADOR
            </button>
            <p className="text-center text-sm text-gray-600 mt-2 font-medium">
              Click aquí para acceso directo sin autenticación
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-600 font-bold">
                O usa autenticación
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-gray-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-base font-black text-black mb-2">
                  <Mail className="inline mr-2 text-black" size={20} />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => email && validateEmail(email)}
                    className={`w-full px-4 py-4 border-4 rounded-xl text-black text-lg font-bold placeholder:text-gray-500 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 ${
                      emailError ? 'border-red-500' : email ? 'border-green-500' : 'border-gray-400'
                    }`}
                    placeholder="tu@email.com"
                    required
                  />
                  {email && !emailError && (
                    <CheckCircle className="absolute right-4 top-4 text-green-500" size={24} />
                  )}
                </div>
                {emailError && (
                  <p className="text-red-600 text-sm font-bold mt-2 flex items-center">
                    <AlertCircle className="mr-1" size={16} />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-base font-black text-black mb-2">
                  <Lock className="inline mr-2 text-black" size={20} />
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => password && validatePassword(password)}
                    className={`w-full px-4 py-4 pr-12 border-4 rounded-xl text-black text-lg font-bold placeholder:text-gray-500 focus:ring-4 focus:ring-blue-500 focus:border-blue-500 ${
                      passwordError ? 'border-red-500' : password ? 'border-green-500' : 'border-gray-400'
                    }`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-600 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                  </button>
                  {password && !passwordError && (
                    <CheckCircle className="absolute right-14 top-4 text-green-500" size={24} />
                  )}
                </div>
                {passwordError && (
                  <p className="text-red-600 text-sm font-bold mt-2 flex items-center">
                    <AlertCircle className="mr-1" size={16} />
                    {passwordError}
                  </p>
                )}
                {!passwordError && password && (
                  <p className="text-green-600 text-sm font-bold mt-2">
                    ✓ Contraseña válida
                  </p>
                )}
              </div>

              {/* Messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-4 border-red-500 text-black p-4 rounded-xl flex items-start space-x-2"
                >
                  <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={24} />
                  <p className="text-base font-bold">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border-4 border-green-500 text-black p-4 rounded-xl flex items-start space-x-2"
                >
                  <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={24} />
                  <p className="text-base font-bold">{success}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={authLoading || !!emailError || !!passwordError || !email || !password}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 text-lg rounded-xl font-black hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? "Verificando..." : isLogin ? "INGRESAR" : "CREAR CUENTA"}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  clearFields();
                }}
                className="text-blue-600 hover:text-blue-700 font-black text-lg"
              >
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Si SÍ está autenticado, mostrar dashboard completo
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">💧</span>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                REME LAT-USA PRO
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-black font-bold text-lg">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-black"
              >
                <LogOut size={20} />
                SALIR
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
