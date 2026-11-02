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
        <p className="eyebrow">SAVE THE DATE</p>
        <h1>Belén <em>&</em> Oriol</h1>
        <p className="hero-venue-line">Castillo del Buen Amor · Salamanca</p>
        <p className="hero-date-long">{lang === 'es' ? '04 septiembre 2027' : 'September 4, 2027'}</p>
        <nav className="hero-quick-links" aria-label={lang === 'es' ? 'Organiza tu visita' : 'Plan your visit'}>
          <button onClick={() => onNavigate('schedule')}>{lang === 'es' ? 'El programa' : 'The schedule'}</button>
          <button onClick={() => onNavigate('journey')}>{lang === 'es' ? 'Viaje y estancia' : 'Travel & stay'}</button>
          <button onClick={() => onNavigate('rsvp')}>{lang === 'es' ? 'Confirmar asistencia' : 'RSVP'} <span aria-hidden="true">↗</span></button>
        </nav>
      </div>

      <button className="hero-discover" onClick={() => onNavigate('story')}>
        <span>{lang === 'es' ? 'Descubrir' : 'Discover'}</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}
