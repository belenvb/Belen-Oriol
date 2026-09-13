import { useEffect, useMemo, useRef, useState } from 'react';
import { Plane, Train, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import './PassportStyles.css';

type IconType = typeof Plane;

type CardLink = { url: string; text: string };

type PageData = {
  id: string;
  num: string;
  icon: IconType;
  badge: string;
  title: string;
  subtitle: string;
  card1Title: string;
  card1Distance: string;
  card1Text: string;
  card1Link?: CardLink;
  card2Title: string;
  card2Distance: string;
  card2Text: string;
  tagline: string;
  stampText: string;
  stampSub: string;
};

type Spread = { left: PageData; right: PageData };
type FlipDirection = 'forward' | 'backward' | null;

function PassportPageFace({ page, isSpanish, compact = false, action }: { page: PageData; isSpanish: boolean; compact?: boolean; action?: { label: string; onClick: () => void } }) {
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
            {page.card1Link && <a href={page.card1Link.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{page.card1Link.text} ↗</a>}
          </div>

          <div className="passport-info-card">
            <h4>{page.card2Title}</h4>
            <strong>{page.card2Distance}</strong>
            <p>{page.card2Text}</p>
          </div>
        </div>

        <div className="passport-tagline">✦ {page.tagline}</div>
        <div className="passport-stamp"><b>{page.stampText}</b><span>{page.stampSub}</span></div>
        <div className="passport-deco-line" aria-hidden="true">BELÉN &amp; ORIOL · SALAMANCA · CASTILLO DEL BUEN AMOR</div>
        <div className="passport-page-footer"><span>B&amp;O · SALAMANCA · 04.09.2027</span><span>[{page.num}/03]</span></div>

        {action && (
          <button className="passport-turn-cue" onClick={(event) => { event.stopPropagation(); action.onClick(); }}>
            {action.label} ↗
          </button>
        )}
      </div>
    </>
  );
}

export function TransportPassport({ lang }: { lang: Language }) {
  const isSpanish = lang === 'es';
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pendingSpread, setPendingSpread] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>(null);
  const timerRef = useRef<number | null>(null);
  const dateFormatted = '04.09.2027';

  const pageFlights: PageData = useMemo(() => ({
    id: 'flights',
    num: '01',
    icon: Plane,
    badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
    title: isSpanish ? 'Vuelos' : 'Flights',
    subtitle: 'MADRID · VALLADOLID · SALAMANCA',
    card1Title: 'Madrid-Barajas (MAD)',
    card1Distance: isSpanish ? '220 km a Salamanca · ~2 h en coche / 1 h 35 min en tren' : '220 km / 137 miles to Salamanca · ~2 hr drive / 1 hr 35 min train',
    card1Text: isSpanish ? 'Madrid es la opción con más vuelos internacionales. Desde la T4 se puede conectar con Chamartín y tomar el Alvia directo a Salamanca.' : 'Madrid is the airport with the widest international connections. From T4, connect to Chamartín and take the direct Alvia train to Salamanca.',
    card2Title: isSpanish ? 'Valladolid (VLL) o Salamanca (SLM)' : 'Valladolid (VLL) or Salamanca (SLM)',
    card2Distance: isSpanish ? 'VLL: 115 km · SLM: 15 km aprox.' : 'VLL: 115 km / 71 miles · SLM: approx. 15 km / 9 miles',
    card2Text: isSpanish ? 'Valladolid puede ser una alternativa cómoda para vuelos desde Barcelona. Salamanca cuenta con aeropuerto cercano, aunque con menos conexiones.' : 'Valladolid can be a convenient option for flights from Barcelona. Salamanca has a nearby airport, though with fewer connections.',
    tagline: isSpanish ? 'Tres aeropuertos posibles según origen y disponibilidad' : 'Three airport options depending on origin and availability',
    stampText: `AEROPUERTO · ${dateFormatted}`,
    stampSub: 'B&O TRAVEL',
  }), [dateFormatted, isSpanish]);

  const pageTrains: PageData = useMemo(() => ({
    id: 'trains',
    num: '02',
    icon: Train,
    badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING',
    title: isSpanish ? 'Trenes' : 'Trains',
    subtitle: isSpanish ? 'ALVIA · COCHE · CONEXIONES' : 'ALVIA · CAR · CONNECTIONS',
    card1Title: isSpanish ? 'Madrid → Salamanca en tren' : 'Madrid → Salamanca by train',
    card1Distance: isSpanish ? '1 h 35 min · trayecto directo' : '1 hr 35 min · direct journey',
    card1Text: isSpanish ? 'Renfe opera trenes Alvia directos desde Madrid-Chamartín a Salamanca con varias frecuencias diarias.' : 'Renfe operates direct Alvia services from Madrid-Chamartín to Salamanca several times a day.',
    card1Link: { url: 'https://www.renfe.com', text: isSpanish ? 'Consultar Renfe' : 'Check Renfe' },
    card2Title: isSpanish ? 'En coche' : 'By car',
    card2Distance: isSpanish ? 'Madrid → Salamanca · ~2 h' : 'Madrid → Salamanca · ~2 hr',
    card2Text: isSpanish ? 'La ruta en coche desde Madrid es sencilla y directa. Desde Barcelona también existen opciones ferroviarias con conexión.' : 'The drive from Madrid is simple and direct. From Barcelona, rail options are also available with a connection.',
    tagline: isSpanish ? 'Salamanca por tren o carretera' : 'Salamanca by rail or road',
    stampText: `SALAMANCA · ${dateFormatted}`,
    stampSub: 'B&O TRAVEL',
  }), [dateFormatted, isSpanish]);

  const pageWedding: PageData = useMemo(() => ({
    id: 'castle',
    num: '03',
    icon: MapPin,
    badge: isSpanish ? 'DÍA DE LA BODA' : 'WEDDING DAY',
    title: isSpanish ? 'La boda' : 'Wedding day',
    subtitle: 'CASTILLO DEL BUEN AMOR',
    card1Title: isSpanish ? 'Autobús para invitados' : 'Wedding guest shuttle',
    card1Distance: isSpanish ? 'Salamanca ⇄ Castillo · organizado por nosotros' : 'Salamanca ⇄ Castle · arranged by us',
    card1Text: isSpanish ? 'Pondremos un autobús para invitados entre Salamanca y el castillo, con regreso al finalizar la celebración.' : 'We will arrange a wedding guest shuttle between Salamanca and the castle, with return service after the celebration.',
    card2Title: isSpanish ? 'Coche o taxi' : 'Car or taxi',
    card2Distance: isSpanish ? '20 km al norte · 25 min' : '20 km / 12.5 miles north · 25 min',
    card2Text: isSpanish ? 'El castillo dispone de aparcamiento privado para invitados.' : 'Private guest parking is available at the castle.',
    tagline: isSpanish ? 'A 25 minutos de Salamanca' : '25 minutes from Salamanca',
    stampText: `BUEN AMOR · ${dateFormatted}`,
    stampSub: 'B&O TRAVEL',
  }), [dateFormatted, isSpanish]);

  const spreads: Spread[] = useMemo(() => [
    { left: pageFlights, right: pageTrains },
    { left: pageFlights, right: pageWedding },
  ], [pageFlights, pageTrains, pageWedding]);

  useEffect(() => {
    const openTimer = window.setTimeout(() => setIsOpen(true), 380);
    return () => window.clearTimeout(openTimer);
  }, []);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const requestSpreadChange = (nextSpread: number) => {
    const safeSpread = Math.max(0, Math.min(spreads.length - 1, nextSpread));
    if (safeSpread === spreadIndex || flipDirection) return;

    setPendingSpread(safeSpread);
    setFlipDirection(safeSpread > spreadIndex ? 'forward' : 'backward');

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setSpreadIndex(safeSpread);
      setPendingSpread(null);
      setFlipDirection(null);
    }, 1320);
  };

  const currentSpread = spreads[spreadIndex];
  const targetSpread = pendingSpread !== null ? spreads[pendingSpread] : currentSpread;
  const displayedRightPage = flipDirection === 'forward' ? targetSpread.right : currentSpread.right;
  const turningFrontPage = flipDirection === 'backward' ? targetSpread.right : currentSpread.right;
  const turningBackPage = flipDirection === 'forward' ? targetSpread.right : currentSpread.right;

  return (
    <div className={`passport-wrap ${isSpanish ? 'passport-spain' : 'passport-usa'}`}>
      <div className="passport-topline"><span>{isSpanish ? 'Guía de viaje' : 'Travel guide'}</span><span>{spreadIndex + 1} / {spreads.length}</span></div>

      <div className={`passport-stage ${isOpen ? 'is-open' : ''}`}>
        <div className="passport-table-shadow" aria-hidden="true" />
        <div className={`passport-book ${flipDirection ? `is-flipping is-${flipDirection}` : ''}`}>
          <div className="passport-book-block" aria-hidden="true" />
          <div className="passport-book-shadow" aria-hidden="true" />

          <div className="passport-spread">
            <div className="passport-page passport-page-left"><PassportPageFace page={currentSpread.left} isSpanish={isSpanish} compact /></div>
            <div className="passport-page passport-page-right">
              <PassportPageFace page={displayedRightPage} isSpanish={isSpanish} action={spreadIndex < spreads.length - 1 && !flipDirection ? { label: isSpanish ? 'Siguiente página' : 'Next page', onClick: () => requestSpreadChange(spreadIndex + 1) } : undefined} />
            </div>

            {flipDirection && (
              <div className={`passport-turning-sheet passport-turning-sheet-${flipDirection}`} aria-hidden="true">
                <div className="passport-turning-face passport-turning-front"><PassportPageFace page={turningFrontPage} isSpanish={isSpanish} compact /></div>
                <div className="passport-page-edge" />
                <div className="passport-turning-face passport-turning-back"><PassportPageFace page={turningBackPage} isSpanish={isSpanish} compact /></div>
              </div>
            )}
          </div>

          <button type="button" className="passport-front-cover" aria-label={isSpanish ? 'Abrir guía de viaje' : 'Open travel guide'} onClick={() => setIsOpen(true)}>
            <div className="passport-front-cover-inner"><span>{isSpanish ? 'GUÍA DE VIAJE' : 'TRAVEL GUIDE'}</span><b>B &amp; O</b><small>SALAMANCA · 04.09.2027</small></div>
          </button>
        </div>
      </div>

      <div className="passport-controls">
        <button onClick={() => requestSpreadChange(spreadIndex - 1)} disabled={spreadIndex === 0 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página anterior' : 'Previous page'}><ChevronLeft size={17} />{isSpanish ? 'Anterior' : 'Previous'}</button>
        <div>{spreads.map((spread, index) => <button key={spread.right.id} className={index === spreadIndex ? 'active' : ''} onClick={() => requestSpreadChange(index)} aria-label={`${isSpanish ? 'Página' : 'Page'} ${index + 1}`} />)}</div>
        <button onClick={() => requestSpreadChange(spreadIndex + 1)} disabled={spreadIndex === spreads.length - 1 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página siguiente' : 'Next page'}>{isSpanish ? 'Siguiente' : 'Next'}<ChevronRight size={17} /></button>
      </div>
    </div>
  );
}
