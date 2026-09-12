import { useState, useEffect, useCallback } from 'react';
import { castlePhotos } from '../data/content';
import { CastlePhoto, Language } from '../types';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CastleGalleryProps {
  lang: Language;
}

export function CastleGallery({ lang }: CastleGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<CastlePhoto | null>(null);

  const filteredPhotos =
    activeFilter === 'all'
      ? castlePhotos
      : castlePhotos.filter((p) => p.category === activeFilter);

  const handleNext = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = castlePhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % castlePhotos.length;
    setSelectedPhoto(castlePhotos[nextIndex]);
  }, [selectedPhoto]);

  const handlePrev = useCallback(() => {
    if (!selectedPhoto) return;
    const currentIndex = castlePhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + castlePhotos.length) % castlePhotos.length;
    setSelectedPhoto(castlePhotos[prevIndex]);
  }, [selectedPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, handleNext, handlePrev]);

  return (
    <section id="castle" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#f3ede2] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'El Escenario Medieval' : 'The Historic Venue'}</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            El Castillo del Buen Amor
          </h2>
          <p className="font-cormorant text-xl sm:text-2xl text-[#44403c] italic mt-3 leading-relaxed">
            {lang === 'es'
              ? 'Una fortaleza señorial del siglo XV en tierras salmantinas cargada de leyendas de amor, arcos de piedra y almenas iluminadas.'
              : 'A 15th-century Castilian fortress steeped in romantic legend, golden stone archways, and starlit battlements.'}
          </p>
          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-5" />
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-9">
          {filteredPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-[#fdfbf7] p-3.5 rounded-2xl border-2 border-[#b89243]/30 hover:border-[#b89243] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_45px_rgba(184,146,67,0.18)] transition-all duration-500 cursor-pointer overflow-hidden"
            >
              <div className="relative h-72 sm:h-84 overflow-hidden rounded-xl bg-[#271d1a]">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-xs text-[10px] uppercase tracking-wider font-semibold text-[#f5e3ba] border border-[#b89243]/40">
                  {photo.category}
                </div>

                <button
                  aria-label="Ampliar fotografía"
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-[#faf7f2]/95 text-[#5c141e] backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg scale-90 group-hover:scale-100"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-4 pb-2 text-center">
                <h4 className="font-playfair text-xl text-[#37080e] font-bold">
                  {photo.title}
                </h4>
                <p className="font-cormorant text-base text-[#6e675f] italic mt-1">
                  {photo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Wedding Venue Google Maps & Address */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 bg-[#fdfbf7] p-6 sm:p-9 rounded-2xl border-2 border-[#b89243]/50 shadow-md"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[rgba(92,20,30,0.12)] pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#5c141e] font-semibold text-xs uppercase tracking-widest mb-1.5">
                <MapPin className="w-4 h-4 text-[#b89243]" />
                <span>{lang === 'es' ? 'Ubicación del Enlace' : 'Wedding Location'}</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#37080e] font-bold">
                Castillo del Buen Amor
              </h3>
              <p className="font-sans text-sm text-[#554f47] mt-1 flex items-center gap-1.5">
                <span>Ctra. N-630, Km. 317, 37799 Topas, Salamanca</span>
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Castillo+del+Buen+Amor+Topas+Salamanca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5c141e] hover:bg-[#781927] text-[#fdfbf7] font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md self-start md:self-auto cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-[#e5cb8f]" />
              <span>{lang === 'es' ? 'Abrir en Google Maps' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </a>
          </div>

          {/* Interactive Google Maps Frame */}
          <div className="relative rounded-xl overflow-hidden border border-[#b89243]/30 shadow-inner bg-[#ece5d8]">
            <iframe
              title="Google Maps - Castillo del Buen Amor"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47952.128796853245!2d-5.6983056!3d41.1578129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd3f33ceef125fa9%3A0x6a2c3a595304b7ea!2sCastillo%20del%20Buen%20Amor!5e0!3m2!1ses!2ses!4v1710000000000!5m2!1ses!2ses"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-72 sm:h-96"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#6e675f] pt-3 border-t border-[rgba(92,20,30,0.06)]">
            <span>
              {lang === 'es'
                ? '✦ A solo 20 minutos de Salamanca capital por la A-66 (Km 314).'
                : '✦ Only 20 minutes from central Salamanca via A-66 (Km 314).'}
            </span>
            <span className="text-[#5c141e] font-semibold">
              {lang === 'es' ? 'Aparcamiento privado gratuito en el recinto' : 'Free private parking on castle grounds'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Cerrar vista completa"
              className="absolute top-5 right-5 p-2 text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-7 h-7" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Fotografía anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 text-white/90 hover:text-white bg-black/50 rounded-full hover:bg-[#5c141e] transition-colors cursor-pointer z-10 border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Fotografía siguiente"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 text-white/90 hover:text-white bg-black/50 rounded-full hover:bg-[#5c141e] transition-colors cursor-pointer z-10 border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl border-2 border-[#b89243]/50"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 text-center text-white">
                <h3 className="font-playfair text-2xl text-[#dfc285] font-semibold">
                  {selectedPhoto.title}
                </h3>
                <p className="font-cormorant text-lg text-white/85 italic mt-1">
                  {selectedPhoto.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
