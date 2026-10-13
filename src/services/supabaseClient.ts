import { SupabaseClient } from '@supabase/supabase-js';
import {
  getSupabase,
  getSupabaseEnvConfig,
  setSupabaseCustomConfig,
  isSupabaseReady,
} from '../lib/supabase/client';

export function getSupabaseConfig(): { url: string; anonKey: string } {
  return getSupabaseEnvConfig();
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  setSupabaseCustomConfig(url, anonKey);
}

export function isSupabaseConfigured(): boolean {
  return isSupabaseReady();
}

export function getSupabaseClient(): SupabaseClient | null {
  return getSupabase() as unknown as SupabaseClient | null;
}

export async function testSupabaseConnection(): Promise<{ connected: boolean; error?: string; latencyMs?: number }> {
  const client = getSupabase();
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
      if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return {
          connected: true,
          error: 'Connected to Supabase! Note: The "profiles" table was not found yet. Please run supabase/migrations/20261005000001_kaalchakra_core_schema.sql in your Supabase SQL Editor.',
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
