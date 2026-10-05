import React, { useState } from 'react';
import { PlayerProfile } from '../../types/player';
import { EXPERIENCES } from '../../data/experiences';
import { CULTURAL_DATABASE } from '../../data/culturalDatabase';
import { CulturalKnowledge } from '../../types/cultural';
import { DiscoveryCardModal } from '../../components/common/DiscoveryCardModal';
import {
  Sparkles,
  Compass,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import {
  RoyalSealBadge,
  TopographicMapSvg,
  CornerBrackets,
  WaxSealStamp,
  HistoricalDivider,
  FortGateIcon,
  MasonCompassIcon,
  EpigraphTabletIcon,
} from '../../components/common/HistoricalMotifs';

interface HomePageProps {
  profile: PlayerProfile;
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ profile, navigate }) => {
  const [selectedKnowledge, setSelectedKnowledge] = useState<CulturalKnowledge | null>(null);

  const playableExperiences = EXPERIENCES.filter(e => e.status === 'playable');
  const previewExperiences = EXPERIENCES.filter(e => e.status === 'preview');

  // Highlighted rotating discovery
  const highlightedDiscovery = CULTURAL_DATABASE[0];

  const isBrandNewUser = profile.civilizationXp === 0 && profile.completedExperiences.length === 0;

  return (
    <div style={{ paddingBottom: '5rem', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Top Welcome Header for Authenticated Scholar (Strategic Map Table) */}
      <section
        style={{
          position: 'relative',
          padding: '3.5rem 0 2.5rem 0',
          borderBottom: '1px solid var(--border-gold)',
          background: 'linear-gradient(180deg, #141820 0%, #0d0f13 100%)',
          overflow: 'hidden',
        }}
      >
        <TopographicMapSvg opacity={0.09} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '860px' }}>
            <div
              className="badge badge-gold"
              style={{
                marginBottom: '1rem',
                padding: '0.4rem 0.95rem',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-gold)',
              }}
            >
              <RoyalSealBadge size={16} />
              <span>SCHOLAR MAP TABLE &amp; ROYAL ARCHIVE</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
                marginBottom: '0.6rem',
                fontFamily: 'var(--font-serif)',
                color: '#fff8eb',
                letterSpacing: '0.04em',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
              }}
            >
              Welcome to Kaalchakra, {profile.name}
            </h1>

            <p
              style={{
                fontSize: '1.08rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              {isBrandNewUser
                ? 'Your cultural chronicle begins here. Select an experiential slice below to command basalt defenses, engineer Harappan municipal grids, and decipher Ashokan monoliths.'
                : 'Continue advancing your civilizational mastery across ancient architecture, defense, and epigraphy.'}
            </p>

            {/* 3 Real Inscribed Progress Metric Tablets */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '1.25rem',
                maxWidth: '720px',
              }}
            >
              <div
                className="artifact-card"
                style={{
                  padding: '1.15rem 1.4rem',
                  background: 'rgba(20, 24, 32, 0.95)',
                }}
              >
                <CornerBrackets />
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em' }}>
                  Civilization XP
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-gold)', margin: '0.2rem 0' }}>
                  {profile.civilizationXp}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Level {profile.level} Inscribed Scholar</div>
              </div>

              <div
                className="artifact-card"
                style={{
                  padding: '1.15rem 1.4rem',
                  background: 'rgba(20, 24, 32, 0.95)',
                }}
              >
                <CornerBrackets />
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em' }}>
                  Discoveries Unlocked
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f7a256', margin: '0.2rem 0' }}>
                  {profile.unlockedDiscoveries.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Authentic ASI &amp; UNESCO Records</div>
              </div>

              <div
                className="artifact-card"
                style={{
                  padding: '1.15rem 1.4rem',
                  background: 'rgba(20, 24, 32, 0.95)',
                }}
              >
                <CornerBrackets />
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em' }}>
                  Experiences Mastered
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#6ee7b7', margin: '0.2rem 0' }}>
                  {profile.completedExperiences.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {profile.completedExperiences.length === 0 ? 'Ready for First Flight' : 'Simulations Mastered'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Strategic Map Layout */}
      <section className="container" style={{ marginTop: '3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
          {/* Left Column: Featured Slice & Playable Artifact Tablets */}
          <div>
            {/* Featured Experience Banner Tablet */}
            <div
              className="artifact-card"
              style={{
                background: 'linear-gradient(135deg, #1b202a 0%, #11141a 100%)',
                border: '1.5px solid var(--accent-gold)',
                padding: '2.25rem',
                marginBottom: '2.75rem',
              }}
            >
              <CornerBrackets />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <span className="badge badge-gold">
                  {isBrandNewUser ? 'Recommended First Discovery' : 'Featured Chapter'}
                </span>
                <WaxSealStamp size={32} label="दुर्ग" />
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', margin: '0.5rem 0 1rem 0' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '10px',
                    background: 'rgba(200, 106, 26, 0.16)',
                    border: '1.5px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FortGateIcon size={32} color="var(--accent-gold)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', fontFamily: 'var(--font-serif)' }}>
                    Fort Master: Bastions &amp; Monsoon
                  </h2>
                  <div style={{ color: 'var(--accent-gold-light)', fontSize: '0.92rem', fontWeight: 600 }}>
                    Design a fort that withstands Sahyadri monsoons and mountain blockades.
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                Construct rock-cut rainwater cisterns (Tankas), elevated granaries (Amberkhana), and
                flanking bastion gates. Balance stone, water, and food before torrential Sahyadri monsoon
                deluges test your tactical planning.
              </p>

              <button
                onClick={() => navigate('/experience/fort-master')}
                className="btn btn-primary"
                style={{ gap: '0.5rem', padding: '0.85rem 1.75rem', letterSpacing: '0.06em' }}
              >
                {isBrandNewUser ? 'START YOUR FIRST DISCOVERY' : 'ENTER FORTRESS'} <ArrowRight size={16} />
              </button>
            </div>

            {/* Section: 3 Playable Historical Artifact Slices */}
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <HistoricalDivider label="PLAYABLE ARTIFACT SLICES" />
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Fully interactive experiential models grounded in ASI &amp; UNESCO heritage records.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {playableExperiences.map(exp => {
                  const getIcon = () => {
                    if (exp.id === 'fort-master') return <FortGateIcon size={26} color="var(--accent-gold)" />;
                    if (exp.id === 'bharat-architect') return <MasonCompassIcon size={26} color="var(--accent-gold-light)" />;
                    return <EpigraphTabletIcon size={26} color="#fca5a5" />;
                  };

                  const getSeal = () => {
                    if (exp.id === 'fort-master') return 'दुर्ग';
                    if (exp.id === 'bharat-architect') return 'नगर';
                    return 'लिपी';
                  };

                  return (
                    <div
                      key={exp.id}
                      className="artifact-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <CornerBrackets />
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                          }}
                        >
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '8px',
                              background: 'rgba(207, 164, 79, 0.1)',
                              border: '1px solid var(--border-gold)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {getIcon()}
                          </div>
                          <WaxSealStamp size={30} label={getSeal()} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                          {exp.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.86rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.6,
                            marginBottom: '1rem',
                          }}
                        >
                          {exp.tagline}
                        </p>
                      </div>

                      <div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.35rem',
                            flexWrap: 'wrap',
                            marginBottom: '1.25rem',
                          }}
                        >
                          {exp.culturalFocus.slice(0, 2).map(domain => (
                            <span
                              key={domain}
                              className="badge badge-muted"
                              style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}
                            >
                              {domain.replace('-', ' ')}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => navigate(exp.route.replace('/kaalchakra', ''))}
                          className="btn btn-secondary btn-sm"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          Enter Chapter →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: 4 Roadmap Preview Modules */}
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <HistoricalDivider label="CURRICULUM ROADMAP ARCHIVE" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Designed into the unified Kaalchakra ecosystem; preview their cultural purpose.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {previewExperiences.map(exp => (
                  <div
                    key={exp.id}
                    className="kc-card-flat"
                    style={{
                      background: 'rgba(20, 24, 30, 0.6)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '1.25rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.6rem' }}>{exp.badgeIcon}</span>
                        <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
                          Roadmap
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
                        {exp.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                        {exp.tagline}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(exp.route.replace('/kaalchakra', ''))}
                      className="btn btn-ghost btn-sm"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      View Primary Framework →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scholar Journey Ledger & Grounded Heritage Record */}
          <div>
            {/* Player Journey Summary Parchment Ledger */}
            <div className="parchment-panel" style={{ marginBottom: '2rem', padding: '1.75rem 1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em' }}>
                    SCHOLAR PROGRESS
                  </div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                    Your Journey
                  </h3>
                </div>
                <div className="badge badge-gold">Lvl {profile.level}</div>
              </div>

              {isBrandNewUser ? (
                /* Genuine First-Time Empty State */
                <div
                  style={{
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    background: 'rgba(0, 0, 0, 0.35)',
                    borderRadius: '8px',
                    border: '1.5px dashed var(--border-gold)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Compass size={32} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
                    No Chapters Mastered Yet
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1.15rem' }}>
                    Launch your first discovery above to earn Civilization XP, unlock ASI discoveries, and build your domain masteries.
                  </p>
                  <button
                    onClick={() => navigate('/experience/fort-master')}
                    className="btn btn-gold btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                  >
                    Begin Your First Discovery →
                  </button>
                </div>
              ) : (
                /* Real User Progress */
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.4rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {profile.civilizationXp}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Civilization XP</span>
                  </div>

                  {/* Domain Mastery Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span>Architecture (वास्तुकला)</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.architecture}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-terracotta" style={{ width: `${profile.domainScores.architecture}%` }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span>Water Management (जलसंधारण)</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.waterManagement}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-gold" style={{ width: `${profile.domainScores.waterManagement}%` }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span>Defence &amp; Fortresses (दुर्गशास्त्र)</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.defence}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-saffron" style={{ width: `${profile.domainScores.defence}%` }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                        <span>Epigraphy &amp; Heritage (शिलालेख)</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.heritage}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-maroon" style={{ width: `${profile.domainScores.heritage}%` }} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={() => navigate('/journey')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Award size={14} /> View Full Cultural Progress
              </button>
            </div>

            {/* Grounded Heritage Record Artifact Card */}
            <div className="artifact-card" style={{ padding: '1.75rem 1.5rem' }}>
              <CornerBrackets />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--accent-gold)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                <Sparkles size={14} /> Grounded Heritage Record
              </div>

              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
                {highlightedDiscovery.title}
              </h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold-light)', marginBottom: '0.85rem' }}>
                {highlightedDiscovery.subtitle} • {highlightedDiscovery.region}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {highlightedDiscovery.summary.slice(0, 160)}...
              </p>

              <button
                onClick={() => setSelectedKnowledge(highlightedDiscovery)}
                className="btn btn-gold btn-sm"
                style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
              >
                <BookOpen size={14} /> Read Cultural Record
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Discovery Modal */}
      {selectedKnowledge && (
        <DiscoveryCardModal
          knowledge={selectedKnowledge}
          onClose={() => setSelectedKnowledge(null)}
          onNavigateExperience={expId => navigate(`/experience/${expId}`)}
        />
      )}
    </div>
  );
};
