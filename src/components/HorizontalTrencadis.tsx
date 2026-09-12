import { useMemo, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface HorizontalTrencadisProps {
  className?: string;
}

interface TileShard {
  id: string;
  points: string;
  facetPoints?: string;
  fill: string;
  opacity: number;
  scatterX: number;
  scatterY: number;
  scatterRotate: number;
  scatterScale: number;
}

interface RosetteFragment {
  cx: number;
  cy: number;
  r: number;
  color: string;
  innerColor: string;
  scatterX: number;
  scatterY: number;
}

export function HorizontalTrencadis({ className = '' }: HorizontalTrencadisProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.05, once: false });

  // Pure Gaudí & Catalan Modernist ceramic palette (No white tiles!)
  const { shards, rosettes } = useMemo(() => {
    const palette = [
      '#74182a', // Wine Burgundy
      '#d79523', // Salamanca Ochre Gold
      '#1b542e', // Forest Emerald
      '#1a3d6f', // Mediterranean Cobalt
      '#bf4d28', // Terracotta Orange
      '#532d43', // Deep Plum Ceramic
      '#c2841b', // Catalan Amber
      '#265b40', // Deep Forest
      '#163761', // Lapis Blue
      '#9c3321', // Warm Paprika
      '#621827', // Dark Wine
      '#2f4858', // Slate Ceramic
      '#a86518', // Warm Ochre
      '#3b1728', // Dark Burgundy
    ];

    // Deterministic pseudorandom generator
    const pseudo = (seed: number) => {
      const s = Math.sin(seed * 92.8371 + 45.1932) * 43758.5453;
      return s - Math.floor(s);
    };

    const totalW = 1600;
    const totalH = 44;
    const topY = 2;
    const botY = 42;

    // We build 3 slender undulating organic boundary paths across 1600px width.
    // Level 0: top boundary (y = 2)
    // Level 1: upper wave (y ~ 14 to 18)
    // Level 2: lower wave (y ~ 26 to 30)
    // Level 3: bottom boundary (y = 42)

    const generateLevelNodes = (approxSpacing: number, seedBase: number) => {
      const nodes: { x: number; y: number }[] = [];
      let currentX = 0;
      let idx = 0;

      while (currentX < totalW) {
        nodes.push({ x: currentX, y: 0 });
        const step = approxSpacing * (0.7 + pseudo(seedBase + idx * 3.7) * 0.6);
        currentX += step;
        idx++;
      }
      nodes.push({ x: totalW, y: 0 });
      return nodes;
    };

    const l0Nodes = generateLevelNodes(28, 101).map((n) => ({ x: n.x, y: topY }));

    const l1Nodes = generateLevelNodes(26, 202).map((n, idx) => {
      const wave = Math.sin((n.x / 160) * Math.PI) * 4;
      const jY = (pseudo(idx * 7.1 + 10) - 0.5) * 4.5;
      const y = Math.max(9, Math.min(22, 15 + wave + jY));
      return { x: n.x, y };
    });

    const l2Nodes = generateLevelNodes(26, 303).map((n, idx) => {
      const wave = Math.sin((n.x / 150) * Math.PI) * 4 + Math.cos((n.x / 240) * Math.PI) * 2;
      const jY = (pseudo(idx * 8.3 + 20) - 0.5) * 4.5;
      const y = Math.max(22, Math.min(36, 29 + wave + jY));
      return { x: n.x, y };
    });

    const l3Nodes = generateLevelNodes(28, 404).map((n) => ({ x: n.x, y: botY }));

    const shardList: TileShard[] = [];
    let shardCounter = 0;

    const weaveLevels = (
      upper: { x: number; y: number }[],
      lower: { x: number; y: number }[],
      tierName: string,
      colorOffset: number
    ) => {
      let uIdx = 0;
      let lIdx = 0;

      while (uIdx < upper.length - 1 || lIdx < lower.length - 1) {
        const uCurrent = upper[uIdx];
        const uNext = upper[Math.min(uIdx + 1, upper.length - 1)];
        const lCurrent = lower[lIdx];
        const lNext = lower[Math.min(lIdx + 1, lower.length - 1)];

        // Large, dramatic scatter translations that fly in from across the page!
        const scAngle = pseudo(shardCounter * 2.3) * Math.PI * 2;
        const scDist = 180 + pseudo(shardCounter * 3.1) * 320;
        const scX = Math.cos(scAngle) * scDist;
        const scY = (pseudo(shardCounter * 4.7) - 0.5) * 280;
        const scR = (pseudo(shardCounter * 6.7) - 0.5) * 160;
        const scScale = 0.3 + pseudo(shardCounter * 1.7) * 0.9;
        const opacity = 0.86 + pseudo(shardCounter * 5.1) * 0.12;

        if (uNext.x < lCurrent.x + 6 && uIdx < upper.length - 1) {
          const p0 = `${uCurrent.x.toFixed(1)},${uCurrent.y.toFixed(1)}`;
          const p1 = `${uNext.x.toFixed(1)},${uNext.y.toFixed(1)}`;
          const p2 = `${lCurrent.x.toFixed(1)},${lCurrent.y.toFixed(1)}`;
          const color = palette[(shardCounter * 3 + colorOffset) % palette.length];

          shardList.push({
            id: `${tierName}-tu-${shardCounter++}`,
            points: `${p0} ${p1} ${p2}`,
            facetPoints: `${p0} ${p1} ${(uCurrent.x * 0.4 + lCurrent.x * 0.6).toFixed(1)},${(uCurrent.y * 0.4 + lCurrent.y * 0.6).toFixed(1)}`,
            fill: color,
            opacity,
            scatterX: scX,
            scatterY: scY,
            scatterRotate: scR,
            scatterScale: scScale,
          });
          uIdx++;
        } else if (lNext.x < uCurrent.x + 6 && lIdx < lower.length - 1) {
          const p0 = `${uCurrent.x.toFixed(1)},${uCurrent.y.toFixed(1)}`;
          const p1 = `${lNext.x.toFixed(1)},${lNext.y.toFixed(1)}`;
          const p2 = `${lCurrent.x.toFixed(1)},${lCurrent.y.toFixed(1)}`;
          const color = palette[(shardCounter * 5 + colorOffset + 1) % palette.length];

          shardList.push({
            id: `${tierName}-tl-${shardCounter++}`,
            points: `${p0} ${p1} ${p2}`,
            facetPoints: `${p0} ${(lCurrent.x * 0.5 + lNext.x * 0.5).toFixed(1)},${lCurrent.y.toFixed(1)} ${p2}`,
            fill: color,
            opacity,
            scatterX: scX,
            scatterY: scY,
            scatterRotate: scR,
            scatterScale: scScale,
          });
          lIdx++;
        } else {
          const p0 = `${uCurrent.x.toFixed(1)},${uCurrent.y.toFixed(1)}`;
          const p1 = `${uNext.x.toFixed(1)},${uNext.y.toFixed(1)}`;
          const p2 = `${lNext.x.toFixed(1)},${lNext.y.toFixed(1)}`;
          const p3 = `${lCurrent.x.toFixed(1)},${lCurrent.y.toFixed(1)}`;

          // Every ~2nd piece fractures diagonally with overlapping translucency
          const shouldFracture = pseudo(shardCounter * 7.9) > 0.4;

          if (shouldFracture) {
            const colorA = palette[(shardCounter * 3 + colorOffset) % palette.length];
            shardList.push({
              id: `${tierName}-fA-${shardCounter++}`,
              points: `${p0} ${p1} ${p3}`,
              facetPoints: `${p0} ${p1} ${(uCurrent.x * 0.5 + uNext.x * 0.5).toFixed(1)},${(uCurrent.y + 4).toFixed(1)}`,
              fill: colorA,
              opacity,
              scatterX: scX * 1.1,
              scatterY: scY * 1.1,
              scatterRotate: scR,
              scatterScale: scScale,
            });

            const colorB = palette[(shardCounter * 4 + colorOffset + 2) % palette.length];
            shardList.push({
              id: `${tierName}-fB-${shardCounter++}`,
              points: `${p1} ${p2} ${p3}`,
              facetPoints: `${p1} ${p2} ${(lCurrent.x * 0.5 + lNext.x * 0.5).toFixed(1)},${lNext.y.toFixed(1)}`,
              fill: colorB,
              opacity: opacity * 0.94,
              scatterX: -scX * 0.9,
              scatterY: -scY * 0.9,
              scatterRotate: -scR,
              scatterScale: scScale,
            });
          } else {
            const color = palette[(shardCounter * 3 + colorOffset) % palette.length];
            shardList.push({
              id: `${tierName}-q-${shardCounter++}`,
              points: `${p0} ${p1} ${p2} ${p3}`,
              facetPoints: `${p0} ${p1} ${p3}`,
              fill: color,
              opacity,
              scatterX: scX,
              scatterY: scY,
              scatterRotate: scR,
              scatterScale: scScale,
            });
          }

          if (uIdx < upper.length - 1) uIdx++;
          if (lIdx < lower.length - 1) lIdx++;
        }
      }
    };

    weaveLevels(l0Nodes, l1Nodes, 'tier0', 0);
    weaveLevels(l1Nodes, l2Nodes, 'tier1', 4);
    weaveLevels(l2Nodes, l3Nodes, 'tier2', 8);

    // Decorative broken ceramic rosettes (No white centers!)
    const rosetteList: RosetteFragment[] = [
      { cx: 140, cy: 22, r: 7.5, color: '#d79523', innerColor: '#74182a', scatterX: -260, scatterY: -140 },
      { cx: 420, cy: 21, r: 7, color: '#1a3d6f', innerColor: '#c2841b', scatterX: 300, scatterY: 150 },
      { cx: 750, cy: 23, r: 8, color: '#74182a', innerColor: '#d79523', scatterX: -190, scatterY: 180 },
      { cx: 1080, cy: 20, r: 7, color: '#1b542e', innerColor: '#bf4d28', scatterX: 250, scatterY: -160 },
      { cx: 1420, cy: 22, r: 7.5, color: '#bf4d28', innerColor: '#163761', scatterX: -320, scatterY: 120 },
    ];

    return { shards: shardList, rosettes: rosetteList };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-visible select-none my-0 py-0 z-20 ${className}`}
    >
      {/* Top Refined Gilded Relief Fillet (Seamless embossed gold, no heavy black lines) */}
      <div className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-[#dfc285] to-transparent shadow-[0_1px_3px_rgba(184,146,67,0.35)]">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#fff5df] to-transparent opacity-90" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#8c6d3b] to-transparent opacity-50" />
      </div>

      {/* Main Slender Gaudí Trencadís Mosaic Bed (Seamless dark mortar integrated with page) */}
      <div className="relative h-9 sm:h-11 md:h-12 w-full overflow-visible bg-[#1a1514] shadow-inner">
        {/* Subtle texture mortar backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#161211] via-[#1f1918] to-[#161211] opacity-95" />

        {/* Dynamic Mosaic Tiles with Page-Wide Flying Convergence Animation */}
        <svg
          viewBox="0 0 1600 44"
          className="relative z-10 w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="gaudi-mosaic-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.65" />
            </filter>
          </defs>

          {/* Broken Ceramic Shards */}
          {shards.map((shard, idx) => {
            const targetX = isInView ? 0 : shard.scatterX;
            const targetY = isInView ? 0 : shard.scatterY;
            const targetRotate = isInView ? 0 : shard.scatterRotate;
            const targetScale = isInView ? 1 : shard.scatterScale;
            const targetOpacity = isInView ? shard.opacity : 0;

            return (
              <motion.g
                key={shard.id}
                initial={{
                  x: shard.scatterX,
                  y: shard.scatterY,
                  rotate: shard.scatterRotate,
                  scale: shard.scatterScale,
                  opacity: 0,
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale,
                  opacity: targetOpacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 95,
                  damping: 15,
                  mass: 0.65,
                  delay: (idx % 20) * 0.012,
                }}
                whileHover={{
                  scale: 1.08,
                  filter: 'brightness(1.2)',
                  cursor: 'pointer',
                }}
                className="transition-all"
              >
                {/* Base Glazed Ceramic Polygon */}
                <polygon
                  points={shard.points}
                  fill={shard.fill}
                  fillOpacity={shard.opacity}
                  stroke="#140f0e"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  filter="url(#gaudi-mosaic-glow)"
                />

                {/* Overlapping Glazed Specular Facet */}
                {shard.facetPoints && (
                  <polygon
                    points={shard.facetPoints}
                    fill="#dfc285"
                    opacity="0.18"
                    className="pointer-events-none"
                  />
                )}
              </motion.g>
            );
          })}

          {/* Authentic Gaudí Rosette Accents */}
          {rosettes.map((rosette, rIdx) => (
            <motion.g
              key={`rosette-${rIdx}`}
              initial={{
                x: rosette.scatterX,
                y: rosette.scatterY,
                scale: 0.2,
                opacity: 0,
              }}
              animate={{
                x: isInView ? 0 : rosette.scatterX,
                y: isInView ? 0 : rosette.scatterY,
                scale: isInView ? 1 : 0.2,
                opacity: isInView ? 1 : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 14,
                delay: 0.15 + rIdx * 0.04,
              }}
            >
              <circle
                cx={rosette.cx}
                cy={rosette.cy}
                r={rosette.r}
                fill={rosette.color}
                stroke="#140f0e"
                strokeWidth="1.5"
                filter="url(#gaudi-mosaic-glow)"
              />
              <circle
                cx={rosette.cx}
                cy={rosette.cy}
                r={rosette.r * 0.52}
                fill={rosette.innerColor}
                stroke="#140f0e"
                strokeWidth="1.1"
              />
              <circle
                cx={rosette.cx}
                cy={rosette.cy}
                r={rosette.r * 0.2}
                fill="#d79523"
                opacity="0.9"
              />
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Bottom Refined Gilded Relief Fillet (Seamless embossed gold, no heavy black lines) */}
      <div className="relative w-full h-[3px] bg-gradient-to-r from-transparent via-[#b89243] to-transparent shadow-[0_1px_3px_rgba(184,146,67,0.35)]">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#8c6d3b] to-transparent opacity-50" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#fff5df] to-transparent opacity-90" />
      </div>
    </div>
  );
}
