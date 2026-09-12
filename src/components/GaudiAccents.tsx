import { motion } from 'motion/react';

interface GaudiDividerProps {
  className?: string;
  variant?: 'iron' | 'mosaic' | 'arch';
}

/**
 * Gaudí Modernist Forged-Iron & Mosaic Flourish
 * Inspired by the sinuous, botanical ironwork of Casa Batlló, Casa Milà & Parc Güell
 */
export function GaudiModernistDivider({ className = '', variant = 'iron' }: GaudiDividerProps) {
  if (variant === 'mosaic') {
    return (
      <div className={`flex items-center justify-center gap-3 my-4 select-none ${className}`}>
        {/* Left sinuous iron vine */}
        <svg viewBox="0 0 120 24" className="w-24 sm:w-32 h-6 text-[#8c6d4f] opacity-75 overflow-visible" fill="none">
          <path
            d="M 0 12 C 30 12, 45 4, 75 14 C 95 20, 105 12, 120 12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M 50 10 C 58 4, 66 8, 62 14"
            stroke="#5c141e"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="25" cy="12" r="2" fill="#b89243" />
          <circle cx="85" cy="15" r="2.2" fill="#5c141e" />
        </svg>

        {/* Central Gaudí Trencadís Mosaic Rosette */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full p-[2px] bg-gradient-to-br from-[#dfc285] via-[#5c141e] to-[#b89243] shadow-md flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" className="w-full h-full rounded-full bg-[#181514] overflow-hidden">
            {/* Miniature irregular mosaic shards */}
            <polygon points="16,2 26,8 16,16" fill="#74182a" stroke="#161312" strokeWidth="1" />
            <polygon points="26,8 30,20 16,16" fill="#d79523" stroke="#161312" strokeWidth="1" />
            <polygon points="30,20 22,30 16,16" fill="#1b542e" stroke="#161312" strokeWidth="1" />
            <polygon points="22,30 10,30 16,16" fill="#1a3d6f" stroke="#161312" strokeWidth="1" />
            <polygon points="10,30 2,20 16,16" fill="#bf4d28" stroke="#161312" strokeWidth="1" />
            <polygon points="2,20 6,8 16,16" fill="#eee5d6" stroke="#161312" strokeWidth="1" />
            <polygon points="6,8 16,2 16,16" fill="#532d43" stroke="#161312" strokeWidth="1" />
            {/* Center glaze pearl */}
            <circle cx="16" cy="16" r="3.2" fill="#f5ede0" stroke="#74182a" strokeWidth="1" />
          </svg>
        </div>

        {/* Right sinuous iron vine (mirrored) */}
        <svg viewBox="0 0 120 24" className="w-24 sm:w-32 h-6 text-[#8c6d4f] opacity-75 overflow-visible scale-x-[-1]" fill="none">
          <path
            d="M 0 12 C 30 12, 45 4, 75 14 C 95 20, 105 12, 120 12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M 50 10 C 58 4, 66 8, 62 14"
            stroke="#5c141e"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle cx="25" cy="12" r="2" fill="#b89243" />
          <circle cx="85" cy="15" r="2.2" fill="#5c141e" />
        </svg>
      </div>
    );
  }

  // Classic Gaudí Modernist Forged Iron Arch Divider
  return (
    <div className={`flex items-center justify-center gap-2 my-4 select-none ${className}`}>
      <svg viewBox="0 0 340 32" className="w-full max-w-xs sm:max-w-sm h-7 overflow-visible text-[#8c6d4f]" fill="none">
        {/* Parabolic wave line */}
        <path
          d="M 10 16 C 50 8, 80 24, 120 16 C 150 10, 160 6, 170 6 C 180 6, 190 10, 220 16 C 260 24, 290 8, 330 16"
          stroke="#b89243"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {/* Upper Moderniste organic loops */}
        <path
          d="M 90 18 C 105 10, 115 12, 110 22 C 105 28, 92 24, 98 16"
          stroke="#5c141e"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M 250 18 C 235 10, 225 12, 230 22 C 235 28, 248 24, 242 16"
          stroke="#5c141e"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Central Crown & Jewel */}
        <circle cx="170" cy="6" r="3.2" fill="#5c141e" stroke="#dfc285" strokeWidth="1.2" />
        <circle cx="158" cy="8" r="2" fill="#b89243" />
        <circle cx="182" cy="8" r="2" fill="#b89243" />
        {/* Terminal leaves */}
        <path d="M 14 16 C 20 12, 26 14, 22 20 Z" fill="#265b40" opacity="0.8" />
        <path d="M 326 16 C 320 12, 314 14, 318 20 Z" fill="#265b40" opacity="0.8" />
      </svg>
    </div>
  );
}

/**
 * Gaudí Catenary / Parabolic Arch Frame Decorator
 * Surrounds cards or images with a subtle Catalan Modernist parabolic arch
 */
export function GaudiParabolicHeader({
  subtitle,
  title,
  lang,
}: {
  subtitle?: string;
  title: string;
  lang: 'es' | 'en';
}) {
  return (
    <div className="text-center relative max-w-2xl mx-auto mb-8 sm:mb-12">
      {/* Subtle Gaudí parabolic arch background motif */}
      <div className="absolute inset-0 -top-6 flex items-center justify-center pointer-events-none opacity-15">
        <svg viewBox="0 0 200 120" className="w-56 h-32" fill="none">
          <path
            d="M 10 110 C 10 30, 70 10, 100 10 C 130 10, 190 30, 190 110"
            stroke="#5c141e"
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>
      </div>

      {subtitle && (
        <span className="text-[11px] tracking-[0.32em] uppercase text-[#5c141e] font-semibold block mb-2 relative z-10">
          {subtitle}
        </span>
      )}

      <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight relative z-10">
        {title}
      </h2>

      <GaudiModernistDivider variant="mosaic" className="mt-3" />
    </div>
  );
}
