import React from 'react';
import { getExperienceById } from '../../../data/experiences';
import { ArrowLeft, Sparkles, Compass, CheckCircle2, Clock, Landmark } from 'lucide-react';

interface ModulePreviewPageProps {
  experienceId: string;
  onNavigate: (path: string) => void;
}

export const ModulePreviewPage: React.FC<ModulePreviewPageProps> = ({
  experienceId,
  onNavigate,
}) => {
  const exp = getExperienceById(experienceId);

  if (!exp) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Experience Not Found</h2>
        <button onClick={() => onNavigate('/kaalchakra/play')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Experiences
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem', maxWidth: '840px' }}>
      <button
        onClick={() => onNavigate('/kaalchakra/play')}
        className="btn btn-ghost btn-sm"
        style={{ gap: '0.4rem', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> All Experiences
      </button>

      {/* Main Preview Hero Card */}
      <div
        className="kc-card"
        style={{
          border: '1.5px solid var(--border-gold)',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '8rem',
            opacity: 0.08,
            userSelect: 'none',
          }}
        >
          {exp.badgeIcon}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <div
            className="badge badge-gold"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            <Clock size={13} />
            Roadmap Module Preview
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Category: {exp.category.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0 1.25rem 0' }}>
          <span style={{ fontSize: '3rem' }}>{exp.badgeIcon}</span>
          <div>
            <h1 style={{ fontSize: '2rem', lineHeight: 1.2 }}>{exp.title}</h1>
            <div style={{ fontSize: '1rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {exp.tagline}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
          {exp.description}
        </p>

        {/* Cultural Focus Tags */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '0.65rem',
            }}
          >
            Cultural Domains Discovered in this Module:
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {exp.culturalFocus.map(domain => (
              <span key={domain} className="badge badge-terracotta" style={{ textTransform: 'capitalize' }}>
                {domain.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Planned Mechanics Preview */}
        {exp.previewFocus && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              Planned Experiential Mechanics:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {exp.previewFocus.map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-gold)" />
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sneak Peek Interactive Simulation */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(229, 184, 66, 0.08), rgba(224, 90, 54, 0.08))',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            Cultural Architecture Hook
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            This experience implements our standardized <code>GameEngine</code> event interface,
            allowing connected session telemetry, grounded ASI sources, and future physical toy
            board tokens to attach seamlessly.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('/kaalchakra/experience/fort-master')}
            className="btn btn-primary"
          >
            <Sparkles size={16} /> Play Flagship Slice: Fort Master
          </button>
          <button
            onClick={() => onNavigate('/kaalchakra/discover')}
            className="btn btn-secondary"
          >
            <Compass size={16} /> Explore Cultural Database
          </button>
        </div>
      </div>
    </div>
  );
};
