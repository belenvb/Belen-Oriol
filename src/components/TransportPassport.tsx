import { useEffect, useMemo, useRef, useState } from 'react';
import { Plane, Train, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import './PassportStyles.css';

type PassportPage = {
  id: string;
  num: string;
  icon: typeof Plane;
  badge: string;
  title: string;
  subtitle: string;
  card1Title: string;
  card1Distance: string;
  card1Text: string;
  card1Link?: { url: string; text: string };
  card2Title: string;
  card2Distance: string;
  card2Text: string;
  tagline: string;
  stampText: string;
  stampSub: string;
};

type FlipDirection = 'next' | 'previous' | null;

function PassportPageContent({
  page,
  compact = false,
  canTurn = false,
  onTurn,
  isSpanish,
}: {
  page: PassportPage;
  compact?: boolean;
  canTurn?: boolean;
  onTurn?: () => void;
  isSpanish: boolean;
}) {
  const Icon = page.icon;

  return (
    <>
      <div className="passport-security-lines passport-security-lines-a" aria-hidden="true" />
      <div className="passport-security-lines passport-security-lines-b" aria-hidden="true" />
      <div className="passport-paper-grain" aria-hidden="true" />

      <div className="passport-page-inner">
        <div className="passport-page-toprow">
          <div className="passport-icon-seal"><Icon size={compact ? 18 : 24} strokeWidth={1.7} /></div>
          <span className="passport-badge">{page.badge}</span>
        </div>

        <div className="passport-page-title">
          <p>{isSpanish ? 'GUÍA DE VIAJE' : 'TRAVEL GUIDE'} · PÁG. {page.num}</p>
          <h3>{page.title}</h3>
          <small>{page.subtitle}</small>
        </div>

        <div className="passport-card-grid">
          <div className="passport-info-card">
            <h4>{page.card1Title}</h4>
            <strong>{page.card1Distance}</strong>
            <p>{page.card1Text}</p>
            {page.card1Link && (
              <a href={page.card1Link.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                {page.card1Link.text} ↗
              </a>
            )}
          </div>

          <div className="passport-info-card">
            <h4>{page.card2Title}</h4>
            <strong>{page.card2Distance}</strong>
            <p>{page.card2Text}</p>
          </div>
        </div>

        <div className="passport-tagline">✦ {page.tagline}</div>
        <div className="passport-stamp"><b>{page.stampText}</b><span>{page.stampSub}</span></div>
        <div className="passport-decorative-line" aria-hidden="true">BELÉN · ORIOL · SALAMANCA · 04.09.2027 · CASTILLO DEL BUEN AMOR</div>
        <div className="passport-page-footer"><span>B&amp;O · SALAMANCA · 04.09.2027</span><span>[{page.num}/03]</span></div>

        {canTurn && onTurn && (
          <button className="passport-turn-cue" onClick={(e) => { e.stopPropagation(); onTurn(); }}>
            {isSpanish ? 'Siguiente página' : 'Next page'} ↗
          </button>
        )}
      </div>
    </>
  );
}

function PassportIdentityPage({ isSpanish }: { isSpanish: boolean }) {
  return (
    <>
      <div className="passport-security-lines passport-security-lines-a" aria-hidden="true" />
      <div className="passport-security-lines passport-security-lines-b" aria-hidden="true" />
      <div className="passport-paper-grain" aria-hidden="true" />
      <div className="passport-page-inner passport-identity-inner">
        <div className="passport-page-toprow">
          <div className="passport-monogram-seal">B&amp;O</div>
          <span className="passport-badge">{isSpanish ? 'GUÍA DE VIAJE' : 'TRAVEL GUIDE'}</span>
        </div>
        <div className="passport-identity-block">
          <span>{isSpanish ? 'Titulares' : 'Holders'}</span>
          <h3>Belén &amp; Oriol</h3>
          <p>Salamanca · Castillo del Buen Amor</p>
        </div>
        <div className="passport-identity-grid">
          <div><span>{isSpanish ? 'Fecha' : 'Date'}</span><b>04.09.2027</b></div>
          <div><span>{isSpanish ? 'Destino' : 'Destination'}</span><b>Salamanca</b></div>
          <div><span>{isSpanish ? 'Motivo' : 'Purpose'}</span><b>{isSpanish ? 'Boda' : 'Wedding'}</b></div>
          <div><span>{isSpanish ? 'Para' : 'For'}</span><b>{isSpanish ? 'Invitados' : 'Guests'}</b></div>
        </div>
        <div className="passport-large-watermark" aria-hidden="true">B&amp;O</div>
        <div className="passport-decorative-line" aria-hidden="true">BELÉN · ORIOL · SALAMANCA · 04.09.2027 · CASTILLO DEL BUEN AMOR</div>
        <div className="passport-page-footer"><span>{isSpanish ? 'Guía de viaje' : 'Travel guide'}</span><span>[ID]</span></div>
      </div>
    </>
  );
}

export function TransportPassport({ lang }: { lang: Language }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>(null);
  const timeoutRef = useRef<number | null>(null);
  const isSpanish = lang === 'es';
  const dateFormatted = '04.09.2027';

  const pages: PassportPage[] = useMemo(() => [
    {
      id: 'flights',
      num: '01',
      icon: Plane,
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos & Aeropuertos' : 'Flights & Airports',
      subtitle: isSpanish ? 'MADRID · VALLADOLID · SALAMANCA' : 'MADRID · VALLADOLID · SALAMANCA',
      card1Title: 'Madrid-Barajas (MAD)',
      card1Distance: isSpanish ? '220 km a Salamanca · ~2 h en coche / 1 h 35 min en tren' : '220 km / 137 miles to Salamanca · ~2 hr drive / 1 hr 35 min train',
      card1Text: isSpanish
        ? 'Madrid es la opción con más vuelos internacionales. Desde la T4 se puede conectar con Chamartín y tomar el Alvia directo a Salamanca.'
        : 'Madrid is the airport with the widest international connections. From T4, connect to Chamartín and take the direct Alvia train to Salamanca.',
      card2Title: isSpanish ? 'Valladolid (VLL) o Salamanca (SLM)' : 'Valladolid (VLL) or Salamanca (SLM)',
      card2Distance: isSpanish ? 'VLL: 115 km · SLM: 15 km aprox.' : 'VLL: 115 km / 71 miles · SLM: approx. 15 km / 9 miles',
      card2Text: isSpanish
        ? 'Valladolid puede ser una alternativa cómoda para vuelos desde Barcelona. Salamanca cuenta con aeropuerto cercano, aunque con menos conexiones.'
        : 'Valladolid can be a convenient option for flights from Barcelona. Salamanca has a nearby airport, though with fewer connections.',
      tagline: isSpanish ? 'Tres aeropuertos posibles según origen y disponibilidad' : 'Three airport options depending on origin and availability',
      stampText: `AEROPUERTO · ${dateFormatted}`,
      stampSub: isSpanish ? 'LLEGADA' : 'ARRIVAL',
    },
    {
      id: 'trains',
      num: '02',
      icon: Train,
      badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING',
      title: isSpanish ? 'Llegada a Salamanca' : 'Arrival in Salamanca',
      subtitle: isSpanish ? 'ALVIA · COCHE · CONEXIONES' : 'ALVIA · CAR · CONNECTIONS',
      card1Title: isSpanish ? 'Madrid → Salamanca en tren' : 'Madrid → Salamanca by train',
      card1Distance: isSpanish ? '1 h 35 min · trayecto directo' : '1 hr 35 min · direct journey',
      card1Text: isSpanish
        ? 'Renfe opera trenes Alvia directos desde Madrid-Chamartín a Salamanca con varias frecuencias diarias.'
        : 'Renfe operates direct Alvia services from Madrid-Chamartín to Salamanca several times a day.',
      card1Link: { url: 'https://www.renfe.com', text: isSpanish ? 'Consultar Renfe' : 'Check Renfe' },
      card2Title: isSpanish ? 'En coche' : 'By car',
      card2Distance: isSpanish ? 'Madrid → Salamanca · ~2 h' : 'Madrid → Salamanca · ~2 hr',
      card2Text: isSpanish
        ? 'La ruta en coche desde Madrid es sencilla y directa. Desde Barcelona también existen opciones ferroviarias con conexión.'
        : 'The drive from Madrid is simple and direct. From Barcelona, rail options are also available with a connection.',
      tagline: isSpanish ? 'Salamanca por tren o carretera' : 'Salamanca by rail or road',
      stampText: `SALAMANCA · ${dateFormatted}`,
      stampSub: isSpanish ? 'TRÁNSITO' : 'TRANSIT',
    },
    {
      id: 'castle',
      num: '03',
      icon: MapPin,
      badge: isSpanish ? 'DÍA DE LA BODA' : 'WEDDING DAY',
      title: 'Castillo del Buen Amor',
      subtitle: isSpanish ? 'CEREMONIA · BANQUETE · FIESTA' : 'CEREMONY · DINNER · PARTY',
      card1Title: isSpanish ? 'Autobús para invitados' : 'Wedding guest shuttle',
      card1Distance: isSpanish ? 'Salamanca ⇄ Castillo · organizado por nosotros' : 'Salamanca ⇄ Castle · arranged by us',
      card1Text: isSpanish
        ? 'Pondremos un autobús para invitados entre Salamanca y el castillo, con regreso al finalizar la celebración.'
        : 'We will arrange a wedding guest shuttle between Salamanca and the castle, with return service after the celebration.',
      card2Title: isSpanish ? 'Coche o taxi' : 'Car or taxi',
      card2Distance: isSpanish ? '20 km al norte · 25 min' : '20 km / 12.5 miles north · 25 min',
      card2Text: isSpanish ? 'El castillo dispone de aparcamiento privado para invitados.' : 'Private guest parking is available at the castle.',
      tagline: isSpanish ? 'A 25 minutos de Salamanca' : '25 minutes from Salamanca',
      stampText: `BUEN AMOR · ${dateFormatted}`,
      stampSub: isSpanish ? 'CASTILLO' : 'CASTLE',
    },
  ], [isSpanish, dateFormatted]);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const finishFlip = (nextPage: number) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCurrentPage(nextPage);
      setPendingPage(null);
      setFlipDirection(null);
    }, 980);
  };

  const setPageWithMotion = (nextPage: number) => {
    const safePage = Math.max(0, Math.min(pages.length - 1, nextPage));
    if (safePage === currentPage || flipDirection) return;
    setPendingPage(safePage);
    setFlipDirection(safePage > currentPage ? 'next' : 'previous');
    finishFlip(safePage);
  };

  const goNext = () => setPageWithMotion(currentPage + 1);
  const goPrevious = () => setPageWithMotion(currentPage - 1);

  const rightPageIndex = pendingPage ?? currentPage;
  const leftPageIndex = currentPage > 0 ? currentPage - 1 : null;
  const turningPageIndex = flipDirection === 'previous' && pendingPage !== null ? pendingPage : currentPage;
  const backPageIndex = flipDirection === 'next' && pendingPage !== null ? pendingPage : currentPage;

  return (
    <div className={`passport-wrap ${isSpanish ? 'passport-spain' : 'passport-usa'}`}>
      <div className="passport-topline">
        <span>{isSpanish ? 'Guía de viaje' : 'Travel guide'}</span>
        <span>{currentPage + 1} / {pages.length}</span>
      </div>

      <div className="passport-stage">
        <div className="passport-table-shadow" aria-hidden="true" />
        <div className={`passport-book ${flipDirection ? `is-flipping is-${flipDirection}` : ''}`} aria-label={isSpanish ? 'Guía de viaje interactiva' : 'Interactive travel guide'}>
          <div className="passport-cover passport-cover-left" aria-hidden="true" />
          <div className="passport-cover passport-cover-right" aria-hidden="true" />
          <div className="passport-stitch-line" aria-hidden="true" />
          <div className="passport-spine" aria-hidden="true"><span /><span /><span /></div>

          <div className="passport-page passport-page-left">
            {leftPageIndex === null ? (
              <PassportIdentityPage isSpanish={isSpanish} />
            ) : (
              <PassportPageContent page={pages[leftPageIndex]} compact isSpanish={isSpanish} />
            )}
          </div>

          <div className="passport-page passport-page-right" onClick={() => currentPage < pages.length - 1 && goNext()}>
            <PassportPageContent page={pages[rightPageIndex]} canTurn={currentPage < pages.length - 1 && !flipDirection} onTurn={goNext} isSpanish={isSpanish} />
          </div>

          {flipDirection && (
            <div className={`passport-turning-sheet passport-turning-sheet-${flipDirection}`} aria-hidden="true">
              <div className="passport-turning-face passport-turning-front">
                <PassportPageContent page={pages[turningPageIndex]} compact isSpanish={isSpanish} />
              </div>
              <div className="passport-page-edge" />
              <div className="passport-turning-face passport-turning-back">
                <PassportPageContent page={pages[backPageIndex]} compact isSpanish={isSpanish} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="passport-controls">
        <button onClick={goPrevious} disabled={currentPage === 0 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página anterior' : 'Previous page'}>
          <ChevronLeft size={17}/>{isSpanish ? 'Anterior' : 'Previous'}
        </button>
        <div>{pages.map((p, i) => <button key={p.id} className={i === currentPage ? 'active' : ''} onClick={() => setPageWithMotion(i)} aria-label={`${isSpanish ? 'Página' : 'Page'} ${i + 1}`} />)}</div>
        <button onClick={goNext} disabled={currentPage === pages.length - 1 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página siguiente' : 'Next page'}>
          {isSpanish ? 'Siguiente' : 'Next'}<ChevronRight size={17}/>
        </button>
      </div>
    </div>
  );
}
