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
      pageLabel: isSpanish ? 'VISADO AÉREO · PÁG. 01' : 'AIR TRAVEL · PG. 01',
      icon: Plane,
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos & Aeropuertos' : 'Flights & Airports',
      subtitle: 'MADRID-BARAJAS & VALLADOLID',
      card1Title: 'Madrid-Barajas (MAD)',
      card1Distance: isSpanish ? '220 km · ~2h en coche / 1h 35m en tren' : '220 km / 137 miles · ~2h drive / 1h 35m train',
      card1Text: isSpanish
        ? 'Desde Madrid-Barajas, la conexión más sencilla es Cercanías desde la T4 hasta Chamartín y desde allí Alvia directo a Salamanca.'
        : 'From Madrid-Barajas, the easiest connection is the commuter train from T4 to Chamartín, followed by a direct Alvia train to Salamanca.',
      card2Title: 'Barcelona ✈ Valladolid (VLL)',
      card2Distance: isSpanish ? '115 km a Salamanca · ~1h en coche' : '115 km / 71 miles to Salamanca · ~1h drive',
      card2Text: isSpanish
        ? 'Valladolid puede ser una alternativa cómoda para quienes viajen desde Barcelona, con conexión por carretera o tren hasta Salamanca.'
        : 'Valladolid can be a convenient alternative for guests travelling from Barcelona, with onward road or rail connections to Salamanca.',
      tagline: isSpanish ? 'Conexiones vía Madrid o Valladolid' : 'Connections via Madrid or Valladolid',
      stampText: `MAD · ${dateFormatted}`,
      stampSub: 'ENTRY / ENTRADA',
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
        ? 'La ruta por autovía es sencilla y directa. Desde Barcelona también existen opciones ferroviarias con conexión.'
        : 'The motorway route is simple and direct. From Barcelona, rail options are also available with a connection.',
      tagline: isSpanish ? 'Salamanca por tren o carretera' : 'Salamanca by rail or road',
      stampText: `SALAMANCA · ${dateFormatted}`,
      stampSub: 'TRANSIT / TRÁNSITO',
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
      tagline: isSpanish ? 'A 25 minutos de Salamanca' : '25 minutes from Salamanca',
      stampText: `BUEN AMOR · ${dateFormatted}`,
      stampSub: 'ARRIVAL / LLEGADA',
    },
  ];

  return (
    <div className="passport-wrap">
      <div className="passport-topline">
        <span>{isSpanish ? 'Guía de viaje' : 'Travel guide'}</span>
        <span>{currentPage + 1} / {pages.length}</span>
      </div>

      <div className="passport-book passport-book-landscape" aria-label={isSpanish ? 'Pasaporte de viaje interactivo' : 'Interactive travel passport'}>
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
              >
                <div className="passport-page-face passport-page-front">
                  <div className="passport-security-lines passport-security-lines-a" aria-hidden="true" />
                  <div className="passport-security-lines passport-security-lines-b" aria-hidden="true" />

                  <div className="passport-page-toprow">
                    <div className="passport-icon-seal"><Icon size={26} strokeWidth={1.7} /></div>
                    <span className="passport-badge">{page.badge}</span>
                  </div>

                  <div className="passport-page-title">
                    <h3>{page.title}</h3>
                    <p>{page.subtitle}</p>
                  </div>

                  <div className="passport-card-grid">
                    <div className="passport-info-card">
                      <h4>{page.card1Title}</h4>
                      <strong>{page.card1Distance}</strong>
                      <p>{page.card1Text}</p>
                      {page.card1Link && <a href={page.card1Link.url} target="_blank" rel="noreferrer">{page.card1Link.text} ↗</a>}
                    </div>
                    <div className="passport-info-card">
                      <h4>{page.card2Title}</h4>
                      <strong>{page.card2Distance}</strong>
                      <p>{page.card2Text}</p>
                    </div>
                  </div>

                  <div className="passport-tagline">✦ {page.tagline}</div>
                  <div className="passport-stamp"><b>{page.stampText}</b><span>{page.stampSub}</span></div>

                  <div className="passport-page-footer">
                    <span>B&amp;O · SALAMANCA</span>
                    <span>{page.pageLabel}</span>
                    <span>{page.num}</span>
                  </div>

                  <button
                    className="passport-turn-cue"
                    onClick={() => index < pages.length - 1 && setCurrentPage(index + 1)}
                    disabled={index === pages.length - 1}
                  >
                    {index === pages.length - 1 ? (isSpanish ? 'Fin' : 'End') : (isSpanish ? 'Pasar página' : 'Turn page')} ↗
                  </button>
                </div>

                <div className="passport-page-face passport-page-back" aria-hidden="true">
                  <div className="passport-security-lines passport-security-lines-back" aria-hidden="true" />
                  <span className="passport-page-number">{page.num}</span>
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
