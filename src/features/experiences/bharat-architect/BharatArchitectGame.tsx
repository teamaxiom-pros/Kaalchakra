import React, { useState } from 'react';
import {
  SettlementTile,
  SettlementComponentType,
  SettlementResources,
} from '../../../domain/bharatArchitect/architectTypes';
import {
  SETTLEMENT_COMPONENTS,
  INITIAL_SETTLEMENT_RESOURCES,
  createDefaultSettlementGrid,
  evaluateSettlement,
  placeComponent,
  removeComponent,
} from '../../../domain/bharatArchitect/architectEngine';
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
  Hammer,
  CloudRain,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface BharatArchitectGameProps {
  onCompleteExperience: (
    xpEarned: number,
    domainGains: Record<string, number>,
    unlockedDiscoveries: string[],
    performance: number
  ) => void;
  onNavigate: (path: string) => void;
  gameMasterMode: 'local-deterministic' | 'gemini-live';
}

export const BharatArchitectGame: React.FC<BharatArchitectGameProps> = ({
  onCompleteExperience,
  onNavigate,
  gameMasterMode,
}) => {
  const [grid, setGrid] = useState<SettlementTile[]>(() => createDefaultSettlementGrid(6, 5));
  const [resources, setResources] = useState<SettlementResources>(() => ({
    ...INITIAL_SETTLEMENT_RESOURCES,
  }));
  const [selectedComponent, setSelectedComponent] = useState<SettlementComponentType>('residential_block');
  const [isDismantleMode, setIsDismantleMode] = useState(false);
  const [floodSimulationResult, setFloodSimulationResult] = useState<{
    tested: boolean;
    passed: boolean;
    summary: string;
    culturalFact: string;
  } | null>(null);

  const [lastGameMasterResponse, setLastGameMasterResponse] = useState<GameMasterResponse | null>(null);
  const [gmLoading, setGmLoading] = useState(false);
  const [activeDiscovery, setActiveDiscovery] = useState<CulturalKnowledge | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const evaluation = evaluateSettlement(grid, 6, 5);

  const handleTileClick = async (tile: SettlementTile) => {
    if (isDismantleMode) {
      if (!tile.component) return;
      const res = removeComponent(grid, tile.x, tile.y, resources);
      if (res) {
        setGrid(res.newGrid);
        setResources(res.newResources);
      }
      return;
    }

    const res = placeComponent(grid, tile.x, tile.y, selectedComponent, resources);
    if (!res) return;

    setGrid(res.newGrid);
    setResources(res.newResources);

    const compDef = SETTLEMENT_COMPONENTS[selectedComponent];
    const { provider } = getGameMaster();
    provider
      .explainEvent({
        experienceId: 'bharat-architect',
        eventName: `Placed ${compDef.name}`,
        gameSummary: `Player laid a ${compDef.nativeName} at grid (${tile.x}, ${tile.y}).`,
        playerChoices: [compDef.name],
        consequenceRating: 'optimal',
        relevantDomain: 'architecture',
      })
      .then(res => setLastGameMasterResponse(res))
      .catch(() => {});
  };

  const handleRunFloodSimulation = async () => {
    const passed = evaluation.floodResilienceScore >= 60 && evaluation.sanitationScore >= 50;
    const summary = passed
      ? `Success! Covered drains and water reservoirs diverted 95% of urban stormwater runoff safely into the primary siltation basin. Residential mud-brick foundations remained dry and secure.`
      : `Warning: Floodwaters pooled in unprotected residential blocks. Without continuous covered conduits leading to reservoirs, standing greywater breached living quarters.`;

    const culturalFact =
      'Harappan engineers at Dholavira designed city gradients so storm runoff flowed through limestone-filtered channels into 16 vast reservoirs, ensuring zero wastage of water in the arid Rann.';

    setFloodSimulationResult({
      tested: true,
      passed,
      summary,
      culturalFact,
    });

    setGmLoading(true);
    const { provider } = getGameMaster();
    try {
      const response = await provider.explainEvent({
        experienceId: 'bharat-architect',
        eventName: 'Heavy Urban Runoff',
        gameSummary: summary,
        playerChoices: grid.filter(t => t.component).map(t => t.component!),
        consequenceRating: passed ? 'optimal' : 'critical',
        relevantDomain: 'engineering',
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
        experienceId: 'bharat-architect',
        currentState: `Road Access: ${evaluation.roadAccessibilityScore}%, Sanitation: ${evaluation.sanitationScore}%, Overall: ${evaluation.overallScore}`,
        objective: 'Construct an egalitarian Harappan settlement with full drainage and road connectivity',
        resourcesLeft: { bricks: resources.bricks, timber: resources.timber, labour: resources.labour },
        relevantDomain: 'engineering',
      });
      setLastGameMasterResponse(response);
    } catch {
      // safe
    } finally {
      setGmLoading(false);
    }
  };

  const handleReset = () => {
    setGrid(createDefaultSettlementGrid(6, 5));
    setResources({ ...INITIAL_SETTLEMENT_RESOURCES });
    setFloodSimulationResult(null);
  };

  const handleCompleteMission = () => {
    const xp = Math.round(110 + evaluation.overallScore * 0.6);
    const domainGains = {
      architecture: Math.round(evaluation.roadAccessibilityScore * 0.15),
      engineering: Math.round(evaluation.sanitationScore * 0.15),
      waterManagement: Math.round(evaluation.floodResilienceScore * 0.12),
    };
    const discoveries = ['ck-harappan-grid', 'ck-dholavira-water'];

    onCompleteExperience(xp, domainGains, discoveries, evaluation.overallScore);
    setShowCompletionModal(true);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem 1.25rem' }}>
      {/* Navigation Header */}
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
            <RotateCcw size={14} /> Reset Settlement
          </button>
          <button
            onClick={handleCompleteMission}
            className="btn btn-gold btn-sm"
            style={{ fontWeight: 700 }}
          >
            <Sparkles size={14} /> Conclude Planning
          </button>
        </div>
      </div>

      {/* Mission Banner */}
      <div
        className="kc-card"
        style={{
          background: 'linear-gradient(135deg, rgba(22, 29, 41, 0.95), rgba(30, 41, 59, 0.85))',
          borderLeft: '4px solid var(--accent-gold)',
          marginBottom: '1.75rem',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-gold">Urban Planning Mission</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Bronze-Age Civil Engineering (Mohenjo-daro & Dholavira Tradition)
          </span>
        </div>
        <h2 style={{ fontSize: '1.45rem', marginBottom: '0.45rem' }}>
          Bharat Architect: The Harappan Orthogonal Grid
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Design an egalitarian historical settlement. Ensure every residential home is adjacent to a
          paved thoroughfare and covered wastewater drainage conduit, with public water reservoirs to
          safeguard against monsoon flash floods.
        </p>
      </div>

      {/* Metrics & HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.75rem',
        }}
      >
        <div className="kc-card-flat" style={{ borderLeft: '3px solid #f97316' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Kiln Bricks
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            🧱 {resources.bricks}
          </div>
        </div>

        <div className="kc-card-flat" style={{ borderLeft: '3px solid #a16207' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Teak Timber
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fef08a' }}>
            🪵 {resources.timber}
          </div>
        </div>

        <div className="kc-card-flat" style={{ borderLeft: '3px solid var(--accent-indigo)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Road Transit Access
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-indigo)' }}>
            {evaluation.roadAccessibilityScore}%
          </div>
        </div>

        <div className="kc-card-flat" style={{ borderLeft: '3px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Covered Sanitation
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            {evaluation.sanitationScore}%
          </div>
        </div>

        <div className="kc-card-flat" style={{ borderLeft: '3px solid #38bdf8' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Flood Resilience
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#38bdf8' }}>
            {evaluation.floodResilienceScore}%
          </div>
        </div>

        <div className="kc-card-flat" style={{ borderLeft: '3px solid var(--accent-gold)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Settlement Harmony
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {evaluation.overallScore} / 100
          </div>
        </div>
      </div>

      {/* Main Grid & Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.75rem' }}>
        <div>
          {/* Component Selection Palette */}
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
                CIVIL INFRASTRUCTURE TOOLKIT
              </div>
              <button
                onClick={() => setIsDismantleMode(!isDismantleMode)}
                className={`btn btn-sm ${isDismantleMode ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
              >
                <Hammer size={12} /> {isDismantleMode ? 'Clearing Active' : 'Clear Tile'}
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {(Object.keys(SETTLEMENT_COMPONENTS) as SettlementComponentType[]).map(type => {
                const def = SETTLEMENT_COMPONENTS[type];
                const isSelected = selectedComponent === type && !isDismantleMode;
                const canAfford = resources.bricks >= def.cost.bricks;

                return (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedComponent(type);
                      setIsDismantleMode(false);
                    }}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(229, 184, 66, 0.2), rgba(59, 130, 246, 0.15))'
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
                          {def.cost.bricks} Bricks
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

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
              <strong>{SETTLEMENT_COMPONENTS[selectedComponent].nativeName}:</strong>{' '}
              {SETTLEMENT_COMPONENTS[selectedComponent].description} •{' '}
              <em>{SETTLEMENT_COMPONENTS[selectedComponent].culturalNote}</em>
            </div>
          </div>

          {/* 6x5 Urban Matrix */}
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
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
                width: '100%',
                maxWidth: '540px',
              }}
            >
              {grid.map(tile => {
                const compDef = tile.component ? SETTLEMENT_COMPONENTS[tile.component] : null;

                return (
                  <div
                    key={`${tile.x}-${tile.y}`}
                    onClick={() => handleTileClick(tile)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleTileClick(tile)}
                    aria-label={`Settlement tile at ${tile.x}, ${tile.y} with ${compDef?.name || 'empty earth'}`}
                    style={{
                      aspectRatio: '1',
                      background: compDef ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${compDef ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.15s, border-color 0.15s',
                      boxShadow: compDef ? '0 0 10px rgba(229, 184, 66, 0.15)' : 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {compDef ? (
                      <>
                        <span style={{ fontSize: '1.5rem' }}>{compDef.icon}</span>
                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 700,
                            color: 'var(--accent-gold)',
                            marginTop: '2px',
                            textAlign: 'center',
                          }}
                        >
                          {compDef.name.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.2)' }}>
                        ·
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
                textAlign: 'center',
              }}
            >
              Tip: Place 🛣️ Roads and 🚰 Drains directly adjacent (north/south/east/west) to 🏠 Houses.
            </div>
          </div>

          {/* Stormwater Simulation Trigger */}
          <div className="kc-card" style={{ marginTop: '1.25rem', padding: '1.15rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Test Municipal Runoff Drainage
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Simulates monsoon downpour on the Harappan drainage network.
                </div>
              </div>

              <button
                onClick={handleRunFloodSimulation}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.4rem' }}
              >
                <CloudRain size={16} color="#60a5fa" /> Run Drainage Test
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Game Master & Simulation Results */}
        <div>
          {floodSimulationResult && (
            <div
              className="kc-card"
              style={{
                border: `1.5px solid ${
                  floodSimulationResult.passed ? 'var(--accent-emerald)' : 'var(--accent-terracotta)'
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
                    floodSimulationResult.passed ? 'badge-emerald' : 'badge-terracotta'
                  }`}
                >
                  {floodSimulationResult.passed ? 'DRAINAGE PASS' : 'FLOOD RISK DETECTED'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.45rem' }}>
                {floodSimulationResult.passed
                  ? 'Sanitary Conduits Operational'
                  : 'Drainage Deficit in Residential Wards'}
              </h4>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                {floodSimulationResult.summary}
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
                {floodSimulationResult.culturalFact}
              </div>

              <button
                onClick={() => {
                  const knowledge = getCulturalKnowledgeById('ck-dholavira-water');
                  if (knowledge) setActiveDiscovery(knowledge);
                }}
                className="btn btn-gold btn-sm"
                style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
              >
                <Sparkles size={14} /> Discover The Real History
              </button>
            </div>
          )}

          {/* Game Master Widget */}
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
          experienceTitle="Bharat Architect: Harappan Grid"
          xpEarned={Math.round(110 + evaluation.overallScore * 0.6)}
          domainGains={{
            architecture: Math.round(evaluation.roadAccessibilityScore * 0.15),
            engineering: Math.round(evaluation.sanitationScore * 0.15),
            waterManagement: Math.round(evaluation.floodResilienceScore * 0.12),
          }}
          discoveriesUnlocked={['ck-harappan-grid', 'ck-dholavira-water']}
          recommendedExperience={{
            id: 'lost-script',
            title: 'Lost Script: The Ashokan Epigraph',
            reason:
              'You built a Harappan city grid. Now examine the clay seals and decipher the symbolic inscriptions left behind by bronze-age merchants.',
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
