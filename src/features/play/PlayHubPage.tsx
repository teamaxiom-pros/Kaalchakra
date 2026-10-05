import React, { useState } from 'react';
import { EXPERIENCES } from '../../data/experiences';
import { ExperienceCategory } from '../../types/experience';
import { Sparkles, Shield, Hammer, Compass, Clock, ArrowRight } from 'lucide-react';
import {
  RoyalSealBadge,
  TopographicMapSvg,
  CornerBrackets,
  WaxSealStamp,
  HistoricalDivider,
} from '../../components/common/HistoricalMotifs';

interface PlayHubPageProps {
  navigate: (path: string) => void;
}

export const PlayHubPage: React.FC<PlayHubPageProps> = ({ navigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | ExperienceCategory>('all');

  const filtered = activeCategory === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.category === activeCategory);

  return (
    <div style={{ position: 'relative', padding: '2.5rem 0 5rem 0', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <TopographicMapSvg opacity={0.06} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Page Header */}
        <div style={{ maxWidth: '820px', marginBottom: '2.5rem' }}>
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
            <span>THE ROYAL ARCHIVE OF EXPERIENCES</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: '#fff8eb', marginBottom: '0.65rem' }}>
            Experience Ancient India
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Choose your learning pathway across Play, Build, and Explore. Every experience translates
            civilizational history into tactile decisions, structural puzzles, and grounded archaeological discovery.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--border-gold)',
            paddingBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`btn btn-sm ${activeCategory === 'all' ? 'btn-gold' : 'btn-secondary'}`}
          >
            All 7 Chapters
          </button>
          <button
            onClick={() => setActiveCategory('play')}
            className={`btn btn-sm ${activeCategory === 'play' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            <Shield size={14} /> Play (Fortress Strategy &amp; Defense)
          </button>
          <button
            onClick={() => setActiveCategory('build')}
            className={`btn btn-sm ${activeCategory === 'build' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            <Hammer size={14} /> Build (Urban Planning &amp; Hydrology)
          </button>
          <button
            onClick={() => setActiveCategory('explore')}
            className={`btn btn-sm ${activeCategory === 'explore' ? 'btn-gold' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            <Compass size={14} /> Explore (Epigraphy &amp; Heritage)
          </button>
        </div>

        {/* Experience Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {filtered.map(exp => {
            const isPlayable = exp.status === 'playable';

            return (
              <div
                key={exp.id}
                className="artifact-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isPlayable ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-gold)',
                  background: isPlayable
                    ? 'linear-gradient(145deg, rgba(24, 28, 36, 0.95), rgba(15, 18, 24, 0.95))'
                    : 'rgba(20, 24, 30, 0.65)',
                }}
              >
                <CornerBrackets />
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
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span
                        className={`badge ${isPlayable ? 'badge-gold' : 'badge-muted'}`}
                        style={{ fontSize: '0.72rem' }}
                      >
                        {isPlayable ? 'Playable Now' : 'Curriculum Roadmap'}
                      </span>
                      {isPlayable && <WaxSealStamp size={28} label="मुद्रा" />}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', fontFamily: 'var(--font-serif)' }}>
                    {exp.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.86rem',
                      color: 'var(--accent-gold-light)',
                      fontWeight: 600,
                      marginBottom: '0.85rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {exp.tagline}
                  </div>

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
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
                        className="badge badge-muted"
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
                      borderTop: '1px solid var(--border-gold)',
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
                    onClick={() => navigate(exp.route.replace('/kaalchakra', ''))}
                    className={`btn ${isPlayable ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ width: '100%', justifyContent: 'center', gap: '0.4rem', letterSpacing: '0.06em' }}
                  >
                    {isPlayable ? (
                      <>
                        <Sparkles size={14} /> ENTER CHAPTER
                      </>
                    ) : (
                      <>
                        VIEW CULTURAL PURPOSE <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
