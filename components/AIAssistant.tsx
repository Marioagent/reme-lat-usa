"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Info } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente informativo de REME-LAT-USA. Puedo ayudarte con información sobre:\n\n• Tasas de cambio en tiempo real\n• Proveedores de remesas disponibles\n• Comparación de servicios\n• Países y monedas soportadas\n\n¿En qué puedo ayudarte?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Llamar a RAGSearch1 API (con fallback local)
      const response = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.answer || 'No pude procesar tu pregunta. Por favor, intenta reformularla.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback: respuesta local si RAGSearch1 no está disponible
        const fallbackResponse = generateFallbackResponse(input);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: fallbackResponse,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      const fallbackResponse = generateFallbackResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('venezuela') || lowerQuestion.includes('ves')) {
      return 'Para Venezuela, ofrecemos tasas de cambio en tiempo real desde tres fuentes:\n\n• BCV Oficial (Banco Central de Venezuela)\n• Tasa Paralelo (mercado informal)\n• Binance P2P\n\nPuedes ver las tasas actuales en la sección "Tasas en Vivo" y usar nuestra calculadora para estimar el monto que recibirías.';
    }

    if (lowerQuestion.includes('mejor') || lowerQuestion.includes('recomend')) {
      return 'Los proveedores más recomendados según nuestros datos son:\n\n• Wise - Mejores tasas, bajo costo\n• Remitly - Transferencias rápidas\n• Binance P2P - Para cripto usuarios\n• Reserve - Específico para Venezuela\n\nTe recomiendo usar nuestro comparador para ver cuál se ajusta mejor a tus necesidades.';
    }

    if (lowerQuestion.includes('país') || lowerQuestion.includes('pais')) {
      return 'REME-LAT-USA soporta 23 países latinoamericanos:\n\n🌎 América del Sur: Venezuela, Colombia, Argentina, Brasil, Perú, Chile, Ecuador, Bolivia, Uruguay, Paraguay\n\n🌎 América Central: México, Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, Panamá\n\n🌎 Caribe: República Dominicana, Cuba, Puerto Rico, Haití\n\nPuedes usar la calculadora para cualquiera de estos países.';
    }

    if (lowerQuestion.includes('costo') || lowerQuestion.includes('comisión') || lowerQuestion.includes('comision')) {
      return 'Los costos varían según el proveedor:\n\n• Wise: ~0.5% de comisión\n• Remitly: Sin comisión en algunos corredores\n• Western Union: ~5% de comisión\n• Binance P2P: Sin comisión\n\nUsa nuestro comparador para ver los costos exactos y el monto neto que recibirías.';
    }

    if (lowerQuestion.includes('rápido') || lowerQuestion.includes('tiempo')) {
      return 'Los tiempos de entrega varían:\n\n⚡ Instantáneo (minutos): Binance P2P, Reserve, Sendwave\n📅 Mismo día: Remitly, Wise, Xoom\n📆 1-3 días: Western Union, MoneyGram\n\nFiltra por velocidad en nuestro comparador para ver las opciones más rápidas.';
    }

    return `Gracias por tu pregunta. REME-LAT-USA es una plataforma 100% informativa que te ayuda a:\n\n• Comparar tasas de cambio en tiempo real\n• Ver proveedores de remesas disponibles\n• Calcular montos estimados\n• Informarte sobre costos y tiempos\n\n⚠️ Recuerda: NO procesamos transacciones. Para enviar dinero, debes visitar los sitios web oficiales de los proveedores.\n\n¿Tienes alguna pregunta específica sobre tasas, proveedores o países?`;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 flex items-center gap-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Sparkles size={24} />
        <span className="hidden sm:inline font-medium">Asistente IA</span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed bottom-6 right-6 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Asistente IA</h3>
                    <p className="text-xs text-white/80">Información y Soporte</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-start gap-2 text-xs text-blue-800">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Solo información</strong> - Este asistente NO procesa transacciones
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
