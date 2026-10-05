import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import { PlayerProfile } from '../types/player';
import { GameSession } from '../types/experience';

export interface CloudSyncStatus {
  status: 'offline' | 'configured' | 'synced' | 'syncing' | 'error';
  lastSyncedAt?: string;
  message?: string;
}

export const supabaseService = {
  async syncProfileToCloud(profile: PlayerProfile): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, error: 'Supabase is not configured' };
    }

    try {
      const payload = {
        id: profile.id,
        name: profile.name,
        title: profile.title,
        level: profile.level,
        civilization_xp: profile.civilizationXp,
        domain_scores: profile.domainScores,
        unlocked_discoveries: profile.unlockedDiscoveries,
        unlocked_achievements: profile.unlockedAchievements,
        simulation_mode: profile.simulationMode,
        last_active_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await client
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase profile sync warning:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.warn('Supabase profile sync exception:', err);
      return { success: false, error: err?.message || 'Network exception' };
    }
  },

  async fetchProfileFromCloud(playerId: string): Promise<PlayerProfile | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', playerId)
        .maybeSingle();

      if (error || !data) return null;

      const profile: PlayerProfile = {
        id: data.id,
        name: data.name,
        title: data.title,
        level: data.level,
        civilizationXp: data.civilization_xp,
        domainScores: data.domain_scores,
        completedExperiences: [],
        unlockedDiscoveries: data.unlocked_discoveries || [],
        unlockedAchievements: data.unlocked_achievements || [],
        lastActiveAt: data.last_active_at || new Date().toISOString(),
        simulationMode: Boolean(data.simulation_mode),
      };

      return profile;
    } catch (err) {
      console.warn('Failed to fetch cloud profile:', err);
      return null;
    }
  },

  async saveSessionToCloud(session: GameSession, playerId: string): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    if (!client) return { success: false, error: 'Supabase not configured' };

    try {
      const payload = {
        session_id: session.sessionId,
        player_id: playerId,
        experience_id: session.experienceId,
        score: session.score,
        xp_earned: session.xpEarned,
        discoveries_unlocked: session.discoveriesUnlocked,
        started_at: session.startedAt,
        completed_at: session.completedAt || new Date().toISOString(),
      };

      const { error } = await client.from('game_sessions').insert(payload);
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network exception' };
    }
  },

  async syncAllLocalDataToCloud(
    profile: PlayerProfile,
    sessions: GameSession[]
  ): Promise<{ success: boolean; syncedSessions: number; error?: string }> {
    const profileRes = await this.syncProfileToCloud(profile);
    if (!profileRes.success) {
      return { success: false, syncedSessions: 0, error: profileRes.error };
    }

    let syncedCount = 0;
    for (const s of sessions.slice(0, 10)) {
      const sRes = await this.saveSessionToCloud(s, profile.id);
      if (sRes.success) syncedCount++;
    }

    return { success: true, syncedSessions: syncedCount };
  },
};
