import { useMemo, useRef, useState } from 'react';
import { Plane, Train, MapPin, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Language } from '../types';
import boLogo from '../assets/images/bo-logo.png';
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

type Spread = { left?: PageData; right: PageData };
type FlipDirection = 'forward' | 'backward' | null;

function PassportBlankPage({ isSpanish }: { isSpanish: boolean }) {
  return (
    <>
      <div className="passport-security-lines passport-security-lines-a" aria-hidden="true" />
      <div className="passport-security-lines passport-security-lines-b" aria-hidden="true" />
      <div className="passport-paper-grain" aria-hidden="true" />
      <div className="passport-page-inner passport-page-inner-blank">
        <div className="passport-blank-mark" aria-hidden="true">B&amp;O</div>
        <div className="passport-blank-stamp" aria-hidden="true">SALAMANCA<br />04.09.2027</div>
        <div className="passport-machine-line" aria-hidden="true">P&lt;ESPBELEN&lt;&lt;ORIOL&lt;&lt;SALAMANCA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
        <div className="passport-page-footer"><span>{isSpanish ? 'Página reservada' : 'Reserved page'}</span><span>[--]</span></div>
      </div>
    </>
  );
}

function PassportPageFace({ page, isSpanish, compact = false }: { page: PageData; isSpanish: boolean; compact?: boolean }) {
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
              <a href={page.card1Link.url} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
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
        <div className="passport-machine-line" aria-hidden="true">P&lt;ESPBELEN&lt;&lt;ORIOL&lt;&lt;SALAMANCA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
        <div className="passport-page-footer"><span>B&amp;O · SALAMANCA · 04.09.2027</span><span>[{page.num}/03]</span></div>
      </div>
    </>
  );
}

function PageSurface({ page, isSpanish, side, compact = false }: { page?: PageData; isSpanish: boolean; side: 'left' | 'right'; compact?: boolean }) {
  return (
    <div className={`passport-page passport-page-${side} ${!page ? 'passport-page-empty' : ''}`}>
      {page ? <PassportPageFace page={page} isSpanish={isSpanish} compact={compact} /> : <PassportBlankPage isSpanish={isSpanish} />}
    </div>
  );
}

