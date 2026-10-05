import React from 'react';

/**
 * 17th-Century Maratha / Deccan Historical SVG Motifs & Artifact Emblems
 * Used across Kaalchakra to create an authentic royal chronicle + fort archive atmosphere.
 */

// 1. Royal Octagonal Seal Emblem (Inspired by Deccan Rajmudra & Epigraphic Seals)
export const RoyalSealBadge: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 44,
  className = '',
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-label="Kaalchakra Royal Seal"
    >
      <defs>
        <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e5c378" />
          <stop offset="50%" stopColor="#cfa44f" />
          <stop offset="100%" stopColor="#99732d" />
        </linearGradient>
        <radialGradient id="basaltCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#221c17" />
          <stop offset="70%" stopColor="#14171d" />
          <stop offset="100%" stopColor="#0a0c10" />
        </radialGradient>
        <radialGradient id="torchGlow" cx="50%" cy="50%" r="45%">
          <stop offset="0%" stopColor="rgba(200, 106, 26, 0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Octagonal Outer Boundary */}
      <polygon
        points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
        fill="url(#basaltCore)"
        stroke="url(#goldRim)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Subtle Torchlight Inner Glow */}
      <polygon
        points="31,7 69,7 93,31 93,69 69,93 31,93 7,69 7,31"
        fill="url(#torchGlow)"
      />

      {/* Inner Decorative Beaded Ring */}
      <circle cx="50" cy="50" r="34" stroke="#cfa44f" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
      <circle cx="50" cy="50" r="28" stroke="#99732d" strokeWidth="1" opacity="0.8" />

      {/* Central 12-Spoke Kaalchakra Wheel & Sunburst */}
      <circle cx="50" cy="50" r="8" fill="url(#goldRim)" />
      <circle cx="50" cy="50" r="4" fill="#0d0f13" />

      {/* Cardinal & Intercardinal Ray Spokes */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
        <line
          key={angle}
          x1="50"
          y1="50"
          x2={50 + 24 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 24 * Math.sin((angle * Math.PI) / 180)}
          stroke="#cfa44f"
          strokeWidth="1.2"
          opacity={angle % 90 === 0 ? '1' : '0.65'}
        />
      ))}

      {/* 4 Corner Embellishment Pips */}
      <circle cx="20" cy="20" r="2" fill="#cfa44f" />
      <circle cx="80" cy="20" r="2" fill="#cfa44f" />
      <circle cx="80" cy="80" r="2" fill="#cfa44f" />
      <circle cx="20" cy="80" r="2" fill="#cfa44f" />
    </svg>
  );
};

// 2. Sahyadri Hill-Fort Ramparts & Bastion Silhouette (Atmospheric Backdrop)
export const FortSilhouetteSvg: React.FC<{ style?: React.CSSProperties }> = ({ style = {} }) => {
  return (
    <svg
      viewBox="0 0 1200 180"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    >
      <defs>
        <linearGradient id="fortBasaltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1b1f27" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#14171d" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0d0f13" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="fortMist" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(200, 106, 26, 0.12)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Distant Sahyadri Mountain Ridge */}
      <path
        d="M0 120 Q 150 70 320 100 T 640 65 T 920 95 T 1200 70 L 1200 180 L 0 180 Z"
        fill="#12151c"
        opacity="0.5"
      />

      {/* Middle Fortress Ridge with Bastions & Battlements */}
      <path
        d="M0 135 
           L 80 130 L 95 110 L 115 110 L 120 128 
           L 240 125 
           L 260 90 L 290 90 L 290 100 L 320 95 L 340 120 
           L 460 115 
           L 480 85 L 500 85 L 505 70 L 515 70 L 520 85 L 540 85 L 560 112 
           L 680 110 
           L 700 80 L 735 80 L 750 110 
           L 840 118 
           L 865 92 L 890 92 L 910 115 
           L 1020 110 
           L 1045 75 L 1070 75 L 1075 60 L 1085 60 L 1090 75 L 1110 75 L 1130 115 
           L 1200 120 
           L 1200 180 L 0 180 Z"
        fill="url(#fortBasaltGrad)"
      />

      {/* Watchtower Flag Motif on highest peak (Muted Saffron) */}
      <line x1="510" y1="70" x2="510" y2="40" stroke="#cfa44f" strokeWidth="1.5" />
      <path d="M510 40 L535 48 L510 56 Z" fill="#c86a1a" opacity="0.9" />

      {/* Second flag on eastern bastion */}
      <line x1="1080" y1="60" x2="1080" y2="35" stroke="#cfa44f" strokeWidth="1.5" />
      <path d="M1080 35 L1102 42 L1080 49 Z" fill="#c86a1a" opacity="0.8" />

      {/* Atmospheric Torchlight Glow Band along the walls */}
      <rect x="0" y="50" width="1200" height="70" fill="url(#fortMist)" />
    </svg>
  );
};

