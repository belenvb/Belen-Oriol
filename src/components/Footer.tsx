import { Monogram } from './Monogram';
import { Language } from '../types';
import { Heart } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
}

export function Footer({ lang, onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#241d1a] text-[#f4ede2] py-16 px-4 sm:px-6 lg:px-8 text-center relative border-t-2 border-[#b89243]/40">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Royal Monogram */}
        <div className="mb-4">
          <Monogram size={68} variant="white" className="opacity-90" />
        </div>

        {/* Names */}
        <h3 className="font-cinzel text-2xl sm:text-3xl text-white font-bold tracking-[0.1em] uppercase mb-2">
          Belén <span className="font-cormorant italic font-normal text-[#dfc285] lowercase text-xl mx-2">&amp;</span> Oriol
        </h3>

        <p className="font-cormorant text-lg text-[#dfc285] italic tracking-wider mb-6">
          El Castillo del Buen Amor · Salamanca · {lang === 'es' ? '3 & 4 de Septiembre de 2027' : 'September 3 & 4, 2027'}
        </p>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] tracking-[0.22em] uppercase text-white/70 mb-8">
          <button onClick={() => onNavigate('hero')} className="hover:text-[#dfc285] transition-colors cursor-pointer">
            {lang === 'es' ? 'Inicio' : 'Top'}
          </button>
          <button onClick={() => onNavigate('schedule')} className="hover:text-[#dfc285] transition-colors cursor-pointer">
            {lang === 'es' ? 'Programa' : 'Schedule'}
          </button>
          <button onClick={() => onNavigate('castle')} className="hover:text-[#dfc285] transition-colors cursor-pointer">
            {lang === 'es' ? 'El Castillo' : 'The Castle'}
          </button>
          <button onClick={() => onNavigate('journey')} className="hover:text-[#dfc285] transition-colors cursor-pointer">
            {lang === 'es' ? 'Viaje & Hoteles' : 'Travel/Hotels'}
          </button>
          <button onClick={() => onNavigate('registry')} className="hover:text-[#dfc285] transition-colors cursor-pointer">
            {lang === 'es' ? 'Lista de Bodas' : 'Registry'}
          </button>
          <button onClick={() => onNavigate('rsvp')} className="hover:text-[#dfc285] transition-colors cursor-pointer">
            RSVP
          </button>
        </div>

        <div className="w-12 h-[1px] bg-[#b89243]/40 mb-6" />

        <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 flex items-center justify-center gap-1.5">
          <span>{lang === 'es' ? 'Con todo nuestro amor para nuestra familia y amigos' : 'Crafted with endless love for our family and friends'}</span>
          <Heart className="w-3 h-3 text-[#dfc285] fill-[#dfc285]/40" />
        </p>
      </div>
    </footer>
  );
}
