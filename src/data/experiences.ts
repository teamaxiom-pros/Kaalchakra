import { ExperienceDefinition } from '../types/experience';

export const EXPERIENCES: ExperienceDefinition[] = [
  {
    id: 'fort-master',
    title: 'Fort Master: Bastions & Monsoon',
    tagline: 'Design, fortify, and sustain a Deccan hill fortress through extreme seasonal crises.',
    category: 'play',
    description:
      'Step into the role of a Durgadhyaksha (Fort Planner). Construct rock-cut rainwater cisterns (tankas), elevated granaries (amberkhana), archer watchtowers, and bastion gates atop high basalt cliffs. Balance stone, water, grain, and strategic knowledge before the intense seasonal monsoon and prolonged sieges test your fortress.',
    culturalFocus: ['architecture', 'defence', 'water-management', 'engineering'],
    status: 'playable',
    difficulty: 'intermediate',
    estimatedTime: '6 – 8 mins',
    badgeIcon: '🏰',
    route: '/kaalchakra/experience/fort-master',
    bannerHighlight: 'Playable Flagship Slice • Maharashtra Hill Fort Architecture'
  },
  {
    id: 'bharat-architect',
    title: 'Bharat Architect: Harappan Grid',
    tagline: 'Plan an egalitarian bronze-age settlement balanced for hydraulic drainage and civic harmony.',
    category: 'build',
    description:
      'Engineered in the tradition of Dholavira and Mohenjo-daro. Lay out residential blocks, paved brick thoroughfares, covered wastewater drainage channels, public water reservoirs, and communal granaries. Solve civil engineering challenges: prevent monsoon flooding while ensuring municipal water access for all citizens.',
    culturalFocus: ['architecture', 'engineering', 'water-management'],
    status: 'playable',
    difficulty: 'intermediate',
    estimatedTime: '5 – 7 mins',
    badgeIcon: '🏛️',
    route: '/kaalchakra/experience/bharat-architect',
    bannerHighlight: 'Playable Construction Slice • Harappan Hydraulic Civil Engineering'
  },
  {
    id: 'lost-script',
    title: 'Lost Script: The Ashokan Epigraph',
    tagline: 'Investigate ancient symbols, match glyph fragments, and uncover India’s oldest written decrees.',
    category: 'explore',
    description:
      'Assume the role of an epigraphical researcher at the Archaeological Survey of India. Examine weathered stone monoliths and Harappan steatite seals. Match phonetic glyphs, reconstruct fragmented inscriptions, and unlock the philosophical edicts of Emperor Ashoka and the maritime trade tokens of Lothal.',
    culturalFocus: ['language', 'heritage', 'trade'],
    status: 'playable',
    difficulty: 'beginner',
    estimatedTime: '4 – 6 mins',
    badgeIcon: '📜',
    route: '/kaalchakra/experience/lost-script',
    bannerHighlight: 'Playable Investigation Slice • Brahmi & Harappan Epigraphy'
  },
  {
    id: 'bharat-bazaar',
    title: 'Bharat Bazaar: The Monsoon Fleet',
    tagline: 'Navigate the Indian Ocean spice routes from Muziris and Lothal to Rome and Mesopotamia.',
    category: 'play',
    description:
      'Manage monsoon winds, cargo inventories of Malabar black pepper, indigo, fine textiles, and Gujarat carnelian beads. Experience the economic engine that drew Roman imperial gold to ancient Indian ports.',
    culturalFocus: ['trade', 'heritage'],
    status: 'preview',
    difficulty: 'intermediate',
    estimatedTime: 'Upcoming Experience',
    badgeIcon: '⛵',
    route: '/kaalchakra/experience/bharat-bazaar',
    previewFocus: [
      'Monsoon wind navigation (Hippalus trade routes)',
      'Tidal harbor dock logistics (Lothal & Muziris)',
      'Ancient commodity exchange (Spices, Silk, Beads)'
    ],
    bannerHighlight: 'Upcoming Milestone • Maritime Trade & Oceanography'
  },
  {
    id: 'rajya-builder',
    title: 'Rajya Builder: Arthashastra Mandate',
    tagline: 'Govern a Mauryan Janapada by balancing agriculture, forest conservation, and state defense.',
    category: 'play',
    description:
      'Based on Chanakya’s Arthashastra. Manage the Saptanga (Seven Limbs of the State): royal treasury, grain buffers, civil law, and diplomacy while safeguarding ecological reserves and artisan guilds.',
    culturalFocus: ['defence', 'heritage'],
    status: 'preview',
    difficulty: 'advanced',
    estimatedTime: 'Upcoming Experience',
    badgeIcon: '👑',
    route: '/kaalchakra/experience/rajya-builder',
    previewFocus: [
      'Chanakya’s Saptanga Statecraft principles',
      'Janapada agrarian & forest zoning',
      'Diplomatic Mandala (Circle of Kings) strategy'
    ],
    bannerHighlight: 'Upcoming Milestone • Governance & Classical Economics'
  },
  {
    id: 'engineering-lab',
    title: 'Ancient Engineering Lab',
    tagline: 'Deconstruct the metallurgy of Delhi’s Iron Pillar and the hydraulics of the Grand Anicut.',
    category: 'build',
    description:
      'Explore the science behind non-rusting forge-welded wrought iron, precision astronomical instruments of Jantar Mantar, and water-lifting Persian wheels (Araghatta) described in classical Sanskrit texts.',
    culturalFocus: ['engineering', 'water-management'],
    status: 'preview',
    difficulty: 'intermediate',
    estimatedTime: 'Upcoming Experience',
    badgeIcon: '⚙️',
    route: '/kaalchakra/experience/engineering-lab',
    previewFocus: [
      'High-phosphorus forge metallurgy (Iron Pillar of Delhi)',
      'Karikala Chola’s hydraulic weir deflection mechanics',
      'Gnomonic shadow astronomy & stone sextants'
    ],
    bannerHighlight: 'Upcoming Milestone • Vedic & Classical Science'
  },
  {
    id: 'heritage-quest',
    title: 'Heritage Quest: Living Traditions',
    tagline: 'Travel across temple architecture styles, GI crafts, and oral folklore traditions.',
    category: 'explore',
    description:
      'Uncover the mathematical shilpa-shastras behind Nagara and Dravidian temple geometry, Dokra lost-wax metal casting, and ancient acoustic assembly techniques of stone pillars.',
    culturalFocus: ['heritage', 'architecture'],
    status: 'preview',
    difficulty: 'beginner',
    estimatedTime: 'Upcoming Experience',
    badgeIcon: '🛕',
    route: '/kaalchakra/experience/heritage-quest',
    previewFocus: [
      'Vastu Purusha Mandala geometry in temple planning',
      'Geographical Indication (GI) traditional craftsmanship',
      'Musical pillars and resonant acoustic architecture'
    ],
    bannerHighlight: 'Upcoming Milestone • Living Heritage & Material Arts'
  }
];

export function getExperienceById(id: string): ExperienceDefinition | undefined {
  return EXPERIENCES.find(exp => exp.id === id);
}

export function getPlayableExperiences(): ExperienceDefinition[] {
  return EXPERIENCES.filter(exp => exp.status === 'playable');
}

export function getPreviewExperiences(): ExperienceDefinition[] {
  return EXPERIENCES.filter(exp => exp.status === 'preview');
}
