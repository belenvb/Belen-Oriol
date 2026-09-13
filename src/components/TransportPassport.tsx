import type { MouseEvent, PointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
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
type FlipDirection = 'next' | 'previous' | null;
const decorativeLine = 'B&O  WEDDING GUIDE  SALAMANCA  CASTILLO DEL BUEN AMOR  2027';

function BlankCastlePage({ isSpanish }: { isSpanish: boolean }) {
  return (
    <>
      <div className="passport-security-lines passport-security-lines-a" aria-hidden="true" />
      <div className="passport-security-lines passport-security-lines-b" aria-hidden="true" />
      <div className="passport-paper-grain" aria-hidden="true" />
      <div className="passport-page-inner passport-blank-page-inner">
        <span className="passport-page-overline">{isSpanish ? 'GUÍA DE VIAJE · PÁG. 03' : 'TRAVEL GUIDE · PG. 03'}</span>
        <div className="passport-castle-sketch-wrap">
          <img className="passport-castle-sketch" src="/castle-sketch.svg" alt={isSpanish ? 'Ilustración del castillo' : 'Castle illustration'} />
        </div>
        <p className="passport-castle-caption">Castillo del Buen Amor</p>
        <div className="passport-machine-line" aria-hidden="true">{decorativeLine}</div>
        <div className="passport-page-footer"><span>{isSpanish ? 'Ilustración del lugar' : 'Venue illustration'}</span><span>[--]</span></div>
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
        <div className="passport-machine-line" aria-hidden="true">{decorativeLine}</div>
        <div className="passport-page-footer"><span>{page.title}</span><span>[{page.num}/03]</span></div>
      </div>
    </>
  );
}

function PageSurface({ page, side, isSpanish, compact = false, blankCastle = false }: { page?: PageData; side: 'left' | 'right'; isSpanish: boolean; compact?: boolean; blankCastle?: boolean }) {
  return (
    <div className={`passport-page passport-page-${side} ${!page ? 'passport-page-empty' : ''}`}>
      {blankCastle || !page ? <BlankCastlePage isSpanish={isSpanish} /> : <PassportPageFace page={page} isSpanish={isSpanish} compact={compact} />}
    </div>
  );
}

export function TransportPassport({ lang }: { lang: Language }) {
  const isSpanish = lang === 'es';
  const numericDate = isSpanish ? '04.09.2027' : '09.04.2027';
  const [isOpen, setIsOpen] = useState(false);
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pendingSpread, setPendingSpread] = useState<number | null>(null);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>(null);
  const timerRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragTriggeredRef = useRef(false);

  const pages = useMemo(() => {
    const flights: PageData = {
      id: 'flights',
      num: '01',
      icon: Plane,
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos' : 'Flights',
      subtitle: 'MADRID · VALLADOLID',
      card1Title: 'Madrid-Barajas (MAD)',
      card1Distance: isSpanish ? '220 km a Salamanca · ~2 h en coche / 1 h 35 min en tren' : '220 km / 137 miles to Salamanca · ~2 hr drive / 1 hr 35 min train',
      card1Text: isSpanish ? 'Madrid es la opción con más vuelos internacionales. Desde la T4 se puede conectar con Chamartín y tomar el Alvia directo a Salamanca.' : 'Madrid is the airport with the widest international connections. From T4, connect to Chamartín and take the direct Alvia train to Salamanca.',
      card2Title: 'Valladolid (VLL)',
      card2Distance: isSpanish ? '115 km a Salamanca · ~1 h en coche / 45 min en tren' : '115 km / 71 miles to Salamanca · ~1 hr drive / 45 min train',
      card2Text: isSpanish ? 'Valladolid puede ser una alternativa cómoda para vuelos desde Barcelona y conexiones nacionales.' : 'Valladolid can be a convenient alternative for flights from Barcelona and domestic connections.',
      tagline: isSpanish ? 'Dos aeropuertos posibles según origen y disponibilidad' : 'Two airport options depending on origin and availability',
      stampText: `AEROPUERTO · ${numericDate}`,
      stampSub: 'ENTRY / ENTRADA',
    };

    const trains: PageData = {
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
      stampText: `SALAMANCA · ${numericDate}`,
      stampSub: 'TRANSIT / TRÁNSITO',
    };

    const wedding: PageData = {
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
      stampText: `BUEN AMOR · ${numericDate}`,
      stampSub: 'ARRIVAL / LLEGADA',
    };

    return { flights, trains, wedding };
  }, [isSpanish, numericDate]);

  const spreads: Spread[] = useMemo(() => [
    { left: pages.flights, right: pages.trains },
    { left: undefined, right: pages.wedding },
  ], [pages]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const requestSpreadChange = (nextSpread: number) => {
    const safe = Math.max(0, Math.min(spreads.length - 1, nextSpread));
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    if (safe === spreadIndex || flipDirection) return;
    setPendingSpread(safe);
    setFlipDirection(safe > spreadIndex ? 'next' : 'previous');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setSpreadIndex(safe);
      setPendingSpread(null);
      setFlipDirection(null);
    }, 920);
  };

  const handleDragStart = (event: PointerEvent<HTMLDivElement>) => {
    if (!isOpen || flipDirection) return;
    dragTriggeredRef.current = false;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragStartRef.current;
    dragStartRef.current = null;
    if (!start || !isOpen || flipDirection) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const shouldGoNext = mobile ? dy < -38 || dx < -48 : dx < -52;
    const shouldGoPrevious = mobile ? dy > 38 || dx > 48 : dx > 52;
    if (shouldGoNext && spreadIndex < spreads.length - 1) {
      dragTriggeredRef.current = true;
      requestSpreadChange(spreadIndex + 1);
    } else if (shouldGoPrevious && spreadIndex > 0) {
      dragTriggeredRef.current = true;
      requestSpreadChange(spreadIndex - 1);
    }
  };

  const handleSpreadClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isOpen || flipDirection) return;
    if (dragTriggeredRef.current) {
      dragTriggeredRef.current = false;
      return;
    }
    const target = event.target;
    if (target instanceof Element && target.closest('a, button')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const nextZone = mobile ? event.clientY < rect.top + rect.height / 2 || event.clientX > rect.left + rect.width / 2 : event.clientX > rect.left + rect.width / 2;
    if (nextZone && spreadIndex < spreads.length - 1) requestSpreadChange(spreadIndex + 1);
    if (!nextZone && spreadIndex > 0) requestSpreadChange(spreadIndex - 1);
  };

  const closePassport = () => {
    if (flipDirection) return;
    setIsOpen(false);
    setSpreadIndex(0);
    setPendingSpread(null);
    setFlipDirection(null);
  };

  const currentSpread = spreads[spreadIndex];
  const targetSpread = pendingSpread !== null ? spreads[pendingSpread] : currentSpread;

  const baseLeftPage = !flipDirection ? currentSpread.left : flipDirection === 'next' ? currentSpread.left : targetSpread.left;
  const baseRightPage = !flipDirection ? currentSpread.right : flipDirection === 'next' ? targetSpread.right : currentSpread.right;

  const turningBackBlank = flipDirection === 'next';
  const turningFrontPage = currentSpread.right;
  const turningBackPage = flipDirection === 'next' ? undefined : targetSpread.right;
  const showLeftHint = isOpen && spreadIndex === spreads.length - 1 && !flipDirection;

  return (
    <div className={`passport-wrap ${isSpanish ? 'passport-spain' : 'passport-usa'}`}>
      <div className={`passport-stage ${isOpen ? 'is-open' : 'is-closed'}`}>
        <div className="passport-table-shadow" aria-hidden="true" />

        {!isOpen && (
          <aside className="passport-side-note" aria-hidden="true">
            <span className="passport-side-note-label">{isSpanish ? 'Ubicación' : 'Location'}</span>
            <img src="/spain-map-sketch.svg" alt="" className="passport-side-note-map" />
          </aside>
        )}

        <div className={`passport-book ${flipDirection ? `is-flipping is-${flipDirection}` : ''}`}>
          <div className="passport-cover-base" aria-hidden="true" />
          <div className="passport-page-stack passport-page-stack-left" aria-hidden="true" />
          <div className="passport-page-stack passport-page-stack-right" aria-hidden="true" />
          <div className="passport-gutter" aria-hidden="true" />

          <button type="button" className="passport-front-cover" aria-label={isSpanish ? 'Abrir guía de viaje' : 'Open travel guide'} onClick={() => setIsOpen(true)}>
            <span className="passport-cover-guide">TRAVEL GUIDE</span>
            <span className="passport-cover-country">SALAMANCA</span>
            <span className="passport-cover-crest"><img src={boLogo} alt="" /></span>
            <span className="passport-cover-type">{isSpanish ? 'PASAPORTE' : 'PASSPORT'}</span>
            <span className="passport-cover-epass" aria-hidden="true"><span className="passport-cover-epass-line passport-cover-epass-line-top" /><span className="passport-cover-epass-chip" /><span className="passport-cover-epass-line passport-cover-epass-line-bottom" /></span>
          </button>

          <div className="passport-spread" aria-hidden={!isOpen} onClick={handleSpreadClick} onPointerDown={handleDragStart} onPointerUp={handleDragEnd} onPointerCancel={() => { dragStartRef.current = null; }}>
            <PageSurface page={baseLeftPage} side="left" isSpanish={isSpanish} compact blankCastle={!baseLeftPage && (spreadIndex === 1 || pendingSpread === 1)} />
            <PageSurface page={baseRightPage} side="right" isSpanish={isSpanish} />

            {flipDirection && (
              <div className={`passport-turning-sheet passport-turning-sheet-${flipDirection}`} aria-hidden="true">
                <div className="passport-turning-bend passport-turning-bend-a" />
                <div className="passport-turning-bend passport-turning-bend-b" />
                <div className="passport-turning-face passport-turning-front"><PassportPageFace page={turningFrontPage} isSpanish={isSpanish} compact /></div>
                <div className="passport-page-edge" />
                <div className="passport-turning-face passport-turning-back">
                  {turningBackBlank ? <BlankCastlePage isSpanish={isSpanish} /> : turningBackPage ? <PassportPageFace page={turningBackPage} isSpanish={isSpanish} compact /> : <BlankCastlePage isSpanish={isSpanish} />}
                </div>
              </div>
            )}

            <div className={`passport-drag-hint ${showLeftHint ? 'is-left' : 'is-right'}`} aria-hidden="true">
              {isSpanish ? 'Haz clic o desliza para pasar página' : 'Click or swipe to turn page'}
            </div>
          </div>
        </div>
      </div>

      <div className="passport-controls">
        <button onClick={closePassport} disabled={!isOpen || Boolean(flipDirection)} aria-label={isSpanish ? 'Volver a la portada' : 'Back to cover'}><BookOpen size={16} />{isSpanish ? 'Portada' : 'Cover'}</button>
        <div className="passport-pagination">
          {spreads.map((spread, index) => (
            <button key={spread.right.id} className={index === spreadIndex && isOpen ? 'active' : ''} onClick={() => requestSpreadChange(index)} aria-label={`${isSpanish ? 'Página' : 'Page'} ${index + 1}`} />
          ))}
        </div>
        <div className="passport-controls-right">
          <button onClick={() => requestSpreadChange(spreadIndex - 1)} disabled={!isOpen || spreadIndex === 0 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página anterior' : 'Previous page'}><ChevronLeft size={17} />{isSpanish ? 'Anterior' : 'Previous'}</button>
          <button onClick={() => requestSpreadChange(spreadIndex + 1)} disabled={!isOpen || spreadIndex === spreads.length - 1 || Boolean(flipDirection)} aria-label={isSpanish ? 'Página siguiente' : 'Next page'}>{isSpanish ? 'Siguiente' : 'Next'}<ChevronRight size={17} /></button>
        </div>
      </div>
    </div>
  );
}
