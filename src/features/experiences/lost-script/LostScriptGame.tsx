import React, { useState, useEffect } from 'react';
import {
  INSCRIPTION_CASES,
  createInitialLostScriptState,
  unlockNextGlyph,
  assembleGlyph,
  checkAnswer,
  evaluateCaseCompletion,
} from '../../../domain/lostScript/scriptEngine';
import { LostScriptSessionState } from '../../../domain/lostScript/scriptTypes';
import { sessionService } from '../../../services/sessionService';
import { GameMasterResponse } from '../../../types/ai';
import { getGameMaster } from '../../../domain/ai/aiFactory';
import { GameMasterWidget } from '../../../components/common/GameMasterWidget';
import { DiscoveryCardModal } from '../../../components/common/DiscoveryCardModal';
import { ExperienceCompletionModal } from '../../../components/experiences/ExperienceCompletionModal';
import { getCulturalKnowledgeById } from '../../../data/culturalDatabase';
import { CulturalKnowledge } from '../../../types/cultural';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface LostScriptGameProps {
  onCompleteExperience: (
    xpEarned: number,
    domainGains: Record<string, number>,
    unlockedDiscoveries: string[],
    performance: number,
    sessionId?: string
  ) => void;
  onNavigate: (path: string) => void;
  gameMasterMode: 'local-deterministic' | 'gemini-live';
}

