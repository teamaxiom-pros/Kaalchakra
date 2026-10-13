import { InscriptionCase, LostScriptSessionState } from './scriptTypes';

export const INSCRIPTION_CASES: InscriptionCase[] = [
  {
    id: 'case-ashoka-girnar',
    title: 'The Emperor’s Decree: Girnar Brahmi Edict',
    subtitle: 'Junagadh Granite Outcrop, Gujarat (c. 250 BCE)',
    artifactName: 'Polished Basalt Rock Edict of Ashoka',
    location: 'Girnar Foothills, Saurashtra',
    era: 'Mauryan & Early Historic (c. 320 – 180 BCE)',
    historicalScript: 'Ashokan Brahmi (Abugida script written left-to-right)',
    historicalContext:
      'In 1837, James Prinsep of the Asiatic Society cracked the Ashokan Brahmi script by noting identical concluding words on votive inscriptions at Sanchi: "Danam" (gift) preceded by proper nouns. The Girnar rock edict established state hospitals for humans and animals, tree planting along highways, and non-violence.',
    relatedKnowledgeId: 'ck-ashokan-brahmi',
    targetPhrase: {
      originalText: '𑀥 𑀫',
      transliteration: 'DHAM-MA',
      englishMeaning: 'Universal Virtue, Moral Duty & Compassion',
    },
    glyphs: [
      {
        id: 'glyph-dha',
        char: 'Dha',
        unicodeChar: '𑀥',
        phonetic: 'Dha',
        meaning: 'Righteous Foundation',
        description: 'Shaped like a semicircle or bow facing right with a vertical stem.',
        clue: 'Look for the curved D-shape that opens to the left, representing the voiced aspirate dental consonant.',
      },
      {
        id: 'glyph-ma',
        char: 'Ma',
        unicodeChar: '𑀫',
        phonetic: 'Ma',
        meaning: 'Measure / Maternal',
        description: 'A circle topped by two curved horns or antennae.',
        clue: 'Resembles a wineglass or circle resting under a curved crest.',
      },
      {
        id: 'glyph-da',
        char: 'Da',
        unicodeChar: '𑀤',
        phonetic: 'Da',
        meaning: 'Giver / Dana',
        description: 'A crescent moon facing left with a top and bottom serif.',
        clue: 'The root of the word Danam (charity/donation) carved repeatedly at stupas.',
      },
      {
        id: 'glyph-na',
        char: 'Na',
        unicodeChar: '𑀦',
        phonetic: 'Na',
        meaning: 'Bridge / Continuous',
        description: 'A vertical stroke grounded on a horizontal baseline.',
        clue: 'Resembles an inverted capital T, forming the nasal dental consonant.',
      },
    ],
    challengeQuestions: [
      {
        question: 'Which historical method led James Prinsep to decipher Ashokan Brahmi in 1837?',
        options: [
          'Comparing bilingual coins with Greek and identifying repeated dedicatory phrases ("Danam")',
          'Translating a preserved bilingual Egyptian papyrus',
          'Using computerized frequency analysis of vowels',
          'Finding a Latin dictionary in Taxila',
        ],
        correctIndex: 0,
        explanation:
          'Prinsep compared bilingual Indo-Greek coins of kings like Agathocles and noticed that dozens of Sanchi donor pillars ended with the exact same two characters: "da-nam" (donation/gift).',
      },
      {
        question: 'What made Ashoka’s Rock Edicts historically groundbreaking?',
        options: [
          'They were the first public decrees prioritizing moral duties, medical care for animals, and religious harmony over military conquest',
          'They imposed mandatory taxes on all sea merchants',
          'They declared Greek as the only official state language',
          'They contained the first mathematical formulas for calculus',
        ],
        correctIndex: 0,
        explanation:
          'Following the trauma of the Kalinga War, Ashoka renounced conquest by sword (Bherighosa) in favour of conquest by righteousness and civic welfare (Dhammaghosa).',
      },
    ],
  },
  {
    id: 'case-lothal-seal',
    title: 'The Maritime Token: Lothal Steatite Seal',
    subtitle: 'Gulf of Khambhat Dockyard, Gujarat (c. 2200 BCE)',
    artifactName: 'Indus Unicorn Steatite Stamp Seal',
    location: 'Lothal Tidal Basin Warehouse',
    era: 'Harappan Civilization (c. 2600 – 1900 BCE)',
    historicalScript: 'Indus Script (Undeciphered; ~400 distinct signs, read right-to-left)',
    historicalContext:
      'Excavated at Lothal warehouse mounds, these square soapstone seals were pressed onto wet clay sealings (terracotta bullae) wrapped around shipping packages. When the bullae arrived in ancient Mesopotamian ports like Ur, intact impressions verified cargo integrity. However, because no bilingual text exists, the script remains conclusively undeciphered.',
    relatedKnowledgeId: 'ck-lothal-dockyard',
    targetPhrase: {
      originalText: '𑁈 𑀅 𑀲',
      transliteration: 'SIGN SEQUENCE (UNDECIPHERED)',
      englishMeaning: 'Hypothesized Commercial or Administrative Identity Tag (Scholarly Consensus Unresolved)',
    },
    glyphs: [
      {
        id: 'glyph-fish',
        char: 'Fish Sign (Sign 59, Mahadevan)',
        unicodeChar: '𓆟',
        phonetic: 'Undeciphered (Phonetic Value Unknown)',
        meaning: 'Scholarly Hypotheses: Astral Deity (Parpola Dravidian Rebus) vs. Occupational Title vs. Non-linguistic Emblem',
        description: 'Stylized fish emblem recurring across 80% of Harappan inscriptions in diverse ligature combinations.',
        clue: 'Archaeological observation: Appears in initial, medial, and compound positions across seals from Lothal to Mohenjo-daro.',
      },
      {
        id: 'glyph-jar',
        char: 'Vessel / Jar Sign (Sign 342, Mahadevan)',
        unicodeChar: '⚱',
        phonetic: 'Undeciphered',
        meaning: 'Hypothesized Terminal Marker / Suffix / Volumetric Determinative',
        description: 'U-shaped container motif, the single most common terminal sign occurring over 1,300 times at sequence endings.',
        clue: 'Statistical frequency: Predominantly concludes inscriptions, suggesting right-to-left reading order and possible case-endings.',
      },
      {
        id: 'glyph-unicorn',
        char: 'Unicorn Bull Crest (Iconographic Field)',
        unicodeChar: '🦄',
        phonetic: 'Iconographic Motif (Not an alphabetic letter)',
        meaning: 'Administrative Authority / Guild Heraldry',
        description: 'Single-horned bovine motif accompanied by a sacred ritual standard (incense brazier), carved in reverse intaglio.',
        clue: 'Intaglio carving allowed pressing into soft clay bullae to produce a raised relief impression for maritime customs verification.',
      },
    ],
    challengeQuestions: [
      {
        question: 'Why does the Indus script remain undeciphered today despite thousands of recovered seals?',
        options: [
          'The absence of a bilingual key (like the Rosetta Stone), short inscription lengths (averaging 5 signs), and unknown language affiliation',
          'Ancient scribes deliberately scrambled all written texts with encryption',
          'All seals were destroyed during ancient floods, leaving no copies',
          'The script was proven to be decorative doodles without linguistic meaning',
        ],
        correctIndex: 0,
        explanation:
          'Without a multilingual key (like the Rosetta Stone) or long texts (the longest Indus inscription contains only 26 signs), epigraphists cannot objectively confirm phonetic readings or the underlying language family.',
      },
      {
        question: 'How did Harappan merchants utilize steatite seals for international trade with Mesopotamia?',
        options: [
          'They pressed seals onto damp clay tags (bullae) attached to shipping bales to guarantee goods had not been opened in transit',
          'They used them as coins for buying cattle',
          'They wore them as royal crowns in religious processions',
          'They melted them into bronze weapons',
        ],
        correctIndex: 0,
        explanation:
          'Seals functioned as security hallmarks and ownership proof. Archaeologists have found identical Indus seal impressions on clay tags preserved in Mesopotamian warehouses in Ur and Kish.',
      },
    ],
  },
];

