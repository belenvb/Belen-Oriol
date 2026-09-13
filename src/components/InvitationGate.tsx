import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Sparkles, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { Monogram } from './Monogram';
import { Language } from '../types';
import { GuestData, findGuestByInput } from '../data/guests';

interface InvitationGateProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onUnlock: (guest: GuestData) => void;
}

export function InvitationGate({ lang, onLanguageChange, onUnlock }: InvitationGateProps) {
  const [inputCode, setInputCode] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpen = (codeToUse?: string) => {
    const raw = codeToUse !== undefined ? codeToUse : inputCode;
    if (!raw.trim()) {
      setErrorMsg(
        lang === 'es'
          ? 'Por favor, introduce tu nombre o el código de tu invitación'
          : 'Please enter your name or your invitation code'
      );
      return;
    }

    setErrorMsg('');
    setIsOpening(true);

    const guest = findGuestByInput(raw);
    setTimeout(() => {
      onUnlock(guest);
    }, 900);
  };

  const handleQuickSelect = (code: string) => {
    setInputCode(code);
    handleOpen(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#1d0508] via-[#2f0a10] to-[#120305] text-[#f7eedc] overflow-y-auto">
      {/* Background Animated Stardust & Vignette */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#dfc285_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Language Switcher in top right corner */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1 bg-[#421017]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#dfc285]/30 text-xs font-cinzel">
        <button
          onClick={() => onLanguageChange('es')}
          className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
            lang === 'es' ? 'bg-[#dfc285] text-[#37080e] font-bold' : 'text-[#f7eedc]/70 hover:text-white'
          }`}
        >
          ES
        </button>
        <span className="text-[#dfc285]/40">·</span>
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
            lang === 'en' ? 'bg-[#dfc285] text-[#37080e] font-bold' : 'text-[#f7eedc]/70 hover:text-white'
          }`}
        >
          EN
        </button>
      </div>

      <AnimatePresence>
        <motion.div
          key="envelope"
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)', transition: { duration: 0.6 } }}
          className="relative w-full max-w-lg my-auto"
        >
          {/* Main Envelope Card with Luxury Gold & Stitched Border */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#f9f4ea] via-[#f5ede0] to-[#eee2cf] p-6 sm:p-10 text-[#37080e] shadow-[0_25px_70px_rgba(0,0,0,0.7)] border-4 border-[#dfc285]/70 overflow-hidden">
            {/* Guilloché / Security Border Inset */}
            <div className="absolute inset-3 border border-[#b89243]/40 rounded-2xl pointer-events-none" />
            <div className="absolute inset-4 border border-dashed border-[#b89243]/25 rounded-xl pointer-events-none" />

            {/* Top Ornamental Stamp */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3">
                {/* Wax Seal with BO Monogram */}
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#7a1828] via-[#5c141e] to-[#3a080f] shadow-[0_8px_20px_rgba(58,8,15,0.45)] border-2 border-[#dfc285] flex items-center justify-center p-2 relative cursor-pointer ring-4 ring-[#dfc285]/20"
                >
                  <Monogram size={48} variant="gold" />
                </motion.div>
                {/* Tiny Crown-like sparkle */}
                <div className="absolute -top-1 -right-1 text-[#b89243]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* "You Are Invited" Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#5c141e]/10 border border-[#5c141e]/20 text-[#5c141e] text-[10px] sm:text-xs font-cinzel font-bold tracking-[0.25em] uppercase mb-2">
                <Heart className="w-3 h-3 fill-[#5c141e]/30" />
                <span>{lang === 'es' ? 'ESTÁS INVITADO / YOU ARE INVITED' : 'YOU ARE INVITED'}</span>
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[0.05em] uppercase text-[#37080e] leading-tight mb-1">
                Belén &amp; Oriol
              </h1>

              <p className="font-cormorant italic text-base sm:text-lg text-[#8c6d3b] tracking-wide">
                {lang === 'es'
                  ? 'Salamanca & Castillo del Buen Amor · Septiembre 2027'
                  : 'Salamanca & Castillo del Buen Amor · September 2027'}
              </p>
            </div>

            {/* Divider line with small diamond */}
            <div className="flex items-center gap-3 my-4 opacity-40">
              <div className="flex-1 h-[1px] bg-[#8c6d4f]" />
              <span className="text-[#8c6d4f] text-xs">❖</span>
              <div className="flex-1 h-[1px] bg-[#8c6d4f]" />
            </div>

            {/* Access Code Input Form */}
            <div className="space-y-4">
              <div className="text-center">
                <label
                  htmlFor="guest-code-input"
                  className="block font-cinzel text-xs font-bold tracking-[0.15em] text-[#5c141e] uppercase mb-1.5"
                >
                  {lang === 'es'
                    ? 'Introduce tu nombre o código de invitación'
                    : 'Enter your name or invitation code'}
                </label>
                <p className="text-xs text-[#6e675f] font-cormorant italic">
                  {lang === 'es'
                    ? 'Para acceder a tu programa y confirmar tu asistencia'
                    : 'To access your personalized itinerary and RSVP'}
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c6d3b]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="guest-code-input"
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpen();
                  }}
                  placeholder={lang === 'es' ? 'Ej. Belén, BO-PREBODA, BO-BODA...' : 'E.g. Belén, BO-PREBODA, BO-BODA...'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-[#b89243]/50 text-[#37080e] placeholder-[#8c6d3b]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#5c141e] focus:border-transparent transition-all shadow-inner uppercase tracking-wider"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-[#9e162f] font-medium text-center animate-shake">
                  {errorMsg}
                </p>
              )}

              {/* Main Enter Button */}
              <button
                onClick={() => handleOpen()}
                disabled={isOpening}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#5c141e] via-[#74182a] to-[#5c141e] text-[#f7eedc] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#dfc285]/40"
              >
                {isOpening ? (
                  <span>{lang === 'es' ? 'Abriendo invitación...' : 'Opening invitation...'}</span>
                ) : (
                  <>
                    <span>{lang === 'es' ? 'Abrir Invitación' : 'Open Invitation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Helper / Demo access keys for testing & couple convenience */}
            <div className="mt-6 pt-4 border-t border-[#8c6d4f]/20">
              <div className="text-[10px] font-cinzel tracking-wider uppercase text-[#8c6d3b] text-center mb-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#5c141e]" />
                <span>{lang === 'es' ? 'Accesos rápidos de prueba:' : 'Quick test access:'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleQuickSelect('BO-PREBODA')}
                  className="p-2 rounded-lg bg-white/60 hover:bg-white border border-[#b89243]/30 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-[#5c141e] group-hover:text-[#9e162f] flex items-center justify-between text-[11px]">
                    <span>BO-PREBODA</span>
                    <span className="text-[9px] bg-[#5c141e]/10 px-1.5 py-0.5 rounded text-[#5c141e]">3 &amp; 4 SEP</span>
                  </div>
                  <div className="text-[10px] text-[#6e675f] leading-tight mt-0.5">
                    {lang === 'es' ? 'Preboda + Boda completa' : 'Eve gathering + Wedding'}
                  </div>
                </button>

                <button
                  onClick={() => handleQuickSelect('BO-BODA')}
                  className="p-2 rounded-lg bg-white/60 hover:bg-white border border-[#b89243]/30 text-left transition-all cursor-pointer group"
                >
                  <div className="font-bold text-[#37080e] group-hover:text-[#5c141e] flex items-center justify-between text-[11px]">
                    <span>BO-BODA</span>
                    <span className="text-[9px] bg-[#37080e]/10 px-1.5 py-0.5 rounded text-[#37080e]">4 SEP</span>
                  </div>
                  <div className="text-[10px] text-[#6e675f] leading-tight mt-0.5">
                    {lang === 'es' ? 'Solo Día de Boda (Castillo)' : 'Wedding Day Only (Castle)'}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
