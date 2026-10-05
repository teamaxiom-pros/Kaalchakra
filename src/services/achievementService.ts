import { getSupabase } from '../lib/supabase/client';
import { ACHIEVEMENTS } from '../data/achievements';
import { Achievement } from '../types/player';

export const achievementService = {
  async getAllPublishedAchievements(): Promise<Achievement[]> {
    const supabase = getSupabase();
    if (!supabase) return ACHIEVEMENTS;

    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('published', true);

      if (error || !data || data.length === 0) return ACHIEVEMENTS;

      return data.map(row => ({
        id: row.slug,
        title: row.name,
        description: row.description,
        icon: row.icon,
        domain: row.domain as any,
      }));
    } catch {
      return ACHIEVEMENTS;
    }
  },

  async getUserUnlockedAchievementSlugs(playerId: string): Promise<string[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('player_achievements')
        .select('achievements(slug)')
        .eq('player_id', playerId);

      if (error || !data) return [];
      return data
        .map((row: any) => row.achievements?.slug)
        .filter(Boolean);
    } catch {
      return [];
    }
  },
};
