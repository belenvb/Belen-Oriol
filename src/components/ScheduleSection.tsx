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
  Download,
  Shirt,
  Columns,
  Layers,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { scheduleData } from '../data/content';
import { Language, ScheduleItem } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

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

// Hand-drawn ribbon loop flourish component (matching JourneyMap aesthetic)
function HandDrawnLoop({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 32"
      className={`overflow-visible pointer-events-none ${className}`}
      fill="none"
    >
      <path
        d="M 5 18 C 25 6, 45 28, 60 16 C 70 8, 75 4, 80 16 C 85 28, 72 28, 74 16 C 76 6, 95 24, 115 14 C 125 9, 135 18, 138 20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeDasharray="4 3"
        strokeLinecap="round"
      />
      <circle cx="77" cy="15" r="2.5" fill="currentColor" />
    </svg>
  );
}

// Hand-drawn ornamental divider knot
function HandDrawnKnot({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 28"
      className={`overflow-visible pointer-events-none ${className}`}
      fill="none"
    >
      <path
        d="M 10 14 C 50 4, 90 24, 120 14 C 126 11, 130 8, 134 14 C 138 20, 131 22, 129 15 C 128 8, 137 7, 142 14 C 170 24, 210 4, 250 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        strokeLinecap="round"
      />
      <circle cx="130" cy="14" r="3" fill="#5c141e" />
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

  const handleIcsExport = (day: 'sept3' | 'sept4') => {
    const event = currentSchedule[day].calEvent;
    downloadIcsFile(event, `boda-belen-oriol-${day}.ics`);
  };

  const formatPeriodLabel = (time: string) => {
    const lower = time.toLowerCase();
    if (lang === 'es') {
      if (lower.includes('afternoon')) return 'Tarde';
      if (lower.includes('evening')) return 'Atardecer';
      if (lower.includes('night')) return 'Noche';
      return time;
    }
    // English
    if (lower.includes('afternoon')) return 'Afternoon';
    if (lower.includes('evening')) return 'Evening';
    if (lower.includes('night')) return 'Night';
    return time;
  };

  const renderTimelineEvents = (events: ScheduleItem[], isSept4: boolean) => {
    return (
      <div className="relative pl-8 sm:pl-12 space-y-7 sm:space-y-9">
        {/* Hand-drawn sketched vertical dashed ribbon spine */}
        <div className="absolute top-4 bottom-4 left-3.5 sm:left-5 w-[2px] -translate-x-1/2 pointer-events-none">
          <svg className="w-4 h-full overflow-visible" preserveAspectRatio="none">
            <line
              x1="2"
              y1="0"
              x2="2"
              y2="100%"
              stroke={isSept4 ? '#5c141e' : '#b89243'}
              strokeWidth="2"
              strokeDasharray="5 4"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>
        </div>

        {events.map((event, idx) => {
          const IconComponent = iconMap[event.iconName] || Sparkles;
          const isHigh = event.highlight;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative group transition-all duration-300"
            >
              {/* Hand-drawn organic sketch circle pin */}
              <div className="absolute -left-[27px] sm:-left-[39px] top-3.5 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-115">
                <svg viewBox="0 0 36 36" className="absolute inset-0 w-full h-full overflow-visible">
                  <path
                    d="M 18 3.5 C 26.5 3, 33 9.5, 32.5 18 C 32 26.5, 25.5 32.5, 17.5 32 C 9.5 31.5, 3.5 25.5, 4 17.5 C 4.5 9, 10 4, 18 3.5 Z"
                    fill={isHigh ? (isSept4 ? '#5c141e' : '#b89243') : '#fdfbf7'}
                    stroke={isHigh ? '#e5cb8f' : '#b89243'}
                    strokeWidth="1.8"
                    strokeDasharray={isHigh ? 'none' : '4 2'}
                  />
                </svg>
                <IconComponent
                  className={`relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    isHigh ? 'text-[#e5cb8f]' : 'text-[#5c141e]'
                  }`}
                />
              </div>

              {/* Hand-crafted Event Card */}
              <div
                className={`p-5 sm:p-6 rounded-2xl transition-all duration-300 relative ${
                  isHigh
                    ? isSept4
                      ? 'bg-gradient-to-br from-[#fdf9f2] via-[#faf2e3] to-[#f4e8d3] border-2 border-[#b89243] shadow-[0_8px_30px_rgba(184,146,67,0.18)]'
                      : 'bg-gradient-to-br from-[#fdfbf7] via-[#f8f1e4] to-[#f2e6d2] border-2 border-[#b89243]/80 shadow-[0_8px_25px_rgba(184,146,67,0.15)]'
                    : 'bg-white/95 border border-[rgba(92,20,30,0.15)] hover:border-[#b89243] shadow-xs'
                }`}
              >
                {/* Subtle hand-drawn top ribbon accent for highlighted events */}
                {isHigh && (
                  <div className="absolute top-2 right-4 text-[#b89243]/50 hidden sm:block">
                    <HandDrawnLoop className="w-16 h-4" />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* Period Label (Afternoon / Evening / Night) */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif italic font-bold tracking-wider ${
                        isHigh
                          ? 'bg-[#5c141e] text-white shadow-2xs'
                          : 'bg-[#b89243]/15 text-[#5c141e] border border-[#b89243]/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-[#dfc285]" />
                      <span>{formatPeriodLabel(event.time)}</span>
                    </span>

                    {event.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-[#b89243]/20 text-[#37080e] border border-[#b89243]/40">
                        {event.badge}
                      </span>
                    )}
                  </div>

                  {/* Standardized Location: Castillo del Buen Amor */}
                  <span className="flex items-center gap-1.5 text-xs text-[#5c141e] font-cinzel font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#b89243]" />
                    <span>Castillo del Buen Amor</span>
                  </span>
                </div>

                <h4 className="font-playfair text-xl sm:text-2xl text-[#37080e] font-bold leading-snug">
                  {event.title}
                </h4>

                {event.description && (
                  <p className="font-cormorant text-lg sm:text-xl text-[#44403c] italic leading-relaxed mt-2">
                    {event.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <section
      id="schedule"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] relative border-y border-[rgba(92,20,30,0.12)] overflow-hidden"
    >
      {/* Anchor for any navigation directed to #dates */}
      <div id="dates" className="absolute -top-20" />

      {/* Hand-drawn watermark flourish */}
      <div className="absolute -right-20 top-20 text-[#b89243]/10 pointer-events-none hidden lg:block">
        <HandDrawnLoop className="w-96 h-28" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Consolidated Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.32em] font-semibold uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'El Programa · Castillo del Buen Amor' : 'Celebration Schedule'}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? '3 & 4 de Septiembre' : 'September 3 & 4'}
          </h2>

          <div className="flex justify-center my-2 text-[#b89243]">
            <HandDrawnKnot className="w-56 h-6" />
          </div>

          <p className="font-cormorant text-xl sm:text-2xl text-[#6e675f] italic leading-relaxed">
            {lang === 'es'
              ? 'Dos días de celebración en el Castillo del Buen Amor: cóctel de bienvenida, ceremonia nupcial y fiesta.'
              : 'Two days celebrating at Castillo del Buen Amor: welcome cocktails, ceremony, banquet and dancing.'}
          </p>
        </motion.div>

        {/* Consolidated Day Selector Cards: Day 1 & Day 2 (Replacing separate large duplicate section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10">
          {/* Day 1: September 3 Card */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              onSelectDay('sept3');
              setViewMode('tabbed');
            }}
            className={`p-6 sm:p-7 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedDay === 'sept3' && viewMode === 'tabbed'
                ? 'bg-gradient-to-br from-[#fcf7ec] via-[#f7eedc] to-[#f0e2ca] border-[#b89243] shadow-md ring-2 ring-[#b89243]/30'
                : 'bg-white/80 border-[rgba(92,20,30,0.15)] hover:border-[#b89243]/60 shadow-2xs'
            }`}
          >
            {/* Hand-drawn top accent */}
            <div className="absolute top-2 right-3 text-[#b89243]/35">
              <HandDrawnLoop className="w-20 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase bg-[#5c141e] text-white">
                  {lang === 'es' ? 'DÍA 1 · BIENVENIDA' : 'DAY 1 · WELCOME'}
                </span>
                <span className="font-cinzel text-xs font-bold tracking-widest text-[#8c6d3b]">
                  {lang === 'es' ? '03.09.2027' : '09.03.2027'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-cinzel text-3xl sm:text-4xl font-bold text-[#37080e]">
                  03
                </span>
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#37080e]">
                    {lang === 'es' ? 'Viernes 3 de Septiembre' : 'Friday, September 3'}
                  </h3>
                  <span className="font-cormorant text-base sm:text-lg text-[#8c6d3b] italic block">
                    {lang === 'es' ? 'Cóctel & Tapas de Bienvenida' : 'Welcome Reception & Cocktails'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#6e675f] leading-relaxed mt-2 mb-4">
                {lang === 'es'
                  ? 'Encuentro relajado para abrir boca en los jardines del castillo antes del gran día.'
                  : 'A relaxed gathering to welcome everyone in the castle courtyards.'}
              </p>
            </div>

            <div className="pt-3 border-t border-[rgba(92,20,30,0.1)] flex items-center justify-between text-xs">
              <span className="text-[#5c141e] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#b89243]" />
                Castillo del Buen Amor
              </span>
              <span
                className={`font-semibold uppercase tracking-wider text-[11px] ${
                  selectedDay === 'sept3' && viewMode === 'tabbed'
                    ? 'text-[#5c141e]'
                    : 'text-[#8c6d3b]'
                }`}
              >
                {selectedDay === 'sept3' && viewMode === 'tabbed'
                  ? lang === 'es'
                    ? '✓ Seleccionado'
                    : '✓ Selected'
                  : lang === 'es'
                  ? 'Ver Horario →'
                  : 'View Details →'}
              </span>
            </div>
          </motion.div>

          {/* Day 2: September 4 Card */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              onSelectDay('sept4');
              setViewMode('tabbed');
            }}
            className={`p-6 sm:p-7 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedDay === 'sept4' && viewMode === 'tabbed'
                ? 'bg-gradient-to-br from-[#37080e] via-[#4d0c15] to-[#250308] border-[#e5cb8f] text-white shadow-lg ring-2 ring-[#e5cb8f]/40'
                : 'bg-white/80 border-[rgba(92,20,30,0.15)] hover:border-[#b89243]/60 shadow-2xs'
            }`}
          >
            {/* Hand-drawn top accent */}
            <div
              className={`absolute top-2 right-3 ${
                selectedDay === 'sept4' && viewMode === 'tabbed'
                  ? 'text-[#e5cb8f]/40'
                  : 'text-[#b89243]/35'
              }`}
            >
              <HandDrawnLoop className="w-20 h-5" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase ${
                    selectedDay === 'sept4' && viewMode === 'tabbed'
                      ? 'bg-[#e5cb8f] text-[#37080e]'
                      : 'bg-[#5c141e] text-white'
                  }`}
                >
                  {lang === 'es' ? 'DÍA 2 · EL ENLACE' : 'DAY 2 · THE WEDDING'}
                </span>
                <span
                  className={`font-cinzel text-xs font-bold tracking-widest ${
                    selectedDay === 'sept4' && viewMode === 'tabbed'
                      ? 'text-[#e5cb8f]'
                      : 'text-[#8c6d3b]'
                  }`}
                >
                  {lang === 'es' ? '04.09.2027' : '09.04.2027'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className={`font-cinzel text-3xl sm:text-4xl font-bold ${
                    selectedDay === 'sept4' && viewMode === 'tabbed'
                      ? 'text-[#e5cb8f]'
                      : 'text-[#37080e]'
                  }`}
                >
                  04
                </span>
                <div>
                  <h3
                    className={`font-playfair text-xl sm:text-2xl font-bold ${
                      selectedDay === 'sept4' && viewMode === 'tabbed'
                        ? 'text-white'
                        : 'text-[#37080e]'
                    }`}
                  >
                    {lang === 'es' ? 'Sábado 4 de Septiembre' : 'Saturday, September 4'}
                  </h3>
                  <span
                    className={`font-cormorant text-base sm:text-lg italic block ${
                      selectedDay === 'sept4' && viewMode === 'tabbed'
                        ? 'text-[#e5cb8f]'
                        : 'text-[#8c6d3b]'
                    }`}
                  >
                    {lang === 'es' ? 'La Ceremonia, Banquete & Fiesta' : 'Ceremony, Banquet & Dancing'}
                  </span>
                </div>
              </div>

              <p
                className={`text-xs leading-relaxed mt-2 mb-4 ${
                  selectedDay === 'sept4' && viewMode === 'tabbed'
                    ? 'text-white/80'
                    : 'text-[#6e675f]'
                }`}
              >
                {lang === 'es'
                  ? 'El gran enlace nupcial, cóctel castellano, banquete de gala y fiesta hasta la madrugada.'
                  : 'The main ceremony, celebratory gala banquet, and festive late-night dancing.'}
              </p>
            </div>

            <div
              className={`pt-3 border-t flex items-center justify-between text-xs ${
                selectedDay === 'sept4' && viewMode === 'tabbed'
                  ? 'border-white/20'
                  : 'border-[rgba(92,20,30,0.1)]'
              }`}
            >
              <span
                className={`font-semibold flex items-center gap-1.5 ${
                  selectedDay === 'sept4' && viewMode === 'tabbed'
                    ? 'text-[#e5cb8f]'
                    : 'text-[#5c141e]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#b89243]" />
                Castillo del Buen Amor
              </span>
              <span
                className={`font-semibold uppercase tracking-wider text-[11px] ${
                  selectedDay === 'sept4' && viewMode === 'tabbed'
                    ? 'text-[#e5cb8f]'
                    : 'text-[#8c6d3b]'
                }`}
              >
                {selectedDay === 'sept4' && viewMode === 'tabbed'
                  ? lang === 'es'
                    ? '✓ Seleccionado'
                    : '✓ Selected'
                  : lang === 'es'
                  ? 'Ver Horario →'
                  : 'View Details →'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* View Mode & Calendar Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-5 border-b border-[rgba(92,20,30,0.15)]">
          {/* Active selection info */}
          <div className="text-xs text-[#6e675f] font-cinzel tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#b89243] animate-pulse" />
            <span>
              {viewMode === 'both'
                ? lang === 'es'
                  ? 'Viendo ambos días (3 y 4 de Septiembre)'
                  : 'Viewing both days (September 3 & 4)'
                : selectedDay === 'sept3'
                ? lang === 'es'
                  ? 'Viernes 3 de Septiembre (03.09.2027)'
                  : 'Friday, September 3 (09.03.2027)'
                : lang === 'es'
                ? 'Sábado 4 de Septiembre (04.09.2027)'
                : 'Saturday, September 4 (09.04.2027)'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setViewMode(viewMode === 'tabbed' ? 'both' : 'tabbed')}
              className="text-xs uppercase tracking-wider text-[#5c141e] hover:text-[#37080e] font-semibold border border-[rgba(92,20,30,0.3)] px-3.5 py-2 rounded-lg bg-white/70 hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              {viewMode === 'tabbed' ? (
                <>
                  <Columns className="w-3.5 h-3.5 text-[#b89243]" />
                  <span>{lang === 'es' ? 'Ver 3 y 4 Juntos' : 'View Both Days'}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#b89243]" />
                  <span>{lang === 'es' ? 'Ver Día Individual' : 'Single Day View'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleCalendarExport(selectedDay)}
              className="text-xs uppercase tracking-wider bg-[#5c141e] text-white hover:bg-[#7a1d2b] font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#dfc285]" />
              <span>Google Cal</span>
            </button>
          </div>
        </div>

        {/* Content Body with Animated Transitions */}
        <AnimatePresence mode="wait">
          {viewMode === 'tabbed' ? (
            <motion.div
              key={selectedDay}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Day Header Banner */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border-2 mb-8 shadow-md relative overflow-hidden ${
                  selectedDay === 'sept4'
                    ? 'bg-gradient-to-br from-[#37080e] via-[#4d0c15] to-[#250308] border-[#e5cb8f] text-white'
                    : 'bg-gradient-to-br from-[#fdfbf7] via-[#f9f3e7] to-[#f4ebe0] border-[#b89243] text-[#37080e]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-current/15 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                          selectedDay === 'sept4'
                            ? 'bg-[#e5cb8f] text-[#37080e]'
                            : 'bg-[#5c141e] text-white'
                        }`}
                      >
                        {activeData.dayNumber === '1'
                          ? lang === 'es'
                            ? 'VIERNES 3 · BIENVENIDA'
                            : 'FRIDAY SEP 3 · WELCOME'
                          : lang === 'es'
                          ? 'SÁBADO 4 · LA BODA'
                          : 'SATURDAY SEP 4 · WEDDING'}
                      </span>
                      <span className="font-cinzel text-xs font-bold tracking-widest opacity-80">
                        {selectedDay === 'sept3'
                          ? lang === 'es'
                            ? '03.09.2027'
                            : '09.03.2027'
                          : lang === 'es'
                          ? '04.09.2027'
                          : '09.04.2027'}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-wide">
                      {activeData.fullDateString}
                    </h3>
                    <p
                      className={`font-cormorant text-xl sm:text-2xl italic mt-1.5 ${
                        selectedDay === 'sept4' ? 'text-[#e5cb8f]' : 'text-[#6e675f]'
                      }`}
                    >
                      {activeData.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleIcsExport(selectedDay)}
                      className={`px-4 py-2.5 rounded-lg text-xs tracking-wider uppercase font-semibold border transition-colors flex items-center gap-2 cursor-pointer shadow-2xs ${
                        selectedDay === 'sept4'
                          ? 'border-white/40 bg-white/10 hover:bg-white/20 text-white'
                          : 'border-[#b89243] bg-white hover:bg-[#b89243]/10 text-[#5c141e]'
                      }`}
                    >
                      <Download className="w-4 h-4 text-[#dfc285]" />
                      <span>{lang === 'es' ? 'Descargar .iCS' : 'Download .iCS'}</span>
                    </button>
                  </div>
                </div>

                {/* Dress Code & Complimentary Shuttle Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                      selectedDay === 'sept4'
                        ? 'bg-black/30 border-white/15'
                        : 'bg-white/80 border-[#b89243]/30 shadow-2xs'
                    }`}
                  >
                    <Shirt className="w-5 h-5 text-[#b89243] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider block text-[11px] mb-0.5">
                        {lang === 'es' ? 'Código de Vestimenta' : 'Dress Code'}:{' '}
                        {activeData.dressCode.title}
                      </span>
                      <p className="opacity-80 leading-relaxed text-[11px]">
                        {activeData.dressCode.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                      selectedDay === 'sept4'
                        ? 'bg-black/30 border-white/15'
                        : 'bg-white/80 border-[#b89243]/30 shadow-2xs'
                    }`}
                  >
                    <Bus className="w-5 h-5 text-[#b89243] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold uppercase tracking-wider block text-[11px] mb-0.5">
                        {lang === 'es' ? 'Autobús de Cortesía' : 'Complimentary Shuttle'}
                      </span>
                      <p className="opacity-80 leading-relaxed text-[11px]">
                        {lang === 'es'
                          ? 'Servicio de autobús lanzadera entre la Plaza de España de Salamanca y el Castillo del Buen Amor.'
                          : 'Complimentary shuttle service between central Salamanca (Plaza de España) and Castillo del Buen Amor.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hand-drawn Timeline Events */}
              {renderTimelineEvents(activeData.events, selectedDay === 'sept4')}
            </motion.div>
          ) : (
            /* View Both Days Stacked/Dual View */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {/* Day 1 Section */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#b89243]/30">
                  <span className="px-3 py-1 rounded-full text-xs font-cinzel font-bold bg-[#5c141e] text-white">
                    {lang === 'es' ? 'VIERNES 3 DE SEPTIEMBRE' : 'FRIDAY, SEPTEMBER 3'}
                  </span>
                  <span className="font-cinzel text-xs font-bold text-[#8c6d3b]">
                    {lang === 'es' ? '03.09.2027' : '09.03.2027'}
                  </span>
                  <span className="text-xs text-[#6e675f] italic ml-auto">
                    {lang === 'es' ? 'Cóctel & Tapas' : 'Welcome Reception'}
                  </span>
                </div>
                {renderTimelineEvents(currentSchedule.sept3.events, false)}
              </div>

              {/* Day 2 Section */}
              <div>
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#b89243]/30">
                  <span className="px-3 py-1 rounded-full text-xs font-cinzel font-bold bg-[#37080e] text-[#e5cb8f] border border-[#e5cb8f]">
                    {lang === 'es' ? 'SÁBADO 4 DE SEPTIEMBRE' : 'SATURDAY, SEPTEMBER 4'}
                  </span>
                  <span className="font-cinzel text-xs font-bold text-[#8c6d3b]">
                    {lang === 'es' ? '04.09.2027' : '09.04.2027'}
                  </span>
                  <span className="text-xs text-[#6e675f] italic ml-auto">
                    {lang === 'es' ? 'El Gran Día · La Boda' : 'The Wedding Celebration'}
                  </span>
                </div>
                {renderTimelineEvents(currentSchedule.sept4.events, true)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
