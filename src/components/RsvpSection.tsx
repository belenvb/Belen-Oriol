import { useState, useEffect, type FormEvent } from 'react';
import { CheckCircle2, Heart, Send, Sparkles, User, Mail, Utensils, Bus, Music, Edit3, BedDouble, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { GuestRsvp, Language } from '../types';
import { CASTLE_ROOMS, getCastleRoomBookings, recordRoomBooking } from '../data/rooms';


interface RsvpSectionProps {
  lang: Language;
}

export function RsvpSection({ lang }: RsvpSectionProps) {
  const [roomBookings, setRoomBookings] = useState<Record<string, number>>({});

  const [formData, setFormData] = useState<Partial<GuestRsvp>>({
    fullName: '',
    email: '',
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
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        setIsSubmitted(false);
        setIsFormOpen(true);
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const rsvpRecord: GuestRsvp = {
      code: 'RSVP-WEB',
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
    setIsFormOpen(false);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
    setIsFormOpen(true);
  };

  return (
    <section id="rsvp" className="rsvp-section-shell py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="original-seal"><img src="/photos/bo-original.webp" alt="BO" width="120" height="120" loading="lazy" /></div>
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
          
        </motion.div>

        {/* Prominent Castle Room Block & Headcount Notice before Dec 31 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#faf2e3] via-[#fcf8ef] to-[#faf2e3] border-2 border-[#b89243] shadow-md relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#5c141e] border-2 border-[#dfc285] flex items-center justify-center text-[#dfc285] shrink-0 shadow-sm">
              <BedDouble className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-widest uppercase bg-[#5c141e] text-white">
                  {lang === 'es' ? 'AVISO IMPORTANTE · ANTES DEL 31 DE DICIEMBRE' : 'IMPORTANT NOTICE · BEFORE DECEMBER 31'}
                </span>
              </div>
              <h3 className="font-playfair text-base sm:text-lg font-bold text-[#37080e]">
                {lang === 'es'
                  ? 'Conteo Inicial para el Bloqueo de Habitaciones del Castillo'
                  : 'Initial Headcount for the Castle Room Block'}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#554f47] leading-relaxed mt-1">
                {lang === 'es'
                  ? 'Para poder gestionar con el Castillo del Buen Amor el bloqueo de habitaciones exclusivas para los invitados, necesitamos un conteo inicial antes del 31 de diciembre. Si tienes intención de acompañarnos y/o alojarte en el castillo, por favor envíanos tu confirmación preliminar lo antes posible.'
                  : 'In order to arrange and reserve the exclusive room block at Castillo del Buen Amor for our guests, we kindly request an initial headcount before December 31st. If you plan to join us and/or stay at the castle, please submit your preliminary response as early as possible.'}
              </p>
            </div>
          </div>
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
        ) : !isFormOpen ? (
          /* Initial State: Only show "Confirmar Asistencia" button */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf7f2] border border-[rgba(92,20,30,0.2)] rounded-2xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7a1d2b] to-[#3a0810] border-2 border-[#dfc285] flex items-center justify-center text-[#dfc285] shadow-md">
              <Send className="w-6 h-6" />
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#37080e] mb-2 uppercase tracking-wide">
              {lang === 'es' ? 'Confirmación de Asistencia' : 'Wedding Attendance Confirmation'}
            </h3>

            <p className="font-cormorant italic text-base sm:text-lg text-[#6e675f] max-w-lg mx-auto mb-8">
              {lang === 'es'
                ? 'Pulsa en el botón a continuación para abrir el formulario e indicarnos si nos acompañarás, tus preferencias de menú, transporte y alojamiento.'
                : 'Click the button below to open the form and let us know your attendance, dietary preferences, shuttle bus, and room booking.'}
            </p>

            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#5c141e] hover:bg-[#7a1d2b] text-white font-cinzel text-xs sm:text-sm font-bold tracking-[0.22em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#dfc285]" />
              <span>{lang === 'es' ? 'Confirmar Asistencia' : 'Confirm Attendance'}</span>
            </button>

            <div className="mt-6 pt-4 border-t border-[#8c6d4f]/20 text-xs text-[#8c6d4f] font-mono">
              <span>{lang === 'es' ? 'Fecha límite de confirmación: 15 de Julio de 2027 (15.07.2027)' : 'RSVP Deadline: July 15, 2027 (07.15.2027)'}</span>
            </div>
          </motion.div>
        ) : (
          /* RSVP Form when opened */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#faf7f2] border border-[rgba(92,20,30,0.18)] rounded-xl p-6 sm:p-10 shadow-md relative"
          >
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[rgba(92,20,30,0.12)]">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-[#37080e] uppercase">
                  {lang === 'es' ? 'Formulario de Asistencia' : 'RSVP Form'}
                </h3>
                <span className="text-xs text-[#8c6d4f] font-mono">
                  {lang === 'es' ? 'Por favor completa todos los campos' : 'Please complete all required fields'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-[#8c6d4f] hover:text-[#5c141e] underline cursor-pointer font-sans"
              >
                {lang === 'es' ? 'Ocultar formulario' : 'Collapse form'}
              </button>
            </div>

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
                            ? 'Ambos Días — Viernes 3 (Preboda íntima · Solo Invitación) y Sábado 4 (La Boda)'
                            : 'Both Days — Friday Sep 3 (Intimate · Invite Only) & Saturday Sep 4 (Wedding)'}
                        </option>
                        <option value="sept4_only">
                          {lang === 'es'
                            ? 'Solo Sábado 4 de Septiembre (El Gran Día · La Boda)'
                            : 'Saturday Sep 4 Only (The Wedding Day)'}
                        </option>
                        <option value="sept3_only">
                          {lang === 'es'
                            ? 'Solo Viernes 3 de Septiembre (Preboda íntima · Solo Invitación)'
                            : 'Friday Sep 3 Only (Intimate Gathering · Invite Only)'}
                        </option>
                      </select>
                      {(formData.attendingDays === 'both' || formData.attendingDays === 'sept3_only') && (
                        <p className="text-[11px] text-[#8c6d3b] font-medium mt-1.5 italic">
                          {lang === 'es'
                            ? '✦ Nota: Por motivos de aforo, el encuentro del viernes es un encuentro íntimo y exclusivo para quienes hayáis recibido la invitación correspondiente.'
                            : '✦ Note: Due to venue capacity, the Friday evening is an intimate gathering strictly for guests who received an invitation.'}
                        </p>
                      )}
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
                              ? 'Deseo reservar plaza en el servicio de autobús para invitados (Salamanca - Castillo)'
                              : 'Reserve seats on the guest bus service (Salamanca - Castle)'}
                          </span>
                          <span className="text-[#6e675f] block mt-0.5">
                            {lang === 'es'
                              ? 'Salida desde Salamanca con regreso al finalizar la fiesta.'
                              : 'Departing from Salamanca with return shuttle service throughout the evening.'}
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
                          ? 'Cada huésped paga su habitación. Tarifas por habitación y noche con desayuno. Solicitud sujeta a confirmación; se muestra el cupo total:'
                          : 'Each guest pays for their own room. Rates per room per night with breakfast. Requests require confirmation; total allocation shown:'}
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
                          const remaining = room.total;
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
                                      ? `${room.total} habitaciones en el cupo`
                                      : `${room.total} rooms in allocation`}
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
          </motion.div>
        )}
      </div>
    </section>
  );
}

