/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HorizontalTrencadis } from './components/HorizontalTrencadis';
import { ScheduleSection } from './components/ScheduleSection';
import { CastleGallery } from './components/CastleGallery';
import { JourneyMap } from './components/JourneyMap';
import { RegistrySection } from './components/RegistrySection';
import { RsvpSection } from './components/RsvpSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [selectedDay, setSelectedDay] = useState<'sept3' | 'sept4'>('sept4');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { scrollYProgress } = useScroll();

  const sectionList = ['hero', 'schedule', 'castle', 'journey', 'registry', 'rsvp', 'faq'];

  // Track scroll position to update active navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sectionList) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const targetId = sectionId === 'dates' ? 'schedule' : sectionId;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] text-[#2c241e] font-sans selection:bg-[#5c141e] selection:text-white relative overflow-x-hidden">
      {/* Fluid Reading & Scroll Progress Indicator (Gold-Burgundy Jewel Bar) */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#5c141e] origin-left z-[60] pointer-events-none"
      />

      {/* Sticky Header with Navigation & Language Switcher */}
      <Header
        lang={lang}
        onLanguageChange={setLang}
        activeSection={activeSection}
      />

      {/* Floating Side Quick Navigation for Desktop */}
      <div className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-2.5 bg-[#faf7f2]/90 backdrop-blur-md p-3 rounded-full border border-[rgba(92,20,30,0.15)] shadow-[0_8px_25px_rgba(0,0,0,0.06)]">
        {[
          { id: 'hero', labelEs: 'Inicio', labelEn: 'Home' },
          { id: 'schedule', labelEs: 'Programa', labelEn: 'Schedule' },
          { id: 'castle', labelEs: 'El Castillo', labelEn: 'The Castle' },
          { id: 'journey', labelEs: 'Viaje & Hoteles', labelEn: 'Travel/Hotels' },
          { id: 'registry', labelEs: 'Lista de Bodas', labelEn: 'Registry' },
          { id: 'rsvp', labelEs: 'Asistencia', labelEn: 'RSVP' },
          { id: 'faq', labelEs: 'Q&A', labelEn: 'Q&A' },
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              title={lang === 'es' ? item.labelEs : item.labelEn}
              className="group flex items-center justify-end relative cursor-pointer p-1"
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 px-2.5 py-1 rounded bg-[#37080e] text-white text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                {lang === 'es' ? item.labelEs : item.labelEn}
              </span>
              {/* Dot indicator */}
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-[#5c141e] scale-125 ring-2 ring-[#b89243]'
                    : 'bg-[#8c6d3b]/40 hover:bg-[#5c141e]/70'
                }`}
              />
            </button>
          );
        })}
      </div>

      <main className="w-full relative">
        {/* Cinematic Full-Screen Hero */}
        <Hero
          lang={lang}
          onNavigate={scrollToSection}
        />

        {/* Authentic Full-Width Gaudí Trencadís Mosaic Divider */}
        <HorizontalTrencadis />

        {/* Hand-drawn Pergamino Schedule for September 3 & 4 with Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <ScheduleSection
            lang={lang}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            hasPrebodaAccess={true}
          />
        </motion.div>

        {/* El Castillo del Buen Amor Photo Gallery with Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <CastleGallery lang={lang} />
        </motion.div>

        {/* Authentic Full-Width Gaudí Trencadís Mosaic Divider */}
        <HorizontalTrencadis />

        {/* Vintage Journey Map: Travel & Lodging Guide with Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <JourneyMap lang={lang} />
        </motion.div>

        {/* Authentic Full-Width Gaudí Trencadís Mosaic Divider */}
        <HorizontalTrencadis />

        {/* Polished Wedding Registry with Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <RegistrySection lang={lang} />
        </motion.div>

        {/* Authentic Full-Width Gaudí Trencadís Mosaic Divider */}
        <HorizontalTrencadis />

        {/* RSVP Confirmation Section with Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <RsvpSection lang={lang} />
        </motion.div>

        {/* Guest FAQs with Viewport Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <FaqSection lang={lang} />
        </motion.div>
      </main>

      {/* Royal Footer */}
      <Footer
        lang={lang}
        onNavigate={scrollToSection}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
