import { useState, useEffect, useRef, type FormEvent } from 'react';
import { CheckCircle2, Heart, Send, Sparkles, BedDouble, Bus, Music, Edit3, Key, Check, Users, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendRsvp, lookupInvitation, RsvpSubmission, RsvpPerson, InvitationLookup } from '../utils/rsvp';
import { GuestRsvp, Language } from '../types';
import { RsvpGuests, emptyPerson } from './RsvpGuests';
import { CASTLE_ROOMS } from '../data/rooms';

interface RsvpSectionProps {
  lang: Language;
}

export function RsvpSection({ lang }: RsvpSectionProps) {
  const es = lang === 'es';
  const [invitationCode, setInvitationCode] = useState('');
  const [invitation, setInvitation] = useState<InvitationLookup | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [guests, setGuests] = useState<RsvpPerson[]>([emptyPerson()]);
  
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const sending = useRef(false);
  const pending = useRef<{ fingerprint: string; record: RsvpSubmission } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<Partial<GuestRsvp>>({
    fullName: '',
    email: '',
    attendance: 'yes',
    attendingDays: 'both',
    plusOneCount: 1,
    dietaryPreference: 'none',
    allergiesNote: '',
    shuttleBooking: true,
    shuttlePickupLocation: 'Salamanca',
    roomBooking: 'none',
    songRequest: '',
    blessingMessage: '',
  });

  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpSubmission | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const updateGuests = (people: RsvpPerson[]) => {
    setGuests(people);
    const anyAttending = people.some((p) => p.attendance === 'yes');
    
    // Compute collective attendingDays from individual guests
    let days: 'both' | 'sept3_only' | 'sept4_only' = 'both';
    const attendingPeople = people.filter((p) => p.attendance === 'yes');
    const hasFriday = attendingPeople.some((p) => p.attendingFriday);
    const hasSaturday = attendingPeople.some((p) => p.attendingSaturday);

    if (hasFriday && hasSaturday) days = 'both';
    else if (hasFriday) days = 'sept3_only';
    else if (hasSaturday) days = 'sept4_only';

    setFormData((prev) => ({
      ...prev,
      fullName: people[0]?.fullName || '',
      email: people[0]?.email || '',
      attendance: anyAttending ? 'yes' : 'no',
      attendingDays: days,
      plusOneCount: attendingPeople.length,
      dietaryPreference: people[0]?.dietaryPreference || 'none',
      allergiesNote: people[0]?.allergiesNote || '',
    }));
  };

  const checkCode = async (e: FormEvent) => {
    e.preventDefault();
    if (checkingCode || !invitationCode.trim()) return;
    setCheckingCode(true);
    setCodeError('');
    try {
      const inv = await lookupInvitation(invitationCode);
      setInvitation(inv);

      if (inv.guests?.length) {
        const prefilledGuests = inv.guests.map((guest) => {
          const attendingFriday = inv.invitedToPreboda !== false;
          const attendingSaturday = inv.invitedToWedding !== false;

          return {
            ...emptyPerson(),
            fullName: guest.fullName || '',
            email: guest.email || '',
            attendance: attendingFriday || attendingSaturday ? 'yes' : 'no',
            attendingFriday,
            attendingSaturday,
            attendingDays:
              attendingFriday && attendingSaturday
                ? 'both'
                : attendingFriday
                ? 'sept3_only'
                : attendingSaturday
                ? 'sept4_only'
                : undefined,
          } as RsvpPerson;
        });

        updateGuests(prefilledGuests.length ? prefilledGuests : [emptyPerson()]);
      }
    } catch {
      setCodeError(
        es
          ? 'No se ha podido validar el código. Por favor compruébalo o contacta con Belén y Oriol.'
          : 'We could not validate this code. Please check it or contact Belén & Oriol.'
      );
    } finally {
      setCheckingCode(false);
    }
  };

  const openRsvpForm = () => {
    setIsSubmitted(false);
    setSubmittedRsvp(null);
    setIsFormOpen(true);
  };

  useEffect(() => {
    // Listen for room pre-selection from the accommodation section
    const handleRoomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ roomId: string }>;
      if (customEvent.detail?.roomId) {
        setIsSubmitted(false);
        setIsFormOpen(true);
        setFormData((prev) => ({ ...prev, roomBooking: customEvent.detail.roomId as GuestRsvp['roomBooking'] }));
      }
    };
    window.addEventListener('select_room_in_rsvp', handleRoomSelect);

    return () => {
      window.removeEventListener('select_room_in_rsvp', handleRoomSelect);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending.current || !invitation || !formData.fullName?.trim() || !formData.email?.trim()) return;
    if (guests.length > invitation.maxGuests) return;
    setSubmitError('');

    const attendingGuests = guests.filter((p) => p.attendance === 'yes');
    const isAnyAttending = attendingGuests.length > 0;

    // Determine collective attendingDays
    const hasFri = attendingGuests.some((p) => p.attendingFriday);
    const hasSat = attendingGuests.some((p) => p.attendingSaturday);
    let collectiveDays: 'both' | 'sept3_only' | 'sept4_only' = 'both';
    if (hasFri && hasSat) collectiveDays = 'both';
    else if (hasFri) collectiveDays = 'sept3_only';
    else if (hasSat) collectiveDays = 'sept4_only';

    const rsvpRecord: GuestRsvp = {
      code: invitationCode.trim().toUpperCase() || 'RSVP-WEB',
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      attendance: isAnyAttending ? 'yes' : 'no',
      attendingDays: isAnyAttending ? collectiveDays : undefined,
      plusOneCount: attendingGuests.length,
      plusOneNames: guests
        .slice(1)
        .map((p) => `${p.fullName.trim()} (${p.attendance === 'yes' ? (es ? 'Asiste' : 'Attending') : (es ? 'No asiste' : 'Declined')})`)
        .join(', '),
      dietaryPreference: guests[0].dietaryPreference,
      allergiesNote: guests[0].allergiesNote,
      shuttleBooking: isAnyAttending ? Boolean(formData.shuttleBooking) : false,
      shuttlePickupLocation: isAnyAttending && formData.shuttleBooking ? formData.shuttlePickupLocation : '',
      roomBooking: isAnyAttending ? formData.roomBooking || 'none' : 'none',
      songRequest: isAnyAttending ? formData.songRequest || '' : '',
      blessingMessage: formData.blessingMessage || '',
      submittedAt: new Date().toISOString(),
    };

    const people = guests.map((p) => ({
      ...p,
      fullName: p.fullName.trim(),
      email: p.email.trim(),
    }));

    const submissionId = crypto.randomUUID();
    const submissionPayload: RsvpSubmission = {
      ...rsvpRecord,
      submissionId,
      guests: people,
    };

    sending.current = true;
    setIsSending(true);
    try {
      await sendRsvp(submissionPayload, invitationCode);
      setSubmittedRsvp(submissionPayload);
      setIsSubmitted(true);
      setIsFormOpen(false);
      pending.current = null;
    } catch {
      setSubmitError(
        es
          ? 'No hemos podido confirmar el registro de forma remota. Tu respuesta se ha conservado en este formulario para reintentar.'
          : 'Could not confirm submission remotely. Your response is safely preserved in this form to retry.'
      );
    } finally {
      sending.current = false;
      setIsSending(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    setIsFormOpen(true);
  };

  return (
    <section id="rsvp" className="rsvp-section-shell py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-[#ede7da]/60">
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center w-full mx-auto mb-10"
        >
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#5c141e] font-bold block mb-2">
            {es ? 'Rogamos Confirmación' : 'Kindly Respond'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            RSVP
          </h2>
          <p className="font-cormorant text-lg sm:text-xl text-[#6e675f] italic mt-3 max-w-xl mx-auto">
            {es
              ? 'Por favor confírmanos tu asistencia antes del 15 de julio de 2027 para organizar cada detalle con el mayor cariño.'
              : 'Please confirm your attendance before July 15, 2027 to help us curate every aspect of your celebration.'}
          </p>
        </motion.div>

        {/* Room Block Notice */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#faf2e3] via-[#fcf8ef] to-[#faf2e3] border-2 border-[#b89243]/60 shadow-md relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#5c141e] border-2 border-[#dfc285] flex items-center justify-center text-[#dfc285] shrink-0 shadow-sm">
              <BedDouble className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase bg-[#5c141e] text-white">
                  {es ? 'AVISO IMPORTANTE · ANTES DEL 31 DE DICIEMBRE' : 'IMPORTANT NOTICE · BEFORE DECEMBER 31'}
                </span>
              </div>
              <h3 className="font-playfair text-base sm:text-lg font-bold text-[#37080e]">
                {es ? 'Bloqueo de Habitaciones en el Castillo del Buen Amor' : 'Castle Room Block Allocation'}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#554f47] leading-relaxed mt-1">
                {es
                  ? 'Para gestionar con el castillo el bloqueo exclusivo de habitaciones, necesitamos un conteo preliminar antes del 31 de diciembre. Si deseas alojarte en el castillo, indícalo al confirmar.'
                  : 'To coordinate the exclusive room block at the castle, we kindly ask for an early headcount before December 31st.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* State 1: Submitted Confirmation Screen */}
        {isSubmitted && submittedRsvp ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#faf7f2] border-2 border-[#b89243] rounded-2xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center mx-auto mb-5 text-[#5c141e]">
              <CheckCircle2 className="w-9 h-9 text-[#5c141e]" />
            </div>

            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#b89243] block mb-1">
              {es ? '¡Respuesta Registrada con Éxito!' : 'RSVP Successfully Received!'}
            </span>

            <h3 className="font-cinzel text-2xl sm:text-3xl text-[#37080e] font-bold mb-4">
              {submittedRsvp.fullName}
            </h3>

            <p className="font-cormorant text-lg text-[#44403c] italic max-w-md mx-auto mb-8">
              {submittedRsvp.attendance === 'yes'
                ? es
                  ? '¡Qué inmensa alegría contar con vosotros en El Castillo del Buen Amor! Nos vemos en Salamanca.'
                  : 'We are thrilled to celebrate this momentous chapter with you in Salamanca!'
                : es
                ? 'Lamentamos mucho que no puedas acompañarnos, te tendremos muy presente en nuestro corazón.'
                : 'We will miss your presence deeply, but you will remain in our hearts!'}
            </p>

            {/* Detailed Guest Breakdown Summary */}
            <div className="bg-white p-6 rounded-xl border border-[#5c141e]/15 text-left text-xs space-y-4 mb-8 max-w-lg mx-auto shadow-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                  {es ? 'Estado General:' : 'Overall Status:'}
                </span>
                <span className="font-bold text-[#5c141e] text-sm">
                  {submittedRsvp.attendance === 'yes'
                    ? es
                      ? `✓ Asisten ${submittedRsvp.plusOneCount} persona(s)`
                      : `✓ Attending (${submittedRsvp.plusOneCount} guests)`
                    : es
                    ? '✕ No asiste'
                    : '✕ Not attending'}
                </span>
              </div>

              {/* Per-guest summary */}
              {submittedRsvp.guests && submittedRsvp.guests.length > 0 && (
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c141e] block">
                    {es ? 'Detalle por Invitado:' : 'Guests Breakdown:'}
                  </span>
                  {submittedRsvp.guests.map((g, idx) => (
                    <div key={idx} className="p-3 bg-[#faf7f2] rounded-lg border border-[#5c141e]/10 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-[#37080e]">
                        <span>{idx + 1}. {g.fullName}</span>
                        <span className={g.attendance === 'yes' ? 'text-[#5c141e]' : 'text-gray-500'}>
                          {g.attendance === 'yes' ? (es ? 'Asiste' : 'Attending') : (es ? 'No asiste' : 'Declined')}
                        </span>
                      </div>
                      {g.attendance === 'yes' && (
                        <>
                          <div className="text-[#6e675f]">
                            <span className="font-semibold text-[#8c6d3b]">{es ? 'Jornadas: ' : 'Days: '}</span>
                            {g.attendingFriday && g.attendingSaturday
                              ? es ? 'Viernes 3 (Preboda) y Sábado 4 (La Boda)' : 'Friday 3 & Saturday 4'
                              : g.attendingFriday
                              ? es ? 'Solo Viernes 3 (Preboda)' : 'Friday 3 only'
                              : es ? 'Solo Sábado 4 (La Boda)' : 'Saturday 4 only'}
                          </div>
                          {g.dietaryPreference && g.dietaryPreference !== 'none' && (
                            <div className="text-[#6e675f]">
                              <span className="font-semibold text-[#8c6d3b]">{es ? 'Menú: ' : 'Menu: '}</span>
                              <span className="capitalize">{g.dietaryPreference}</span>
                              {g.allergiesNote && ` (${g.allergiesNote})`}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {submittedRsvp.attendance === 'yes' && (
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                      {es ? 'Autobús (Salamanca - Castillo):' : 'Shuttle Bus:'}
                    </span>
                    <span className="font-semibold text-[#37080e]">
                      {submittedRsvp.shuttleBooking ? (es ? 'Sí, reservado' : 'Yes, reserved') : (es ? 'No necesario' : 'Not needed')}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                      {es ? 'Alojamiento Castillo:' : 'Castle Room:'}
                    </span>
                    <span className="font-semibold text-[#37080e] text-right">
                      {(() => {
                        const room = CASTLE_ROOMS.find((r) => r.id === submittedRsvp.roomBooking);
                        if (!room) return es ? 'Alojamiento en Salamanca' : 'Staying in Salamanca';
                        return `${es ? room.name : room.nameEn} (${room.price} €)`;
                      })()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase border border-[#5c141e] text-[#5c141e] hover:bg-[#5c141e] hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{es ? 'Modificar Respuesta' : 'Edit My RSVP'}</span>
            </button>
          </motion.div>
        ) : !isFormOpen ? (
          /* State 2: Closed Banner / Action Button */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf7f2] border-2 border-[#b89243]/30 rounded-2xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7a1d2b] to-[#3a0810] border-2 border-[#dfc285] flex items-center justify-center text-[#dfc285] shadow-md">
              <Send className="w-7 h-7" />
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#37080e] mb-2 uppercase tracking-wide">
              {es ? 'Confirmar Asistencia' : 'Confirm Attendance'}
            </h3>

            <p className="font-cormorant italic text-base sm:text-lg text-[#6e675f] max-w-lg mx-auto mb-8">
              {es
                ? 'Introduce tu código de invitación para indicar la asistencia y preferencias de cada miembro de tu grupo.'
                : 'Enter your invitation code to confirm attendance and preferences for each member of your party.'}
            </p>

            <button
              type="button"
              onClick={openRsvpForm}
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-[#5c141e] hover:bg-[#7a1d2b] text-white font-cinzel text-xs sm:text-sm font-bold tracking-[0.22em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#dfc285]" />
              <span>{es ? 'Abrir Formulario de RSVP' : 'Open RSVP Form'}</span>
            </button>

            <div className="mt-6 pt-4 border-t border-[#8c6d4f]/20 text-xs text-[#8c6d4f] font-mono">
              <span>{es ? 'Fecha límite: 15 de julio de 2027 (15.07.2027)' : 'Deadline: July 15, 2027 (07.15.2027)'}</span>
            </div>
          </motion.div>
        ) : (
          /* State 3: Open Form */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf7f2] border-2 border-[#b89243]/40 rounded-2xl p-6 sm:p-10 shadow-xl relative"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#5c141e]/15">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#37080e] uppercase tracking-wide">
                  {es ? 'Formulario de Confirmación' : 'RSVP Form'}
                </h3>
                <span className="text-xs text-[#8c6d4f] font-sans">
                  {invitation
                    ? es
                      ? `Invitación validada · Hasta ${invitation.maxGuests} personas`
                      : `Invitation verified · Up to ${invitation.maxGuests} guests`
                    : es
                    ? 'Paso 1: Valida el código de tu invitación'
                    : 'Step 1: Verify your invitation code'}
                </span>
              </div>
              <button
                type="button"
                disabled={isSending}
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-[#8c6d4f] hover:text-[#5c141e] hover:bg-[#5c141e]/5 rounded-full transition-colors cursor-pointer"
                title={es ? 'Cerrar' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: Code Verification */}
            {!invitation ? (
              <form onSubmit={checkCode} className="space-y-6 max-w-md mx-auto py-4 text-center" aria-busy={checkingCode}>
                <div className="w-12 h-12 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center mx-auto text-[#5c141e]">
                  <Key className="w-5 h-5" />
                </div>

                <div>
                  <label className="block font-cinzel text-sm sm:text-base font-bold text-[#37080e] uppercase mb-2">
                    {es ? 'Introduce el código de tu invitación' : 'Enter your invitation code'}
                  </label>
                  <p className="text-xs text-[#6e675f] mb-4">
                    {es
                      ? 'Lo encontrarás en la tarjeta o mensaje que recibiste de Belén y Oriol (ej. BO2027, o tu código personal).'
                      : 'You can find it on your card or message from Belén & Oriol (e.g. BO2027 or your personalized code).'}
                  </p>
                  <input
                    required
                    autoComplete="off"
                    maxLength={80}
                    placeholder="Ej. BO2027"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                    className="w-full text-center px-4 py-3.5 border-2 border-[#b89243]/50 rounded-xl bg-white text-base font-mono font-bold tracking-widest text-[#37080e] placeholder:text-[#b89243]/40 focus:outline-none focus:border-[#5c141e] focus:ring-1 focus:ring-[#5c141e] uppercase"
                  />
                </div>

                {codeError && (
                  <p role="alert" className="text-xs text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    {codeError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={checkingCode}
                  className="w-full py-3.5 px-6 bg-[#5c141e] hover:bg-[#7a1d2b] text-white font-cinzel text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#dfc285]" />
                  <span>{checkingCode ? (es ? 'Comprobando…' : 'Verifying…') : (es ? 'Continuar al formulario' : 'Verify & Continue')}</span>
                </button>
              </form>
            ) : (
              /* STEP 2: Main Questionnaire */
              <>
                <div className="flex items-center justify-between bg-[#f5efe3] p-3 sm:p-4 rounded-xl border border-[#b89243]/30 mb-6 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#5c141e]">Código: {invitationCode}</span>
                    <span className="text-[#8c6d4f]">· {invitation.maxGuests} {invitation.maxGuests === 1 ? 'plaza' : 'plazas'}</span>
                  </div>
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={() => {
                      setInvitation(null);
                      setInvitationCode('');
                      updateGuests([emptyPerson()]);
                    }}
                    className="text-[#5c141e] underline hover:text-[#7a1d2b] cursor-pointer"
                  >
                    {es ? 'Cambiar código' : 'Change code'}
                  </button>
                </div>

                <form ref={formRef} id="rsvp-questionnaire" onSubmit={handleSubmit} className="space-y-8" aria-busy={isSending}>
                  <fieldset disabled={isSending} className="space-y-8">
                    {/* Per-Guest Cards Component with Day selection and Menus */}
                    <RsvpGuests
                      lang={lang}
                      guests={guests}
                      maxGuests={invitation.maxGuests}
                      invitedToPreboda={invitation.invitedToPreboda !== false}
                      onChange={updateGuests}
                    />

                    {/* Shared Logistics (Only shown if at least one guest is attending) */}
                    {formData.attendance === 'yes' && (
                      <div className="space-y-6 pt-6 border-t-2 border-[#5c141e]/15 animate-fade-in">
                        <div className="text-left">
                          <h4 className="font-cinzel text-base font-bold text-[#37080e] uppercase tracking-wider mb-1">
                            {es ? 'Transporte & Alojamiento' : 'Shuttle & Accommodation'}
                          </h4>
                          <p className="text-xs text-[#6e675f]">
                            {es ? 'Opciones de traslado y estancia para el grupo' : 'Travel and lodging preferences for your party'}
                          </p>
                        </div>

                        {/* Shuttle Bus Option */}
                        <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#b89243]/30 shadow-xs">
                          <label className="flex items-start gap-3.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(formData.shuttleBooking)}
                              onChange={(e) => setFormData({ ...formData, shuttleBooking: e.target.checked })}
                              className="mt-1 w-4 h-4 rounded text-[#5c141e] focus:ring-[#5c141e] border-gray-300"
                            />
                            <div className="text-xs">
                              <span className="font-bold text-[#37080e] flex items-center gap-1.5 uppercase tracking-wider text-xs sm:text-sm">
                                <Bus className="w-4 h-4 text-[#b89243]" />
                                {es
                                  ? 'Autobús para invitados (Ida y/o Regreso Salamanca ⇆ Castillo)'
                                  : 'Guest Shuttle Bus (Round trip / Return Salamanca ⇆ Castle)'}
                              </span>
                              <span className="text-[#6e675f] block mt-1 leading-relaxed">
                                {es
                                  ? 'Servicio gratuito de autobús de ida desde Salamanca al castillo para la ceremonia, y regreso en varios turnos durante la noche para quienes se alojen en Salamanca o alrededores.'
                                  : 'Complimentary shuttle service from Salamanca to the castle for the wedding, and return bus shuttles throughout the night back to Salamanca.'}
                              </span>
                            </div>
                          </label>
                        </div>

                        {/* Room Booking Option at Castillo del Buen Amor */}
                        <div className="p-5 bg-white rounded-xl border-2 border-[#b89243]/40 shadow-xs">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <label className="block text-xs font-bold tracking-wider uppercase text-[#5c141e] flex items-center gap-1.5">
                              <BedDouble className="w-4 h-4 text-[#b89243]" />
                              <span>{es ? 'Alojamiento en El Castillo del Buen Amor' : 'Castle Room Reservation'}</span>
                            </label>
                            <span className="text-[10px] font-bold text-[#b89243] uppercase tracking-wider bg-[#b89243]/10 px-2 py-0.5 rounded">
                              {es ? 'Precios hasta 31 Dic' : 'Rates until Dec 31'}
                            </span>
                          </div>

                          <p className="text-xs text-[#6e675f] mb-4 leading-relaxed">
                            {es
                              ? 'Cada huésped abona su habitación al hotel. Precios por habitación y noche con desayuno incluido. Si prefieres alojarte en Salamanca, selecciona la primera opción:'
                              : 'Each guest settles their room directly with the hotel. Rates per night with breakfast included:'}
                          </p>

                          <div className="space-y-2.5">
                            {/* Option None */}
                            <label
                              className={`p-3 rounded-xl border-2 flex items-center justify-between text-xs cursor-pointer transition-all ${
                                formData.roomBooking === 'none' || !formData.roomBooking
                                  ? 'border-[#5c141e] bg-[#5c141e]/5 font-bold text-[#37080e]'
                                  : 'border-gray-200 bg-[#faf7f2] text-[#554f47] hover:bg-white hover:border-[#b89243]/50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="radio"
                                  name="roomBooking"
                                  value="none"
                                  checked={formData.roomBooking === 'none' || !formData.roomBooking}
                                  onChange={() => setFormData({ ...formData, roomBooking: 'none' })}
                                  className="text-[#5c141e] focus:ring-[#5c141e]"
                                />
                                <div>
                                  <span className="font-semibold text-[#37080e] block">
                                    {es
                                      ? 'No deseo habitación en el castillo (me alojo en Salamanca o regreso en autobús)'
                                      : 'No castle room needed (staying in Salamanca / using return shuttle)'}
                                  </span>
                                  <span className="text-[11px] text-[#6e675f] font-normal block mt-0.5">
                                    {es
                                      ? 'Alojamiento por mi cuenta en la ciudad y regreso en el autobús de la boda'
                                      : 'Staying in the city and taking the wedding return shuttle'}
                                  </span>
                                </div>
                              </div>
                            </label>

                            {/* Castle Room Options */}
                            {CASTLE_ROOMS.map((room) => {
                              const remaining = room.total;
                              const isSelected = formData.roomBooking === room.id;

                              return (
                                <label
                                  key={room.id}
                                  className={`p-3 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                                    remaining === 0
                                      ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed text-gray-400'
                                      : isSelected
                                      ? 'border-[#5c141e] bg-[#5c141e]/5 font-semibold text-[#37080e] cursor-pointer shadow-xs'
                                      : 'border-gray-200 bg-white hover:border-[#b89243]/60 cursor-pointer text-[#44403c]'
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <input
                                      type="radio"
                                      name="roomBooking"
                                      value={room.id}
                                      disabled={remaining === 0}
                                      checked={isSelected}
                                      onChange={() => setFormData({ ...formData, roomBooking: room.id as GuestRsvp['roomBooking'] })}
                                      className="mt-0.5 text-[#5c141e] focus:ring-[#5c141e]"
                                    />
                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-[#37080e]">{es ? room.name : room.nameEn}</span>
                                        <span className="text-[#8c6d4f] font-semibold text-[11px]">
                                          {room.price} € / {es ? 'noche' : 'night'}
                                        </span>
                                      </div>
                                      {(es ? room.description : room.descriptionEn) && (
                                        <span className="text-[10.5px] text-[#6e675f] block mt-0.5 font-normal">
                                          {es ? room.description : room.descriptionEn}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 self-start sm:self-center">
                                    {es ? `${room.total} hab. cupo` : `${room.total} available`}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Song Request */}
                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#5c141e]/15">
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                            <Music className="w-4 h-4 text-[#b89243]" />
                            <span>{es ? '¿Qué canción no puede faltar en la fiesta?' : 'DJ Song Request'}</span>
                          </label>
                          <input
                            type="text"
                            value={formData.songRequest || ''}
                            onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                            placeholder="Artista - Título de la canción"
                            className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#5c141e]/20 rounded-lg text-sm text-[#2c241e] placeholder:text-[#9c9489] focus:bg-white focus:outline-none focus:border-[#5c141e] transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* Blessing Message */}
                    <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#5c141e]/15">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-[#b89243]" />
                        <span>{es ? 'Unas palabras o dedicatoria para Belén & Oriol' : 'A note for Belén & Oriol'}</span>
                      </label>
                      <textarea
                        rows={3}
                        value={formData.blessingMessage || ''}
                        onChange={(e) => setFormData({ ...formData, blessingMessage: e.target.value })}
                        placeholder={
                          es
                            ? '¡Estamos deseando veros y celebrar con vosotros en el Castillo!'
                            : 'Looking forward to celebrating with you at the castle!'
                        }
                        className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#5c141e]/20 rounded-lg text-sm text-[#2c241e] placeholder:text-[#9c9489] focus:bg-white focus:outline-none focus:border-[#5c141e] transition-all"
                      />
                    </div>

                    {submitError && (
                      <p role="alert" className="text-xs text-red-800 bg-red-50 p-3 rounded-lg border border-red-200">
                        {submitError}
                      </p>
                    )}

                    {/* Submit button */}
                    <button
                      disabled={isSending}
                      type="submit"
                      className="w-full py-4 bg-[#5c141e] hover:bg-[#7a1d2b] text-white text-xs sm:text-sm font-cinzel font-bold tracking-[0.25em] uppercase rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 text-[#dfc285]" />
                      <span>{isSending ? (es ? 'Enviando confirmación…' : 'Submitting RSVP…') : (es ? 'Confirmar y Enviar Respuesta' : 'Confirm & Submit RSVP')}</span>
                    </button>
                  </fieldset>
                </form>
              </>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
