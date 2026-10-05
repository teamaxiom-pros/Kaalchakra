import React from 'react';
import { CulturalKnowledge } from '../../types/cultural';
import { X, ExternalLink, Sparkles, BookOpen, Compass } from 'lucide-react';

interface DiscoveryCardModalProps {
  knowledge: CulturalKnowledge | null;
  onClose: () => void;
  onNavigateExperience?: (experienceId: string) => void;
}

export const DiscoveryCardModal: React.FC<DiscoveryCardModalProps> = ({
  knowledge,
  onClose,
  onNavigateExperience,
}) => {
  if (!knowledge) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          border: '1.5px solid var(--accent-gold)',
          padding: '2rem',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-ghost btn-sm"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.4rem',
            borderRadius: '50%',
          }}
          aria-label="Close discovery modal"
        >
          <X size={20} />
        </button>

        {/* Discovery Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <div
            className="badge badge-gold"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
            }}
          >
            <Sparkles size={13} />
            Cultural Discovery Unlocked
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {knowledge.region}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.65rem',
            color: 'var(--text-primary)',
            marginBottom: '0.35rem',
          }}
        >
          {knowledge.title}
        </h2>

        {knowledge.subtitle && (
          <div
            style={{
              fontSize: '0.95rem',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            {knowledge.subtitle} • {knowledge.era}
          </div>
        )}

        {/* Domain Tags */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {knowledge.domain.map(d => (
            <span key={d} className="badge badge-terracotta" style={{ textTransform: 'capitalize' }}>
              {d.replace('-', ' ')}
            </span>
          ))}
        </div>

        {/* Summary Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.5rem',
            }}
          >
            <BookOpen size={14} color="var(--accent-gold)" />
            Historical Reality
          </div>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            {knowledge.summary}
          </p>
        </div>

        {/* Why it Matters / Significance */}
        <div
          style={{
            background: 'rgba(229, 184, 66, 0.05)',
            borderLeft: '3px solid var(--accent-gold)',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            padding: '1.1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--accent-gold)',
              marginBottom: '0.35rem',
            }}
          >
            Why This Cultural Concept Matters
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            {knowledge.significance}
          </p>
        </div>

        {/* Quote or Practical Insight */}
        {knowledge.keyQuote && (
          <blockquote
            style={{
              fontStyle: 'italic',
              fontSize: '0.9rem',
              color: 'var(--accent-gold)',
              margin: '1.25rem 0',
              paddingLeft: '1rem',
              borderLeft: '2px solid rgba(229, 184, 66, 0.4)',
            }}
          >
            {knowledge.keyQuote}
          </blockquote>
        )}

        {/* Grounded Source Reference */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-primary)',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            margin: '1.5rem 0',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Verified Source
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {knowledge.sourceName}
            </div>
          </div>
          <a
            href={knowledge.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            View Official Record <ExternalLink size={12} />
          </a>
        </div>

        {/* Related Experiences */}
        {knowledge.relatedExperiences.length > 0 && onNavigateExperience && (
          <div>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: '0.65rem',
              }}
            >
              Related Kaalchakra Experiences:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {knowledge.relatedExperiences.map(expId => (
                <button
                  key={expId}
                  onClick={() => {
                    onClose();
                    onNavigateExperience(expId);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textTransform: 'capitalize',
                  }}
                >
                  <Compass size={13} color="var(--accent-terracotta)" />
                  {expId.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
