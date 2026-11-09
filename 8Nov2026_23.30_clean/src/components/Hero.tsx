import { Language } from '../types';

interface HeroProps {
  lang: Language;
  onNavigate: (id: string) => void;
}

export function Hero({ lang, onNavigate }: HeroProps) {


  return (
    <section id="hero" className="editorial-hero parallax-photo-section">
      <div className="hero-fixed-photo" aria-hidden="true">
        <img src="/photos/sunset.webp" alt="" fetchPriority="high" />
        <div className="hero-shade" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">{lang === 'es' ? 'Celebramos nuestra boda' : 'Celebrating our wedding'}</p>
        <h1>Belén <em>&</em> Oriol</h1>
      </div>

      <div className="hero-details">
        <p className="hero-venue-line">Castillo del Buen Amor · Salamanca</p>
        <p className="hero-date-long">{lang === 'es' ? '04 septiembre 2027' : 'September 4, 2027'}</p>
      </div>

      <button className="hero-discover" onClick={() => onNavigate('story')}>
        <span>{lang === 'es' ? 'Descubrir' : 'Discover'}</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}
