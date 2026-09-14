import { Language } from '../types';
import boLogo from '../assets/images/bo-logo.png';

interface FooterProps {
  lang: Language;
  onNavigate?: (sectionId: string) => void;
}

export function Footer({ lang }: FooterProps) {
  const numericDate = lang === 'es' ? '04.09.2027' : '09.04.2027';
  return (
    <footer className="wedding-footer text-[#f4ede2] text-center relative">
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
      <div className="footer-signature">
        {/* Small, transparent BO Monogram */}
        <div className="footer-signature-mark">
          <span
            className="footer-bo-gold"
            role="img"
            aria-label="Belén & Oriol"
            style={{ maskImage: `url(${boLogo})`, WebkitMaskImage: `url(${boLogo})` }}
          />
        </div>

        {/* Date */}
        <p className="footer-signature-date">
          {numericDate}
        </p>
      </div>
    </footer>
  );
}

