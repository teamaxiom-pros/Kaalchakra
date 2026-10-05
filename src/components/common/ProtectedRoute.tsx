import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentPath,
  navigate,
}) => {
  const { user, loading, initialized } = useAuth();

  useEffect(() => {
    if (initialized && !loading && !user) {
      // Redirect to /auth/login preserving intended path
      navigate(`/auth/login?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [initialized, loading, user, currentPath, navigate]);

  if (loading || !initialized) {
    return (
      <div
        className="container"
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid rgba(229, 184, 66, 0.2)',
            borderTopColor: 'var(--accent-gold)',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.95rem' }}>
          Verifying scholar authentication...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
