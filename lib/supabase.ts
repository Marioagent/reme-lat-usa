import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
};

// Database helpers
export const db = {
  // Remittance history
  getRemittanceHistory: async (userId: string) => {
    const { data, error } = await supabase
      .from("remittance_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  addRemittanceHistory: async (remittance: any) => {
    const { data, error } = await supabase
      .from("remittance_history")
      .insert([remittance]);
    return { data, error };
  },

  // Rate alerts
  getRateAlerts: async (userId: string) => {
    const { data, error } = await supabase
      .from("rate_alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  addRateAlert: async (alert: any) => {
    const { data, error } = await supabase
      .from("rate_alerts")
      .insert([alert]);
    return { data, error };
  },

  deleteRateAlert: async (alertId: string) => {
    const { error } = await supabase
      .from("rate_alerts")
      .delete()
      .eq("id", alertId);
    return { error };
  },

  updateRateAlert: async (alertId: string, updates: any) => {
    const { data, error } = await supabase
      .from("rate_alerts")
      .update(updates)
      .eq("id", alertId);
    return { data, error };
  },

  // User subscriptions
  getUserSubscription: async (userId: string) => {
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
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  },

  cancelSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();
    return { data, error };
  },
};
