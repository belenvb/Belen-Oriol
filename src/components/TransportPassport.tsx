import { useState } from 'react';
import { Plane, Train, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import './PassportStyles.css';

export function TransportPassport({ lang }: { lang: Language }) {
  const [currentPage, setCurrentPage] = useState(0);
  const isSpanish = lang === 'es';
  const dateFormatted = '04.09.2027';

  const pages = [
    {
      id: 'flights',
      num: '01',
      pageLabel: isSpanish ? 'VISADO AÉREO · PÁG. 01' : 'AIR TRAVEL VISA · PG. 01',
      icon: Plane,
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos & Aeropuertos' : 'Flights & Airports',
      subtitle: 'MADRID-BARAJAS & VALLADOLID',
      card1Title: 'Madrid-Barajas (MAD) → Salamanca',
      card1Distance: isSpanish ? '220 km · ~2h en coche / 1h 35m en tren' : '220 km / 137 miles · ~2h drive / 1h 35m train',
      card1Text: isSpanish
        ? 'Desde Madrid-Barajas, la conexión más sencilla es Cercanías desde la T4 hasta Chamartín y desde allí Alvia directo a Salamanca.'
        : 'From Madrid-Barajas, the easiest connection is the commuter train from T4 to Chamartín, followed by a direct Alvia train to Salamanca.',
      card2Title: 'Barcelona ✈ Valladolid (VLL)',
      card2Distance: isSpanish ? '115 km a Salamanca · ~1h en coche' : '115 km / 71 miles to Salamanca · ~1h drive',
      card2Text: isSpanish
        ? 'Valladolid puede ser una alternativa cómoda para quienes viajen desde Barcelona, con conexión por carretera o tren hasta Salamanca.'
        : 'Valladolid can be a convenient alternative for guests travelling from Barcelona, with onward road or rail connections to Salamanca.',
      stampText: `MAD · ${dateFormatted}`,
      stampSub: 'CONTROL DE ENTRADA / ENTRY',
    },
    {
      id: 'trains',
      num: '02',
      pageLabel: isSpanish ? 'TREN & CARRETERA · PÁG. 02' : 'TRAIN & DRIVING · PG. 02',
      icon: Train,
      badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING',
      title: isSpanish ? 'Llegada a Salamanca' : 'Arrival in Salamanca',
      subtitle: isSpanish ? 'ALVIA & AUTOVÍAS DIRECTAS' : 'ALVIA & DIRECT HIGHWAYS',
      card1Title: isSpanish ? 'Madrid → Salamanca en tren' : 'Madrid → Salamanca by train',
      card1Distance: isSpanish ? '1h 35m · trayecto directo' : '1h 35m · direct journey',
      card1Text: isSpanish
        ? 'Renfe opera trenes Alvia directos desde Madrid-Chamartín a Salamanca con varias frecuencias diarias.'
        : 'Renfe operates direct Alvia services from Madrid-Chamartín to Salamanca several times a day.',
      card1Link: {
        url: 'https://www.renfe.com',
        text: isSpanish ? 'Consultar Renfe' : 'Check Renfe',
      },
      card2Title: isSpanish ? 'En coche' : 'By car',
      card2Distance: isSpanish ? 'Madrid → Salamanca · ~2h' : 'Madrid → Salamanca · ~2h',
      card2Text: isSpanish
        ? 'La ruta por autovía es sencilla y directa. Desde Barcelona, el trayecto completo es más largo y también existe opción ferroviaria con conexión.'
        : 'The motorway route is simple and direct. From Barcelona, the full drive is longer and rail options are also available with a connection.',
      stampText: `SALAMANCA · ${dateFormatted}`,
      stampSub: 'TRÁNSITO FERROVIARIO',
    },
    {
      id: 'castle',
      num: '03',
      pageLabel: isSpanish ? 'DÍA DE LA BODA · PÁG. 03' : 'WEDDING DAY · PG. 03',
      icon: MapPin,
      badge: isSpanish ? 'DÍA DE LA BODA' : 'WEDDING DAY',
      title: 'Castillo del Buen Amor',
      subtitle: isSpanish ? 'CEREMONIA · BANQUETE · FIESTA' : 'CEREMONY · DINNER · PARTY',
      card1Title: isSpanish ? 'Autobús de invitados' : 'Guest shuttle',
      card1Distance: isSpanish ? 'Salamanca ⇄ Castillo · incluido' : 'Salamanca ⇄ Castle · included',
      card1Text: isSpanish
        ? 'Habrá servicio de autobús el sábado 4 entre Salamanca y el castillo, con regreso al finalizar la celebración.'
        : 'A guest shuttle will run on Saturday between Salamanca and the castle, with return service after the celebration.',
      card2Title: isSpanish ? 'Coche o taxi' : 'Car or taxi',
      card2Distance: isSpanish ? '20 km al norte · ~25 min' : '20 km / 12.5 miles north · ~25 min',
      card2Text: isSpanish
        ? 'El castillo dispone de aparcamiento privado para invitados.'
        : 'Private guest parking is available at the castle.',
      stampText: `BUEN AMOR · ${dateFormatted}`,
      stampSub: 'SELLO DE LLEGADA / ARRIVAL',
    },
  ];

  return (
    <div className="passport-wrap">
      <div className="passport-topline">
        <span>{isSpanish ? 'Guía de viaje' : 'Travel guide'}</span>
        <span>{currentPage + 1} / {pages.length}</span>
      </div>

      <div className="passport-book" aria-label={isSpanish ? 'Pasaporte de viaje interactivo' : 'Interactive travel passport'}>
        <aside className="passport-identity">
          <div className="passport-cover-label">PASSPORT · PASAPORTE</div>
          <div className="passport-design-seal">
            <img src="/bo_monogram.png" alt="BO" />
          </div>
          <p className="passport-script">Belén & Oriol</p>
          <p className="passport-destination">SALAMANCA · ESPAÑA</p>
          <p className="passport-date">04 · 09 · 2027</p>
          <div className="passport-mosaic" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div>
          <div className="passport-mrz" aria-hidden="true">
            <span>P&lt;ESP&lt;&lt;BELEN&lt;ORIOL&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
            <span>040927&lt;SALAMANCA&lt;BUENAMOR&lt;&lt;&lt;&lt;&lt;&lt;</span>
          </div>
        </aside>

        <div className="passport-pages">
          {pages.map((page, index) => {
            const Icon = page.icon;
            const turned = index < currentPage;
            const current = index === currentPage;
            return (
              <div
                key={page.id}
                className={`passport-sheet ${turned ? 'is-turned' : ''} ${current ? 'is-current' : ''}`}
                style={{ zIndex: turned ? 40 + index : 30 - index }}
                onClick={() => current && index < pages.length - 1 && setCurrentPage(index + 1)}
              >
                <div className="passport-page-face passport-page-front">
                  <div className="passport-page-header">
                    <span>{page.pageLabel}</span>
                    <Icon size={21} strokeWidth={1.4} />
                  </div>
                  <div className="passport-page-title">
                    <span>{page.badge}</span>
                    <h3>{page.title}</h3>
                    <p>{page.subtitle}</p>
                  </div>
                  <div className="passport-info-block">
                    <h4>{page.card1Title}</h4>
                    <strong>{page.card1Distance}</strong>
                    <p>{page.card1Text}</p>
                    {page.card1Link && <a href={page.card1Link.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{page.card1Link.text} ↗</a>}
                  </div>
                  <div className="passport-rule" />
                  <div className="passport-info-block">
                    <h4>{page.card2Title}</h4>
                    <strong>{page.card2Distance}</strong>
                    <p>{page.card2Text}</p>
                  </div>
                  <div className="passport-stamp"><b>{page.stampText}</b><span>{page.stampSub}</span></div>
                  <button className="passport-turn-cue" onClick={(e) => { e.stopPropagation(); if (index < pages.length - 1) setCurrentPage(index + 1); }} disabled={index === pages.length - 1}>
                    {index === pages.length - 1 ? (isSpanish ? 'Fin del viaje' : 'Journey complete') : (isSpanish ? 'Pasar página' : 'Turn page')} ↗
                  </button>
                </div>
                <div className="passport-page-face passport-page-back">
                  <div className="passport-back-mark">BO</div>
                  <p>{isSpanish ? 'Dos caminos, una misma aventura.' : 'Two paths, one adventure.'}</p>
                  <span>{page.num}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="passport-controls">
        <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} aria-label={isSpanish ? 'Página anterior' : 'Previous page'}><ChevronLeft size={17}/>{isSpanish ? 'Anterior' : 'Previous'}</button>
        <div>{pages.map((p, i) => <button key={p.id} className={i === currentPage ? 'active' : ''} onClick={() => setCurrentPage(i)} aria-label={`${isSpanish ? 'Página' : 'Page'} ${i + 1}`} />)}</div>
        <button onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))} disabled={currentPage === pages.length - 1} aria-label={isSpanish ? 'Página siguiente' : 'Next page'}>{isSpanish ? 'Siguiente' : 'Next'}<ChevronRight size={17}/></button>
      </div>
    </div>
  );
}
