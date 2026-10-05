import { getSupabase } from '../lib/supabase/client';
import { Database } from '../types/database';

export type GameSessionRecord = Database['public']['Tables']['game_sessions']['Row'];

export const sessionService = {
  async startSession(experienceId: string, seed?: string): Promise<string | null> {
    const supabase = getSupabase();
    if (!supabase) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const sessionId = crypto.randomUUID();
      const { error } = await supabase.from('game_sessions').insert({
        id: sessionId,
        player_id: user.id,
        experience_id: experienceId,
        status: 'started',
        score: 0,
        xp_earned: 0,
        seed: seed || null,
        metadata: {},
        started_at: new Date().toISOString(),
      });

      if (error) {
        console.warn('Failed to insert game session:', error.message);
        return null;
      }
      return sessionId;
    } catch (err) {
      console.warn('Exception starting session:', err);
      return null;
    }
  },

  async recordAction(
    sessionId: string,
    experienceId: string,
    eventType: string,
    payload: any,
    eventId?: string
  ): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const finalEventId = eventId || crypto.randomUUID();

      const { error } = await supabase.from('game_actions').insert({
        event_id: finalEventId,
        session_id: sessionId,
        player_id: user.id,
        experience_id: experienceId,
        event_type: eventType,
        payload,
        occurred_at: new Date().toISOString(),
      });

      return !error;
    } catch {
      return false;
    }
  },

  async getRecentSessions(playerId: string, limit = 10): Promise<GameSessionRecord[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },
};
