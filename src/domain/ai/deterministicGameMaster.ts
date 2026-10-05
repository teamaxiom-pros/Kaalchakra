import {
  GameMasterProvider,
  EventContext,
  HintContext,
  RecommendationContext,
  GameMasterResponse
} from '../../types/ai';
import { CULTURAL_DATABASE } from '../../data/culturalDatabase';

export class DeterministicGameMaster implements GameMasterProvider {
  async explainEvent(input: EventContext): Promise<GameMasterResponse> {
    const { eventName, consequenceRating, relevantDomain, playerChoices } = input;

    let narration = '';
    let historicalContext = '';
    let guidance = '';

    if (eventName === 'Monsoon Cloudburst') {
      if (consequenceRating === 'optimal') {
        narration =
          'The torrential Sahyadri monsoon descended over the basalt ramparts. Because your fort had established rock-cut Baoli cisterns and drainage channels, the deluge filled the subterranean storage to capacity without breaching walls.';
        historicalContext =
          'Historical Deccan hill forts (such as Shivneri, Raigad, and Rajgad) capitalized on the fierce Western Ghats monsoon. By cutting cisterns directly into impermeable basalt bedrock, they stored millions of litres of cool, filtered water to outlast 8-month dry spells.';
        guidance = 'Defensive strength in India was fundamentally anchored in hydro-resilience.';
      } else {
        narration =
          'The monsoon storm swept across the plateau. With inadequate water storage reservoirs, massive floodwaters overflowed the earthen embankments while leaving drinking supplies contaminated.';
        historicalContext =
          'Ramchandra Pant Amatya’s 1716 royal manual Adnyapatra warned that a fort built without independent subterranean water reservoirs would crumble under siege regardless of how tall its bastions were.';
        guidance = 'Prioritize cistern construction (Baoli / Tanka) before expanding secondary ramparts.';
      }
    } else if (eventName === 'Prolonged Drought') {
      if (consequenceRating === 'optimal') {
        narration =
          'A three-month drought tested the settlement. Your deep rock-cut Baolis and conserved reserves sustained the garrison and population without panic.';
        historicalContext =
          'Harappan settlements like Dholavira and medieval fortresses in Rajasthan relied on stepped wells and subterranean storage designed to prevent evaporation under scorching summer sun.';
        guidance = 'Water storage guarantees stability when external resupply fails.';
      } else {
        narration =
          'Drying winds depleted surface tanks quickly. The garrison suffered water rationing, forcing critical compromises in defense patrols.';
        historicalContext =
          'Historical sieges in Indian history were rarely won by breaching walls; they succeeded when internal water cisterns ran dry or were sabotaged.';
        guidance = 'Always build at least two independent water sources on opposite bastions.';
      }
    } else if (eventName === 'Heavy Urban Runoff') {
      if (consequenceRating === 'optimal') {
        narration =
          'A sudden flash flood cascaded into the settlement streets. The paved brick gradient and covered terracotta conduits channelled runoff away from residential homes directly into the primary siltation reservoir.';
        historicalContext =
          'At Mohenjo-daro and Harappa, street drains were covered with dressed limestone and terracotta slabs that could be lifted for inspection, preventing disease and structural collapse.';
        guidance = 'Connecting houses to main conduits prevented civic water stagnation.';
      } else {
        narration =
          'Urban runoff pooled in low-lying residential wards. Mud-brick structures absorbed standing water, threatening civic hygiene and road access.';
        historicalContext =
          'Harappan civil engineers strictly enforced municipal building codes: no house was permitted to drain waste directly onto open pedestrian roads without a settling sump.';
        guidance = 'Ensure residential wards connect to continuous covered drains.';
      }
    } else {
      narration = `The settlement weathered the ${eventName}. Choices: ${playerChoices.join(', ')}.`;
      historicalContext =
        'Indian civil and military architecture evolved alongside regional geography, turning natural terrain constraints into strategic defensive advantages.';
      guidance = 'Balance storage buffers with active civic access.';
    }

    const matchedKnowledge = CULTURAL_DATABASE.find(item => item.domain.includes(relevantDomain));

    return {
      title: `Game Master Analysis: ${eventName}`,
      narration,
      historicalContext,
      guidance,
      sourceAttribution: matchedKnowledge?.sourceName || 'Archaeological Survey of India (ASI)',
      mode: 'local-deterministic',
    };
  }

  async generateHint(input: HintContext): Promise<GameMasterResponse> {
    const { experienceId, currentState, objective, resourcesLeft, relevantDomain } = input;

    let guidance = '';
    let historicalContext = '';

    if (experienceId === 'fort-master') {
      if (resourcesLeft && (resourcesLeft.water < 25 || resourcesLeft.stone < 20)) {
        guidance =
          'Focus your remaining stone on building a Baoli Cistern. Without water reserves, impending weather crises will severely punish your score.';
      } else {
        guidance =
          'Place a fortified gate at the entry bottleneck and pair it with an elevated watchtower on the ridge for maximum defensive surveillance.';
      }
      historicalContext =
        'According to Kautilya’s Arthashastra, hill fortresses (Giri-durga) require strategic placement of gates at natural defiles flanked by elevated bastions.';
    } else if (experienceId === 'bharat-architect') {
      guidance =
        'Ensure that every residential block has a direct orthogonal street connection to the main drainage conduit. Sump pits should be placed before reservoirs.';
      historicalContext =
        'Harappan cities like Lothal and Kalibangan used strict 1:2:4 brick ratios and uniform street widths to ensure civic equality and sanitary resilience.';
    } else if (experienceId === 'lost-script') {
      guidance =
        'Look at the ligature strokes on the Brahmi character. The vertical spine with horizontal base indicates the dental consonant ‘Ta’ or ‘Dha’.';
      historicalContext =
        'James Prinsep unlocked Brahmi in 1837 after noticing recurring royal titles terminating in ‘Danam’ (gift) on Buddhist stupa railings.';
    } else {
      guidance = `Align your choices with ${relevantDomain} principles.`;
      historicalContext = 'Traditional Indian knowledge systems emphasize holistic balance between humanity, architecture, and nature.';
    }

    return {
      title: 'Game Master Insight',
      narration: `Context: ${currentState}. Objective: ${objective}`,
      historicalContext,
      guidance,
      sourceAttribution: 'ASI / Ministry of Culture Knowledge Corpus',
      mode: 'local-deterministic',
    };
  }

  async recommendNext(input: RecommendationContext): Promise<GameMasterResponse> {
    const { domainScores, completedExperiences } = input;
    let target = 'bharat-architect';
    let rationale = 'Explore civic planning and hydraulic engineering';

    if (completedExperiences.includes('bharat-architect') && !completedExperiences.includes('lost-script')) {
      target = 'lost-script';
      rationale = 'Examine ancient inscriptions and Harappan trade seals';
    } else if (completedExperiences.includes('lost-script') && !completedExperiences.includes('fort-master')) {
      target = 'fort-master';
      rationale = 'Fortify mountain strongholds and manage rainwater buffers';
    }

    return {
      title: 'Next Cultural Step',
      narration: `Based on your recent progression (Civilization XP ${input.xp}), the Game Master suggests ${target}.`,
      historicalContext: rationale,
      guidance: 'Broadening your exploration across defense, architecture, and epigraphy unlocks comprehensive cultural mastery.',
      sourceAttribution: 'Kaalchakra Adaptive Journey Engine',
      mode: 'local-deterministic',
    };
  }
}