export function createInitialLostScriptState(): LostScriptSessionState {
  return {
    currentCaseIndex: 0,
    unlockedGlyphIds: ['glyph-dha'],
    assembledGlyphIds: [],
    answeredQuestionIndices: [],
    hintsUsed: 0,
    completed: false,
    score: 0,
  };
}

export function unlockNextGlyph(
  state: LostScriptSessionState,
  currentCase: InscriptionCase
): LostScriptSessionState {
  const allIds = currentCase.glyphs.map(g => g.id);
  const nextGlyph = allIds.find(id => !state.unlockedGlyphIds.includes(id));
  if (!nextGlyph) return state;

  return {
    ...state,
    unlockedGlyphIds: [...state.unlockedGlyphIds, nextGlyph],
  };
}

export function assembleGlyph(
  state: LostScriptSessionState,
  glyphId: string
): LostScriptSessionState {
  if (state.assembledGlyphIds.includes(glyphId)) {
    // Remove if already assembled (toggle)
    return {
      ...state,
      assembledGlyphIds: state.assembledGlyphIds.filter(id => id !== glyphId),
    };
  }

  return {
    ...state,
    assembledGlyphIds: [...state.assembledGlyphIds, glyphId],
  };
}

export function checkAnswer(
  state: LostScriptSessionState,
  questionIndex: number,
  selectedOptionIndex: number,
  currentCase: InscriptionCase
): { isCorrect: boolean; updatedState: LostScriptSessionState; explanation: string } {
  const q = currentCase.challengeQuestions[questionIndex];
  if (!q) {
    return { isCorrect: false, updatedState: state, explanation: 'Question not found' };
  }

  const isCorrect = q.correctIndex === selectedOptionIndex;
  const answered = Array.from(new Set([...state.answeredQuestionIndices, questionIndex]));
  const scoreAddition = isCorrect ? 25 : 5;

  return {
    isCorrect,
    explanation: q.explanation,
    updatedState: {
      ...state,
      answeredQuestionIndices: answered,
      score: state.score + scoreAddition,
    },
  };
}

export function evaluateCaseCompletion(
  state: LostScriptSessionState,
  currentCase: InscriptionCase
): { isComplete: boolean; finalScore: number; rating: 'master' | 'scholar' | 'apprentice' } {
  const answeredAll = state.answeredQuestionIndices.length >= currentCase.challengeQuestions.length;
  const assembledEnough = state.assembledGlyphIds.length >= 2;

  const isComplete = answeredAll && assembledEnough;
  const finalScore = Math.min(100, state.score + (assembledEnough ? 50 : 20));

  let rating: 'master' | 'scholar' | 'apprentice' = 'apprentice';
  if (finalScore >= 80) rating = 'master';
  else if (finalScore >= 50) rating = 'scholar';

  return {
    isComplete,
    finalScore,
    rating,
  };
}
