import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
  isDemoMode?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentPath,
  navigate,
  isDemoMode = false,
}) => {
  const { user, loading, initialized, isConfigured } = useAuth();

  // If in isolated demo mode, allow access directly
  if (isDemoMode) {
    return <>{children}</>;
  }

  // If Supabase is not configured yet, allow viewing with local storage fallback
  if (!isConfigured) {
    return <>{children}</>;
  }

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
          Restoring scholar journey session...
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login preserving intended path
    navigate(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
    return null;
  }

  return <>{children}</>;
};
