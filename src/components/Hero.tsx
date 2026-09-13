import { Language } from '../types';

interface HeroProps {
  lang: Language;
  onNavigate: (id: string) => void;
}

export function Hero({ lang, onNavigate }: HeroProps) {
  const numericDate = lang === 'es' ? '04.09.2027' : '09.04.2027';

  return (
    <section id="hero" className="editorial-hero parallax-photo-section">
      <div className="hero-fixed-photo" aria-hidden="true">
        <img src="/photos/sunset.webp" alt="" fetchPriority="high" />
        <div className="hero-shade" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Salamanca · {numericDate}</p>
        <h1>Belén <em>&</em> Oriol</h1>
        <p>Castillo del Buen Amor</p>
      </div>

      <button className="hero-discover" onClick={() => onNavigate('story')}>
        <span>{lang === 'es' ? 'Descubrir' : 'Discover'}</span>
        <i aria-hidden="true" />
      </button>
    </section>
  );
}
