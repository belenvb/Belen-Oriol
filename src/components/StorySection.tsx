import { Language } from '../types';
export function StorySection({lang}: {lang: Language}) {
 return <section id="story" className="story-section">
  <div className="story-copy"><p className="eyebrow">01 / {lang === 'es' ? 'Nosotros, con vosotros' : 'Together, with you'}</p><h2>{lang === 'es' ? <>Todos los caminos<br/>nos traen <em>aquí.</em></> : <>Every road<br/>leads us <em>here.</em></>}</h2><p>{lang === 'es' ? 'Después de tantos viajes, un destino para compartir con quienes más queremos. Nos vemos en Salamanca para celebrar todo lo que viene.' : 'After so many journeys, a destination to share with the people we love. Meet us in Salamanca to celebrate everything that comes next.'}</p><a href="#schedule" className="editorial-link">{lang === 'es' ? 'Nuestro fin de semana' : 'Our wedding weekend'} ↗</a></div>
  <figure><img src="/photos/night.webp" alt={lang === 'es' ? 'Belén y Oriol bajo las luces de la noche' : 'Belén and Oriol beneath the evening lights'} loading="lazy" width="800" height="1422"/><figcaption>{lang === 'es' ? 'Y que sigan las noches así.' : 'Here’s to more nights like these.'}</figcaption></figure>
 </section>;
}
