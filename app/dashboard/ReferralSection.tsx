"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Gift } from "lucide-react";
import { generateReferralCode, getReferralLink, shareReferralLink } from "@/lib/referrals";

interface ReferralSectionProps {
  userId: string;
}

export default function ReferralSection({ userId }: ReferralSectionProps) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const code = generateReferralCode(userId);
    setReferralCode(code);
  }, [userId]);

  const referralLink = getReferralLink(referralCode);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await shareReferralLink(referralCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <Gift size={32} />
        <div>
          <h2 className="text-2xl font-bold">Programa de Referidos</h2>
          <p className="text-purple-100">Gana comisiones por cada amigo que invites</p>
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
        <p className="text-sm mb-2">Tu código de referido:</p>
        <p className="text-3xl font-bold tracking-wider">{referralCode}</p>
      </div>

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
        <p className="text-sm mb-2">Tu link de referido:</p>
        <p className="text-sm font-mono break-all">{referralLink}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2"
        >
          <Copy size={20} />
          {copied ? "¡Copiado!" : "Copiar Link"}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition flex items-center justify-center gap-2"
        >
          <Share2 size={20} />
          Compartir
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs">Referidos</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <p className="text-2xl font-bold">$0</p>
          <p className="text-xs">Ganado</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
          <p className="text-2xl font-bold">10%</p>
          <p className="text-xs">Comisión</p>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-purple-100">
        <p>💡 Gana 10% de comisión por cada transacción de tus referidos</p>
      </div>
    </motion.div>
  );
}
