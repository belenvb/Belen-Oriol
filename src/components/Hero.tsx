import { Language } from '../types';
import './HeroDetails.css';

interface HeroProps {
  lang: Language;
  onNavigate: (id: string) => void;
}

export function Hero({ lang, onNavigate }: HeroProps) {


  return (
    <section id="hero" className="editorial-hero parallax-photo-section">
      <div className="hero-portrait">
      <div className="hero-fixed-photo" aria-hidden="true">
        <img src="/photos/sunset.webp" alt="" fetchPriority="high" />
        <div className="hero-shade" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">{lang === 'es' ? 'Celebramos nuestra boda' : 'Celebrating our wedding'}</p>
        <h1>Belén <em>&</em> Oriol</h1>
      </div>

      </div>

      <div className="hero-details">
        <p className="hero-venue-line">Castillo del Buen Amor · Salamanca · {lang === 'es' ? 'España' : 'Spain'}</p>
        <p className="hero-date-long">{lang === 'es' ? '4 de septiembre de 2027' : 'September 4, 2027'}</p>
        <button type="button" className="hero-rsvp" onClick={() => onNavigate('rsvp')}>
          {lang === 'es' ? 'RSVP · Confirmar asistencia' : 'RSVP · Confirm attendance'}
        </button>
      </div>

      <button className="hero-discover" onClick={() => onNavigate('story')}>
        <span>{lang === 'es' ? 'Descubrir' : 'Discover'}</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}
