import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import {
  RoyalSealBadge,
  CornerBrackets,
  TopographicMapSvg,
} from '../../components/common/HistoricalMotifs';

interface ForgotPasswordPageProps {
  navigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ navigate }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setFeedback(null);

    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      setFeedback({ success: false, message: error });
    } else {
      setFeedback({
        success: true,
        message: 'Password reset dispatch recorded. Please inspect your email inbox.',
      });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - var(--header-height) - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem 5rem 1.25rem',
      }}
    >
      <TopographicMapSvg opacity={0.07} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 2 }}>
        <button
          onClick={() => navigate('/auth/login')}
          className="btn btn-ghost btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
            padding: '0.3rem 0.5rem',
            fontSize: '0.82rem',
          }}
        >
          <ArrowLeft size={15} /> Back to Sign In
        </button>

        <div className="artifact-card" style={{ padding: '2.5rem 2rem' }}>
          <CornerBrackets />

          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <RoyalSealBadge size={54} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.78rem',
                color: 'var(--accent-gold)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
                fontWeight: 700,
              }}
            >
              ARCHIVE DISPATCH
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontFamily: 'var(--font-serif)',
                marginBottom: '0.4rem',
                color: 'var(--text-primary)',
              }}
            >
              Recover Seal Access
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Enter your inscribed email to receive a recovery token.
            </p>
          </div>

          {feedback && (
            <div
              style={{
                background: feedback.success ? 'rgba(45, 107, 79, 0.2)' : 'rgba(143, 60, 37, 0.15)',
                border: `1px solid ${feedback.success ? 'rgba(45, 107, 79, 0.5)' : 'var(--border-terracotta)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: feedback.success ? '#6ee7b7' : '#f87171',
                fontSize: '0.85rem',
              }}
            >
              {feedback.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                style={{
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 600,
                  color: 'var(--accent-gold-light)',
                  letterSpacing: '0.04em',
                }}
              >
                Inscribed Scholar Email
              </label>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <Mail
                  size={16}
                  color="var(--accent-gold)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem', opacity: 0.8 }}
                />
                <input
                  type="email"
                  required
                  placeholder="scholar@gurukul.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="kc-input"
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                padding: '0.9rem',
                letterSpacing: '0.08em',
              }}
            >
              {isLoading ? 'Dispatching Token...' : 'DISPATCH RECOVERY LINK'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
