import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate?: (sectionId: string) => void;
}

export function Footer({ lang }: FooterProps) {
  const numericDate = lang === 'es' ? '04.09.2027' : '09.04.2027';
  return (
    <footer className="bg-[#1a1413] text-[#f4ede2] text-center relative border-t border-[#b89243]/30">
      {/* Full-bleed closing rainbow photo with no text overlay */}
      <div className="closing-photo closing-photo-fullbleed relative overflow-hidden">
        <img
          src="/photos/rainbow-parallax.webp"
          loading="lazy"
          alt={lang === 'es' ? 'Belén y Oriol' : 'Belén & Oriol'}
          className="w-full h-full object-cover object-center block"
        />
      </div>

      {/* Elegant, minimalist Footer */}
      <div className="py-10 sm:py-14 px-6 max-w-xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Small, transparent BO Monogram */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 mb-4 flex items-center justify-center">
          <img
            className="w-full h-full object-contain filter brightness-110 drop-shadow-sm"
            src="/bo_monogram.png"
            alt="BO Monogram"
            loading="lazy"
          />
        </div>

        {/* Date */}
        <p className="font-cinzel text-xs sm:text-sm text-[#dfc285] tracking-[0.3em] uppercase font-bold">
          {numericDate}
        </p>
      </div>
    </footer>
  );
}
