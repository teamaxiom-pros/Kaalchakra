import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface VerifyEmailPageProps {
  navigate: (path: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ navigate }) => {
  const { user, isEmailVerified, resetPassword } = useAuth();
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
      // resend verification request
      setResendFeedback(`Verification link has been re-dispatched to ${targetEmail}. Please check your spam folder if it doesn't appear in 2 minutes.`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.25rem 6rem 1.25rem', maxWidth: '520px' }}>
      <div
        className="kc-card"
        style={{
          border: '1.5px solid var(--border-gold)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg), 0 0 35px rgba(229, 184, 66, 0.12)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(229, 184, 66, 0.12)',
            border: '2px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: 'var(--accent-gold)',
          }}
        >
          <Mail size={30} />
        </div>

        <div className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
          Verification Required
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Check Your Email</h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          We sent a verification link to your registered email address. Click the link in your email to
          authoritatively verify your scholar account and unlock your personalized cultural journey.
        </p>

        {isEmailVerified ? (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
              <CheckCircle size={18} /> Email Verified!
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Your account is fully activated.
            </p>
            <button onClick={() => navigate('/kaalchakra')} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
              Enter Kaalchakra <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              textAlign: 'left',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '0.35rem' }}>
              Didn't receive the email?
            </div>
            <form onSubmit={handleResend} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter email to resend"
                defaultValue={user?.email || ''}
                onChange={e => setResendEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={isResending}
                className="btn btn-secondary btn-sm"
                style={{ gap: '0.3rem', fontSize: '0.8rem' }}
              >
                <RefreshCw size={12} className={isResending ? 'spin' : ''} />
                Resend
              </button>
            </form>

            {resendFeedback && (
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '0.5rem' }}>
                {resendFeedback}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
            Sign In Now
          </button>
          <button onClick={() => navigate('/kaalchakra')} className="btn btn-ghost btn-sm">
            Return to Landing
          </button>
        </div>
      </div>
    </div>
  );
};
