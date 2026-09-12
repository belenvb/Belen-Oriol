import { useState, type ComponentType } from 'react';
import {
  GlassWater,
  Utensils,
  Sparkles,
  Bus,
  Music,
  Heart,
  Wine,
  Crown,
  PartyPopper,
  Coffee,
  Clock,
  MapPin,
  Calendar,
  Shirt,
  Columns,
  Layers,
  Scroll,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scheduleData } from '../data/content';
import { Language, ScheduleItem } from '../types';
import { generateGoogleCalendarUrl } from '../utils/calendar';
import { Monogram } from './Monogram';

interface ScheduleSectionProps {
  lang: Language;
  selectedDay: 'sept3' | 'sept4';
  onSelectDay: (day: 'sept3' | 'sept4') => void;
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  GlassWater,
  Utensils,
  Sparkles,
  Bus,
  Music,
  Heart,
  Wine,
  Crown,
  PartyPopper,
  Coffee,
};

// Hand-drawn botanical vine separating chapters in the parchment
function HandDrawnBotanicalVine({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 32"
      className={`w-full max-w-sm mx-auto overflow-visible pointer-events-none opacity-60 ${className}`}
      fill="none"
    >
      <path
        d="M 20 16 C 80 8, 140 24, 200 16 C 260 8, 320 24, 380 16"
        stroke="#8c6d4f"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaves along the vine */}
      <path d="M 80 14 C 75 7, 85 4, 90 10 C 85 12, 82 14, 80 14 Z" fill="#466c42" opacity="0.75" />
      <path d="M 140 18 C 145 25, 135 28, 130 22 C 135 20, 138 18, 140 18 Z" fill="#466c42" opacity="0.75" />
      <path d="M 260 14 C 255 7, 265 4, 270 10 C 265 12, 262 14, 260 14 Z" fill="#466c42" opacity="0.75" />
      <path d="M 320 18 C 325 25, 315 28, 310 22 C 315 20, 318 18, 320 18 Z" fill="#466c42" opacity="0.75" />
      {/* Central berry / flower */}
      <circle cx="200" cy="16" r="3" fill="#5c141e" />
      <circle cx="194" cy="14" r="1.8" fill="#b89243" />
      <circle cx="206" cy="14" r="1.8" fill="#b89243" />
    </svg>
  );
}

