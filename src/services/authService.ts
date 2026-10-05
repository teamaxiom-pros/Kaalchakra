import { getSupabase } from '../lib/supabase/client';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
  preferredLanguage?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: string | null;
}

export const authService = {
  async signUp({ email, password, displayName, preferredLanguage = 'en' }: SignUpParams): Promise<AuthResponse> {
    if (!email || !email.includes('@')) {
      return { user: null, session: null, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 8) {
      return { user: null, session: null, error: 'Password must be at least 8 characters long.' };
    }
    if (!displayName || displayName.trim().length === 0) {
      return { user: null, session: null, error: 'Please enter a display name.' };
    }

    const supabase = getSupabase();
    if (!supabase) {
      return { user: null, session: null, error: 'Supabase is not configured. Please check connection settings.' };
    }

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/verify-email` : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            display_name: displayName.trim(),
            preferred_language: preferredLanguage,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: err?.message || 'Failed to complete registration' };
    }
  },

  async signIn({ email, password }: SignInParams): Promise<AuthResponse> {
    const supabase = getSupabase();
    if (!supabase) {
      return { user: null, session: null, error: 'Supabase is not configured. Please check connection settings.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      return { user: data.user, session: data.session, error: null };
    } catch (err: any) {
      return { user: null, session: null, error: err?.message || 'Authentication failed' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: null };

    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to sign out' };
    }
  },

  async resendVerification(email: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured' };

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to resend confirmation email' };
    }
  },

  async resetPasswordForEmail(email: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured' };

    try {
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: redirectUrl,
      });
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to send recovery email' };
    }
  },

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase is not configured' };

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to update password' };
    }
  },

  async getSession(): Promise<{ session: Session | null; user: User | null }> {
    const supabase = getSupabase();
    if (!supabase) return { session: null, user: null };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      return { session, user };
    } catch {
      return { session: null, user: null };
    }
  },
};
