import { useState } from 'react';
import {
  Gift,
  CreditCard,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  HeartHandshake,
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

  const handleCopy = (text: string, type: 'iban' | 'bic' | 'bizum') => {
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
    }
  };

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
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase mb-4 shadow-2xs">
            <Gift className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'Lista de Bodas' : 'Wedding Registry'}</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'El Mejor Regalo Sois Vosotros' : 'Your Presence Is Our Gift'}
          </h2>

          <p className="font-cormorant text-xl sm:text-2xl text-[#44403c] italic mt-4 max-w-xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'El mejor y más valioso regalo es vuestra compañía y cariño en este día tan soñado. Si además deseáis tener un detalle con nosotros para comenzar esta nueva etapa y nuestro viaje de luna de miel, podéis hacerlo a través de los siguientes canales:'
              : 'The greatest gift is having you with us in Salamanca to share our happiness. If you wish to honor us with a gift for our new chapter and honeymoon journey, you may do so through the details below:'}
          </p>

          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-6" />
        </motion.div>

        {/* Bank & Bizum Direct Transfer Card */}
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
                  {lang === 'es' ? 'Datos Bancarios & Bizum' : 'Bank Transfer & Bizum'}
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
              <span className="text-[11px] text-[#6e675f] font-medium">
                {weddingInfo.bankInfo.bankName}
              </span>
            </div>

            <div className="bg-white/70 p-4 rounded-xl border border-[#b89243]/25">
              <span className="block text-[10px] tracking-[0.2em] uppercase font-bold text-[#8c6d3b] mb-1">
                {lang === 'es' ? 'Concepto Sugerido' : 'Suggested Reference'}
              </span>
              <p className="font-sans text-xs sm:text-sm font-semibold text-[#5c141e] bg-[#5c141e]/8 p-2 rounded-lg border border-[rgba(92,20,30,0.12)]">
                {weddingInfo.bankInfo.conceptSample}
              </p>
            </div>
          </div>

          {/* IBAN Copy Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border-2 border-[#b89243]/50 mb-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          {/* BIC & Bizum Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Smartphone className="w-4 h-4 text-[#5c141e]" />
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
                title="Copiar Teléfono Bizum"
              >
                {copiedBizum ? (
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
                ? '¡Muchísimas gracias por formar parte de este capítulo tan especial!'
                : 'Thank you from the bottom of our hearts for celebrating with us!'}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
