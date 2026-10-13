import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database';

let supabaseInstance: SupabaseClient<Database> | null = null;
let isExplicitlyCleared = false;
let customConfigOverride: { url: string; anonKey: string } | null = null;

export const SUPABASE_STORAGE_KEYS = {
  URL: 'kaalchakra:supabase_url',
  ANON_KEY: 'kaalchakra:supabase_anon_key',
};

// In-memory fallback if localStorage is unavailable (e.g. Node test environment)
const inMemoryStorage: Record<string, string> = {};

function getStored(key: string): string {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) || '';
    }
  } catch {
    // fallback
  }
  return inMemoryStorage[key] || '';
}

function setStored(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    }
  } catch {
    // fallback
  }
  if (value) inMemoryStorage[key] = value;
  else delete inMemoryStorage[key];
}

export function getSupabaseEnvConfig(): { url: string; anonKey: string } {
  if (isExplicitlyCleared) {
    return { url: '', anonKey: '' };
  }

  // If a custom configuration was explicitly applied at runtime, respect it
  if (customConfigOverride) {
    return customConfigOverride;
  }

  // 1. Read Vite environment variables (primary for production builds)
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();

  // 2. Read stored configuration from localStorage (fallback / custom settings)
  const storedUrl = getStored(SUPABASE_STORAGE_KEYS.URL).trim();
  const storedKey = getStored(SUPABASE_STORAGE_KEYS.ANON_KEY).trim();

  const url = envUrl || storedUrl;
  const anonKey = envKey || storedKey;

  return {
    url,
    anonKey,
  };
}

export function setSupabaseCustomConfig(url: string, anonKey: string): void {
  if (url === '' && anonKey === '') {
    isExplicitlyCleared = true;
    customConfigOverride = null;
  } else {
    isExplicitlyCleared = false;
    customConfigOverride = { url: url.trim(), anonKey: anonKey.trim() };
  }

  setStored(SUPABASE_STORAGE_KEYS.URL, url.trim());
  setStored(SUPABASE_STORAGE_KEYS.ANON_KEY, anonKey.trim());

  resetSupabaseInstance();
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
