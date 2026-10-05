import React, { useState } from 'react';
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
  evaluateCrisisEvent,
} from '../../../domain/fortMaster/fortEngine';
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
  Info,
  Droplets,
  Wheat,
  Eye,
  Hammer,
} from 'lucide-react';

interface FortMasterGameProps {
  onCompleteExperience: (
    xpEarned: number,
    domainGains: Record<string, number>,
    unlockedDiscoveries: string[],
    performance: number
  ) => void;
  onNavigate: (path: string) => void;
  gameMasterMode: 'local-deterministic' | 'gemini-live';
}

export const FortMasterGame: React.FC<FortMasterGameProps> = ({
  onCompleteExperience,
  onNavigate,
  gameMasterMode,
}) => {
  const [grid, setGrid] = useState<FortTile[]>(() => createDefaultFortGrid());
  const [resources, setResources] = useState<FortResources>(() => ({ ...INITIAL_FORT_RESOURCES }));
  const [selectedStructure, setSelectedStructure] = useState<FortStructureType>('baoli');
  const [isDismantleMode, setIsDismantleMode] = useState(false);
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

  const metrics = calculateFortMetrics(grid);

  const handleTileClick = async (tile: FortTile) => {
    if (isDismantleMode) {
      if (!tile.structure) return;
      const res = removeStructure(grid, tile.x, tile.y, resources);
      if (res) {
        setGrid(res.newGrid);
        setResources(res.newResources);
      }
      return;
    }

    const res = placeStructure(grid, tile.x, tile.y, selectedStructure, resources);
    if (!res) return;

    setGrid(res.newGrid);
    setResources(res.newResources);

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
  };

  const handleCompleteMission = () => {
    const xp = Math.round(100 + metrics.overallScore * 0.6);
    const domainGains = {
      waterManagement: Math.round(metrics.waterResilience * 0.15),
      defence: Math.round(metrics.defenceRating * 0.15),
      architecture: 10,
    };
    const discoveries = ['ck-shivneri-rainwater', 'ck-arthashastra-forts'];

    onCompleteExperience(xp, domainGains, discoveries, metrics.overallScore);
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
          onClick={() => onNavigate('/kaalchakra/play')}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.4rem' }}
        >
          <ArrowLeft size={16} /> All Experiences
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleReset} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} /> Reset Fort
          </button>
          <button
            onClick={handleCompleteMission}
            className="btn btn-gold btn-sm"
            style={{ fontWeight: 700 }}
          >
            <Sparkles size={14} /> Conclude & Submit Fort
          </button>
        </div>
      </div>

      {/* Mission Banner */}
      <div
        className="kc-card"
        style={{
          background: 'linear-gradient(135deg, rgba(22, 29, 41, 0.95), rgba(30, 41, 59, 0.85))',
          borderLeft: '4px solid var(--accent-terracotta)',
          marginBottom: '1.75rem',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-terracotta">Mission Objective</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Deccan Basalt Hill Fort Architecture (Sahyadri Range)
          </span>
        </div>
        <h2 style={{ fontSize: '1.45rem', marginBottom: '0.45rem' }}>
          Fort Master: Bastions & The Monsoon Deluge
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
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
