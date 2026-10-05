import { PlayerProfile, DomainScores } from '../../types/player';
import { CulturalDomain } from '../../types/cultural';
import { CULTURAL_DATABASE } from '../../data/culturalDatabase';
import { ACHIEVEMENTS } from '../../data/achievements';

const TITLES_BY_LEVEL = [
  'Novice Explorer',
  'Heritage Seeker',
  'Civilization Craftsman',
  'Fort Master & Planner',
  'Royal Architect',
  'Durgadhyaksha & Sage Scholar',
];

export function calculateLevel(xp: number): { level: number; title: string } {
  const level = Math.max(1, Math.floor(xp / 250) + 1);
  const titleIndex = Math.min(level - 1, TITLES_BY_LEVEL.length - 1);
  return { level, title: TITLES_BY_LEVEL[titleIndex] };
}

export function recordExperienceCompletion(
  currentProfile: PlayerProfile,
  experienceId: string,
  xpEarned: number,
  domainGains: Partial<DomainScores>,
  unlockedDiscoveryIds: string[],
  performanceRating: number // 0 - 100
): { updatedProfile: PlayerProfile; newAchievements: string[] } {
  const newXp = currentProfile.civilizationXp + xpEarned;
  const { level, title } = calculateLevel(newXp);

  // Update domain scores (clamped 0 to 100)
  const updatedDomainScores: DomainScores = { ...currentProfile.domainScores };
  (Object.keys(domainGains) as (keyof DomainScores)[]).forEach(domain => {
    const gain = domainGains[domain] || 0;
    updatedDomainScores[domain] = Math.min(100, (updatedDomainScores[domain] || 0) + gain);
  });

  // Unique completed experiences
  const completed = Array.from(new Set([...currentProfile.completedExperiences, experienceId]));

  // Unique discoveries
  const discoveries = Array.from(
    new Set([...currentProfile.unlockedDiscoveries, ...unlockedDiscoveryIds])
  );

  // Evaluate achievements
  const existingAchievements = new Set(currentProfile.unlockedAchievements);
  const newAchievements: string[] = [];

  // Check Fort Architect
  if (experienceId === 'fort-master' && !existingAchievements.has('ach-fort-architect')) {
    existingAchievements.add('ach-fort-architect');
    newAchievements.push('ach-fort-architect');
  }

  // Check Water Steward
  if (
    (experienceId === 'fort-master' || experienceId === 'bharat-architect') &&
    (updatedDomainScores.waterManagement >= 45 || performanceRating >= 70) &&
    !existingAchievements.has('ach-water-steward')
  ) {
    existingAchievements.add('ach-water-steward');
    newAchievements.push('ach-water-steward');
  }

  // Check Master Builder
  if (experienceId === 'bharat-architect' && !existingAchievements.has('ach-master-builder')) {
    existingAchievements.add('ach-master-builder');
    newAchievements.push('ach-master-builder');
  }

  // Check Hydraulic Pioneer
  if (
    experienceId === 'bharat-architect' &&
    performanceRating >= 80 &&
    !existingAchievements.has('ach-civil-engineer')
  ) {
    existingAchievements.add('ach-civil-engineer');
    newAchievements.push('ach-civil-engineer');
  }

  // Check Cultural Detective
  if (experienceId === 'lost-script' && !existingAchievements.has('ach-cultural-detective')) {
    existingAchievements.add('ach-cultural-detective');
    newAchievements.push('ach-cultural-detective');
  }

  // Check Epigraphist
  if (
    experienceId === 'lost-script' &&
    performanceRating >= 80 &&
    !existingAchievements.has('ach-epigraphist')
  ) {
    existingAchievements.add('ach-epigraphist');
    newAchievements.push('ach-epigraphist');
  }

  // Check Bharat Darshan (discoveries across 3 distinct regions)
  if (!existingAchievements.has('ach-bharat-darshan')) {
    const discoveredRegions = new Set(
      discoveries
        .map(id => CULTURAL_DATABASE.find(item => item.id === id)?.region)
        .filter(Boolean)
    );
    if (discoveredRegions.size >= 3) {
      existingAchievements.add('ach-bharat-darshan');
      newAchievements.push('ach-bharat-darshan');
    }
  }

  const updatedProfile: PlayerProfile = {
    ...currentProfile,
    level,
    title,
    civilizationXp: newXp,
    domainScores: updatedDomainScores,
    completedExperiences: completed,
    unlockedDiscoveries: discoveries,
    unlockedAchievements: Array.from(existingAchievements),
    lastActiveAt: new Date().toISOString(),
  };

  return { updatedProfile, newAchievements };
}
