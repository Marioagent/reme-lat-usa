"use client";

import { motion } from "framer-motion";
import { Code, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function APIDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://reme-lat-usa-pro.vercel.app";

  const endpoints = [
    {
      id: "services",
      method: "GET",
      path: "/api/services",
      description: "Obtener todos los servicios de remesas disponibles",
      params: [
        { name: "country", type: "string", required: false, description: "Código del país (ej: VE, MX, CO)" },
        { name: "type", type: "string", required: false, description: "Tipo de servicio (digital, crypto, traditional, fintech)" },
        { name: "limit", type: "number", required: false, description: "Limitar número de resultados" },
      ],
      example: `${baseUrl}/api/services?country=VE&type=digital&limit=10`,
      response: `{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "wise",
      "name": "Wise",
      "icon": "💚",
      "commission": 0.5,
      "timeMin": 60,
      "timeMax": 180,
      "rate": 0,
      "recommended": true,
      "type": "digital",
      "countries": ["MX", "CO", "AR", "BR", "PE", "CL", "EC", "UY"],
      "rating": 4.8
    }
    // ... más servicios
  ],
  "meta": {
    "timestamp": "2025-10-10T12:00:00Z",
    "version": "1.0.0"
  }
}`
    },
    {
      id: "countries",
      method: "GET",
      path: "/api/countries",
      description: "Obtener todos los países disponibles",
      params: [
        { name: "region", type: "string", required: false, description: "Filtrar por región (central-america, south-america, caribbean, north-america)" },
      ],
      example: `${baseUrl}/api/countries?region=south-america`,
      response: `{
  "success": true,
  "count": 9,
  "data": [
    {
      "code": "CO",
      "name": "Colombia",
      "currency": "COP",
      "flag": "🇨🇴",
      "active": true,
      "region": "south-america",
      "currencySymbol": "$"
    }
    // ... más países
  ],
  "meta": {
    "timestamp": "2025-10-10T12:00:00Z",
    "version": "1.0.0"
  }
}`
    },
    {
      id: "compare",
      method: "GET",
      path: "/api/compare",
      description: "Comparar servicios con filtros avanzados y cálculos de costos",
      params: [
        { name: "country", type: "string", required: true, description: "País destino (requerido)" },
        { name: "amount", type: "number", required: true, description: "Monto a enviar en USD (requerido)" },
        { name: "type", type: "string", required: false, description: "Tipo de servicio" },
        { name: "speed", type: "string", required: false, description: "Velocidad (instant, same-day, 1-3-days, 3-7-days)" },
        { name: "sortBy", type: "string", required: false, description: "Ordenar por (commission, speed, rating, total)" },
      ],
      example: `${baseUrl}/api/compare?country=VE&amount=100&sortBy=commission`,
      response: `{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "remitly",
      "name": "Remitly",
      "commission": 0,
      "calculations": {
        "sendAmount": 100,
        "commissionAmount": 0,
        "netAmount": 100
      }
      // ... más datos del servicio
    }
    // ... más servicios ordenados
  ],
  "best": {
    "service": "Remitly",
    "id": "remitly",
    "savings": 5.00
  },
  "meta": {
    "timestamp": "2025-10-10T12:00:00Z",
    "version": "1.0.0",
    "filters": {
      "country": "VE",
      "amount": 100,
      "type": "all",
      "speed": "all",
      "sortBy": "commission"
    }
  }
}`
    },
    {
      id: "rates",
      method: "GET",
      path: "/api/rates",
      description: "Obtener tasas de cambio en tiempo real",
      params: [
        { name: "refresh", type: "boolean", required: false, description: "Forzar actualización de tasas (true/false)" },
      ],
      example: `${baseUrl}/api/rates`,
      response: `{
  "success": true,
  "data": {
    "VE": {
      "bcv": 36.50,
      "paralelo": 38.20,
      "binanceP2P": 38.50
    },
    "AR": {
      "oficial": 350.00,
      "blue": 1050.00
    }
    // ... más países
  },
  "cached": true,
  "message": "Real-time rates fetched successfully"
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#000000' }}>
              📚 REME-LAT-USA API
            </h1>
            <p className="text-xl mb-6" style={{ color: '#000000' }}>
              API pública REST para obtener datos de remesas en tiempo real
            </p>
            <div className="flex justify-center gap-4">
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                ✅ Gratis
              </span>
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                🚀 Sin límite de requests
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                📊 Datos en tiempo real
              </span>
            </div>
          </div>

          {/* Introducción */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
              <Code size={24} className="inline mr-2" />
              Introducción
            </h2>
            <p className="mb-4" style={{ color: '#000000' }}>
              La API de REME-LAT-USA permite a desarrolladores acceder a datos actualizados sobre:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-6" style={{ color: '#000000' }}>
              <li>25+ servicios de remesas entre USA y Latinoamérica</li>
              <li>Tasas de cambio en tiempo real para 23 países</li>
              <li>Comparaciones avanzadas con cálculos de costos</li>
              <li>Información detallada de cada proveedor</li>
            </ul>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                💡 <strong>Nota:</strong> Esta API es gratuita y de código abierto. No requiere autenticación,
                pero pedimos que incluyas atribución cuando uses los datos.
              </p>
            </div>
          </div>

          {/* Base URL */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
              🌐 Base URL
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 relative">
              <code className="text-green-400 font-mono text-lg">
                {baseUrl}
              </code>
              <button
                onClick={() => copyToClipboard(baseUrl, 'base-url')}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                {copiedEndpoint === 'base-url' ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Endpoints */}
          <div className="space-y-8">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded font-bold text-sm">
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono font-semibold" style={{ color: '#000000' }}>
                    {endpoint.path}
                  </code>
                </div>

                <p className="mb-6" style={{ color: '#000000' }}>
                  {endpoint.description}
                </p>

                {/* Parámetros */}
                {endpoint.params.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
                      📋 Parámetros
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#000000' }}>Parámetro</th>
                            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#000000' }}>Tipo</th>
                            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#000000' }}>Requerido</th>
                            <th className="px-4 py-2 text-left font-semibold" style={{ color: '#000000' }}>Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.params.map((param) => (
                            <tr key={param.name} className="border-b">
                              <td className="px-4 py-2 font-mono text-blue-600">{param.name}</td>
                              <td className="px-4 py-2 font-mono" style={{ color: '#000000' }}>{param.type}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  param.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {param.required ? 'Sí' : 'No'}
                                </span>
                              </td>
                              <td className="px-4 py-2" style={{ color: '#000000' }}>{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Ejemplo de Request */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
                    📤 Ejemplo de Request
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <code className="text-green-400 font-mono text-sm break-all">
                      {endpoint.example}
                    </code>
                    <button
                      onClick={() => copyToClipboard(endpoint.example, endpoint.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                    >
                      {copiedEndpoint === endpoint.id ? (
                        <Check size={20} className="text-green-400" />
                      ) : (
                        <Copy size={20} />
                      )}
                    </button>
                  </div>
                  <a
                    href={endpoint.example}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Probar en el navegador <ExternalLink size={16} />
                  </a>
                </div>

                {/* Ejemplo de Response */}
                <div>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
                    📥 Ejemplo de Response
                  </h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 font-mono text-sm">
                      {endpoint.response}
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Rate Limiting & Best Practices */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
              ⚡ Rate Limiting y Mejores Prácticas
            </h2>
            <div className="space-y-4" style={{ color: '#000000' }}>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold mb-2">✅ Caché de Respuestas</h3>
                <p className="text-sm">
                  Las respuestas están cacheadas por 2 minutos. Usa el parámetro <code className="bg-gray-200 px-2 py-1 rounded">?refresh=true</code> solo cuando necesites datos actualizados.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold mb-2">🔄 Uso Responsable</h3>
                <p className="text-sm">
                  Aunque no hay límite estricto, pedimos que no hagas más de 60 requests por minuto por endpoint.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold mb-2">📌 Atribución</h3>
                <p className="text-sm">
                  Si usas estos datos, por favor incluye un link a{' '}
                  <a href={baseUrl} className="text-blue-600 underline">
                    {baseUrl}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
              💻 Ejemplos de Código
            </h2>

            <div className="space-y-6">
              {/* JavaScript/TypeScript */}
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
                  JavaScript / TypeScript
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-sm">{`// Obtener servicios para Venezuela
const response = await fetch('${baseUrl}/api/services?country=VE');
const data = await response.json();
console.log(data.data); // Array de servicios

// Comparar servicios para $100 USD
const compare = await fetch('${baseUrl}/api/compare?country=VE&amount=100');
const comparison = await compare.json();
console.log(comparison.best); // Mejor servicio`}</pre>
                </div>
              </div>

              {/* Python */}
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#000000' }}>
                  Python
                </h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-sm">{`import requests

# Obtener tasas de cambio
response = requests.get('${baseUrl}/api/rates')
data = response.json()
print(data['data'])

# Comparar servicios
compare = requests.get('${baseUrl}/api/compare', params={
    'country': 'VE',
    'amount': 100,
    'sortBy': 'commission'
})
print(compare.json()['best'])`}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl text-white">
            <h3 className="text-2xl font-bold mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="mb-4">
              Visita nuestro repositorio en GitHub o contáctanos
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition"
            >
              Volver al Inicio
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
