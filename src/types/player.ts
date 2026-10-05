import { CulturalDomain } from './cultural';

export interface DomainScores {
  architecture: number;
  defence: number;
  trade: number;
  waterManagement: number;
  heritage: number;
  engineering: number;
  language: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  domain: CulturalDomain;
  unlockedAt?: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  title: string;
  level: number;
  civilizationXp: number;
  domainScores: DomainScores;
  completedExperiences: string[];
  unlockedDiscoveries: string[];
  unlockedAchievements: string[];
  lastActiveAt: string;
  simulationMode: boolean; // Smart board simulation toggle
}

export interface ExperienceRecommendation {
  experienceId: string;
  reason: string;
  knowledgeFocus: CulturalDomain;
  generatedBy: 'deterministic' | 'gemini';
}
