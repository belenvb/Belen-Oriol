import { useState, useEffect } from 'react';
import { MapPin, Navigation, Car, Train, Bus, ExternalLink, Hotel, Sparkles, BedDouble, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { accommodationsList, weddingInfo } from '../data/content';
import { CASTLE_ROOMS, getCastleRoomBookings } from '../data/rooms';
import { Language } from '../types';

interface JourneyMapProps {
  lang: Language;
}

export function JourneyMap({ lang }: JourneyMapProps) {
  const [roomBookings, setRoomBookings] = useState<Record<string, number>>({});

  useEffect(() => {
    setRoomBookings(getCastleRoomBookings());

    const handleUpdate = () => {
      setRoomBookings(getCastleRoomBookings());
    };

    window.addEventListener('room_reservations_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('room_reservations_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleSelectRoomForRsvp = (roomId: string) => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to pre-select this room in RSVP form
      window.dispatchEvent(new CustomEvent('select_room_in_rsvp', { detail: { roomId } }));
    }
  };
  return (
    <section id="journey" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#ece3d2] relative border-t border-[rgba(92,20,30,0.15)] overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'Historia & Desplazamiento' : 'Travel & Lodging'}</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'Viaje & Hoteles' : 'Travel/Hotels'}
          </h2>
          <p className="font-cormorant text-xl sm:text-2xl text-[#44403c] italic mt-3 leading-relaxed">
            {lang === 'es'
              ? 'Información de viaje, transporte y opciones de alojamiento en Salamanca'
              : 'Travel, transportation, and lodging guide to join us in Salamanca'}
          </p>
          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-5" />
        </motion.div>

        {/* Vintage Parchment Map Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#f5ebdc] border-4 border-[#6b533e] p-6 sm:p-10 rounded-2xl shadow-[0_20px_55px_rgba(45,30,15,0.18)] relative mb-16"
        >
          {/* Inner Dashed Double Borders */}
          <div className="absolute inset-2 sm:inset-3 border border-[#8c6d53]/50 pointer-events-none rounded-xl" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#8c6d53]/30 pointer-events-none rounded-lg" />

          {/* Map Graphic Flow: Barcelona to Salamanca */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 py-6">
            {/* Barcelona Node */}
            <div className="flex flex-col items-center text-center">
              <span className="font-script text-4xl sm:text-5xl text-[#421d15] leading-none mb-1">
                Barcelona
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8c6d3b] mb-3">
                {lang === 'es' ? 'El Origen' : 'Origin City'}
              </span>
              <div className="w-32 h-24 p-2 border border-[#8c6d53]/40 rounded-xl bg-[#fcf8f0]/85 flex items-center justify-center shadow-2xs">
                <svg viewBox="0 0 100 80" className="w-full h-full text-[#421d15] stroke-current fill-none">
                  <path d="M20 70 L20 20 L30 10 L40 20 L40 70 M40 70 L40 15 L50 5 L60 15 L60 70 M60 70 L60 30 L70 20 L80 30 L80 70" strokeWidth="1.5" />
                  <path d="M10 70 L90 70 M25 35 L35 35 M45 30 L55 30 M65 45 L75 45" strokeWidth="1" strokeDasharray="1 1" />
                </svg>
              </div>
            </div>

            {/* Dotted Connecting Heart Route */}
            <div className="flex-1 w-full max-w-xs flex flex-col items-center justify-center px-4">
              <svg viewBox="0 0 240 60" className="w-full h-16 text-[#5c141e] overflow-visible">
                <path
                  d="M10 30 C 60 10, 80 50, 120 30 C 140 20, 135 5, 120 15 C 110 25, 140 50, 230 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="30" r="4.5" fill="currentColor" />
                <circle cx="230" cy="30" r="4.5" fill="currentColor" />
              </svg>
              <span className="font-cinzel text-[11px] font-bold text-[#5c141e] tracking-[0.2em] uppercase mt-1">
                850 KM · UN MISMO DESTINO
              </span>
            </div>

            {/* Salamanca Node */}
            <div className="flex flex-col items-center text-center">
              <span className="font-script text-4xl sm:text-5xl text-[#5c141e] leading-none mb-1">
                Salamanca
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8c6d3b] mb-3">
                {lang === 'es' ? 'El Castillo' : 'The Castle'}
              </span>
              <div className="w-32 h-24 p-2 border-2 border-[#b89243] rounded-xl bg-[#faf2e3] flex flex-col items-center justify-center shadow-md">
                <MapPin className="w-6 h-6 text-[#5c141e] mb-1 animate-bounce" />
                <span className="font-cinzel text-[9px] font-bold text-[#37080e] uppercase tracking-wider text-center">
                  Buen Amor
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Travel Transport Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#b89243]/30 shadow-2xs">
            <Car className="w-6 h-6 text-[#5c141e] mb-3" />
            <h3 className="font-cinzel text-lg font-bold text-[#37080e] mb-2">
              {lang === 'es' ? 'En Coche' : 'By Car'}
            </h3>
            <p className="text-xs text-[#6e675f] leading-relaxed">
              {lang === 'es'
                ? 'A-66 Km 314, Villanueva de Cañedo. A tan solo 20 minutos al norte de Salamanca capital. Aparcamiento privado gratuito en el castillo.'
                : 'A-66 Km 314, Villanueva de Cañedo. Located 20 minutes north of Salamanca. Free private parking on castle grounds.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#b89243]/30 shadow-2xs">
            <Train className="w-6 h-6 text-[#5c141e] mb-3" />
            <h3 className="font-cinzel text-lg font-bold text-[#37080e] mb-2">
              {lang === 'es' ? 'En Tren / AVE' : 'By Train (AVE)'}
            </h3>
            <p className="text-xs text-[#6e675f] leading-relaxed">
              {lang === 'es'
                ? 'Conexión directa en Alvia / Media Distancia desde Madrid-Chamartín (1h 35m) a la estación de Salamanca.'
                : 'Direct high-speed train connections from Madrid-Chamartín (1h 35m) directly to Salamanca station.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf7f2] border-2 border-[#b89243] shadow-xs">
            <Bus className="w-6 h-6 text-[#5c141e] mb-3" />
            <h3 className="font-cinzel text-lg font-bold text-[#37080e] mb-2">
              {lang === 'es' ? 'Autobús de Cortesía' : 'Complimentary Shuttle'}
            </h3>
            <p className="text-xs text-[#6e675f] leading-relaxed">
              {lang === 'es'
                ? 'Autobús lanzadera de cortesía el Viernes 3 y el Sábado 4 entre la Plaza de España de Salamanca y el castillo.'
                : 'Complimentary guest shuttle running on Friday Sep 3 and Saturday Sep 4 between central Salamanca and the castle.'}
            </p>
          </div>
        </div>

        {/* Castillo del Buen Amor - Special Wedding Room Rates */}
        <div className="bg-[#fdfbf7] p-6 sm:p-10 rounded-2xl border-2 border-[#b89243] shadow-lg mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(92,20,30,0.12)] pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5c141e]/10 text-[#5c141e] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">
                <BedDouble className="w-3.5 h-3.5 text-[#b89243]" />
                <span>{lang === 'es' ? 'Alojamiento en el Castillo' : 'Castle Lodging'}</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#37080e] font-bold">
                {lang === 'es' ? 'Habitaciones en el Castillo' : 'Rooms at the Castle'}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#6e675f] mt-1">
                {lang === 'es'
                  ? 'Tarifas especiales concertadas con el Castillo del Buen Amor para nuestros invitados (desayuno incluido).'
                  : 'Special negotiated rates at Castillo del Buen Amor for our guests (breakfast included).'}
              </p>
            </div>

            {/* Room block guarantee badge */}
            <div className="flex flex-col sm:items-end gap-1 bg-[#f5ecdc] p-3.5 rounded-xl border border-[#b89243]/40 max-w-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5c141e] uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-[#b89243]" />
                <span>{lang === 'es' ? 'Bloqueo hasta el 31 de Diciembre' : 'Room block until December 31st'}</span>
              </div>
              <span className="text-[11px] text-[#6e5832] sm:text-right leading-snug">
                {lang === 'es'
                  ? 'El bloqueo de habitaciones solo está disponible hasta el 31 de diciembre; a partir de esa fecha no podemos garantizar disponibilidad.'
                  : 'Room block is only reserved until December 31st; after this date, availability cannot be guaranteed.'}
              </span>
              <span className="text-[10px] font-semibold text-[#8c6d3b] sm:text-right mt-0.5">
                {lang === 'es' ? '✦ Desayuno incluido' : '✦ Breakfast included'}
              </span>
            </div>
          </div>

          {/* Room Categories Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {CASTLE_ROOMS.map((room) => {
              const booked = roomBookings[room.id] || 0;
              const remaining = Math.max(0, room.total - booked);
              const isLimited = room.total <= 3;

              return (
                <div
                  key={room.id}
                  className={`relative p-5 sm:p-6 rounded-xl flex flex-col justify-between transition-all duration-300 ${
                    isLimited
                      ? 'bg-gradient-to-b from-[#fbf6ec] to-[#f4ead8] border-2 border-[#b89243] shadow-md'
                      : 'bg-white border border-[#b89243]/30 hover:border-[#b89243] shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Header: Name & Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-playfair text-lg sm:text-xl font-bold text-[#37080e]">
                        {lang === 'es' ? room.name : room.nameEn}
                      </h4>
                      {room.badge && (
                        <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#5c141e] text-[#fdfbf7]">
                          {lang === 'es' ? room.badge : room.badgeEn}
                        </span>
                      )}
                    </div>

                    {/* Price and Breakfast Tag */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-cinzel text-2xl sm:text-3xl font-bold text-[#5c141e]">
                        {room.price} €
                      </span>
                      <span className="text-xs text-[#6e675f]">
                        {lang === 'es' ? '/ noche · Desayuno incluido' : '/ night · Breakfast included'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#554f47] leading-relaxed mb-4">
                      {lang === 'es' ? room.description : room.descriptionEn}
                    </p>

                    {/* Room Key Highlights */}
                    <ul className="space-y-1.5 mb-3 text-[11px] text-[#6e675f]">
                      {(lang === 'es' ? room.features : room.featuresEn).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b89243] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Direct Castle Room Link */}
                    <div className="mb-4">
                      <a
                        href={room.url || 'https://buenamor.net/alojamiento/habitaciones/'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#5c141e] hover:text-[#b89243] font-semibold underline transition-colors"
                      >
                        <span>{lang === 'es' ? 'Ver habitación en buenamor.net' : 'View room on castle website'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Availability Counter & Reservation Link */}
                  <div className="pt-4 border-t border-[rgba(92,20,30,0.1)] flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8c6d3b]">
                        {lang === 'es' ? 'Disponibilidad' : 'Availability'}
                      </span>
                      <span className="text-xs font-bold text-[#37080e]">
                        {remaining > 0 ? (
                          lang === 'es' ? (
                            <span>
                              <strong className="text-[#5c141e]">{remaining}</strong> de {room.total} disponibles
                            </span>
                          ) : (
                            <span>
                              <strong className="text-[#5c141e]">{remaining}</strong> of {room.total} left
                            </span>
                          )
                        ) : (
                          <span className="text-red-700 font-bold">
                            {lang === 'es' ? 'Completa' : 'Fully booked'}
                          </span>
                        )}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectRoomForRsvp(room.id)}
                      disabled={remaining === 0}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        remaining > 0
                          ? 'bg-[#5c141e] hover:bg-[#781927] text-white shadow-2xs active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {lang === 'es' ? 'Reservar' : 'Reserve'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-[#6e5832] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>
              {lang === 'es'
                ? '📌 Las habitaciones del castillo se asignan por orden de confirmación en el formulario de RSVP. El bloqueo de habitaciones solo está disponible hasta el 31 de diciembre; a partir de esa fecha no podemos garantizar disponibilidad.'
                : '📌 Castle rooms are allocated in order of confirmation in the RSVP form. Room block is only reserved until December 31st; after this date, availability cannot be guaranteed.'}
            </span>
            <button
              onClick={() => handleSelectRoomForRsvp('estandar')}
              className="text-[#5c141e] font-bold underline hover:text-[#37080e] shrink-0 cursor-pointer"
            >
              {lang === 'es' ? 'Ir al RSVP para indicar habitación →' : 'Go to RSVP to select room →'}
            </button>
          </div>
        </div>

        {/* Accommodation Guide: Other Hotels in Salamanca */}
        <div className="bg-[#fdfbf7] p-8 sm:p-10 rounded-2xl border border-[#b89243]/40 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-6 h-6 text-[#5c141e]" />
            <div>
              <h3 className="font-cinzel text-2xl text-[#37080e] font-bold">
                {lang === 'es' ? 'Hoteles en Salamanca Ciudad' : 'Hotels in Salamanca City'}
              </h3>
              <p className="text-xs text-[#6e675f] mt-0.5">
                {lang === 'es'
                  ? 'Para quienes prefieran alojarse en la ciudad (con servicio de autobús lanzadera directo a la boda).'
                  : 'For guests preferring to stay in central Salamanca (complimentary shuttle to and from wedding).'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {accommodationsList.map((hotel, index) => (
              <div
                key={index}
                className="p-5 rounded-xl bg-white border border-[rgba(92,20,30,0.12)] hover:border-[#b89243] transition-colors flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-playfair text-base sm:text-lg text-[#37080e] font-bold leading-snug">
                      {hotel.name}
                    </span>
                  </div>
                  <span className="inline-block text-[10px] tracking-wider uppercase font-semibold text-[#8c6d3b] bg-[#8c6d3b]/10 px-2 py-0.5 rounded mb-2">
                    {hotel.badge}
                  </span>
                  <p className="text-xs text-[#6e675f] leading-relaxed mb-3">
                    {hotel.note}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#5c141e] font-semibold text-[11px]">{hotel.distance}</span>
                  <a
                    href={hotel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#8c6d3b] hover:text-[#5c141e] font-semibold tracking-wider uppercase text-[10px]"
                  >
                    <span>{lang === 'es' ? 'Ver' : 'Explore'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
