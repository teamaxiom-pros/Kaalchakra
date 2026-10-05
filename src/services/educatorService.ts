import { getSupabase } from '../lib/supabase/client';
import { Database } from '../types/database';

export interface LinkedLearnerSummary {
  learnerId: string;
  displayName: string;
  status: 'pending' | 'active' | 'revoked';
  level: number;
  xp: number;
  lastActiveAt?: string;
}

export const educatorService = {
  async getLinkedLearners(): Promise<LinkedLearnerSummary[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('educator_learners')
        .select(`
          learner_id,
          status,
          profiles!educator_learners_learner_id_fkey (
            display_name,
            last_active_at,
            player_progress (
              level,
              xp
            )
          )
        `)
        .eq('educator_id', user.id);

      if (error || !data) {
        return [];
      }

      return data.map((row: any) => {
        const prof = row.profiles;
        const prog = Array.isArray(prof?.player_progress) ? prof.player_progress[0] : prof?.player_progress;
        return {
          learnerId: row.learner_id,
          displayName: prof?.display_name || 'Anonymous Scholar',
          status: row.status,
          level: prog?.level || 1,
          xp: prog?.xp || 0,
          lastActiveAt: prof?.last_active_at,
        };
      });
    } catch {
      return [];
    }
  },
};
