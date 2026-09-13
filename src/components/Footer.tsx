import { Monogram } from './Monogram';
import { Language } from '../types';
import { Heart } from 'lucide-react';

interface FooterProps {
  lang: Language;
  onNavigate?: (sectionId: string) => void;
}

export function Footer({ lang }: FooterProps) {
  return (
    <footer className="bg-[#1f1917] text-[#f4ede2] py-6 px-4 text-center relative border-t border-[#b89243]/30">
      <div className="closing-photo"><img src="/photos/coast.webp" loading="lazy" alt={lang === 'es' ? 'Belén y Oriol junto al mar' : 'Belén and Oriol by the sea'} /><div><p className="eyebrow">04.09.2027</p><h2>{lang === 'es' ? 'Nos vemos en Salamanca.' : 'See you in Salamanca.'}</h2></div></div>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Compact Monogram */}
        <div className="mb-2">
          <Monogram size={28} variant="white" className="opacity-80" />
        </div>

        <p className="font-cormorant text-sm sm:text-base text-[#dfc285] italic tracking-wide mb-2">
          El Castillo del Buen Amor · Salamanca · {lang === 'es' ? '3 & 4 de Septiembre de 2027' : 'September 3 & 4, 2027'}
        </p>

        <p className="text-[9.5px] tracking-[0.2em] uppercase text-white/45 flex items-center justify-center gap-1.5">
          <span>{lang === 'es' ? 'Con todo nuestro amor para nuestra familia y amigos' : 'With all our love for our family and friends'}</span>
          <Heart className="w-2.5 h-2.5 text-[#dfc285] fill-[#dfc285]/40" />
        </p>
      </div>
    </footer>
  );
}


