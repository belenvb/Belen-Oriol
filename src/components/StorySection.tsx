import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import type { Language } from '../types';
import './StoryEditorial.css';

const story = {
  es: [
    'Mientras el mundo estaba patas arriba por la pandemia, nuestros amigos Gemma y Marco decidieron presentar a una salmantina que vivía en Boston y a un barcelonés perdido entre los Amish de Pensilvania. Lo que empezó como una visita entre amigos terminó en muchos viajes… ¡y en una historia de amor!',
    'Poco después llegó Totò, un conejo que se convirtió en el tercer miembro de la familia. Tras incontables viajes entre Boston y Pensilvania, Belén acabó mudándose allí en 2022. Pero aquel verano, los líos de visados obligaron a Oriol a volver a España, con el Atlántico de por medio.',
    'Oriol regresó en 2023, aunque esta vez fue Belén quien no pudo salir de Estados Unidos durante una temporada. Finalmente, en 2024, los tres volvimos a Boston, desde donde seguimos recorriendo el mundo siempre que podemos.',
    'Ahora, siete años después y tras más obstáculos de los previstos, ¡por fin ha llegado el momento de celebrarlo por todo lo alto con nuestra familia y amigos!',
  ],
  en: [
    'While the world was turned upside down by the pandemic, our friends Gemma and Marco decided to introduce a woman from Salamanca living in Boston to a man from Barcelona lost among the Amish of Pennsylvania. What started as a visit between friends turned into countless trips… and a love story!',
    'Soon after came Totò, a bunny who became the third member of our family. After countless journeys between Boston and Pennsylvania, Belén finally moved there in 2022. But that summer, visa complications forced Oriol to return to Spain, with the Atlantic between us.',
    'Oriol returned in 2023, although this time Belén was unable to leave the United States for a while. Finally, in 2024, the three of us moved back to Boston, from where we continue exploring the world whenever we can.',
    'Now, seven years later, and after more obstacles than we ever expected, the time has finally come to celebrate in style with our family and friends!',
  ],
};

