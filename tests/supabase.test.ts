import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSupabaseConfig,
  setSupabaseConfig,
  isSupabaseConfigured,
  getSupabaseClient,
} from '../src/services/supabaseClient';
import { supabaseService } from '../src/services/supabaseService';
import { PlayerProfile } from '../src/types/player';

describe('Supabase Client & Service', () => {
  beforeEach(() => {
    // Clean mock localStorage
    setSupabaseConfig('', '');
  });

  it('detects unconfigured state cleanly', () => {
    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseClient()).toBeNull();
  });

  it('stores and retrieves configuration safely', () => {
    const testUrl = 'https://test-project.supabase.co';
    const testKey = 'test-anon-key-longer-than-ten-chars';

    setSupabaseConfig(testUrl, testKey);
    expect(isSupabaseConfigured()).toBe(true);

    const config = getSupabaseConfig();
    expect(config.url).toBe(testUrl);
    expect(config.anonKey).toBe(testKey);

    // Initializing client should not throw
    const client = getSupabaseClient();
    expect(client).not.toBeNull();
  });

  it('gracefully degrades when syncing without connection', async () => {
    setSupabaseConfig('', '');
    const mockProfile: PlayerProfile = {
      id: 'test-player',
      name: 'Tester',
      title: 'Novice',
      level: 1,
      civilizationXp: 100,
      domainScores: {
        architecture: 20,
        defence: 20,
        trade: 10,
        waterManagement: 25,
        heritage: 15,
        engineering: 10,
        language: 10,
      },
      completedExperiences: [],
      unlockedDiscoveries: [],
      unlockedAchievements: [],
      lastActiveAt: new Date().toISOString(),
      simulationMode: false,
    };

    const res = await supabaseService.syncProfileToCloud(mockProfile);
    expect(res.success).toBe(false);
    expect(res.error).toContain('not configured');
  });
});
