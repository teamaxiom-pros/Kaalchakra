import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import {
  RoyalSealBadge,
  CornerBrackets,
  TopographicMapSvg,
} from '../../components/common/HistoricalMotifs';

interface LoginPageProps {
  navigate: (path: string) => void;
  returnUrl?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, returnUrl = '/app' }) => {
  const { user, signIn, isConfigured } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await signIn({ email, password });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      navigate(returnUrl);
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
      {/* Background Topographic Contour Lines */}
      <TopographicMapSvg opacity={0.07} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 2 }}>
        {/* Navigation back to Chronicle */}
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

        {/* Sealed Fort Gateway / Artifact Tablet */}
        <div className="artifact-card" style={{ padding: '2.5rem 2rem' }}>
          <CornerBrackets />

          {/* Header Seal */}
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
              KAALCHAKRA ARCHIVE
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontFamily: 'var(--font-serif)',
                marginBottom: '0.4rem',
                color: 'var(--text-primary)',
              }}
            >
              Enter the Royal Archive
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Your exploration of India's history begins here.
            </p>
          </div>

          {!isConfigured && (
            <div
              style={{
                background: 'rgba(207, 164, 79, 0.08)',
                borderLeft: '3px solid var(--accent-gold)',
                padding: '0.85rem 1rem',
                borderRadius: '0 6px 6px 0',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.6rem',
              }}
            >
              <Info size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Setup Note:</strong> Supabase environment variables are pending. You can still test
                experiences in local mode or configure credentials in the Profile tab.
              </div>
            </div>
          )}

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
                Scholar Email Address
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

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label
                  style={{
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 600,
                    color: 'var(--accent-gold-light)',
                    letterSpacing: '0.04em',
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/auth/forgot-password')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.78rem',
                    color: 'var(--accent-gold)',
                    cursor: 'pointer',
                    padding: 0,
                    fontFamily: 'var(--font-serif)',
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <Lock
                  size={16}
                  color="var(--accent-gold)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem', opacity: 0.8 }}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
              {isLoading ? 'Verifying Credentials...' : 'ENTER ARCHIVE'} <ArrowRight size={16} />
            </button>
          </form>

          <div
            style={{
              borderTop: '1px solid var(--border-gold)',
              marginTop: '2rem',
              paddingTop: '1.25rem',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
            }}
          >
            New to the Chronicle?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-gold-light)',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontFamily: 'var(--font-serif)',
                letterSpacing: '0.03em',
              }}
            >
              Inscribe New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
