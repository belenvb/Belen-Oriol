import { useState } from 'react';
import {
  Gift,
  CreditCard,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  HeartHandshake,
  Palmtree,
  Home,
  Send,
} from 'lucide-react';
import { motion } from 'motion/react';
import { weddingInfo } from '../data/content';
import { Language } from '../types';

interface RegistrySectionProps {
  lang: Language;
}

export function RegistrySection({ lang }: RegistrySectionProps) {
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedBic, setCopiedBic] = useState(false);
  const [copiedBizum, setCopiedBizum] = useState(false);
  const [copiedVenmo, setCopiedVenmo] = useState(false);

  const handleCopy = (text: string, type: 'iban' | 'bic' | 'bizum' | 'venmo') => {
    navigator.clipboard.writeText(text);
    if (type === 'iban') {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2500);
    } else if (type === 'bic') {
      setCopiedBic(true);
      setTimeout(() => setCopiedBic(false), 2500);
    } else if (type === 'bizum') {
      setCopiedBizum(true);
      setTimeout(() => setCopiedBizum(false), 2500);
    } else if (type === 'venmo') {
      setCopiedVenmo(true);
      setTimeout(() => setCopiedVenmo(false), 2500);
    }
  };

  const venmoHandle = weddingInfo.bankInfo.venmoHandle || '@Belen-Oriol-2027';

  return (
    <section
      id="registry"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase mb-4 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'Lista de Bodas' : 'Wedding Registry'}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'Lista de Bodas' : 'Wedding Registry'}
          </h2>

          <p className="font-cormorant text-base sm:text-lg text-[#6e675f] italic mt-2 tracking-wide">
            {lang === 'es' ? '«El mejor regalo es vuestra presencia»' : '«Your presence is our gift»'}
          </p>

          <p className="font-sans text-xs sm:text-sm text-[#554f47] mt-3 max-w-xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'Vuestra presencia y acompañarnos en Salamanca es lo más importante para nosotros. Si además deseáis tener un detalle para nuestra luna de miel o para nuestro hogar, ponemos a vuestra disposición estos canales:'
              : 'Having you with us in Salamanca is our greatest joy. If you also wish to honor us with a gift toward our honeymoon or our new home, you may do so through the details below:'}
          </p>

          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-5" />
        </motion.div>

        {/* Gift Destinations: Honeymoon & Our Home */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 max-w-2xl mx-auto"
        >
          {/* Honeymoon Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/90 border border-[#b89243]/40 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#fdf2df] border border-[#b89243]/50 flex items-center justify-center shrink-0 text-[#b89243]">
              <Palmtree className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#37080e] uppercase tracking-wide">
                {lang === 'es' ? 'Luna de Miel' : 'Honeymoon Journey'}
              </h4>
              <p className="text-xs text-[#6e675f] mt-0.5 leading-snug">
                {lang === 'es'
                  ? 'Para ayudarnos a crear recuerdos inolvidables en nuestro primer viaje de casados.'
                  : 'Helping us craft unforgettable memories on our first adventure as newlyweds.'}
              </p>
            </div>
          </div>

          {/* Our Home Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-white/90 border border-[#b89243]/40 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#fae8eb] border border-[#5c141e]/30 flex items-center justify-center shrink-0 text-[#5c141e]">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#37080e] uppercase tracking-wide">
                {lang === 'es' ? 'Nuestro Nuevo Hogar' : 'Our New Home'}
              </h4>
              <p className="text-xs text-[#6e675f] mt-0.5 leading-snug">
                {lang === 'es'
                  ? 'Para construir y equipar nuestro nuevo nido juntos para esta próxima etapa.'
                  : 'Helping us build and feather our new beginnings together.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bank, Bizum & Venmo Direct Transfer Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-br from-[#fdfbf7] via-[#faf5ec] to-[#f4ebe0] rounded-2xl border-2 border-[#b89243]/60 p-6 sm:p-10 shadow-[0_16px_50px_rgba(184,146,67,0.12)] relative overflow-hidden"
        >
          {/* Top Gold Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#dfc285] via-[#b89243] to-[#dfc285]" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#b89243]/20 pb-5 mb-7">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center text-[#5c141e]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl text-[#37080e] font-bold uppercase tracking-wider">
                  {lang === 'es' ? 'Transferencia, Bizum & Venmo' : 'Bank Transfer, Bizum & Venmo'}
                </h3>
                <span className="text-[11px] tracking-wider uppercase text-[#8c6d3b] font-medium">
                  {lang === 'es' ? 'Cuenta Oficial para el Enlace' : 'Official Wedding Account'}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#5c141e] font-cinzel font-semibold px-3 py-1 rounded-full bg-[#5c141e]/8 border border-[#5c141e]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#b89243]" />
              <span>Salamanca · 2027</span>
            </div>
          </div>

          {/* Holders & Concept */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs text-[#44403c]">
            <div className="bg-white/70 p-4 rounded-xl border border-[#b89243]/25">
              <span className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#8c6d3b] mb-1">
                {lang === 'es' ? 'Titulares de la Cuenta' : 'Account Beneficiaries'}
              </span>
              <p className="font-playfair text-base sm:text-lg text-[#37080e] font-bold">
                {weddingInfo.bankInfo.holders}
              </p>
            </div>

            <div className="bg-white/70 p-4 rounded-xl border border-[#b89243]/25">
              <span className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#8c6d3b] mb-1">
                {lang === 'es' ? 'Concepto Recomendado' : 'Suggested Reference'}
              </span>
              <p className="font-playfair text-base sm:text-lg text-[#37080e] font-bold">
                {weddingInfo.bankInfo.conceptSample}
              </p>
            </div>
          </div>

          {/* IBAN Primary Box */}
          <div className="p-5 sm:p-6 rounded-xl bg-white border-2 border-[#b89243] shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block text-[10px] tracking-widest uppercase font-bold text-[#8c6d3b] mb-1">
                  IBAN (ESPAÑA / CAIXABANK)
                </span>
                <span className="font-mono text-base sm:text-lg font-bold text-[#1c1917] tracking-wider select-all">
                  {weddingInfo.bankInfo.iban}
                </span>
              </div>

              <button
                onClick={() => handleCopy(weddingInfo.bankInfo.iban, 'iban')}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                  copiedIban
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-[#5c141e] hover:bg-[#7a1d2b] text-white shadow-sm'
                }`}
              >
                {copiedIban ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#e5cb8f]" />
                    <span>{lang === 'es' ? 'Copiar IBAN' : 'Copy IBAN'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BIC, Bizum & Venmo Channels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* BIC/SWIFT */}
            <div className="p-4 rounded-xl bg-white border border-[#b89243]/30 flex items-center justify-between">
              <div>
                <span className="block text-[9px] tracking-widest uppercase font-bold text-[#8c6d3b]">
                  BIC / SWIFT (INTERNACIONAL)
                </span>
                <span className="font-mono text-sm font-semibold text-[#1c1917]">
                  {weddingInfo.bankInfo.bic}
                </span>
              </div>
              <button
                onClick={() => handleCopy(weddingInfo.bankInfo.bic, 'bic')}
                className="p-2 text-[#5c141e] hover:bg-[#5c141e]/10 rounded-lg transition-colors cursor-pointer"
                title="Copiar BIC"
              >
                {copiedBic ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Bizum */}
            <div className="p-4 rounded-xl bg-white border border-[#b89243]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[#5c141e] shrink-0" />
                <div>
                  <span className="block text-[9px] tracking-widest uppercase font-bold text-[#8c6d3b]">
                    BIZUM (TELÉFONO)
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#1c1917]">
                    {weddingInfo.bankInfo.bizumPhone}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(weddingInfo.bankInfo.bizumPhone, 'bizum')}
                className="p-2 text-[#5c141e] hover:bg-[#5c141e]/10 rounded-lg transition-colors cursor-pointer"
                title="Copiar Bizum"
              >
                {copiedBizum ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Venmo */}
            <div className="p-4 rounded-xl bg-white border border-[#b89243]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-[#008cff] shrink-0" />
                <div>
                  <span className="block text-[9px] tracking-widest uppercase font-bold text-[#8c6d3b]">
                    VENMO (@HANDLE)
                  </span>
                  <span className="font-mono text-sm font-semibold text-[#1c1917]">
                    {venmoHandle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopy(venmoHandle, 'venmo')}
                className="p-2 text-[#5c141e] hover:bg-[#5c141e]/10 rounded-lg transition-colors cursor-pointer"
                title="Copiar Venmo"
              >
                {copiedVenmo ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Affectionate Footer note */}
          <div className="mt-7 pt-5 border-t border-[#b89243]/20 flex items-center justify-center gap-2 text-center text-[#5c141e]">
            <HeartHandshake className="w-4 h-4 text-[#b89243]" />
            <span className="font-cormorant italic text-base sm:text-lg text-[#5c141e]">
              {lang === 'es'
                ? '¡Muchísimas gracias por acompañarnos en este día tan especial!'
                : 'Thank you from the bottom of our hearts for celebrating with us!'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
