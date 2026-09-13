import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { Language } from '../types';
import { romanticSynth } from '../utils/audio';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
}

export function Header({ lang, onLanguageChange, activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAudio = () => {
    const active = romanticSynth.toggle();
    setIsPlayingAudio(active);
  };

  const navLinks = [
    { href: '#hero', es: 'Inicio', en: 'Home' },
    { href: '#schedule', es: 'Programa', en: 'Schedule' },
    { href: '#castle', es: 'El Castillo', en: 'The Castle' },
    { href: '#journey', es: 'Viaje & Hoteles', en: 'Travel/Hotels' },
    { href: '#registry', es: 'Lista de Bodas', en: 'Registry' },
    { href: '#faq', es: 'Q&A', en: 'Q&A' },
    { href: '#rsvp', es: 'Asistencia', en: 'RSVP' },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#faf7f2]/95 backdrop-blur-md py-3 shadow-[0_4px_24px_rgba(45,30,15,0.06)] border-b border-[rgba(92,20,30,0.12)] text-[#37080e]' : 'bg-[#0e1e14]/75 backdrop-blur-md py-4 border-b border-[#dfc285]/20 text-[#f8f5ee]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }} className="shrink-0 mr-2 xl:mr-6 focus:outline-none">
          <span className={`text-[10px] sm:text-[11px] tracking-[0.18em] xl:tracking-[0.22em] uppercase font-semibold transition-colors font-cinzel whitespace-nowrap ${isScrolled ? 'text-[#5c141e]' : 'text-[#dfc285]'}`}>
            Salamanca · 04.09.2027
          </span>
        </a>

        <nav className="hidden xl:flex items-center gap-3.5 xl:gap-6 2xl:gap-7 justify-center flex-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <button key={link.href} onClick={() => handleNavClick(link.href)} className={`text-[10.5px] xl:text-[11px] tracking-[0.13em] xl:tracking-[0.18em] uppercase font-medium transition-all duration-200 relative py-1 focus:outline-none cursor-pointer whitespace-nowrap ${isActive ? (isScrolled ? 'text-[#5c141e] font-bold' : 'text-[#dfc285] font-bold') : (isScrolled ? 'text-[#574c43] hover:text-[#5c141e]' : 'text-[#f8f5ee]/80 hover:text-[#dfc285]')}`}>
                {lang === 'es' ? link.es : link.en}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#b89243] rounded-full" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 xl:ml-4">
          <button onClick={toggleAudio} className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${isPlayingAudio ? 'border-[#b89243] bg-[#b89243]/20 text-[#dfc285]' : isScrolled ? 'border-[#b89243]/30 hover:border-[#b89243] bg-white/70 text-[#5c141e]' : 'border-[#dfc285]/30 hover:border-[#dfc285] bg-black/20 text-[#dfc285]'}`} title={isPlayingAudio ? 'Silenciar música' : 'Reproducir música'} aria-label={lang === 'es' ? (isPlayingAudio ? 'Silenciar música' : 'Reproducir música') : (isPlayingAudio ? 'Mute music' : 'Play music')}>
            {isPlayingAudio ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className={`flex items-center rounded-full p-0.5 border shadow-2xs ${isScrolled ? 'border-[#b89243]/30 bg-white/70' : 'border-[#dfc285]/30 bg-black/25'}`}>
            <button onClick={() => onLanguageChange('es')} className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded-full transition-all cursor-pointer ${lang === 'es' ? 'bg-[#b89243] text-[#0d1a12] font-bold shadow-xs' : isScrolled ? 'text-[#44403c] hover:text-[#5c141e]' : 'text-[#f8f5ee]/80 hover:text-[#dfc285]'}`}>ES</button>
            <button onClick={() => onLanguageChange('en')} className={`px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded-full transition-all cursor-pointer ${lang === 'en' ? 'bg-[#b89243] text-[#0d1a12] font-bold shadow-xs' : isScrolled ? 'text-[#44403c] hover:text-[#5c141e]' : 'text-[#f8f5ee]/80 hover:text-[#dfc285]'}`}>EN</button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`xl:hidden p-2 rounded-lg focus:outline-none ${isScrolled ? 'text-[#5c141e] hover:bg-black/5' : 'text-[#dfc285] hover:bg-white/10'}`} aria-expanded={isMobileMenuOpen} aria-label={lang === 'es' ? 'Menú' : 'Menu'}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="xl:hidden bg-[#faf7f2]/98 backdrop-blur-xl border-b border-[#b89243]/30 px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button key={link.href} onClick={() => handleNavClick(link.href)} className="text-left py-2 font-cinzel text-xs tracking-[0.25em] uppercase text-[#37080e] hover:text-[#5c141e] border-b border-[#b89243]/15 flex items-center justify-between">
                <span>{lang === 'es' ? link.es : link.en}</span>
                <span className="text-xs text-[#b89243]">✦</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
