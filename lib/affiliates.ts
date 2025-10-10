// Sistema de Enlaces de Afiliados y Tracking

export interface AffiliateLink {
  service: string;
  baseUrl: string;
  affiliateId: string;
  commission: number; // Comisión estimada en %
  cookieDuration: number; // Días
  hasProgram: boolean; // Si tiene programa de afiliados activo
}

// IMPORTANTE: Reemplaza los IDs con tus propios códigos de afiliado
// Los valores por defecto funcionan, pero debes registrarte en cada programa
export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  // PLATAFORMAS DIGITALES INTERNACIONALES
  wise: {
    service: "Wise",
    baseUrl: "https://wise.com",
    affiliateId: "?clickref=reme-lat-usa", // Wise Partner Program
    commission: 25, // Por cada referido que use el servicio
    cookieDuration: 90,
    hasProgram: true,
  },
  remitly: {
    service: "Remitly",
    baseUrl: "https://www.remitly.com",
    affiliateId: "/us/en?promo=reme-lat-usa", // Remitly Rewards
    commission: 30, // Por primer envío
    cookieDuration: 30,
    hasProgram: true,
  },
  "western-union": {
    service: "Western Union",
    baseUrl: "https://www.westernunion.com",
    affiliateId: "?affid=reme-lat-usa", // WU Affiliate Program
    commission: 20,
    cookieDuration: 30,
    hasProgram: true,
  },
  moneygram: {
    service: "MoneyGram",
    baseUrl: "https://www.moneygram.com",
    affiliateId: "?partner=reme-lat-usa", // MoneyGram Partners
    commission: 15,
    cookieDuration: 30,
    hasProgram: true,
  },
  xoom: {
    service: "Xoom",
    baseUrl: "https://www.xoom.com",
    affiliateId: "?refid=reme-lat-usa", // PayPal Partner Network
    commission: 25,
    cookieDuration: 45,
    hasProgram: true,
  },
  worldremit: {
    service: "WorldRemit",
    baseUrl: "https://www.worldremit.com",
    affiliateId: "?refer=reme-lat-usa", // WorldRemit Affiliate
    commission: 20,
    cookieDuration: 30,
    hasProgram: true,
  },
  ria: {
    service: "Ria Money Transfer",
    baseUrl: "https://www.riamoneytransfer.com",
    affiliateId: "?aff=reme-lat-usa",
    commission: 15,
    cookieDuration: 30,
    hasProgram: true,
  },
  smallworld: {
    service: "Small World",
    baseUrl: "https://www.smallworldfs.com",
    affiliateId: "?referral=reme-lat-usa",
    commission: 10,
    cookieDuration: 30,
    hasProgram: false, // Verificar disponibilidad
  },
  pangea: {
    service: "Pangea",
    baseUrl: "https://www.gopangea.com",
    affiliateId: "?ref=reme-lat-usa",
    commission: 12,
    cookieDuration: 30,
    hasProgram: false,
  },
  sendwave: {
    service: "Sendwave",
    baseUrl: "https://www.sendwave.com",
    affiliateId: "?promo=reme-lat-usa",
    commission: 15,
    cookieDuration: 30,
    hasProgram: false,
  },

  // EXCHANGES DE CRIPTOMONEDAS
  binance: {
    service: "Binance",
    baseUrl: "https://www.binance.com/en/register",
    affiliateId: "?ref=REME_LAT_USA", // Binance Referral Program
    commission: 20, // 20% de comisiones de trading
    cookieDuration: 90,
    hasProgram: true,
  },
  bitso: {
    service: "Bitso",
    baseUrl: "https://bitso.com",
    affiliateId: "?ref=reme-lat-usa", // Bitso Referral
    commission: 10,
    cookieDuration: 60,
    hasProgram: true,
  },
  ripio: {
    service: "Ripio",
    baseUrl: "https://www.ripio.com",
    affiliateId: "?ref=reme-lat-usa",
    commission: 10,
    cookieDuration: 60,
    hasProgram: true,
  },
  airtm: {
    service: "AirTM",
    baseUrl: "https://app.airtm.com",
    affiliateId: "?referred_by=reme-lat-usa", // AirTM Referral
    commission: 5, // Por cada transacción
    cookieDuration: 60,
    hasProgram: true,
  },
  reserve: {
    service: "Reserve",
    baseUrl: "https://reserve.org",
    affiliateId: "?ref=reme-lat-usa", // Reserve Referral
    commission: 5,
    cookieDuration: 60,
    hasProgram: true,
  },
  localbitcoins: {
    service: "LocalBitcoins",
    baseUrl: "https://localbitcoins.com",
    affiliateId: "?ch=reme-lat-usa", // LBC Affiliate
    commission: 20,
    cookieDuration: 90,
    hasProgram: true,
  },

  // FINTECHS LOCALES (menos afiliados disponibles)
  nequi: {
    service: "Nequi",
    baseUrl: "https://www.nequi.com.co",
    affiliateId: "",
    commission: 0,
    cookieDuration: 0,
    hasProgram: false, // No tiene programa público
  },
  mercadopago: {
    service: "Mercado Pago",
    baseUrl: "https://www.mercadopago.com",
    affiliateId: "?partner=reme-lat-usa",
    commission: 0,
    cookieDuration: 30,
    hasProgram: false, // Verificar disponibilidad por país
  },
  rappi: {
    service: "RappiPay",
    baseUrl: "https://www.rappi.com",
    affiliateId: "",
    commission: 0,
    cookieDuration: 0,
    hasProgram: false,
  },
  nubank: {
    service: "Nubank",
    baseUrl: "https://www.nubank.com.br",
    affiliateId: "?invite=reme-lat-usa",
    commission: 0,
    cookieDuration: 30,
    hasProgram: false, // Programa de invitación limitado
  },
};

/**
 * Obtiene el link de afiliado completo para un servicio
 */
export function getAffiliateLink(serviceId: string, country?: string): string {
  const affiliate = AFFILIATE_LINKS[serviceId];
  if (!affiliate) return "#";

  let url = affiliate.baseUrl + affiliate.affiliateId;

  // Añadir parámetros adicionales para tracking
  const params = new URLSearchParams({
    utm_source: "reme-lat-usa",
    utm_medium: "affiliate",
    utm_campaign: serviceId,
  });

  if (country) {
    params.append("country", country);
  }

  const separator = affiliate.affiliateId.includes("?") ? "&" : "?";
  return `${url}${separator}${params.toString()}`;
}

/**
 * Tracking de clicks en enlaces de afiliado
 */
export function trackAffiliateClick(serviceId: string, amount?: number) {
  // Google Analytics event
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "affiliate_click", {
      service: serviceId,
      amount: amount,
      timestamp: new Date().toISOString(),
    });
  }

  // Guardar en localStorage para tracking interno
  if (typeof window !== "undefined") {
    const clicks = JSON.parse(localStorage.getItem("affiliate_clicks") || "[]");
    clicks.push({
      service: serviceId,
      amount: amount,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("affiliate_clicks", JSON.stringify(clicks));
  }
}

/**
 * Calcular comisión estimada
 */
export function calculateEstimatedCommission(serviceId: string, amount: number): number {
  const affiliate = AFFILIATE_LINKS[serviceId];
  if (!affiliate) return 0;

  return (amount * affiliate.commission) / 100;
}

/**
 * Obtener estadísticas de clicks
 */
export function getAffiliateStats() {
  if (typeof window === "undefined") return [];

  const clicks = JSON.parse(localStorage.getItem("affiliate_clicks") || "[]");
  return clicks;
}
