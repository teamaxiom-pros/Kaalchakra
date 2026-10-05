import { CulturalDomain } from './cultural';

export type ExperienceCategory = 'play' | 'build' | 'explore';
export type ExperienceStatus = 'playable' | 'preview';
export type ExperienceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExperienceDefinition {
  id: string;
  title: string;
  tagline: string;
  category: ExperienceCategory;
  description: string;
  culturalFocus: CulturalDomain[];
  status: ExperienceStatus;
  difficulty: ExperienceDifficulty;
  estimatedTime: string;
  badgeIcon: string;
  route: string;
  previewFocus?: string[];
  bannerHighlight: string;
}

export type GameActionType =
  | 'started'
  | 'choice_selected'
  | 'structure_placed'
  | 'structure_removed'
  | 'puzzle_solved'
  | 'event_triggered'
  | 'discovery_unlocked'
  | 'completed'
  | 'reset';

export interface GameAction {
  eventId: string;
  sessionId: string;
  experienceId: string;
  type: GameActionType;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface GameSession {
  sessionId: string;
  experienceId: string;
  startedAt: string;
  completedAt?: string;
  actions: GameAction[];
  score: number;
  xpEarned: number;
  discoveriesUnlocked: string[];
  consequencesSummary?: string;
}
