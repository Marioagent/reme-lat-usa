import type { Metadata } from "next";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://reme-lat-usa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "REME-LAT-USA | Comparador de Remesas LAT ↔ USA en Tiempo Real | 25+ Proveedores",
    template: "%s | REME-LAT-USA",
  },
  description:
    "Compara 25+ proveedores de remesas entre Latinoamérica y USA. 23 países, tasas en tiempo real, calculadora bidireccional. Wise, Remitly, Western Union, Binance, MoneyGram y más. Ahorra hasta 5% en cada envío.",
  keywords: [
    // Términos generales
    "remesas latinoamerica",
    "enviar dinero latinoamerica",
    "comparador remesas",
    "tasa de cambio tiempo real",
    "remesas usa",
    "transferencias internacionales",

    // Países específicos
    "remesas mexico",
    "remesas venezuela",
    "remesas colombia",
    "remesas argentina",
    "remesas brasil",
    "remesas peru",
    "remesas chile",
    "remesas ecuador",
    "remesas republica dominicana",
    "remesas centroamerica",

    // Proveedores principales
    "wise",
    "remitly",
    "western union",
    "moneygram",
    "xoom",
    "worldremit",
    "binance p2p",
    "reserve app",
    "airtm",
    "bitso",

    // Long tail keywords
    "mejor tasa remesas",
    "enviar dolares venezuela",
    "cambio dolar paralelo",
    "comparar precios remesas",
    "costo envio dinero latinoamerica",
    "calculadora remesas",
    "dinero familia latinoamerica",
  ],
  authors: [{ name: "REME-LAT-USA", url: APP_URL }],
  creator: "REME-LAT-USA",
  publisher: "REME-LAT-USA",
  applicationName: "REME-LAT-USA",
  category: "Finance",
  classification: "Remittance Comparison Tool",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "REME-LAT-USA",
    startupImage: "/icon-512x512.png",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["es_MX", "es_CO", "es_VE", "es_AR", "es_CL", "es_PE"],
    url: APP_URL,
    siteName: "REME-LAT-USA",
    title: "REME-LAT-USA | Comparador #1 de Remesas Latinoamérica ↔ USA",
    description:
      "Compara 25+ proveedores de remesas en tiempo real. 23 países latinoamericanos. Calculadora bidireccional. Encuentra la mejor tasa y ahorra hasta 5% en cada envío. Wise, Remitly, Western Union, Binance P2P y más.",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "REME-LAT-USA - Comparador de Remesas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@remelatusa",
    creator: "@remelatusa",
    title: "REME-LAT-USA | Compara 25+ Proveedores de Remesas",
    description: "Tasas en tiempo real para 23 países. Calculadora bidireccional. Ahorra hasta 5% en cada envío.",
    images: ["/icon-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
    languages: {
      'es-ES': APP_URL,
      'es-MX': APP_URL,
      'es-CO': APP_URL,
      'es-VE': APP_URL,
      'es-AR': APP_URL,
    },
  },
  verification: {
    // Agregar estos cuando tengas las cuentas
    google: "google-site-verification-code-here",
    // yandex: "yandex-verification-code",
    // bing: "bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="canonical" href={APP_URL} />
      </head>
      <body className="antialiased">
        <RegisterServiceWorker />
        <GoogleAnalytics />
        <AnalyticsWrapper />
        {children}
      </body>
    </html>
  );
}
