import { type MouseEvent } from 'react';
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Download, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { scheduleData } from '../data/content';
import { Language } from '../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';

interface DatesHighlightProps {
  lang: Language;
  onSelectDay: (day: 'sept3' | 'sept4') => void;
  onScrollToSchedule: () => void;
}

export function DatesHighlight({ lang, onSelectDay, onScrollToSchedule }: DatesHighlightProps) {
  const currentSchedule = scheduleData[lang];

  const handleCalendarAdd = (e: MouseEvent, day: 'sept3' | 'sept4') => {
    e.stopPropagation();
    const event = currentSchedule[day].calEvent;
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleIcsDownload = (e: MouseEvent, day: 'sept3' | 'sept4') => {
    e.stopPropagation();
    const event = currentSchedule[day].calEvent;
    downloadIcsFile(event, `boda-belen-oriol-${day}.ics`);
  };

  const handleCardClick = (day: 'sept3' | 'sept4') => {
    onSelectDay(day);
    onScrollToSchedule();
  };

  return (
    <section id="dates" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] relative overflow-hidden">
      {/* Subtle background crest watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(184,146,67,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header with smooth entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.32em] font-semibold uppercase mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'Celebración en Salamanca' : 'Celebration in Salamanca'}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl text-[#37080e] font-bold tracking-[0.04em] uppercase leading-tight">
            {lang === 'es' ? '3 & 4 de Septiembre' : 'September 3rd & 4th'}
          </h2>

          <p className="font-cormorant text-xl sm:text-2xl text-[#44403c] italic mt-4 max-w-2xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'Dos días de celebración en el Castillo del Buen Amor: el cóctel de bienvenida del viernes y la ceremonia y banquete del sábado.'
              : 'Two days of celebration at Castillo del Buen Amor: Friday welcome gathering and Saturday ceremony and gala.'}
          </p>

          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#b89243] to-transparent mx-auto mt-6" />
        </motion.div>

        {/* The Two Prominent Dates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ============================================================== */}
          {/* DAY 1: SEPTEMBER 3RD (VIERNES) */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => handleCardClick('sept3')}
            className="group relative bg-gradient-to-b from-[#fdfbf7] via-[#faf5ec] to-[#f6efe1] rounded-2xl p-7 sm:p-10 border-2 border-[#b89243]/40 hover:border-[#b89243] transition-all duration-500 shadow-[0_14px_45px_rgba(184,146,67,0.12)] hover:shadow-[0_22px_60px_rgba(184,146,67,0.22)] cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Top Ornamental Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#dfc285]" />

            <div>
              {/* Header Bar: Day 1 & Standard Date */}
              <div className="flex items-center justify-between border-b border-[#b89243]/20 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#b89243] animate-pulse" />
                  <span className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#5c141e]">
                    {lang === 'es' ? 'VIERNES · BIENVENIDA' : 'FRIDAY · WELCOME'}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#b89243]/40 bg-white/60 backdrop-blur-xs font-cinzel text-[11px] font-bold text-[#8c6d3b] tracking-widest shadow-2xs">
                  03 · 09 · 2027
                </div>
              </div>

              {/* Main Date Display: Huge Gilded 03 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-7">
                {/* Date Plaque */}
                <div className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#f8f0dc] via-[#f1e3c2] to-[#e4cf9f] border-2 border-[#b89243] shadow-[0_8px_25px_rgba(184,146,67,0.25)] shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <span className="font-cinzel text-6xl sm:text-7xl font-bold text-[#5c141e] leading-none drop-shadow-sm">
                    03
                  </span>
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#37080e] mt-1 font-sans">
                    {lang === 'es' ? 'SEPTIEMBRE' : 'SEPTEMBER'}
                  </span>
                  <span className="text-[9px] font-semibold tracking-widest text-[#8c6d3b]">
                    2027
                  </span>
                </div>

                {/* Day Details */}
                <div className="flex flex-col">
                  <span className="font-cinzel text-sm sm:text-base font-bold text-[#8c6d3b] tracking-[0.2em] uppercase">
                    {lang === 'es' ? 'Viernes' : 'Friday'}
                  </span>
                  <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-[#37080e] font-semibold leading-tight mt-1">
                    {currentSchedule.sept3.title}
                  </h3>
                  <div className="inline-flex items-center gap-2 mt-2 text-xs font-semibold text-[#5c141e] bg-[#5c141e]/8 px-3 py-1 rounded-full self-start border border-[#5c141e]/15">
                    <Clock className="w-3.5 h-3.5 text-[#b89243]" />
                    <span>{lang === 'es' ? 'A partir de las 19:30h' : 'Starting at 19:30'}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Description */}
              <p className="font-cormorant text-xl text-[#44403c] italic leading-relaxed mb-6">
                "{currentSchedule.sept3.subtitle}"
              </p>

              {/* Highlights Breakdown */}
              <div className="space-y-3 bg-white/70 p-4 sm:p-5 rounded-xl border border-[#b89243]/20 mb-6 text-xs text-[#37080e]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#b89243] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#5c141e] uppercase tracking-wider text-[10px]">
                      {lang === 'es' ? 'Ubicación' : 'Location'}
                    </strong>
                    <span className="text-[#6e675f]">{currentSchedule.sept3.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-[rgba(92,20,30,0.06)] pt-2.5">
                  <Sparkles className="w-4 h-4 text-[#b89243] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#5c141e] uppercase tracking-wider text-[10px]">
                      {lang === 'es' ? 'Código de Vestimenta' : 'Dress Code'}
                    </strong>
                    <span className="text-[#6e675f]">{currentSchedule.sept3.dressCode.title}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-t border-[#b89243]/25 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCalendarAdd(e, 'sept3')}
                  title="Añadir Viernes 3 a Google Calendar"
                  className="px-3.5 py-2 rounded-md text-xs font-semibold tracking-wider uppercase border border-[#b89243] bg-white hover:bg-[#b89243]/10 text-[#5c141e] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#b89243]" />
                  <span>Google Cal</span>
                </button>
                <button
                  onClick={(e) => handleIcsDownload(e, 'sept3')}
                  title="Descargar .ics para Apple Calendar o Outlook"
                  className="px-3 py-2 rounded-md text-xs font-semibold tracking-wider uppercase border border-[#b89243]/40 bg-white hover:bg-[#b89243]/10 text-[#6e675f] hover:text-[#5c141e] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#b89243]" />
                  <span>.iCS</span>
                </button>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#5c141e] group-hover:translate-x-1.5 transition-transform">
                <span>{lang === 'es' ? 'Ver Programa' : 'Schedule'}</span>
                <ArrowRight className="w-4 h-4 text-[#b89243]" />
              </span>
            </div>
          </motion.div>

          {/* ============================================================== */}
          {/* DAY 2: SEPTEMBER 4TH (SÁBADO) — THE GRAND WEDDING DAY */}
          {/* ============================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => handleCardClick('sept4')}
            className="group relative bg-gradient-to-b from-[#3d0910] via-[#4e0f18] to-[#30050b] rounded-2xl p-7 sm:p-10 border-2 border-[#e5cb8f] hover:border-[#ffffff] transition-all duration-500 shadow-[0_20px_55px_rgba(92,20,30,0.35)] hover:shadow-[0_26px_70px_rgba(92,20,30,0.45)] cursor-pointer flex flex-col justify-between overflow-hidden text-white"
          >
            {/* Top Ornamental Ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e5cb8f] via-[#ffffff] to-[#e5cb8f]" />

            {/* Corner Seal Badge */}
            <div className="absolute top-4 right-4 sm:top-5 sm:right-6 wax-seal px-3 py-1 rounded-full flex items-center gap-1.5 text-[10px] tracking-widest font-bold uppercase text-[#fdfbf7] shadow-md">
              <Sparkles className="w-3 h-3 text-[#e5cb8f]" />
              <span>{lang === 'es' ? 'EL GRAN DÍA' : 'THE WEDDING'}</span>
            </div>

            <div>
              {/* Header Bar: Day 2 & Standard Date */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e5cb8f] animate-ping" />
                  <span className="font-cinzel text-xs tracking-[0.25em] uppercase font-bold text-[#e5cb8f]">
                    {lang === 'es' ? 'SÁBADO · LA BODA' : 'SATURDAY · WEDDING'}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full border border-[#e5cb8f]/40 bg-black/30 backdrop-blur-xs font-cinzel text-[11px] font-bold text-[#f3dfb2] tracking-widest">
                  04 · 09 · 2027
                </div>
              </div>

              {/* Main Date Display: Huge Gilded 04 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-7">
                {/* Date Plaque */}
                <div className="relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#5c141e] via-[#3a080f] to-[#250409] border-2 border-[#e5cb8f] shadow-[0_10px_30px_rgba(0,0,0,0.5)] shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <span className="font-cinzel text-6xl sm:text-7xl font-bold text-[#f5e3ba] leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
                    04
                  </span>
                  <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#e5cb8f] mt-1 font-sans">
                    {lang === 'es' ? 'SEPTIEMBRE' : 'SEPTEMBER'}
                  </span>
                  <span className="text-[9px] font-semibold tracking-widest text-white/70">
                    2027
                  </span>
                </div>

                {/* Day Details */}
                <div className="flex flex-col">
                  <span className="font-cinzel text-sm sm:text-base font-bold text-[#e5cb8f] tracking-[0.2em] uppercase">
                    {lang === 'es' ? 'Sábado' : 'Saturday'}
                  </span>
                  <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-white font-semibold leading-tight mt-1">
                    {currentSchedule.sept4.title}
                  </h3>
                  <div className="inline-flex items-center gap-2 mt-2 text-xs font-semibold text-[#f5e3ba] bg-white/10 px-3 py-1 rounded-full self-start border border-[#e5cb8f]/30">
                    <Clock className="w-3.5 h-3.5 text-[#e5cb8f]" />
                    <span>{lang === 'es' ? '17:30h Llegada · 18:00h Ceremonia' : '17:30 Arrival · 18:00 Vows'}</span>
                  </div>
                </div>
              </div>

              {/* Editorial Description */}
              <p className="font-cormorant text-xl text-[#f3ede2] italic leading-relaxed mb-6">
                "{currentSchedule.sept4.subtitle}"
              </p>

              {/* Highlights Breakdown */}
              <div className="space-y-3 bg-black/25 p-4 sm:p-5 rounded-xl border border-white/15 mb-6 text-xs text-white">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#e5cb8f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#e5cb8f] uppercase tracking-wider text-[10px]">
                      {lang === 'es' ? 'Lugar de la Ceremonia' : 'Wedding Ceremony'}
                    </strong>
                    <span className="text-white/85">{currentSchedule.sept4.location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-white/10 pt-2.5">
                  <Sparkles className="w-4 h-4 text-[#e5cb8f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#e5cb8f] uppercase tracking-wider text-[10px]">
                      {lang === 'es' ? 'Código de Vestimenta' : 'Dress Code'}
                    </strong>
                    <span className="text-white/85">{currentSchedule.sept4.dressCode.title}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 border-t border-white/10 pt-2.5">
                  <Clock className="w-4 h-4 text-[#e5cb8f] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#e5cb8f] uppercase tracking-wider text-[10px]">
                      {lang === 'es' ? 'Horario' : 'Schedule Highlight'}
                    </strong>
                    <span className="text-white/85">
                      {lang === 'es'
                        ? '18:00h Ceremonia · 19:15h Cóctel · 21:00h Banquete · Baile & Fiesta'
                        : '18:00 Ceremony · 19:15 Cocktail · 21:00 Banquet · Party & Dancing'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCalendarAdd(e, 'sept4')}
                  title="Añadir Sábado 4 a Google Calendar"
                  className="px-4 py-2 rounded-md text-xs font-semibold tracking-wider uppercase bg-[#e5cb8f] hover:bg-[#ffffff] text-[#37080e] transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#37080e]" />
                  <span>Google Cal</span>
                </button>
                <button
                  onClick={(e) => handleIcsDownload(e, 'sept4')}
                  title="Descargar .ics para Apple Calendar o Outlook"
                  className="px-3.5 py-2 rounded-md text-xs font-semibold tracking-wider uppercase border border-white/40 bg-black/20 hover:bg-white/10 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#e5cb8f]" />
                  <span>.iCS</span>
                </button>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#e5cb8f] group-hover:translate-x-1.5 transition-transform">
                <span>{lang === 'es' ? 'Ver Programa' : 'Schedule'}</span>
                <ArrowRight className="w-4 h-4 text-[#e5cb8f]" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
