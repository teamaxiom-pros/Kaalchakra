import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { educatorService, LinkedLearnerSummary } from '../../services/educatorService';
import {
  GraduationCap,
  Users,
  Award,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface EducatorDashboardProps {
  navigate: (path: string) => void;
}

export const EducatorDashboard: React.FC<EducatorDashboardProps> = ({ navigate }) => {
  const { user, profile } = useAuth();
  const [learners, setLearners] = useState<LinkedLearnerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLearner, setSelectedLearner] = useState<LinkedLearnerSummary | null>(null);

  useEffect(() => {
    let isMounted = true;
    educatorService.getLinkedLearners().then(data => {
      if (isMounted) {
        setLearners(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isEducator = profile?.role === 'educator' || profile?.role === 'admin';

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem 1.25rem' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/kaalchakra')}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: '1.5rem', gap: '0.4rem' }}
      >
        <ArrowLeft size={16} /> Back to Kaalchakra
      </button>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '0.5rem' }}>
          <GraduationCap size={14} />
          Educator Guidance Portal
        </div>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Scholar Cohort Progress</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '720px' }}>
          Review progress, experience completions, and cultural discoveries for scholars explicitly
          linked to your educator account. All data access is governed by PostgreSQL Row Level Security.
        </p>
      </div>

      {/* Role Notice */}
      {!isEducator && (
        <div
          className="kc-card"
          style={{
            background: 'rgba(217, 119, 6, 0.08)',
            borderLeft: '4px solid var(--accent-terracotta)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <ShieldAlert size={24} color="var(--accent-terracotta)" />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--accent-terracotta)' }}>
              Learner Account Notice
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Your current account role is <strong>{profile?.role || 'learner'}</strong>. In accordance with Kaalchakra privacy policy, only verified educators can establish cohort links. To request educator credentials for your institution, contact your administration.
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="kc-card-flat">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Linked Scholars
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {learners.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Governed by RLS authorization
          </div>
        </div>

        <div className="kc-card-flat">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Average Level
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {learners.length > 0
              ? (learners.reduce((acc, l) => acc + l.level, 0) / learners.length).toFixed(1)
              : '—'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Across all active experiences
          </div>
        </div>

        <div className="kc-card-flat">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Cohort Total XP
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-terracotta)' }}>
            {learners.reduce((acc, l) => acc + l.xp, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Cumulative heritage mastery
          </div>
        </div>
      </div>

      {/* Main Content: Learners List & Detail View */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedLearner ? '1fr 1fr' : '1fr',
          gap: '2rem',
        }}
      >
        {/* Scholar List */}
        <div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="var(--accent-gold)" />
            Linked Scholars ({learners.length})
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading linked scholars...
            </div>
          ) : learners.length === 0 ? (
            <div
              className="kc-card"
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                border: '1.5px dashed var(--border-subtle)',
              }}
            >
              <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Linked Scholars Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                Scholars must accept your educator invitation or enter your institution code before their progress is shared.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Zero unauthorized queries permitted across the database boundary.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {learners.map(learner => {
                const isSelected = selectedLearner?.learnerId === learner.learnerId;
                return (
                  <div
                    key={learner.learnerId}
                    onClick={() => setSelectedLearner(learner)}
                    className="kc-card-flat"
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      background: isSelected ? 'rgba(229, 184, 66, 0.05)' : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      transition: 'all 0.15s ease',
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                        {learner.displayName}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Lvl {learner.level}</span>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-gold)' }}>{learner.xp} XP</span>
                        <span>•</span>
                        <span style={{ textTransform: 'capitalize' }}>Status: {learner.status}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} color={isSelected ? 'var(--accent-gold)' : 'var(--text-muted)'} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Scholar Detail */}
        {selectedLearner && (
          <div
            className="kc-card"
            style={{
              border: '1.5px solid var(--border-gold)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Scholar Report
                </div>
                <h3 style={{ fontSize: '1.5rem' }}>{selectedLearner.displayName}</h3>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="btn btn-ghost btn-sm"
              >
                Close
              </button>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="badge badge-gold">
                Level {selectedLearner.level}
              </div>
              <div className="badge badge-emerald">
                {selectedLearner.xp} Total XP
              </div>
              <div className="badge badge-muted">
                {selectedLearner.status.toUpperCase()}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Curriculum Integration & Playable Slices:
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: '1.8' }}>
                <li>Fort Master: Architecture & Defense Analysis (Kumbhalgarh)</li>
                <li>Bharat Architect: Hydrology & Drainage Engineering (Dholavira)</li>
                <li>Lost Script: Epigraphy & Statistical Decipherment (Indus Script)</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              🔒 <strong>Privacy Assurance:</strong> Learner email addresses and private notes are withheld. Educators receive aggregated domain performance scores and verified milestone receipts only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
