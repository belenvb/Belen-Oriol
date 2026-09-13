import { Language } from '../types';
export function StorySection({lang}: {lang: Language}) {
 return <section id="story" className="story-section">
  <div className="story-copy"><p className="eyebrow">01 / {lang === 'es' ? 'Belén & Oriol' : 'Belén & Oriol'}</p><h2>{lang === 'es' ? <>De Barcelona<br/>a <em>Salamanca.</em></> : <>From Barcelona<br/>to <em>Salamanca.</em></>}</h2><p>{lang === 'es' ? 'La boda será en el Castillo del Buen Amor, a las afueras de Salamanca. En esta página encontrarás el programa, viaje, alojamiento y RSVP.' : 'The wedding will take place at Castillo del Buen Amor, just outside Salamanca. This page includes the schedule, travel, accommodation and RSVP details.'}</p><a href="#schedule" className="editorial-link">{lang === 'es' ? 'Ver programa' : 'View schedule'} ↗</a></div>
  <figure><img src="/photos/night.webp" alt={lang === 'es' ? 'Belén y Oriol bajo las luces de la noche' : 'Belén and Oriol beneath the evening lights'} loading="lazy" width="800" height="1422"/></figure>
 </section>;
}
