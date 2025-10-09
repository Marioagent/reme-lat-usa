import type { Metadata } from "next";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";
import Analytics from "@/components/Analytics";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://reme-lat-usa.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "💧 REME LAT-USA - Compara Remesas LAT-USA en Tiempo Real",
    template: "%s | REME LAT-USA",
  },
  description:
    "La mejor tasa para enviar dinero a 13 países de Latinoamérica. Comparamos en tiempo real para que ahorres en cada transacción. Zoom, Reserve, AirTM, Binance P2P.",
  keywords: [
    "remesas",
    "latinoamerica",
    "usa",
    "venezuela",
    "colombia",
    "argentina",
    "tasa de cambio",
    "dolares",
    "enviar dinero",
    "comparador",
    "zoom",
    "reserve",
    "airtm",
    "binance",
  ],
  authors: [{ name: "REME LAT-USA" }],
  creator: "REME LAT-USA",
  publisher: "REME LAT-USA",
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
    title: "REME LAT-USA",
  },
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: APP_URL,
    siteName: "REME LAT-USA",
    title: "💧 REME LAT-USA - Compara Remesas LAT-USA en Tiempo Real",
    description:
      "Compara tasas de remesas entre Latinoamérica y USA. Ahorra dinero en cada envío con las mejores tasas del mercado.",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "REME LAT-USA Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "💧 REME LAT-USA - Compara Remesas LAT-USA",
    description: "Compara tasas de remesas y ahorra dinero en cada envío",
    images: ["/icon-512x512.png"],
    creator: "@remelatusa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <Analytics />
        {children}
      </body>
    </html>
  );
}
