import React, { useState } from 'react';
import { GameMasterResponse } from '../../types/ai';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface GameMasterWidgetProps {
  lastResponse: GameMasterResponse | null;
  mode: 'local-deterministic' | 'gemini-live';
  onRequestHint?: () => void;
  isLoading?: boolean;
}

export const GameMasterWidget: React.FC<GameMasterWidgetProps> = ({
  lastResponse,
  mode,
  onRequestHint,
  isLoading = false,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="kc-card"
      style={{
        background: 'rgba(19, 25, 34, 0.92)',
        border: '1px solid var(--border-gold)',
        padding: '1.15rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-terracotta))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
            }}
          >
            <Sparkles size={15} />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
              }}
            >
              Kaalchakra Game Master
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {mode === 'gemini-live' ? '⚡ Gemini 1.5 Live AI' : '🏛️ Grounded Local Historical Engine'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            className={`badge ${mode === 'gemini-live' ? 'badge-indigo' : 'badge-muted'}`}
            style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
          >
            {mode === 'gemini-live' ? 'Live AI' : 'Deterministic'}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.2rem' }}
            aria-label="Toggle Game Master panel"
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div style={{ marginTop: '0.85rem' }}>
          {lastResponse ? (
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.35rem',
                }}
              >
                {lastResponse.title}
              </div>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '0.65rem',
                }}
              >
                {lastResponse.narration}
              </p>

              {lastResponse.historicalContext && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: '2px solid var(--accent-gold)',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.65rem',
                  }}
                >
                  <strong style={{ color: 'var(--accent-gold)' }}>Historical Precedent: </strong>
                  {lastResponse.historicalContext}
                </div>
              )}

              {lastResponse.guidance && (
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--accent-terracotta)',
                    fontWeight: 600,
                    marginBottom: '0.45rem',
                  }}
                >
                  💡 Tactical Principle: {lastResponse.guidance}
                </div>
              )}

              {lastResponse.sourceAttribution && (
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <BookOpen size={11} /> Grounded Source: {lastResponse.sourceAttribution}
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Make a move on the board or trigger a test to receive grounded historical guidance from the
              Game Master.
            </p>
          )}

          {/* Action Row */}
          {onRequestHint && (
            <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <button
                onClick={onRequestHint}
                disabled={isLoading}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.8rem', gap: '0.4rem' }}
              >
                <HelpCircle size={14} color="var(--accent-gold)" />
                {isLoading ? 'Consulting Historical Records...' : 'Request Strategic Ancient Clue'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
