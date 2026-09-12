interface MonogramProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'burgundy' | 'white' | 'dark';
}

export function Monogram({ className = '', size = 56 }: MonogramProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Monograma Belén & Oriol — Salamanca & Barcelona"
    >
      <img
        src="/bo_monogram.png"
        alt="Monograma BO — Belén & Oriol"
        className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105"
        loading="eager"
        onError={(e) => {
          // Fallback to jpg if png has issue
          const target = e.currentTarget as HTMLImageElement;
          if (!target.src.endsWith('bo_monogram.jpg')) {
            target.src = '/bo_monogram.jpg';
          }
        }}
      />
    </div>
  );
}

