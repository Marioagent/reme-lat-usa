// Sistema de Enlaces de Afiliados y Tracking

export interface AffiliateLink {
  service: string;
  baseUrl: string;
  affiliateId: string;
  commission: number; // Comisión estimada en %
  cookieDuration: number; // Días
}

// IMPORTANTE: Reemplaza estos con tus propios IDs de afiliado
export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  zoom: {
    service: "Zoom",
    baseUrl: "https://www.usezoom.com",
    affiliateId: "?ref=reme-lat-usa", // Reemplazar con tu ID real
    commission: 20, // 20% comisión
    cookieDuration: 30,
  },
  reserve: {
    service: "Reserve",
    baseUrl: "https://reserve.com",
    affiliateId: "?ref=reme-lat-usa", // Reemplazar con tu ID real
    commission: 15,
    cookieDuration: 30,
  },
  airtm: {
    service: "AirTM",
    baseUrl: "https://app.airtm.com/invitation",
    affiliateId: "/reme-lat-usa", // Reemplazar con tu código de invitación
    commission: 10,
    cookieDuration: 60,
  },
  binance: {
    service: "Binance",
    baseUrl: "https://www.binance.com/en/register",
    affiliateId: "?ref=REME_LAT_USA", // Reemplazar con tu referral code
    commission: 20,
    cookieDuration: 90,
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
