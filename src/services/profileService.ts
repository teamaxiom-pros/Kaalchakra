import { getSupabase } from '../lib/supabase/client';
import { Database, UserRole } from '../types/database';

export type ProfileRecord = Database['public']['Tables']['profiles']['Row'];

export const profileService = {
  async getOwnProfile(userId: string): Promise<ProfileRecord | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching own profile:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Exception fetching profile:', err);
      return null;
    }
  },

  async updateOwnProfile(
    userId: string,
    updates: { displayName?: string; preferredLanguage?: string; avatarUrl?: string }
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase();
    if (!supabase) return { success: false, error: 'Database not connected' };

    try {
      const payload: Database['public']['Tables']['profiles']['Update'] = {
        updated_at: new Date().toISOString(),
      };
      if (updates.displayName !== undefined) payload.display_name = updates.displayName.trim();
      if (updates.preferredLanguage !== undefined) payload.preferred_language = updates.preferredLanguage;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update profile' };
    }
  },
};
