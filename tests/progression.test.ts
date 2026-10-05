import { describe, it, expect } from 'vitest';
import {
  calculateLevel,
  recordExperienceCompletion,
} from '../src/domain/progression/progressionEngine';
import { recommendNextExperience } from '../src/domain/progression/recommendationEngine';
import { PlayerProfile } from '../src/types/player';

describe('Progression and Recommendation Engines', () => {
  const mockProfile: PlayerProfile = {
    id: 'test-1',
    name: 'Explorer',
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

  it('calculates player levels and titles accurately', () => {
    expect(calculateLevel(0).level).toBe(1);
    expect(calculateLevel(300).level).toBe(2);
    expect(calculateLevel(600).level).toBe(3);
  });

  it('updates domain mastery and unlocks achievements upon completion', () => {
    const { updatedProfile, newAchievements } = recordExperienceCompletion(
      mockProfile,
      'fort-master',
      150,
      { waterManagement: 25, defence: 20 },
      ['ck-shivneri-rainwater'],
      85
    );

    expect(updatedProfile.civilizationXp).toBe(250);
    expect(updatedProfile.level).toBe(2);
    expect(updatedProfile.domainScores.waterManagement).toBe(50);
    expect(updatedProfile.completedExperiences).toContain('fort-master');
    expect(newAchievements).toContain('ach-fort-architect');
    expect(newAchievements).toContain('ach-water-steward');
  });

  it('recommends next experience logically with human-readable rationale', () => {
    const recAfterFort = recommendNextExperience(mockProfile, 'fort-master');
    expect(recAfterFort.experienceId).toBe('bharat-architect');
    expect(recAfterFort.reason).toContain('Bharat Architect');
  });
});
