import { Language } from '../types';
import boLogo from '../assets/images/bo-logo.png';

interface FooterProps {
  lang: Language;
  onNavigate?: (sectionId: string) => void;
}

export function Footer({ lang, onNavigate }: FooterProps) {
  const es = lang === 'es';
  const numericDate = es ? '04 · 09 · 2027' : '09 · 04 · 2027';

  return (
    <footer className="wedding-footer-cinematic" aria-label={es ? 'Cierre' : 'Closing'}>
      <section className="footer-parallax-panel">
        <div className="footer-fixed-photo" aria-hidden="true">
          <img
            src="/photos/rainbow-parallax.webp"
            alt=""
            loading="lazy"
          />
          <div className="footer-photo-shade" />
        </div>

        <div className="footer-closing-copy">
          <p className="footer-script">
            {es ? 'Gracias por ser parte de esta historia' : 'Thank you for being part of our story'}
          </p>
        </div>
      </section>

      <section className="footer-signature-panel">
        <img
          className="footer-bo-logo"
          src={boLogo}
          alt="Belén & Oriol"
          loading="lazy"
        />

        <p className="footer-date">{numericDate}</p>

        <p className="footer-location">
          Castillo del Buen Amor<br />
          Salamanca
        </p>

        <nav className="footer-nav" aria-label={es ? 'Enlaces finales' : 'Footer links'}>
          <button type="button" onClick={() => onNavigate?.('rsvp')}>
            RSVP
          </button>
          <span aria-hidden="true">|</span>
          <button type="button" onClick={() => onNavigate?.('faq')}>
            {es ? 'Preguntas frecuentes' : 'FAQ'}
          </button>
        </nav>
      </section>
    </footer>
  );
}
