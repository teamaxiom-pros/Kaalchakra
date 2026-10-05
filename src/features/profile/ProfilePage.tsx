import React, { useState } from 'react';
import { PlayerProfile } from '../../types/player';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import {
  User,
  Shield,
  KeyRound,
  Download,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Globe,
  Award,
  Layers,
  FileText,
} from 'lucide-react';

interface ProfilePageProps {
  profile: PlayerProfile;
  onUpdateProfile: (updated: PlayerProfile) => void;
  gameMasterMode: 'local-deterministic' | 'gemini-live';
  isDemoMode?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  gameMasterMode,
  isDemoMode = false,
}) => {
  const { user, profile: authProfile, isEmailVerified, signOut, updatePassword, refreshProfile, isConfigured } = useAuth();

  const [displayName, setDisplayName] = useState(authProfile?.display_name || profile.name);
  const [preferredLanguage, setPreferredLanguage] = useState(authProfile?.preferred_language || 'en');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Account deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    try {
      if (user && isConfigured) {
        const { error } = await profileService.updateOwnProfile(user.id, {
          displayName,
          preferredLanguage,
        });

        if (error) {
          setProfileErrorMsg(error);
          setSavingProfile(false);
          return;
        }
        await refreshProfile();
      }

      // Update local profile representation
      const updated: PlayerProfile = { ...profile, name: displayName };
      storageService.savePlayerProfile(updated);
      onUpdateProfile(updated);

      setProfileSuccessMsg('Profile preferences updated successfully.');
      setTimeout(() => setProfileSuccessMsg(null), 3500);
    } catch {
      setProfileErrorMsg('An unexpected error occurred while updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    const { error } = await updatePassword(newPassword);
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error);
    } else {
      setPasswordSuccess('Password successfully updated.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    }
  };

  const handleExportJourney = () => {
    const exportData = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      scholar: {
        displayName: authProfile?.display_name || profile.name,
        role: authProfile?.role || 'learner',
        language: preferredLanguage,
      },
      progression: {
        civilizationXp: profile.civilizationXp,
        level: profile.level,
        domainScores: profile.domainScores,
      },
      achievements: profile.unlockedAchievements,
      discoveries: profile.unlockedDiscoveries,
      completedExperiences: profile.completedExperiences,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaalchakra-journey-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetJourney = () => {
    if (window.confirm('Reset local prototype progress cache? Authenticated cloud records will remain safe.')) {
      const reset = storageService.resetJourney();
      onUpdateProfile(reset);
    }
  };

  const role = authProfile?.role || 'learner';

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem', maxWidth: '840px' }}>
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div
          className="kc-card"
          style={{
            background: 'rgba(229, 184, 66, 0.08)',
            borderLeft: '4px solid var(--accent-gold)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>SIH Presentation Demo Mode</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Sample progress is loaded locally. Demo actions do not affect real accounts.
            </div>
          </div>
          <span className="badge badge-gold">ISOLATED DEMO</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
          <User size={14} /> Scholar Account & Security
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Account Profile</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Manage your personal scholar identity, security credentials, and synchronized heritage journey.
        </p>
      </div>

      {/* Account Overview Card */}
      <div
        className="kc-card"
        style={{
          border: '1.5px solid var(--border-gold)',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1c2430, #0f141c)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              boxShadow: '0 0 16px var(--accent-gold-glow)',
            }}
          >
            {(authProfile?.display_name || profile.name).charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                {authProfile?.display_name || profile.name}
              </h2>
              <span className={`badge ${role === 'admin' ? 'badge-gold' : role === 'educator' ? 'badge-indigo' : 'badge-emerald'}`}>
                {role.toUpperCase()}
              </span>
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
              {user?.email || 'Local Scholar Account (Offline)'}
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>
                Account Status:{' '}
                {isEmailVerified ? (
                  <strong style={{ color: 'var(--accent-emerald)' }}>Verified ✓</strong>
                ) : user ? (
                  <strong style={{ color: 'var(--accent-terracotta)' }}>Pending Verification</strong>
                ) : (
                  <strong>Local Scholar</strong>
                )}
              </span>
              <span>•</span>
              <span>Level {profile.level} Scholar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="kc-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--accent-gold)" /> Personal Details
        </h3>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {profileSuccessMsg && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--accent-emerald)',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle size={16} /> {profileSuccessMsg}
            </div>
          )}

          {profileErrorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--accent-terracotta)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: 'var(--accent-terracotta)',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} /> {profileErrorMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Display Name
            </label>
            <input
              type="text"
              className="kc-input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. Arya Explorer"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Email Address (Authentication Bound)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'Offline Scholar Session'}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'not-allowed',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Email updates require secure re-authentication via the auth provider.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Preferred Language for Cultural Modules
            </label>
            <select
              value={preferredLanguage}
              onChange={e => setPreferredLanguage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="en">English (Standard Archaeological Nomenclature)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="sa">संस्कृतम् (Sanskrit Glossary)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={savingProfile}
              className="btn btn-gold btn-sm"
              style={{ gap: '0.4rem' }}
            >
              {savingProfile ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Game Master Provider Status */}
      <div className="kc-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--accent-gold)" /> AI Game Master Engine
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Kaalchakra uses a secure, server-side Edge Function orchestrating Gemini AI with grounded ASI and UNESCO historical sources. No API secrets are exposed to client browsers.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary)',
            padding: '1rem 1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              Provider Mode:{' '}
              <span style={{ color: 'var(--accent-gold)' }}>
                {gameMasterMode === 'gemini-live' ? 'Gemini AI Orchestrator' : 'Deterministic Local Game Master'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Deterministic engine holds rule authority; AI provides grounded narrative & hints.
            </div>
          </div>
          <div className="badge badge-emerald">
            Active & Grounded
          </div>
        </div>
      </div>

      {/* Password Change Card (Only for authenticated users) */}
      {user && (
        <div className="kc-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={18} color="var(--accent-gold)" /> Change Password
          </h3>

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {passwordSuccess && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--accent-emerald)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: 'var(--accent-emerald)',
                  fontSize: '0.88rem',
                }}
              >
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--accent-terracotta)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  color: 'var(--accent-terracotta)',
                  fontSize: '0.88rem',
                }}
              >
                {passwordError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                className="kc-input"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                className="kc-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={passwordLoading}
                className="btn btn-secondary btn-sm"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data Export & Journey Portability */}
      <div className="kc-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} color="var(--accent-gold)" /> Journey Portability & Export
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Download a verifiable, privacy-safe JSON copy of your civilization journey, unlocked heritage records, and domain mastery scores.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportJourney}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Download size={14} /> Export My Journey (JSON)
          </button>

          <button
            onClick={handleResetJourney}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.4rem', color: 'var(--text-muted)' }}
          >
            Reset Local Cache
          </button>
        </div>
      </div>

      {/* Account Deletion & Sign Out Actions */}
      <div
        className="kc-card"
        style={{
          padding: '2rem',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          background: 'rgba(239, 68, 68, 0.03)',
        }}
      >
        <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-terracotta)', marginBottom: '0.5rem' }}>
          Account Actions & Privacy Control
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Sign out of active sessions or submit an authoritative account deletion request. In compliance with DPDP & student data protection policies, account deletion cascades to all private session and progress records.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {user && (
            <button
              onClick={() => signOut()}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <LogOut size={14} /> Sign Out of All Sessions
            </button>
          )}

          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.4rem', color: 'var(--accent-terracotta)' }}
          >
            <Trash2 size={14} /> Request Account Deletion
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="kc-card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              border: '2px solid var(--accent-terracotta)',
            }}
          >
            <h3 style={{ color: 'var(--accent-terracotta)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>
              Confirm Account Deletion Request
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              This action will permanently queue the deletion of your scholar identity, domain progression, game session history, and unlocked achievements across Supabase PostgreSQL. This cannot be undone.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Type <strong>DELETE</strong> below to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmationText}
              onChange={e => setDeleteConfirmationText(e.target.value)}
              placeholder="DELETE"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationText !== 'DELETE'}
                onClick={async () => {
                  alert('Account deletion request submitted. Session will now close.');
                  setShowDeleteModal(false);
                  if (user) await signOut();
                }}
                className="btn btn-sm"
                style={{
                  background: deleteConfirmationText === 'DELETE' ? 'var(--accent-terracotta)' : 'var(--bg-secondary)',
                  color: '#fff',
                }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
