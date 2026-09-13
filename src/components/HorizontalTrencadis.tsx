import { useMemo } from 'react';

interface HorizontalTrencadisProps {
  className?: string;
}

interface TileShard {
  id: string;
  points: string;
  fill: string;
  opacity: number;
}

export function HorizontalTrencadis({ className = '' }: HorizontalTrencadisProps) {
  // Pure Gaudí & Catalan Modernist ceramic palette
  const shards = useMemo(() => {
    const palette = [
      '#9e162f', // Vivid Wine Ruby
      '#ec9d12', // Brilliant Salamanca Ochre Gold
      '#1b7e3e', // Luminous Emerald
      '#1958aa', // Intense Mediterranean Cobalt
      '#e35520', // Vibrant Terracotta Orange
      '#752054', // Rich Royal Plum
      '#e89b14', // Luminous Catalan Amber
      '#20884e', // Deep Vivid Emerald
      '#184fa6', // Vibrant Ultramarine Lapis
      '#cc3a1c', // Vivid Warm Paprika
      '#8c142b', // Deep Glowing Wine
      '#355268', // Deep Teal Ceramic
      '#efab17', // Saturated Gold Ochre
      '#4d1434', // Rich Burgundy Plum
    ];

    // Deterministic pseudorandom generator
    const pseudo = (seed: number) => {
      const s = Math.sin(seed * 92.8371 + 45.1932) * 43758.5453;
      return s - Math.floor(s);
    };

    const totalW = 1600;
    const topY = 2;
    const botY = 42;

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

        const opacity = 0.9 + pseudo(shardCounter * 5.1) * 0.1;

        if (uNext.x < lCurrent.x + 6 && uIdx < upper.length - 1) {
          const p0 = `${uCurrent.x.toFixed(1)},${uCurrent.y.toFixed(1)}`;
          const p1 = `${uNext.x.toFixed(1)},${uNext.y.toFixed(1)}`;
          const p2 = `${lCurrent.x.toFixed(1)},${lCurrent.y.toFixed(1)}`;
          const color = palette[(shardCounter * 3 + colorOffset) % palette.length];

          shardList.push({
            id: `${tierName}-tu-${shardCounter++}`,
            points: `${p0} ${p1} ${p2}`,
            fill: color,
            opacity,
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
            fill: color,
            opacity,
          });
          lIdx++;
        } else {
          const p0 = `${uCurrent.x.toFixed(1)},${uCurrent.y.toFixed(1)}`;
          const p1 = `${uNext.x.toFixed(1)},${uNext.y.toFixed(1)}`;
          const p2 = `${lNext.x.toFixed(1)},${lNext.y.toFixed(1)}`;
          const p3 = `${lCurrent.x.toFixed(1)},${lCurrent.y.toFixed(1)}`;

          const shouldFracture = pseudo(shardCounter * 7.9) > 0.4;

          if (shouldFracture) {
            const colorA = palette[(shardCounter * 3 + colorOffset) % palette.length];
            shardList.push({
              id: `${tierName}-fA-${shardCounter++}`,
              points: `${p0} ${p1} ${p3}`,
              fill: colorA,
              opacity,
            });

            const colorB = palette[(shardCounter * 4 + colorOffset + 2) % palette.length];
            shardList.push({
              id: `${tierName}-fB-${shardCounter++}`,
              points: `${p1} ${p2} ${p3}`,
              fill: colorB,
              opacity: opacity * 0.95,
            });
          } else {
            const color = palette[(shardCounter * 3 + colorOffset) % palette.length];
            shardList.push({
              id: `${tierName}-q-${shardCounter++}`,
              points: `${p0} ${p1} ${p2} ${p3}`,
              fill: color,
              opacity,
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

    return shardList;
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden select-none my-0 py-0 z-20 ${className}`}
    >
      {/* Top Architectural Border */}
      <div className="relative w-full h-[1.5px] bg-[#2d221f]" />

      {/* Main Gaudí Trencadís Mosaic Bed (Stable, matte, zero-flash ceramic bed) */}
      <div className="relative h-9 sm:h-11 md:h-12 w-full overflow-hidden bg-[#161211]">
        <div className="absolute inset-0 bg-[#161211]" />

        {/* Stable authentic SVG ceramic mosaic with dark mortar lines */}
        <svg
          viewBox="0 0 1600 44"
          className="relative z-10 w-full h-full"
          preserveAspectRatio="none"
        >
          {shards.map((shard) => (
            <polygon
              key={shard.id}
              points={shard.points}
              fill={shard.fill}
              fillOpacity={shard.opacity}
              stroke="#140f0e"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>

      {/* Bottom Architectural Border */}
      <div className="relative w-full h-[1.5px] bg-[#2d221f]" />
    </div>
  );
}
