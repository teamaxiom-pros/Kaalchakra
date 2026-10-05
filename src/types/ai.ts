import { CulturalDomain } from './cultural';
import { DomainScores } from './player';

export interface EventContext {
  experienceId: string;
  eventName: string;
  gameSummary: string;
  playerChoices: string[];
  consequenceRating: 'optimal' | 'moderate' | 'critical';
  relevantDomain: CulturalDomain;
}

export interface HintContext {
  experienceId: string;
  currentState: string;
  objective: string;
  resourcesLeft?: Record<string, number>;
  relevantDomain: CulturalDomain;
}

export interface RecommendationContext {
  playerLevel: number;
  xp: number;
  domainScores: DomainScores;
  completedExperiences: string[];
  lastPlayedExperienceId?: string;
}

export interface GameMasterResponse {
  title: string;
  narration: string;
  historicalContext: string;
  guidance?: string;
  sourceAttribution?: string;
  mode: 'local-deterministic' | 'gemini-live';
}

export interface GameMasterProvider {
  explainEvent(input: EventContext): Promise<GameMasterResponse>;
  generateHint(input: HintContext): Promise<GameMasterResponse>;
  recommendNext(input: RecommendationContext): Promise<GameMasterResponse>;
}
