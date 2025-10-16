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

-- User Subscriptions Table (for monetization)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired', 'trial')),
  plan VARCHAR(50) DEFAULT 'free_trial' CHECK (plan IN ('free_trial', 'monthly', 'yearly', 'lifetime')),
  payment_id VARCHAR(255),
  payment_provider VARCHAR(50),
  amount NUMERIC(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscriptions
CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_expires ON user_subscriptions(expires_at);

-- Row Level Security for subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for rate_alerts
CREATE TRIGGER update_rate_alerts_updated_at
  BEFORE UPDATE ON rate_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
