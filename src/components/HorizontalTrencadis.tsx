import { useMemo } from 'react';
import { motion } from 'motion/react';

interface HorizontalTrencadisProps {
  className?: string;
  showCenterMedallion?: boolean;
}

export function HorizontalTrencadis({
  className = '',
  showCenterMedallion = true,
}: HorizontalTrencadisProps) {
  // Palette inspired by Gaudí's trencadís and Belén & Oriol's royal wedding invitations:
  // Deep wine/burgundy, warm terracotta, Spanish olive/moss, rich saffron/ochre, lapis blue, and glazed porcelain
  const palette = useMemo(
    () => [
      { fill: '#5c141e', highlight: '#84202d' }, // Burgundy
      { fill: '#781a28', highlight: '#9b2638' }, // Crimson
      { fill: '#3d5c38', highlight: '#557a50' }, // Olive Green
      { fill: '#2e482b', highlight: '#42633d' }, // Deep Moss
      { fill: '#d69929', highlight: '#f0b748' }, // Ochre Gold
      { fill: '#c2831c', highlight: '#dba235' }, // Saffron
      { fill: '#c6532d', highlight: '#de6d47' }, // Terracotta
      { fill: '#a83e1d', highlight: '#c4512e' }, // Burnt Clay
      { fill: '#244874', highlight: '#3a6498' }, // Cobalt Blue
      { fill: '#1b375b', highlight: '#2a4f7e' }, // Lapis
      { fill: '#faf5ea', highlight: '#ffffff' }, // Glazed Porcelain
      { fill: '#ede2ce', highlight: '#fdfbf7' }, // Cream Tile
      { fill: '#5c141e', highlight: '#7a1a27' }, // Deep Wine
      { fill: '#4a6d45', highlight: '#688f61' }, // Sage Leaf
      { fill: '#e5b03b', highlight: '#ffd269' }, // Warm Gold
      { fill: '#8c2432', highlight: '#ab3242' }, // Rose Red
    ],
    []
  );

  // Generate an intricate, authentic set of polygonal mosaic shards for a seamless horizontal repeating tile
  // Width 400, Height 54
  const shards = useMemo(() => {
    return [
      // Row 1 (top band)
      { points: '0,0 28,0 22,18 0,16', colorIdx: 0 },
      { points: '28,0 58,0 64,16 22,18', colorIdx: 4 },
      { points: '58,0 92,0 86,17 64,16', colorIdx: 2 },
      { points: '92,0 128,0 120,18 86,17', colorIdx: 6 },
      { points: '128,0 162,0 156,15 120,18', colorIdx: 10 },
      { points: '162,0 196,0 202,17 156,15', colorIdx: 1 },
      { points: '196,0 234,0 226,18 202,17', colorIdx: 8 },
      { points: '234,0 268,0 262,16 226,18', colorIdx: 3 },
      { points: '268,0 304,0 310,18 262,16', colorIdx: 5 },
      { points: '304,0 338,0 332,15 310,18', colorIdx: 7 },
      { points: '338,0 372,0 366,17 332,15', colorIdx: 11 },
      { points: '372,0 400,0 400,16 366,17', colorIdx: 0 },

      // Row 2 (upper mid)
      { points: '0,16 22,18 16,34 0,32', colorIdx: 7 },
      { points: '22,18 64,16 56,35 16,34', colorIdx: 11 },
      { points: '64,16 86,17 92,36 56,35', colorIdx: 0 },
      { points: '86,17 120,18 114,35 92,36', colorIdx: 4 },
      { points: '120,18 156,15 162,34 114,35', colorIdx: 8 },
      { points: '156,15 202,17 194,36 162,34', colorIdx: 2 },
      { points: '202,17 226,18 232,35 194,36', colorIdx: 6 },
      { points: '226,18 262,16 254,34 232,35', colorIdx: 10 },
      { points: '262,16 310,18 304,36 254,34', colorIdx: 1 },
      { points: '310,18 332,15 338,35 304,36', colorIdx: 9 },
      { points: '332,15 366,17 360,34 338,35', colorIdx: 3 },
      { points: '366,17 400,16 400,33 360,34', colorIdx: 5 },

      // Row 3 (lower mid)
      { points: '0,32 16,34 24,46 0,44', colorIdx: 2 },
      { points: '16,34 56,35 48,48 24,46', colorIdx: 5 },
      { points: '56,35 92,36 84,49 48,48', colorIdx: 9 },
      { points: '92,36 114,35 122,48 84,49', colorIdx: 1 },
      { points: '114,35 162,34 154,49 122,48', colorIdx: 3 },
      { points: '162,34 194,36 200,48 154,49', colorIdx: 7 },
      { points: '194,36 232,35 224,49 200,48', colorIdx: 11 },
      { points: '232,35 254,34 262,48 224,49', colorIdx: 0 },
      { points: '254,34 304,36 296,49 262,48', colorIdx: 4 },
      { points: '304,36 338,35 344,48 296,49', colorIdx: 8 },
      { points: '338,35 360,34 368,48 344,48', colorIdx: 10 },
      { points: '360,34 400,33 400,46 368,48', colorIdx: 6 },

      // Row 4 (bottom band)
      { points: '0,44 24,46 18,54 0,54', colorIdx: 8 },
      { points: '24,46 48,48 54,54 18,54', colorIdx: 1 },
      { points: '48,48 84,49 78,54 54,54', colorIdx: 4 },
      { points: '84,49 122,48 116,54 78,54', colorIdx: 10 },
      { points: '122,48 154,49 160,54 116,54', colorIdx: 2 },
      { points: '154,49 200,48 192,54 160,54', colorIdx: 5 },
      { points: '200,48 224,49 230,54 192,54', colorIdx: 9 },
      { points: '224,49 262,48 256,54 230,54', colorIdx: 7 },
      { points: '262,48 296,49 302,54 256,54', colorIdx: 3 },
      { points: '296,49 344,48 338,54 302,54', colorIdx: 11 },
      { points: '344,48 368,48 374,54 338,54', colorIdx: 0 },
      { points: '368,48 400,46 400,54 374,54', colorIdx: 4 },
    ];
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden select-none my-0 py-0 ${className}`}
      aria-label="Cinta decorativa de trencadís catalán"
    >
      {/* Top Gold & Filigree Edge */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#dfc285] relative shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent_70%)]" />
      </div>
      <div className="h-[2px] w-full bg-[#37080e]/40" />

      {/* Main Mosaic Canvas / Frieze */}
      <div className="relative h-14 sm:h-16 md:h-18 w-full bg-[#362921] overflow-hidden flex items-center justify-center">
        {/* Subtle texture shadow under tiles */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35 pointer-events-none z-10" />

        {/* Repeating Vector Mosaic using SVG Pattern */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="repeat"
        >
          <defs>
            <pattern
              id="trencadis-tile-pattern"
              width="400"
              height="54"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1.25)"
            >
              {/* Mortar / Grout Base */}
              <rect width="400" height="54" fill="#2d221b" />

              {/* Broken ceramic pieces */}
              {shards.map((shard, idx) => {
                const color = palette[shard.colorIdx % palette.length];
                return (
                  <g key={idx}>
                    {/* Shadow underneath individual tile shard */}
                    <polygon
                      points={shard.points}
                      fill="#19130f"
                      transform="translate(0.5, 0.8)"
                      opacity="0.75"
                    />
                    {/* Main ceramic body */}
                    <polygon
                      points={shard.points}
                      fill={color.fill}
                      stroke="#2d221b"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    {/* Glazed bevel highlight */}
                    <polygon
                      points={shard.points}
                      fill={color.highlight}
                      opacity="0.32"
                      transform="scale(0.92) translate(1, 0.8)"
                    />
                  </g>
                );
              })}
            </pattern>
          </defs>

          {/* Fill with seamless trencadís pattern */}
          <rect width="100%" height="100%" fill="url(#trencadis-tile-pattern)" />
        </svg>
      </div>

      {/* Bottom Gold & Filigree Edge */}
      <div className="h-[2px] w-full bg-[#37080e]/40" />
      <div className="h-1.5 w-full bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#dfc285] relative shadow-xs">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent_70%)]" />
      </div>
    </div>
  );
}
