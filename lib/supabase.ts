import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create supabase client only if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// LocalStorage fallback for auth when Supabase is not configured
const localAuth = {
  signUp: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    if (users.find((u: any) => u.email === email)) {
      return { data: null, error: new Error('Usuario ya existe') };
    }
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // En producción esto debe estar hasheado
      created_at: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('demo_users', JSON.stringify(users));
    return { data: { user: { id: newUser.id, email: newUser.email } }, error: null };
  },

  signIn: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return { data: null, error: new Error('Email o contraseña incorrectos') };
    }
    localStorage.setItem('demo_current_user', JSON.stringify({ id: user.id, email: user.email }));
    return { data: { user: { id: user.id, email: user.email } }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem('demo_current_user');
    return { error: null };
  },

  getUser: async () => {
    const userStr = localStorage.getItem('demo_current_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    if (!supabase) return localAuth.signUp(email, password);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    if (!supabase) return localAuth.signIn(email, password);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    if (!supabase) return localAuth.signOut();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    if (!supabase) return localAuth.getUser();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};

// LocalStorage fallback for database operations
const localDB = {
  getRemittanceHistory: (userId: string) => {
    const history = JSON.parse(localStorage.getItem('demo_history') || '[]');
    return { data: history.filter((h: any) => h.user_id === userId), error: null };
  },
  addRemittanceHistory: (remittance: any) => {
    const history = JSON.parse(localStorage.getItem('demo_history') || '[]');
    const newItem = { ...remittance, id: `hist_${Date.now()}`, created_at: new Date().toISOString() };
    history.push(newItem);
    localStorage.setItem('demo_history', JSON.stringify(history));
    return { data: [newItem], error: null };
  },
  getRateAlerts: (userId: string) => {
    const alerts = JSON.parse(localStorage.getItem('demo_alerts') || '[]');
    return { data: alerts.filter((a: any) => a.user_id === userId), error: null };
  },
  addRateAlert: (alert: any) => {
    const alerts = JSON.parse(localStorage.getItem('demo_alerts') || '[]');
    const newAlert = { ...alert, id: `alert_${Date.now()}`, created_at: new Date().toISOString() };
    alerts.push(newAlert);
    localStorage.setItem('demo_alerts', JSON.stringify(alerts));
    return { data: [newAlert], error: null };
  },
  deleteRateAlert: (alertId: string) => {
    const alerts = JSON.parse(localStorage.getItem('demo_alerts') || '[]');
    const filtered = alerts.filter((a: any) => a.id !== alertId);
    localStorage.setItem('demo_alerts', JSON.stringify(filtered));
    return { error: null };
  },
  getUserSubscription: (userId: string) => {
    const subs = JSON.parse(localStorage.getItem('demo_subscriptions') || '[]');
    const sub = subs.find((s: any) => s.user_id === userId);
    return { data: sub || null, error: null };
  },
  createSubscription: (subscription: any) => {
    const subs = JSON.parse(localStorage.getItem('demo_subscriptions') || '[]');
    const newSub = { ...subscription, id: `sub_${Date.now()}`, created_at: new Date().toISOString() };
    subs.push(newSub);
    localStorage.setItem('demo_subscriptions', JSON.stringify(subs));
    return { data: newSub, error: null };
  },
};

// Database helpers
export const db = {
  // Remittance history
  getRemittanceHistory: async (userId: string) => {
    if (!supabase) return localDB.getRemittanceHistory(userId);
    const { data, error } = await supabase
      .from("remittance_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  addRemittanceHistory: async (remittance: any) => {
    if (!supabase) return localDB.addRemittanceHistory(remittance);
    const { data, error } = await supabase
      .from("remittance_history")
      .insert([remittance]);
    return { data, error };
  },

  // Rate alerts
  getRateAlerts: async (userId: string) => {
    if (!supabase) return localDB.getRateAlerts(userId);
    const { data, error } = await supabase
      .from("rate_alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  addRateAlert: async (alert: any) => {
    if (!supabase) return localDB.addRateAlert(alert);
    const { data, error } = await supabase
      .from("rate_alerts")
      .insert([alert]);
    return { data, error };
  },

  deleteRateAlert: async (alertId: string) => {
    if (!supabase) return localDB.deleteRateAlert(alertId);
    const { error } = await supabase
      .from("rate_alerts")
      .delete()
      .eq("id", alertId);
    return { error };
  },

  updateRateAlert: async (alertId: string, updates: any) => {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from("rate_alerts")
      .update(updates)
      .eq("id", alertId);
    return { data, error };
  },

  // User subscriptions
  getUserSubscription: async (userId: string) => {
    if (!supabase) return localDB.getUserSubscription(userId);
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  },

  createSubscription: async (subscription: {
    user_id: string;
    status: string;
    plan: string;
    expires_at: string;
  }) => {
    if (!supabase) return localDB.createSubscription(subscription);
    const { data, error } = await supabase
      .from("user_subscriptions")
      .insert([subscription])
      .select()
      .single();
    return { data, error };
  },

  updateSubscription: async (userId: string, updates: {
    status?: string;
    plan?: string;
    expires_at?: string;
    payment_id?: string;
  }) => {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  },

  cancelSubscription: async (userId: string) => {
    if (!supabase) return { data: null, error: null };
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  },
};
