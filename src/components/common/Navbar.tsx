import React, { useState } from 'react';
import { PlayerProfile } from '../../types/player';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Compass,
  Shield,
  Award,
  Cpu,
  Menu,
  X,
  Landmark,
  Cloud,
  CloudOff,
  User,
  LogOut,
  GraduationCap,
  LogIn,
  UserPlus,
  ArrowRight,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  profile: PlayerProfile;
  gameMasterMode: 'local-deterministic' | 'gemini-live';
  isCloudConnected?: boolean;
  onOpenSimModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  navigate,
  profile,
  gameMasterMode,
  isCloudConnected = false,
  onOpenSimModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile: authProfile, signOut } = useAuth();

  const isPublicLanding = currentPath === '/';
  const isEducator = authProfile?.role === 'educator' || authProfile?.role === 'admin';
  const displayName = authProfile?.display_name || user?.email?.split('@')[0] || profile.name || 'Scholar';

  const appNavLinks = [
    { label: 'Home', path: '/app', icon: Landmark },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Experiences', path: '/experiences', icon: Shield },
    { label: 'My Journey', path: '/journey', icon: Award },
    ...(isEducator ? [{ label: 'Educator', path: '/educator', icon: GraduationCap }] : []),
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const scrollToLandingSection = (sectionId: string) => {
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(13, 17, 23, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'var(--header-height)',
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => handleNav(user ? '/app' : '/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleNav(user ? '/app' : '/')}
          aria-label="Kaalchakra Home"
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1c2430, #0f141c)',
              border: '1.5px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px var(--accent-gold-glow)',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>☸</span>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 800,
                fontSize: '1.3rem',
                letterSpacing: '0.08em',
                background: 'linear-gradient(90deg, #ffffff, var(--accent-gold))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              KAALCHAKRA
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.04em',
                fontWeight: 500,
              }}
            >
              DISCOVER INDIA THROUGH PLAY
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        {isPublicLanding ? (
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1rem',
            }}
            className="desktop-nav"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-primary)', fontWeight: 500 }}
            >
              Overview
            </button>
            <button
              onClick={() => scrollToLandingSection('experiences-section')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
            >
              Experiences
            </button>
            <button
              onClick={() => handleNav('/auth/login')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
            >
              Curriculum & Sources
            </button>
          </nav>
        ) : (
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            className="desktop-nav"
          >
            {appNavLinks.map(link => {
              const isActive =
                currentPath === link.path ||
                (link.path === '/experiences' && currentPath.startsWith('/experience'));

              const Icon = link.icon;

              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`btn btn-ghost btn-sm ${isActive ? 'active-nav' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 700 : 500,
                    borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                    borderRadius: 0,
                    padding: '0.5rem 0.85rem',
                  }}
                >
                  <Icon size={16} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Status Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Public Landing State */}
          {isPublicLanding ? (
            user ? (
              <button
                onClick={() => handleNav('/app')}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.4rem', padding: '0.45rem 1rem' }}
              >
                <span>Enter Kaalchakra App</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => handleNav('/auth/login')}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.85rem' }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/auth/signup')}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
                >
                  Start Discovering
                </button>
              </div>
            )
          ) : (
            /* Authenticated App State */
            <>
              {/* Smart Board Hardware Simulation Trigger */}
              <button
                onClick={onOpenSimModal}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.65rem',
                }}
                title="Smart Board Hardware Simulation"
              >
                <Cpu size={14} color="var(--accent-gold)" />
                <span className="hide-mobile">Smart Board</span>
              </button>

              {/* Player Progress Mini Badge */}
              <div
                onClick={() => handleNav('/journey')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '0.3rem 0.75rem',
                  cursor: 'pointer',
                }}
                role="button"
                tabIndex={0}
                aria-label="View Cultural Journey"
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-terracotta)',
                    boxShadow: '0 0 8px var(--accent-terracotta)',
                  }}
                />
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent-gold)' }}>{profile.civilizationXp}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '3px' }}>XP</span>
                </div>
                <div
                  className="badge badge-gold"
                  style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}
                >
                  Lvl {profile.level}
                </div>
              </div>

              {/* Supabase Cloud Indicator */}
              <div
                onClick={() => handleNav('/profile')}
                className={`badge ${isCloudConnected ? 'badge-emerald' : 'badge-muted'}`}
                style={{ fontSize: '0.7rem', cursor: 'pointer' }}
                title={
                  isCloudConnected
                    ? 'Supabase Cloud Database: Connected & Active'
                    : 'Local Cache Mode (Supabase not configured)'
                }
              >
                {isCloudConnected ? <Cloud size={11} /> : <CloudOff size={11} />}
                <span className="hide-mobile">{isCloudConnected ? 'Cloud' : 'Offline'}</span>
              </div>

              {/* User Avatar & Sign Out */}
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleNav('/profile')}
                    className="btn btn-ghost btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.65rem',
                    }}
                    title={displayName}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'var(--accent-gold)',
                        color: '#0d1117',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hide-mobile" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      {displayName.split(' ')[0]}
                    </span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.35rem 0.5rem' }}
                    title="Sign out of account"
                  >
                    <LogOut size={15} color="var(--text-muted)" />
                  </button>
                </div>
              )}
            </>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost btn-sm mobile-menu-btn"
            style={{ padding: '0.4rem' }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-gold)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {isPublicLanding ? (
            <>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start' }}
              >
                Overview
              </button>
              <button
                onClick={() => scrollToLandingSection('experiences-section')}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start' }}
              >
                Experiences
              </button>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleNav('/auth/login')}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/auth/signup')}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Start Discovering
                </button>
              </div>
            </>
          ) : (
            <>
              {appNavLinks.map(link => {
                const Icon = link.icon;
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className="btn btn-ghost"
                    style={{
                      justifyContent: 'flex-start',
                      color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'rgba(229, 184, 66, 0.08)' : 'transparent',
                    }}
                  >
                    <Icon size={18} />
                    {link.label}
                  </button>
                );
              })}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', color: 'var(--accent-terracotta)', marginTop: '0.5rem' }}
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Responsive CSS for desktop vs mobile nav */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .hide-mobile {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