export function TransportPassport({ lang }: { lang: Language }) {
  const isSpanish = lang === 'es';
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pendingSpread, setPendingSpread] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>(null);
  const timerRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dateFormatted = '04.09.2027';

  const pages = useMemo(() => {
    const flights: PageData = {
      id: 'flights', num: '01', icon: Plane, badge: isSpanish ? 'EN AVIÓN' : 'BY AIR', title: isSpanish ? 'Vuelos' : 'Flights', subtitle: 'MADRID · VALLADOLID',
      card1Title: 'Madrid-Barajas (MAD)',
      card1Distance: isSpanish ? '220 km a Salamanca · ~2 h en coche / 1 h 35 min en tren' : '220 km / 137 miles to Salamanca · ~2 hr drive / 1 hr 35 min train',
      card1Text: isSpanish ? 'Madrid es la opción con más vuelos internacionales. Desde la T4 se puede conectar con Chamartín y tomar el Alvia directo a Salamanca.' : 'Madrid is the airport with the widest international connections. From T4, connect to Chamartín and take the direct Alvia train to Salamanca.',
      card2Title: 'Valladolid (VLL)',
      card2Distance: isSpanish ? '115 km a Salamanca · ~1 h en coche / 45 min en tren' : '115 km / 71 miles to Salamanca · ~1 hr drive / 45 min train',
      card2Text: isSpanish ? 'Valladolid puede ser una alternativa cómoda para vuelos desde Barcelona y conexiones nacionales.' : 'Valladolid can be a convenient alternative for flights from Barcelona and domestic connections.',
      tagline: isSpanish ? 'Dos aeropuertos posibles según origen y disponibilidad' : 'Two airport options depending on origin and availability',
      stampText: `AEROPUERTO · ${dateFormatted}`, stampSub: 'ENTRY / ENTRADA',
    };
    const trains: PageData = {
      id: 'trains', num: '02', icon: Train, badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING', title: isSpanish ? 'Trenes' : 'Trains', subtitle: isSpanish ? 'ALVIA · COCHE · CONEXIONES' : 'ALVIA · CAR · CONNECTIONS',
      card1Title: isSpanish ? 'Madrid → Salamanca en tren' : 'Madrid → Salamanca by train', card1Distance: isSpanish ? '1 h 35 min · trayecto directo' : '1 hr 35 min · direct journey',
      card1Text: isSpanish ? 'Renfe opera trenes Alvia directos desde Madrid-Chamartín a Salamanca con varias frecuencias diarias.' : 'Renfe operates direct Alvia services from Madrid-Chamartín to Salamanca several times a day.',
      card1Link: { url: 'https://www.renfe.com', text: isSpanish ? 'Consultar Renfe' : 'Check Renfe' },
      card2Title: isSpanish ? 'En coche' : 'By car', card2Distance: isSpanish ? 'Madrid → Salamanca · ~2 h' : 'Madrid → Salamanca · ~2 hr',
      card2Text: isSpanish ? 'La ruta en coche desde Madrid es sencilla y directa. Desde Barcelona también existen opciones ferroviarias con conexión.' : 'The drive from Madrid is simple and direct. From Barcelona, rail options are also available with a connection.',
      tagline: isSpanish ? 'Salamanca por tren o carretera' : 'Salamanca by rail or road', stampText: `SALAMANCA · ${dateFormatted}`, stampSub: 'TRANSIT / TRÁNSITO',
    };
    const wedding: PageData = {
      id: 'castle', num: '03', icon: MapPin, badge: isSpanish ? 'DÍA DE LA BODA' : 'WEDDING DAY', title: isSpanish ? 'La boda' : 'Wedding day', subtitle: 'CASTILLO DEL BUEN AMOR',
      card1Title: isSpanish ? 'Autobús para invitados' : 'Wedding guest shuttle', card1Distance: isSpanish ? 'Salamanca ⇄ Castillo · organizado por nosotros' : 'Salamanca ⇄ Castle · arranged by us',
      card1Text: isSpanish ? 'Pondremos un autobús para invitados entre Salamanca y el castillo, con regreso al finalizar la celebración.' : 'We will arrange a wedding guest shuttle between Salamanca and the castle, with return service after the celebration.',
      card2Title: isSpanish ? 'Coche o taxi' : 'Car or taxi', card2Distance: isSpanish ? '20 km al norte · 25 min' : '20 km / 12.5 miles north · 25 min',
      card2Text: isSpanish ? 'El castillo dispone de aparcamiento privado para invitados.' : 'Private guest parking is available at the castle.',
      tagline: isSpanish ? 'A 25 minutos de Salamanca' : '25 minutes from Salamanca', stampText: `BUEN AMOR · ${dateFormatted}`, stampSub: 'ARRIVAL / LLEGADA',
    };
    return { flights, trains, wedding };
  }, [dateFormatted, isSpanish]);

  const spreads: Spread[] = useMemo(() => [{ left: pages.flights, right: pages.trains }, { left: undefined, right: pages.wedding }], [pages]);

  const finishFlip = (nextSpread: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => { setSpreadIndex(nextSpread); setPendingSpread(null); setFlipDirection(null); }, 1180);
  };
  const requestSpreadChange = (nextSpread: number) => {
    const safeSpread = Math.max(0, Math.min(spreads.length - 1, nextSpread));
    if (!isOpen) { setIsOpen(true); return; }
    if (safeSpread === spreadIndex || flipDirection) return;
    setPendingSpread(safeSpread); setFlipDirection(safeSpread > spreadIndex ? 'forward' : 'backward'); finishFlip(safeSpread);
  };
  const closePassport = () => { if (flipDirection) return; setIsOpen(false); setPendingSpread(null); setFlipDirection(null); setSpreadIndex(0); if (timerRef.current) window.clearTimeout(timerRef.current); };
  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => { if (!isOpen || flipDirection) return; dragStartRef.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); };
  const handleDragEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current; dragStartRef.current = null;
    if (!start || !isOpen || flipDirection) return;
    const dx = event.clientX - start.x; const dy = event.clientY - start.y; const mobile = window.matchMedia('(max-width: 760px)').matches;
    if (mobile) { if (dy < -44 || dx < -54) requestSpreadChange(spreadIndex + 1); if (dy > 44 || dx > 54) requestSpreadChange(spreadIndex - 1); return; }
    if (dx < -54) requestSpreadChange(spreadIndex + 1); if (dx > 54) requestSpreadChange(spreadIndex - 1);
  };

  const currentSpread = spreads[spreadIndex];
  const targetSpread = pendingSpread !== null ? spreads[pendingSpread] : currentSpread;
  const baseLeftPage = flipDirection ? targetSpread.left : currentSpread.left;
  const baseRightPage = flipDirection ? targetSpread.right : currentSpread.right;
  const turningFrontPage = currentSpread.right;
  const turningBackPage = targetSpread.right;
  const spreadLabel = !isOpen ? (isSpanish ? 'Portada' : 'Cover') : spreadIndex === 0 ? (isSpanish ? 'Vuelos + trenes' : 'Flights + trains') : (isSpanish ? 'Día de la boda' : 'Wedding day');

  return (
    <div className={`passport-wrap ${isSpanish ? 'passport-spain' : 'passport-usa'}`}>
      <div className="passport-topline"><span>{isSpanish ? 'Guía de viaje' : 'Travel guide'}</span><span>{spreadLabel}</span></div>
      <div className={`passport-stage ${isOpen ? 'is-open' : 'is-closed'}`}>
        <div className="passport-table-shadow" aria-hidden="true" />
        <div className={`passport-book ${flipDirection ? `is-flipping is-${flipDirection}` : ''}`}>
          <div className="passport-cover-base" aria-hidden="true" />
          <div className="passport-page-stack passport-page-stack-left" aria-hidden="true" />
          <div className="passport-page-stack passport-page-stack-right" aria-hidden="true" />
          <div className="passport-gutter" aria-hidden="true" />
          <div className="passport-spread" aria-hidden={!isOpen} onPointerDown={handleDragStart} onPointerUp={handleDragEnd} onPointerCancel={() => { dragStartRef.current = null; }}>
            <PageSurface page={baseLeftPage} isSpanish={isSpanish} side="left" compact />
            <PageSurface page={baseRightPage} isSpanish={isSpanish} side="right" />
            {flipDirection && (
              <div className={`passport-turning-sheet passport-turning-sheet-${flipDirection}`} aria-hidden="true">
                <div className="passport-turning-bend passport-turning-bend-a" />
                <div className="passport-turning-bend passport-turning-bend-b" />
                <div className="passport-turning-face passport-turning-front">{turningFrontPage ? <PassportPageFace page={turningFrontPage} isSpanish={isSpanish} compact /> : <PassportBlankPage isSpanish={isSpanish} />}</div>
                <div className="passport-page-edge" />
                <div className="passport-turning-face passport-turning-back"><PassportPageFace page={turningBackPage} isSpanish={isSpanish} compact /></div>
              </div>
            )}
            <div className="passport-drag-hint" aria-hidden="true">{isSpanish ? 'Desliza para pasar página' : 'Swipe to turn page'}</div>
          </div>
          <button type="button" className="passport-front-cover" aria-label={isSpanish ? 'Abrir pasaporte' : 'Open passport'} onClick={() => setIsOpen(true)}>
            <span className="passport-cover-border" aria-hidden="true" />
            <span className="passport-cover-country">SALAMANCA</span>
            <span className="passport-cover-crest" aria-hidden="true"><img src={boLogo} alt="" /></span>
            <span className="passport-cover-type">{isSpanish ? 'PASAPORTE' : 'PASSPORT'}</span>
            <span className="passport-cover-epass" aria-hidden="true"><span className="passport-cover-epass-line passport-cover-epass-line-top" /><span className="passport-cover-epass-chip" /><span className="passport-cover-epass-line passport-cover-epass-line-bottom" /></span>
          </button>
        </div>
      </div>
      <div className="passport-controls">
        <button onClick={closePassport} disabled={!isOpen || Boolean(flipDirection)} aria-label={isSpanish ? 'Volver a la portada' : 'Back to cover'}><BookOpen size={16} />{isSpanish ? 'Portada' : 'Cover'}</button>
        <div className="passport-pagination">{spreads.map((spread, index) => <button key={spread.right.id} className={index === spreadIndex && isOpen ? 'active' : ''} onClick={() => requestSpreadChange(index)} aria-label={`${isSpanish ? 'Página' : 'Page'} ${index + 1}`} />)}</div>
        <div className="passport-controls-right">
          <button onClick={() => requestSpreadChange(spreadIndex - 1)} disabled={!isOpen || spreadIndex === 0 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página anterior' : 'Previous page'}><ChevronLeft size={17} />{isSpanish ? 'Anterior' : 'Previous'}</button>
          <button onClick={() => requestSpreadChange(spreadIndex + 1)} disabled={!isOpen || spreadIndex === spreads.length - 1 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página siguiente' : 'Next page'}>{isSpanish ? 'Siguiente' : 'Next'}<ChevronRight size={17} /></button>
        </div>
      </div>
    </div>
  );
}