// 3. Antique Topographic Contour Lines (Strategic Deccan Map Table Texture)
export const TopographicMapSvg: React.FC<{ style?: React.CSSProperties; opacity?: number }> = ({
  style = {},
  opacity = 0.08,
}) => {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity,
        ...style,
      }}
    >
      <defs>
        <pattern id="mapGridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="60" y2="0" stroke="#cfa44f" strokeWidth="0.5" strokeDasharray="1 5" />
          <line x1="0" y1="0" x2="0" y2="60" stroke="#cfa44f" strokeWidth="0.5" strokeDasharray="1 5" />
        </pattern>
      </defs>

      {/* Subtle Coordinate Grid */}
      <rect width="800" height="600" fill="url(#mapGridPattern)" />

      {/* Contour Elevation Rings */}
      <path
        d="M 120 180 C 180 120, 320 110, 420 160 C 520 210, 680 160, 720 240 C 760 320, 680 440, 560 480 C 440 520, 260 510, 180 440 C 100 370, 60 240, 120 180 Z"
        stroke="#cfa44f"
        strokeWidth="1.2"
      />
      <path
        d="M 170 210 C 220 160, 330 150, 400 190 C 470 230, 600 200, 650 260 C 700 320, 630 400, 530 430 C 430 460, 290 450, 230 400 C 170 350, 120 260, 170 210 Z"
        stroke="#cfa44f"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <path
        d="M 230 250 C 270 210, 350 200, 410 230 C 470 260, 540 250, 580 300 C 620 350, 560 390, 490 400 C 420 410, 320 400, 280 370 C 240 340, 190 290, 230 250 Z"
        stroke="#cfa44f"
        strokeWidth="0.8"
      />
      <path
        d="M 300 280 C 330 250, 390 250, 420 270 C 450 290, 490 290, 510 320 C 530 350, 490 370, 450 370 C 410 370, 350 370, 330 350 C 310 330, 270 310, 300 280 Z"
        stroke="#cfa44f"
        strokeWidth="0.6"
      />

      {/* Fort Plateau Summit Node */}
      <circle cx="420" cy="310" r="5" fill="#c86a1a" opacity="0.6" />
      <circle cx="420" cy="310" r="10" stroke="#cfa44f" strokeWidth="0.75" />
      <text x="435" y="315" fill="#cfa44f" fontSize="10" fontFamily="serif" letterSpacing="1">
        BALA KILLA • ELEV. 1350M
      </text>
    </svg>
  );
};

// 4. Antique Brass Etched Corner Brackets (for Artifact Cards)
export const CornerBrackets: React.FC<{ color?: string }> = ({ color = 'rgba(207, 164, 79, 0.45)' }) => {
  return (
    <>
      {/* Top Left */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{ position: 'absolute', top: '4px', left: '4px', pointerEvents: 'none' }}
      >
        <path d="M1 13 L1 1 L13 1" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="4" cy="4" r="1" fill={color} />
      </svg>
      {/* Top Right */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{ position: 'absolute', top: '4px', right: '4px', pointerEvents: 'none' }}
      >
        <path d="M1 1 L13 1 L13 13" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="10" cy="4" r="1" fill={color} />
      </svg>
      {/* Bottom Left */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{ position: 'absolute', bottom: '4px', left: '4px', pointerEvents: 'none' }}
      >
        <path d="M1 1 L1 13 L13 13" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="4" cy="10" r="1" fill={color} />
      </svg>
      {/* Bottom Right */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        style={{ position: 'absolute', bottom: '4px', right: '4px', pointerEvents: 'none' }}
      >
        <path d="M1 13 L13 13 L13 1" fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx="10" cy="10" r="1" fill={color} />
      </svg>
    </>
  );
};

// 5. Deep Royal Maroon Wax Seal Stamp
export const WaxSealStamp: React.FC<{ size?: number; label?: string; style?: React.CSSProperties }> = ({
  size = 38,
  label = 'मुद्रा',
  style = {},
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #8f2626 0%, #681d1d 60%, #401010 100%)',
        border: '1.5px solid #a83838',
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.7), inset 0 2px 3px rgba(255, 255, 255, 0.2)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f6d5a8',
        fontFamily: 'var(--font-serif)',
        fontSize: `${size * 0.32}px`,
        fontWeight: 700,
        letterSpacing: '0.04em',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
      title="Royal Sealed Authenticity"
    >
      {label}
    </div>
  );
};

