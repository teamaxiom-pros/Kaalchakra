import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Info } from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
  returnUrl?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, returnUrl = '/kaalchakra' }) => {
  const { signIn, isConfigured } = useAuth();
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
    <div className="container" style={{ padding: '4rem 1.25rem 6rem 1.25rem', maxWidth: '480px' }}>
      <div
        className="kc-card"
        style={{
          border: '1.5px solid var(--border-gold)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg), 0 0 35px rgba(229, 184, 66, 0.12)',
        }}
      >
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1c2430, #0f141c)',
              border: '1.5px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 15px var(--accent-gold-glow)',
              fontSize: '1.6rem',
            }}
          >
            ☸
          </div>

          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Scholar Sign In</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Enter your credentials to continue your cultural journey.
          </p>
        </div>

        {!isConfigured && (
          <div
            style={{
              background: 'rgba(229, 184, 66, 0.08)',
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
              background: 'rgba(224, 90, 54, 0.1)',
              border: '1px solid var(--border-terracotta)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-terracotta)',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Email Address:
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

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Password:
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="btn-ghost"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--accent-gold)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
              />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            {isLoading ? 'Authenticating...' : 'Sign In to Journey'} <ArrowRight size={15} />
          </button>
        </form>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
          }}
        >
          New to Kaalchakra?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-gold)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
