"use client";

import Script from 'next/script';

export default function GoogleAnalytics() {
  // El usuario debe reemplazar esto con su ID real de Google Analytics
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

  // Solo cargar GA en producción
  if (process.env.NODE_ENV !== 'production' || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Función helper para trackear eventos personalizados
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Eventos específicos de REME-LAT-USA
export const trackCalculation = (fromCountry: string, toCountry: string, amount: number) => {
  trackEvent('calculation', 'Calculator', `${fromCountry} to ${toCountry}`, amount);
};

export const trackProviderClick = (providerId: string, providerName: string) => {
  trackEvent('provider_click', 'Comparator', `${providerId} - ${providerName}`);
};

export const trackRateRefresh = () => {
  trackEvent('rate_refresh', 'LiveRates', 'Manual Refresh');
};

export const trackFilterChange = (filterType: string, filterValue: string) => {
  trackEvent('filter_change', 'Comparator', `${filterType}: ${filterValue}`);
};

export const trackSort = (sortBy: string) => {
  trackEvent('sort', 'Comparator', sortBy);
};
