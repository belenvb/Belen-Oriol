import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface PhotoGalleryProps {
  lang: Language;
}

export function PhotoGallery({ lang }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const photos = [
    {
      id: 1,
      src: '/couple-sunset.jpg',
      fallback: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      captionEs: 'Atardecer juntos',
      captionEn: 'Sunset together',
      location: 'Barcelona',
    },
    {
      id: 2,
      src: '/rainbow-iceland.jpg',
      fallback: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85',
      captionEs: 'Aventura en Islandia bajo el arcoíris',
      captionEn: 'Iceland adventure beneath the rainbow',
      location: 'Iceland',
    },
    {
      id: 3,
      src: '/couple-watercolor.jpg',
      fallback: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
      captionEs: 'Retrato artístico de nuestro amor',
      captionEn: 'Artistic portrait of our love',
      location: 'Belén & Oriol',
    },
    {
      id: 4,
      src: '/invitation-reference.jpg',
      fallback: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
      captionEs: 'El Castillo del Buen Amor',
      captionEn: 'Castillo del Buen Amor',
      location: 'Salamanca',
    },
  ];

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const handlePrev = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + photos.length) % photos.length);
    }
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#b89243]/30 bg-[#b89243]/10 text-[#5c141e] text-[10px] sm:text-xs tracking-[0.3em] font-semibold uppercase mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#b89243]" />
            <span>{lang === 'es' ? 'Nuestra Historia' : 'Our Story'}</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'Momentos Inolvidables' : 'Unforgettable Moments'}
          </h2>
          <p className="font-cormorant text-xl sm:text-2xl text-[#44403c] italic mt-3 leading-relaxed">
            {lang === 'es'
              ? 'Un recorrido por los viajes y recuerdos que nos han traído hasta este gran día'
              : 'A glimpse into the journeys and memories that brought us to this special day'}
          </p>
          <div className="w-20 h-[1.5px] bg-[#b89243] mx-auto mt-5" />
        </motion.div>

        {/* Masonry / Grid of Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedImage(index)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#e5cb8f]/20 border-2 border-[#dfc285]/60 shadow-[0_10px_30px_rgba(45,30,15,0.08)] aspect-4/5"
            >
              <img
                src={photo.src}
                alt={lang === 'es' ? photo.captionEs : photo.captionEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== photo.fallback) {
                    target.src = photo.fallback;
                  }
                }}
              />
              {/* Elegant overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#37080e]/90 via-[#37080e]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#dfc285] mb-1">
                  {photo.location}
                </span>
                <p className="font-cinzel text-xs font-bold leading-snug">
                  {lang === 'es' ? photo.captionEs : photo.captionEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 z-10 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 cursor-pointer z-10 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2 cursor-pointer z-10 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border-2 border-[#dfc285]/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={photos[selectedImage].src}
                alt={lang === 'es' ? photos[selectedImage].captionEs : photos[selectedImage].captionEn}
                className="w-full h-auto max-h-[80vh] object-contain"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== photos[selectedImage].fallback) {
                    target.src = photos[selectedImage].fallback;
                  }
                }}
              />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white text-center">
                <span className="text-xs uppercase font-mono tracking-widest text-[#dfc285] block mb-1">
                  {photos[selectedImage].location}
                </span>
                <p className="font-cinzel text-sm sm:text-base font-bold">
                  {lang === 'es' ? photos[selectedImage].captionEs : photos[selectedImage].captionEn}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
