import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

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
        message: 'Password reset link dispatched! Please check your email inbox.',
      });
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.25rem 6rem 1.25rem', maxWidth: '480px' }}>
      <div
        className="kc-card"
        style={{
          border: '1.5px solid var(--border-gold)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg), 0 0 35px rgba(229, 184, 66, 0.12)',
        }}
      >
        <button
          onClick={() => navigate('/login')}
          className="btn btn-ghost btn-sm"
          style={{ gap: '0.4rem', marginBottom: '1.5rem', padding: 0 }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </button>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Reset Password</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          Enter your registered email address to receive a secure password recovery link.
        </p>

        {feedback && (
          <div
            style={{
              background: feedback.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(224, 90, 54, 0.1)',
              border: `1px solid ${feedback.success ? 'var(--accent-emerald)' : 'var(--accent-terracotta)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: feedback.success ? 'var(--accent-emerald)' : 'var(--accent-terracotta)',
              fontSize: '0.85rem',
            }}
          >
            {feedback.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Registered Email:
            </label>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
              />
              <input
                type="email"
                required
                placeholder="scholar@gurukul.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.7rem 0.85rem 0.7rem 2.5rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {isLoading ? 'Sending...' : 'Send Recovery Email'} <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
