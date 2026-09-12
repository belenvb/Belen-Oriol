import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { weddingInfo } from '../data/content';
import { Language } from '../types';

interface HeroProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
}

export function Hero({ lang, onNavigate }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(weddingInfo.dates.sept3Iso).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-b from-[#0e1e14] via-[#14281b] to-[#0a160e] text-[#f8f5ee] px-4 pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      {/* Ambient forest green radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(31,61,42,0.65)_0%,rgba(14,30,20,0.95)_70%,#0a160e_100%)] pointer-events-none" />

      {/* Subtle classical gold frame placed closer to the edges for a delicate architectural margin */}
      <div className="absolute inset-1.5 sm:inset-3 md:inset-4 border border-[#dfc285]/15 pointer-events-none z-10 rounded-xs">
        <div className="absolute inset-1 sm:inset-1.5 border border-[#dfc285]/10" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-3xl mx-auto flex flex-col items-center">
        {/* Subtle "Save the date" tag above names */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-2 sm:mb-2.5"
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.38em] uppercase font-light text-[#dfc285]/80 font-sans">
            Save the Date
          </span>
        </motion.div>

        {/* Couple Names - Refined scale with baroque '&' */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mb-3"
        >
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[0.12em] text-[#fcfaf6] uppercase leading-tight drop-shadow-md flex items-center justify-center gap-2 sm:gap-3">
            <span>Belén</span>
            <span className="font-cormorant italic font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#dfc285] select-none mx-2 sm:mx-3 inline-block leading-none drop-shadow-[0_2px_10px_rgba(223,194,133,0.35)]">
              &amp;
            </span>
            <span>Oriol</span>
          </h1>
        </motion.div>

        {/* Location & Castle - Closely grouped with the date */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col items-center gap-1.5 mb-8 sm:mb-10"
        >
          <span className="text-[10.5px] sm:text-[11.5px] tracking-[0.28em] text-[#dfc285]/90 uppercase font-light">
            Castillo del Buen Amor · Salamanca
          </span>

          {/* Dates Bar: Directly below the location with Septiembre capitalized */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-[#dfc285]/70" />
            <span className="font-cormorant italic text-base sm:text-lg text-[#f8f5ee] tracking-wide">
              {lang === 'es' ? '3 & 4 de Septiembre de 2027' : 'September 3 & 4, 2027'}
            </span>
            <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-[#dfc285]/70" />
          </div>
        </motion.div>

        {/* Countdown in refined boxes without heavy bold typography */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="w-full max-w-[280px] sm:max-w-[320px] mx-auto mb-16 sm:mb-20"
        >
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {[
              { label: lang === 'es' ? 'DÍAS' : 'DAYS', value: timeLeft.days },
              { label: lang === 'es' ? 'HORAS' : 'HOURS', value: timeLeft.hours },
              { label: lang === 'es' ? 'MINUTOS' : 'MINS', value: timeLeft.minutes },
              { label: lang === 'es' ? 'SEGUNDOS' : 'SECS', value: timeLeft.seconds },
            ].map((box, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-2 px-1.5 rounded-lg bg-black/30 backdrop-blur-md border border-[#dfc285]/20 shadow-[0_3px_14px_rgba(0,0,0,0.25)]"
              >
                <span className="font-cinzel text-lg sm:text-xl font-normal text-[#dfc285] leading-none tracking-normal">
                  {String(box.value).padStart(2, '0')}
                </span>
                <span className="text-[7.5px] sm:text-[8px] tracking-[0.2em] uppercase font-light text-[#d1b88a]/80 mt-1 font-sans">
                  {box.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Slide to Discover with thin ray of light */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        onClick={() => onNavigate('dates')}
        className="absolute bottom-4 sm:bottom-6 z-20 flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
        aria-label={lang === 'es' ? 'Desliza para descubrir' : 'Slide to discover'}
      >
        <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.26em] uppercase font-light text-[#dfc285]/70 group-hover:text-[#dfc285] transition-colors">
          {lang === 'es' ? 'Desliza para descubrir' : 'Slide to discover'}
        </span>
        {/* Very thin, elegant ray of light passing vertically */}
        <div className="w-[1px] h-8 relative overflow-hidden bg-white/15">
          <motion.div
            animate={{
              y: [-32, 32],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-[1px] h-4 bg-gradient-to-b from-transparent via-[#dfc285] to-transparent shadow-[0_0_6px_#dfc285]"
          />
        </div>
      </motion.button>
    </section>
  );
}
