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
    qEs: '¿Puedo llevar acompañante?',
    qEn: 'Can I bring a plus-one?',
    aEs: 'Los acompañantes están incluidos únicamente cuando figuran en la invitación. Puedes consultar el número de personas invitadas en tu invitación dentro del RSVP y confirmar allí quiénes asistirán.',
    aEn: 'Plus-ones are welcome when included in your invitation. You can check the number of invited guests in your invitation within the RSVP and confirm who will attend there.',
  },
  {
    qEs: '¿Cómo funciona el servicio de autobús para invitados entre Salamanca y el Castillo del Buen Amor?',
    qEn: 'How does the guest bus service between Salamanca and Castillo del Buen Amor work?',
    aEs: 'Para el sábado 4 (día de la boda), disponemos de un servicio de autobús sin coste para invitados con salida desde Salamanca hacia el Castillo del Buen Amor para la ceremonia, y de regreso durante la fiesta. Puedes reservar tu plaza al completar el RSVP.',
    aEn: 'For Saturday Sep 4 (the wedding day), complimentary guest bus transportation is provided from Salamanca to Castillo del Buen Amor for the ceremony, with return transport during the party. You can easily reserve your seat on the RSVP form.',
  },
  {
    qEs: '¿Cuál es el código de vestimenta para el Viernes 3 y el Sábado 4?',
    qEn: 'What is the dress code for Friday Sep 3 and Saturday Sep 4?',
    aEs: 'Para la preboda del Viernes 3 en Salamanca el dress code es Casual (ropa cómoda y relajada). Para la boda del Sábado 4 en el castillo el dress code es Cocktail o Black Tie (vestido de cóctel o largo para señoras, traje oscuro o esmoquin para caballeros).',
    aEn: 'For Friday Sep 3 in Salamanca, the dress code is Casual (comfortable and relaxed). For Saturday Sep 4 at the castle, the dress code is Cocktail or Black Tie (cocktail or evening gown for ladies, dark suit or tuxedo for gentlemen).',
  },
  {
    qEs: '¿Hay aparcamiento en El Castillo del Buen Amor?',
    qEn: 'Is there parking available at El Castillo del Buen Amor?',
    aEs: 'Sí, el recinto del castillo cuenta con un amplio aparcamiento privado gratuito para todos los invitados que prefieran acudir en su propio coche.',
    aEn: 'Yes, the castle provides ample private parking free of charge for all attending guests.',
  },
  {
    qEs: '¿Habrá menús especiales para celíacos, veganos o alérgicos?',
    qEn: 'Are special dietary menus catered for celiac, vegans, and allergies?',
    aEs: 'Absolutamente. El equipo de cocina del castillo adaptará cada plato con el máximo rigor para cualquier intolerancia, celiaquía o preferencia alimentaria. Por favor indícalo en el formulario de confirmación.',
    aEn: 'Absolutely. The castle culinary team caters dedicated menus for celiac (gluten-free), vegan, vegetarian, and all specific allergies. Please note your requirements in the RSVP.',
  },
  {
    qEs: '¿Cómo sé si estoy invitado a la preboda?',
    qEn: 'How do I know if I am invited to the pre-wedding gathering?',
    aEs: 'La pre-boda y bienvenida tendrá lugar el viernes 3 de septiembre en Salamanca. Por motivos de aforo, tiene una invitación separada que podrás consultar al abrir tu RSVP. Si está incluida en tu invitación, podrás confirmar allí tu asistencia.',
    aEn: 'The pre-wedding welcome gathering takes place on Friday, September 3 in Salamanca. Due to limited capacity, it has a separate invitation that you can view when you open your RSVP. If it is included in your invitation, you can confirm your attendance there.',
  },
  {
    qEs: '¿Puedo alojarme con mi mascota en el castillo?',
    qEn: 'Can I stay at the castle with my pet?',
    aEs: 'Algunas habitaciones Standard y Suites Paso de Guardia permiten mascotas. Si quieres alojarte con la tuya, contacta con nosotros para que podamos consultar la disponibilidad de una habitación adecuada.',
    aEn: 'Some Standard rooms and Paso de Guardia Suites welcome pets. If you would like to bring yours, please contact us so we can check availability for a suitable room.',
  },
  {
    qEs: '¿Pueden asistir niños a la boda?',
    qEn: 'Are children invited to the wedding?',
    aEs: 'Aunque adoramos a los más pequeños, hemos decidido que nuestra boda sea una celebración exclusivamente para adultos. Deseamos que todos los invitados podáis desconectar, brindar y disfrutar al máximo de la fiesta con nosotros.',
    aEn: 'Although we love little ones, our wedding celebration is strictly an adults-only event. We hope this allows all our guests to relax, let loose, and fully enjoy the party with us.',
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


