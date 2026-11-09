/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';

const NAV_SECTION_IDS = ['hero', 'story', 'schedule', 'journey', 'registry', 'rsvp', 'faq'] as const;
import { Language } from './types';
import { EnvelopeIntro } from './components/EnvelopeIntro';
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
import './styles/chapters.css';
import { invitationCodeFromHash } from './utils/invitationLink';
import type { GiftPaymentDetails } from './utils/rsvp';
import { invitationLanguageFromSearch, isInvitationLanguagePending } from './utils/invitationLanguage';

export default function App() {
  const [lang, setLang] = useState<Language>(() => invitationLanguageFromSearch(window.location.search) ?? 'es');
  const [selectedDay, setSelectedDay] = useState<'sept3' | 'sept4' | 'sept5'>('sept4');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [privateInvitationCode, setPrivateInvitationCode] = useState(() => invitationCodeFromHash(window.location.hash));
  const [resolvedLanguageCode, setResolvedLanguageCode] = useState('');
  const manualLanguageChoice = useRef(false);
  const explicitLanguage = invitationLanguageFromSearch(window.location.search);
  const languagePending = isInvitationLanguagePending(privateInvitationCode, resolvedLanguageCode, explicitLanguage);
  const chooseLanguage = (language: Language) => {
    manualLanguageChoice.current = true;
    setResolvedLanguageCode(privateInvitationCode);
    setLang(language);
  };
  const [prebodaUnlocked, setPrebodaUnlocked] = useState(false);
  const [registryVerified, setRegistryVerified] = useState(false);
  const [giftDetails, setGiftDetails] = useState<GiftPaymentDetails | null>(null);
  
  // En local o si la URL lleva ?intro o ?para=..., siempre mostramos el sobre para facilitar pruebas
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('no-intro')) return false;
      // A personal invitation always gets the cinematic envelope, even on a return visit.
      if (invitationCodeFromHash(window.location.hash)) return true;
      if (params.has('intro') || params.has('sobre') || params.has('para') || params.has('to') || params.has('guest')) {
        return true;
      }
      // En modo desarrollo local (npm run dev), mostrarlo por defecto a menos que se fuerce false
      if (import.meta.env.DEV && !params.has('no-intro')) {
        return true;
      }
      return !sessionStorage.getItem('belen_oriol_invitation_opened');
    } catch {
      return true;
    }
  });



  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  useEffect(() => {
    const onHashChange = () => {
      setPrivateInvitationCode(invitationCodeFromHash(window.location.hash));
      manualLanguageChoice.current = false;
      setResolvedLanguageCode('');
      setRegistryVerified(false);
      setGiftDetails(null);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!prebodaUnlocked && selectedDay === 'sept3') setSelectedDay('sept4');
  }, [prebodaUnlocked, selectedDay]);

  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const position = 90;
      for (const sectionId of NAV_SECTION_IDS) {
        const element = document.getElementById(sectionId);
        if (!element) continue;
        const bounds = element.getBoundingClientRect();
        if (position >= bounds.top && position < bounds.bottom) {
          setActiveSection((current) => current === sectionId ? current : sectionId);
          break;
        }
      }
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateActiveSection); };
    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Settle only near a section start after the user stops scrolling.
  // Wheel, touch and keyboard input always retain control, including tall chapters.
  useEffect(() => {
    if (showIntro || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let idle: ReturnType<typeof setTimeout>;
    let settling = false;
    let release: ReturnType<typeof setTimeout>;
    const cancel = () => {
      clearTimeout(idle);
      if (settling) {
        settling = false;
        clearTimeout(release);
        window.scrollTo({ top: window.scrollY, behavior: 'instant' });
      }
    };
    const onScroll = () => {
      if (settling) return;
      clearTimeout(idle);
      idle = setTimeout(() => {
        const offset = window.innerWidth < 768 ? 56 : 58;
        const tolerance = Math.min(90, window.innerHeight * .1);
        const starts = ['hero', 'story', 'schedule', 'journey', 'registry', 'rsvp', 'faq']
          .map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
          .map(el => el.getBoundingClientRect().top - offset);
        const delta = starts.sort((a, b) => Math.abs(a) - Math.abs(b))[0];
        if (delta === undefined || Math.abs(delta) < 3 || Math.abs(delta) > tolerance) return;
        settling = true;
        window.scrollTo({ top: Math.max(0, window.scrollY + delta), behavior: 'smooth' });
        release = setTimeout(() => { settling = false; }, 700);
      }, 220);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
    window.addEventListener('pointerdown', cancel);
    return () => {
      clearTimeout(idle); clearTimeout(release);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
      window.removeEventListener('pointerdown', cancel);
    };
  }, [showIntro]);

  const scrollToSection = (sectionId: string) => {
    const targetId = sectionId === 'dates' ? 'schedule' : sectionId;
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] text-[#2c241e] font-sans selection:bg-[#5c141e] selection:text-white relative overflow-x-clip">
      {/* Invitación Digital Cinematográfica con Lacre Interactivo */}
      {showIntro && (
        <EnvelopeIntro
          lang={lang}
          languagePending={languagePending}
          onLanguageChange={chooseLanguage}
          onEnter={() => {
            try { sessionStorage.setItem('belen_oriol_invitation_opened', 'true'); } catch { /* Storage may be unavailable */ }
            setShowIntro(false);
          }}
        />
      )}

      {!showIntro && <Header lang={lang} onLanguageChange={chooseLanguage} activeSection={activeSection} />}

      <main className="w-full relative">
        <Hero lang={lang} onNavigate={scrollToSection} />
        <div className="page-content-stack">
        <HorizontalTrencadis />
        <StorySection lang={lang} />



        <ScheduleSection lang={lang} selectedDay={selectedDay} onSelectDay={setSelectedDay} hasPrebodaAccess={prebodaUnlocked} />
        <JourneyMap lang={lang} />
        <RegistrySection lang={lang} verified={registryVerified} giftDetails={giftDetails} />
        <RsvpSection
          lang={lang}
          initialInvitationCode={privateInvitationCode}
          onInvitationValidated={(invitation) => {
            setPrebodaUnlocked(Boolean(invitation?.invitedToPreboda));
             setRegistryVerified(Boolean(invitation));
             setGiftDetails(invitation?.giftDetails ?? null);
            setResolvedLanguageCode(privateInvitationCode);
            if (!explicitLanguage && !manualLanguageChoice.current &&
              (invitation?.language === 'es' || invitation?.language === 'en')) setLang(invitation.language);
          }}
        />
        <FaqSection lang={lang} />
        </div>
      </main>
      <Footer lang={lang} onNavigate={scrollToSection} />
    </div>
  );
}
