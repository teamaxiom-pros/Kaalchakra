import React from 'react';
import { Landmark, Compass, Award, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '5rem',
        padding: '3.5rem 0 2rem 0',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--accent-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                ☸
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: 'var(--accent-gold)',
                }}
              >
                KAALCHAKRA
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Transforming Indian civilization from static textbooks into interactive, experiential
              discovery. Build, decide, solve, and understand the cultural ideas behind our history.
            </p>
            <div
              className="badge badge-gold"
              style={{ fontSize: '0.72rem', textTransform: 'none' }}
            >
              Discover History • Experience Culture • Play India
            </div>
          </div>

          {/* Column 2: Playable Experiences */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: 'var(--accent-gold)',
                marginBottom: '1rem',
              }}
            >
              Playable Experiences
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <button
                  onClick={() => navigate('/kaalchakra/experience/fort-master')}
                  className="btn-ghost"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  🏰 Fort Master (Hill Forts & Water)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/kaalchakra/experience/bharat-architect')}
                  className="btn-ghost"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  🏛️ Bharat Architect (Harappan Grid)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/kaalchakra/experience/lost-script')}
                  className="btn-ghost"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  📜 Lost Script (Ashokan Epigraphy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/kaalchakra/play')}
                  className="btn-ghost"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-terracotta)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: 0,
                    fontWeight: 600,
                  }}
                >
                  View All 7 Modules →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Grounded Cultural Sources */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: 'var(--accent-gold)',
                marginBottom: '1rem',
              }}
            >
              Verified Cultural Sources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a
                  href="https://asi.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Archaeological Survey of India (ASI) <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://whc.unesco.org/en/statesparties/in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  UNESCO World Heritage India <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://ignca.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Indira Gandhi National Centre for Arts <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Architecture */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                color: 'var(--accent-gold)',
                marginBottom: '1rem',
              }}
            >
              Core Engine
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Deterministic Game Authority + Grounded AI Game Master + Offline Local Journey
              Persistence.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <span className="badge badge-muted">Offline First</span>
              <span className="badge badge-muted">Smart Board Ready</span>
              <span className="badge badge-muted">Zero Hallucination</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © 2026 Kaalchakra Project • Student Innovation Challenge (SIH) • Discover India Through Play
          </div>
          <div>
            Designed with <span style={{ color: 'var(--accent-terracotta)' }}>♥</span> for Indian
            Civilization & Heritage Learning
          </div>
        </div>
      </div>
    </footer>
  );
};
