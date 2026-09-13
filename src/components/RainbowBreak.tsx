import { Language } from '../types';

export function RainbowBreak({ lang }: { lang: Language }) {
  return (
    <section className="rainbow-break" aria-label={lang === 'es' ? 'Foto en Islandia' : 'Photo in Iceland'}>
      <img src="/photos/rainbow.svg" alt={lang === 'es' ? 'Belén y Oriol bajo un arcoíris en Islandia' : 'Belén and Oriol beneath a rainbow in Iceland'} loading="lazy" />
      <div className="rainbow-label">ICELAND · 2024</div>
    </section>
  );
}