export const LostScriptGame: React.FC<LostScriptGameProps> = ({
  onCompleteExperience,
  onNavigate,
  gameMasterMode,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<LostScriptSessionState>(() =>
    createInitialLostScriptState()
  );
  const [selectedGlyphId, setSelectedGlyphId] = useState<string>('glyph-dha');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);

  // Initialize authoritative game session on mount
  useEffect(() => {
    let isMounted = true;
    sessionService.startSession('lost-script').then(id => {
      if (isMounted && id) setSessionId(id);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const [questionFeedback, setQuestionFeedback] = useState<{
    qIndex: number;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const [lastGameMasterResponse, setLastGameMasterResponse] = useState<GameMasterResponse | null>(null);
  const [gmLoading, setGmLoading] = useState(false);
  const [activeDiscovery, setActiveDiscovery] = useState<CulturalKnowledge | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const currentCase = INSCRIPTION_CASES[selectedCaseIndex];
  const completion = evaluateCaseCompletion(sessionState, currentCase);

  const handleInspectGlyph = (glyphId: string) => {
    setSelectedGlyphId(glyphId);
    const glyph = currentCase.glyphs.find(g => g.id === glyphId);
    if (!glyph) return;

    const { provider } = getGameMaster();
    provider
      .explainEvent({
        experienceId: 'lost-script',
        eventName: `Inspected Glyph ${glyph.char}`,
        gameSummary: `Examined ligature and phonetic value of ${glyph.unicodeChar} (${glyph.phonetic}).`,
        playerChoices: [glyph.char, glyph.phonetic],
        consequenceRating: 'optimal',
        relevantDomain: 'language',
      })
      .then(res => setLastGameMasterResponse(res))
      .catch(() => {});
  };

  const handleAssembleGlyph = (glyphId: string) => {
    const updated = assembleGlyph(sessionState, glyphId);
    setSessionState(updated);
  };

  const handleUnlockMoreGlyphs = () => {
    const updated = unlockNextGlyph(sessionState, currentCase);
    setSessionState(updated);
  };

  const handleAnswerQuestion = (qIndex: number, optIndex: number) => {
    const res = checkAnswer(sessionState, qIndex, optIndex, currentCase);
    setSessionState(res.updatedState);
    setQuestionFeedback({
      qIndex,
      isCorrect: res.isCorrect,
      explanation: res.explanation,
    });
  };

  const handleRequestHint = async () => {
    setGmLoading(true);
    const { provider } = getGameMaster();
    try {
      const response = await provider.generateHint({
        experienceId: 'lost-script',
        currentState: `Assembled ${sessionState.assembledGlyphIds.length} glyphs. Current case: ${currentCase.title}`,
        objective: 'Decipher the inscription phrase and answer archaeological inquiries',
        relevantDomain: 'language',
      });
      setLastGameMasterResponse(response);
    } catch {
      // safe
    } finally {
      setGmLoading(false);
    }
  };

  const handleReset = () => {
    setSessionState(createInitialLostScriptState());
    setQuestionFeedback(null);
  };

  const handleCompleteCase = () => {
    const xp = 120 + sessionState.score;
    const domainGains = {
      language: 25,
      heritage: 20,
      trade: 10,
    };
    const discoveries = [currentCase.relatedKnowledgeId];

    onCompleteExperience(xp, domainGains, discoveries, sessionState.score, sessionId || undefined);
    setShowCompletionModal(true);
  };

  const activeGlyph = currentCase.glyphs.find(g => g.id === selectedGlyphId) || currentCase.glyphs[0];

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <button
          onClick={() => onNavigate('/experiences')}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.4rem', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} /> All Experiences
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsBriefingOpen(true)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem' }}
          >
            <BookOpen size={14} /> Mission Briefing
          </button>
          <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
            <RotateCcw size={14} /> Reset Clues
          </button>
          <button
            onClick={handleCompleteCase}
            disabled={!completion.isComplete}
            className={`btn btn-sm ${completion.isComplete ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700, opacity: completion.isComplete ? 1 : 0.6, gap: '0.35rem' }}
          >
            <Sparkles size={14} /> Submit Decipherment
          </button>
        </div>
      </div>

      {/* Case Switcher & Eyebrow */}
      <div
        className="artifact-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 22, 22, 0.95), rgba(18, 22, 28, 0.95))',
          borderLeft: '4px solid var(--accent-gold)',
          marginBottom: '1.75rem',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-gold">ASI EPIGRAPHICAL EXCAVATION</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentCase.era} • {currentCase.location}
          </span>
        </div>
        <h2 style={{ fontSize: '1.55rem', fontFamily: 'var(--font-serif)', marginBottom: '0.45rem' }}>
          {currentCase.title}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {currentCase.historicalContext}
        </p>

        {/* Case Toggle Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', marginTop: '1rem' }}>
          {INSCRIPTION_CASES.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseIndex(idx);
                setSessionState(createInitialLostScriptState());
                setSelectedGlyphId(c.glyphs[0].id);
                setQuestionFeedback(null);
              }}
              className={`btn btn-sm ${selectedCaseIndex === idx ? 'btn-gold' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem' }}
            >
              Case {idx + 1}: {c.artifactName}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem' }}>
        {/* Left Column: Artifact Visual & Inscription Assembly Tray */}
        <div>
          {/* Simulated Inscription Artifact Slab */}
          <div
            className="kc-card"
            style={{
              padding: '1.5rem',
              marginBottom: '1.25rem',
              background: 'radial-gradient(circle at 50% 50%, #1f2937, #111827)',
              border: '1.5px solid var(--border-gold)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-gold)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}
            >
              ARCHAEOLOGICAL ARTIFACT SPECIMEN • {currentCase.historicalScript}
            </div>

            {/* Inscription Display Slab */}
            <div
              style={{
                background: '#0a0d13',
                border: '2px solid rgba(229, 184, 66, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                margin: '1rem 0',
                boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div
                style={{
                  fontSize: '3.2rem',
                  fontFamily: 'serif',
                  letterSpacing: '0.3em',
                  color: 'var(--accent-gold)',
                  textShadow: '0 0 15px rgba(229, 184, 66, 0.4)',
                }}
              >
                {currentCase.targetPhrase.originalText}
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginTop: '0.5rem',
                  letterSpacing: '0.1em',
                }}
              >
                Transliteration: {currentCase.targetPhrase.transliteration}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Meaning: "{currentCase.targetPhrase.englishMeaning}"
              </div>
            </div>

            {/* Reconstructed Phrase Tray */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                border: '1px dashed var(--border-light)',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Decipherment Workspace (Click glyphs below to assemble into inscription):
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  minHeight: '48px',
                }}
              >
                {sessionState.assembledGlyphIds.length > 0 ? (
                  sessionState.assembledGlyphIds.map(id => {
                    const g = currentCase.glyphs.find(item => item.id === id);
                    if (!g) return null;
                    return (
                      <div
                        key={id}
                        onClick={() => handleAssembleGlyph(id)}
                        style={{
                          background: 'rgba(229, 184, 66, 0.15)',
                          border: '1.5px solid var(--accent-gold)',
                          borderRadius: '8px',
                          padding: '0.4rem 0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                        title="Click to remove from tray"
                      >
                        <span style={{ fontSize: '1.4rem' }}>{g.unicodeChar}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{g.char}</span>
                      </div>
                    );
                  })
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    [ Tray empty — select discovered glyphs below ]
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Glyph Discovery Catalog */}
          <div className="kc-card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                DISCOVERED GLYPH SPECIMENS ({sessionState.unlockedGlyphIds.length} /{' '}
                {currentCase.glyphs.length})
              </div>
              {sessionState.unlockedGlyphIds.length < currentCase.glyphs.length && (
                <button
                  onClick={handleUnlockMoreGlyphs}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', gap: '0.3rem' }}
                >
                  <Search size={12} /> Uncover Next Glyph
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
              {currentCase.glyphs.map(glyph => {
                const isUnlocked = sessionState.unlockedGlyphIds.includes(glyph.id);
                const isAssembled = sessionState.assembledGlyphIds.includes(glyph.id);
                const isSelected = selectedGlyphId === glyph.id;

                if (!isUnlocked) {
                  return (
                    <div
                      key={glyph.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                      }}
                    >
                      🔒 Weathered Glyph
                    </div>
                  );
                }

                return (
                  <div
                    key={glyph.id}
                    onClick={() => handleInspectGlyph(glyph.id)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(229, 184, 66, 0.2), rgba(59, 130, 246, 0.15))'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected
                        ? '1.5px solid var(--accent-gold)'
                        : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.8rem', color: 'var(--accent-gold)' }}>
                        {glyph.unicodeChar}
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleAssembleGlyph(glyph.id);
                        }}
                        className={`btn btn-sm ${isAssembled ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                      >
                        {isAssembled ? 'Remove' : '+ Add'}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
                      {glyph.char}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Sound: /{glyph.phonetic}/
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Glyph Deep-Dive Details */}
            {activeGlyph && (
              <div
                style={{
                  marginTop: '0.85rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderLeft: '3px solid var(--accent-gold)',
                  padding: '0.75rem 1rem',
                  borderRadius: '0 4px 4px 0',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  Epigraphical Clue for {activeGlyph.char} ({activeGlyph.unicodeChar}):
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                  {activeGlyph.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-terracotta)', fontWeight: 600 }}>
                  💡 {activeGlyph.clue}
                </div>
              </div>
            )}
          </div>

          {/* Epigraphical Historical Inquiries (Questions) */}
          <div className="kc-card" style={{ padding: '1.25rem' }}>
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-indigo)',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              Archaeological Survey Field Inquiries
            </div>

            {currentCase.challengeQuestions.map((q, qIdx) => {
              const isAnswered = sessionState.answeredQuestionIndices.includes(qIdx);

              return (
                <div
                  key={qIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                    {qIdx + 1}. {q.question}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerQuestion(qIdx, optIdx)}
                        disabled={isAnswered}
                        className="btn btn-secondary btn-sm"
                        style={{
                          textAlign: 'left',
                          justifyContent: 'flex-start',
                          padding: '0.55rem 0.85rem',
                          fontSize: '0.82rem',
                          background:
                            isAnswered && optIdx === q.correctIndex
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(255, 255, 255, 0.03)',
                          borderColor:
                            isAnswered && optIdx === q.correctIndex
                              ? 'var(--accent-emerald)'
                              : 'var(--border-subtle)',
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {questionFeedback && questionFeedback.qIndex === qIdx && (
                    <div
                      style={{
                        marginTop: '0.65rem',
                        fontSize: '0.8rem',
                        color: questionFeedback.isCorrect
                          ? 'var(--accent-emerald)'
                          : 'var(--accent-terracotta)',
                        display: 'flex',
                        gap: '0.4rem',
                      }}
                    >
                      {questionFeedback.isCorrect ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                      <span>{questionFeedback.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Game Master */}
        <div>
          <GameMasterWidget
            lastResponse={lastGameMasterResponse}
            mode={gameMasterMode}
            onRequestHint={handleRequestHint}
            isLoading={gmLoading}
          />

          {/* Decipherment Progress Card */}
          <div className="kc-card" style={{ marginTop: '1.25rem', padding: '1.15rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
              INVESTIGATION STATUS
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0.45rem 0' }}>
              Score: {sessionState.score} XP
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {completion.isComplete
                ? '✅ Decipherment verified! You can conclude the investigation to unlock the grounded cultural discovery card.'
                : 'Assemble at least 2 glyphs in the workspace and answer the archaeological inquiries.'}
            </div>

            <button
              onClick={() => {
                const k = getCulturalKnowledgeById(currentCase.relatedKnowledgeId);
                if (k) setActiveDiscovery(k);
              }}
              className="btn btn-gold btn-sm"
              style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
            >
              <BookOpen size={14} /> View Historical Edict Record
            </button>
          </div>
        </div>
      </div>

      {/* Mission Briefing Modal */}
      {isBriefingOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 10, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setIsBriefingOpen(false)}
        >
          <div
            className="artifact-card fade-in"
            style={{
              maxWidth: '680px',
              width: '100%',
              background: 'linear-gradient(145deg, #221c1c, #131720)',
              border: '1.5px solid var(--border-gold)',
              padding: '2rem 2.25rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-gold">EPIGRAPHICAL BRIEFING</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Archaeological Survey of India
                </span>
              </div>
              <button
                onClick={() => setIsBriefingOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.2rem 0.6rem' }}
              >
                ✕
              </button>
            </div>

            <h3
              style={{
                fontSize: '1.55rem',
                fontFamily: 'var(--font-serif)',
                color: '#fff8eb',
                marginBottom: '0.5rem',
              }}
            >
              Mission: Epigraphical Epiphany &amp; Decipherment
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              Explore two distinct epigraphical chapters of Indian antiquity: the deciphered Ashokan Brahmi
              edicts of Emperor Ashoka (c. 250 BCE) and the undeciphered symbolic seals of the Indus Valley
              Civilization (c. 2300–1900 BCE).
            </p>

            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderLeft: '3px solid var(--accent-gold)',
                padding: '1rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                EPIGRAPHICAL CONCORDANCES:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>
                  <strong>Case 1 (Ashokan Brahmi):</strong> Deciphered in 1837 by James Prinsep. An abugida script where consonants take vowel diacritic strokes (matras) to write Prakrit imperial edicts.
                </li>
                <li>
                  <strong>Case 2 (Lothal Indus Seal):</strong> Currently <em>undeciphered</em>. Catalogs like Mahadevan&apos;s 1977 Concordance record sign frequencies, right-to-left directionality, and terminal sign patterns without claiming definitive phonetic values.
                </li>
              </ul>
            </div>

            <div
              style={{
                background: 'rgba(217, 119, 6, 0.1)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.9rem',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--accent-saffron)', marginBottom: '0.25rem' }}>
                INVESTIGATION METHODOLOGY:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Inspect glyph strokes and ligature modifications, assemble the inscription sequence in the reading tray, and answer epigraphical inquiry prompts to validate your analysis.
              </div>
            </div>

            <button
              onClick={() => setIsBriefingOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
            >
              Begin Epigraphical Analysis
            </button>
          </div>
        </div>
      )}

      {/* Discovery Modal */}
      {activeDiscovery && (
        <DiscoveryCardModal
          knowledge={activeDiscovery}
          onClose={() => setActiveDiscovery(null)}
          onNavigateExperience={expId => onNavigate(`/kaalchakra/experience/${expId}`)}
        />
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <ExperienceCompletionModal
          experienceTitle={currentCase.title}
          xpEarned={120 + sessionState.score}
          domainGains={{
            language: 25,
            heritage: 20,
            trade: 10,
          }}
          discoveriesUnlocked={[currentCase.relatedKnowledgeId]}
          recommendedExperience={{
            id: 'fort-master',
            title: 'Fort Master: Bastions & Monsoon',
            reason:
              'You deciphered royal edicts. Now experience the tactical architectural planning of Deccan fortresses in Fort Master.',
          }}
          onOpenDiscovery={discId => {
            const k = getCulturalKnowledgeById(discId);
            if (k) setActiveDiscovery(k);
          }}
          onNavigateNext={expId => {
            setShowCompletionModal(false);
            onNavigate(`/kaalchakra/experience/${expId}`);
          }}
          onReturnHub={() => {
            setShowCompletionModal(false);
            onNavigate('/kaalchakra/play');
          }}
        />
      )}

      {/* Responsive layout CSS */}
      <style>{`
        @media (max-width: 860px) {
          div[style*="grid-template-columns: 1.4fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
