import React from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Award,
} from 'lucide-react';
import { EXPERIENCES } from '../../data/experiences';
import {
  RoyalSealBadge,
  FortSilhouetteSvg,
  TopographicMapSvg,
  CornerBrackets,
  WaxSealStamp,
  HistoricalDivider,
  FortGateIcon,
  ScrollManuscriptIcon,
  MasonCompassIcon,
  AncientCoinIcon,
  EpigraphTabletIcon,
} from '../../components/common/HistoricalMotifs';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const playableExperiences = EXPERIENCES.filter(e => e.status === 'playable');
  const previewExperiences = EXPERIENCES.filter(e => e.status === 'preview');

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* =====================================================================
          HERO SECTION: Ancient Royal Chronicle + Deccan Fort Map Table
          ===================================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 0 0',
          borderBottom: '1px solid var(--border-gold)',
          background: 'linear-gradient(180deg, #14171e 0%, #0d0f13 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Antique Topographic Contour Lines Texture */}
        <TopographicMapSvg opacity={0.12} />

        {/* Ambient Torchlight Warm Vignette */}
        <div
          className="torch-glow"
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '900px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(200, 106, 26, 0.22) 0%, rgba(207, 164, 79, 0.12) 45%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '980px', paddingBottom: '3.5rem' }}>
          {/* Royal Seal Emblem */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <RoyalSealBadge size={68} />
          </div>

          {/* Historical Chronicle Header Badge */}
          <div
            className="badge badge-gold"
            style={{
              margin: '0 auto 1.25rem auto',
              padding: '0.45rem 1.15rem',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: '1px solid var(--border-gold)',
              background: 'rgba(26, 21, 16, 0.85)',
              boxShadow: '0 0 16px rgba(207, 164, 79, 0.15)',
            }}
          >
            <span>HISTORICAL MAP &amp; CHRONICLE OF INDIAN CIVILIZATIONS</span>
          </div>

          {/* Grand Monumental Title */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 4.75rem)',
              lineHeight: 1.08,
              fontWeight: 800,
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              color: '#fff8eb',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9), 0 0 24px rgba(207, 164, 79, 0.35)',
            }}
          >
            KAALCHAKRA
          </h1>

          {/* Deccan Historical Subtitle */}
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.25rem, 2.8vw, 1.85rem)',
              color: 'var(--accent-gold-light)',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            DISCOVER INDIA THROUGH PLAY
          </div>

          {/* Evocative Chronicle Description */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: '780px',
              margin: '0 auto 2.5rem auto',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Explore civilizations, forts, trade routes, architecture, scripts, and living heritage
            through interactive experiences. Grapple with basalt cliff defenses, balance Harappan
            reservoir grids, decipher ancient Ashokan rock edicts, and unlock verified archaeological records.
          </p>

          {/* Call to Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <button
              onClick={() => navigate('/auth/signup')}
              className="btn btn-primary btn-lg"
              id="landing-hero-cta-start"
              style={{
                fontSize: '1rem',
                padding: '0.9rem 2.25rem',
                boxShadow: '0 4px 20px var(--accent-saffron-glow), 0 0 30px rgba(200, 106, 26, 0.3)',
                letterSpacing: '0.08em',
              }}
            >
              <Sparkles size={18} /> START DISCOVERING
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('experiences-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary btn-lg"
              id="landing-hero-cta-explore"
              style={{ fontSize: '1rem', padding: '0.9rem 2rem', letterSpacing: '0.08em' }}
            >
              <Compass size={18} /> EXPLORE EXPERIENCES
            </button>
          </div>

          {/* Historical 5-Step Chronicle Loop Ribbon */}
          <div
            className="parchment-panel"
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              padding: '1.15rem 1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: '0.75rem',
              flexWrap: 'wrap',
              border: '1px solid var(--border-gold)',
            }}
          >
            {[
              { num: '०१', en: 'DISCOVER', desc: 'Encounter real historical dilemmas' },
              { num: '०२', en: 'EXPERIENCE', desc: 'Grapple with authentic constraints' },
              { num: '०३', en: 'PLAY', desc: 'Execute decisions on simulation grids' },
              { num: '०४', en: 'LEARN', desc: 'Unlock primary ASI & UNESCO records' },
              { num: '०५', en: 'REMEMBER', desc: 'Build enduring civilizational intuition' },
            ].map((step, idx, arr) => (
              <React.Fragment key={step.en}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      color: idx === 2 ? '#f7a256' : 'var(--text-primary)',
                    }}
                  >
                    {step.en}
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight size={13} color="var(--accent-gold)" style={{ opacity: 0.6 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Sahyadri Hill-Fort Ramparts & Bastion Silhouette Base */}
        <div style={{ position: 'relative', width: '100%', height: '110px', marginTop: '-30px', pointerEvents: 'none' }}>
          <FortSilhouetteSvg />
        </div>
      </section>

      {/* =====================================================================
          SECTION: What is Kaalchakra? (Ancient Fort Archive & Living Chronicle)
          ===================================================================== */}
      <section style={{ padding: '5.5rem 0', borderBottom: '1px solid var(--border-gold)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <HistoricalDivider label="THE CHRONICLE ARCHIVE" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
              What is Kaalchakra?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.7 }}>
              Kaalchakra is a culture and history discovery platform that uses interactive experiences as the medium for discovery.
              Not a trivia quiz, not passive flashcards, and not a static encyclopedia.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Tablet 1 */}
            <div className="artifact-card">
              <CornerBrackets />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    background: 'rgba(207, 164, 79, 0.12)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FortGateIcon size={24} color="var(--accent-gold)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                  Interactive Systemic Simulations
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                Students don't just read about Harappan town planning or Deccan forts—they manage quarried basalt,
                balance rock-cut cistern capacities, align covered drains, and withstand simulated historical sieges.
              </p>
            </div>

            {/* Tablet 2 */}
            <div className="artifact-card">
              <CornerBrackets />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    background: 'rgba(200, 106, 26, 0.15)',
                    border: '1px solid var(--border-saffron)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ScrollManuscriptIcon size={24} color="#f7a256" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                  Grounded in Primary Treatises
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                Every building metric, hydraulic calculation, and epigraphic glyph is grounded in official records
                from the Archaeological Survey of India (ASI), UNESCO World Heritage archives, and ancient treatises
                like Kautilya's <em>Arthashastra</em>.
              </p>
            </div>

            {/* Tablet 3 */}
            <div className="artifact-card">
              <CornerBrackets />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '8px',
                    background: 'rgba(115, 34, 34, 0.25)',
                    border: '1px solid var(--border-maroon)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WaxSealStamp size={32} label="स्मृती" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                  Retention Through Consequence
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7 }}>
                When an inadequate rainwater catchment causes a fortress garrison to exhaust its reserves during
                summer drought, the civilizational principle is etched permanently into memory—not crammed for a test.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: Historical Artifact Cards (Planned & Available Experiences)
          ===================================================================== */}
      <section
        id="experiences-section"
        style={{
          padding: '6rem 0',
          borderBottom: '1px solid var(--border-gold)',
          background: 'var(--bg-primary)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <HistoricalDivider label="THE ROYAL CATALOG OF EXPERIENCES" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
              Step Into Another Chapter of History
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem' }}>
              Three fully playable vertical slices ready to launch today, alongside our verified curriculum roadmap.
            </p>
          </div>

          {/* Available Now Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span className="badge badge-gold" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
              ✦ AVAILABLE NOW • PLAYABLE HISTORICAL SLICES
            </span>
          </div>

          {/* Playable Grid (Historical Artifact Cards) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '4.5rem',
            }}
          >
            {/* Artifact Card 1: Fort Master */}
            <div className="artifact-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CornerBrackets />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      background: 'rgba(200, 106, 26, 0.16)',
                      border: '1.5px solid var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FortGateIcon size={30} color="var(--accent-gold)" />
                  </div>
                  <WaxSealStamp size={36} label="दुर्ग" />
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  दुर्ग विज्ञान • Sahyadri &amp; Deccan Fortresses
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                  FORT MASTER
                </h3>

                <div style={{ color: '#f7a256', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.85rem', fontStyle: 'italic' }}>
                  Build. Defend. Strategize. Discover India's forts.
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Step into the role of a Durgadhyaksha (Fort Planner). Construct rock-cut rainwater cisterns (tankas),
                  granaries, watchtowers, and bastion gates atop high basalt cliffs before seasonal monsoons test your defenses.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {['Basalt Masonry', 'Rainwater Harvesting', 'Sahyadri Topography'].map(tag => (
                    <span key={tag} className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/auth/signup')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
                >
                  <span>ENTER FORTRESS</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Artifact Card 2: Bharat Architect */}
            <div className="artifact-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CornerBrackets />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      background: 'rgba(207, 164, 79, 0.14)',
                      border: '1.5px solid var(--accent-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MasonCompassIcon size={30} color="var(--accent-gold-light)" />
                  </div>
                  <WaxSealStamp size={36} label="नगर" />
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  नगर रचना • Harappan Hydraulic Grid
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                  BHARAT ARCHITECT
                </h3>

                <div style={{ color: '#f7a256', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.85rem', fontStyle: 'italic' }}>
                  Plan. Align. Engineer. Discover Harappan cities.
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  In the tradition of Dholavira and Mohenjo-daro, lay out residential blocks, paved brick thoroughfares,
                  covered wastewater drains, and rock-cut reservoirs to prevent monsoon floods while providing civic access.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {['Standardized Bricks', 'Covered Drains', 'Hydraulic Reservoirs'].map(tag => (
                    <span key={tag} className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/auth/signup')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
                >
                  <span>ENTER SETTLEMENT</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Artifact Card 3: Lost Script */}
            <div className="artifact-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CornerBrackets />
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      background: 'rgba(115, 34, 34, 0.25)',
                      border: '1.5px solid var(--border-maroon)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EpigraphTabletIcon size={30} color="#fca5a5" />
                  </div>
                  <WaxSealStamp size={36} label="लिपी" />
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  शिलालेख • Ashokan Epigraphy &amp; Seals
                </div>

                <h3 style={{ fontSize: '1.45rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                  LOST SCRIPT
                </h3>

                <div style={{ color: '#f7a256', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.85rem', fontStyle: 'italic' }}>
                  Decipher. Inscribe. Reveal. Discover ancient edicts.
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  Assume the role of an epigraphical researcher at the ASI. Inspect weathered stone monoliths and Harappan
                  steatite seals, match phonetic glyphs, and unlock Emperor Ashoka's Major Rock Edicts.
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {['Ashokan Brahmi', 'ASI Monoliths', 'Steatite Seals'].map(tag => (
                    <span key={tag} className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/auth/signup')}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
                >
                  <span>ENTER EXCAVATION</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Roadmap Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <span className="badge badge-muted" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
              ✦ ROADMAP • FORTHCOMING HISTORICAL CHAPTERS
            </span>
          </div>

          {/* Roadmap Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {previewExperiences.map(exp => (
              <div
                key={exp.id}
                className="kc-card-flat"
                style={{
                  border: '1px solid var(--border-gold)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(20, 23, 30, 0.65)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{exp.badgeIcon}</span>
                    <span className="badge badge-muted" style={{ fontSize: '0.68rem' }}>Curriculum Roadmap</span>
                  </div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', fontFamily: 'var(--font-serif)' }}>
                    {exp.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {exp.tagline}
                  </p>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  Primary Source Framework Configured →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION: Why Kaalchakra? (The Historical Ledger Comparison)
          ===================================================================== */}
      <section style={{ padding: '5.5rem 0', borderBottom: '1px solid var(--border-gold)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <HistoricalDivider label="THE HISTORICAL PEDAGOGY" />
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
              Don't Just Read History. Enter It.
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem' }}>
              History and culture are too often taught as dry lists of dates, dynasties, and battles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              maxWidth: '940px',
              margin: '0 auto',
            }}
          >
            {/* The Old Way */}
            <div
              className="kc-card"
              style={{
                border: '1px solid rgba(143, 60, 37, 0.4)',
                background: 'rgba(28, 20, 18, 0.85)',
                padding: '2.25rem',
              }}
            >
              <h3 style={{ color: '#e06a50', fontSize: '1.3rem', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                The Rote Learning Model
              </h3>
              <ul style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', lineHeight: 1.85 }}>
                <li>Memorizing arbitrary dates and ruler genealogies for tests.</li>
                <li>Static photographs of stone ruins with zero understanding of why they were built.</li>
                <li>Hydraulic and civil engineering achievements reduced to trivia.</li>
                <li>Knowledge rapidly forgotten within days of examination.</li>
              </ul>
            </div>

            {/* The Kaalchakra Way */}
            <div
              className="artifact-card"
              style={{
                background: 'linear-gradient(145deg, rgba(34, 28, 20, 0.95), rgba(20, 24, 30, 0.95))',
                border: '1.5px solid var(--accent-gold)',
                padding: '2.25rem',
              }}
            >
              <CornerBrackets />
              <h3 style={{ color: 'var(--accent-gold-light)', fontSize: '1.3rem', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
                The Kaalchakra Chronicle
              </h3>
              <ul style={{ fontSize: '0.92rem', color: 'var(--text-primary)', paddingLeft: '1.25rem', lineHeight: 1.85 }}>
                <li>Grapple with the real constraints ancient architects faced on hill forts and riverbanks.</li>
                <li>Build Harappan drainage grids that prevent flood overflow through deliberate civic planning.</li>
                <li>Decipher Ashokan Brahmi rock edicts ligature-by-ligature with authentic archaeological tools.</li>
                <li>Unlock verified ASI &amp; UNESCO historical records through active problem-solving.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FINAL SECTION: Unroll the Chronicle CTA
          ===================================================================== */}
      <section
        style={{
          padding: '6.5rem 0',
          textAlign: 'center',
          position: 'relative',
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200, 106, 26, 0.12) 0%, transparent 75%)',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <RoyalSealBadge size={58} />
          </div>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
            Unroll the Royal Chronicle
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Inscribe your scholar name and explore thousands of years of Indian engineering, governance,
            and epigraphical wisdom through play.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/auth/signup')}
              className="btn btn-primary btn-lg"
              id="landing-bottom-cta-signup"
              style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', letterSpacing: '0.08em' }}
            >
              <Sparkles size={18} /> START DISCOVERING
            </button>
            <button
              onClick={() => navigate('/auth/login')}
              className="btn btn-secondary btn-lg"
              id="landing-bottom-cta-login"
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', letterSpacing: '0.08em' }}
            >
              SIGN IN TO EXISTING ACCOUNT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
