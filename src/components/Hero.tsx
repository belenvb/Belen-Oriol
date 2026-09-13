import { Language } from '../types';

interface HeroProps {
  lang: Language;
  onNavigate: (id: string) => void;
}

export function Hero({ lang, onNavigate }: HeroProps) {
  const numericDate = lang === 'es' ? '04.09.2027' : '09.04.2027';
  const footerDate = lang === 'es' ? '03—04 · 09 · 2027' : '09 · 03—04 · 2027';

  return (
    <section id="hero" className="editorial-hero">
      <div className="hero-fixed-photo" aria-hidden="true">
        <img src="/photos/sunset.webp" alt="" fetchPriority="high" />
        <div className="hero-shade" />
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Salamanca · {numericDate}</p>
        <h1>Belén <em>&</em> Oriol</h1>
        <p>Castillo del Buen Amor</p>
      </div>

      <div className="hero-bottom">
        <span>{footerDate}</span>
        <button className="hero-discover-button" onClick={() => onNavigate('story')}>
          <span className="hero-light-symbol" aria-hidden="true" />
          {lang === 'es' ? 'Desliza para descubrir' : 'Swipe to discover'}
        </button>
      </div>
    </section>
  );
}
