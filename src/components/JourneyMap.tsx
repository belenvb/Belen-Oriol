import {
  MapPin,
  Navigation,
  Car,
  Train,
  Bus,
  ExternalLink,
  Hotel,
  Sparkles,
  BedDouble,
  Calendar,
  CheckCircle2,
  Plane,
  Compass,
  Clock,
  ArrowRight,
  Route,
} from 'lucide-react';
import { motion } from 'motion/react';
import { accommodationsList, weddingInfo } from '../data/content';
import { CASTLE_ROOMS } from '../data/rooms';
import { Language } from '../types';
import { TransportPassport } from './TransportPassport';

interface JourneyMapProps {
  lang: Language;
}

export function JourneyMap({ lang }: JourneyMapProps) {
  const handleSelectRoomForRsvp = (roomId: string) => {
    const el = document.getElementById('rsvp');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to pre-select this room in RSVP form
      window.dispatchEvent(new CustomEvent('select_room_in_rsvp', { detail: { roomId } }));
    }
  };



  const getRoomArea = (roomId: string) => {
    const areas: Record<string, string> = {
      estandar: '30 - 34 m²',
      superior: '30 - 40 m²',
      deluxe: '30 - 43 m²',
      suite_guardia: '40 - 45 m²',
      suite_medieval: '40 - 47 m²',
    };

    return areas[roomId] || '';
  };

  const getHotelBadge = (hotel: any) => (lang === 'es' ? hotel.badge : hotel.badgeEn || hotel.badge);
  const getHotelNote = (hotel: any) => (lang === 'es' ? hotel.note : hotel.noteEn || hotel.note);
  const getHotelDistance = (hotel: any) => (lang === 'es' ? hotel.distance : hotel.distanceEn || hotel.distance);

  const getRoomSubtext = (roomId: string) => {
    const subtextsEs: Record<string, string> = {
      estandar: 'Habitaciones más antiguas del castillo, ubicadas en las mazmorras. Muros del siglo XI.',
      superior: 'Alojamiento amplio con cantería del siglo XV.',
      deluxe: 'Bóvedas o techos artesonados. Vistas a los jardines o a la terraza.',
      suite_guardia: 'Suite más antigua del castillo, ubicada en las mazmorras. Muros del siglo XI y vistas al foso.',
      suite_medieval: 'La joya del castillo: cúpulas de ladrillo mudéjar, vigas de madera o acceso privado a las torres.',
    };
    const subtextsEn: Record<string, string> = {
      estandar: 'Oldest rooms in the castle located in the dungeons. 11th century walls.',
      superior: 'Spacious accommodation with 15th-century stonework.',
      deluxe: 'Vaults or coffered ceilings. Views of the gardens or terrace.',
      suite_guardia: 'Oldest suite in the castle located in the dungeons. 11th century walls and overlooking the moat.',
      suite_medieval: 'The castle crown jewel: Mudejar brick domes, wooden beams or private access to the towers.',
    };
    return (lang === 'es' ? subtextsEs[roomId] : subtextsEn[roomId]) || '';
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

        {/* Thematic Wedding Travel Passport (Dual-Page Interactive Guide) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <TransportPassport lang={lang} />
        </motion.div>

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
                  ? 'Tenemos un bloqueo de habitaciones con tarifas especiales concertadas con el Castillo del Buen Amor para nuestros invitados.'
                  : 'We have a room block with special negotiated rates at Castillo del Buen Amor for our guests.'}
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
          <div className="room-list room-list-compact">
            {CASTLE_ROOMS.map((room) => (
              <div className="room-row room-row-detailed" key={room.id}>
                <div className="room-row-copy">
                  <div className="room-row-title-line">
                    <h4>{lang === 'es' ? room.name : room.nameEn}</h4>
                    <span>{getRoomArea(room.id)}</span>
                  </div>
                  <p>{getRoomSubtext(room.id)}</p>
                  <small>
                    {lang === 'es'
                      ? `${room.total} de ${room.total} habitaciones disponibles en el bloqueo`
                      : `${room.total} of ${room.total} in the room block left`}
                  </small>
                </div>
                <div className="room-price-block">
                  <strong>{room.price} €</strong>
                  <span>{lang === 'es' ? '/ noche · Desayuno incluido' : '/ night · Breakfast included'}</span>
                </div>
                <button onClick={() => handleSelectRoomForRsvp(room.id)}>
                  {lang === 'es' ? 'Solicitar' : 'Request'} ↗
                </button>
              </div>
            ))}
          </div>
          <p className="room-note">{lang === 'es' ? 'La selección en el RSVP es una solicitud, sujeta a confirmación de disponibilidad.' : 'Your RSVP room selection is a request, subject to availability confirmation.'}</p>

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
                    {getHotelBadge(hotel)}
                  </span>
                  <p className="text-xs text-[#6e675f] leading-relaxed mb-3">
                    {getHotelNote(hotel)}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#5c141e] font-semibold text-[11px]">{getHotelDistance(hotel)}</span>
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

