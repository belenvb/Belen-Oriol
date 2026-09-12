interface MonogramProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'burgundy' | 'white' | 'dark';
}

export function Monogram({ className = '', size = 52, variant = 'gold' }: MonogramProps) {
  let primaryColor = '#b89243';
  let secondaryColor = '#e5cb8f';
  let accentColor = '#5c141e';

  if (variant === 'burgundy') {
    primaryColor = '#5c141e';
    secondaryColor = '#8c1d2d';
    accentColor = '#b89243';
  } else if (variant === 'white') {
    primaryColor = '#fdfbf7';
    secondaryColor = '#e5cb8f';
    accentColor = '#dfc285';
  } else if (variant === 'dark') {
    primaryColor = '#1c1917';
    secondaryColor = '#5c141e';
    accentColor = '#b89243';
  }

  const gradId = `goldGrad-${variant}`;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Monograma Belén & Oriol"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={variant === 'white' ? '#ffffff' : '#f5e3ba'} />
            <stop offset="50%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer Laurel / Filigree Ring */}
        <circle
          cx="80"
          cy="80"
          r="74"
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.85"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke={`url(#${gradId})`}
          strokeWidth="0.75"
          opacity="0.5"
        />

        {/* Cardinal Diamond Ornaments */}
        <polygon points="80,4 83,9 80,14 77,9" fill={`url(#${gradId})`} />
        <polygon points="80,146 83,151 80,156 77,151" fill={`url(#${gradId})`} />
        <polygon points="4,80 9,83 14,80 9,77" fill={`url(#${gradId})`} />
        <polygon points="146,80 151,83 156,80 151,77" fill={`url(#${gradId})`} />

        {/* Subtle Crown / Coronet on Top */}
        <path
          d="M66,32 L70,38 L80,30 L90,38 L94,32 L92,42 L68,42 Z"
          fill={`url(#${gradId})`}
          opacity="0.9"
        />
        <circle cx="66" cy="30" r="1.5" fill={`url(#${gradId})`} />
        <circle cx="80" cy="27" r="2" fill={`url(#${gradId})`} />
        <circle cx="94" cy="30" r="1.5" fill={`url(#${gradId})`} />

        {/* Intertwined 'B' and 'O' Calligraphy */}
        {/* Letter 'B' - Elegant Classic Serif */}
        <path
          d="M52 48 H68 C76 48 82 52 82 59 C82 64 78 68 73 70 C80 72 85 77 85 84 C85 93 78 98 68 98 H52 Z M60 55 V68 H67 C72 68 75 65 75 61 C75 57 72 55 67 55 Z M60 74 V91 H68 C73 91 77 88 77 82 C77 77 73 74 68 74 Z"
          fill={`url(#${gradId})`}
          filter="url(#royalGlow)"
        />

        {/* Letter 'O' - Interlocking Oval */}
        <path
          d="M96 46 C83 46 72 58 72 73 C72 88 83 100 96 100 C110 100 120 88 120 73 C120 58 110 46 96 46 Z M96 54 C104 54 111 63 111 73 C111 83 104 92 96 92 C88 92 81 83 81 73 C81 63 88 54 96 54 Z"
          fill={`url(#${gradId})`}
          opacity="0.88"
          filter="url(#royalGlow)"
        />

        {/* Elegant '&' ligature at center base */}
        <text
          x="77"
          y="114"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="16"
          fontStyle="italic"
          textAnchor="middle"
          fill={accentColor}
          opacity="0.9"
        >
          &amp;
        </text>

        {/* Date Inscription Beneath */}
        <text
          x="80"
          y="132"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="6.5"
          letterSpacing="2.5"
          textAnchor="middle"
          fill={`url(#${gradId})`}
          fontWeight="600"
          opacity="0.85"
        >
          SALAMANCA · 2027
        </text>
      </svg>
    </div>
  );
}
