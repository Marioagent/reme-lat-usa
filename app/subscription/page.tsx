"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Shield, AlertCircle } from "lucide-react";
import { auth, db } from "@/lib/supabase";
import Link from "next/link";

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkUser();
    const errorParam = searchParams?.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        no_subscription: "No tienes una suscripción activa",
        inactive_subscription: "Tu suscripción está inactiva",
        expired_subscription: "Tu suscripción ha expirado",
        subscription_check_failed: "Error al verificar tu suscripción",
      };
      setError(errorMessages[errorParam] || "Error desconocido");
    }
  }, [searchParams]);

  const checkUser = async () => {
    try {
      const currentUser = await auth.getUser();
      if (!currentUser) {
        router.push("/auth");
        return;
      }
      setUser(currentUser);
    } catch (err) {
      console.error("Error checking user:", err);
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "monthly",
      name: "Mensual",
      price: 9.99,
      currency: "USD",
      duration: "mes",
      description: "Acceso completo por 30 días",
      features: [
        "Comparador en tiempo real",
        "Alertas de tasas ilimitadas",
        "Historial completo",
        "API acceso",
        "Soporte prioritario",
      ],
      popular: false,
    },
    {
      id: "yearly",
      name: "Anual",
      price: 89.99,
      currency: "USD",
      duration: "año",
      description: "Ahorra $29.89 vs plan mensual",
      features: [
        "Todo del plan mensual",
        "2 meses GRATIS",
        "Análisis avanzado",
        "Exportar reportes",
        "Soporte premium 24/7",
      ],
      popular: true,
      savings: "25%",
    },
    {
      id: "lifetime",
      name: "De por vida",
      price: 199.99,
      currency: "USD",
      duration: "única vez",
      description: "Pago único, acceso ilimitado",
      features: [
        "Acceso DE POR VIDA",
        "Todas las funciones",
        "Actualizaciones gratis",
        "Prioridad en nuevas features",
        "Soporte VIP ilimitado",
      ],
      popular: false,
      savings: "Mejor valor",
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push("/auth");
      return;
    }

    setSelectedPlan(planId);
    setProcessing(true);
    setError("");

    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error("Plan no encontrado");

      // Aquí integrarías con Stripe, PayPal, etc.
      // Por ahora, simulamos el pago exitoso
      console.log("Procesando pago para:", { user, plan });

      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calcular fecha de expiración
      let expiresAt: Date;
      if (planId === "monthly") {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (planId === "yearly") {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      } else {
        // lifetime - 100 años
        expiresAt = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
      }

      // Actualizar o crear suscripción
      const { error: subError } = await db.updateSubscription(user.id, {
        status: 'active',
        plan: planId,
        expires_at: expiresAt.toISOString(),
        payment_id: `DEMO_${Date.now()}`,
      });

      if (subError) {
        // Si no existe, crear nueva
        await db.createSubscription({
          user_id: user.id,
          status: 'active',
          plan: planId,
          expires_at: expiresAt.toISOString(),
        });
      }

      // Redirigir al dashboard
      router.push("/dashboard?subscription=success");
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      setSelectedPlan(null);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-black text-xl font-bold">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <span className="text-5xl">💧</span>
            <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              REME LAT-USA PRO
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-black mb-4">
            Activa tu Suscripción Premium
          </h1>
          <p className="text-black text-lg max-w-2xl mx-auto font-medium">
            Accede a todas las funcionalidades avanzadas y maximiza tus ahorros en remesas
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8 bg-red-50 border-2 border-red-500 p-4 rounded-lg flex items-start space-x-2"
          >
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-black font-medium">{error}</p>
          </motion.div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-xl p-8 border-2 relative ${
                plan.popular
                  ? "border-blue-500 transform scale-105"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-1 rounded-full text-sm font-bold">
                  MÁS POPULAR
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-4 right-4 bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-bold">
                  {plan.savings}
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-black">${plan.price}</span>
                  <span className="text-black ml-2">/{plan.duration}</span>
                </div>
                <p className="text-black font-medium text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-black font-medium text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processing && selectedPlan !== plan.id}
                className={`w-full py-3 rounded-lg font-bold transition ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing && selectedPlan === plan.id
                  ? "Procesando..."
                  : "Activar Ahora"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <Shield className="text-blue-600 mb-3" size={32} />
            <h4 className="text-black font-bold text-lg mb-2">Pago Seguro</h4>
            <p className="text-black font-medium text-sm">
              Procesamiento encriptado con los más altos estándares de seguridad
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <Zap className="text-green-600 mb-3" size={32} />
            <h4 className="text-black font-bold text-lg mb-2">Activación Instantánea</h4>
            <p className="text-black font-medium text-sm">
              Acceso inmediato a todas las funciones premium al completar el pago
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <Crown className="text-yellow-600 mb-3" size={32} />
            <h4 className="text-black font-bold text-lg mb-2">Garantía 30 Días</h4>
            <p className="text-black font-medium text-sm">
              Si no estás satisfecho, te devolvemos tu dinero sin preguntas
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Link href="/" className="text-black hover:text-gray-700 font-bold">
            ← Volver al inicio
          </Link>
          {user && (
            <button
              onClick={() => router.push("/dashboard")}
              className="ml-6 text-blue-600 hover:text-blue-700 font-bold"
            >
              Ir al Dashboard →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-black text-xl font-bold">Cargando...</div>
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
