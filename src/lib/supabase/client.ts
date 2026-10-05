import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database';

let supabaseInstance: SupabaseClient<Database> | null = null;

export function getSupabaseEnvConfig(): { url: string; anonKey: string } {
  const url =
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('kaalchakra:supabase_url') : '') ||
    '';

  const anonKey =
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('kaalchakra:supabase_anon_key') : '') ||
    '';

  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
  };
}

export function isSupabaseReady(): boolean {
  const { url, anonKey } = getSupabaseEnvConfig();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

export function getSupabase(): SupabaseClient<Database> | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { url, anonKey } = getSupabaseEnvConfig();

  if (!url || !anonKey || !url.startsWith('http') || anonKey.length <= 10) {
    return null;
  }

  try {
    supabaseInstance = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'kaalchakra-auth-token',
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client singleton:', err);
    return null;
  }
}

export function resetSupabaseInstance(): void {
  supabaseInstance = null;
}
