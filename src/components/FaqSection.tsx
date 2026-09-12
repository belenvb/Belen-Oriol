import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface FaqSectionProps {
  lang: Language;
}

interface FaqItem {
  qEs: string;
  qEn: string;
  aEs: string;
  aEn: string;
}

const faqs: FaqItem[] = [
  {
    qEs: '¿Cómo funciona el servicio de autobuses lanzadera desde Salamanca?',
    qEn: 'How does the guest shuttle service from Salamanca work?',
    aEs: 'Disponemos de autobuses privados tanto el Viernes 3 (18:45h) como el Sábado 4 (16:45h) con salida desde la Plaza de España de Salamanca. Habrá varios turnos de regreso durante la noche y madrugada. Puedes reservar tu plaza al completar el RSVP.',
    aEn: 'Private shuttles depart from Plaza de España in Salamanca on Friday Sep 3 (18:45) and Saturday Sep 4 (16:45). Multiple return trips run throughout the night. Simply reserve your seats in the RSVP form.',
  },
  {
    qEs: '¿Cuál es el código de vestimenta para el Viernes 3 y el Sábado 4?',
    qEn: 'What is the dress code for Friday Sep 3 and Saturday Sep 4?',
    aEs: 'Para la víspera del Viernes 3 el estilo es "Cocktail Chic / Elegante Relajado" (lino, trajes claros, vestidos de cóctel). Para el Sábado 4 es "Formal Elegante / Black Tie Optional" (traje oscuro o chaqué para caballeros, vestido largo o cóctel para señoras).',
    aEn: 'Friday Sep 3 is "Cocktail Chic / Effortless Elegance" (linens, warm palettes, relaxed tailoring). Saturday Sep 4 is "Formal Elegance / Black Tie Optional" (dark suit or tuxedo for gentlemen, floor-length or elevated cocktail gowns for ladies).',
  },
  {
    qEs: '¿Hay aparcamiento en El Castillo del Buen Amor?',
    qEn: 'Is there parking available at El Castillo del Buen Amor?',
    aEs: 'Sí, el recinto del castillo cuenta con un amplio aparcamiento privado gratuito vigilado para todos los invitados que prefieran acudir en su propio vehículo.',
    aEn: 'Yes, the castle provides ample secure private parking free of charge for all attending guests.',
  },
  {
    qEs: '¿Se contemplan menús especiales para celíacos, veganos o alérgicos?',
    qEn: 'Are special dietary menus catered for celiac, vegans, and allergies?',
    aEs: 'Absolutamente. El equipo de cocina del castillo adaptará cada plato con el máximo rigor para cualquier intolerancia, celiaquía o preferencia alimentaria. Por favor indícalo en el formulario de confirmación.',
    aEn: 'Absolutely. The castle culinary team caters dedicated menus for celiac (gluten-free), vegan, vegetarian, and all specific allergies. Please note your requirements in the RSVP.',
  },
];

export function FaqSection({ lang }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#f5efe4] relative border-t border-[rgba(92,20,30,0.12)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#5c141e] font-semibold block mb-2">
            {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl text-[#37080e] font-bold tracking-[0.03em] uppercase">
            {lang === 'es' ? 'Información para Invitados' : 'Guest Information'}
          </h2>
          <div className="w-16 h-[1.5px] bg-[#b89243] mx-auto mt-4" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#fdfbf7] rounded-lg border border-[rgba(92,20,30,0.12)] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-playfair text-base sm:text-lg text-[#37080e] font-semibold">
                    {lang === 'es' ? faq.qEs : faq.qEn}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#b89243] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#44403c] font-cormorant text-base sm:text-lg italic leading-relaxed border-t border-[rgba(92,20,30,0.06)]">
                    {lang === 'es' ? faq.aEs : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
