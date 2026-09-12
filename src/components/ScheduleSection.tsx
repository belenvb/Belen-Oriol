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
  Info,
  Shirt,
  Columns,
  Layers,
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

  const renderTimelineEvents = (events: ScheduleItem[], isSept4: boolean) => {
    return (
      <div className="relative pl-6 sm:pl-9 space-y-6 sm:space-y-8">
        {/* Continuous vertical guide line */}
        <div
          className={`absolute top-4 bottom-4 left-3 sm:left-4 w-[2px] ${
            isSept4
              ? 'bg-gradient-to-b from-[#b89243] via-[#5c141e] to-[#b89243]'
              : 'bg-gradient-to-b from-[#dfc285] via-[#b89243] to-[#dfc285]'
          }`}
        />

        {events.map((event, idx) => {
          const IconComponent = iconMap[event.iconName] || Sparkles;
          const isHigh = event.highlight;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative group transition-all duration-300"
            >
              {/* Timeline Marker Pin */}
              <div
                className={`absolute -left-[22px] sm:-left-[26px] top-3.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-115 z-10 ${
                  isHigh
                    ? isSept4
                      ? 'bg-[#5c141e] border-[#e5cb8f] text-[#e5cb8f] shadow-[0_0_12px_rgba(92,20,30,0.5)]'
                      : 'bg-[#b89243] border-[#fdfbf7] text-white shadow-[0_0_12px_rgba(184,146,67,0.5)]'
                    : 'bg-[#fdfbf7] border-[#b89243] text-[#5c141e]'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Event Card Content */}
              <div
                className={`p-5 sm:p-6 rounded-xl transition-all duration-300 ${
                  isHigh
                    ? isSept4
                      ? 'bg-gradient-to-br from-[#fcf7ee] to-[#f7eedf] border-2 border-[#b89243] shadow-[0_8px_30px_rgba(184,146,67,0.16)]'
                      : 'bg-gradient-to-br from-[#fdfbf7] to-[#f6efe4] border-2 border-[#b89243]/70 shadow-[0_8px_25px_rgba(184,146,67,0.14)]'
                    : 'bg-white/95 border border-[rgba(92,20,30,0.12)] hover:border-[#b89243] shadow-xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* High-Contrast Time Chip */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider ${
                        isHigh
                          ? 'bg-[#5c141e] text-white'
                          : 'bg-[#b89243]/15 text-[#5c141e] border border-[#b89243]/30'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-[#dfc285]" />
                      <span>{event.time}</span>
                    </span>

                    {event.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-[#b89243]/20 text-[#37080e] border border-[#b89243]/40">
                        {event.badge}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-[#6e675f] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#b89243]" />
                    <span>{event.location}</span>
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
    <section id="schedule" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f5efe4] relative border-y border-[rgba(92,20,30,0.12)]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14 sm:mb-18"
        >
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#5c141e] font-semibold block mb-2">
            {lang === 'es' ? 'Itinerario' : 'Itinerary'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'Programa' : 'Schedule'}
          </h2>
          <p className="font-cormorant text-xl sm:text-2xl text-[#6e675f] italic mt-3 leading-relaxed">
            {lang === 'es'
              ? 'El desarrollo de la celebración durante el 3 y 4 de Septiembre.'
              : 'Timeline for September 3rd and 4th.'}
          </p>
          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-5" />
        </motion.div>

        {/* Smooth Sliding Day Controller */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[rgba(92,20,30,0.15)]">
          {/* Day Buttons with Layout Animation */}
          <div className="inline-flex p-1.5 rounded-full bg-[#eae1d0] border border-[#b89243]/50 shadow-inner w-full sm:w-auto relative">
            <button
              onClick={() => {
                onSelectDay('sept3');
                setViewMode('tabbed');
              }}
              className={`relative z-10 flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2.5 font-semibold ${
                selectedDay === 'sept3' && viewMode === 'tabbed'
                  ? 'text-white'
                  : 'text-[#44403c] hover:text-[#5c141e]'
              }`}
            >
              {selectedDay === 'sept3' && viewMode === 'tabbed' && (
                <motion.div
                  layoutId="activeScheduleDay"
                  className="absolute inset-0 bg-[#5c141e] rounded-full shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="font-cinzel text-xs font-bold text-[#dfc285]">DÍA 1</span>
              <span className="font-bold">{lang === 'es' ? 'Viernes 3 Sep' : 'Friday Sep 3'}</span>
            </button>

            <button
              onClick={() => {
                onSelectDay('sept4');
                setViewMode('tabbed');
              }}
              className={`relative z-10 flex-1 sm:flex-initial px-6 py-2.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2.5 font-semibold ${
                selectedDay === 'sept4' && viewMode === 'tabbed'
                  ? 'text-white'
                  : 'text-[#44403c] hover:text-[#5c141e]'
              }`}
            >
              {selectedDay === 'sept4' && viewMode === 'tabbed' && (
                <motion.div
                  layoutId="activeScheduleDay"
                  className="absolute inset-0 bg-[#5c141e] rounded-full shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <span className="font-cinzel text-xs font-bold text-[#dfc285]">DÍA 2</span>
              <span className="font-bold">{lang === 'es' ? 'Sábado 4 Sep' : 'Saturday Sep 4'}</span>
            </button>
          </div>

          {/* View toggle & Calendar Quick Action */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setViewMode(viewMode === 'tabbed' ? 'both' : 'tabbed')}
              className="text-xs uppercase tracking-wider text-[#5c141e] hover:text-[#37080e] font-semibold border border-[rgba(92,20,30,0.3)] px-3.5 py-2 rounded-md hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
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
              className="text-xs uppercase tracking-wider bg-[#5c141e] text-white hover:bg-[#7a1d2b] font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#dfc285]" />
              <span>{lang === 'es' ? 'Google Cal' : 'Google Cal'}</span>
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
              {/* Day Header Banner: Extremely Prominent Date Visual */}
              <div
                className={`p-6 sm:p-9 rounded-2xl border-2 mb-10 shadow-md ${
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
                        {activeData.dateBadge}
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

                {/* Dress Code & Shuttles Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                      selectedDay === 'sept4'
                        ? 'bg-black/30 border-white/15'
                        : 'bg-white/80 border-[#b89243]/25'
                    }`}
                  >
                    <Shirt className="w-5 h-5 text-[#dfc285] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block uppercase tracking-wider mb-1 font-bold text-[11px]">
                        {activeData.dressCode.title}
                      </strong>
                      <span className="leading-relaxed opacity-90 text-xs font-cormorant sm:text-sm">
                        {activeData.dressCode.description}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                      selectedDay === 'sept4'
                        ? 'bg-black/30 border-white/15'
                        : 'bg-white/80 border-[#b89243]/25'
                    }`}
                  >
                    <Bus className="w-5 h-5 text-[#dfc285] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block uppercase tracking-wider mb-1 font-bold text-[11px]">
                        {activeData.shuttleInfo.title}
                      </strong>
                      <span className="leading-relaxed opacity-90 text-xs font-cormorant sm:text-sm">
                        {activeData.shuttleInfo.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Events for Selected Day */}
              {renderTimelineEvents(activeData.events, selectedDay === 'sept4')}
            </motion.div>
          ) : (
            /* Both Days Side-by-Side View */
            <motion.div
              key="both-days"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10"
            >
              {/* September 3 Column */}
              <div className="bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border-2 border-[#b89243]/60 shadow-md">
                <div className="border-b border-[rgba(92,20,30,0.12)] pb-4 mb-6">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#5c141e] block mb-1">
                    VIERNES 3 DE SEPTIEMBRE
                  </span>
                  <h3 className="font-cinzel text-2xl text-[#37080e] font-bold">
                    {currentSchedule.sept3.title}
                  </h3>
                  <p className="text-xs text-[#6e675f] mt-1 italic">
                    {currentSchedule.sept3.dressCode.title}
                  </p>
                </div>
                {renderTimelineEvents(currentSchedule.sept3.events, false)}
              </div>

              {/* September 4 Column */}
              <div className="bg-[#fdfbf7] p-6 sm:p-8 rounded-2xl border-2 border-[#5c141e] shadow-lg">
                <div className="border-b border-[rgba(92,20,30,0.12)] pb-4 mb-6">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#5c141e] block mb-1">
                    SÁBADO 4 DE SEPTIEMBRE (LA BODA)
                  </span>
                  <h3 className="font-cinzel text-2xl text-[#37080e] font-bold">
                    {currentSchedule.sept4.title}
                  </h3>
                  <p className="text-xs text-[#6e675f] mt-1 italic">
                    {currentSchedule.sept4.dressCode.title}
                  </p>
                </div>
                {renderTimelineEvents(currentSchedule.sept4.events, true)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Practical Castle Note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 p-5 rounded-xl bg-[#fdfbf7] border border-[rgba(184,146,67,0.35)] flex items-center gap-3.5 text-xs text-[#6e675f] shadow-2xs"
        >
          <Info className="w-5 h-5 text-[#b89243] shrink-0" />
          <p className="leading-relaxed">
            {lang === 'es'
              ? 'Recomendamos calzado cómodo para señoras ya que la ceremonia y los cócteles se celebran en jardines empedrados y césped natural. El castillo dispone de guardarropa, guardarropa de etiqueta y zona chill-out climatizada.'
              : 'Block heels or comfortable dress footwear are recommended as ceremonies and cocktails are hosted on historic cobblestone and lawns. Castle cloakroom and lounge are provided.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
