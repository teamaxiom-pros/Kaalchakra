import { describe, it, expect } from 'vitest';
import {
  INSCRIPTION_CASES,
  createInitialLostScriptState,
  unlockNextGlyph,
  assembleGlyph,
  checkAnswer,
  evaluateCaseCompletion,
} from '../src/domain/lostScript/scriptEngine';

describe('Lost Script Engine', () => {
  it('loads epigraphical cases with authentic historical context', () => {
    expect(INSCRIPTION_CASES.length).toBeGreaterThanOrEqual(2);
    const ashokaCase = INSCRIPTION_CASES[0];
    expect(ashokaCase.historicalScript).toContain('Ashokan Brahmi');
    expect(ashokaCase.targetPhrase.transliteration).toBe('DHAM-MA');
  });

  it('progresses through glyph discoveries and toggles assembly', () => {
    const currentCase = INSCRIPTION_CASES[0];
    let state = createInitialLostScriptState();

    expect(state.unlockedGlyphIds).toContain('glyph-dha');

    state = unlockNextGlyph(state, currentCase);
    expect(state.unlockedGlyphIds.length).toBe(2);

    state = assembleGlyph(state, 'glyph-dha');
    expect(state.assembledGlyphIds).toContain('glyph-dha');

    // Toggle off
    state = assembleGlyph(state, 'glyph-dha');
    expect(state.assembledGlyphIds).not.toContain('glyph-dha');
  });

  it('validates epigraphic challenge questions', () => {
    const currentCase = INSCRIPTION_CASES[0];
    const state = createInitialLostScriptState();

    const result = checkAnswer(state, 0, 0, currentCase);
    expect(result.isCorrect).toBe(true);
    expect(result.updatedState.score).toBeGreaterThan(0);
  });
});
