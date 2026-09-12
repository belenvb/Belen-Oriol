/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OrnamentalDivider } from './components/OrnamentalDivider';
import { HorizontalTrencadis } from './components/HorizontalTrencadis';
import { ScheduleSection } from './components/ScheduleSection';
import { CastleGallery } from './components/CastleGallery';
import { JourneyMap } from './components/JourneyMap';
import { RegistrySection } from './components/RegistrySection';
import { RsvpSection } from './components/RsvpSection';
import { DigitalGuestbook } from './components/DigitalGuestbook';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [selectedDay, setSelectedDay] = useState<'sept3' | 'sept4'>('sept4');
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Track scroll position to update active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'schedule', 'castle', 'journey', 'registry', 'rsvp', 'guestbook', 'faq'];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
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
    // If target is dates, redirect smoothly to schedule
    const targetId = sectionId === 'dates' ? 'schedule' : sectionId;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c241e] font-sans selection:bg-[#5c141e] selection:text-white relative">
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
        ].map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              title={lang === 'es' ? item.labelEs : item.labelEn}
              className={`group flex items-center justify-end relative cursor-pointer p-1`}
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

      <main>
        {/* Cinematic Hero */}
        <Hero
          lang={lang}
          onNavigate={scrollToSection}
        />

        {/* Ornamental Divider */}
        <OrnamentalDivider variant="braid" />

        {/* Horizontal Trencadís: Authentic Gaudí mosaic divider */}
        <HorizontalTrencadis />

        {/* Consolidated Interactive Schedule for September 3 & 4 */}
        <ScheduleSection
          lang={lang}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        {/* El Castillo del Buen Amor Photo Gallery with Lightbox */}
        <CastleGallery lang={lang} />

        {/* Ornamental Divider */}
        <OrnamentalDivider variant="braid" />

        {/* Vintage Journey Map: Travel & Lodging Guide */}
        <JourneyMap lang={lang} />

        {/* Ornamental Divider */}
        <OrnamentalDivider variant="flourish" />

        {/* Polished Wedding Registry (Honeymoon Fund + Our Home + Bank Info) */}
        <RegistrySection lang={lang} />

        {/* Ornamental Divider */}
        <OrnamentalDivider variant="simple" />

        {/* RSVP Confirmation Section */}
        <RsvpSection lang={lang} />

        {/* Digital Guestbook of Wishes */}
        <DigitalGuestbook lang={lang} />

        {/* Guest FAQs */}
        <FaqSection lang={lang} />
      </main>

      {/* Royal Footer */}
      <Footer
        lang={lang}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
