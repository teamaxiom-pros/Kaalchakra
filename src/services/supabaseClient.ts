import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
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

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseConfig(): { url: string; anonKey: string } {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = getStored(STORAGE_KEYS.URL);
  const storedKey = getStored(STORAGE_KEYS.ANON_KEY);

  const url = (storedUrl || envUrl).trim();
  const anonKey = (storedKey || envKey).trim();

  return { url, anonKey };
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  setStored(STORAGE_KEYS.URL, url.trim());
  setStored(STORAGE_KEYS.ANON_KEY, anonKey.trim());

  // Reset cached client
  cachedClient = null;
  lastUsedUrl = '';
  lastUsedKey = '';
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 10);
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http') || anonKey.length < 10) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; error?: string; latencyMs?: number }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      error: 'Supabase URL or Anon Key is missing or invalid. Please configure credentials.',
    };
  }

  const start = performance.now();
  try {
    const { error } = await client.from('profiles').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      if (error.code === '42P01') {
        return {
          connected: true,
          error: 'Connected to Supabase! Note: The "profiles" table was not found yet. Please run supabase/schema.sql in your SQL Editor.',
          latencyMs,
        };
      }
      return {
        connected: false,
        error: `Supabase error (${error.code || 'unknown'}): ${error.message}`,
        latencyMs,
      };
    }

    return { connected: true, latencyMs };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || 'Network error connecting to Supabase endpoint.',
    };
  }
}
