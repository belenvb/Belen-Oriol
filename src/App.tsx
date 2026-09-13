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
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] text-[#2c241e] font-sans selection:bg-[#5c141e] selection:text-white relative overflow-x-hidden">
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#5c141e] origin-left z-[60] pointer-events-none" />
      <Header lang={lang} onLanguageChange={setLang} activeSection={activeSection} />

      <main className="w-full relative">
        <Hero lang={lang} onNavigate={scrollToSection} />
        <div className="page-content-stack">
        <HorizontalTrencadis />
        <StorySection lang={lang} />

        <section className="parallax-photo-break photo-rainbow-break" aria-label={lang === 'es' ? 'Islandia' : 'Iceland'}>
          <div className="parallax-photo-fixed" />
          <div className="photo-break-caption">{lang === 'es' ? 'Islandia · un arcoíris entre dos mundos' : 'Iceland · a rainbow between two worlds'}</div>
        </section>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <ScheduleSection lang={lang} selectedDay={selectedDay} onSelectDay={setSelectedDay} hasPrebodaAccess={true} />
        </motion.div>

        <section className="parallax-photo-break photo-temple-break" aria-label={lang === 'es' ? 'Viajes juntos' : 'Travels together'}>
          <div className="parallax-photo-fixed" />
          <div className="photo-break-caption">{lang === 'es' ? 'Viajes que se quedan con nosotros' : 'Places that stay with us'}</div>
        </section>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <JourneyMap lang={lang} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <RegistrySection lang={lang} />
        </motion.div>

        <section className="parallax-photo-break photo-basalt-break" aria-label={lang === 'es' ? 'Camino a la celebración' : 'Path to the celebration'}>
          <div className="parallax-photo-fixed" />
        </section>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <RsvpSection lang={lang} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <FaqSection lang={lang} />
        </motion.div>
        </div>
      </main>
      <Footer lang={lang} onNavigate={scrollToSection} />
    </div>
  );
}
