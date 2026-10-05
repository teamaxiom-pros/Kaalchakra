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
  CheckCircle,
  Compass,
  History,
  Shield,
  RotateCcw,
} from 'lucide-react';

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
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
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
          <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
            <Award size={13} />
            Unified Cultural Progress
          </div>
          <h1 style={{ fontSize: '2.4rem' }}>Your Cultural Journey</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Every fortress built, drain planned, and glyph deciphered advances your civilizational
            mastery.
          </p>
        </div>

        <button onClick={handleResetJourney} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
          <RotateCcw size={14} /> Reset Prototype Journey
        </button>
      </div>

      {/* Hero Progression Banner */}
      <div
        className="kc-card"
        style={{
          background: 'linear-gradient(135deg, #182230, #131922)',
          border: '1.5px solid var(--border-gold)',
          padding: '2rem',
          marginBottom: '2.5rem',
        }}
      >
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
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Scholar Profile
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {profile.name}
            </h2>
            <div style={{ color: 'var(--accent-gold)', fontSize: '1rem', fontWeight: 600 }}>
              Title: {profile.title} • Level {profile.level}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Civilization XP
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {profile.civilizationXp}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Discoveries
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>
                {profile.unlockedDiscoveries.length}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Achievements
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {profile.unlockedAchievements.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Next Step Recommendation */}
      <div
        className="kc-card"
        style={{
          background: 'linear-gradient(135deg, rgba(229, 184, 66, 0.08), rgba(59, 130, 246, 0.08))',
          borderLeft: '4px solid var(--accent-gold)',
          padding: '1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '0.35rem' }}>
            Personalized Cultural Recommendation
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
            Focus on {recommendation.knowledgeFocus.replace('-', ' ')}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {recommendation.reason}
          </p>
        </div>

        <button
          onClick={() => navigate(`/kaalchakra/experience/${recommendation.experienceId}`)}
          className="btn btn-gold btn-sm"
          style={{ gap: '0.45rem' }}
        >
          Launch Experience <ArrowRight size={14} />
        </button>
      </div>

      {/* Domain Masteries Radar Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>Cultural Domain Masteries</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Balanced across architecture, defense, hydraulics, engineering, and ancient epigraphy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {Object.entries(profile.domainScores).map(([domain, score]) => (
            <div key={domain} className="kc-card-flat" style={{ border: '1px solid var(--border-subtle)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.65rem',
                }}
              >
                <span style={{ fontSize: '0.92rem', fontWeight: 700, textTransform: 'capitalize' }}>
                  {domain.replace('-', ' ')}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
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
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>
          Unlocked Cultural Discoveries ({profile.unlockedDiscoveries.length})
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Authentic archaeological and civilizational records unlocked through your gameplay decisions.
        </p>

        {profile.unlockedDiscoveries.length === 0 ? (
          <div
            className="kc-card"
            style={{
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
              border: '1.5px dashed var(--border-subtle)',
            }}
          >
            <Compass size={36} color="var(--accent-gold)" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Your Cultural Journey Starts Here</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
              Play Fort Master, Bharat Architect, or Lost Script to unlock verified archaeological records and civilizational discoveries.
            </p>
            <button onClick={() => navigate('/kaalchakra/play')} className="btn btn-gold btn-sm">
              Explore Experiences
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {profile.unlockedDiscoveries.map(discId => {
              const k = CULTURAL_DATABASE.find(item => item.id === discId);
              if (!k) return null;

              return (
                <div
                  key={discId}
                  className="kc-card"
                  onClick={() => setSelectedKnowledge(k)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setSelectedKnowledge(k)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <Sparkles size={14} color="var(--accent-gold)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{k.region}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{k.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                      {k.summary.slice(0, 140)}...
                    </p>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
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
        <h3 style={{ fontSize: '1.45rem', marginBottom: '0.35rem' }}>Cultural Milestones & Badges</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Earned by solving architectural, hydraulic, and epigraphical challenges.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.15rem' }}>
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = profile.unlockedAchievements.includes(ach.id);

            return (
              <div
                key={ach.id}
                className="kc-card-flat"
                style={{
                  border: isUnlocked ? '1.5px solid var(--accent-gold)' : '1px dashed var(--border-subtle)',
                  background: isUnlocked ? 'rgba(229, 184, 66, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  opacity: isUnlocked ? 1 : 0.5,
                  padding: '1.15rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                  <span style={{ fontSize: '1.8rem' }}>{ach.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {ach.title}
                    </h4>
                    <span className={`badge ${isUnlocked ? 'badge-gold' : 'badge-muted'}`} style={{ fontSize: '0.65rem' }}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ach.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Telemetry Session Log */}
      {sessions.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <History size={16} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.25rem' }}>Recent Experience Sessions</h3>
          </div>

          <div className="kc-card-flat" style={{ padding: '0.5rem 1rem' }}>
            {sessions.slice(0, 5).map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: idx < sessions.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <strong>{s.experienceId.replace('-', ' ').toUpperCase()}</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Session {s.sessionId.slice(0, 8)} • Completed at {new Date(s.startedAt).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>+{s.xpEarned} XP</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Score: {s.score} / 100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discovery Modal */}
      {selectedKnowledge && (
        <DiscoveryCardModal
          knowledge={selectedKnowledge}
          onClose={() => setSelectedKnowledge(null)}
          onNavigateExperience={expId => navigate(`/kaalchakra/experience/${expId}`)}
        />
      )}
    </div>
  );
};
