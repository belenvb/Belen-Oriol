/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, useScroll } from 'motion/react';
import { Language } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HorizontalTrencadis } from './components/HorizontalTrencadis';
import { StorySection } from './components/StorySection';
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

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

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
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#5c141e] origin-left z-[60] pointer-events-none"
      />
      <Header
        lang={lang}
        onLanguageChange={setLang}
        activeSection={activeSection}
      />

      <main className="w-full relative">
        <Hero
          lang={lang}
          onNavigate={scrollToSection}
        />
        

        <HorizontalTrencadis />
        <StorySection lang={lang} />
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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <CastleGallery lang={lang} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <JourneyMap lang={lang} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <RegistrySection lang={lang} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <RsvpSection lang={lang} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <FaqSection lang={lang} />
        </motion.div>
      </main>
      <Footer
        lang={lang}
        onNavigate={scrollToSection}
      />
    </div>
  );
}

