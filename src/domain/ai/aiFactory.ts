import { GameMasterProvider } from '../../types/ai';
import { DeterministicGameMaster } from './deterministicGameMaster';
import { GeminiGameMaster } from './geminiGameMaster';
import { isSupabaseReady } from '../../lib/supabase/client';

let activeProvider: GameMasterProvider | null = null;
let currentMode: 'local-deterministic' | 'gemini-live' = 'local-deterministic';

export function getGameMaster(): { provider: GameMasterProvider; mode: 'local-deterministic' | 'gemini-live' } {
  if (isSupabaseReady()) {
    if (!activeProvider || currentMode !== 'gemini-live') {
      activeProvider = new GeminiGameMaster();
      currentMode = 'gemini-live';
    }
  } else {
    if (!activeProvider || currentMode !== 'local-deterministic') {
      activeProvider = new DeterministicGameMaster();
      currentMode = 'local-deterministic';
    }
  }

  return { provider: activeProvider, mode: currentMode };
}

export function resetGameMasterProvider(): void {
  activeProvider = null;
}
