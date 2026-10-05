import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Globe, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import {
  RoyalSealBadge,
  CornerBrackets,
  TopographicMapSvg,
} from '../../components/common/HistoricalMotifs';

interface SignUpPageProps {
  navigate: (path: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ navigate }) => {
  const { user, signUp } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { user: newUser, session, error } = await signUp({
      displayName,
      email,
      password,
      preferredLanguage: language,
    });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      if (session) {
        navigate('/app');
      } else {
        navigate('/auth/verify-email');
      }
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

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 2 }}>
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
              KAALCHAKRA
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontFamily: 'var(--font-serif)',
                marginBottom: '0.4rem',
                color: 'var(--text-primary)',
              }}
            >
              Begin Your Journey
            </h2>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Your exploration of India's history begins here.
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
                Scholar Display Name
              </label>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <User
                  size={16}
                  color="var(--accent-gold)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem', opacity: 0.8 }}
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanaji Malusare or Gargi Vachaknavi"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
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
                Email Address
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
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
                  Password
                </label>
                <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                  <Lock
                    size={15}
                    color="var(--accent-gold)"
                    style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.8rem', opacity: 0.8 }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="kc-input"
                    style={{ paddingLeft: '2.3rem' }}
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
                  Confirm
                </label>
                <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                  <Lock
                    size={15}
                    color="var(--accent-gold)"
                    style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.8rem', opacity: 0.8 }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="Repeat pass"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="kc-input"
                    style={{ paddingLeft: '2.3rem' }}
                  />
                </div>
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
                Preferred Learning Language
              </label>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <Globe
                  size={16}
                  color="var(--accent-gold)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.9rem', opacity: 0.8 }}
                />
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="kc-input"
                  style={{ paddingLeft: '2.6rem' }}
                >
                  <option value="en">English (Primary Treatises &amp; ASI Citations)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi - Sahyadri Fort Traditions)</option>
                  <option value="ta">தமிழ் (Tamil - Keeladi &amp; Sangam Heritage)</option>
                </select>
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
              {isLoading ? 'Inscribing Credentials...' : 'INSCRIBE SCHOLAR ACCOUNT'} <ArrowRight size={16} />
            </button>
          </form>

          <div
            style={{
              borderTop: '1px solid var(--border-gold)',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)',
            }}
          >
            Already an inscribed scholar?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
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
              Sign In Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
