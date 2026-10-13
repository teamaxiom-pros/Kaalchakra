import { PlayerProfile } from '../types/player';
import { GameSession } from '../types/experience';

const STORAGE_KEYS = {
  PLAYER: 'kaalchakra:player',
  SESSIONS: 'kaalchakra:sessions',
  SETTINGS: 'kaalchakra:settings',
};

export const EMPTY_PROFILE: PlayerProfile = {
  id: '',
  name: 'Scholar',
  title: 'Novice Historian',
  level: 1,
  civilizationXp: 0,
  domainScores: {
    architecture: 0,
    defence: 0,
    trade: 0,
    waterManagement: 0,
    heritage: 0,
    engineering: 0,
    language: 0,
  },
  completedExperiences: [],
  unlockedDiscoveries: [],
  unlockedAchievements: [],
  lastActiveAt: new Date().toISOString(),
  simulationMode: false,
};

const getPlayerKey = (userId?: string) => userId ? `kaalchakra:player:${userId}` : STORAGE_KEYS.PLAYER;
const getSessionsKey = (userId?: string) => userId ? `kaalchakra:sessions:${userId}` : STORAGE_KEYS.SESSIONS;

export const storageService = {
  loadPlayerProfile(userId?: string): PlayerProfile {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return { ...EMPTY_PROFILE, id: userId || '' };
      }
      const key = getPlayerKey(userId);
      const data = localStorage.getItem(key);
      if (!data) {
        return { ...EMPTY_PROFILE, id: userId || '' };
      }
      const parsed = JSON.parse(data) as PlayerProfile;
      return { ...EMPTY_PROFILE, ...parsed, id: userId || parsed.id || '' };
    } catch (err) {
      console.warn('Failed to load profile from localStorage:', err);
      return { ...EMPTY_PROFILE, id: userId || '' };
    }
  },

  savePlayerProfile(profile: PlayerProfile, userId?: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const targetId = userId || profile.id;
      const key = getPlayerKey(targetId);
      localStorage.setItem(key, JSON.stringify(profile));
    } catch (err) {
      console.warn('Failed to save profile to localStorage:', err);
    }
  },

  loadGameSessions(userId?: string): GameSession[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const key = getSessionsKey(userId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('Failed to load sessions from localStorage:', err);
      return [];
    }
  },

  saveGameSession(session: GameSession, userId?: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const sessions = this.loadGameSessions(userId);
      sessions.unshift(session);
      // Keep last 25 sessions
      const trimmed = sessions.slice(0, 25);
      const key = getSessionsKey(userId);
      localStorage.setItem(key, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('Failed to save game session:', err);
    }
  },

  resetJourney(userId?: string): PlayerProfile {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (userId) {
          localStorage.removeItem(getPlayerKey(userId));
          localStorage.removeItem(getSessionsKey(userId));
        } else {
          localStorage.removeItem(STORAGE_KEYS.PLAYER);
          localStorage.removeItem(STORAGE_KEYS.SESSIONS);
        }
      }
      return { ...EMPTY_PROFILE, id: userId || '' };
    } catch (err) {
      console.warn('Failed to reset journey:', err);
      return { ...EMPTY_PROFILE, id: userId || '' };
    }
  },
};
