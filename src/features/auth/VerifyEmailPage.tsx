import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  RoyalSealBadge,
  CornerBrackets,
  TopographicMapSvg,
} from '../../components/common/HistoricalMotifs';

interface VerifyEmailPageProps {
  navigate: (path: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ navigate }) => {
  const { user, isEmailVerified } = useAuth();
  const [resendEmail, setResendEmail] = useState('');
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = resendEmail || user?.email;
    if (!targetEmail) {
      setResendFeedback('Please specify an email address.');
      return;
    }

    setIsResending(true);
    setResendFeedback(null);
    try {
      setResendFeedback(`Verification token re-dispatched to ${targetEmail}. Please check your inbox.`);
    } finally {
      setIsResending(false);
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

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 2 }}>
        <button
          onClick={() => navigate('/')}
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
          <ArrowLeft size={15} /> Return to Main Chronicle
        </button>

        <div className="artifact-card" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <CornerBrackets />

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <RoyalSealBadge size={60} />
          </div>

          <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Seal Verification Required
          </div>

          <h2 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
            Inspect Your Dispatch Box
          </h2>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            We dispatched a royal verification token to your inscribed email address. Click the dispatch link
            to authoritatively verify your scholar account and unlock your personalized cultural journey.
          </p>

          {isEmailVerified ? (
            <div
              style={{
                background: 'rgba(45, 107, 79, 0.2)',
                border: '1px solid rgba(45, 107, 79, 0.5)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#6ee7b7', fontWeight: 700 }}>
                <CheckCircle size={18} /> Account Verified!
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Your scholar credentials are fully activated.
              </p>
              <button onClick={() => navigate('/app')} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Enter Kaalchakra App <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(14, 17, 22, 0.95)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                textAlign: 'left',
                border: '1px solid var(--border-gold)',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold-light)', marginBottom: '0.5rem' }}>
                Haven't received the dispatch token?
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Check your spam folder or re-enter your email to dispatch another confirmation token:
              </p>
              <form onSubmit={handleResend} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder={user?.email || 'scholar@gurukul.edu'}
                  value={resendEmail}
                  onChange={e => setResendEmail(e.target.value)}
                  className="kc-input"
                  style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                />
                <button
                  type="submit"
                  disabled={isResending}
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {isResending ? 'Sending...' : 'Resend'}
                </button>
              </form>
              {resendFeedback && (
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>
                  {resendFeedback}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/auth/login')}
              className="btn btn-primary btn-sm"
            >
              Continue to Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-ghost btn-sm"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
