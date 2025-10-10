export interface ExchangeRate {
  currency: string;
  rate: number;
  source: string;
  timestamp: Date;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  flag: string;
  active: boolean;
  region: 'central-america' | 'south-america' | 'caribbean' | 'north-america';
  currencySymbol: string;
}

export interface RemittanceService {
  id: string;
  name: string;
  icon: string;
  logo?: string;
  commission: number;
  timeMin: number;
  timeMax: number;
  rate: number;
  recommended: boolean;
  type: 'digital' | 'crypto' | 'bank' | 'traditional' | 'fintech';
  paymentMethods: string[];
  deliveryMethods: string[];
  minAmount: number;
  maxAmount: number;
  countries: string[];
  rating?: number;
  url: string;
  speed: 'instant' | 'same-day' | '1-3-days' | '3-7-days';
}

export interface User {
  id: string;
  email: string;
  created_at: Date;
}

export interface RemittanceHistory {
  id: string;
  user_id: string;
  amount: number;
  from_currency: string;
  to_currency: string;
  rate: number;
  service: string;
  created_at: Date;
}

export interface RateAlert {
  id: string;
  user_id: string;
  country_code: string;
  target_rate: number;
  active: boolean;
  created_at: Date;
}
