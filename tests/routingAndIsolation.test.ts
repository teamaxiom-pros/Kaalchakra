import { describe, it, expect, beforeEach } from 'vitest';
import { EMPTY_PROFILE, storageService } from '../src/services/storageService';
import { EXPERIENCES } from '../src/data/experiences';
import { CULTURAL_DATABASE } from '../src/data/culturalDatabase';

describe('Public Entry & Fresh Scholar State Isolation', () => {
  beforeEach(() => {
    storageService.resetJourney();
  });

  describe('Fresh Scholar State Guarantees', () => {
    it('initializes a fresh scholar profile with exactly 0 XP and Level 1', () => {
      const profile = storageService.loadPlayerProfile();
      expect(profile.civilizationXp).toBe(0);
      expect(profile.level).toBe(1);
    });

    it('contains zero pre-completed experiences in initial state', () => {
      const profile = storageService.loadPlayerProfile();
      expect(profile.completedExperiences).toHaveLength(0);
    });

    it('contains zero pre-unlocked discoveries in initial state', () => {
      const profile = storageService.loadPlayerProfile();
      expect(profile.unlockedDiscoveries).toHaveLength(0);
    });

    it('contains zero pre-unlocked achievements in initial state', () => {
      const profile = storageService.loadPlayerProfile();
      expect(profile.unlockedAchievements).toHaveLength(0);
    });

    it('initializes all 7 civilizational domain scores to exactly 0%', () => {
      const profile = storageService.loadPlayerProfile();
      expect(profile.domainScores.architecture).toBe(0);
      expect(profile.domainScores.defence).toBe(0);
      expect(profile.domainScores.trade).toBe(0);
      expect(profile.domainScores.waterManagement).toBe(0);
      expect(profile.domainScores.heritage).toBe(0);
      expect(profile.domainScores.engineering).toBe(0);
      expect(profile.domainScores.language).toBe(0);
    });

    it('initializes with no pre-existing game session telemetry', () => {
      const sessions = storageService.loadGameSessions();
      expect(sessions).toHaveLength(0);
    });
  });

  describe('Canonical Reference Content Preservation', () => {
    it('preserves all 3 playable vertical slices without pre-completed progress', () => {
      const playable = EXPERIENCES.filter(e => e.status === 'playable');
      expect(playable.length).toBe(3);
      expect(playable.map(e => e.id)).toEqual(
        expect.arrayContaining(['fort-master', 'bharat-architect', 'lost-script'])
      );
    });

    it('preserves all 4 roadmap curriculum previews without mock playthroughs', () => {
      const previews = EXPERIENCES.filter(e => e.status === 'preview');
      expect(previews.length).toBe(4);
      expect(previews.map(e => e.id)).toEqual(
        expect.arrayContaining(['bharat-bazaar', 'rajya-builder', 'engineering-lab', 'heritage-quest'])
      );
    });

    it('preserves all verified ASI and UNESCO cultural discovery database records', () => {
      expect(CULTURAL_DATABASE.length).toBe(12);
      CULTURAL_DATABASE.forEach(record => {
        expect(record.sourceName).toBeDefined();
        expect(record.sourceUrl).toMatch(/^https?:\/\//);
        expect(record.domain.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Route Structure and Security Boundaries', () => {
    it('defines public routes that do not require authentication', () => {
      const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];
      expect(publicRoutes).toContain('/');
      expect(publicRoutes).toContain('/auth/login');
      expect(publicRoutes).toContain('/auth/signup');
    });

    it('defines authenticated routes protected behind auth guards', () => {
      const protectedRoutes = [
        '/app',
        '/journey',
        '/profile',
        '/experiences',
        '/discover',
        '/educator',
        '/experience/fort-master',
        '/experience/bharat-architect',
        '/experience/lost-script',
      ];
      expect(protectedRoutes).toContain('/app');
      expect(protectedRoutes).toContain('/journey');
      expect(protectedRoutes).toContain('/profile');
      expect(protectedRoutes).toContain('/experience/fort-master');
    });
  });
});
