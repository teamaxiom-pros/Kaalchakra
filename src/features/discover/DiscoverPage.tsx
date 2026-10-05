import React, { useState } from 'react';
import { searchCulturalDatabase } from '../../data/culturalDatabase';
import { CulturalKnowledge } from '../../types/cultural';
import { DiscoveryCardModal } from '../../components/common/DiscoveryCardModal';
import { Search, BookOpen } from 'lucide-react';
import {
  RoyalSealBadge,
  TopographicMapSvg,
  CornerBrackets,
  HistoricalDivider,
} from '../../components/common/HistoricalMotifs';

interface DiscoverPageProps {
  navigate: (path: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ navigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedKnowledge, setSelectedKnowledge] = useState<CulturalKnowledge | null>(null);

  const domains: { id: string; label: string }[] = [
    { id: '', label: 'All Themes' },
    { id: 'water-management', label: 'Water Management' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'defence', label: 'Defence & Forts' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'language', label: 'Language & Epigraphy' },
    { id: 'trade', label: 'Maritime Trade' },
    { id: 'heritage', label: 'Living Heritage' },
  ];

  const regions: { id: string; label: string }[] = [
    { id: '', label: 'All Regions' },
    { id: 'Western India (Maharashtra / Gujarat)', label: 'Western (MH / GJ)' },
    { id: 'Northern India (Indus / Gangetic)', label: 'Northern (Indus / Gangetic)' },
    { id: 'Southern India (Chola / Deccan)', label: 'Southern (Chola / Deccan)' },
    { id: 'Pan-Indian', label: 'Pan-Indian' },
  ];

  const results = searchCulturalDatabase(searchQuery, selectedDomain || undefined, selectedRegion || undefined);

  return (
    <div style={{ position: 'relative', padding: '2.5rem 0 5rem 0', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <TopographicMapSvg opacity={0.06} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
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
            <span>GROUNDED CULTURAL ARCHIVE</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: '#fff8eb', marginBottom: '0.65rem' }}>
            Discover Ancient India
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Explore verified civilizational achievements, hydraulic networks, fortress planning, and
            ancient scripts. Every entry is directly connected to interactive playable mechanics and
            sourced from official Archaeological Survey of India (ASI) and UNESCO records.
          </p>
        </div>

        {/* Search & Filter Bar (Basalt Map Table Panel) */}
        <div
          className="artifact-card"
          style={{
            background: 'rgba(20, 24, 32, 0.95)',
            padding: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <CornerBrackets />

          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search
              size={18}
              color="var(--accent-gold)"
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', opacity: 0.8 }}
            />
            <input
              type="text"
              placeholder="Search archaeological sites, rock cisterns, edicts, or trade routes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="kc-input"
              style={{ paddingLeft: '2.85rem' }}
            />
          </div>

          {/* Domain Filter Pills */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--accent-gold-light)',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem',
              }}
            >
              Filter by Theme:
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {domains.map(d => {
                const active = selectedDomain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomain(d.id)}
                    className={`btn btn-sm ${active ? 'btn-gold' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Filter Pills */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--accent-gold-light)',
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.08em',
                marginBottom: '0.5rem',
              }}
            >
              Filter by Region:
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {regions.map(r => {
                const active = selectedRegion === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r.id)}
                    className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>
            Showing <strong style={{ color: 'var(--accent-gold)' }}>{results.length}</strong> verified cultural knowledge entries
          </span>
          {(searchQuery || selectedDomain || selectedRegion) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDomain('');
                setSelectedRegion('');
              }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.78rem', color: '#f87171' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Cultural Knowledge Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {results.map(item => (
            <div
              key={item.id}
              className="artifact-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedKnowledge(item)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelectedKnowledge(item)}
            >
              <CornerBrackets />
              <div>
                {/* Header Badges */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {item.domain.map(d => (
                      <span
                        key={d}
                        className="badge badge-gold"
                        style={{ fontSize: '0.68rem', textTransform: 'capitalize' }}
                      >
                        {d.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.region.split('(')[0]}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                  {item.title}
                </h3>
                {item.subtitle && (
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--accent-gold-light)',
                      fontWeight: 600,
                      marginBottom: '0.75rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.subtitle} • {item.era}
                  </div>
                )}

                {/* Summary */}
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: '1rem',
                  }}
                >
                  {item.summary.slice(0, 170)}...
                </p>
              </div>

              {/* Bottom Source & Connection */}
              <div>
                <div
                  style={{
                    borderTop: '1px solid var(--border-gold)',
                    paddingTop: '0.75rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Source: <strong style={{ color: 'var(--text-secondary)' }}>{item.sourceName.split('/')[0]}</strong>
                  </div>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    Explore <BookOpen size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
};
