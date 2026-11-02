import type { Language } from '../types';
import { StoryJourney } from './StoryJourney';
import './StoryEditorial.css';

// Keep the couple's original wording in both languages; only paragraph breaks change.
const story = {
  es: [
    'Nos conocimos en Lancaster a través de una amiga en común. Oriol vivía en el condado Amish desde 2018 por trabajo y Belén estaba en Boston.',
    'Empezamos a hablar, llegaron varias visitas a Boston y, después de un viaje juntos, empezamos a salir.',
    'Luego nos tocó una temporada a distancia: Oriol tuvo que volver a España por el visado y Belén se quedó en Estados Unidos. Más tarde, Belén se mudó a Pennsylvania y, desde 2024, estamos de nuevo en Boston.',
  ],
  en: [
    'We met in Lancaster through a mutual friend. Oriol had been living in Amish country for work since 2018, while Belén was in Boston.',
    'We kept talking, Oriol visited Boston several times, and after a trip together, we started dating.',
    'Then came a stretch of long distance: Oriol had to return to Spain because of his visa, while Belén stayed in the US. Belén later moved to Pennsylvania, and since 2024 we have been back in Boston together.',
  ],
};

export function StorySection({ lang }: { lang: Language }) {
  const es = lang === 'es';
  return (
    <section id="story" className="story-editorial" aria-labelledby="our-story-title">
      <div className="story-editorial__layout">
        <div className="story-editorial__collage">
          <div className="story-editorial__paper" aria-hidden="true" />
          <figure className="story-editorial__portrait">
            <img src="/photos/night.webp" alt={es ? 'Belén y Oriol bajo las luces de la noche' : 'Belén and Oriol beneath the evening lights'} loading="lazy" width="1125" height="2000" />
            <figcaption>Belén &amp; Oriol</figcaption>
          </figure>
          <StoryJourney lang={lang} />
        </div>
        <div className="story-editorial__copy">
          <p className="story-editorial__eyebrow">01 / Belén &amp; Oriol</p>
          <h2 id="our-story-title">{es ? <>Nuestra<br /><em>historia.</em></> : <>Our<br /><em>story.</em></>}</h2>
          <p className="story-editorial__subtitle">{es ? 'De España a Boston.' : 'From Spain to Boston.'}</p>
          <div className="story-editorial__prose">{story[lang].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          <a href="#schedule" className="story-editorial__link">{es ? 'Ver programa' : 'View schedule'} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}
