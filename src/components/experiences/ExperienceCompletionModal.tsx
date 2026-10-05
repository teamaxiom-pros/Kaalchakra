import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Compass, Award, ArrowRight, BookOpen } from 'lucide-react';
import { CulturalDomain } from '../../types/cultural';

interface ExperienceCompletionModalProps {
  experienceTitle: string;
  xpEarned: number;
  domainGains: Record<string, number>;
  discoveriesUnlocked: string[];
  newAchievements?: string[];
  recommendedExperience: {
    id: string;
    title: string;
    reason: string;
  };
  onOpenDiscovery: (discoveryId: string) => void;
  onNavigateNext: (experienceId: string) => void;
  onReturnHub: () => void;
}

export const ExperienceCompletionModal: React.FC<ExperienceCompletionModalProps> = ({
  experienceTitle,
  xpEarned,
  domainGains,
  discoveriesUnlocked,
  newAchievements = [],
  recommendedExperience,
  onOpenDiscovery,
  onNavigateNext,
  onReturnHub,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#e5b842', '#e05a36', '#3b82f6', '#10b981'],
      });
    } catch {
      // safe fallback if canvas not available
    }
  }, []);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{
          border: '1.5px solid var(--accent-gold)',
          padding: '2.25rem',
          textAlign: 'center',
        }}
      >
        {/* Celebration Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(229, 184, 66, 0.2), rgba(224, 90, 54, 0.2))',
            border: '2px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 25px var(--accent-gold-glow)',
          }}
        >
          <Sparkles size={32} color="var(--accent-gold)" />
        </div>

        <div
          className="badge badge-gold"
          style={{ marginBottom: '0.65rem', padding: '0.35rem 0.85rem' }}
        >
          Experience Complete
        </div>

        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>{experienceTitle}</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          Your actions deepened your understanding of Indian civilization and planning principles.
        </p>

        {/* Progress Gains Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            background: 'var(--bg-primary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Civilization XP
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              +{xpEarned}
            </div>
          </div>

          {Object.entries(domainGains).map(([domain, gain]) => (
            <div key={domain}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textTransform: 'capitalize',
                }}
              >
                {domain.replace('-', ' ')}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                +{gain} Mastery
              </div>
            </div>
          ))}
        </div>

        {/* New Achievements Unlocked */}
        {newAchievements.length > 0 && (
          <div
            style={{
              background: 'rgba(224, 90, 54, 0.1)',
              border: '1px solid var(--border-terracotta)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
            }}
          >
            <Award size={18} color="var(--accent-terracotta)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-terracotta)' }}>
              Achievement Unlocked: {newAchievements.length} New Cultural Milestone!
            </span>
          </div>
        )}

        {/* Primary Cultural Bridge: Discover the Real History */}
        {discoveriesUnlocked.length > 0 && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(229, 184, 66, 0.08), rgba(224, 90, 54, 0.08))',
              border: '1.5px solid var(--accent-gold)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.35rem',
              marginBottom: '1.75rem',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--accent-gold)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              <BookOpen size={15} />
              Bridge to Reality: Unlocked Cultural Knowledge
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              Understand the real archaeological facts and UNESCO heritage connected to your choices.
            </p>
            <button
              onClick={() => onOpenDiscovery(discoveriesUnlocked[0])}
              className="btn btn-gold btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Discover The Real History
            </button>
          </div>
        )}

        {/* Recommended Next Experience */}
        {recommendedExperience && (
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.15rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '0.3rem',
              }}
            >
              Recommended Next Experience
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.35rem',
              }}
            >
              {recommendedExperience.title}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              {recommendedExperience.reason}
            </p>
            <button
              onClick={() => onNavigateNext(recommendedExperience.id)}
              className="btn btn-primary btn-sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Continue to {recommendedExperience.title} <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Return Button */}
        <button onClick={onReturnHub} className="btn btn-ghost btn-sm" style={{ width: '100%' }}>
          Return to Platform Hub
        </button>
      </div>
    </div>
  );
};
