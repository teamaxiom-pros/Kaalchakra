import { getSupabase } from '../lib/supabase/client';
import { Database } from '../types/database';

export type PlayerProgressRecord = Database['public']['Tables']['player_progress']['Row'];

export interface AuthoritativeCompletionPayload {
  sessionId: string;
  experienceId: string;
  score: number;
  xpEarned: number;
  domainGains: Record<string, number>;
  discoverySlugs: string[];
  achievementSlugs: string[];
}

export const progressService = {
  async getPlayerProgress(playerId: string): Promise<PlayerProgressRecord | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('player_progress')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching player progress:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Exception in getPlayerProgress:', err);
      return null;
    }
  },

  async submitAuthoritativeCompletion(
    payload: AuthoritativeCompletionPayload
  ): Promise<{ success: boolean; progress?: PlayerProgressRecord; error?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, error: 'Database not connected' };
    }

    try {
      const { data, error } = await supabase.rpc('complete_game_session', {
        p_session_id: payload.sessionId,
        p_experience_id: payload.experienceId,
        p_score: payload.score,
        p_xp_earned: payload.xpEarned,
        p_domain_gains: payload.domainGains,
        p_discovery_slugs: payload.discoverySlugs,
        p_achievement_slugs: payload.achievementSlugs,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Re-fetch updated authoritative progress
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const updated = await this.getPlayerProgress(user.id);
        return { success: true, progress: updated ?? undefined };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to finalize session' };
    }
  },
};
