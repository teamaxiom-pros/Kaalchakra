import { PlayerProfile, ExperienceRecommendation } from '../../types/player';
import { CulturalDomain } from '../../types/cultural';

export function recommendNextExperience(
  profile: PlayerProfile,
  lastCompletedExperienceId?: string
): ExperienceRecommendation {
  const scores = profile.domainScores;
  const completed = new Set(profile.completedExperiences);

  // If Fort Master was just completed
  if (lastCompletedExperienceId === 'fort-master') {
    if (!completed.has('bharat-architect')) {
      return {
        experienceId: 'bharat-architect',
        reason:
          'You mastered high-altitude fort resilience. Next, discover how Harappan engineers managed water flow and urban sanitation at ground level in Bharat Architect.',
        knowledgeFocus: 'architecture',
        generatedBy: 'deterministic'
      };
    }
    return {
      experienceId: 'lost-script',
      reason:
        'You have fortified physical defenses. Now investigate the epigraphical records and trade seals of ancient India in Lost Script.',
      knowledgeFocus: 'heritage',
      generatedBy: 'deterministic'
    };
  }

  // If Bharat Architect was just completed
  if (lastCompletedExperienceId === 'bharat-architect') {
    if (!completed.has('lost-script')) {
      return {
        experienceId: 'lost-script',
        reason:
          'You built a Harappan city grid. Now examine the clay seals and decipher the symbolic inscriptions left behind by bronze-age merchants in Lost Script.',
        knowledgeFocus: 'language',
        generatedBy: 'deterministic'
      };
    }
    return {
      experienceId: 'fort-master',
      reason:
        'With your civil engineering experience, scale up to mountain fortification and monsoon resilience in Fort Master.',
      knowledgeFocus: 'defence',
      generatedBy: 'deterministic'
    };
  }

  // If Lost Script was just completed
  if (lastCompletedExperienceId === 'lost-script') {
    if (!completed.has('fort-master')) {
      return {
        experienceId: 'fort-master',
        reason:
          'You deciphered royal edicts. Now experience the tactical architectural planning of Deccan fortresses in Fort Master.',
        knowledgeFocus: 'defence',
        generatedBy: 'deterministic'
      };
    }
    return {
      experienceId: 'bharat-architect',
      reason:
        'Translate ancient inscriptions into tangible civil architecture in Bharat Architect.',
      knowledgeFocus: 'engineering',
      generatedBy: 'deterministic'
    };
  }

  // Fallback based on lowest domain score
  const domains: { domain: CulturalDomain; score: number; experienceId: string }[] = [
    { domain: 'architecture', score: scores.architecture, experienceId: 'bharat-architect' },
    { domain: 'defence', score: scores.defence, experienceId: 'fort-master' },
    { domain: 'water-management', score: scores.waterManagement, experienceId: 'fort-master' },
    { domain: 'language', score: scores.language, experienceId: 'lost-script' },
    { domain: 'engineering', score: scores.engineering, experienceId: 'bharat-architect' },
    { domain: 'heritage', score: scores.heritage, experienceId: 'lost-script' },
  ];

  domains.sort((a, b) => a.score - b.score);
  const lowest = domains[0];

  return {
    experienceId: lowest.experienceId,
    reason: `Your cultural journey is ready to deepen its ${lowest.domain.replace('-', ' ')} foundation. Explore an interactive challenge designed to strengthen this area.`,
    knowledgeFocus: lowest.domain,
    generatedBy: 'deterministic'
  };
}
