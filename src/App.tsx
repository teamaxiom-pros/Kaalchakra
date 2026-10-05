import React, { useState, useEffect } from 'react';
import { PlayerProfile } from './types/player';
import { storageService, EMPTY_PROFILE } from './services/storageService';
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

import { LandingPage } from './features/landing/LandingPage';
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

  const [localProfile, setLocalProfile] = useState<PlayerProfile>(() => {
    return storageService.loadPlayerProfile();
  });

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname;
  });

  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { mode: gameMasterMode } = getGameMaster();
  const isCloudConnected = isSupabaseReady();

  // Authoritative active profile: Derived strictly from Supabase for authenticated user, or empty profile
  const activeProfile: PlayerProfile = React.useMemo(() => {
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
          language: playerProgress.language_score || localProfile.domainScores?.language || 0,
        },
        completedExperiences: localProfile.completedExperiences || [],
        unlockedDiscoveries: localProfile.unlockedDiscoveries || [],
        unlockedAchievements: localProfile.unlockedAchievements || [],
        lastActiveAt: new Date().toISOString(),
        simulationMode: false,
      };
    }

    return localProfile || EMPTY_PROFILE;
  }, [user, playerProgress, authProfile, localProfile]);

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

    // Update local profile state
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
          await sessionService.recordAction(sessionId, experienceId, 'session_completed', {
            performance,
            xpEarned,
            discoveries: unlockedDiscoveries,
          });
          await refreshProfile();
        } else {
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
    // 1. PUBLIC MARKETING LANDING PAGE (Root URL)
    if (currentPath === '/' || currentPath === '') {
      return <LandingPage navigate={navigate} />;
    }

    // 2. AUTHENTICATION ROUTES (Public with auto-redirect if already logged in)
    if (currentPath === '/auth/login' || currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }
    if (currentPath === '/auth/signup' || currentPath === '/signup') {
      return <SignUpPage navigate={navigate} />;
    }
    if (currentPath === '/auth/forgot-password' || currentPath === '/forgot-password') {
      return <ForgotPasswordPage navigate={navigate} />;
    }
    if (currentPath === '/auth/reset-password' || currentPath === '/reset-password') {
      return <ResetPasswordPage navigate={navigate} />;
    }
    if (currentPath === '/auth/verify-email' || currentPath === '/verify-email') {
      return <VerifyEmailPage navigate={navigate} />;
    }

    // 3. AUTHENTICATED APP HOME
    if (currentPath === '/app' || currentPath === '/kaalchakra') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <HomePage profile={activeProfile} navigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 4. AUTHENTICATED DISCOVER (Cultural Database)
    if (currentPath === '/discover' || currentPath === '/kaalchakra/discover') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <DiscoverPage navigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 5. AUTHENTICATED PLAY HUB
    if (currentPath === '/experiences' || currentPath === '/play' || currentPath === '/kaalchakra/play') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <PlayHubPage navigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 6. AUTHENTICATED JOURNEY
    if (currentPath === '/journey' || currentPath === '/kaalchakra/journey') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <JourneyPage
            profile={activeProfile}
            navigate={navigate}
            onProfileUpdated={updated => {
              storageService.savePlayerProfile(updated);
              setLocalProfile(updated);
            }}
          />
        </ProtectedRoute>
      );
    }

    // 7. AUTHENTICATED PROFILE
    if (currentPath === '/profile' || currentPath === '/kaalchakra/profile') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <ProfilePage
            profile={activeProfile}
            onUpdateProfile={updated => {
              storageService.savePlayerProfile(updated);
              setLocalProfile(updated);
            }}
            gameMasterMode={gameMasterMode}
          />
        </ProtectedRoute>
      );
    }

    // 8. AUTHENTICATED EDUCATOR DASHBOARD
    if (currentPath === '/educator') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <EducatorDashboard navigate={navigate} />
        </ProtectedRoute>
      );
    }

    // 9. AUTHENTICATED EXPERIENCES
    if (currentPath === '/experience/fort-master' || currentPath === '/kaalchakra/experience/fort-master') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
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

    if (currentPath === '/experience/bharat-architect' || currentPath === '/kaalchakra/experience/bharat-architect') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
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

    if (currentPath === '/experience/lost-script' || currentPath === '/kaalchakra/experience/lost-script') {
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
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

    // 10. PREVIEW MODULES
    if (currentPath.startsWith('/experience/') || currentPath.startsWith('/kaalchakra/experience/')) {
      const expId = currentPath.replace('/kaalchakra/experience/', '').replace('/experience/', '');
      return (
        <ProtectedRoute currentPath={currentPath} navigate={navigate}>
          <ModulePreviewPage experienceId={expId} onNavigate={navigate} />
        </ProtectedRoute>
      );
    }

    // Fallback: If unknown path, route to Landing Page
    return <LandingPage navigate={navigate} />;
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
        onOpenSimModal={() => setIsSimModalOpen(true)}
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
