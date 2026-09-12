import { useState, useEffect, type FormEvent } from 'react';
import { CheckCircle2, Heart, Send, Sparkles, User, Mail, Utensils, Bus, Music, Edit3, BedDouble, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { GuestRsvp, Language } from '../types';
import { CASTLE_ROOMS, getCastleRoomBookings, recordRoomBooking } from '../data/rooms';

interface RsvpSectionProps {
  lang: Language;
}

export function RsvpSection({ lang }: RsvpSectionProps) {
  const [guestCode, setGuestCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [roomBookings, setRoomBookings] = useState<Record<string, number>>({});

  const [formData, setFormData] = useState<Partial<GuestRsvp>>({
    attendance: 'yes',
    attendingDays: 'both',
    plusOneCount: 1,
    dietaryPreference: 'none',
    allergiesNote: '',
    shuttleBooking: true,
    shuttlePickupLocation: 'Plaza de España, Salamanca',
    roomBooking: 'none',
    songRequest: '',
    blessingMessage: '',
  });

  const [submittedRsvp, setSubmittedRsvp] = useState<GuestRsvp | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setRoomBookings(getCastleRoomBookings());

    const handleRoomUpdate = () => {
      setRoomBookings(getCastleRoomBookings());
    };
    window.addEventListener('room_reservations_changed', handleRoomUpdate);

    // Listen for room pre-selection from the accommodation section
    const handleRoomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ roomId: string }>;
      if (customEvent.detail?.roomId) {
        setIsVerified(true);
        setIsSubmitted(false);
        setFormData((prev) => ({ ...prev, roomBooking: customEvent.detail.roomId }));
      }
    };
    window.addEventListener('select_room_in_rsvp', handleRoomSelect);

    const saved = localStorage.getItem('belen_oriol_rsvp_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubmittedRsvp(parsed);
        setIsSubmitted(true);
        setIsVerified(true);
        setFormData(parsed);
      } catch {
        // Safe fallback
      }
    }

    return () => {
      window.removeEventListener('room_reservations_changed', handleRoomUpdate);
      window.removeEventListener('select_room_in_rsvp', handleRoomSelect);
    };
  }, []);

  const handleVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    if (!guestCode.trim()) {
      setVerificationError(
        lang === 'es' ? 'Por favor introduce tu código.' : 'Please enter your code.'
      );
      return;
    }
    // Accept standard wedding codes or email
    setIsVerified(true);
    setVerificationError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const rsvpRecord: GuestRsvp = {
      code: guestCode || 'OPEN-RSVP',
      fullName: formData.fullName,
      email: formData.email,
      attendance: formData.attendance || 'yes',
      attendingDays: formData.attendingDays || 'both',
      plusOneCount: Number(formData.plusOneCount) || 1,
      plusOneNames: formData.plusOneNames || '',
      dietaryPreference: formData.dietaryPreference || 'none',
      allergiesNote: formData.allergiesNote || '',
      shuttleBooking: Boolean(formData.shuttleBooking),
      shuttlePickupLocation: formData.shuttlePickupLocation,
      roomBooking: formData.roomBooking || 'none',
      songRequest: formData.songRequest || '',
      blessingMessage: formData.blessingMessage || '',
      submittedAt: new Date().toISOString(),
    };

    if (formData.roomBooking && formData.roomBooking !== 'none') {
      recordRoomBooking(formData.roomBooking);
    }

    localStorage.setItem('belen_oriol_rsvp_data', JSON.stringify(rsvpRecord));
    setSubmittedRsvp(rsvpRecord);
    setIsSubmitted(true);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#fdfbf7] relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#5c141e] font-semibold block mb-2">
            {lang === 'es' ? 'Rogamos Confirmación' : 'Kindly Respond'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            RSVP
          </h2>
          <p className="font-cormorant text-xl text-[#6e675f] italic mt-3">
            {lang === 'es'
              ? 'Por favor confírmanos tu asistencia antes del 15 de Julio de 2027 para organizar cada detalle de tu estancia.'
              : 'Please confirm your attendance before July 15, 2027 to help us curate every aspect of your experience.'}
          </p>
          <div className="w-16 h-[1.5px] bg-[#b89243] mx-auto mt-6" />
        </motion.div>

        {/* Confirmation Card if already submitted */}
        {isSubmitted && submittedRsvp ? (
          <div className="bg-[#faf7f2] border-2 border-[#b89243] rounded-xl p-8 sm:p-12 shadow-lg text-center relative overflow-hidden animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#5c141e]/10 border border-[#b89243] flex items-center justify-center mx-auto mb-5 text-[#5c141e]">
              <CheckCircle2 className="w-8 h-8 text-[#5c141e]" />
            </div>

            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#b89243] block mb-1">
              {lang === 'es' ? '¡Respuesta Registrada con Éxito!' : 'RSVP Successfully Received!'}
            </span>

            <h3 className="font-cinzel text-2xl sm:text-3xl text-[#37080e] font-bold mb-4">
              {submittedRsvp.fullName}
            </h3>

            <p className="font-cormorant text-lg text-[#44403c] italic max-w-md mx-auto mb-8">
              {submittedRsvp.attendance === 'yes'
                ? lang === 'es'
                  ? '¡Qué inmensa alegría contar con vosotros en El Castillo del Buen Amor! Nos vemos en Salamanca.'
                  : 'We are thrilled to celebrate this momentous chapter with you in Salamanca!'
                : lang === 'es'
                ? 'Lamentamos mucho que no puedas acompañarnos, te tendremos muy presente en nuestro corazón.'
                : 'We will miss your presence deeply, but you will remain in our hearts!'}
            </p>

            <div className="bg-white p-5 rounded-lg border border-[rgba(92,20,30,0.1)] text-left text-xs space-y-2 mb-8 max-w-md mx-auto">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                  {lang === 'es' ? 'Asistencia:' : 'Attendance:'}
                </span>
                <span className="font-semibold text-[#5c141e]">
                  {submittedRsvp.attendance === 'yes'
                    ? lang === 'es'
                      ? 'Sí, Asistiré'
                      : 'Joyfully Attending'
                    : lang === 'es'
                    ? 'No podré asistir'
                    : 'Regretfully Declining'}
                </span>
              </div>

              {submittedRsvp.attendance === 'yes' && (
                <>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                      {lang === 'es' ? 'Jornadas:' : 'Days:'}
                    </span>
                    <span className="font-semibold">
                      {submittedRsvp.attendingDays === 'both'
                        ? lang === 'es'
                          ? 'Viernes 3 & Sábado 4 Sep'
                          : 'Friday 3 & Saturday 4 Sep'
                        : submittedRsvp.attendingDays === 'sept3_only'
                        ? lang === 'es'
                          ? 'Solo Viernes 3 (Bienvenida)'
                          : 'Friday 3 Only'
                        : lang === 'es'
                        ? 'Solo Sábado 4 (La Boda)'
                        : 'Saturday 4 Only'}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                      {lang === 'es' ? 'Plazas de Autobús:' : 'Shuttle Bus:'}
                    </span>
                    <span>
                      {submittedRsvp.shuttleBooking
                        ? lang === 'es'
                          ? 'Sí, reservada'
                          : 'Yes, reserved'
                        : lang === 'es'
                        ? 'No necesario'
                        : 'Not needed'}
                    </span>
                  </div>

                  {submittedRsvp.dietaryPreference && submittedRsvp.dietaryPreference !== 'none' && (
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                        {lang === 'es' ? 'Menú Especial:' : 'Dietary:'}
                      </span>
                      <span className="capitalize">{submittedRsvp.dietaryPreference}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[#8c6d3b] uppercase font-bold tracking-wider">
                      {lang === 'es' ? 'Habitación en el Castillo:' : 'Castle Room:'}
                    </span>
                    <span className="font-semibold text-right">
                      {(() => {
                        const room = CASTLE_ROOMS.find((r) => r.id === submittedRsvp.roomBooking);
                        if (!room) {
                          return lang === 'es' ? 'No reservada (alojamiento en Salamanca)' : 'Not booked (staying elsewhere)';
                        }
                        return `${lang === 'es' ? room.name : room.nameEn} (${room.price} € · ${lang === 'es' ? 'Desayuno incl.' : 'Breakfast incl.'})`;
                      })()}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold tracking-wider uppercase border border-[#5c141e] text-[#5c141e] hover:bg-[#5c141e]/10 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Modificar Respuesta' : 'Edit My RSVP'}</span>
            </button>
          </div>
        ) : (
          /* RSVP Form */
          <div className="bg-[#faf7f2] border border-[rgba(92,20,30,0.18)] rounded-xl p-6 sm:p-10 shadow-md relative">
            {/* Step 1: Verification Code */}
            {!isVerified ? (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-2">
                    {lang === 'es'
                      ? 'Código de Invitación o Correo Electrónico *'
                      : 'Invitation Code or Email Address *'}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={guestCode}
                      onChange={(e) => setGuestCode(e.target.value)}
                      placeholder={lang === 'es' ? 'ej. BO-2027 o tu correo' : 'e.g. BO-2027 or your email'}
                      className="flex-1 px-4 py-3 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#5c141e] hover:bg-[#7a1d2b] text-white text-xs font-semibold tracking-widest uppercase rounded transition-colors cursor-pointer shadow-xs"
                    >
                      {lang === 'es' ? 'Continuar' : 'Proceed'}
                    </button>
                  </div>
                  {verificationError && (
                    <span className="text-xs text-rose-700 mt-2 block">{verificationError}</span>
                  )}
                </div>

                <div className="p-4 bg-white/60 rounded border border-[rgba(92,20,30,0.08)] text-xs text-[#6e675f]">
                  <p>
                    {lang === 'es'
                      ? 'Si no dispones de código, introduce tu nombre o correo para acceder directamente a la confirmación.'
                      : 'If you do not have an invitation code, simply enter your name or email to complete your response.'}
                  </p>
                </div>
              </form>
            ) : (
              /* Step 2: Detailed RSVP Fields */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#b89243]" />
                      <span>{lang === 'es' ? 'Nombre y Apellidos *' : 'Full Name *'}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName || ''}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="ej. Laura Sánchez Blázquez"
                      className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#b89243]" />
                      <span>{lang === 'es' ? 'Correo Electrónico *' : 'Email Address *'}</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="laura@ejemplo.com"
                      className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                    />
                  </div>
                </div>

                {/* Attendance Radio */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-2.5">
                    {lang === 'es' ? '¿Nos acompañarás en la boda? *' : 'Will you attend? *'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.attendance === 'yes'
                          ? 'border-[#5c141e] bg-[#5c141e]/5 text-[#5c141e] font-semibold'
                          : 'border-[rgba(92,20,30,0.15)] bg-white text-[#44403c]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="yes"
                        checked={formData.attendance === 'yes'}
                        onChange={() => setFormData({ ...formData, attendance: 'yes' })}
                        className="text-[#5c141e] focus:ring-[#5c141e]"
                      />
                      <span className="text-sm">
                        {lang === 'es' ? '¡Sí, asistiré con mucha ilusión!' : 'Yes, joyfully accepting!'}
                      </span>
                    </label>

                    <label
                      className={`p-3.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                        formData.attendance === 'no'
                          ? 'border-[#5c141e] bg-[#5c141e]/5 text-[#5c141e] font-semibold'
                          : 'border-[rgba(92,20,30,0.15)] bg-white text-[#44403c]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value="no"
                        checked={formData.attendance === 'no'}
                        onChange={() => setFormData({ ...formData, attendance: 'no' })}
                        className="text-[#5c141e] focus:ring-[#5c141e]"
                      />
                      <span className="text-sm">
                        {lang === 'es' ? 'Lamentablemente no podré' : 'Regretfully declining'}
                      </span>
                    </label>
                  </div>
                </div>

                {formData.attendance === 'yes' && (
                  <div className="space-y-6 pt-2 border-t border-[rgba(92,20,30,0.1)]">
                    {/* Days attending */}
                    <div>
                      <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-2">
                        {lang === 'es' ? 'Jornadas de Asistencia *' : 'Events Attending *'}
                      </label>
                      <select
                        value={formData.attendingDays}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attendingDays: e.target.value as 'both' | 'sept3_only' | 'sept4_only',
                          })
                        }
                        className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                      >
                        <option value="both">
                          {lang === 'es'
                            ? 'Ambos Días — Viernes 3 (Bienvenida) y Sábado 4 (La Boda)'
                            : 'Both Days — Friday Sep 3 & Saturday Sep 4'}
                        </option>
                        <option value="sept4_only">
                          {lang === 'es'
                            ? 'Solo Sábado 4 de Septiembre (La Boda)'
                            : 'Saturday Sep 4 Only (The Wedding)'}
                        </option>
                        <option value="sept3_only">
                          {lang === 'es'
                            ? 'Solo Viernes 3 de Septiembre (Bienvenida)'
                            : 'Friday Sep 3 Only (Welcome Evening)'}
                        </option>
                      </select>
                    </div>

                    {/* Number of Guests */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5">
                          {lang === 'es' ? 'Número Total de Invitados' : 'Total Guests Count'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={formData.plusOneCount || 1}
                          onChange={(e) =>
                            setFormData({ ...formData, plusOneCount: parseInt(e.target.value) || 1 })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5">
                          {lang === 'es' ? 'Nombre del Acompañante (+1)' : 'Plus-One Full Name'}
                        </label>
                        <input
                          type="text"
                          value={formData.plusOneNames || ''}
                          onChange={(e) => setFormData({ ...formData, plusOneNames: e.target.value })}
                          placeholder={lang === 'es' ? 'Nombre de tu pareja / acompañante' : 'Name of guest'}
                          className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                        />
                      </div>
                    </div>

                    {/* Dietary / Allergies */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-[#b89243]" />
                          <span>{lang === 'es' ? 'Preferencia de Menú' : 'Dietary Needs'}</span>
                        </label>
                        <select
                          value={formData.dietaryPreference}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dietaryPreference: e.target.value as 'none' | 'vegetarian' | 'vegan' | 'celiac' | 'other',
                            })
                          }
                          className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                        >
                          <option value="none">{lang === 'es' ? 'Menú Tradicional' : 'Traditional Menu'}</option>
                          <option value="celiac">{lang === 'es' ? 'Menú Celíaco (Sin Gluten)' : 'Gluten-Free / Celiac'}</option>
                          <option value="vegetarian">{lang === 'es' ? 'Menú Vegetariano' : 'Vegetarian'}</option>
                          <option value="vegan">{lang === 'es' ? 'Menú Vegano' : 'Vegan'}</option>
                          <option value="other">{lang === 'es' ? 'Otras Intolerancias' : 'Other Dietary'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5">
                          {lang === 'es' ? 'Detalle de Alergias' : 'Allergies Details'}
                        </label>
                        <input
                          type="text"
                          value={formData.allergiesNote || ''}
                          onChange={(e) => setFormData({ ...formData, allergiesNote: e.target.value })}
                          placeholder="ej. Alergia a frutos secos, marisco..."
                          className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                        />
                      </div>
                    </div>

                    {/* Shuttle bus checkbox */}
                    <div className="p-4 bg-white rounded-lg border border-[rgba(92,20,30,0.12)]">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.shuttleBooking)}
                          onChange={(e) => setFormData({ ...formData, shuttleBooking: e.target.checked })}
                          className="mt-0.5 rounded text-[#5c141e] focus:ring-[#5c141e]"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-[#37080e] flex items-center gap-1.5 uppercase tracking-wider">
                            <Bus className="w-3.5 h-3.5 text-[#b89243]" />
                            {lang === 'es'
                              ? 'Deseo reservar plaza en el autobús Salamanca - Castillo'
                              : 'Reserve seats on the Salamanca - Castle shuttle'}
                          </span>
                          <span className="text-[#6e675f] block mt-0.5">
                            {lang === 'es'
                              ? 'Salida desde la Plaza de España de Salamanca con regreso al finalizar la fiesta.'
                              : 'Departing from Plaza de España with return shuttles throughout the evening.'}
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Room Booking at Castillo del Buen Amor */}
                    <div className="p-4 sm:p-5 bg-white rounded-xl border-2 border-[#b89243]/40 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-[#b89243]" />
                          <span>
                            {lang === 'es'
                              ? 'Alojamiento en El Castillo del Buen Amor'
                              : 'Castle Room Reservation'}
                          </span>
                        </label>
                        <span className="text-[10px] font-bold text-[#b89243] uppercase tracking-wider bg-[#b89243]/10 px-2 py-0.5 rounded">
                          {lang === 'es' ? 'Precios hasta 31 Dic' : 'Rates until Dec 31'}
                        </span>
                      </div>

                      <p className="text-xs text-[#6e675f] mb-3 leading-relaxed">
                        {lang === 'es'
                          ? 'Tarifas especiales de boda concertadas con el castillo (todas incluyen desayuno buffet). Disponibilidad en tiempo real según confirmaciones:'
                          : 'Special wedding block rates at the castle (all include buffet breakfast). Live availability:'}
                      </p>

                      <div className="space-y-2">
                        {/* Option None */}
                        <label
                          className={`p-3 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                            formData.roomBooking === 'none' || !formData.roomBooking
                              ? 'border-[#5c141e] bg-[#5c141e]/5 font-semibold text-[#5c141e]'
                              : 'border-gray-200 bg-gray-50/50 text-[#554f47] hover:bg-gray-50'
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
                            <span>
                              {lang === 'es'
                                ? 'No deseo habitación en el castillo (me alojo en Salamanca)'
                                : 'No castle room needed (staying in Salamanca or nearby)'}
                            </span>
                          </div>
                        </label>

                        {/* Castle Room Options */}
                        {CASTLE_ROOMS.map((room) => {
                          const booked = roomBookings[room.id] || 0;
                          const remaining = Math.max(0, room.total - booked);
                          const isSelected = formData.roomBooking === room.id;

                          return (
                            <label
                              key={room.id}
                              className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors ${
                                remaining === 0
                                  ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed text-gray-400'
                                  : isSelected
                                  ? 'border-[#5c141e] bg-[#5c141e]/5 font-semibold text-[#37080e] cursor-pointer shadow-xs'
                                  : 'border-gray-200 bg-white hover:border-[#b89243]/60 cursor-pointer text-[#44403c]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <input
                                  type="radio"
                                  name="roomBooking"
                                  value={room.id}
                                  disabled={remaining === 0}
                                  checked={isSelected}
                                  onChange={() => setFormData({ ...formData, roomBooking: room.id })}
                                  className="text-[#5c141e] focus:ring-[#5c141e]"
                                />
                                <div>
                                  <span className="font-bold text-[#37080e]">
                                    {lang === 'es' ? room.name : room.nameEn}
                                  </span>
                                  <span className="text-[#6e675f] text-[11px] block sm:inline sm:ml-2">
                                    {room.price} € / {lang === 'es' ? 'noche · Desayuno incl.' : 'night · Breakfast incl.'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                {remaining > 0 ? (
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                    {lang === 'es'
                                      ? `${remaining} de ${room.total} disponibles`
                                      : `${remaining} of ${room.total} left`}
                                  </span>
                                ) : (
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700">
                                    {lang === 'es' ? 'Agotada' : 'Sold out'}
                                  </span>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Song Request */}
                    <div>
                      <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-[#b89243]" />
                        <span>
                          {lang === 'es' ? '¿Qué canción no puede faltar en la fiesta?' : 'Your DJ Song Request'}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.songRequest || ''}
                        onChange={(e) => setFormData({ ...formData, songRequest: e.target.value })}
                        placeholder="Artista - Título de la canción"
                        className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                      />
                    </div>
                  </div>
                )}

                {/* Blessing Message */}
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-[#5c141e] mb-1.5 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#b89243]" />
                    <span>
                      {lang === 'es'
                        ? 'Unas palabras para Belén & Oriol'
                        : 'A heartfelt note for the couple'}
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.blessingMessage || ''}
                    onChange={(e) => setFormData({ ...formData, blessingMessage: e.target.value })}
                    placeholder={
                      lang === 'es'
                        ? '¡Estamos deseando veros y celebrar con vosotros en el Castillo!'
                        : 'Looking forward to celebrating with you at the castle!'
                    }
                    className="w-full px-4 py-2.5 bg-white border border-[rgba(92,20,30,0.2)] rounded text-sm focus:outline-none focus:border-[#5c141e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#5c141e] hover:bg-[#7a1d2b] text-white text-xs font-bold tracking-[0.25em] uppercase rounded transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#e5cb8f]" />
                  <span>{lang === 'es' ? 'Confirmar Asistencia' : 'Submit RSVP'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
