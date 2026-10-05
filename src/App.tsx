import React, { useState, useEffect } from 'react';
import { PlayerProfile } from './types/player';
import { storageService, EMPTY_PROFILE, DEMO_PROFILE } from './services/storageService';
import { recordExperienceCompletion } from './domain/progression/progressionEngine';
import { getGameMaster } from './domain/ai/aiFactory';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SmartBoardSimModal } from './components/common/SmartBoardSimModal';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { progressService } from './services/progressService';
import { sessionService } from './services/sessionService';
import { offlineSyncService } from './services/offlineSyncService';
import { isSupabaseReady } from './lib/supabase/client';

import { HomePage } from './features/home/HomePage';
import { DiscoverPage } from './features/discover/DiscoverPage';
import { PlayHubPage } from './features/play/PlayHubPage';
import { FortMasterGame } from './features/experiences/fort-master/FortMasterGame';
import { BharatArchitectGame } from './features/experiences/bharat-architect/BharatArchitectGame';
import { LostScriptGame } from './features/experiences/lost-script/LostScriptGame';
import { ModulePreviewPage } from './features/experiences/previews/ModulePreviewPage';
import { JourneyPage } from './features/journey/JourneyPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { EducatorDashboard } from './features/educator/EducatorDashboard';

import { LoginPage } from './features/auth/LoginPage';
import { SignUpPage } from './features/auth/SignUpPage';
import { VerifyEmailPage } from './features/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';

