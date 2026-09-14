import { RoseAndWheat } from './RoseAndWheat';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { CheckCircle2, Heart, Send, Sparkles, BedDouble, Bus, Music, Edit3, Key, Check, Users, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendRsvp, lookupInvitation, RsvpSubmission, RsvpPerson, InvitationLookup } from '../utils/rsvp';
import { GuestRsvp, Language } from '../types';
import { RsvpGuests, emptyPerson } from './RsvpGuests';
import { CASTLE_ROOMS } from '../data/rooms';

interface RsvpSectionProps {
  lang: Language;
}

type RoomId = NonNullable<GuestRsvp['roomBooking']>;
type RoomQuantities = Partial<Record<Exclude<RoomId, 'none'>, number>>;

const ROOM_IDS = CASTLE_ROOMS.map((room) => room.id) as Exclude<RoomId, 'none'>[];

function getRoomCount(roomQuantities: RoomQuantities) {
  return Object.values(roomQuantities).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
}

function firstSelectedRoom(roomQuantities: RoomQuantities): GuestRsvp['roomBooking'] {
  return ROOM_IDS.find((id) => (roomQuantities[id] || 0) > 0) || 'none';
}

function roomSummary(roomQuantities: RoomQuantities, lang: Language) {
  const es = lang === 'es';
  const selected = CASTLE_ROOMS
    .map((room) => ({ room, qty: roomQuantities[room.id] || 0 }))
    .filter(({ qty }) => qty > 0);

  if (!selected.length) return es ? 'Sin habitación en el castillo' : 'No castle room requested';

  return selected
    .map(({ room, qty }) => `${qty} × ${es ? room.name : room.nameEn}`)
    .join(', ');
}

