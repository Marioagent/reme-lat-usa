// Google Analytics & Tracking Configuration

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

// Tipos de eventos
export type EventName =
  | "page_view"
  | "calculate_remittance"
  | "affiliate_click"
  | "signup"
  | "login"
  | "create_alert"
  | "install_pwa"
  | "share";

interface EventParams {
  [key: string]: any;
}

/**
 * Track page view
 */
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom event
 */
export const event = (name: EventName, params: EventParams = {}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }

  // También guardar en localStorage para análisis interno
  if (typeof window !== "undefined") {
    const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
    events.push({
      name,
      params,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("analytics_events", JSON.stringify(events));
  }
};

/**
 * Track remittance calculation
 */
export const trackCalculation = (amount: number, country: string, service: string) => {
  event("calculate_remittance", {
    amount,
    country,
    service,
    value: amount,
  });
};

/**
 * Track signup conversion
 */
export const trackSignup = (method: string = "email") => {
  event("signup", {
    method,
    conversion: true,
  });
};

/**
 * Track login
 */
export const trackLogin = (method: string = "email") => {
  event("login", {
    method,
  });
};

/**
 * Track affiliate click (conversión potencial)
 */
export const trackAffiliateClick = (service: string, amount?: number) => {
  event("affiliate_click", {
    service,
    amount,
    conversion_value: amount,
  });
};

/**
 * Track PWA installation
 */
export const trackPWAInstall = () => {
  event("install_pwa", {
    platform: navigator.platform,
    conversion: true,
  });
};

/**
 * Track share
 */
export const trackShare = (method: string) => {
  event("share", {
    method,
  });
};

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (typeof window === "undefined") return;

  // Cargar script de GA4
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Inicializar gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_TRACKING_ID, {
    page_path: window.location.pathname,
  });
};
