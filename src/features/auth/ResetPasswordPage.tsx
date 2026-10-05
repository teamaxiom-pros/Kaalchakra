import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

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
      setTimeout(() => navigate('/login'), 2500);
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
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Set New Password</h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
          Create a secure password for your Kaalchakra account.
        </p>

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

        {successMessage && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--accent-emerald)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-emerald)',
              fontSize: '0.85rem',
            }}
          >
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              New Password:
            </label>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
              />
              <input
                type="password"
                required
                placeholder="Min 6 characters"
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

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Confirm New Password:
            </label>
            <div style={{ position: 'relative', marginTop: '0.35rem' }}>
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '0.85rem' }}
              />
              <input
                type="password"
                required
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Updating...' : 'Update Password & Sign In'} <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
