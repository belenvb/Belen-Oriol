import './RsvpStationery.css';
import boLogo from '../assets/images/bo-logo.webp';
import './RsvpEditorial.css';
import { HorizontalTrencadis } from './HorizontalTrencadis';
import { useState, useEffect, useRef, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Heart, Send, BedDouble, Bus, Music, Edit3, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendRsvp, lookupInvitation, RsvpSubmission, RsvpPerson, InvitationLookup } from '../utils/rsvp';
import { GuestRsvp, Language } from '../types';
import { RsvpGuests, emptyPerson } from './RsvpGuests';
import { CASTLE_ROOMS } from '../data/rooms';

interface RsvpSectionProps {
  lang: Language;
  initialInvitationCode?: string;
  openRequested?: boolean;
  onInvitationValidated?: (invitation: InvitationLookup | null) => void;
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

export function RsvpSection({ lang, initialInvitationCode = '', openRequested = false, onInvitationValidated }: RsvpSectionProps) {
  const es = lang === 'es';
  const [invitationCode, setInvitationCode] = useState(initialInvitationCode);
  const [invitation, setInvitation] = useState<InvitationLookup | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [guests, setGuests] = useState<RsvpPerson[]>([emptyPerson()]);
  const [roomQuantities, setRoomQuantities] = useState<RoomQuantities>({});
  const [photoRoom, setPhotoRoom] = useState<(typeof CASTLE_ROOMS)[number] | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [outboundCount, setOutboundCount] = useState(1);
  const [returnCount, setReturnCount] = useState(1);
  const [loadedPrevious, setLoadedPrevious] = useState(false);
  const [returnShuttleBooking, setReturnShuttleBooking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const sending = useRef(false);
  const pendingRoom = useRef<Exclude<RoomId, 'none'> | null>(null);
  const pending = useRef<{ fingerprint: string; record: RsvpSubmission } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastAutoCode = useRef('');

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
  const saturdayGuests = guests.filter(p => p.attendance === 'yes' && p.attendingSaturday).length;
  const safeOutboundCount = Math.min(outboundCount, saturdayGuests);
  const safeReturnCount = Math.min(returnCount, saturdayGuests);
  const hasAttendingGuests = guests.some((person) => person.attendance === 'yes');

  // Live Google Sheets prices determine display order; unknown prices come last.
  const sortedRooms = [...CASTLE_ROOMS].sort((a, b) => {
    const aPrice = invitation?.roomAvailability?.find(item => item.id === a.id)?.price;
    const bPrice = invitation?.roomAvailability?.find(item => item.id === b.id)?.price;
    const costA = aPrice == null ? Number.POSITIVE_INFINITY : aPrice;
    const costB = bPrice == null ? Number.POSITIVE_INFINITY : bPrice;
    return costA - costB || CASTLE_ROOMS.indexOf(a) - CASTLE_ROOMS.indexOf(b);
  });

  useEffect(() => {
    if (!photoRoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPhotoRoom(null);
      if (event.key === 'ArrowRight') setPhotoIndex(i => (i + 1) % (photoRoom.photos?.length || 1));
      if (event.key === 'ArrowLeft') setPhotoIndex(i => (i - 1 + (photoRoom.photos?.length || 1)) % (photoRoom.photos?.length || 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photoRoom]);

  const selectedRoomCount = getRoomCount(roomQuantities);

  const scrollToRsvp = () => {
    window.setTimeout(() => {
      document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const getRemoteRemaining = (roomId: Exclude<RoomId, 'none'>) => {
    const live = invitation?.roomAvailability?.find((room) => room.id === roomId);
    return Math.max(0, Number(live?.remaining ?? 0));
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
    setFormData((prev) => ({
      ...prev,
      roomBooking: firstSelectedRoom(next),
      roomBookings: next,
    }));
  };

  const updateReturnShuttle = (checked: boolean) => {
    setReturnShuttleBooking(checked);
    setFormData(prev => ({...prev, returnShuttleBooking: checked}));
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

  const verifyInvitation = async (code: string, automatic = false) => {
    if (!code.trim()) return;
    setInvitationCode(code);
    setCheckingCode(true);
    setCodeError('');
    try {
      const inv = await lookupInvitation(code);
      setInvitation(inv);
      onInvitationValidated?.(inv);
      if (automatic) setIsFormOpen(true);

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
      const requested = pendingRoom.current;
      const available = inv.roomAvailability?.find(room => room.id === requested);
      const next: RoomQuantities = requested && available && available.remaining > 0 ? { [requested]: 1 } : {};
      pendingRoom.current = null;
      const saved = inv.previousRsvp;
      setLoadedPrevious(Boolean(saved));
      if (saved) {
        setFormData(saved);
        updateGuests(saved.guests);
        setRoomQuantities(saved.roomBookings || {});
        setReturnShuttleBooking(Boolean(saved.returnShuttleBooking));
        setOutboundCount(saved.outboundShuttleCount ?? saved.guests.filter(p => p.attendingSaturday).length);
        setReturnCount(saved.returnShuttleCount ?? saved.guests.filter(p => p.attendingSaturday).length);
      } else {
        setRoomQuantities(next);
        setReturnShuttleBooking(false);
        setOutboundCount(1); setReturnCount(1);
        setFormData(prev => ({ ...prev, songRequest: '', blessingMessage: '', shuttleBooking: true, roomBooking: firstSelectedRoom(next), roomBookings: next, returnShuttleBooking: false }));
      }
    } catch {
      onInvitationValidated?.(null);
      if (automatic) setIsFormOpen(true);
      setCodeError(
        es
          ? 'No hemos encontrado tu invitación. Comprueba el código privado de tu email.'
          : 'We could not find your invitation. Check the private code from your email.'
      );
    } finally {
      setCheckingCode(false);
    }
  };

  const checkCode = (e: FormEvent) => {
    e.preventDefault();
    if (checkingCode || !invitationCode.trim()) return;
    void verifyInvitation(invitationCode);
  };

  useEffect(() => {
    if (!initialInvitationCode || lastAutoCode.current === initialInvitationCode) return;
    lastAutoCode.current = initialInvitationCode;
    void verifyInvitation(initialInvitationCode, true);
    // This is deliberately triggered only by a new private link, never by a language change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialInvitationCode]);

  const openRsvpForm = () => {
    setIsSubmitted(false);
    setSubmittedRsvp(null);
    setIsFormOpen(true);
    scrollToRsvp();
  };


  useEffect(() => {
    if (openRequested) openRsvpForm();
    // Open once when requested by the invitation; language changes keep user input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openRequested]);
  useEffect(() => {
    const handleRoomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ roomId: string }>;
      const roomId = customEvent.detail?.roomId as Exclude<RoomId, 'none'> | undefined;
      if (roomId && ROOM_IDS.includes(roomId)) {
        setIsSubmitted(false);
        setIsFormOpen(true);
        if (invitation) updateRoomQuantity(roomId, 1);
        else pendingRoom.current = roomId;
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
      shuttleBooking: saturdayGuests > 0 && Boolean(formData.shuttleBooking) && safeOutboundCount > 0,
      outboundShuttleCount: formData.shuttleBooking ? safeOutboundCount : 0,
      returnShuttleCount: returnShuttleBooking ? safeReturnCount : 0,
      shuttlePickupLocation: isAnyAttending && formData.shuttleBooking ? formData.shuttlePickupLocation : '',
      roomBooking: isAnyAttending ? firstSelectedRoom(cleanedRoomQuantities) : 'none',
      roomBookings: isAnyAttending ? cleanedRoomQuantities : {},
      returnShuttleBooking: saturdayGuests > 0 && safeReturnCount > 0 ? returnShuttleBooking : false,
      songRequest: isAnyAttending ? formData.songRequest || '' : '',
      blessingMessage: formData.blessingMessage || '',
      submittedAt: new Date().toISOString(),
    };

    const submissionId = (crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join(''));
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
          ? 'No hemos podido guardar tu respuesta. Tus datos siguen en este formulario; puedes volver a intentarlo.'
          : 'We could not save your response. Your details are still in this form; please try again.'
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
    <section id="rsvp" className={`rsvp-compact ${isFormOpen ? 'rsvp-is-open' : ''} rsvp-section-shell rsvp-stationery rsvp-refined rsvp-air relative`}>
      <div className="rsvp-paper-layout">
        <img className="rsvp-paper-botanical" src="/photos/rsvp-botanical-refined.webp" alt="" aria-hidden="true" />
        <header className="rsvp-paper-header">
          <p className="rsvp-paper-eyebrow">RSVP</p>
          <span className="rsvp-paper-monogram" aria-hidden="true"><img src={boLogo} alt="" width="96" height="64" /></span>
          <h2>{es ? '¿Nos acompañas?' : 'Will you join us?'}</h2>
          <p className="rsvp-paper-subtitle">{es ? 'Esperamos celebrar este día contigo.' : 'We look forward to celebrating with you.'}</p>
        </header>
        <div className="rsvp-response-layout">
        <aside className="rsvp-paper-notice">
          <p className="rsvp-paper-eyebrow">{es ? 'Alojamiento en el castillo' : 'Staying at the castle'}</p>
          <h3>{es ? 'Bloqueo de habitaciones' : 'Room block'}</h3>
          <p className="rsvp-paper-date">{es ? 'Hasta el 31 de diciembre · Desayuno incluido' : 'Until December 31 · Breakfast included'}</p>
          <p>{es ? 'Si tienes intención de alojarte en el Castillo del Buen Amor, envíanos tu confirmación preliminar antes de esa fecha para ayudarnos a organizar el bloqueo de habitaciones.' : 'If you plan to stay at Castillo del Buen Amor, please send us your preliminary confirmation before that date to help us arrange the room block.'}</p>
        </aside>

        <AnimatePresence mode="wait">
          {isSubmitted && submittedRsvp ? (
            <motion.div
              key="success"
              role="status"
              aria-live="polite"
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
                <div className="flex justify-between border-b border-gray-100 pb-2"><span>{es ? 'Autobús · ida / vuelta' : 'Shuttle · outbound / return'}</span><span>{submittedRsvp.outboundShuttleCount || 0} / {submittedRsvp.returnShuttleCount || 0} {es ? 'personas' : 'guests'}</span></div>
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

              {getRoomCount(submittedRsvp.roomBookings || {}) > 0 && <p className="rsvp-room-receipt">{es ? 'Hemos recibido tu solicitud de habitación. La reserva queda pendiente de confirmación.' : 'We have received your room request. Your booking is pending confirmation.'}</p>}
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
              className="rsvp-paper-entry"
            >
              <div className="rsvp-entry-copy"><p>{es ? 'Con el código privado de tu invitación podrás confirmar o modificar la asistencia, los menús y el transporte o alojamiento.' : 'Use your private invitation code to confirm or update attendance, dietary requirements, transport and accommodation.'}</p></div>
              <button
                type="button"
                aria-controls="rsvp-invitation-access"
                aria-expanded={isFormOpen}
                onClick={openRsvpForm}
                className="rsvp-confirm-button inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5c141e] hover:bg-[#7a1d2b] text-white font-cinzel text-xs sm:text-sm font-bold tracking-[0.22em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                <span>{es ? 'Confirmar asistencia' : 'Confirm attendance'}</span>
              </button>
              <button type="button" className="rsvp-edit-link" onClick={openRsvpForm}>{es ? 'Modificar mi respuesta' : 'Edit my response'}</button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-[#faf7f2] border border-[rgba(92,20,30,0.18)] rounded-xl p-6 sm:p-10 shadow-md relative rsvp-readable-card"
            >
              <div className="rsvp-form-toolbar flex items-center justify-between pb-4 mb-6 border-b border-[rgba(92,20,30,0.12)]">
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
                <form id="rsvp-invitation-access" onSubmit={checkCode} className="space-y-4" aria-busy={checkingCode}>
                  <label className="block text-sm text-[#5c141e] font-semibold">
                    {es ? 'Código privado de tu invitación' : 'Your private invitation code'}
                    <input
                      required
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder={es ? 'Código de 6 caracteres' : '6-character code'}
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
                    <p className="rsvp-edit-hint">{loadedPrevious ? (es ? 'Tu respuesta está cargada. Puedes modificarla y volver a guardarla.' : 'Your response is loaded. You can edit and save it again.') : (es ? 'Podrás volver y modificar tu respuesta con tu código privado.' : 'You can return and edit your response with your private code.')}</p>
                    <button
                      type="button"
                      disabled={isSending}
                      onClick={() => {
                        setInvitation(null);
                        onInvitationValidated?.(null);
                        setInvitationCode('');
                        updateGuests([emptyPerson()]);
                        setRoomQuantities({});
                        setReturnShuttleBooking(false);
                      }}
                      className="text-[#5c141e] underline hover:text-[#7a1d2b] cursor-pointer"
                    >
                      {es ? 'Cambiar acceso' : 'Change access'}
                    </button><button type="button" disabled={isSending} onClick={()=>setIsFormOpen(false)} className="rsvp-collapse-inline">{es ? 'Ocultar' : 'Collapse'}</button>
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
                        <div className="rsvp-logistics space-y-6 pt-6 border-t-2 border-[#5c141e]/15 animate-fade-in">
                          <div className="text-left">
                            <h4 className="font-cinzel text-base font-bold text-[#37080e] uppercase tracking-wider mb-1">
                              {es ? 'Transporte & Alojamiento' : 'Shuttle & Accommodation'}
                            </h4>
                            <p className="text-xs text-[#6e675f]">
                              {es ? 'Opciones de traslado y estancia para el grupo' : 'Travel and lodging preferences for your party'}
                            </p>
                          </div>

                          <div className="rsvp-shuttle-panel p-4 sm:p-5 bg-white rounded-xl border border-[#b89243]/30 shadow-xs">
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
                                  {es ? 'Autobús gratuito · Salamanca → Castillo' : 'Free guest shuttle · Salamanca → Castle'}
                                </span>
                                <span className="text-[#6e675f] block mt-1 leading-relaxed">
                                  {es
                                    ? 'Gratis para invitados · Sábado 4 de septiembre.'
                                    : 'Free for wedding guests · Saturday, September 4.'}
                                </span>
                              </div>
                            </label>
                            {formData.shuttleBooking && <label className="rsvp-passengers">{es ? 'Personas · ida' : 'Passengers · outbound'}<select aria-label={es ? 'Personas en el autobús de ida' : 'Outbound passengers'} value={safeOutboundCount} onChange={e => setOutboundCount(Number(e.target.value))}>{Array.from({length:saturdayGuests+1},(_,i)=><option key={i} value={i}>{i}</option>)}</select></label>}
                          </div>

                          <div className="rsvp-shuttle-panel rsvp-return-panel bg-white p-4 border border-[#b89243]/30 rounded-xl">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input type="checkbox" checked={returnShuttleBooking} onChange={e=>updateReturnShuttle(e.target.checked)}/>
                              <span><span className="rsvp-return-title font-semibold"><Bus className="w-4 h-4 text-[#b89243]" aria-hidden="true"/>{es ? 'Autobús de vuelta · Castillo → Salamanca' : 'Return shuttle · Castle → Salamanca'}</span><span className="block text-xs text-[#6e675f]">{es ? 'Gratis para invitados · Al finalizar la boda, la noche del 4 al 5 de septiembre.' : 'Free for wedding guests · After the wedding, on the night of September 4–5.'}</span></span>
                            </label>
                            {returnShuttleBooking && <label className="rsvp-passengers">{es ? 'Personas · vuelta' : 'Passengers · return'}<select aria-label={es ? 'Personas en el autobús de vuelta' : 'Return passengers'} value={safeReturnCount} onChange={e=>setReturnCount(Number(e.target.value))}>{Array.from({length:saturdayGuests+1},(_,i)=><option key={i} value={i}>{i}</option>)}</select></label>}
                          </div>
                          <div className="rsvp-room-panel p-5 bg-white rounded-xl border-2 border-[#b89243]/40 shadow-xs">
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
                                ? 'Tarifas especiales para invitados, con desayuno incluido, para la noche del 4 al 5 de septiembre de 2027. Solicitud para el bloqueo preliminar antes del 31 de diciembre; el castillo confirmará la disponibilidad y gestionará el pago.'
                                : 'Special guest rates with breakfast for the night of September 4–5, 2027. Request your room before December 31 for the preliminary room block; the castle will confirm availability and arrange payment.'}
                            </p>

                            {(
                              <div className="space-y-2.5 mt-4">
                                {sortedRooms.map((room) => {
                                  const currentQty = roomQuantities[room.id] || 0;
                                  const remoteAvailability = invitation?.roomAvailability?.find((item) => item.id === room.id);
                                  const remaining = getDisplayRemaining(room.id);
                                  const maxQty = getRemoteRemaining(room.id);
                                  const isSelected = currentQty > 0;

                                  return (
                                    <div
                                      key={room.id}
                                      className={`rsvp-room-choice p-3 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                                        maxQty === 0
                                          ? 'border-gray-200 bg-gray-100 opacity-60 text-gray-400'
                                          : isSelected
                                          ? 'border-[#5c141e] bg-[#5c141e]/5 font-semibold text-[#37080e] shadow-xs'
                                          : 'border-gray-200 bg-white hover:border-[#b89243]/60 text-[#44403c]'
                                      }`}
                                    >
                                      <div className="rsvp-room-detail">
                                        {Boolean(room.photos?.[0]) && (
                                          <button type="button" className="rsvp-room-thumbnail"
                                            onClick={() => { setPhotoRoom(room); setPhotoIndex(0); }}
                                            aria-label={es ? `Abrir fotos de ${room.name}` : `Open photos of ${room.nameEn}`}>
                                            <img src={room.photos![0]} alt="" loading="lazy" decoding="async" />
                                          </button>
                                        )}
                                        <div className="rsvp-room-detail__text">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <button type="button" className="rsvp-room-photo-link rsvp-room-name-button"
                                            onClick={() => { setPhotoRoom(room); setPhotoIndex(0); }}
                                            aria-label={es ? `Ver fotos de ${room.name}` : `View photos of ${room.nameEn}`}>
                                            {es ? room.name : room.nameEn}
                                          </button>
                                          <span className="text-[#8c6d4f] font-semibold text-[11px]">
                                            {remoteAvailability?.price != null
                                              ? `${new Intl.NumberFormat(es ? 'es-ES' : 'en-GB', { maximumFractionDigits: 2 }).format(remoteAvailability.price)} € / ${es ? 'noche' : 'night'}`
                                              : (es ? 'Tarifa pendiente de consultar' : 'Rate to be confirmed')}
                                          </span>
                                        </div>
                                        {(es ? room.description : room.descriptionEn) && (
                                          <span className="text-[10.5px] text-[#6e675f] block mt-0.5 font-normal">
                                            {es ? room.description : room.descriptionEn}
                                          </span>
                                        )}
                                        <span className="inline-flex mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                          {remoteAvailability
                                            ? (es ? `${remaining} disponibles tras tu selección` : `${remaining} left after your selection`)
                                            : (es ? 'Disponibilidad pendiente de confirmar' : 'Availability subject to confirmation')}
                                        </span>
                                        </div>
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
                          rows={2}
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
                        <span>{isSending ? (es ? 'Enviando confirmación…' : 'Submitting RSVP…') : (es ? loadedPrevious ? 'Guardar cambios' : 'Confirmar asistencia' : loadedPrevious ? 'Save changes' : 'Confirm attendance')}</span>
                      </button>
                    </fieldset>
                  </form>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
      {photoRoom && createPortal(
        <div className="castle-photos__overlay" role="presentation" onMouseDown={event => {if (event.target === event.currentTarget) setPhotoRoom(null);}}>
          <div className={`castle-photos__dialog${photoRoom.id === 'suite_medieval' ? ' castle-photos__dialog--medieval' : ''}`} role="dialog" aria-modal="true" aria-label={es ? `Fotos de ${photoRoom.name}` : `Photos of ${photoRoom.nameEn}`}>
            <button className="castle-photos__close" type="button" onClick={() => setPhotoRoom(null)} aria-label={es ? 'Cerrar fotos' : 'Close photos'}>×</button>
            <div className="castle-photos__image-wrap"><img src={photoRoom.photos?.[photoIndex]} alt={`${es ? photoRoom.name : photoRoom.nameEn} — ${photoIndex + 1}`} /></div>
            <div className="castle-photos__footer"><div><h3>{es ? photoRoom.name : photoRoom.nameEn}</h3><p>{es ? 'Fotografías del Castillo del Buen Amor' : 'Photos from Castillo del Buen Amor'} · {photoIndex + 1}/{photoRoom.photos?.length || 1}</p></div>
              <div className="castle-photos__actions">{(photoRoom.photos?.length || 0) > 1 && <>
                <button type="button" onClick={() => setPhotoIndex(i => (i - 1 + photoRoom.photos!.length) % photoRoom.photos!.length)} aria-label={es ? 'Foto anterior' : 'Previous photo'}>←</button>
                <button type="button" onClick={() => setPhotoIndex(i => (i + 1) % photoRoom.photos!.length)} aria-label={es ? 'Foto siguiente' : 'Next photo'}>→</button>
              </>}</div></div>
          </div>
        </div>, document.body
      )}
      <HorizontalTrencadis />
    </section>
  );
}


