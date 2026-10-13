import React, { useState, useEffect } from 'react';
import {
  FortTile,
  FortStructureType,
  FortResources,
  FortCrisisEvent,
} from '../../../domain/fortMaster/fortTypes';
import {
  FORT_STRUCTURES,
  INITIAL_FORT_RESOURCES,
  FORT_CRISIS_EVENTS,
  createDefaultFortGrid,
  calculateFortMetrics,
  placeStructure,
  removeStructure,
  canPlaceStructure,
  evaluateCrisisEvent,
} from '../../../domain/fortMaster/fortEngine';
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
  CloudRain,
  Shield,
  Sun,
  Sparkles,
  Hammer,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface FortMasterGameProps {
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

export const FortMasterGame: React.FC<FortMasterGameProps> = ({
  onCompleteExperience,
  onNavigate,
  gameMasterMode,
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [grid, setGrid] = useState<FortTile[]>(() => createDefaultFortGrid());
  const [resources, setResources] = useState<FortResources>(() => ({ ...INITIAL_FORT_RESOURCES }));
  const [selectedStructure, setSelectedStructure] = useState<FortStructureType>('baoli');
  const [isDismantleMode, setIsDismantleMode] = useState(false);
  const [hasTestedCrisis, setHasTestedCrisis] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [placementFeedback, setPlacementFeedback] = useState<string | null>(null);
  const [completionValidation, setCompletionValidation] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [activeCrisisOutcome, setActiveCrisisOutcome] = useState<{
    event: FortCrisisEvent;
    success: boolean;
    rating: 'optimal' | 'moderate' | 'critical';
    impactSummary: string;
    culturalInsight: string;
  } | null>(null);

  const [lastGameMasterResponse, setLastGameMasterResponse] = useState<GameMasterResponse | null>(null);
  const [gmLoading, setGmLoading] = useState(false);
  const [activeDiscovery, setActiveDiscovery] = useState<CulturalKnowledge | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Initialize authoritative game session on mount
  useEffect(() => {
    let isMounted = true;
    sessionService.startSession('fort-master').then(id => {
      if (isMounted && id) setSessionId(id);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = calculateFortMetrics(grid);

  const handleTileClick = async (tile: FortTile) => {
    if (isDismantleMode) {
      if (!tile.structure) return;
      const res = removeStructure(grid, tile.x, tile.y, resources);
      if (res) {
        setGrid(res.newGrid);
        setResources(res.newResources);
        setPlacementFeedback(null);
        if (sessionId) {
          sessionService.recordAction(sessionId, 'fort-master', 'structure_dismantled', {
            x: tile.x,
            y: tile.y,
          });
        }
      }
      return;
    }

    const check = canPlaceStructure(tile, selectedStructure, resources);
    if (!check.allowed) {
      setPlacementFeedback(check.reason || 'Cannot place structure on this terrain.');
      return;
    }

    const res = placeStructure(grid, tile.x, tile.y, selectedStructure, resources);
    if (!res) return;

    setGrid(res.newGrid);
    setResources(res.newResources);
    setPlacementFeedback(null);
    setCompletionValidation(null);

    if (sessionId) {
      sessionService.recordAction(sessionId, 'fort-master', 'structure_placed', {
        structure: selectedStructure,
        x: tile.x,
        y: tile.y,
        terrain: tile.terrain,
      });
    }

    // Contextual update from Game Master
    const def = FORT_STRUCTURES[selectedStructure];
    const { provider } = getGameMaster();
    provider
      .explainEvent({
        experienceId: 'fort-master',
        eventName: `Placed ${def.name}`,
        gameSummary: `Player constructed a ${def.nativeName} at (${tile.x}, ${tile.y}).`,
        playerChoices: [def.name, tile.terrain],
        consequenceRating: 'optimal',
        relevantDomain: 'architecture',
      })
      .then(res => setLastGameMasterResponse(res))
      .catch(() => {});
  };

  const handleTriggerCrisis = async (event: FortCrisisEvent) => {
    const outcome = evaluateCrisisEvent(metrics, event);
    setActiveCrisisOutcome({
      event,
      ...outcome,
    });
    setHasTestedCrisis(true);
    setCompletionValidation(null);

    if (sessionId) {
      sessionService.recordAction(sessionId, 'fort-master', 'crisis_tested', {
        crisisId: event.id,
        outcome: outcome.rating,
        success: outcome.success,
        metrics,
      });
    }

    setGmLoading(true);
    const { provider } = getGameMaster();
    try {
      const response = await provider.explainEvent({
        experienceId: 'fort-master',
        eventName: event.name,
        gameSummary: outcome.impactSummary,
        playerChoices: grid.filter(t => t.structure).map(t => t.structure!),
        consequenceRating: outcome.rating,
        relevantDomain: 'water-management',
      });
      setLastGameMasterResponse(response);
    } catch {
      // safe fallback
    } finally {
      setGmLoading(false);
    }
  };

  const handleRequestHint = async () => {
    setGmLoading(true);
    const { provider } = getGameMaster();
    try {
      const response = await provider.generateHint({
        experienceId: 'fort-master',
        currentState: `Score: ${metrics.overallScore}, Water: ${metrics.waterResilience}, Defense: ${metrics.defenceRating}`,
        objective: 'Prepare for impending monsoon deluge and hill pass blockade',
        resourcesLeft: { stone: resources.stone, water: resources.water, food: resources.food },
        relevantDomain: 'water-management',
      });
      setLastGameMasterResponse(response);
    } catch {
      // fallback
    } finally {
      setGmLoading(false);
    }
  };

  const handleReset = () => {
    setGrid(createDefaultFortGrid());
    setResources({ ...INITIAL_FORT_RESOURCES });
    setActiveCrisisOutcome(null);
    setPlacementFeedback(null);
    setCompletionValidation(null);
    setHasTestedCrisis(false);
    setIsSubmitted(false);
  };

  const handleCompleteMission = () => {
    if (isSubmitted) return;

    const placedCount = grid.filter(t => t.structure).length;
    if (placedCount < 3) {
      setCompletionValidation(
        'Fortress Incomplete: Construct at least 3 complementary fortifications (such as a rock-cut cistern, elevated granary, and bastion wall) before submitting.'
      );
      return;
    }

    if (!hasTestedCrisis) {
      setCompletionValidation(
        'Untested Defense: Test your fortress against at least one seasonal crisis (Monsoon Cloudburst or Siege Blockade) to verify its endurance under historical stress!'
      );
      return;
    }

    if (metrics.overallScore < 40) {
      setCompletionValidation(
        `Vulnerable Fortress: Overall resilience is currently ${metrics.overallScore}/100. Enhance water cisterns or defensive walls to achieve at least 40/100.`
      );
      return;
    }

    setIsSubmitted(true);
    const xp = Math.min(220, Math.round(90 + metrics.overallScore * 0.7));
    const domainGains = {
      waterManagement: Math.round(metrics.waterResilience * 0.15),
      defence: Math.round(metrics.defenceRating * 0.15),
      architecture: 15,
    };
    const discoveries = ['ck-shivneri-rainwater', 'ck-arthashastra-forts'];

    onCompleteExperience(xp, domainGains, discoveries, metrics.overallScore, sessionId || undefined);
    setShowCompletionModal(true);
  };

  const terrainColors: Record<string, { bg: string; border: string; label: string }> = {
    plateau_core: { bg: 'rgba(55, 65, 81, 0.4)', border: 'rgba(156, 163, 175, 0.3)', label: 'Basalt Core' },
    cliff_ridge: { bg: 'rgba(31, 41, 55, 0.7)', border: 'rgba(209, 213, 219, 0.4)', label: 'Cliff Edge' },
    water_catchment: { bg: 'rgba(30, 58, 138, 0.3)', border: 'rgba(96, 165, 250, 0.4)', label: 'Catchment Basin' },
    hill_spur: { bg: 'rgba(75, 85, 99, 0.5)', border: 'rgba(156, 163, 175, 0.4)', label: 'Mountain Spur' },
    entry_pass: { bg: 'rgba(180, 83, 9, 0.25)', border: 'rgba(245, 158, 11, 0.4)', label: 'Choke Portal' },
  };

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
            <RotateCcw size={14} /> Reset Fort
          </button>
          <button
            onClick={handleCompleteMission}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 700, gap: '0.35rem' }}
          >
            <Sparkles size={14} /> Conclude &amp; Submit Fort
          </button>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {completionValidation && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(143, 60, 37, 0.25)',
            border: '1.5px solid var(--accent-terracotta)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
          }}
        >
          <AlertCircle size={22} color="#f87171" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: '#fecaca', lineHeight: 1.5 }}>
            {completionValidation}
          </div>
        </div>
      )}

      {/* Placement Feedback Toast */}
      {placementFeedback && (
        <div
          className="fade-in"
          style={{
            background: 'rgba(200, 106, 26, 0.2)',
            border: '1px solid var(--accent-saffron)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            color: '#fed7aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>⚠️ {placementFeedback}</span>
          <button
            onClick={() => setPlacementFeedback(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Mission Banner */}
      <div
        className="artifact-card"
        style={{
          background: 'linear-gradient(135deg, rgba(22, 29, 41, 0.95), rgba(17, 23, 33, 0.95))',
          borderLeft: '4px solid var(--accent-gold)',
          marginBottom: '1.75rem',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-gold">HISTORICAL FORTRESS CHRONICLE</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            17th-Century Maratha &amp; Deccan Hill Fort Architecture (Sahyadri Escarpment)
          </span>
        </div>
        <h2 style={{ fontSize: '1.55rem', fontFamily: 'var(--font-serif)', marginBottom: '0.45rem' }}>
          Fort Master: Bastions &amp; The Monsoon Deluge
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Construct rock-cut rainwater cisterns (Tankas), elevated granaries (Amberkhana), and bastion
          gates along the natural basalt ridge. Secure water and food resilience before seasonal crises
          test your fortress.
        </p>
      </div>

      {/* Resource & Metrics HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Stone */}
        <div className="kc-card-flat" style={{ borderLeft: '3px solid #94a3b8' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Quarried Stone
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            🧱 {resources.stone}
          </div>
        </div>

        {/* Water */}
        <div className="kc-card-flat" style={{ borderLeft: '3px solid #60a5fa' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Drinking Water
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#60a5fa' }}>
            💧 {resources.water}
          </div>
        </div>

        {/* Grain */}
        <div className="kc-card-flat" style={{ borderLeft: '3px solid #fbbf24' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Grain Buffer
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fbbf24' }}>
            🌾 {resources.food}
          </div>
        </div>

        {/* Water Resilience */}
        <div className="kc-card-flat" style={{ borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Water Resilience
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#38bdf8' }}>
            {metrics.waterResilience}
          </div>
        </div>

        {/* Defence Rating */}
        <div className="kc-card-flat" style={{ borderLeft: '3px solid var(--accent-terracotta)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Defensive Score
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-terracotta)' }}>
            {metrics.defenceRating}
          </div>
        </div>

        {/* Overall Score */}
        <div className="kc-card-flat" style={{ borderLeft: '3px solid var(--accent-gold)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Fortress Resilience
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {metrics.overallScore} / 100
          </div>
        </div>
      </div>

      {/* Main Gameplay Layout: Grid + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem' }}>
        {/* Left Column: Board & Toolbar */}
        <div>
          {/* Construction Selector Toolbar */}
          <div
            className="kc-card"
            style={{ marginBottom: '1.25rem', padding: '1rem' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                SELECT ARCHITECTURAL STRUCTURE TO PLACE
              </div>
              <button
                onClick={() => setIsDismantleMode(!isDismantleMode)}
                className={`btn btn-sm ${isDismantleMode ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                <Hammer size={12} /> {isDismantleMode ? 'Dismantling Active' : 'Dismantle Mode'}
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {(Object.keys(FORT_STRUCTURES) as FortStructureType[]).map(type => {
                const def = FORT_STRUCTURES[type];
                const isSelected = selectedStructure === type && !isDismantleMode;
                const canAfford = resources.stone >= def.cost.stone;

                return (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedStructure(type);
                      setIsDismantleMode(false);
                    }}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(229, 184, 66, 0.2), rgba(224, 90, 54, 0.15))'
                        : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected
                        ? '1.5px solid var(--accent-gold)'
                        : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      opacity: canAfford ? 1 : 0.6,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{def.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--accent-gold)' : 'var(--text-primary)',
                          }}
                        >
                          {def.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          Cost: {def.cost.stone} St
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected structure description */}
            <div
              style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
              }}
            >
              <strong>{FORT_STRUCTURES[selectedStructure].nativeName}:</strong>{' '}
              {FORT_STRUCTURES[selectedStructure].description} •{' '}
              <em>{FORT_STRUCTURES[selectedStructure].culturalNote}</em>
            </div>
          </div>

          {/* 5x5 Terrain Matrix */}
          <div
            className="kc-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                width: '100%',
                maxWidth: '480px',
              }}
            >
              {grid.map(tile => {
                const terrain = terrainColors[tile.terrain];
                const structureDef = tile.structure ? FORT_STRUCTURES[tile.structure] : null;

                return (
                  <div
                    key={`${tile.x}-${tile.y}`}
                    onClick={() => handleTileClick(tile)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleTileClick(tile)}
                    aria-label={`${terrain.label} tile at ${tile.x}, ${tile.y} with ${structureDef?.name || 'empty'}`}
                    style={{
                      aspectRatio: '1',
                      background: terrain.bg,
                      border: `1.5px solid ${structureDef ? 'var(--accent-gold)' : terrain.border}`,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: structureDef ? '0 0 10px rgba(229, 184, 66, 0.2)' : 'none',
                      transition: 'transform 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {structureDef ? (
                      <>
                        <span style={{ fontSize: '1.6rem' }}>{structureDef.icon}</span>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: 'var(--accent-gold)',
                            marginTop: '2px',
                            textAlign: 'center',
                          }}
                        >
                          {structureDef.name.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.58rem',
                          color: 'rgba(255, 255, 255, 0.45)',
                          textAlign: 'center',
                          padding: '2px',
                        }}
                      >
                        {terrain.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                marginTop: '1rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <span>💧 Catchment = Water Bonus</span>
              <span>👁️ Ridge/Spur = Bastion Tower</span>
              <span>🚪 Portal = Gate</span>
            </div>
          </div>

          {/* Crisis Simulation Triggers */}
          <div
            className="kc-card"
            style={{
              marginTop: '1.25rem',
              padding: '1.15rem',
            }}
          >
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--accent-terracotta)',
                marginBottom: '0.65rem',
              }}
            >
              TEST FORTRESS RESILIENCE AGAINST SEASONAL CRISES
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              <button
                onClick={() => handleTriggerCrisis(FORT_CRISIS_EVENTS[0])}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', gap: '0.3rem', padding: '0.65rem 0.4rem' }}
              >
                <CloudRain size={20} color="#60a5fa" />
                <span style={{ fontSize: '0.78rem' }}>Monsoon Deluge</span>
              </button>

              <button
                onClick={() => handleTriggerCrisis(FORT_CRISIS_EVENTS[1])}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', gap: '0.3rem', padding: '0.65rem 0.4rem' }}
              >
                <Shield size={20} color="var(--accent-terracotta)" />
                <span style={{ fontSize: '0.78rem' }}>Siege Blockade</span>
              </button>

              <button
                onClick={() => handleTriggerCrisis(FORT_CRISIS_EVENTS[2])}
                className="btn btn-secondary btn-sm"
                style={{ flexDirection: 'column', gap: '0.3rem', padding: '0.65rem 0.4rem' }}
              >
                <Sun size={20} color="#fbbf24" />
                <span style={{ fontSize: '0.78rem' }}>Summer Drought</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Game Master & Crisis Consequence */}
        <div>
          {/* Active Crisis Consequence Card */}
          {activeCrisisOutcome && (
            <div
              className="kc-card"
              style={{
                border: `1.5px solid ${
                  activeCrisisOutcome.rating === 'optimal'
                    ? 'var(--accent-emerald)'
                    : activeCrisisOutcome.rating === 'moderate'
                    ? 'var(--accent-amber)'
                    : 'var(--accent-terracotta)'
                }`,
                background: 'rgba(20, 27, 38, 0.95)',
                marginBottom: '1.25rem',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  className={`badge ${
                    activeCrisisOutcome.rating === 'optimal'
                      ? 'badge-emerald'
                      : activeCrisisOutcome.rating === 'moderate'
                      ? 'badge-gold'
                      : 'badge-terracotta'
                  }`}
                >
                  {activeCrisisOutcome.rating.toUpperCase()} OUTCOME
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {activeCrisisOutcome.event.name}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.45rem' }}>
                {activeCrisisOutcome.success ? 'Fortress Withstood Deluge' : 'Defenses Breached / Strained'}
              </h4>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                {activeCrisisOutcome.impactSummary}
              </p>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderLeft: '2px solid var(--accent-gold)',
                  padding: '0.65rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                }}
              >
                {activeCrisisOutcome.culturalInsight}
              </div>

              <button
                onClick={() => {
                  const knowledge = getCulturalKnowledgeById(
                    activeCrisisOutcome.event.relatedKnowledgeId
                  );
                  if (knowledge) setActiveDiscovery(knowledge);
                }}
                className="btn btn-gold btn-sm"
                style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Sparkles size={14} /> Discover The Real History
              </button>
            </div>
          )}

          {/* Grounded AI Game Master Widget */}
          <GameMasterWidget
            lastResponse={lastGameMasterResponse}
            mode={gameMasterMode}
            onRequestHint={handleRequestHint}
            isLoading={gmLoading}
          />
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
              background: 'linear-gradient(145deg, #181d26, #10131a)',
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
                <span className="badge badge-gold">STRATEGIC DISPATCH</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Adnyapatra Treatises
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
              Mission: Fortify the Sahyadri Escarpment
            </h3>

            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              As documented in Ramchandra Pant Amatya&apos;s <em>Adnyapatra</em> (1715 CE):{' '}
              <em>&quot;Hill forts are the very essence of the kingdom... A fort without independent water storage is like a cage.&quot;</em>{' '}
              You must construct a sustainable defense on this basalt outcrop before seasonal crises strike.
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
                CIVIL &amp; DEFENSIVE BLUEPRINT:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>
                  <strong>Catchment Basins:</strong> Carve rock-cut rainwater cisterns (<em>Tankas</em>) to secure water resilience.
                </li>
                <li>
                  <strong>Cliff Ridges:</strong> Construct curtain bastions (<em>Buruj</em>) and watchtowers with clear fields of fire.
                </li>
                <li>
                  <strong>Choke Portals:</strong> Place Maha Darwaja gates in recessed angles to break enemy momentum.
                </li>
                <li>
                  <strong>Plateau Center:</strong> Build elevated Amberkhana granaries to withstand prolonged sieges.
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
                VICTORY REQUIREMENTS:
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                1. Place at least 3 historical structures • 2. Test fortress against at least 1 seasonal crisis • 3. Maintain Fort Resilience ≥ 40.
              </div>
            </div>

            <button
              onClick={() => setIsBriefingOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
            >
              Begin Fort Construction
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
          experienceTitle="Fort Master: Bastions & Monsoon"
          xpEarned={Math.round(100 + metrics.overallScore * 0.6)}
          domainGains={{
            waterManagement: Math.round(metrics.waterResilience * 0.15),
            defence: Math.round(metrics.defenceRating * 0.15),
            architecture: 10,
          }}
          discoveriesUnlocked={['ck-shivneri-rainwater', 'ck-arthashastra-forts']}
          recommendedExperience={{
            id: 'bharat-architect',
            title: 'Bharat Architect: Harappan Grid',
            reason:
              'You mastered high-altitude fort resilience. Next, discover how Harappan engineers managed water flow and urban sanitation at ground level.',
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
