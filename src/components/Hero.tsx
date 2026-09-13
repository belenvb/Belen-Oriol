import { Language } from '../types';
interface HeroProps { lang: Language; onNavigate: (id: string) => void }
export function Hero({lang,onNavigate}: HeroProps) {
 return <section id="hero" className="editorial-hero">
  <img src="/photos/sunset.webp" alt={lang === 'es' ? 'Belén y Oriol caminando de la mano por la playa al atardecer' : 'Belén and Oriol walking hand in hand on the beach at sunset'} fetchPriority="high" />
  <div className="hero-shade" />
  <div className="hero-copy"><p className="eyebrow">Salamanca · 04.09.2027</p><h1>Belén <em>&</em> Oriol</h1><p>Castillo del Buen Amor</p></div>
  <div className="hero-bottom"><span>03—04 · 09 · 2027</span><button onClick={()=>onNavigate('story')}>{lang === 'es' ? 'Ver detalles' : 'View details'} ↓</button></div>
 </section>;
}