// 6. Antique 8-Point Strategic Compass Rose
export const MapCompassRose: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 40,
  style = {},
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
    >
      <circle cx="50" cy="50" r="44" stroke="#cfa44f" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="50" cy="50" r="40" stroke="#99732d" strokeWidth="1" opacity="0.75" />
      <circle cx="50" cy="50" r="16" stroke="#cfa44f" strokeWidth="0.8" opacity="0.5" />

      {/* North Arrow (Muted Saffron / Bhagwa) */}
      <polygon points="50,6 54,42 50,38 46,42" fill="#c86a1a" />
      <polygon points="50,6 54,42 50,50" fill="#9e4e0d" />

      {/* South Arrow (Brass) */}
      <polygon points="50,94 54,58 50,62 46,58" fill="#cfa44f" />
      <polygon points="50,94 46,58 50,50" fill="#99732d" />

      {/* East Arrow */}
      <polygon points="94,50 58,46 62,50 58,54" fill="#cfa44f" />
      <polygon points="94,50 58,54 50,50" fill="#99732d" />

      {/* West Arrow */}
      <polygon points="6,50 42,46 38,50 42,54" fill="#cfa44f" />
      <polygon points="6,50 42,46 50,50" fill="#99732d" />

      {/* Cardinal Labels */}
      <text x="50" y="24" textAnchor="middle" fill="#cfa44f" fontSize="8" fontWeight="bold" fontFamily="serif">
        N
      </text>
    </svg>
  );
};

// 7. Antique Brass Ornamental Divider with Center Seal Gem
export const HistoricalDivider: React.FC<{ label?: string; style?: React.CSSProperties }> = ({
  label,
  style = {},
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        margin: '2rem 0',
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(207, 164, 79, 0.45))',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', opacity: 0.7 }}>❖</span>
        {label ? (
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--accent-gold-light)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </span>
        ) : (
          <span
            style={{
              width: '8px',
              height: '8px',
              transform: 'rotate(45deg)',
              background: 'var(--accent-gold)',
              boxShadow: '0 0 8px var(--accent-gold-glow)',
            }}
          />
        )}
        <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', opacity: 0.7 }}>❖</span>
      </div>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(207, 164, 79, 0.45), transparent)',
        }}
      />
    </div>
  );
};

// 8. Custom Historical Domain Icons
export const FortGateIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#cfa44f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M4 21V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
    <path d="M20 21V5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v2" />
    <path d="M9 7h6v14H9z" />
    <path d="M9 11h6" />
    <path d="M12 7v14" />
    <path d="M4 4h3v3H4z" fill={color} fillOpacity="0.2" />
    <path d="M17 4h3v3h-3z" fill={color} fillOpacity="0.2" />
  </svg>
);

export const ScrollManuscriptIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#cfa44f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    <path d="M16 21h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4" />
    <path d="M8 3a4 4 0 0 1 8 0v18a4 4 0 0 1-8 0z" fill={color} fillOpacity="0.15" />
    <path d="M11 8h2" />
    <path d="M11 12h2" />
    <path d="M11 16h2" />
  </svg>
);

export const MasonCompassIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#cfa44f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" />
    <path d="m5 21 5.5-14" />
    <path d="m19 21-5.5-14" />
    <path d="M7 16h10" />
    <circle cx="12" cy="16" r="1" fill={color} />
  </svg>
);

export const AncientCoinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#cfa44f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />
    <path d="M12 9v6" />
    <path d="M9.5 10.5h5" />
  </svg>
);

export const EpigraphTabletIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#cfa44f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={color} fillOpacity="0.1" />
    <path d="M7 7h10" />
    <path d="M7 11h6" />
    <path d="M7 15h8" />
    <path d="M16 11l2 2-2 2" />
  </svg>
);
