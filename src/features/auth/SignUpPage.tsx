import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Globe, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface SignUpPageProps {
  navigate: (path: string) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ navigate }) => {
  const { signUp } = useAuth();
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

    const { user, session, error } = await signUp({
      displayName,
      email,
      password,
      preferredLanguage: language,
    });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error);
    } else {
      // Navigate to verification guidance screen
      navigate('/verify-email');
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 6rem 1.25rem', maxWidth: '520px' }}>
      <div
        className="kc-card"
        style={{
          border: '1.5px solid var(--border-gold)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg), 0 0 35px rgba(229, 184, 66, 0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="badge badge-gold" style={{ marginBottom: '0.65rem' }}>
            <Sparkles size={13} />
            Begin Your Discovery Journey
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Create Scholar Account</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Join Kaalchakra to discover Indian civilization through interactive play.
          </p>
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Scholar Display Name:
            </label>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <User
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
              />
              <input
                type="text"
                required
                placeholder="e.g. Arya Sharma"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Password:
              </label>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Lock
                  size={15}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem' }}
                />
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Confirm:
              </label>
              <div style={{ position: 'relative', marginTop: '0.35rem' }}>
                <Lock
                  size={15}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.75rem' }}
                />
                <input
                  type="password"
                  required
                  placeholder="Repeat pass"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.7rem 0.75rem 0.7rem 2.3rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Preferred Learning Language:
            </label>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <Globe
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
              />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
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
              >
                <option value="en">English (Primary Content & ASI Citations)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi - Sahyadri Forts)</option>
                <option value="ta">தமிழ் (Tamil - Keeladi & Sangam)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', padding: '0.85rem' }}
          >
            {isLoading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={15} />
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
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
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
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
