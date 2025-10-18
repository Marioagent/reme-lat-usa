"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { auth, db } from "@/lib/supabase";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // LOGIN: Verificar credenciales y estado de suscripción
        const { data, error } = await auth.signIn(email, password);
        if (error) throw error;

        if (data?.user) {
          // Verificar estado de suscripción
          const { data: subscription, error: subError } = await db.getUserSubscription(data.user.id);

          if (subError) {
            await auth.signOut();
            throw new Error("Error al verificar suscripción");
          }

          // Validar si tiene suscripción activa
          if (!subscription || subscription.status !== 'active') {
            await auth.signOut();
            setError("Tu cuenta no tiene una suscripción activa. Por favor, activa tu suscripción para continuar.");
            setTimeout(() => {
              router.push("/subscription");
            }, 2000);
            return;
          }

          // Verificar si la suscripción está vigente
          const expiresAt = new Date(subscription.expires_at);
          if (expiresAt < new Date()) {
            await auth.signOut();
            setError("Tu suscripción ha expirado. Por favor, renueva tu suscripción.");
            setTimeout(() => {
              router.push("/subscription");
            }, 2000);
            return;
          }

          // Login exitoso con suscripción válida
          setSuccess("¡Acceso concedido! Redirigiendo al dashboard...");
          clearFields();
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } else {
        // REGISTRO: Crear cuenta nueva
        const { data, error } = await auth.signUp(email, password);
        if (error) throw error;

        if (data?.user) {
          // Crear registro de suscripción inactiva (requiere pago)
          const { error: subError } = await db.createSubscription({
            user_id: data.user.id,
            status: 'inactive',
            plan: 'free_trial',
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días trial
          });

          if (subError) {
            console.error("Error creando suscripción:", subError);
          }

          setSuccess("¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta y luego activa tu suscripción.");
          clearFields();
          setTimeout(() => {
            setIsLogin(true);
          }, 3000);
        }
      }
    } catch (err: any) {
      setError(err.message || "Error en autenticación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <span className="text-5xl">💧</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              REME LAT-USA PRO
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-black">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h1>
          <p className="text-black mt-2 font-medium">
            {isLogin
              ? "Accede a tu cuenta premium"
              : "Regístrate y activa tu suscripción"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                <Mail className="inline mr-2 text-black" size={16} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-medium placeholder:text-gray-400"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                <Lock className="inline mr-2 text-black" size={16} />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-medium placeholder:text-gray-400"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-500 text-black p-4 rounded-lg flex items-start space-x-2"
              >
                <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-2 border-green-500 text-black p-4 rounded-lg flex items-start space-x-2"
              >
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                <p className="text-sm font-medium">{success}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                clearFields();
              }}
              className="text-blue-600 hover:text-blue-700 font-bold"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-black hover:text-gray-700 text-sm font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
