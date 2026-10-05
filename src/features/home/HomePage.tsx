import React, { useState } from 'react';
import { PlayerProfile } from '../../types/player';
import { EXPERIENCES } from '../../data/experiences';
import { CULTURAL_DATABASE } from '../../data/culturalDatabase';
import { CulturalKnowledge } from '../../types/cultural';
import { DiscoveryCardModal } from '../../components/common/DiscoveryCardModal';
import {
  Sparkles,
  Compass,
  Shield,
  ArrowRight,
  BookOpen,
  Award,
  Landmark,
  Layers,
  GraduationCap,
} from 'lucide-react';

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
    <div style={{ paddingBottom: '4rem' }}>
      {/* Top Welcome Header for Authenticated Scholar */}
      <section
        style={{
          position: 'relative',
          padding: '3.5rem 0 2.5rem 0',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(180deg, rgba(229, 184, 66, 0.05) 0%, transparent 100%)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '840px' }}>
            <div
              className="badge badge-gold"
              style={{
                marginBottom: '1rem',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
              }}
            >
              <GraduationCap size={14} />
              Scholar Workspace
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-gold) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Kaalchakra, {profile.name}
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              {isBrandNewUser
                ? 'Your cultural journey begins here. Choose an experience below to make decisions, solve civilizational challenges, and unlock authentic archaeological records.'
                : 'Continue advancing your civilizational mastery across ancient architecture, defense, and hydrology.'}
            </p>

            {/* 3 Real Progress Summary Metric Counters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                maxWidth: '680px',
              }}
            >
              <div className="kc-card-flat" style={{ border: '1px solid var(--border-subtle)', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Civilization XP
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {profile.civilizationXp}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Level {profile.level} Scholar</div>
              </div>

              <div className="kc-card-flat" style={{ border: '1px solid var(--border-subtle)', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Discoveries Unlocked
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>
                  {profile.unlockedDiscoveries.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Authentic ASI/UNESCO Records</div>
              </div>

              <div className="kc-card-flat" style={{ border: '1px solid var(--border-subtle)', padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Experiences Completed
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {profile.completedExperiences.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {profile.completedExperiences.length === 0 ? 'Ready for First Flight' : 'Simulations Mastered'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout */}
      <section className="container" style={{ marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Left Column: Featured Experience & Playable Slices */}
          <div>
            {/* Featured Experience Banner */}
            <div
              className="kc-card"
              style={{
                background: 'linear-gradient(135deg, #182230, #111722)',
                border: '1.5px solid var(--border-gold)',
                padding: '2rem',
                marginBottom: '2.5rem',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <span className="badge badge-gold">
                  {isBrandNewUser ? 'Recommended First Discovery' : 'Featured Experience'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Vertical Slice 1 • Flagship
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '0.5rem 0 1rem 0' }}>
                <span style={{ fontSize: '2.5rem' }}>🏰</span>
                <div>
                  <h2 style={{ fontSize: '1.65rem', marginBottom: '0.2rem' }}>
                    Fort Master: Bastions & Monsoon
                  </h2>
                  <div style={{ color: 'var(--accent-gold)', fontSize: '0.92rem', fontWeight: 600 }}>
                    Design a fort that can withstand changing seasons and mountain blockades.
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Construct rock-cut rainwater cisterns (Tankas), elevated granaries (Amberkhana), and
                flanking bastion gates. Balance stone and water before torrential Sahyadri monsoon
                deluges test your tactical planning.
              </p>

              <button
                onClick={() => navigate('/experience/fort-master')}
                className="btn btn-primary"
                style={{ gap: '0.5rem' }}
              >
                {isBrandNewUser ? 'Start Your First Discovery' : 'Launch Experience'} <ArrowRight size={16} />
              </button>
            </div>

            {/* Section: 3 Playable Vertical Slices */}
            <div style={{ marginBottom: '3rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.45rem' }}>3 Playable Vertical Slices</h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Fully interactive experiential models grounded in ASI & UNESCO heritage records.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/experiences')}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--accent-gold)', gap: '0.35rem' }}
                >
                  All Experiences <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {playableExperiences.map(exp => (
                  <div
                    key={exp.id}
                    className="kc-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <span style={{ fontSize: '2rem' }}>{exp.badgeIcon}</span>
                        <span className="badge badge-emerald">Playable Now</span>
                      </div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{exp.title}</h3>
                      <p
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
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
                          marginBottom: '1rem',
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
                        Enter Experience →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: 4 Roadmap Preview Modules */}
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem' }}>Upcoming Experience Modules</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Designed into the unified Kaalchakra ecosystem; preview their cultural purpose.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem' }}>
                {previewExperiences.map(exp => (
                  <div
                    key={exp.id}
                    className="kc-card"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.6rem' }}>{exp.badgeIcon}</span>
                        <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>
                          Roadmap Preview
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>{exp.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
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
                      View Cultural Roadmap →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Your Journey Progress / Empty State & Rotating Cultural Discovery */}
          <div>
            {/* Player Journey Summary Card */}
            <div className="kc-card" style={{ marginBottom: '1.75rem', padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Scholar Progress
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>Your Journey</h3>
                </div>
                <div className="badge badge-gold">Lvl {profile.level}</div>
              </div>

              {isBrandNewUser ? (
                /* Genuine First-Time Empty State */
                <div
                  style={{
                    padding: '1.5rem 1rem',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    border: '1.5px dashed var(--border-subtle)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Compass size={32} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    No experiences completed yet
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    Launch your first discovery above to earn Civilization XP, unlock ASI discoveries, and build your domain masteries.
                  </p>
                  <button
                    onClick={() => navigate('/experience/fort-master')}
                    className="btn btn-gold btn-sm"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
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
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      {profile.civilizationXp}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Civilization XP</span>
                  </div>

                  {/* Domain Mastery Bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span>Architecture</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.architecture}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-terracotta" style={{ width: `${profile.domainScores.architecture}%` }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span>Water Management</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.waterManagement}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-indigo" style={{ width: `${profile.domainScores.waterManagement}%` }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span>Defence & Geography</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.defence}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-gold" style={{ width: `${profile.domainScores.defence}%` }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                        <span>Epigraphy & Heritage</span>
                        <span style={{ fontWeight: 700 }}>{profile.domainScores.heritage}%</span>
                      </div>
                      <div className="progress-bar-container">
                        <div className="progress-bar-fill fill-emerald" style={{ width: `${profile.domainScores.heritage}%` }} />
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

            {/* Discover Something New Card */}
            <div
              className="kc-card"
              style={{
                background: 'linear-gradient(135deg, rgba(229, 184, 66, 0.05), rgba(224, 90, 54, 0.05))',
                border: '1px solid var(--border-gold)',
                padding: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: 'var(--accent-gold)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={14} /> Grounded Heritage Record
              </div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
                {highlightedDiscovery.title}
              </h4>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>
                {highlightedDiscovery.subtitle} • {highlightedDiscovery.region}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
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
