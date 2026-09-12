import { useState, useEffect } from 'react';
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

        {/* Consolidated Vintage Parchment Travel Guide: How to Get There */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-br from-[#f8f0e1] via-[#f4e8d3] to-[#ebdcc3] border-4 border-[#8c6d4f] p-6 sm:p-10 rounded-2xl shadow-[0_22px_60px_rgba(45,30,15,0.22)] relative mb-16 overflow-hidden"
        >
          {/* Authentic Parchment Inner Borders & Compass */}
          <div className="absolute inset-2 sm:inset-3 border border-[#8c6d4f]/50 pointer-events-none rounded-xl" />
          <div className="absolute inset-3 sm:inset-4 border border-dashed border-[#8c6d4f]/30 pointer-events-none rounded-lg" />

          {/* Compass Rose Accent in top right */}
          <div className="absolute top-5 right-5 sm:top-7 sm:right-7 opacity-25 pointer-events-none text-[#5c141e]">
            <Compass className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.2]" />
          </div>

          {/* Parchment Map Header */}
          <div className="relative z-10 text-center mb-8 sm:mb-10">
            <span className="font-cormorant italic text-sm sm:text-base text-[#8c6d3b] block tracking-widest uppercase">
              {lang === 'es' ? 'Guía Práctica de Desplazamiento' : 'Practical Travel & Arrival Guide'}
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#37080e] font-bold tracking-wide">
              {lang === 'es' ? 'Cómo Llegar al Enlace' : 'How to Get to the Wedding'}
            </h3>
            <p className="font-cormorant italic text-base sm:text-lg text-[#5c141e] mt-1.5 max-w-2xl mx-auto leading-relaxed">
              {lang === 'es'
                ? 'Tanto si venís en coche desde diferentes puntos de España, en tren o en avión vía Madrid o Valladolid, aquí tenéis todos los detalles consolidados para vuestro viaje.'
                : 'Whether you are driving from across Spain, arriving by train, or flying via Madrid or Valladolid, here is the complete guide for your journey.'}
            </p>
          </div>

          {/* Consolidated 3 Travel Pillars */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: En Avión */}
            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-xl bg-white/80 border border-[#8c6d4f]/35 shadow-xs backdrop-blur-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#f4e8d3] border-2 border-[#b89243] flex items-center justify-center text-[#5c141e] shadow-2xs">
                    <Plane className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase bg-[#5c141e]/10 text-[#5c141e] border border-[#5c141e]/20">
                    {lang === 'es' ? 'En Avión' : 'By Air'}
                  </span>
                </div>

                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#37080e] mb-1">
                  {lang === 'es' ? 'Vuelos & Aeropuertos' : 'Flights & Airports'}
                </h4>

                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8c6d3b] block mb-2.5">
                  {lang === 'es' ? 'Madrid Barajas & Valladolid' : 'Madrid & Valladolid Airports'}
                </span>

                <div className="space-y-2.5 mb-3 text-xs text-[#554f47]">
                  <div className="p-2.5 rounded-lg bg-[#faf4e6] border border-[#b89243]/25">
                    <span className="font-semibold text-xs text-[#37080e] block mb-0.5">
                      {lang === 'es' ? 'Madrid-Barajas (MAD):' : 'Madrid Airport (MAD):'}
                    </span>
                    <span className="text-[11px] text-[#554f47] leading-snug block">
                      {lang === 'es'
                        ? 'Ideal para vuelos internacionales o desde cualquier punto. Desde la T4 hay tren directo de Cercanías (C-1 / C-10) a Chamartín en 12-15 min.'
                        : 'Ideal for international or domestic flights. From Terminal 4, direct Cercanías train to Madrid-Chamartín in 12-15 min.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#faf4e6] border border-[#b89243]/25">
                    <span className="font-semibold text-xs text-[#37080e] block mb-0.5">
                      {lang === 'es' ? 'Barcelona ✈ Valladolid (VLL):' : 'Barcelona ✈ Valladolid (VLL):'}
                    </span>
                    <span className="text-[11px] text-[#554f47] leading-snug block">
                      {lang === 'es'
                        ? 'Vuelos directos Barcelona (BCN) – Valladolid (VLL) (Ryanair / Vueling). Desde Valladolid a Salamanca hay tren directo Renfe en ~45-50 min o autovía A-62 en ~1h.'
                        : 'Direct flights Barcelona (BCN) to Valladolid (VLL). From Valladolid to Salamanca: direct train in ~45-50 min or A-62 motorway drive (~1h).'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#8c6d4f]/25 flex items-center gap-1.5 text-[11px] font-semibold text-[#5c141e]">
                <span>✦</span>
                <span>{lang === 'es' ? 'Conexiones vía Madrid o Valladolid' : 'Connections via Madrid or Valladolid'}</span>
              </div>
            </div>

            {/* Pillar 2: En Tren o en Coche a Salamanca */}
            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-xl bg-white/80 border border-[#8c6d4f]/35 shadow-xs backdrop-blur-xs">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-11 h-11 rounded-full bg-[#f4e8d3] border-2 border-[#b89243] flex items-center justify-center text-[#5c141e] shadow-2xs">
                      <Train className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#f4e8d3]/70 border border-[#b89243] flex items-center justify-center text-[#5c141e] shadow-2xs">
                      <Car className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase bg-[#b89243]/20 text-[#37080e] border border-[#b89243]/30">
                    {lang === 'es' ? 'Tren o Coche' : 'Train or Car'}
                  </span>
                </div>

                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#37080e] mb-2.5">
                  {lang === 'es' ? 'Llegada a Salamanca' : 'Arrival in Salamanca'}
                </h4>

                <div className="space-y-2.5 mb-3">
                  <div className="p-2.5 rounded-lg bg-[#faf4e6] border border-[#b89243]/25">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-[#37080e] block">
                        {lang === 'es' ? 'Madrid – Salamanca en Tren:' : 'Madrid – Salamanca by Train:'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#554f47] leading-snug block mt-0.5">
                      {lang === 'es'
                        ? 'Tren Alvia (Renfe) directo desde Madrid-Chamartín en 1h 35m con múltiples frecuencias diarias.'
                        : 'Direct Alvia train from Madrid-Chamartín in 1h 35m with frequent departures.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#faf4e6] border border-[#b89243]/25">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-[#37080e] block">
                        {lang === 'es' ? 'Barcelona – Salamanca:' : 'Barcelona – Salamanca:'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#554f47] leading-snug block mt-0.5">
                      {lang === 'es'
                        ? 'En tren: Alvia directo o AVE con transbordo en Madrid (Atocha/Chamartín) en ~5h 30m. En coche: por AP-2/A-2 y A-62 (~8h / 800 km).'
                        : 'By train: direct Alvia or AVE via Madrid (~5h 30m). By car: AP-2/A-2 & A-62 motorway drive (~8h).'}
                    </span>
                    <a
                      href="https://www.renfe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5c141e] hover:text-[#b89243] transition-colors mt-2 underline underline-offset-2"
                    >
                      <span>{lang === 'es' ? 'Ver billetes y horarios en Renfe.com' : 'Check schedules & tickets on Renfe.com'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#faf4e6] border border-[#b89243]/25">
                    <span className="font-semibold text-xs text-[#37080e] block">
                      {lang === 'es' ? 'En Coche Particular:' : 'By Car:'}
                    </span>
                    <span className="text-[11px] text-[#554f47] leading-snug block mt-0.5">
                      {lang === 'es'
                        ? 'Desde Madrid por autopista A-6 y autovía A-50 (~2h). O conexión directa por autovías A-62 y A-66 desde el resto de España.'
                        : 'Direct motorway drive via A-6 & A-50 (~2h from Madrid); or direct A-62/A-66 highways across Spain.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#8c6d4f]/25 flex items-center gap-1.5 text-[11px] font-semibold text-[#5c141e]">
                <span>✦</span>
                <span>{lang === 'es' ? 'Trenes Renfe y autovías directas' : 'Direct Renfe trains & motorways'}</span>
              </div>
            </div>

            {/* Pillar 3: Castillo del Buen Amor & Autobús de Invitados */}
            <div className="flex flex-col justify-between p-5 sm:p-6 rounded-xl bg-[#faf2e3] border-2 border-[#b89243] shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#5c141e] border-2 border-[#dfc285] flex items-center justify-center text-[#dfc285] shadow-xs">
                    <MapPin className="w-5 h-5 animate-bounce" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-cinzel font-bold tracking-wider uppercase bg-[#5c141e] text-[#dfc285] border border-[#dfc285]/40">
                    {lang === 'es' ? 'Día de la Boda' : 'Wedding Day'}
                  </span>
                </div>

                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#37080e] mb-1">
                  Castillo del Buen Amor
                </h4>

                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8c6d3b] block mb-2.5">
                  {lang === 'es' ? 'Sede del Enlace & Celebración' : 'Venue & Celebration'}
                </span>

                <div className="space-y-2 mb-3">
                  <div className="p-2.5 rounded-lg bg-white/90 border border-[#b89243]/35">
                    <span className="font-semibold text-xs text-[#37080e] flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-[#5c141e]" />
                      {lang === 'es' ? 'Autobús para Invitados' : 'Guest Bus Service'}
                    </span>
                    <span className="text-[11px] text-[#554f47] leading-snug block mt-1">
                      {lang === 'es'
                        ? 'Servicio de autobuses el sábado entre Salamanca y el castillo para la ceremonia y banquete, con regresos escalonados durante la fiesta y la madrugada.'
                        : 'Guest bus service between Salamanca and the castle on Saturday for ceremony & party, with staggered returns during late night.'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/90 border border-[#b89243]/35">
                    <span className="font-semibold text-xs text-[#37080e] flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#5c141e]" />
                      {lang === 'es' ? 'En Coche o Taxi (20 min)' : 'By Car or Taxi (20 min)'}
                    </span>
                    <span className="text-[11px] text-[#554f47] leading-snug block mt-1">
                      {lang === 'es'
                        ? 'A 20 km al norte de Salamanca por la A-66 / N-630. Los taxis desde Salamanca tardan ~20 minutos. El castillo cuenta con parking gratuito para invitados.'
                        : '20 km north of Salamanca via A-66 / N-630. Taxis from Salamanca take ~20 minutes. Free on-site parking is available for all guests at the castle.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b89243]/40 flex items-center gap-1.5 text-[11px] font-semibold text-[#5c141e]">
                <span>✦</span>
                <span>{lang === 'es' ? 'Autobús de invitados + Parking gratuito' : 'Guest bus + Free guest parking'}</span>
              </div>
            </div>
          </div>
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
