import { Country, RemittanceService } from "@/types";

export const COUNTRIES: Country[] = [
  { code: "VE", name: "Venezuela", currency: "VES", flag: "🇻🇪", active: true },
  { code: "CO", name: "Colombia", currency: "COP", flag: "🇨🇴", active: true },
  { code: "AR", name: "Argentina", currency: "ARS", flag: "🇦🇷", active: true },
  { code: "BR", name: "Brasil", currency: "BRL", flag: "🇧🇷", active: true },
  { code: "PE", name: "Perú", currency: "PEN", flag: "🇵🇪", active: true },
  { code: "CL", name: "Chile", currency: "CLP", flag: "🇨🇱", active: true },
  { code: "EC", name: "Ecuador", currency: "USD", flag: "🇪🇨", active: true },
  { code: "BO", name: "Bolivia", currency: "BOB", flag: "🇧🇴", active: false },
  { code: "GY", name: "Guyana", currency: "GYD", flag: "🇬🇾", active: false },
  { code: "PA", name: "Panamá", currency: "PAB", flag: "🇵🇦", active: false },
  { code: "PY", name: "Paraguay", currency: "PYG", flag: "🇵🇾", active: false },
  { code: "SR", name: "Surinam", currency: "SRD", flag: "🇸🇷", active: false },
  { code: "UY", name: "Uruguay", currency: "UYU", flag: "🇺🇾", active: false },
];

export const REMITTANCE_SERVICES: RemittanceService[] = [
  {
    id: "zoom",
    name: "Zoom",
    icon: "⚡",
    commission: 0,
    timeMin: 15,
    timeMax: 30,
    rate: 52.5,
    recommended: true,
  },
  {
    id: "reserve",
    name: "Reserve",
    icon: "🔵",
    commission: 1.5,
    timeMin: 5,
    timeMax: 15,
    rate: 51.75,
    recommended: false,
  },
  {
    id: "airtm",
    name: "AirTM",
    icon: "🌐",
    commission: 2.99,
    timeMin: 30,
    timeMax: 60,
    rate: 50.8,
    recommended: false,
  },
  {
    id: "binance",
    name: "Binance P2P",
    icon: "₿",
    commission: 0,
    timeMin: 15,
    timeMax: 45,
    rate: 51.25,
    recommended: false,
  },
];

export const RATE_SOURCES = {
  BCV: "bcv",
  PARALELO: "paralelo",
  BINANCE: "binance",
} as const;
