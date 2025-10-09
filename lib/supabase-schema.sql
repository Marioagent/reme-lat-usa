-- Supabase SQL Schema for REME LAT-USA

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Remittance History Table
CREATE TABLE IF NOT EXISTS remittance_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  from_currency VARCHAR(3) DEFAULT 'USD',
  to_currency VARCHAR(3) NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  rate NUMERIC(12, 4) NOT NULL,
  service VARCHAR(50) NOT NULL,
  total_received NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rate Alerts Table
CREATE TABLE IF NOT EXISTS rate_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  target_rate NUMERIC(12, 4) NOT NULL,
  condition VARCHAR(10) DEFAULT 'above' CHECK (condition IN ('above', 'below')),
  active BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  default_country VARCHAR(2) DEFAULT 'VE',
  default_amount NUMERIC(12, 2) DEFAULT 100,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_alerts BOOLEAN DEFAULT TRUE,
  push_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_remittance_history_user ON remittance_history(user_id);
CREATE INDEX idx_remittance_history_created ON remittance_history(created_at DESC);
CREATE INDEX idx_rate_alerts_user ON rate_alerts(user_id);
CREATE INDEX idx_rate_alerts_active ON rate_alerts(active);

-- Row Level Security (RLS) Policies
ALTER TABLE remittance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Remittance History Policies
CREATE POLICY "Users can view own remittance history"
  ON remittance_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own remittance history"
  ON remittance_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Rate Alerts Policies
CREATE POLICY "Users can view own rate alerts"
  ON rate_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate alerts"
  ON rate_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rate alerts"
  ON rate_alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rate alerts"
  ON rate_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- User Preferences Policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
