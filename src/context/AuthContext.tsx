import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabase, isSupabaseReady } from '../lib/supabase/client';
import { authService, SignUpParams, SignInParams } from '../services/authService';
import { profileService, ProfileRecord } from '../services/profileService';
import { progressService, PlayerProgressRecord } from '../services/progressService';
import { offlineSyncService } from '../services/offlineSyncService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileRecord | null;
  playerProgress: PlayerProgressRecord | null;
  loading: boolean;
  initialized: boolean;
  isEmailVerified: boolean;
  isConfigured: boolean;
  signIn: (params: SignInParams) => Promise<{ error: string | null }>;
  signUp: (params: SignUpParams) => Promise<{ user: User | null; session: Session | null; error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgressRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  const isConfigured = isSupabaseReady();

  const loadUserData = async (currentUser: User) => {
    try {
      const [userProfile, progress] = await Promise.all([
        profileService.getOwnProfile(currentUser.id),
        progressService.getPlayerProgress(currentUser.id),
      ]);
      setProfile(userProfile);
      setPlayerProgress(progress);

      // Trigger background sync for any queued offline sessions
      offlineSyncService.syncPendingQueue().catch(() => {});
    } catch (err) {
      console.warn('Failed to load user profile or progress:', err);
    }
  };

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      setInitialized(true);
      return;
    }

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      const currentUser = initialSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        loadUserData(currentUser).finally(() => {
          setLoading(false);
          setInitialized(true);
        });
      } else {
        setLoading(false);
        setInitialized(true);
      }
    });

    // 2. Real-time Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        const currentUser = newSession?.user ?? null;
        setUser(currentUser);

        if (event === 'SIGNED_IN' && currentUser) {
          setLoading(true);
          await loadUserData(currentUser);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setPlayerProgress(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (params: SignInParams) => {
    setLoading(true);
    const res = await authService.signIn(params);
    if (res.user) {
      await loadUserData(res.user);
    }
    setLoading(false);
    return { error: res.error };
  };

  const signUp = async (params: SignUpParams) => {
    setLoading(true);
    const res = await authService.signUp(params);
    if (res.user) {
      await loadUserData(res.user);
    }
    setLoading(false);
    return res;
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setPlayerProgress(null);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    return authService.resetPasswordForEmail(email);
  };

  const updatePassword = async (newPassword: string) => {
    return authService.updatePassword(newPassword);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserData(user);
    }
  };

  const isEmailVerified = Boolean(user && user.email_confirmed_at);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        playerProgress,
        loading,
        initialized,
        isEmailVerified,
        isConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
