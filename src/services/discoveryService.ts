import { getSupabase } from '../lib/supabase/client';
import { CULTURAL_DATABASE } from '../data/culturalDatabase';
import { CulturalKnowledge } from '../types/cultural';

export const discoveryService = {
  async getAllPublishedDiscoveries(): Promise<CulturalKnowledge[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return CULTURAL_DATABASE;
    }

    try {
      const { data, error } = await supabase
        .from('cultural_discoveries')
        .select('*')
        .eq('published', true);

      if (error || !data || data.length === 0) {
        return CULTURAL_DATABASE;
      }

      return data.map(row => ({
        id: row.slug,
        title: row.title,
        subtitle: row.subtitle || undefined,
        region: row.region as any,
        era: row.era as any,
        domain: row.domains as any,
        summary: row.summary,
        significance: row.significance,
        sourceName: row.source_name,
        sourceUrl: row.source_url,
        relatedExperiences: row.related_experience_ids,
        keyQuote: row.key_quote || undefined,
        practicalInsight: row.practical_insight || undefined,
      }));
    } catch {
      return CULTURAL_DATABASE;
    }
  },

  async getUserUnlockedDiscoverySlugs(playerId: string): Promise<string[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('player_discoveries')
        .select('cultural_discoveries(slug)')
        .eq('player_id', playerId);

      if (error || !data) return [];
      return data
        .map((row: any) => row.cultural_discoveries?.slug)
        .filter(Boolean);
    } catch {
      return [];
    }
  },
};
