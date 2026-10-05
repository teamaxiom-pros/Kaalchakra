import {
  GameMasterProvider,
  EventContext,
  HintContext,
  RecommendationContext,
  GameMasterResponse
} from '../../types/ai';
import { DeterministicGameMaster } from './deterministicGameMaster';
import { getSupabase, isSupabaseReady } from '../../lib/supabase/client';

export class GeminiGameMaster implements GameMasterProvider {
  private fallback: DeterministicGameMaster;

  constructor() {
    this.fallback = new DeterministicGameMaster();
  }

  async explainEvent(input: EventContext): Promise<GameMasterResponse> {
    if (!isSupabaseReady()) {
      return this.fallback.explainEvent(input);
    }

    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.functions.invoke('game-master', {
          body: { operation: 'explain_event', payload: input },
        });

        if (!error && data && data.text) {
          return {
            title: data.title || 'Architectural Observation',
            narration: data.text,
            historicalContext: data.historicalContext || '',
            guidance: data.guidance || '',
            sourceAttribution: data.sourceAttribution || 'ASI / UNESCO Archive',
            mode: 'gemini-live',
          };
        }
      }
    } catch (err) {
      console.warn('Game Master Edge Function call failed, using deterministic fallback:', err);
    }

    return this.fallback.explainEvent(input);
  }

  async generateHint(input: HintContext): Promise<GameMasterResponse> {
    if (!isSupabaseReady()) {
      return this.fallback.generateHint(input);
    }

    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.functions.invoke('game-master', {
          body: { operation: 'generate_hint', payload: input },
        });

        if (!error && data && data.text) {
          return {
            title: data.title || 'Tactical Insight',
            narration: data.text,
            historicalContext: data.historicalContext || '',
            guidance: data.guidance || '',
            sourceAttribution: data.sourceAttribution || 'ASI Treatise',
            mode: 'gemini-live',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini hint generation failed, using fallback:', err);
    }

    return this.fallback.generateHint(input);
  }

  async recommendNext(input: RecommendationContext): Promise<GameMasterResponse> {
    if (!isSupabaseReady()) {
      return this.fallback.recommendNext(input);
    }

    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.functions.invoke('game-master', {
          body: { operation: 'recommend_next', payload: input },
        });

        if (!error && data && data.text) {
          return {
            title: data.title || 'Personalized Cultural Path',
            narration: data.text,
            historicalContext: data.historicalContext || '',
            guidance: data.guidance || '',
            sourceAttribution: data.sourceAttribution || 'Kaalchakra Game Master',
            mode: 'gemini-live',
          };
        }
      }
    } catch (err) {
      console.warn('Gemini recommendation failed, using fallback:', err);
    }

    return this.fallback.recommendNext(input);
  }
}
