import React, { useState } from 'react';
import { PlayerProfile } from '../../types/player';
import { ACHIEVEMENTS } from '../../data/achievements';
import { CULTURAL_DATABASE } from '../../data/culturalDatabase';
import { recommendNextExperience } from '../../domain/progression/recommendationEngine';
import { DiscoveryCardModal } from '../../components/common/DiscoveryCardModal';
import { CulturalKnowledge } from '../../types/cultural';
import { storageService } from '../../services/storageService';
import {
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  RotateCcw,
} from 'lucide-react';
import {
  RoyalSealBadge,
  TopographicMapSvg,
  CornerBrackets,
  WaxSealStamp,
  HistoricalDivider,
} from '../../components/common/HistoricalMotifs';

interface JourneyPageProps {
  profile: PlayerProfile;
  navigate: (path: string) => void;
  onProfileUpdated?: (updated: PlayerProfile) => void;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ profile, navigate, onProfileUpdated }) => {
  const [selectedKnowledge, setSelectedKnowledge] = useState<CulturalKnowledge | null>(null);

  const recommendation = recommendNextExperience(
    profile,
    profile.completedExperiences[profile.completedExperiences.length - 1]
  );

  const sessions = storageService.loadGameSessions();

  const handleResetJourney = () => {
    if (window.confirm('Reset local prototype journey progress? Unrelated app data will not be touched.')) {
      const reset = storageService.resetJourney();
      if (onProfileUpdated) onProfileUpdated(reset);
    }
  };

  return (
    <div style={{ position: 'relative', padding: '2.5rem 0 5rem 0', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <TopographicMapSvg opacity={0.06} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              className="badge badge-gold"
              style={{
                marginBottom: '0.65rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-gold)',
              }}
            >
              <RoyalSealBadge size={16} />
              <span>UNIFIED CULTURAL CHRONICLE</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: '#fff8eb' }}>
              Your Cultural Journey
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Every fortress built, drain planned, and glyph deciphered advances your civilizational mastery.
            </p>
          </div>

          <button onClick={handleResetJourney} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            <RotateCcw size={14} /> Reset Prototype Journey
          </button>
        </div>

        {/* Hero Progression Banner (Ancient Scholar Tablet) */}
        <div
          className="artifact-card"
          style={{
            background: 'linear-gradient(135deg, #1b202a 0%, #11141b 100%)',
            border: '1.5px solid var(--accent-gold)',
            padding: '2.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <CornerBrackets />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em' }}>
                INSCRIBED SCHOLAR PROFILE
              </div>
              <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: '#fff8eb', marginBottom: '0.25rem' }}>
                {profile.name}
              </h2>
              <div style={{ color: 'var(--accent-gold-light)', fontSize: '1rem', fontWeight: 600 }}>
                Title: {profile.title} • Level {profile.level}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '2.5rem',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-serif)' }}>
                  Civilization XP
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {profile.civilizationXp}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-serif)' }}>
                  Discoveries Unlocked
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f7a256' }}>
                  {profile.unlockedDiscoveries.length}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-serif)' }}>
                  Milestones
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6ee7b7' }}>
                  {profile.unlockedAchievements.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Next Step Recommendation */}
        <div
          className="parchment-panel"
          style={{
            borderLeft: '4px solid var(--accent-gold)',
            padding: '1.75rem 2rem',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
              PERSONALIZED CULTURAL RECOMMENDATION
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
              Focus on {recommendation.knowledgeFocus.replace('-', ' ')}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {recommendation.reason}
            </p>
          </div>

          <button
            onClick={() => navigate(`/experience/${recommendation.experienceId}`)}
            className="btn btn-primary btn-sm"
            style={{ gap: '0.45rem', padding: '0.65rem 1.25rem' }}
          >
            Launch Experience <ArrowRight size={14} />
          </button>
        </div>

        {/* Domain Masteries Radar Grid */}
        <div style={{ marginBottom: '3.5rem' }}>
          <HistoricalDivider label="CULTURAL DOMAIN MASTERIES" />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Balanced across architecture, defense, hydraulics, engineering, and ancient epigraphy.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {Object.entries(profile.domainScores).map(([domain, score]) => (
              <div key={domain} className="artifact-card" style={{ padding: '1.25rem' }}>
                <CornerBrackets />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, textTransform: 'capitalize', fontFamily: 'var(--font-serif)' }}>
                    {domain.replace('-', ' ')}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                    {score}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill fill-gold"
                    style={{ width: `${Math.min(100, score)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Cultural Discoveries Chronicle */}
        <div style={{ marginBottom: '3.5rem' }}>
          <HistoricalDivider label={`UNLOCKED CULTURAL DISCOVERIES (${profile.unlockedDiscoveries.length})`} />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem', textAlign: 'center' }}>
            Authentic archaeological and civilizational records unlocked through your gameplay decisions.
          </p>

          {profile.unlockedDiscoveries.length === 0 ? (
            <div
              className="artifact-card"
              style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                border: '1.5px dashed var(--border-gold)',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              <CornerBrackets />
              <Compass size={40} color="var(--accent-gold)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                Your Cultural Chronicle Starts Here
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Play Fort Master, Bharat Architect, or Lost Script to unlock verified archaeological records and civilizational discoveries.
              </p>
              <button onClick={() => navigate('/experiences')} className="btn btn-primary btn-sm">
                Explore Experiences
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
              {profile.unlockedDiscoveries.map(discId => {
                const k = CULTURAL_DATABASE.find(item => item.id === discId);
                if (!k) return null;

                return (
                  <div
                    key={discId}
                    className="artifact-card"
                    onClick={() => setSelectedKnowledge(k)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setSelectedKnowledge(k)}
                  >
                    <CornerBrackets />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
                        <Sparkles size={14} color="var(--accent-gold)" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.region}</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
                        {k.title}
                      </h4>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {k.summary.slice(0, 140)}...
                      </p>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      Read Grounded Record →
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievements Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <HistoricalDivider label="CULTURAL MILESTONES &amp; SEALS" />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.75rem', textAlign: 'center' }}>
            Earned by solving architectural, hydraulic, and epigraphical challenges.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = profile.unlockedAchievements.includes(ach.id);

              return (
                <div
                  key={ach.id}
                  className="artifact-card"
                  style={{
                    border: isUnlocked ? '1.5px solid var(--accent-gold)' : '1px dashed var(--border-gold)',
                    background: isUnlocked ? 'rgba(30, 26, 20, 0.95)' : 'rgba(15, 18, 23, 0.65)',
                    opacity: isUnlocked ? 1 : 0.45,
                    padding: '1.25rem',
                  }}
                >
                  <CornerBrackets />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{ach.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>{ach.title}</h4>
                      <div style={{ fontSize: '0.72rem', color: isUnlocked ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                        {isUnlocked ? '✦ Inscribed' : 'Locked'}
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ach.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
