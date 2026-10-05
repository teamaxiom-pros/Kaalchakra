export interface ScriptGlyph {
  id: string;
  char: string;
  unicodeChar: string; // Real Brahmi unicode e.g. 𑀥
  phonetic: string;
  meaning: string;
  description: string;
  clue: string;
}

export interface InscriptionCase {
  id: string;
  title: string;
  subtitle: string;
  artifactName: string;
  location: string;
  era: string;
  historicalScript: string;
  historicalContext: string;
  relatedKnowledgeId: string;
  targetPhrase: {
    originalText: string;
    transliteration: string;
    englishMeaning: string;
  };
  glyphs: ScriptGlyph[];
  challengeQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface LostScriptSessionState {
  currentCaseIndex: number;
  unlockedGlyphIds: string[];
  assembledGlyphIds: string[];
  answeredQuestionIndices: number[];
  hintsUsed: number;
  completed: boolean;
  score: number;
}