export function RsvpSection({ lang }: RsvpSectionProps) {
  const es = lang === 'es';
  const [invitationCode, setInvitationCode] = useState('');
  const [invitation, setInvitation] = useState<InvitationLookup | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [guests, setGuests] = useState<RsvpPerson[]>([emptyPerson()]);
  const [roomQuantities, setRoomQuantities] = useState<RoomQuantities>({});
  const [returnShuttleBooking, setReturnShuttleBooking] = useState(false);
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
    roomBookings: {},
    returnShuttleBooking: false,
    songRequest: '',
    blessingMessage: '',
  });

  const [submittedRsvp, setSubmittedRsvp] = useState<RsvpSubmission | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Derive shared options from the current guests, never a copied form flag.
  const hasAttendingGuests = guests.some((person) => person.attendance === 'yes');

  const selectedRoomCount = getRoomCount(roomQuantities);
  const hasCastleRoom = selectedRoomCount > 0;

  const scrollToRsvp = () => {
    window.setTimeout(() => {
      document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const getRemoteRemaining = (roomId: Exclude<RoomId, 'none'>) => {
    const live = invitation?.roomAvailability?.find((room) => room.id === roomId);
    const fallback = CASTLE_ROOMS.find((room) => room.id === roomId)?.total || 0;
    return Math.max(0, Number(live?.remaining ?? fallback));
  };

  const getDisplayRemaining = (roomId: Exclude<RoomId, 'none'>) => {
    return Math.max(0, getRemoteRemaining(roomId) - (roomQuantities[roomId] || 0));
  };

  const updateRoomQuantity = (roomId: Exclude<RoomId, 'none'>, quantity: number) => {
    const max = getRemoteRemaining(roomId);
    const safeQuantity = Math.max(0, Math.min(max, Number(quantity) || 0));
    const next: RoomQuantities = { ...roomQuantities };

    if (safeQuantity > 0) next[roomId] = safeQuantity;
    else delete next[roomId];

    setRoomQuantities(next);
    setReturnShuttleBooking(false);
    setFormData((prev) => ({
      ...prev,
      roomBooking: firstSelectedRoom(next),
      roomBookings: next,
      returnShuttleBooking: false,
    }));
  };

  const updateReturnShuttle = (checked: boolean) => {
    setReturnShuttleBooking(checked);
    if (checked) {
      setRoomQuantities({});
      setFormData((prev) => ({
        ...prev,
        roomBooking: 'none',
        roomBookings: {},
        returnShuttleBooking: true,
      }));
    } else {
      setFormData((prev) => ({ ...prev, returnShuttleBooking: false }));
    }
  };

  const updateGuests = (people: RsvpPerson[]) => {
    setGuests(people);
    const anyAttending = people.some((p) => p.attendance === 'yes');
    const attendingPeople = people.filter((p) => p.attendance === 'yes');
    const hasFriday = attendingPeople.some((p) => p.attendingFriday);
    const hasSaturday = attendingPeople.some((p) => p.attendingSaturday);

    let days: GuestRsvp['attendingDays'] = undefined;
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
      setRoomQuantities({});
      setReturnShuttleBooking(false);
      setFormData((prev) => ({ ...prev, roomBooking: 'none', roomBookings: {}, returnShuttleBooking: false }));
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
    scrollToRsvp();
  };

  useEffect(() => {
    const handleRoomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ roomId: string }>;
      const roomId = customEvent.detail?.roomId as Exclude<RoomId, 'none'> | undefined;
      if (roomId && ROOM_IDS.includes(roomId)) {
        setIsSubmitted(false);
        setIsFormOpen(true);
        updateRoomQuantity(roomId, 1);
        scrollToRsvp();
      }
    };
    window.addEventListener('select_room_in_rsvp', handleRoomSelect);

    return () => {
      window.removeEventListener('select_room_in_rsvp', handleRoomSelect);
    };
  }, [invitation, roomQuantities]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending.current || !invitation || !formData.fullName?.trim() || !formData.email?.trim()) return;
    if (guests.length > invitation.maxGuests) return;
    setSubmitError('');

    const attendingGuests = guests.filter((p) => p.attendance === 'yes');
    const isAnyAttending = attendingGuests.length > 0;

    const hasFri = attendingGuests.some((p) => p.attendingFriday);
    const hasSat = attendingGuests.some((p) => p.attendingSaturday);
    let collectiveDays: GuestRsvp['attendingDays'] = undefined;
    if (hasFri && hasSat) collectiveDays = 'both';
    else if (hasFri) collectiveDays = 'sept3_only';
    else if (hasSat) collectiveDays = 'sept4_only';

    const cleanedRoomQuantities: RoomQuantities = Object.fromEntries(
      Object.entries(roomQuantities).filter(([, qty]) => (Number(qty) || 0) > 0)
    ) as RoomQuantities;

    const people = guests.map((p) => ({
      ...p,
      fullName: p.fullName.trim(),
      email: p.email.trim(),
    }));

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
      roomBooking: isAnyAttending ? firstSelectedRoom(cleanedRoomQuantities) : 'none',
      roomBookings: isAnyAttending ? cleanedRoomQuantities : {},
      returnShuttleBooking: isAnyAttending && !hasCastleRoom ? returnShuttleBooking : false,
      songRequest: isAnyAttending ? formData.songRequest || '' : '',
      blessingMessage: formData.blessingMessage || '',
      submittedAt: new Date().toISOString(),
    };

    const submissionId = crypto.randomUUID();
    const submissionPayload: RsvpSubmission = {
      ...rsvpRecord,
      submissionId,
      guests: people,
      language: lang,
      formVersion: 'rsvp-per-guest-v3-rooms',
      clientSubmittedAt: new Date().toISOString(),
    };

    const fingerprint = JSON.stringify({ ...submissionPayload, submissionId: undefined, submittedAt: undefined, clientSubmittedAt: undefined });
    if (!pending.current || pending.current.fingerprint !== fingerprint) {
      pending.current = { fingerprint, record: submissionPayload };
    }

    sending.current = true;
    setIsSending(true);
    try {
      const record = pending.current.record;
      await sendRsvp(record, invitationCode);
      setSubmittedRsvp(record);
      setIsSubmitted(true);
      setIsFormOpen(false);
      pending.current = null;
      scrollToRsvp();
    } catch {
      setSubmitError(
        es
          ? 'No hemos podido confirmar el registro de forma remota. Tu respuesta se ha conservado en este formulario para reintentar.'
          : 'Could not confirm submission remotely. Your response is safely preserved in this form to retry.'
      );
      scrollToRsvp();
    } finally {
      sending.current = false;
      setIsSending(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    setIsFormOpen(true);
    scrollToRsvp();
  };

  return (
    <section id="rsvp" className="rsvp-section-shell rsvp-stationery py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rsvp-hero-panel text-center w-full mx-auto mb-10"
        >
          <RoseAndWheat />
          <span className="text-[11px] tracking-[0.32em] uppercase font-bold block mb-2 rsvp-dark-eyebrow">
            {es ? 'Rogamos Confirmación' : 'Kindly Respond'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-[0.03em] uppercase leading-tight rsvp-dark-title">
            RSVP
          </h2>
          <p className="font-cormorant text-lg sm:text-xl italic mt-3 max-w-xl mx-auto rsvp-dark-subtitle">
            {es
              ? 'Por favor confírmanos tu asistencia antes del 15 de julio de 2027.'
              : 'Please confirm your attendance before July 15, 2027.'}
          </p>
          <p className="rsvp-invitation-note">{es ? 'El número de personas invitadas figura en tu invitación dentro del RSVP. Los acompañantes deben estar incluidos en esa invitación.' : 'Your invitation in the RSVP shows the number of invited guests. Plus-ones must be included in that invitation.'}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#fff8ec]/95 border-2 border-[#b89243]/70 shadow-md relative overflow-hidden rsvp-readable-card"
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
              <h3 className="room-count-heading font-sans text-base sm:text-lg font-semibold text-[#37080e]">
                {es ? 'Conteo inicial para el bloqueo de habitaciones del castillo' : 'Initial headcount for the castle room block'}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#554f47] leading-relaxed mt-1">
                {es
                  ? 'Para poder gestionar con el Castillo del Buen Amor el bloqueo de habitaciones exclusivas para los invitados, necesitamos un conteo inicial antes del 31 de diciembre. Si tienes intención de acompañarnos y/o alojarte en el castillo, por favor envíanos tu confirmación preliminar lo antes posible.'
                  : 'To arrange a block of rooms exclusively for our guests with Castillo del Buen Amor, we need an initial headcount before December 31. If you plan to join us and/or stay at the castle, please send us your preliminary confirmation as soon as possible.'}
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSubmitted && submittedRsvp ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#faf7f2] border-2 border-[#b89243] rounded-xl p-8 sm:p-12 shadow-lg text-center relative overflow-hidden rsvp-readable-card"
            >
              <div className="w-16 h-16 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center mx-auto mb-5 text-[#5c141e]">
                <CheckCircle2 className="w-8 h-8 text-[#5c141e]" />
              </div>
              <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#b89243] block mb-1">
                {es ? 'Respuesta registrada' : 'RSVP received'}
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#37080e] font-bold mb-4">
                {submittedRsvp.fullName}
              </h3>

              <div className="bg-white p-5 rounded-lg border border-[rgba(92,20,30,0.1)] text-left text-xs space-y-3 mb-8 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">{es ? 'Habitaciones:' : 'Rooms:'}</span>
                  <span className="font-semibold text-right text-[#5c141e]">{roomSummary(submittedRsvp.roomBookings || {}, lang)}</span>
                </div>
                {!submittedRsvp.roomBookings || getRoomCount(submittedRsvp.roomBookings as RoomQuantities) === 0 ? (
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">{es ? 'Vuelta:' : 'Return:'}</span>
                    <span>{submittedRsvp.returnShuttleBooking ? (es ? 'Autobús Castillo - Salamanca' : 'Castillo del Buen Amor - Salamanca return shuttle') : '—'}</span>
                  </div>
                ) : null}
                <div>
                  <span className="text-[#8c6d3b] uppercase font-bold tracking-wider block mb-2">{es ? 'Invitados:' : 'Guests:'}</span>
                  <ul className="space-y-1">
                    {submittedRsvp.guests.map((guest, index) => (
                      <li key={`${guest.fullName}-${index}`} className="flex justify-between gap-4">
                        <span>{guest.fullName || `${es ? 'Invitado' : 'Guest'} ${index + 1}`}</span>
                        <span className="text-right text-[#5c141e]">
                          {guest.attendance === 'yes'
                            ? [
                                guest.attendingFriday ? (es ? 'Viernes' : 'Friday') : '',
                                guest.attendingSaturday ? (es ? 'Sábado' : 'Saturday') : '',
                              ]
                                .filter(Boolean)
                                .join(' + ')
                            : es
                            ? 'No asiste'
                            : 'Not attending'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold tracking-wider uppercase border border-[#dfc285] bg-[#5c141e] text-white hover:bg-[#7a1d2b] hover:border-[#f2d99a] transition-colors cursor-pointer shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#dfc285]" />
                <span>{es ? 'Modificar respuesta' : 'Edit RSVP'}</span>
              </button>
            </motion.div>
          ) : !isFormOpen ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#faf7f2] border border-[rgba(92,20,30,0.2)] rounded-2xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden rsvp-readable-card"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7a1d2b] to-[#3a0810] border-2 border-[#dfc285] flex items-center justify-center text-[#dfc285] shadow-md">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#37080e] mb-2 uppercase tracking-wide">
                {es ? 'Confirmación de asistencia' : 'Wedding attendance confirmation'}
              </h3>
              <p className="font-cormorant italic text-base sm:text-lg text-[#6e675f] max-w-lg mx-auto mb-8">
                {es
                  ? 'Confirma quién asistirá a cada evento y completa menús, transporte y alojamiento.'
                  : 'Confirm who will attend each event and complete meal, shuttle and accommodation details.'}
              </p>
              <button
                type="button"
                aria-controls="rsvp-questionnaire"
                aria-expanded={isFormOpen}
                onClick={openRsvpForm}
                className="rsvp-confirm-button inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5c141e] hover:bg-[#7a1d2b] text-white font-cinzel text-xs sm:text-sm font-bold tracking-[0.22em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#dfc285]" />
                <span>{es ? 'Confirmar asistencia' : 'Confirm attendance'}</span>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#faf7f2] border border-[rgba(92,20,30,0.18)] rounded-xl p-6 sm:p-10 shadow-md relative rsvp-readable-card"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(92,20,30,0.12)]">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#37080e] uppercase">
                    {es ? 'Formulario de asistencia' : 'RSVP form'}
                  </h3>
                  <span className="text-xs text-[#8c6d4f] font-mono">
                    {es ? 'Código privado · Asistencia por invitado' : 'Private code · Attendance by guest'}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-[#8c6d4f] hover:text-[#5c141e] underline cursor-pointer font-sans"
                >
                  {es ? 'Ocultar formulario' : 'Collapse form'}
                </button>
              </div>

              {!invitation ? (
                <form onSubmit={checkCode} className="space-y-4" aria-busy={checkingCode}>
                  <label className="block text-sm text-[#5c141e] font-semibold">
                    {es ? 'Código privado de tu invitación' : 'Your private invitation code'}
                    <input
                      required
                      autoComplete="off"
                      maxLength={80}
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      className="block w-full mt-2 px-4 py-3 border border-[#5c141e]/25 rounded bg-white"
                    />
                  </label>
                  {codeError && <p role="alert" className="text-sm text-red-800">{codeError}</p>}
                  <button disabled={checkingCode} className="px-5 py-3 bg-[#5c141e] text-white rounded disabled:opacity-50 inline-flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    {checkingCode ? (es ? 'Comprobando…' : 'Checking…') : es ? 'Abrir mi invitación' : 'Open my invitation'}
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-[#f5efe3] p-3 sm:p-4 rounded-xl border border-[#b89243]/30 mb-6 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
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
                        setRoomQuantities({});
                        setReturnShuttleBooking(false);
                      }}
                      className="text-[#5c141e] underline hover:text-[#7a1d2b] cursor-pointer"
                    >
                      {es ? 'Cambiar código' : 'Change code'}
                    </button>
                  </div>

                  <form ref={formRef} id="rsvp-questionnaire" onSubmit={handleSubmit} className="space-y-8" aria-busy={isSending}>
                    <fieldset disabled={isSending} className="space-y-8">
                      <RsvpGuests
                        lang={lang}
                        guests={guests}
                        maxGuests={invitation.maxGuests}
                        invitedToPreboda={invitation.invitedToPreboda !== false}
                        invitationText={invitation.invitationText}
                        onChange={updateGuests}
                      />

                      {hasAttendingGuests && (
                        <div className="space-y-6 pt-6 border-t-2 border-[#5c141e]/15 animate-fade-in">
                          <div className="text-left">
                            <h4 className="font-cinzel text-base font-bold text-[#37080e] uppercase tracking-wider mb-1">
                              {es ? 'Transporte & Alojamiento' : 'Shuttle & Accommodation'}
                            </h4>
                            <p className="text-xs text-[#6e675f]">
                              {es ? 'Opciones de traslado y estancia para el grupo' : 'Travel and lodging preferences for your party'}
                            </p>
                          </div>

                          <div className="p-4 sm:p-5 bg-white rounded-xl border border-[#b89243]/30 shadow-xs">
                            <label className="flex items-start gap-3.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(formData.shuttleBooking)}
                                onChange={(e) => setFormData((prev) => ({ ...prev, shuttleBooking: e.target.checked }))}
                                className="mt-1 w-4 h-4 rounded text-[#5c141e] focus:ring-[#5c141e] border-gray-300"
                              />
                              <div className="text-xs">
                                <span className="font-bold text-[#37080e] flex items-center gap-1.5 uppercase tracking-wider text-xs sm:text-sm">
                                  <Bus className="w-4 h-4 text-[#b89243]" />
                                  {es ? 'Autobús para invitados · Ida Salamanca - Castillo' : 'Guest shuttle · Outbound Salamanca - Castillo del Buen Amor'}
                                </span>
                                <span className="text-[#6e675f] block mt-1 leading-relaxed">
                                  {es
                                    ? 'Servicio de ida desde Salamanca al Castillo del Buen Amor el sábado 4 de septiembre.'
                                    : 'Outbound service from Salamanca to Castillo del Buen Amor on Saturday, September 4.'}
                                </span>
                              </div>
                            </label>
                          </div>

                          <div className="p-5 bg-white rounded-xl border-2 border-[#b89243]/40 shadow-xs">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <label className="block text-xs font-bold tracking-wider uppercase text-[#5c141e] flex items-center gap-1.5">
                                <BedDouble className="w-4 h-4 text-[#b89243]" />
                                <span>{es ? 'Solicitud de habitación en El Castillo del Buen Amor' : 'Castle Room Request'}</span>
                              </label>
                              <span className="text-[10px] font-bold text-[#b89243] uppercase tracking-wider bg-[#b89243]/10 px-2 py-0.5 rounded">
                                {es ? `${selectedRoomCount} seleccionada${selectedRoomCount === 1 ? '' : 's'}` : `${selectedRoomCount} selected`}
                              </span>
                            </div>

                            <p className="text-xs text-[#6e675f] mb-4 leading-relaxed">
                              {es
                                ? 'Tenemos un cupo de habitaciones con tarifas especiales negociadas en el Castillo del Buen Amor para nuestros invitados. Selecciona si te gustaría solicitar alguna habitación. La confirmación y el pago se gestionarán directamente con el Castillo del Buen Amor según disponibilidad.'
                                : 'We have a room block with special negotiated rates at Castillo del Buen Amor for our guests. Please select if you would like to reserve some of the rooms. Confirmation and payment will follow from Castillo del Buen Amor upon availability.'}
                            </p>

                            <div className={`p-3 rounded-xl border-2 text-xs transition-all ${!hasCastleRoom ? 'border-[#5c141e] bg-[#5c141e]/5' : 'border-gray-200 bg-[#faf7f2]'}`}>
                              <div className="flex items-start gap-2.5">
                                <Check className={`w-4 h-4 mt-0.5 ${!hasCastleRoom ? 'text-[#5c141e]' : 'text-[#b89243]'}`} />
                                <div>
                                  <span className="font-semibold text-[#37080e] block">
                                    {es ? 'No deseo habitación en el castillo' : 'No castle room needed'}
                                  </span>
                                  <span className="text-[11px] text-[#6e675f] font-normal block mt-0.5">
                                    {es
                                      ? 'Alojamiento por mi cuenta en Salamanca o alrededores.'
                                      : 'Staying independently in Salamanca or nearby.'}
                                  </span>
                                </div>
                              </div>

                              {!hasCastleRoom && (
                                <label className="mt-3 flex items-start gap-3 p-3 rounded-lg bg-white border border-[#b89243]/25 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={returnShuttleBooking}
                                    onChange={(e) => updateReturnShuttle(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded text-[#5c141e] focus:ring-[#5c141e] border-gray-300"
                                  />
                                  <span>
                                    <span className="font-bold text-[#37080e] block uppercase tracking-wider">
                                      {es ? 'Autobús de vuelta · Castillo - Salamanca' : 'Return shuttle · Castillo del Buen Amor - Salamanca'}
                                    </span>
                                    <span className="text-[11px] text-[#6e675f] block mt-0.5">
                                      {es
                                        ? 'Vuelta el 4 de septiembre al finalizar la fiesta.'
                                        : 'Return on September 4 after the party.'}
                                    </span>
                                  </span>
                                </label>
                              )}
                            </div>

                            {!returnShuttleBooking && (
                              <div className="space-y-2.5 mt-4">
                                {CASTLE_ROOMS.map((room) => {
                                  const currentQty = roomQuantities[room.id] || 0;
                                  const remaining = getDisplayRemaining(room.id);
                                  const maxQty = getRemoteRemaining(room.id);
                                  const isSelected = currentQty > 0;

                                  return (
                                    <div
                                      key={room.id}
                                      className={`p-3 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                                        maxQty === 0
                                          ? 'border-gray-200 bg-gray-100 opacity-60 text-gray-400'
                                          : isSelected
                                          ? 'border-[#5c141e] bg-[#5c141e]/5 font-semibold text-[#37080e] shadow-xs'
                                          : 'border-gray-200 bg-white hover:border-[#b89243]/60 text-[#44403c]'
                                      }`}
                                    >
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
                                        <span className="inline-flex mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                          {es ? `${remaining} disponibles tras tu selección` : `${remaining} left after your selection`}
                                        </span>
                                      </div>

                                      <label className="flex items-center gap-2 self-start sm:self-center">
                                        <span className="text-[11px] uppercase tracking-wider text-[#5c141e] font-bold">
                                          {es ? 'Cantidad' : 'Qty'}
                                        </span>
                                        <select
                                          value={currentQty}
                                          disabled={maxQty === 0}
                                          onChange={(e) => updateRoomQuantity(room.id, Number(e.target.value))}
                                          className="px-3 py-2 rounded-lg bg-[#faf7f2] border border-[#5c141e]/25 text-[#37080e] font-bold disabled:opacity-50"
                                        >
                                          {Array.from({ length: maxQty + 1 }, (_, qty) => (
                                            <option key={qty} value={qty}>{qty}</option>
                                          ))}
                                        </select>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#5c141e]/15">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                              <Music className="w-4 h-4 text-[#b89243]" />
                              <span>{es ? '¿Qué canción no puede faltar en la fiesta?' : 'DJ Song Request'}</span>
                            </label>
                            <input
                              type="text"
                              value={formData.songRequest || ''}
                              onChange={(e) => setFormData((prev) => ({ ...prev, songRequest: e.target.value }))}
                              placeholder={es ? 'Artista - Título de la canción' : 'Artist - Song title'}
                              className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#5c141e]/20 rounded-lg text-sm text-[#2c241e] placeholder:text-[#9c9489] focus:bg-white focus:outline-none focus:border-[#5c141e] transition-all"
                            />
                          </div>
                        </div>
                      )}

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

                      <button
                        disabled={isSending}
                        type="submit"
                        className="w-full py-4 bg-[#5c141e] hover:bg-[#7a1d2b] text-white text-xs sm:text-sm font-cinzel font-bold tracking-[0.25em] uppercase rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4 text-[#dfc285]" />
                        <span>{isSending ? (es ? 'Enviando confirmación…' : 'Submitting RSVP…') : (es ? 'Confirmar y enviar respuesta' : 'Confirm & Submit RSVP')}</span>
                      </button>
                    </fieldset>
                  </form>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