function AppContent() {
  const { user, profile: authProfile, playerProgress, refreshProfile } = useAuth();

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return window.location.pathname === '/kaalchakra/demo';
  });

  const [localProfile, setLocalProfile] = useState<PlayerProfile>(() => {
    return storageService.loadPlayerProfile();
  });

  const [demoProfile, setDemoProfile] = useState<PlayerProfile>(() => {
    return storageService.loadDemoProfile();
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    return path === '/' ? '/kaalchakra' : path;
  });

  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  // Sync with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/kaalchakra/demo') {
        setIsDemoMode(true);
        setCurrentPath('/kaalchakra');
      } else {
        setCurrentPath(path === '/' ? '/kaalchakra' : path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path === '/kaalchakra/demo') {
      setIsDemoMode(true);
      window.history.pushState({}, '', '/kaalchakra');
      setCurrentPath('/kaalchakra');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDemoMode = () => {
    setIsDemoMode(prev => !prev);
  };

  const { mode: gameMasterMode } = getGameMaster();
  const isCloudConnected = isSupabaseReady();

  // Determine active profile: Demo mode vs Authenticated Supabase profile vs Local profile
  const activeProfile: PlayerProfile = React.useMemo(() => {
    if (isDemoMode) {
      return demoProfile;
    }

    if (user && playerProgress) {
      return {
        id: user.id,
        name: authProfile?.display_name || user.email?.split('@')[0] || 'Scholar',
        title: playerProgress.level > 2 ? 'Heritage Architect' : 'Novice Historian',
        level: playerProgress.level,
        civilizationXp: playerProgress.xp,
        domainScores: {
          architecture: playerProgress.architecture_score,
          defence: playerProgress.defence_score,
          trade: playerProgress.trade_score,
          waterManagement: playerProgress.water_management_score,
          heritage: playerProgress.heritage_score,
          engineering: playerProgress.engineering_score,
          language: localProfile.domainScores?.language || 0,
        },
        completedExperiences: localProfile.completedExperiences || [],
        unlockedDiscoveries: localProfile.unlockedDiscoveries || [],
        unlockedAchievements: localProfile.unlockedAchievements || [],
        lastActiveAt: new Date().toISOString(),
        simulationMode: false,
      };
    }

    // Default to local profile
    return localProfile;
  }, [isDemoMode, demoProfile, user, playerProgress, authProfile, localProfile]);

  // Handler when any experience completes
  const handleExperienceCompletion = async (
    experienceId: string,
    xpEarned: number,
    domainGains: Record<string, number>,
    unlockedDiscoveries: string[],
    performance: number
  ) => {
    const { updatedProfile } = recordExperienceCompletion(
      activeProfile,
      experienceId,
      xpEarned,
      domainGains,
      unlockedDiscoveries,
      performance
    );

    const sessionId = crypto.randomUUID();

    if (isDemoMode) {
      // Demo mode isolation: NEVER write demo results to real database
      storageService.saveDemoProfile(updatedProfile);
      setDemoProfile(updatedProfile);
      return;
    }

    // Update local profile representation
    storageService.savePlayerProfile(updatedProfile);
    setLocalProfile(updatedProfile);

    // Save session locally
    const session = {
      sessionId,
      experienceId,
      startedAt: new Date(Date.now() - 360000).toISOString(),
      completedAt: new Date().toISOString(),
      actions: [],
      score: performance,
      xpEarned,
      discoveriesUnlocked: unlockedDiscoveries,
    };
    storageService.saveGameSession(session);

    // If authenticated and Supabase is configured, submit authoritative completion
    if (user && isSupabaseReady()) {
      try {
        const result = await progressService.submitAuthoritativeCompletion({
          sessionId,
          experienceId,
          score: performance,
          xpEarned,
          domainGains,
          discoverySlugs: unlockedDiscoveries,
          achievementSlugs: updatedProfile.unlockedAchievements,
        });

        if (result.success) {
          // Log completion action
          await sessionService.recordAction(sessionId, experienceId, 'session_completed', {
            performance,
            xpEarned,
            discoveries: unlockedDiscoveries,
          });
          await refreshProfile();
        } else {
          // Queue in IndexedDB for retry
          await offlineSyncService.queueSession(
            {
              sessionId,
              experienceId,
              score: performance,
              xpEarned,
              domainGains,
              discoverySlugs: unlockedDiscoveries,
              achievementSlugs: updatedProfile.unlockedAchievements,
            },
            user.id
          );
        }
      } catch {
        // Fallback to offline queue
        await offlineSyncService.queueSession(
          {
            sessionId,
            experienceId,
            score: performance,
            xpEarned,
            domainGains,
            discoverySlugs: unlockedDiscoveries,
            achievementSlugs: updatedProfile.unlockedAchievements,
          },
          user.id
        );
      }
    }
  };

  // Render view based on route
  const renderCurrentView = () => {
    // Auth Routes
    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }
    if (currentPath === '/signup') {
      return <SignUpPage navigate={navigate} />;
    }
    if (currentPath === '/verify-email') {
      return <VerifyEmailPage navigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage navigate={navigate} />;
    }
    if (currentPath === '/reset-password') {
      return <ResetPasswordPage navigate={navigate} />;
    }

    // Public Route: Home
    if (currentPath === '/' || currentPath === '/kaalchakra') {
      return <HomePage profile={activeProfile} navigate={navigate} />;
    }

    // Public Route: Discover
    if (currentPath === '/kaalchakra/discover') {
      return <DiscoverPage navigate={navigate} />;
    }

    // Play Hub
    if (currentPath === '/kaalchakra/play') {
      return <PlayHubPage navigate={navigate} />;
    }

    // Protected Route: Journey
    if (currentPath === '/kaalchakra/journey') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate} isDemoMode={isDemoMode}>
          <JourneyPage
            profile={activeProfile}
            navigate={navigate}
            onProfileUpdated={updated => {
              if (isDemoMode) {
                storageService.saveDemoProfile(updated);
                setDemoProfile(updated);
              } else {
                storageService.savePlayerProfile(updated);
                setLocalProfile(updated);
              }
            }}
          />
        </ProtectedRoute>
      );
    }

    // Protected Route: Profile
    if (currentPath === '/kaalchakra/profile') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate} isDemoMode={isDemoMode}>
          <ProfilePage
            profile={activeProfile}
            onUpdateProfile={updated => {
              if (isDemoMode) {
                storageService.saveDemoProfile(updated);
                setDemoProfile(updated);
              } else {
                storageService.savePlayerProfile(updated);
                setLocalProfile(updated);
              }
            }}
            gameMasterMode={gameMasterMode}
            isDemoMode={isDemoMode}
          />
        </ProtectedRoute>
      );
    }

    // Protected Route: Educator Dashboard
    if (currentPath === '/educator') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate} isDemoMode={isDemoMode}>
          <EducatorDashboard navigate={navigate} />
        </ProtectedRoute>
      );
    }

    // Protected Route: Fort Master
    if (currentPath === '/kaalchakra/experience/fort-master') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate} isDemoMode={isDemoMode}>
          <FortMasterGame
            onCompleteExperience={(xp, gains, discs, perf) =>
              handleExperienceCompletion('fort-master', xp, gains, discs, perf)
            }
            onNavigate={navigate}
            gameMasterMode={gameMasterMode}
          />
        </ProtectedRoute>
      );
    }

    // Protected Route: Bharat Architect
    if (currentPath === '/kaalchakra/experience/bharat-architect') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate} isDemoMode={isDemoMode}>
          <BharatArchitectGame
            onCompleteExperience={(xp, gains, discs, perf) =>
              handleExperienceCompletion('bharat-architect', xp, gains, discs, perf)
            }
            onNavigate={navigate}
            gameMasterMode={gameMasterMode}
          />
        </ProtectedRoute>
      );
    }

    // Protected Route: Lost Script
    if (currentPath === '/kaalchakra/experience/lost-script') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate} isDemoMode={isDemoMode}>
          <LostScriptGame
            onCompleteExperience={(xp, gains, discs, perf) =>
              handleExperienceCompletion('lost-script', xp, gains, discs, perf)
            }
            onNavigate={navigate}
            gameMasterMode={gameMasterMode}
          />
        </ProtectedRoute>
      );
    }

    // Dynamic preview modules route e.g. /kaalchakra/experience/bharat-bazaar
    if (currentPath.startsWith('/kaalchakra/experience/')) {
      const expId = currentPath.replace('/kaalchakra/experience/', '');
      return <ModulePreviewPage experienceId={expId} onNavigate={navigate} />;
    }

    // Fallback: Home
    return <HomePage profile={activeProfile} navigate={navigate} />;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
      }}
    >
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        profile={activeProfile}
        gameMasterMode={gameMasterMode}
        isCloudConnected={isCloudConnected}
        isDemoMode={isDemoMode}
        onOpenSimModal={() => setIsSimModalOpen(true)}
        onToggleDemoMode={toggleDemoMode}
      />

      <main style={{ flex: 1 }}>{renderCurrentView()}</main>

      <Footer navigate={navigate} />

      <SmartBoardSimModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