// Hand-sketched parchment corner flourish
function ParchmentCornerFlourish({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms = {
    tl: '',
    tr: 'scale-x-[-1]',
    bl: 'scale-y-[-1]',
    br: 'scale-[-1]',
  };

  return (
    <svg
      viewBox="0 0 60 60"
      className={`w-12 h-12 pointer-events-none text-[#8c6d4f] opacity-40 ${transforms[position]}`}
      fill="none"
    >
      <path
        d="M 6 54 C 6 25, 25 6, 54 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <path
        d="M 14 54 C 14 32, 32 14, 54 14"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M 6 6 C 18 18, 18 18, 26 12 C 32 6, 22 2, 14 6 C 10 8, 8 12, 12 16"
        stroke="#5c141e"
        strokeWidth="1"
      />
    </svg>
  );
}

export function ScheduleSection({ lang, selectedDay, onSelectDay }: ScheduleSectionProps) {
  const [viewMode, setViewMode] = useState<'tabbed' | 'both'>('tabbed');
  const currentSchedule = scheduleData[lang];
  const activeData = currentSchedule[selectedDay];

  const handleCalendarExport = (day: 'sept3' | 'sept4') => {
    const event = currentSchedule[day].calEvent;
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const formatPeriodLabel = (time: string) => {
    const lower = time.toLowerCase();
    if (lang === 'es') {
      if (lower.includes('afternoon')) return 'Tarde';
      if (lower.includes('evening')) return 'Tarde-Noche';
      if (lower.includes('night')) return 'Noche';
      return time;
    }
    if (lower.includes('afternoon')) return 'Afternoon';
    if (lower.includes('evening')) return 'Evening';
    if (lower.includes('night')) return 'Night';
    return time;
  };

  // Render events as verses in an illuminated parchment scroll (NO CARD BOXES)
  const renderParchmentEvents = (events: ScheduleItem[], isSept4: boolean) => {
    return (
      <div className="relative py-4 sm:py-6">
        {/* Continuous organic hand-drawn ink spine running down the scroll */}
        <div className="absolute top-6 bottom-6 left-5 sm:left-8 w-[2px] pointer-events-none">
          <svg className="w-4 h-full overflow-visible" preserveAspectRatio="none">
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="100%"
              stroke={isSept4 ? '#8c6d4f' : '#b89243'}
              strokeWidth="1.6"
              strokeDasharray="6 4"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {events.map((event, idx) => {
            const IconComponent = iconMap[event.iconName] || Sparkles;
            const isHigh = event.highlight;
            const locationLabel = event.location || (isSept4 ? 'Castillo del Buen Amor' : 'Salamanca');

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="relative pl-14 sm:pl-20 group"
              >
                {/* Hand-drawn circular wax seal or ink insignia on the spine */}
                <div
                  className={`absolute left-1.5 sm:left-4 top-1 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                    isHigh
                      ? isSept4
                        ? 'bg-gradient-to-br from-[#7a1d2b] to-[#400810] text-[#f7eedc] ring-2 ring-[#b89243] ring-offset-2 ring-offset-[#fcf8ef]'
                        : 'bg-gradient-to-br from-[#b89243] to-[#8c6d3b] text-white ring-2 ring-[#e5cb8f] ring-offset-2 ring-offset-[#fcf8ef]'
                      : 'bg-[#faf2e3] border border-[#8c6d4f]/50 text-[#5c141e]'
                  }`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>

                {/* Hand-drawn manuscript verse layout (completely free of card rectangles) */}
                <div className="relative pr-2">
                  {/* Time Ribbon & Location stamp */}
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-1.5">
                    <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-[#5c141e] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#b89243]" />
                      <span>{formatPeriodLabel(event.time)}</span>
                    </span>

                    <span className="text-[#8c6d4f] font-serif italic text-xs">·</span>

                    <span className="font-cormorant text-sm sm:text-base font-semibold text-[#8c6d4f] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#b89243]" />
                      <span>{locationLabel}</span>
                    </span>

                    {event.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase bg-[#5c141e]/10 text-[#5c141e] border border-[#5c141e]/20 ml-auto">
                        {event.badge}
                      </span>
                    )}
                  </div>

                  {/* Event Title with illuminated calligraphy touch */}
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-playfair text-xl sm:text-2xl font-bold leading-tight ${
                        isHigh ? 'text-[#37080e]' : 'text-[#443831]'
                      }`}
                    >
                      {event.title}
                    </h4>
                    {isHigh && (
                      <span className="text-[#b89243] text-sm animate-pulse">✦</span>
                    )}
                  </div>

                  {/* Hand-written description in elegant italic literary prose */}
                  {event.description && (
                    <p className="font-cormorant text-base sm:text-lg text-[#554a40] italic leading-relaxed mt-1 max-w-2xl">
                      {event.description}
                    </p>
                  )}

                  {/* Subtle hand-drawn divider flourish below each moment */}
                  {idx < events.length - 1 && (
                    <div className="pt-3 opacity-30">
                      <HandDrawnBotanicalVine className="max-w-xs !mx-0" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section
      id="schedule"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#f5efe3] relative border-y border-[rgba(92,20,30,0.12)] overflow-hidden"
    >
      <div id="dates" className="absolute -top-20" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.32em] font-semibold uppercase mb-3 shadow-2xs">
            <Scroll className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'El Programa · 3 & 4 de Septiembre' : 'Celebration Itinerary'}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'Itinerario' : 'Wedding Itinerary'}
          </h2>

          <div className="my-3">
            <HandDrawnBotanicalVine />
          </div>

          <p className="font-cormorant text-xl sm:text-2xl text-[#554a40] italic leading-relaxed">
            {lang === 'es'
              ? 'El itinerario detallado de nuestra celebración en Salamanca y el Castillo del Buen Amor'
              : 'The detailed itinerary of our celebration in Salamanca and Castillo del Buen Amor'}
          </p>
        </motion.div>

        {/* Day Selector Tabs Styled as Parchment Ribbons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-8">
          {/* Day 1: September 3 */}
          <button
            onClick={() => {
              onSelectDay('sept3');
              setViewMode('tabbed');
            }}
            className={`flex-1 p-4 sm:p-5 rounded-xl transition-all duration-300 text-left relative cursor-pointer shadow-sm border ${
              selectedDay === 'sept3' && viewMode === 'tabbed'
                ? 'bg-[#fcf8ef] border-[#b89243] ring-2 ring-[#b89243]/40 shadow-md'
                : 'bg-[#faf2e3]/70 hover:bg-[#faf2e3] border-[#8c6d4f]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase bg-[#5c141e] text-white flex items-center gap-1 shadow-xs">
                <span>🔒</span>
                <span>{lang === 'es' ? 'SOLO CON INVITACIÓN' : 'INVITATION ONLY'}</span>
              </span>
              <span className="font-cinzel text-xs font-bold text-[#8c6d3b]">03.09.2027</span>
            </div>
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#37080e]">
              {lang === 'es' ? 'Viernes 3 de Septiembre' : 'Friday, September 3'}
            </h3>
            <p className="font-cormorant italic text-sm text-[#8c6d4f] mt-0.5">
              {lang === 'es'
                ? 'Salamanca · Cóctel de Víspera (Exclusivo con Convocatoria)'
                : 'Salamanca · Eve Gathering (Strictly by Invitation)'}
            </p>
          </button>

          {/* Day 2: September 4 */}
          <button
            onClick={() => {
              onSelectDay('sept4');
              setViewMode('tabbed');
            }}
            className={`flex-1 p-4 sm:p-5 rounded-xl transition-all duration-300 text-left relative cursor-pointer shadow-sm border ${
              selectedDay === 'sept4' && viewMode === 'tabbed'
                ? 'bg-[#fcf8ef] border-[#5c141e] ring-2 ring-[#5c141e]/30 shadow-md'
                : 'bg-[#faf2e3]/70 hover:bg-[#faf2e3] border-[#8c6d4f]/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase bg-[#5c141e] text-white">
                {lang === 'es' ? 'DÍA 2 · EL GRAN ENLACE' : 'DAY 2 · THE WEDDING'}
              </span>
              <span className="font-cinzel text-xs font-bold text-[#5c141e]">04.09.2027</span>
            </div>
            <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#37080e]">
              {lang === 'es' ? 'Sábado 4 de Septiembre' : 'Saturday, September 4'}
            </h3>
            <p className="font-cormorant italic text-sm text-[#8c6d4f] mt-0.5">
              {lang === 'es'
                ? 'El Castillo del Buen Amor · Banquete & Fiesta'
                : 'Castillo del Buen Amor · Ceremony & Banquet'}
            </p>
          </button>
        </div>

        {/* View Mode & Calendar Export Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-3 border-b border-[#8c6d4f]/20">
          <div className="text-xs text-[#6e675f] font-cinzel tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b89243]" />
            <span>
              {viewMode === 'both'
                ? lang === 'es' ? 'Viendo programa de ambas jornadas' : 'Viewing both celebration days'
                : selectedDay === 'sept3'
                ? lang === 'es' ? 'Viernes 3 de Septiembre · Salamanca (Solo con Invitación)' : 'Friday Sep 3 · Salamanca (Invitation Only)'
                : lang === 'es' ? 'Sábado 4 de Septiembre · Castillo del Buen Amor' : 'Saturday Sep 4 · Castillo'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setViewMode(viewMode === 'tabbed' ? 'both' : 'tabbed')}
              className="text-xs uppercase tracking-wider text-[#5c141e] font-semibold border border-[#8c6d4f]/30 px-3 py-1.5 rounded-lg bg-[#faf2e3] hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {viewMode === 'tabbed' ? (
                <>
                  <Columns className="w-3.5 h-3.5 text-[#b89243]" />
                  <span>{lang === 'es' ? 'Ver Ambas' : 'View Both'}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#b89243]" />
                  <span>{lang === 'es' ? 'Por Día' : 'Single'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleCalendarExport(selectedDay)}
              className="text-xs uppercase tracking-wider bg-[#5c141e] text-white hover:bg-[#7a1d2b] font-medium px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#dfc285]" />
              <span>Google Cal</span>
            </button>
          </div>
        </div>

        {/* The Hand-Drawn Pergamino Container */}
        <div className="relative">
          {/* Pergamino Scroll Top Spindle Roll */}
          <div className="relative h-6 sm:h-7 w-full bg-gradient-to-r from-[#8c6d4f] via-[#d4b996] to-[#8c6d4f] rounded-t-full shadow-md flex items-center justify-between px-3 border border-[#6b5138]">
            <div className="w-3 h-3 rounded-full bg-[#5c141e] border border-[#dfc285]" />
            <div className="h-0.5 w-1/3 bg-[#8c6d4f]/40" />
            <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase font-bold text-[#37080e]/80">
              {lang === 'es' ? 'ITINERARIO' : 'ITINERARY'}
            </span>
            <div className="h-0.5 w-1/3 bg-[#8c6d4f]/40" />
            <div className="w-3 h-3 rounded-full bg-[#5c141e] border border-[#dfc285]" />
          </div>

          {/* Parchment Body (Rich vintage vellum texture, deckle borders, hand-drawn ink guidelines) */}
          <div className="bg-gradient-to-b from-[#fcf8ef] via-[#f9f2e3] to-[#f4ead5] border-x-4 border-[#8c6d4f] p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(55,20,10,0.15)] relative">
            {/* Hand-drawn double ink margin lines */}
            <div className="absolute inset-3 sm:inset-5 border border-[#8c6d4f]/40 pointer-events-none rounded-lg" />
            <div className="absolute inset-4 sm:inset-6 border border-dashed border-[#8c6d4f]/25 pointer-events-none rounded-md" />

            {/* Corner Ornamental Flourishes */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <ParchmentCornerFlourish position="tl" />
            </div>
            <div className="absolute top-4 right-4 pointer-events-none">
              <ParchmentCornerFlourish position="tr" />
            </div>
            <div className="absolute bottom-4 left-4 pointer-events-none">
              <ParchmentCornerFlourish position="bl" />
            </div>
            <div className="absolute bottom-4 right-4 pointer-events-none">
              <ParchmentCornerFlourish position="br" />
            </div>

            {/* Pergamino Header Monogram Wax Seal */}
            <div className="relative z-10 text-center mb-8">
              <div className="inline-flex flex-col items-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#7a1d2b] to-[#3a0810] border-2 border-[#dfc285] flex items-center justify-center shadow-md mb-2">
                  <Monogram size={40} variant="gold" />
                </div>
                <span className="font-cinzel text-xs tracking-[0.25em] font-bold text-[#5c141e] uppercase">
                  Belén & Oriol
                </span>
                <span className="font-cormorant italic text-xs text-[#8c6d4f]">
                  Salamanca · 4 de Septiembre de 2027
                </span>
              </div>
            </div>

            {/* Dynamic Content: Tabbed or Dual Scroll View */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {viewMode === 'tabbed' ? (
                  <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Day Title & Decree Inscription */}
                    <div className="text-center pb-6 mb-6 border-b border-[#8c6d4f]/30">
                      <span className="font-cinzel text-xs tracking-[0.2em] font-bold uppercase text-[#8c6d4f] block mb-1">
                        {selectedDay === 'sept3'
                          ? lang === 'es' ? 'VIERNES 3 DE SEPTIEMBRE' : 'FRIDAY, SEPTEMBER 3'
                          : lang === 'es' ? 'SÁBADO 4 DE SEPTIEMBRE' : 'SATURDAY, SEPTEMBER 4'}
                      </span>
                      <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#37080e]">
                        {activeData.title}
                      </h3>
                      <p className="font-cormorant text-lg sm:text-xl italic text-[#5c141e] mt-1 max-w-xl mx-auto">
                        {activeData.subtitle}
                      </p>

                      {/* Inscribed Badges on the Parchment */}
                      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs">
                        {/* Dress code */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8c6d4f]/10 border border-[#8c6d4f]/30 text-[#443831]">
                          <Shirt className="w-3.5 h-3.5 text-[#b89243]" />
                          <span className="font-cinzel font-semibold">Dress Code:</span>
                          <span className="font-cormorant italic font-semibold text-[#5c141e]">
                            {activeData.dressCode.title}
                          </span>
                        </div>

                        {/* Guest bus on Saturday */}
                        {selectedDay === 'sept4' && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5c141e]/10 border border-[#5c141e]/20 text-[#5c141e]">
                            <Bus className="w-3.5 h-3.5 text-[#5c141e]" />
                            <span className="font-cinzel font-semibold">
                              {lang === 'es'
                                ? 'Autobús para invitados Salamanca ⇄ Castillo'
                                : 'Guest Bus Salamanca ⇄ Castle'}
                            </span>
                          </div>
                        )}

                        {/* Preboda invite-only notice */}
                        {selectedDay === 'sept3' && (
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#5c141e] text-white shadow-xs">
                            <span className="font-cinzel font-bold text-[11px] tracking-wider">
                              {lang === 'es' ? '🔒 SOLO CON INVITACIÓN INDIVIDUAL' : '🔒 STRICTLY BY INVITATION ONLY'}
                            </span>
                          </div>
                        )}
                      </div>

                      {selectedDay === 'sept3' && (
                        <div className="mt-5 p-4 rounded-xl bg-[#5c141e]/10 border-2 border-[#5c141e]/40 max-w-lg mx-auto text-center shadow-xs">
                          <span className="font-cinzel text-xs font-bold text-[#5c141e] uppercase tracking-wider block mb-1">
                            {lang === 'es' ? '✦ Encuentro Íntimo de Víspera ✦' : '✦ Intimate Eve Gathering ✦'}
                          </span>
                          <p className="font-sans text-xs text-[#443831] leading-relaxed">
                            {lang === 'es'
                              ? 'Por limitaciones de aforo del recinto, la preboda del viernes en Salamanca es exclusiva para aquellos invitados que hayan recibido la invitación correspondiente.'
                              : 'Due to venue capacity restrictions, Friday\'s pre-wedding gathering in Salamanca is exclusively for guests who received an individual invitation.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Timeline Events on Parchment */}
                    {renderParchmentEvents(activeData.events, selectedDay === 'sept4')}
                  </motion.div>
                ) : (
                  /* Dual Day Scroll Inscription */
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-12"
                  >
                    {/* Day 1 Section */}
                    <div>
                      <div className="text-center pb-4 mb-4 border-b border-[#8c6d4f]/30">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#5c141e] text-white text-[10px] font-cinzel font-bold tracking-widest uppercase mb-1 shadow-xs">
                          <span>🔒</span>
                          <span>{lang === 'es' ? 'SOLO CON INVITACIÓN INDIVIDUAL' : 'STRICTLY BY INVITATION ONLY'}</span>
                        </div>
                        <h3 className="font-playfair text-2xl font-bold text-[#37080e] mt-1">
                          {currentSchedule.sept3.title}
                        </h3>
                        <p className="font-cormorant text-base italic text-[#5c141e]">
                          {lang === 'es'
                            ? 'Viernes 3 de Septiembre · Salamanca · Encuentro Íntimo de Víspera'
                            : 'Friday September 3 · Salamanca · Intimate Eve Gathering'}
                        </p>
                      </div>
                      <div className="mb-4 p-3 rounded-lg bg-[#5c141e]/10 border border-[#5c141e]/30 text-center max-w-md mx-auto">
                        <p className="text-xs text-[#5c141e] font-sans font-medium">
                          {lang === 'es'
                            ? 'Por limitación de aforo, la preboda es exclusiva para invitados convocados de forma individual.'
                            : 'Due to venue capacity, the pre-wedding is strictly for guests with an individual invitation.'}
                        </p>
                      </div>
                      {renderParchmentEvents(currentSchedule.sept3.events, false)}
                    </div>

                    <div className="my-6">
                      <HandDrawnBotanicalVine />
                    </div>

                    {/* Day 2 Section */}
                    <div>
                      <div className="text-center pb-4 mb-4 border-b border-[#8c6d4f]/30">
                        <span className="font-cinzel text-xs tracking-widest font-bold text-[#5c141e] uppercase">
                          {lang === 'es' ? 'Jornada 2 · El Castillo del Buen Amor' : 'Day 2 · Castillo del Buen Amor'}
                        </span>
                        <h3 className="font-playfair text-2xl font-bold text-[#37080e]">
                          {currentSchedule.sept4.title}
                        </h3>
                        <p className="font-cormorant text-base italic text-[#5c141e]">
                          {lang === 'es'
                            ? 'Dress code: Cocktail o Black Tie · Autobús de invitados disponible'
                            : 'Dress code: Cocktail or Black Tie · Guest bus service provided'}
                        </p>
                      </div>
                      {renderParchmentEvents(currentSchedule.sept4.events, true)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pergamino Footer Signature / Wax Stamp */}
            <div className="mt-8 pt-4 border-t border-[#8c6d4f]/30 text-center relative z-10">
              <span className="font-cinzel text-[11px] tracking-[0.2em] uppercase font-bold text-[#5c141e] block">
                Belén & Oriol · Salamanca 2027
              </span>
            </div>
          </div>

          {/* Pergamino Scroll Bottom Spindle Roll */}
          <div className="relative h-6 sm:h-7 w-full bg-gradient-to-r from-[#8c6d4f] via-[#d4b996] to-[#8c6d4f] rounded-b-full shadow-lg flex items-center justify-between px-3 border border-[#6b5138]">
            <div className="w-3 h-3 rounded-full bg-[#5c141e] border border-[#dfc285]" />
            <div className="h-0.5 w-1/3 bg-[#8c6d4f]/40" />
            <span className="font-cinzel text-[9px] tracking-[0.25em] uppercase font-bold text-[#37080e]/80">
              ✦ CASTILLO DEL BUEN AMOR ✦
            </span>
            <div className="h-0.5 w-1/3 bg-[#8c6d4f]/40" />
            <div className="w-3 h-3 rounded-full bg-[#5c141e] border border-[#dfc285]" />
          </div>
        </div>
      </div>
    </section>
  );
}
