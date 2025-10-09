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
}

export interface RemittanceService {
  id: string;
  name: string;
  icon: string;
  commission: number;
  timeMin: number;
  timeMax: number;
  rate: number;
  recommended: boolean;
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
