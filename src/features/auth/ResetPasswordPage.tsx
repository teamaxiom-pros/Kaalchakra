import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  RoyalSealBadge,
  CornerBrackets,
  TopographicMapSvg,
} from '../../components/common/HistoricalMotifs';

interface ResetPasswordPageProps {
  navigate: (path: string) => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ navigate }) => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await updatePassword(password);
    setIsLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      setSuccessMessage('Password successfully updated! You can now sign in with your new credentials.');
      setTimeout(() => navigate('/auth/login'), 2500);
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
              SEAL RENEWAL
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontFamily: 'var(--font-serif)',
                marginBottom: '0.4rem',
                color: 'var(--text-primary)',
              }}
            >
              Inscribe New Cipher
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Create a secure password for your Kaalchakra account.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                background: 'rgba(143, 60, 37, 0.15)',
                border: '1px solid var(--border-terracotta)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#f87171',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: 'rgba(45, 107, 79, 0.2)',
                border: '1px solid rgba(45, 107, 79, 0.5)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6ee7b7',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                New Password
              </label>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <Lock
                  size={16}
                  color="var(--accent-gold)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem', opacity: 0.8 }}
                />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="kc-input"
                  style={{ paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

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
                Confirm New Password
              </label>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <Lock
                  size={16}
                  color="var(--accent-gold)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem', opacity: 0.8 }}
                />
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Updating...' : 'UPDATE CIPHER'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
