import { StoryJourney } from './StoryJourney';
import { Language } from '../types';
export function StorySection({lang}: {lang: Language}) {
 return <section id="story" className="story-section">
  <div className="story-copy"><p className="eyebrow">01 / {lang === 'es' ? 'Belén & Oriol' : 'Belén & Oriol'}</p><h2>{lang === 'es' ? <>De Barcelona<br/>a <em>Salamanca.</em></> : <>From Barcelona<br/>to <em>Salamanca.</em></>}</h2><p>{lang === 'es' ? 'Nos conocimos en Lancaster a través de una amiga en común. Oriol vivía en el condado Amish desde 2018 por trabajo y Belén estaba en Boston. Empezamos a hablar, llegaron varias visitas a Boston y, después de un viaje juntos, empezamos a salir. Luego nos tocó una temporada a distancia: Oriol tuvo que volver a España por el visado y Belén se quedó en Estados Unidos. Más tarde, Belén se mudó a Pennsylvania y, desde 2024, estamos de nuevo en Boston.' : 'We met in Lancaster through a mutual friend. Oriol had been living in Amish country for work since 2018, while Belén was in Boston. We kept talking, Oriol visited Boston several times, and after a trip together, we started dating. Then came a stretch of long distance: Oriol had to return to Spain because of his visa, while Belén stayed in the US. Belén later moved to Pennsylvania, and since 2024 we have been back in Boston together.'}</p><a href="#schedule" className="editorial-link">{lang === 'es' ? 'Ver programa' : 'View schedule'} ↗</a></div>
  <figure className="story-night"><img src="/photos/night.webp" alt={lang === 'es' ? 'Belén y Oriol bajo las luces de la noche' : 'Belén and Oriol beneath the evening lights'} loading="lazy" width="800" height="1422"/></figure>
  <StoryJourney lang={lang}/>
 </section>;
}

