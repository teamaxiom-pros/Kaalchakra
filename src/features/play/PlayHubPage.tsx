import React, { useState } from 'react';
import { EXPERIENCES } from '../../data/experiences';
import { ExperienceCategory, ExperienceDefinition } from '../../types/experience';
import { Sparkles, Shield, Hammer, Compass, Clock, ArrowRight } from 'lucide-react';

interface PlayHubPageProps {
  navigate: (path: string) => void;
}

export const PlayHubPage: React.FC<PlayHubPageProps> = ({ navigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | ExperienceCategory>('all');

  const filtered = activeCategory === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.category === activeCategory);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      {/* Page Header */}
      <div style={{ maxWidth: '780px', marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
          <Shield size={13} />
          Interactive Cultural Experience Ecosystem
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.65rem' }}>Experience Ancient India</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
          Choose your learning pathway across Play, Build, and Explore. Every experience translates
          civilizational history into tactile decisions, structural puzzles, and grounded discovery.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.65rem',
          marginBottom: '2.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveCategory('all')}
          className={`btn btn-sm ${activeCategory === 'all' ? 'btn-gold' : 'btn-secondary'}`}
        >
          All 7 Modules
        </button>
        <button
          onClick={() => setActiveCategory('play')}
          className={`btn btn-sm ${activeCategory === 'play' ? 'btn-gold' : 'btn-secondary'}`}
          style={{ gap: '0.4rem' }}
        >
          <Shield size={14} /> Play (Strategy & Defense)
        </button>
        <button
          onClick={() => setActiveCategory('build')}
          className={`btn btn-sm ${activeCategory === 'build' ? 'btn-gold' : 'btn-secondary'}`}
          style={{ gap: '0.4rem' }}
        >
          <Hammer size={14} /> Build (Civil Planning & Science)
        </button>
        <button
          onClick={() => setActiveCategory('explore')}
          className={`btn btn-sm ${activeCategory === 'explore' ? 'btn-gold' : 'btn-secondary'}`}
          style={{ gap: '0.4rem' }}
        >
          <Compass size={14} /> Explore (Epigraphy & Heritage)
        </button>
      </div>

      {/* Experience Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(exp => {
          const isPlayable = exp.status === 'playable';

          return (
            <div
              key={exp.id}
              className="kc-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isPlayable ? '1.5px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                background: isPlayable ? 'var(--bg-card)' : 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <div>
                {/* Header Icon & Status */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ fontSize: '2.5rem' }}>{exp.badgeIcon}</span>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span
                      className={`badge ${isPlayable ? 'badge-emerald' : 'badge-muted'}`}
                      style={{ fontSize: '0.72rem' }}
                    >
                      {isPlayable ? 'Playable Slice' : 'Upcoming Preview'}
                    </span>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                      {exp.difficulty}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>{exp.title}</h3>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--accent-gold)',
                    fontWeight: 600,
                    marginBottom: '0.85rem',
                  }}
                >
                  {exp.tagline}
                </div>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                  }}
                >
                  {exp.description}
                </p>

                {/* Cultural Focus Badges */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {exp.culturalFocus.map(d => (
                    <span
                      key={d}
                      className="badge badge-terracotta"
                      style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}
                    >
                      {d.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    marginBottom: '0.85rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> {exp.estimatedTime}
                  </span>
                  <span>Category: {exp.category.toUpperCase()}</span>
                </div>

                <button
                  onClick={() => navigate(exp.route)}
                  className={`btn ${isPlayable ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                >
                  {isPlayable ? (
                    <>
                      <Sparkles size={14} /> Play Experience
                    </>
                  ) : (
                    <>
                      Preview Cultural Purpose <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
