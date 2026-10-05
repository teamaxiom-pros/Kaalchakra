import { Achievement } from '../types/player';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-fort-architect',
    title: 'Fort Architect',
    description: 'Constructed and fortified your first Deccan hill stronghold in Fort Master.',
    icon: '🏰',
    domain: 'defence'
  },
  {
    id: 'ach-water-steward',
    title: 'Water Steward',
    description: 'Secured freshwater resilience against seasonal monsoons or droughts.',
    icon: '💧',
    domain: 'water-management'
  },
  {
    id: 'ach-master-builder',
    title: 'Master Builder',
    description: 'Engineered an egalitarian Harappan settlement with full drainage and road connectivity.',
    icon: '🏛️',
    domain: 'architecture'
  },
  {
    id: 'ach-cultural-detective',
    title: 'Cultural Detective',
    description: 'Investigated and matched ancient inscription fragments in Lost Script.',
    icon: '🧩',
    domain: 'heritage'
  },
  {
    id: 'ach-epigraphist',
    title: 'Royal Epigraphist',
    description: 'Deciphered an Ashokan edict or Harappan trade seal with high accuracy.',
    icon: '📜',
    domain: 'language'
  },
  {
    id: 'ach-civil-engineer',
    title: 'Hydraulic Pioneer',
    description: 'Engineered subterranean rainwater channels inspired by Dholavira.',
    icon: '⚙️',
    domain: 'engineering'
  },
  {
    id: 'ach-bharat-darshan',
    title: 'Bharat Darshan',
    description: 'Unlocked cultural discoveries across three distinct historical Indian regions.',
    icon: '🌏',
    domain: 'heritage'
  }
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(ach => ach.id === id);
}
