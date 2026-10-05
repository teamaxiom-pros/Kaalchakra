import React from 'react';
import {
  Sparkles,
  Compass,
  Shield,
  ArrowRight,
  BookOpen,
  Landmark,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Scroll,
  Building2,
  Zap,
  Globe2,
} from 'lucide-react';
import { EXPERIENCES } from '../../data/experiences';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const playableExperiences = EXPERIENCES.filter(e => e.status === 'playable');
  const previewExperiences = EXPERIENCES.filter(e => e.status === 'preview');

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 5rem 0',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(229, 184, 66, 0.12), transparent 70%)',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '960px' }}>
          {/* Badge */}
          <div
            className="badge badge-gold"
            style={{
              margin: '0 auto 1.5rem auto',
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Sparkles size={14} />
            <span>INDIAN CIVILIZATION • EXPERIENTIAL DISCOVERY PLATFORM</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              fontWeight: 800,
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.04em',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            KAALCHAKRA
          </h1>

          {/* Subheading */}
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: 'var(--accent-gold)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              marginBottom: '1.5rem',
            }}
          >
            Discover India Through Play
          </div>

          {/* Mission statement */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '780px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Transform Indian civilization from something students only read about into something they can{' '}
            <strong style={{ color: 'var(--text-primary)' }}>explore, build, manage, and experience</strong>.
            Make architectural decisions, withstand Sahyadri monsoons, engineer Harappan reservoirs, and decipher ancient Ashokan edicts.
          </p>

          {/* Call to action buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <button
              onClick={() => navigate('/auth/signup')}
              className="btn btn-primary btn-lg"
              id="landing-hero-cta-start"
              style={{
                fontSize: '1.05rem',
                padding: '0.85rem 2rem',
                boxShadow: '0 0 24px rgba(229, 184, 66, 0.35)',
              }}
            >
              <Sparkles size={18} /> Start Discovering
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('experiences-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary btn-lg"
              id="landing-hero-cta-explore"
              style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}
            >
              <Compass size={18} /> Explore Experiences
            </button>
          </div>

          {/* Core Philosophy Visual Loop Bar */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-gold)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            {['DISCOVER', 'EXPERIENCE', 'PLAY', 'LEARN', 'REMEMBER'].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: idx === 2 ? 'var(--accent-gold)' : 'var(--text-primary)',
                  }}
                >
                  {step}
                </span>
                {idx < arr.length - 1 && (
                  <ArrowRight size={14} color="var(--accent-gold)" style={{ opacity: 0.7 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* What is Kaalchakra? Section */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-indigo" style={{ marginBottom: '0.75rem' }}>
              <Landmark size={14} /> The Learning Paradigm
            </div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>What is Kaalchakra?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Kaalchakra is a culture and history discovery platform that uses interactive experiences as the medium for discovery. Not a trivia quiz, not passive flashcards, and not a static encyclopedia.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              className="kc-card"
              style={{
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(229, 184, 66, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)',
                }}
              >
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem' }}>Interactive Systemic Simulations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Students don't just read about Harappan town planning or Deccan forts—they manage quarried basalt, balance cistern capacities, align covered drains, and withstand simulated historical sieges.
              </p>
            </div>

            <div
              className="kc-card"
              style={{
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)',
                }}
              >
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem' }}>Grounded in Primary Sources</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Every building metric, hydraulic calculation, and epigraphic stroke is grounded in official records from the Archaeological Survey of India (ASI), UNESCO World Heritage archives, and ancient treatises like Kautilya's <em>Arthashastra</em>.
              </p>
            </div>

            <div
              className="kc-card"
              style={{
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                }}
              >
                <Scroll size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem' }}>Cognitive Retention Through Consequence</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                When an inadequate rainwater catchment causes a fortress garrison to exhaust its reserves during summer drought, the architectural principle is remembered forever—not just crammed for an exam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: The 5-Step Loop */}
      <section style={{ padding: '5rem 0', background: 'rgba(255, 255, 255, 0.01)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Zap size={14} /> The Core Discovery Loop
            </div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>How You Learn with Kaalchakra</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Every session connects hands-on gameplay decisions directly to authentic civilizational knowledge.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                num: '01',
                title: 'Discover',
                desc: 'Encounter real architectural and civilizational challenges from Harappan hydrology to Ashokan rock edicts.',
              },
              {
                num: '02',
                title: 'Experience',
                desc: 'Grapple with authentic constraints: topography, monsoons, stone transport, and ancient ligature strokes.',
              },
              {
                num: '03',
                title: 'Play',
                desc: 'Make decisions on a deterministic simulation grid and observe the systemic cause and effect.',
              },
              {
                num: '04',
                title: 'Learn',
                desc: 'Unlock grounded Archaeological Survey of India (ASI) discovery records that explain the exact historical counterpart.',
              },
              {
                num: '05',
                title: 'Remember',
                desc: 'Build permanent civilizational intuition through active problem-solving rather than passive reading.',
              },
            ].map(step => (
              <div
                key={step.num}
                className="kc-card-flat"
                style={{
                  padding: '1.75rem 1.25rem',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'rgba(229, 184, 66, 0.25)',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                  }}
                >
                  {step.num}
                </div>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Catalog Showcase */}
      <section id="experiences-section" style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
            <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Shield size={14} /> Civilization Experiences
            </div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Planned & Available Experiences</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Explore our three playable vertical slices ready to launch today, alongside our curriculum roadmap.
            </p>
          </div>

          {/* Available Now Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span className="badge badge-emerald" style={{ padding: '0.35rem 0.75rem' }}>
              Available Now • Playable Vertical Slices
            </span>
          </div>

          {/* Playable Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.75rem',
              marginBottom: '3.5rem',
            }}
          >
            {playableExperiences.map(exp => (
              <div
                key={exp.id}
                className="kc-card"
                style={{
                  border: '1.5px solid var(--border-gold)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, rgba(24, 34, 48, 0.9), rgba(17, 23, 34, 0.9))',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>{exp.badgeIcon}</span>
                    <span className="badge badge-emerald">Playable Now</span>
                  </div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{exp.title}</h3>
                  <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {exp.tagline}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {exp.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                    {exp.culturalFocus.map(domain => (
                      <span key={domain} className="badge badge-muted" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                        {domain.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate('/auth/signup')}
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    Play Experience <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Roadmap Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span className="badge badge-muted" style={{ padding: '0.35rem 0.75rem' }}>
              Coming Next • Curriculum Roadmap
            </span>
          </div>

          {/* Roadmap Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {previewExperiences.map(exp => (
              <div
                key={exp.id}
                className="kc-card"
                style={{
                  border: '1px solid var(--border-subtle)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>{exp.badgeIcon}</span>
                    <span className="badge badge-muted" style={{ fontSize: '0.7rem' }}>Roadmap</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>{exp.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {exp.tagline}
                  </p>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Cultural Framework Configured →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kaalchakra? Section */}
      <section style={{ padding: '5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              <Globe2 size={14} /> The Educational Problem
            </div>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Why Kaalchakra?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              History and culture are too often consumed as dry lists of dates, dynasties, and battles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2.5rem',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            {/* The Old Way */}
            <div
              className="kc-card"
              style={{
                border: '1px solid rgba(239, 68, 68, 0.25)',
                background: 'rgba(239, 68, 68, 0.03)',
                padding: '2rem',
              }}
            >
              <h3 style={{ color: 'var(--accent-terracotta)', fontSize: '1.25rem', marginBottom: '1rem' }}>
                Passive Classroom Memorization
              </h3>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                <li>Memorizing arbitrary dates and ruler genealogies for tests.</li>
                <li>Static photos of ruins without understanding why they were built.</li>
                <li>Hydraulic and civil engineering achievements reduced to trivia.</li>
                <li>Knowledge rapidly forgotten within days of examination.</li>
              </ul>
            </div>

            {/* The Kaalchakra Way */}
            <div
              className="kc-card"
              style={{
                border: '1.5px solid var(--border-gold)',
                background: 'rgba(229, 184, 66, 0.04)',
                padding: '2rem',
              }}
            >
              <h3 style={{ color: 'var(--accent-gold)', fontSize: '1.25rem', marginBottom: '1rem' }}>
                The Kaalchakra Discovery Platform
              </h3>
              <ul style={{ fontSize: '0.9rem', color: 'var(--text-primary)', paddingLeft: '1.25rem', lineHeight: 1.8 }}>
                <li>Grapple with the real constraints ancient architects faced.</li>
                <li>Build Harappan drainage grids that prevent flood overflow.</li>
                <li>Decipher Ashokan Brahmi rock edicts ligature-by-ligature.</li>
                <li>Unlock verified ASI & UNESCO historical records through play.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ padding: '6rem 0', textAlign: 'center', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(229, 184, 66, 0.08), transparent 80%)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            <Award size={14} /> Begin Your Discovery
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
            Start Your Cultural Journey
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Create your scholar profile and explore thousands of years of Indian engineering, governance, and epigraphical wisdom through play.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/auth/signup')}
              className="btn btn-primary btn-lg"
              id="landing-bottom-cta-signup"
              style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem' }}
            >
              <Sparkles size={18} /> Start Discovering
            </button>
            <button
              onClick={() => navigate('/auth/login')}
              className="btn btn-secondary btn-lg"
              id="landing-bottom-cta-login"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
