interface MonogramProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'burgundy' | 'white' | 'dark';
}

export function Monogram({ className = '', size = 44, variant = 'gold' }: MonogramProps) {
  const getColors = () => {
    switch (variant) {
      case 'burgundy':
        return {
          primary: '#5c141e',
          secondary: '#74182a',
          accent: '#8c142b',
        };
      case 'white':
        return {
          primary: '#f8f5ee',
          secondary: '#dfc285',
          accent: '#ffffff',
        };
      case 'dark':
        return {
          primary: '#241d1a',
          secondary: '#3a2e29',
          accent: '#181210',
        };
      case 'gold':
      default:
        return {
          primary: '#dfc285',
          secondary: '#b89243',
          accent: '#f5e3ba',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="BO Monogram"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bo-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.accent} />
            <stop offset="50%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>

        {/* Clean Intertwined Roman Serif B & O Typography (No crown, no embroidery) */}
        <g transform="translate(50, 52)">
          {/* Letter O */}
          <text
            x="8"
            y="18"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', serif"
            fontSize="62"
            fontWeight="500"
            letterSpacing="-0.05em"
            fill={`url(#bo-grad-${variant})`}
            opacity="0.95"
          >
            O
          </text>

          {/* Letter B Interlocking */}
          <text
            x="-10"
            y="18"
            textAnchor="middle"
            fontFamily="'Cinzel', 'Cormorant Garamond', 'Playfair Display', serif"
            fontSize="62"
            fontWeight="600"
            letterSpacing="-0.05em"
            fill={`url(#bo-grad-${variant})`}
          >
            B
          </text>
        </g>
      </svg>
    </div>
  );
}


