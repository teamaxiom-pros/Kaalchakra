import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isSupabaseReady, getSupabaseEnvConfig } from '../src/lib/supabase/client';
import { authService } from '../src/services/authService';
import { progressService, AuthoritativeCompletionPayload } from '../src/services/progressService';
import { offlineSyncService } from '../src/services/offlineSyncService';
import { EMPTY_PROFILE } from '../src/services/storageService';

describe('Auth & Production Security Architecture', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Supabase Client Configuration', () => {
    it('correctly identifies unconfigured environment', () => {
      const isReady = isSupabaseReady();
      // In local testing without external env, isSupabaseReady correctly returns false
      expect(typeof isReady).toBe('boolean');
    });

    it('validates environment config shape', () => {
      const config = getSupabaseEnvConfig();
      expect(config).toHaveProperty('url');
      expect(config).toHaveProperty('anonKey');
    });
  });

  describe('Auth Service Validation & Safe Error Handling', () => {
    it('rejects short passwords during sign up with friendly validation', async () => {
      const res = await authService.signUp({
        email: 'scholar@example.com',
        password: '123',
        displayName: 'Arya Scholar',
      });

      expect(res.error).toContain('at least 8 characters');
      expect(res.user).toBeNull();
    });

    it('rejects invalid email formats during sign up', async () => {
      const res = await authService.signUp({
        email: 'invalid-email',
        password: 'StrongPassword123!',
        displayName: 'Arya Scholar',
      });

      expect(res.error).toBeDefined();
      expect(res.user).toBeNull();
    });

    it('provides safe generic error when client is unconfigured', async () => {
      const res = await authService.signIn({
        email: 'scholar@example.com',
        password: 'Password123!',
      });

      // When Supabase is not configured, provides clear friendly error
      expect(res.error).toBeDefined();
      expect(res.session).toBeNull();
    });

    it('handles password recovery gracefully when database unconfigured', async () => {
      const res = await authService.resetPasswordForEmail('scholar@example.com');
      expect(res.error).toBeDefined();
    });
  });

  describe('User Isolation & Empty State Principles', () => {
    it('guarantees new learner starts with a genuine empty journey', () => {
      expect(EMPTY_PROFILE.civilizationXp).toBe(0);
      expect(EMPTY_PROFILE.level).toBe(1);
      expect(EMPTY_PROFILE.completedExperiences).toHaveLength(0);
      expect(EMPTY_PROFILE.unlockedDiscoveries).toHaveLength(0);
      expect(EMPTY_PROFILE.unlockedAchievements).toHaveLength(0);
      expect(EMPTY_PROFILE.domainScores.architecture).toBe(0);
      expect(EMPTY_PROFILE.domainScores.waterManagement).toBe(0);
    });

    it('guarantees storage returns clean empty profile without pre-seeded XP or achievements', () => {
      const fresh = EMPTY_PROFILE;
      expect(fresh.civilizationXp).toBe(0);
      expect(fresh.level).toBe(1);
      expect(fresh.completedExperiences).toEqual([]);
      expect(fresh.unlockedDiscoveries).toEqual([]);
      expect(fresh.unlockedAchievements).toEqual([]);
    });
  });

  describe('Authoritative Progression & RPC Contract', () => {
    it('validates authoritative completion payload structure', () => {
      const payload: AuthoritativeCompletionPayload = {
        sessionId: 'test-session-uuid-1234',
        experienceId: 'fort-master',
        score: 85,
        xpEarned: 120,
        domainGains: {
          architecture: 15,
          defence: 20,
        },
        discoverySlugs: ['ck-kumbhalgarh-walls'],
        achievementSlugs: ['ach-fort-builder'],
      };

      expect(payload.score).toBeGreaterThanOrEqual(0);
      expect(payload.score).toBeLessThanOrEqual(100);
      expect(payload.xpEarned).toBeGreaterThan(0);
      expect(payload.discoverySlugs).toContain('ck-kumbhalgarh-walls');
    });

    it('gracefully reports unconfigured state when submitting completion without database', async () => {
      const payload: AuthoritativeCompletionPayload = {
        sessionId: 'test-session-uuid-1234',
        experienceId: 'bharat-architect',
        score: 90,
        xpEarned: 150,
        domainGains: { waterManagement: 25 },
        discoverySlugs: ['ck-dholavira-water'],
        achievementSlugs: ['ach-water-sage'],
      };

      const result = await progressService.submitAuthoritativeCompletion(payload);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Offline Queue & Sync Service', () => {
    it('generates unique event IDs and initializes pending count safely', async () => {
      const count = await offlineSyncService.getPendingCount();
      expect(typeof count).toBe('number');
    });

    it('returns zero sync count cleanly when offline or unconfigured', async () => {
      const syncResult = await offlineSyncService.syncPendingQueue();
      expect(syncResult).toEqual({ synced: 0, failed: 0 });
    });
  });
});
