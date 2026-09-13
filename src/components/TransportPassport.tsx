import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  Train,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { Language } from '../types';

interface TransportPassportProps {
  lang: Language;
}

type PageIndex = 0 | 1 | 2;

export function TransportPassport({ lang }: TransportPassportProps) {
  const [currentPage, setCurrentPage] = useState<PageIndex>(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const containerRef = useRef<HTMLDivElement>(null);

  const isSpanish = lang === 'es';

  // Date stamps formatted for locale: DD.MM.YYYY for ES, MM.DD.YYYY for EN
  const dateFormatted = isSpanish ? '04.09.2027' : '09.04.2027';

  // Passport pages data with all road names removed, singular bus return, 25 min distance to castle
  const pages = [
    {
      id: 'flights',
      num: '01',
      pageLabel: isSpanish ? 'VISADO AÉREO · PÁG. 01' : 'AIR TRAVEL VISA · PG. 01',
      icon: Plane,
      iconRotate: '-rotate-45',
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos & Aeropuertos' : 'Flights & Airports',
      subtitle: isSpanish ? 'MADRID-BARAJAS & VALLADOLID' : 'MADRID-BARAJAS & VALLADOLID',
      card1Title: isSpanish ? 'Madrid-Barajas (MAD) → Salamanca:' : 'Madrid-Barajas (MAD) → Salamanca:',
      card1Distance: isSpanish ? '220 km (~2h en coche / 1h 35m en tren directo)' : '220 km (137 miles) · ~2h drive / 1h 35m direct train',
      card1Text: isSpanish
        ? 'El aeropuerto internacional de Madrid-Barajas se encuentra a 220 km de Salamanca. Desde la Terminal 4 existe tren directo de Cercanías hasta la estación de Madrid-Chamartín en solo 12-15 minutos.'
        : 'Madrid-Barajas Airport is 220 km (137 miles) from Salamanca. Ideal for international arrivals. From Terminal 4, commuter trains connect directly to Madrid-Chamartín station in just 12-15 minutes.',
      card2Title: isSpanish ? 'Barcelona ✈ Valladolid (VLL):' : 'Barcelona ✈ Valladolid (VLL):',
      card2Distance: isSpanish ? '115 km a Salamanca (~1h en coche / 45 min en tren)' : '115 km (71 miles) · ~1h drive / 45m train',
      card2Text: isSpanish
        ? 'Vuelos directos Barcelona (BCN) – Valladolid (VLL). Desde Valladolid a Salamanca hay tren directo en ~45 min o cómodo trayecto por autovía en ~1 hora.'
        : 'Direct flights Barcelona (BCN) to Valladolid (VLL). From Valladolid to Salamanca: direct train in ~45 min or easy highway drive in ~1 hour.',
      tagline: isSpanish
        ? 'Distancia Madrid-Salamanca: 220 km · Tren directo Alvia o autovía'
        : 'Madrid-Salamanca distance: 220 km (137 miles) · Direct Alvia train or highway',
      stampText: `AEROPUERTO · ${dateFormatted}`,
      stampSub: 'CONTROL DE ENTRADA / ENTRY',
    },
    {
      id: 'trains',
      num: '02',
      pageLabel: isSpanish ? 'TREN & CARRETERA · PÁG. 02' : 'TRAIN & DRIVING · PG. 02',
      icon: Train,
      iconRotate: '',
      badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING',
      title: isSpanish ? 'Llegada a Salamanca' : 'Arrival in Salamanca',
      subtitle: isSpanish ? 'TREN RÁPIDO ALVIA & AUTOVÍAS DIRECTAS' : 'DIRECT ALVIA TRAIN & HIGHWAY DRIVE',
      card1Title: isSpanish ? 'Madrid – Salamanca en Tren:' : 'Madrid – Salamanca by Train:',
      card1Distance: isSpanish ? '1h 35m trayecto directo' : '1h 35m direct high-speed journey',
      card1Text: isSpanish
        ? 'Tren Alvia (Renfe) directo desde la estación de Madrid-Chamartín hasta la estación de Salamanca en 1h 35m con varias frecuencias diarias.'
        : 'Direct high-speed Alvia train from Madrid-Chamartín Station to central Salamanca in 1h 35m with frequent daily departures.',
      card1Link: {
        url: 'https://www.renfe.com',
        text: isSpanish ? 'Consultar billetes y horarios en Renfe.com' : 'Check schedules & tickets on Renfe.com',
      },
      card2Title: isSpanish ? 'Barcelona / Trayecto en Coche:' : 'Barcelona / Driving Route:',
      card2Distance: isSpanish ? 'Autovía directa sin peajes' : 'Direct toll-free highway connection',
      card2Text: isSpanish
        ? 'En tren: Alvia directo o trenes con enlace en Madrid (Chamartín) en ~5h 30m. En coche: cómodo trayecto por autovía directa desde Madrid (~2 horas / 220 km).'
        : 'By train: direct Alvia or connecting train in Madrid (~5h 30m). By car: smooth, direct highway drive from Madrid (~2 hours / 137 miles) with easy signage.',
      tagline: isSpanish
        ? 'Trenes Alvia diarios y conexión directa por autovía'
        : 'Daily Alvia high-speed trains & direct highway routes',
      stampText: `ESTACIÓN SALAMANCA · ${dateFormatted}`,
      stampSub: 'TRÁNSITO FERROVIARIO',
    },
    {
      id: 'castle',
      num: '03',
      pageLabel: isSpanish ? 'DÍA DE LA BODA · PÁG. 03' : 'WEDDING DAY · PG. 03',
      icon: MapPin,
      iconRotate: '',
      badge: isSpanish ? 'DÍA DE LA BODA' : 'WEDDING DAY',
      title: isSpanish ? 'Castillo del Buen Amor' : 'Castillo del Buen Amor',
      subtitle: isSpanish ? 'SEDE DE LA CEREMONIA & BANQUETE' : 'CEREMONY & RECEPTION VENUE',
      card1Title: isSpanish ? 'Servicio de Autobús:' : 'Guest Shuttle Bus:',
      card1Distance: isSpanish ? 'Salamanca ⇄ Castillo (Incluido)' : 'Salamanca ⇄ Castle (Included)',
      card1Text: isSpanish
        ? 'Servicio de autobús el sábado 4 entre Salamanca y el castillo para la ceremonia y el banquete, con servicio de regreso al finalizar la fiesta.'
        : 'Complimentary guest shuttle bus on Saturday between Salamanca and the castle for the ceremony and reception, with return service after the party.',
      card2Title: isSpanish ? 'En Coche o Taxi:' : 'By Car or Taxi:',
      card2Distance: isSpanish ? '20 km al norte (~25 min)' : '20 km (12.5 miles) north · ~25 min',
      card2Text: isSpanish
        ? 'Situado a 20 km al norte de Salamanca (unos 25 minutos en coche o taxi). El castillo dispone de amplio aparcamiento privado gratuito para todos los invitados.'
        : 'Located 20 km (12.5 miles) north of central Salamanca (~25 minutes by car or taxi). Free private on-site parking is available for all wedding guests.',
      tagline: isSpanish
        ? 'A 25 minutos de Salamanca · Autobús de invitados y parking privado'
        : '25 minutes from Salamanca · Guest shuttle & free parking',
      stampText: `CASTILLO BUEN AMOR · ${dateFormatted}`,
      stampSub: 'SELLO OFICIAL DE ENTRADA',
    },
  ];

  const handleNextPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('next');
    setCurrentPage((prev) => ((prev + 1) % 3) as PageIndex);
    setTimeout(() => setIsFlipping(false), 600);
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('prev');
    setCurrentPage((prev) => ((prev - 1 + 3) % 3) as PageIndex);
    setTimeout(() => setIsFlipping(false), 600);
  };

  const handleSelectPage = (idx: PageIndex) => {
    if (isFlipping || idx === currentPage) return;
    setIsFlipping(true);
    setFlipDirection(idx > currentPage ? 'next' : 'prev');
    setCurrentPage(idx);
    setTimeout(() => setIsFlipping(false), 600);
  };

  // Scroll wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (isFlipping) return;
    if (e.deltaY > 50 && currentPage < 2) {
      handleNextPage();
    } else if (e.deltaY < -50 && currentPage > 0) {
      handlePrevPage();
    }
  };

  const currentPageData = pages[currentPage];
  const previousPageData = currentPage > 0 ? pages[currentPage - 1] : null;

  // Passport cover color styling:
  // Spanish: Deep Burgundy / Granate with Gold Stamping
  // English: US Navy Blue with Gold Stamping
  const coverTheme = isSpanish
    ? {
        outerBg: 'bg-[#2b080e]',
        outerGradient: 'from-[#380b13] via-[#24060b] to-[#160307]',
        spineLeather: 'bg-[#1e0509]',
        leatherBorder: 'border-[#1a0407]',
        stitchColor: 'border-[#dfc285]/50',
        tabActiveBg: 'bg-[#380b13] text-[#dfc285] border-[#dfc285]',
        passportCode: 'BO-040927',
        countryName: 'GUÍA DE VIAJE',
        countrySub: 'BELÉN & ORIOL · SALAMANCA',
        accentColor: 'text-[#5c141e]',
        badgeBg: 'bg-[#5c141e]/10 text-[#5c141e]',
        stampBorder: 'border-[#74182a]/75',
        stampText: 'text-[#74182a]',
      }
    : {
        outerBg: 'bg-[#0a182c]',
        outerGradient: 'from-[#0e223d] via-[#081527] to-[#040c17]',
        spineLeather: 'bg-[#050e1a]',
        leatherBorder: 'border-[#030912]',
        stitchColor: 'border-[#dfc285]/55',
        tabActiveBg: 'bg-[#0e223d] text-[#dfc285] border-[#dfc285]',
        passportCode: 'BO-090427',
        countryName: 'TRAVEL GUIDE',
        countrySub: 'BELÉN & ORIOL · SALAMANCA',
        accentColor: 'text-[#0e2e5c]',
        badgeBg: 'bg-[#0e2e5c]/10 text-[#0e2e5c]',
        stampBorder: 'border-[#0e2e5c]/75',
        stampText: 'text-[#0e2e5c]',
      };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="w-full max-w-4xl mx-auto select-none py-3"
    >
      {/* Top Passport Page Selector Tabs */}
      <div className="flex items-center justify-between gap-3 mb-2.5 px-2 sm:px-4">
        {/* Visa Section Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          {pages.map((p, idx) => {
            const Icon = p.icon;
            const isActive = idx === currentPage;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPage(idx as PageIndex)}
                className={`relative px-3 sm:px-5 py-2 rounded-t-xl text-xs font-cinzel font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? `${coverTheme.tabActiveBg} shadow-lg border-t-2 border-x-2 -mb-[1px] z-30`
                    : 'bg-[#8c6d4f]/20 text-[#5c141e] hover:bg-[#8c6d4f]/35 border-t border-x border-[#8c6d4f]/30'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#dfc285]' : 'text-[#5c141e]'} ${p.iconRotate}`} />
                <span className="hidden sm:inline">{p.badge}</span>
                <span className="sm:hidden">{p.num}</span>
              </button>
            );
          })}
        </div>

        {/* Page Switcher & Counter */}
        <div
          className={`flex items-center gap-1.5 text-[#dfc285] px-3.5 py-1.5 rounded-full border border-[#dfc285]/40 text-xs font-mono shadow-md ${
            isSpanish ? 'bg-[#2b080e]' : 'bg-[#0a182c]'
          }`}
        >
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`p-1 transition-colors cursor-pointer ${
              currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'
            }`}
            aria-label="Previous passport page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-1.5 font-bold tracking-wider">
            {currentPageData.num} / 03
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === 2}
            className={`p-1 transition-colors cursor-pointer ${
              currentPage === 2 ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'
            }`}
            aria-label="Next passport page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC PHYSICAL PASSPORT BOOKLET                                      */}
      {/* Realistic landscape dimensions, embossed leather cover, saddle stitch     */}
      {/* ========================================================================= */}
      <div
        className={`relative rounded-2xl md:rounded-3xl p-3.5 sm:p-5 md:p-6 bg-gradient-to-b ${coverTheme.outerGradient} border-4 ${coverTheme.leatherBorder} shadow-[0_25px_60px_rgba(0,0,0,0.65)] transition-colors duration-500`}
      >
        {/* Leather Grain Texture & Gold Thread Saddle-Stitching */}
        <div
          className={`absolute inset-1.5 sm:inset-2 border-2 border-dashed ${coverTheme.stitchColor} rounded-xl pointer-events-none opacity-80`}
        />

        {/* Passport Booklet Interior Open Spread */}
        <div className="relative flex flex-col rounded-xl overflow-hidden shadow-2xl bg-[#f4ebe0] border border-[#d6c7b2]">
          
          {/* ===================================================================== */}
          {/* TOP PAGE / BOOKLET SPINE: EMBLEM SEAL & PREVIOUS LIFTED SPREAD        */}
          {/* ===================================================================== */}
          <div className="relative bg-[#ebdfcb] px-4 sm:px-6 py-3 border-b border-[#c4b194] flex items-center justify-between overflow-hidden shadow-xs">
            {/* Fine Guilloché Watermark Background */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="passport-header-waves" width="50" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 0,6 Q 12.5,0 25,6 T 50,6" fill="none" stroke="#8c6d4f" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#passport-header-waves)" />
              </svg>
            </div>

            {/* Left: Golden Passport Crest Seal */}
            <div className="relative z-10 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full border border-[#dfc285] flex items-center justify-center font-cinzel font-bold text-xs shadow-xs shrink-0 ${
                  isSpanish ? 'bg-[#380b13] text-[#dfc285]' : 'bg-[#0e223d] text-[#dfc285]'
                }`}
              >
                BO
              </div>
              <div>
                <div className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#37080e]">
                  {coverTheme.countryName}
                </div>
                <div className="text-[9px] font-mono tracking-widest text-[#8c6d4f]">
                  {coverTheme.countrySub}
                </div>
              </div>
            </div>

            {/* Right: Folio & Previous Page Status */}
            <div className="relative z-10 flex items-center gap-3">
              {currentPage > 0 && previousPageData ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-dashed text-[10px] font-mono font-bold tracking-wider uppercase ${coverTheme.stampBorder} ${coverTheme.stampText} bg-white/50`}
                  >
                    <span>✓ {isSpanish ? 'PÁG.' : 'PG.'} {previousPageData.num}</span>
                  </div>
                  <button
                    onClick={handlePrevPage}
                    className="text-[11px] font-mono text-[#8c6d4f] hover:text-[#37080e] underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span className="hidden sm:inline">{isSpanish ? 'Página anterior' : 'Previous page'}</span>
                  </button>
                </div>
              ) : (
                <div className="text-right font-mono text-[10px] text-[#8c6d4f] tracking-widest">
                  <span>FOLIO: {coverTheme.passportCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* BOOKLET PHYSICAL SPINE HINGE WITH GOLD THREAD STITCHES                */}
          {/* ===================================================================== */}
          <div className="relative h-4 bg-gradient-to-b from-[#d5c5b1] via-[#beac96] to-[#dfd2be] flex items-center justify-center shadow-inner z-20">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-[#9e8971]" />
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-[#b19e85]" />
            <div className="flex items-center gap-3 px-4 w-full justify-between opacity-75 pointer-events-none">
              {[...Array(14)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-[1.5px] bg-[#dfc285] rounded-full shadow-2xs"
                />
              ))}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PHYSICAL PAGE LEAF CONTAINER (BOOKLET PAGE TURNING PERSPECTIVE)       */}
          {/* ===================================================================== */}
          <div
            className="relative bg-[#fcf8f1] p-5 sm:p-7 md:p-8 min-h-[385px] sm:min-h-[365px] flex flex-col justify-between overflow-hidden"
            style={{ perspective: '1400px' }}
          >
            {/* Background Security Guilloché & Official Rubber Stamp Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
              <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 800 450"
                preserveAspectRatio="none"
              >
                {/* Guilloche safety ribbons */}
                <g stroke="#8c6d4f" fill="none" opacity="0.28" strokeWidth="0.7">
                  <path d="M 0,20 Q 200,60 400,20 T 800,20" />
                  <path d="M 0,65 Q 200,105 400,65 T 800,65" />
                  <path d="M 0,115 Q 200,75 400,115 T 800,115" />
                  <path d="M 0,175 Q 200,215 400,175 T 800,175" />
                  <path d="M 0,235 Q 200,195 400,235 T 800,235" />
                  <path d="M 0,295 Q 200,335 400,295 T 800,295" />
                  <path d="M 0,355 Q 200,315 400,355 T 800,355" />
                  <path d="M 0,415 Q 200,455 400,415 T 800,415" />
                </g>

                {/* Circular Visa Stamp in background */}
                <g
                  transform="translate(710, 110) rotate(-10)"
                  opacity="0.2"
                  stroke={isSpanish ? '#5c141e' : '#0e2e5c'}
                  fill="none"
                >
                  <circle cx="0" cy="0" r="48" strokeWidth="2" />
                  <circle cx="0" cy="0" r="40" strokeWidth="0.8" strokeDasharray="3,2" />
                  <text
                    x="0"
                    y="-22"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="7"
                    fontWeight="bold"
                    fill={isSpanish ? '#5c141e' : '#0e2e5c'}
                    letterSpacing="1.5"
                  >
                    SALAMANCA
                  </text>
                  <text
                    x="0"
                    y="28"
                    textAnchor="middle"
                    fontFamily="monospace"
                    fontSize="7"
                    fontWeight="bold"
                    fill={isSpanish ? '#5c141e' : '#0e2e5c'}
                    letterSpacing="1.5"
                  >
                    {dateFormatted}
                  </text>
                </g>
              </svg>
            </div>

            {/* =================================================================== */}
            {/* REALISTIC 3D PAGE PEEL / LIFT ANIMATION                             */}
            {/* Page lifts upwards with physical paper bend, shadow and curl        */}
            {/* =================================================================== */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{
                  rotateX: flipDirection === 'next' ? 65 : -65,
                  rotateY: flipDirection === 'next' ? 4 : -4,
                  y: flipDirection === 'next' ? 35 : -35,
                  opacity: 0,
                  transformOrigin: 'top center',
                  boxShadow: '0 -20px 30px rgba(0,0,0,0.3)',
                }}
                animate={{
                  rotateX: 0,
                  rotateY: 0,
                  y: 0,
                  opacity: 1,
                  transformOrigin: 'top center',
                  boxShadow: '0 0 0 rgba(0,0,0,0)',
                }}
                exit={{
                  rotateX: flipDirection === 'next' ? -75 : 75,
                  rotateY: flipDirection === 'next' ? -6 : 6,
                  y: flipDirection === 'next' ? -40 : 40,
                  opacity: 0,
                  transformOrigin: 'top center',
                  boxShadow: '0 -30px 45px rgba(0,0,0,0.4)',
                }}
                transition={{
                  duration: 0.52,
                  ease: [0.22, 1, 0.36, 1], // Natural paper spring-damped motion
                }}
                className="relative z-10 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Page Top Header with Badge & Visa Rubber Stamp */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full border border-[#dfc285] bg-white flex items-center justify-center shadow-xs ${coverTheme.accentColor}`}
                      >
                        {React.createElement(currentPageData.icon, {
                          className: `w-4 h-4 ${currentPageData.iconRotate}`,
                        })}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] tracking-widest text-[#8c6d4f] uppercase block">
                          {currentPageData.pageLabel}
                        </span>
                        <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#37080e] leading-tight">
                          {currentPageData.title}
                        </h3>
                      </div>
                    </div>

                    {/* Official Inked Visa Entry Rubber Stamp */}
                    <div
                      className={`border-2 border-dashed rounded-lg px-2.5 py-1 text-center font-mono text-[9px] font-bold tracking-wider uppercase rotate-[-3deg] shadow-2xs ${coverTheme.stampBorder} ${coverTheme.stampText} bg-white/60`}
                    >
                      <div>{currentPageData.stampText}</div>
                      <div className="text-[7.5px] opacity-75">{currentPageData.stampSub}</div>
                    </div>
                  </div>

                  {/* Horizontal 2-Card Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-3.5">
                    {/* Card 1 */}
                    <div className="p-4 sm:p-5 rounded-xl bg-white/75 border border-[#8c6d4f]/25 shadow-xs backdrop-blur-xs flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-[#37080e] mb-1">
                          {currentPageData.card1Title}
                        </h4>
                        {currentPageData.card1Distance && (
                          <div
                            className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-mono font-bold tracking-wider mb-2 ${coverTheme.badgeBg}`}
                          >
                            📍 {currentPageData.card1Distance}
                          </div>
                        )}
                        <p className="text-xs text-[#44403c] leading-relaxed">
                          {currentPageData.card1Text}
                        </p>
                      </div>
                      {currentPageData.card1Link && (
                        <div className="mt-2.5 pt-2 border-t border-[#8c6d4f]/15">
                          <a
                            href={currentPageData.card1Link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors underline underline-offset-2 ${
                              isSpanish
                                ? 'text-[#5c141e] hover:text-[#b89243]'
                                : 'text-[#0e2e5c] hover:text-[#b89243]'
                            }`}
                          >
                            <span>{currentPageData.card1Link.text}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Card 2 */}
                    <div className="p-4 sm:p-5 rounded-xl bg-white/75 border border-[#8c6d4f]/25 shadow-xs backdrop-blur-xs flex flex-col justify-between">
                      <div>
                        <h4 className="font-sans font-bold text-xs sm:text-sm text-[#37080e] mb-1">
                          {currentPageData.card2Title}
                        </h4>
                        {currentPageData.card2Distance && (
                          <div
                            className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-mono font-bold tracking-wider mb-2 ${coverTheme.badgeBg}`}
                          >
                            📍 {currentPageData.card2Distance}
                          </div>
                        )}
                        <p className="text-xs text-[#44403c] leading-relaxed">
                          {currentPageData.card2Text}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Tagline */}
                  <div
                    className={`flex items-center gap-2 text-xs font-bold pt-1.5 border-t border-[#8c6d4f]/20 ${coverTheme.accentColor}`}
                  >
                    <Compass className="w-3.5 h-3.5 text-[#b89243]" />
                    <span>{currentPageData.tagline}</span>
                  </div>
                </div>

                {/* Bottom Passport Page Footer & Realistic Page Peel Button */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#8c6d4f]/20 text-[10px] font-mono tracking-widest text-[#8c6d3b] uppercase">
                  <div className="flex items-center gap-2">
                    <span>BELÉN &amp; ORIOL</span>
                    <span>· {dateFormatted}</span>
                  </div>

                  {/* Turn / Next Page Button with Page Lift Visual */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleNextPage}
                      className={`group relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#dfc285]/35 hover:bg-[#dfc285]/55 border border-[#b89243]/60 text-xs font-sans font-bold cursor-pointer transition-all shadow-2xs hover:shadow-xs active:scale-95 ${coverTheme.accentColor}`}
                      title={
                        isSpanish
                          ? 'Pasar a la siguiente página'
                          : 'Go to next page'
                      }
                    >
                      <span>{isSpanish ? 'Siguiente página' : 'Next page'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <span
                      className={`font-bold text-xs font-mono ${coverTheme.accentColor}`}
                    >
                      [{currentPageData.num}/03]
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Machine Readable Zone (MRZ) Passport Strip */}
            <div className="mt-3 pt-2 border-t border-dashed border-[#8c6d4f]/35 font-mono text-[9px] tracking-[0.16em] text-[#8c6d4f]/80 uppercase select-none overflow-x-auto whitespace-nowrap">
              <div>
                P&lt;{isSpanish ? 'ESP' : 'USA'}BELEN&lt;&lt;ORIOL&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              </div>
              <div>
                {isSpanish ? '04092027' : '09042027'}&lt;5{isSpanish ? 'ESP' : 'USA'}2709041M&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;{currentPageData.num}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
