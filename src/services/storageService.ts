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

export const storageService = {
  loadPlayerProfile(): PlayerProfile {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return EMPTY_PROFILE;
      }
      const data = localStorage.getItem(STORAGE_KEYS.PLAYER);
      if (!data) {
        return EMPTY_PROFILE;
      }
      return JSON.parse(data) as PlayerProfile;
    } catch (err) {
      console.warn('Failed to load profile from localStorage:', err);
      return EMPTY_PROFILE;
    }
  },

  savePlayerProfile(profile: PlayerProfile): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.setItem(STORAGE_KEYS.PLAYER, JSON.stringify(profile));
    } catch (err) {
      console.warn('Failed to save profile to localStorage:', err);
    }
  },

  loadGameSessions(): GameSession[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('Failed to load sessions from localStorage:', err);
      return [];
    }
  },

  saveGameSession(session: GameSession): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const sessions = this.loadGameSessions();
      sessions.unshift(session);
      // Keep last 25 sessions
      const trimmed = sessions.slice(0, 25);
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(trimmed));
    } catch (err) {
      console.warn('Failed to save game session:', err);
    }
  },

  resetJourney(): PlayerProfile {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(STORAGE_KEYS.PLAYER);
        localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      }
      return EMPTY_PROFILE;
    } catch (err) {
      console.warn('Failed to reset journey:', err);
      return EMPTY_PROFILE;
    }
  },
};
