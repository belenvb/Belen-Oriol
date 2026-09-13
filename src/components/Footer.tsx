import { Language } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate?: (sectionId: string) => void;
}

export function Footer({ lang }: FooterProps) {
  const numericDate = lang === 'es' ? '04.09.2027' : '09.04.2027';
  return (
    <footer className="bg-[#1f1917] text-[#f4ede2] text-center relative border-t border-[#b89243]/30">
      <div className="closing-photo closing-photo-fullbleed">
        <img src="/photos/coast.webp" loading="lazy" alt={lang === 'es' ? 'Belén y Oriol junto al mar' : 'Belén and Oriol by the sea'} />
        <div>
          <p className="eyebrow">{numericDate}</p>
          <h2>Castillo del Buen Amor</h2>
        </div>
      </div>

      <div className="footer-signature max-w-4xl mx-auto flex flex-col items-center px-4 pb-7">
        <p className="font-cormorant text-sm sm:text-base text-[#dfc285] tracking-wide mb-2">
          Salamanca · {lang === 'es' ? '3 & 4 de septiembre de 2027' : 'September 3 & 4, 2027'}
        </p>
      </div>
    </footer>
  );
}
