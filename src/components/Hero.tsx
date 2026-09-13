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
      <img
        src="/photos/sunset.webp"
        alt={lang === 'es' ? 'Belén y Oriol caminando de la mano por la playa al atardecer' : 'Belén and Oriol walking hand in hand on the beach at sunset'}
        fetchPriority="high"
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow">Salamanca · {numericDate}</p>
        <h1>Belén <em>&</em> Oriol</h1>
        <p>Castillo del Buen Amor</p>
      </div>
      <div className="hero-bottom">
        <span>{footerDate}</span>
        <button onClick={() => onNavigate('story')}>{lang === 'es' ? 'Ver detalles' : 'View details'} ↓</button>
      </div>
    </section>
  );
}