const photographs = [
  { id: '19', es: 'Belén y Oriol en Islandia, junto al cañón de basalto', en: 'Belén and Oriol in Iceland, beside the basalt canyon', name: 'Islandia', nameEn: 'Iceland' },
  { id:'memory-boston', width:1350, height:1800, es:'Belén y Oriol junto al puerto de Boston', en:'Belén and Oriol beside Boston harbor', name:'Boston', nameEn:'Boston' },
  { id: 'memory-hawaii', width:2000, height:1500, es:'Belén y Oriol al atardecer en Hawaii', en:'Belén and Oriol at sunset in Hawaii', name:'Hawaii', nameEn:'Hawaii' },
  {"id": "memory-1", "width": 1200, "height": 1600, "es": "Belén y Oriol sonriendo en un restaurante", "en": "Belén and Oriol smiling in a restaurant", "name": "Navidad en París", "nameEn": "Christmas in Paris"},
  {"id": "memory-2", "width": 900, "height": 1600, "es": "Belén a la espalda de Oriol en casa", "en": "Belén on Oriol’s back at home", "name": "Así somos", "nameEn": "This is us"},
  {"id": "memory-3", "width": 1800, "height": 1013, "es": "Belén y Oriol junto al cartel Hola Amigos", "en": "Belén and Oriol beside the Hola Amigos sign", "name": "New York", "nameEn": "New York"},
  {"id": "memory-4", "width": 1012, "height": 1800, "es": "Belén y Oriol bajo una guirnalda de luces", "en": "Belén and Oriol beneath string lights", "name": "Noches juntos, Lancaster", "nameEn": "Nights together, Lancaster"},
  {"id": "memory-5", "width": 559, "height": 994, "es": "Belén y Oriol junto a la escultura I love you en el bosque", "en": "Belén and Oriol beside the I love you sculpture in the woods", "name": "I love you", "nameEn": "I love you"},
  {"id": "memory-6", "width": 1625, "height": 914, "es": "Belén y Oriol frente a una cueva rodeada de vegetación", "en": "Belén and Oriol in front of a cave surrounded by greenery", "name": "De aventura", "nameEn": "On an adventure"},
  { id:'memory-jurassic', width:1448, height:1086, es:'Belén y Oriol junto a un dinosaurio de Jurassic Park', en:'Belén and Oriol beside a Jurassic Park dinosaur', name:'Jurassic Park', nameEn:'Jurassic Park' },
  { id:'memory-rocky', width:1012, height:1800, es:'Belén y Oriol junto a la estatua de Rocky, con los brazos levantados', en:'Belén and Oriol beside the Rocky statue, with their arms raised', name:'Rocky, Filadelfia', nameEn:'Rocky, Philadelphia' },
  { id:'memory-cave', width:1767, height:994, es:'Belén y Oriol explorando una cueva con cascos y linternas', en:'Belén and Oriol exploring a cave with helmets and headlamps', name:'Bajo tierra', nameEn:'Underground' },
  { id:'memory-toto', width:1800, height:1013, es:'Belén y Oriol en casa con Totò', en:'Belén and Oriol at home with Totò', name:'Los tres', nameEn:'The three of us' },
  { id:'memory-ocean', width:1800, height:1012, es:'Belén y Oriol en un mirador sobre el océano', en:'Belén and Oriol at a viewpoint above the ocean', name:'Con vistas al mar', nameEn:'An ocean view' },
  { id:'memory-louvre', width:1800, height:1350, es:'Oriol besa a Belén junto a la pirámide iluminada del Louvre', en:'Oriol kisses Belén beside the illuminated Louvre pyramid', name:'Una noche en París', nameEn:'A night in Paris' },
  { id: '25', es: 'Oriol besa a Belén bajo los árboles', en: 'Oriol kisses Belén beneath the trees', name: 'Un instante nuestro', nameEn: 'A moment of our own' },
];
export function StorySection({ lang }: { lang: Language }) {
  const es = lang === 'es';
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const stage = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const current = photographs[selected];
  const step = (direction: number) => {
    setPaused(true);
    setSelected(i => (i + direction + photographs.length) % photographs.length);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: .25 });
    if (stage.current) observer.observe(stage.current);
    const visibility = () => setVisible(!document.hidden);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => { if (motion.matches) setPaused(true); };
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', reduce);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', reduce); };
  }, []);
  useEffect(() => {
    if (paused || !inView || hovered || focused || !visible) return;
    const timer = window.setTimeout(() => setSelected(i => (i + 1) % photographs.length), 7000);
    return () => window.clearTimeout(timer);
  }, [paused, inView, hovered, focused, visible, selected]);
  return (
    <section id="story" className="atlantic-story" aria-label={es ? 'Nuestra historia' : 'Our story'}>
      <div ref={stage} className={`atlantic-story__stage atlantic-story__stage--${current.id}${current.id.startsWith('memory-') ? ' atlantic-story__stage--full-photo' : ''}`}
        onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }} onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onPointerDown={event => { pointerStart.current = event.clientX; }}
        onPointerUp={event => { const start = pointerStart.current; pointerStart.current = null; if (start !== null && Math.abs(event.clientX - start) > 40) step(event.clientX < start ? 1 : -1); }}
        onPointerCancel={() => { pointerStart.current = null; }}
        onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); } }}>
        <img key={current.id} className="atlantic-story__image" src={`/photos/album/${current.id}.webp`} alt={es ? current.es : current.en} loading="lazy" width={current.width ?? (current.id === '25' ? 920 : 1800)} height={current.height ?? (current.id === '25' ? 1454 : 1013)}/>
        {selected === 0 && <div className="atlantic-story__cover" aria-hidden="true"><span>Belén &amp; Oriol</span><p>{es ? 'Nuestra' : 'Our'}<br/><em>{es ? 'historia.' : 'story.'}</em></p></div>}
        <div className="atlantic-story__folio" aria-live={paused ? 'polite' : 'off'}>{es ? current.name : current.nameEn}</div>
        <div className="atlantic-story__controls" role="group" aria-label={es ? 'Fotografías de nuestra historia' : 'Our story photographs'}>
          <button type="button" className="atlantic-story__previous" onClick={() => step(-1)} aria-label={es ? 'Foto anterior' : 'Previous photo'}><ArrowLeft aria-hidden="true" /></button>
          <span>{String(selected + 1).padStart(2,'0')} <i>/</i> {String(photographs.length).padStart(2,'0')}</span>
          <button type="button" className="atlantic-story__next" onClick={() => step(1)} aria-label={es ? 'Foto siguiente' : 'Next photo'}><ArrowRight aria-hidden="true" /></button>
          <button type="button" className="atlantic-story__pause" onClick={() => setPaused(value => !value)} aria-pressed={paused}
            aria-label={es ? (paused ? 'Reanudar cambio automático' : 'Pausar cambio automático') : (paused ? 'Resume slideshow' : 'Pause slideshow')}>
            {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="atlantic-story__article">
        <figure className="story-city story-city--salamanca" aria-hidden="true"><div><img src="/photos/story-salamanca-barcelona.png" alt="" loading="lazy"/></div></figure>
        <figure className="story-city story-city--barcelona" aria-hidden="true"><div><img src="/photos/story-salamanca-barcelona.png" alt="" loading="lazy"/></div></figure>
        <div className="atlantic-story__prose">{story[lang].map(p => <p key={p}>{p}</p>)}</div>
        <div className="story-thread-footer" aria-hidden="true"><svg viewBox="0 0 1000 80" fill="none"><path d="M50 10 C170 80 310 30 425 45 C454 49 474 65 500 62 C525 58 553 34 548 20 C541 2 509 9 500 30 C488 8 461 5 454 22 C445 43 478 66 507 68 C580 80 714 7 950 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg></div>
      </div>
    </section>
  );
}
