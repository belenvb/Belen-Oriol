import { useState, type FormEvent } from 'react';
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
  MessageSquareHeart,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { weddingInfo } from '../data/content';
import { Language } from '../types';

interface RegistrySectionProps {
  lang: Language;
}

type GiftTarget = 'honeymoon' | 'home';
type PaymentMethod = 'bank' | 'bizum' | 'venmo';

interface StoredRegistryNote {
  name: string;
  note: string;
  target: GiftTarget;
  method: PaymentMethod;
  date: string;
}

export function RegistrySection({ lang }: RegistrySectionProps) {
  const [targetDestination, setTargetDestination] = useState<GiftTarget>('honeymoon');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [noteSubmitted, setNoteSubmitted] = useState(false);

  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedBic, setCopiedBic] = useState(false);
  const [copiedBizum, setCopiedBizum] = useState(false);
  const [copiedVenmo, setCopiedVenmo] = useState(false);
  const [copiedConcept, setCopiedConcept] = useState(false);

  const handleCopy = (text: string, type: 'iban' | 'bic' | 'bizum' | 'venmo' | 'concept') => {
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
    } else if (type === 'concept') {
      setCopiedConcept(true);
      setTimeout(() => setCopiedConcept(false), 2500);
    }
  };

  const venmoHandle = weddingInfo.bankInfo.venmoHandle || '@Belen-Oriol-2027';

  // Dynamic suggested concept depending on chosen destination and guest name
  const destinationLabel =
    targetDestination === 'honeymoon'
      ? lang === 'es'
        ? 'Luna de Miel'
        : 'Honeymoon'
      : lang === 'es'
      ? 'Nuestro Hogar'
      : 'Our Home';

  const suggestedConcept = guestName.trim()
    ? `Boda B&O [${destinationLabel}] - ${guestName.trim()}`
    : `Boda B&O [${destinationLabel}] - [Tu Nombre]`;

  const handleSubmitNote = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() && !guestNote.trim()) return;

    try {
      const existingRaw = localStorage.getItem('wedding_registry_notes');
      const existing: StoredRegistryNote[] = existingRaw ? JSON.parse(existingRaw) : [];
      const newEntry: StoredRegistryNote = {
        name: guestName.trim() || (lang === 'es' ? 'Invitado anónimo' : 'Anonymous guest'),
        note: guestNote.trim(),
        target: targetDestination,
        method: paymentMethod || 'bank',
        date: new Date().toISOString(),
      };
      existing.unshift(newEntry);
      localStorage.setItem('wedding_registry_notes', JSON.stringify(existing));
    } catch {
      // Local storage fallback
    }

    setNoteSubmitted(true);
  };

  return (
    <section
      id="registry"
      className="registry-section-shell py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#5c141e]/[0.06] to-transparent pointer-events-none" />
      <div className="absolute -left-12 top-20 h-48 w-48 rounded-full bg-[#b89243]/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-12 bottom-16 h-56 w-56 rounded-full bg-[#5c141e]/10 blur-3xl pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
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

          <p className="font-cormorant text-xl sm:text-2xl text-[#6e675f] italic mt-2 tracking-wide">
            {lang === 'es' ? '«El mejor regalo es vuestra presencia»' : '«Your presence is our gift»'}
          </p>

          <p className="font-sans text-xs sm:text-sm text-[#554f47] mt-3 max-w-xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'Acompañarnos en nuestro gran día en Salamanca es lo más importante para nosotros. Si deseáis tener un detalle, podéis seleccionar si preferís destinarlo a nuestra luna de miel o a nuestro hogar, y elegir el canal más cómodo.'
              : 'Celebrating with us in Salamanca is what matters most. If you wish to give a gift, you can select whether to contribute to our honeymoon or our new home, and pick your preferred method.'}
          </p>

          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-5" />
        </motion.div>

        <figure className="registry-illustration-card">
          <img src="/photos/wedding-illustration.webp" alt={lang === 'es' ? 'Ilustración de los novios' : 'Wedding illustration'} loading="lazy" />
        </figure>

        {/* Step 1: Select Gift Destination */}
        <div className="mb-8">
          <span className="block font-cinzel text-xs font-bold text-[#8c6d3b] uppercase tracking-[0.2em] mb-3 text-center">
            {lang === 'es'
              ? '1. Selecciona el destino de tu detalle'
              : '1. Select where to direct your gift'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Honeymoon Card */}
            <button
              type="button"
              onClick={() => setTargetDestination('honeymoon')}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left cursor-pointer flex items-center gap-4 relative shadow-xs ${
                targetDestination === 'honeymoon'
                  ? 'bg-gradient-to-br from-[#fbf5eb] to-[#f4e8d3] border-[#b89243] ring-2 ring-[#b89243]/30 shadow-md'
                  : 'bg-white/80 hover:bg-white border-[rgba(92,20,30,0.15)] hover:border-[#b89243]/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  targetDestination === 'honeymoon'
                    ? 'bg-[#5c141e] text-[#dfc285]'
                    : 'bg-[#fdf2df] text-[#b89243]'
                }`}
              >
                <Palmtree className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-cinzel text-base font-bold text-[#37080e]">
                    {lang === 'es' ? 'Luna de Miel' : 'Honeymoon'}
                  </h4>
                  {targetDestination === 'honeymoon' && (
                    <span className="w-5 h-5 rounded-full bg-[#5c141e] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6e675f] mt-1 leading-snug">
                  {lang === 'es'
                    ? 'Para recuerdos inolvidables en nuestro primer viaje de casados.'
                    : 'Unforgettable memories on our first journey as newlyweds.'}
                </p>
              </div>
            </button>

            {/* Our Home Card */}
            <button
              type="button"
              onClick={() => setTargetDestination('home')}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left cursor-pointer flex items-center gap-4 relative shadow-xs ${
                targetDestination === 'home'
                  ? 'bg-gradient-to-br from-[#fbf5eb] to-[#f4e8d3] border-[#b89243] ring-2 ring-[#b89243]/30 shadow-md'
                  : 'bg-white/80 hover:bg-white border-[rgba(92,20,30,0.15)] hover:border-[#b89243]/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  targetDestination === 'home'
                    ? 'bg-[#5c141e] text-[#dfc285]'
                    : 'bg-[#fae8eb] text-[#5c141e]'
                }`}
              >
                <Home className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-cinzel text-base font-bold text-[#37080e]">
                    {lang === 'es' ? 'Nuestro Nuevo Hogar' : 'Our New Home'}
                  </h4>
                  {targetDestination === 'home' && (
                    <span className="w-5 h-5 rounded-full bg-[#5c141e] text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6e675f] mt-1 leading-snug">
                  {lang === 'es'
                    ? 'Para equipar y construir nuestro nuevo nido juntos.'
                    : 'Helping build and decorate our beginnings together.'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Select Payment Method */}
        <div className="mb-8">
          <span className="block font-cinzel text-xs font-bold text-[#8c6d3b] uppercase tracking-[0.2em] mb-3 text-center">
            {lang === 'es'
              ? '2. Elige el canal de aportación'
              : '2. Select your payment method'}
          </span>

          {/* 3 Selector Tabs */}
          <div className="grid grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-[#eee4d2] border border-[#8c6d4f]/30 mb-6">
            <button
              type="button"
              onClick={() => setPaymentMethod(paymentMethod === 'bank' ? null : 'bank')}
              className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                paymentMethod === 'bank'
                  ? 'bg-white text-[#5c141e] shadow-xs font-bold border border-[#b89243]/40'
                  : 'text-[#6e675f] hover:text-[#37080e]'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#b89243] shrink-0" />
              <span className="truncate">{lang === 'es' ? 'Transferencia' : 'Bank Wire'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod(paymentMethod === 'bizum' ? null : 'bizum')}
              className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                paymentMethod === 'bizum'
                  ? 'bg-white text-[#5c141e] shadow-xs font-bold border border-[#b89243]/40'
                  : 'text-[#6e675f] hover:text-[#37080e]'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#5c141e] shrink-0" />
              <span>Bizum</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod(paymentMethod === 'venmo' ? null : 'venmo')}
              className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                paymentMethod === 'venmo'
                  ? 'bg-white text-[#5c141e] shadow-xs font-bold border border-[#b89243]/40'
                  : 'text-[#6e675f] hover:text-[#37080e]'
              }`}
            >
              <Send className="w-4 h-4 text-[#008cff] shrink-0" />
              <span>Venmo</span>
            </button>
          </div>

          {/* Active Payment Channel Details Box (Revealed only on click) */}
          <AnimatePresence mode="wait">
            {paymentMethod ? (
              <motion.div
                key={paymentMethod}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-[#b89243] shadow-sm relative overflow-hidden mb-2"
              >
            {/* Bank Transfer Details */}
            {paymentMethod === 'bank' && (
              <div>
                <div className="flex items-center justify-between border-b border-[#b89243]/20 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center text-[#5c141e]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-base font-bold text-[#37080e]">
                        {lang === 'es' ? 'Transferencia Bancaria' : 'Bank Transfer'}
                      </h4>
                      <span className="text-[11px] text-[#8c6d3b]">
                        CaixaBank España
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#5c141e]/10 text-[#5c141e]">
                    {destinationLabel}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Titulares */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider text-[10px]">
                      {lang === 'es' ? 'Titulares' : 'Beneficiaries'}
                    </span>
                    <span className="font-playfair font-bold text-sm text-[#37080e]">
                      {weddingInfo.bankInfo.holders}
                    </span>
                  </div>

                  {/* IBAN */}
                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#b89243]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase font-bold text-[#8c6d3b] mb-0.5">
                        IBAN
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#1c1917] tracking-wider select-all">
                        {weddingInfo.bankInfo.iban}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(weddingInfo.bankInfo.iban, 'iban')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                        copiedIban
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#5c141e] hover:bg-[#7a1d2b] text-white shadow-xs'
                      }`}
                    >
                      {copiedIban ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#dfc285]" />
                          <span>{lang === 'es' ? 'Copiar IBAN' : 'Copy IBAN'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* BIC/SWIFT */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#8c6d3b] uppercase font-bold tracking-wider text-[10px]">
                        BIC / SWIFT:
                      </span>
                      <span className="font-mono font-semibold text-[#1c1917]">
                        {weddingInfo.bankInfo.bic}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(weddingInfo.bankInfo.bic, 'bic')}
                      className="text-[11px] text-[#5c141e] hover:underline font-semibold flex items-center gap-1"
                    >
                      {copiedBic ? (
                        <span className="text-emerald-700">✓ Copiado</span>
                      ) : (
                        <span>Copiar BIC</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bizum Details */}
            {paymentMethod === 'bizum' && (
              <div>
                <div className="flex items-center justify-between border-b border-[#b89243]/20 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center text-[#5c141e]">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-base font-bold text-[#37080e]">
                        Bizum
                      </h4>
                      <span className="text-[11px] text-[#8c6d3b]">
                        {lang === 'es' ? 'Envío instantáneo por teléfono' : 'Instant mobile transfer'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#5c141e]/10 text-[#5c141e]">
                    {destinationLabel}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#b89243]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase font-bold text-[#8c6d3b] mb-0.5">
                        {lang === 'es' ? 'Número de Teléfono' : 'Mobile Number'}
                      </span>
                      <span className="font-mono text-lg font-bold text-[#1c1917] tracking-wider select-all">
                        {weddingInfo.bankInfo.bizumPhone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(weddingInfo.bankInfo.bizumPhone, 'bizum')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                        copiedBizum
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#5c141e] hover:bg-[#7a1d2b] text-white shadow-xs'
                      }`}
                    >
                      {copiedBizum ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#dfc285]" />
                          <span>{lang === 'es' ? 'Copiar Teléfono' : 'Copy Number'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#6e675f] leading-relaxed">
                    {lang === 'es'
                      ? 'Abre tu app bancaria habitual, accede al apartado Bizum, introduce el número y añade tu concepto personalizado.'
                      : 'Open your banking app, go to Bizum, enter the number, and include your name in the concept.'}
                  </p>
                </div>
              </div>
            )}

            {/* Venmo Details */}
            {paymentMethod === 'venmo' && (
              <div>
                <div className="flex items-center justify-between border-b border-[#b89243]/20 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#008cff]/10 border border-[#008cff]/40 flex items-center justify-center text-[#008cff]">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-base font-bold text-[#37080e]">
                        Venmo
                      </h4>
                      <span className="text-[11px] text-[#8c6d3b]">
                        {lang === 'es' ? 'Para invitados de Estados Unidos' : 'For US guests'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-[#5c141e]/10 text-[#5c141e]">
                    {destinationLabel}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#b89243]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase font-bold text-[#8c6d3b] mb-0.5">
                        Venmo Handle
                      </span>
                      <span className="font-mono text-lg font-bold text-[#008cff] tracking-wider select-all">
                        {venmoHandle}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(venmoHandle, 'venmo')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                        copiedVenmo
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#008cff] hover:bg-[#0076d6] text-white shadow-xs'
                      }`}
                    >
                      {copiedVenmo ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'es' ? '¡Copiado!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{lang === 'es' ? 'Copiar Usuario' : 'Copy Handle'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#6e675f] leading-relaxed">
                    {lang === 'es'
                      ? 'Puedes enviar tu contribución directamente buscando nuestro usuario en Venmo.'
                      : 'Send your contribution directly by searching for our handle in the Venmo app.'}
                  </p>
                </div>
              </div>
            )}

            {/* Suggested Concept Helper Box */}
            <div className="mt-5 pt-4 border-t border-[rgba(92,20,30,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-[#faf7f2]/80 p-3 rounded-xl">
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-wider text-[#8c6d3b]">
                  {lang === 'es' ? 'Concepto Recomendado' : 'Suggested Reference'}
                </span>
                <span className="font-semibold text-[#37080e]">
                  {suggestedConcept}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(suggestedConcept, 'concept')}
                className="text-[11px] text-[#5c141e] hover:text-[#37080e] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedConcept ? (
                  <span className="text-emerald-700">✓ Concepto copiado</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-[#b89243]" />
                    <span>{lang === 'es' ? 'Copiar concepto' : 'Copy concept'}</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-prompt"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-2xl bg-[#faf4e6]/80 border border-dashed border-[#b89243]/50 text-center text-[#554f47]"
          >
            <Sparkles className="w-5 h-5 text-[#b89243] mx-auto mb-2" />
            <p className="font-playfair text-sm text-[#37080e] font-bold">
              {lang === 'es'
                ? 'Selecciona Transferencia, Bizum o Venmo para ver los detalles.'
                : 'Click on Bank Wire, Bizum, or Venmo above to view details.'}
            </p>
            <p className="text-xs text-[#8c6d3b] mt-1 font-cormorant italic">
              {lang === 'es'
                ? 'Los números de cuenta y canales se desplegarán al pulsar tu opción preferida.'
                : 'Account numbers and payment details will unfold upon selecting your choice.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

        {/* Step 3: Dejar una nota para los novios */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#fdfbf7] border border-[#b89243]/50 shadow-sm relative">
          <div className="flex items-center gap-2.5 mb-3">
            <MessageSquareHeart className="w-5 h-5 text-[#5c141e]" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#37080e]">
              {lang === 'es' ? '3. Deja tu mensaje o dedicatoria' : '3. Leave a personal note'}
            </h3>
          </div>

          <p className="text-xs text-[#6e675f] mb-4 leading-relaxed">
            {lang === 'es'
              ? 'Vuestras palabras son lo que más ilusión nos hace leer. Escribe tu nombre y una nota de cariño para acompañar tu detalle:'
              : 'Your warm words mean the world to us. Please leave your name and a heartfelt note with your gift:'}
          </p>

          <AnimatePresence mode="wait">
            {noteSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-xl bg-[#f4ead8] border border-[#b89243] text-center"
              >
                <CheckCircle2 className="w-8 h-8 text-[#5c141e] mx-auto mb-2" />
                <h4 className="font-playfair text-lg font-bold text-[#37080e]">
                  {lang === 'es' ? '¡Muchísimas gracias!' : 'Thank you so much!'}
                </h4>
                <p className="font-cormorant italic text-base text-[#554f47] mt-1 max-w-md mx-auto">
                  {lang === 'es'
                    ? `Hemos guardado tu cariñoso mensaje para nuestra ${destinationLabel.toLowerCase()}. ¡Estamos deseando celebrarlo juntos!`
                    : `Your heartfelt note for our ${destinationLabel.toLowerCase()} has been saved. We cannot wait to celebrate together!`}
                </p>
                <button
                  type="button"
                  onClick={() => setNoteSubmitted(false)}
                  className="mt-3 text-xs text-[#5c141e] underline hover:text-[#37080e] cursor-pointer"
                >
                  {lang === 'es' ? 'Editar o escribir otro mensaje' : 'Edit or write another note'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmitNote} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8c6d3b] mb-1">
                    {lang === 'es' ? 'Tu Nombre y Apellidos' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder={lang === 'es' ? 'Ej. Carmen y Javier' : 'E.g. Carmen & Javier'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#8c6d4f]/30 bg-white text-sm text-[#2c241e] focus:outline-none focus:border-[#5c141e] focus:ring-1 focus:ring-[#5c141e]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8c6d3b] mb-1">
                    {lang === 'es' ? 'Tu Mensaje / Dedicatoria' : 'Your Note / Message'}
                  </label>
                  <textarea
                    rows={3}
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                    placeholder={
                      lang === 'es'
                        ? 'Escribe aquí unas palabras para Belén & Oriol...'
                        : 'Write a few words for Belén & Oriol...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#8c6d4f]/30 bg-white text-sm text-[#2c241e] focus:outline-none focus:border-[#5c141e] focus:ring-1 focus:ring-[#5c141e] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#8c6d3b] italic">
                    {lang === 'es'
                      ? `Destinado a: ${destinationLabel}`
                      : `Directed to: ${destinationLabel}`}
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#5c141e] hover:bg-[#7a1d2b] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4 text-[#dfc285]" />
                    <span>{lang === 'es' ? 'Guardar Mensaje' : 'Save Note'}</span>
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
