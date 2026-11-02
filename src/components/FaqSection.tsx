import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
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
    aEs: 'Tu invitación dentro del RSVP indicará el número de personas invitadas y si incluye acompañante.',
    aEn: 'Your RSVP invitation will indicate the number of people invited and whether it includes a plus-one.',
  },
  {
    qEs: '¿Habrá autobús entre Salamanca y el Castillo?',
    qEn: 'Will there be a shuttle between Salamanca and the Castle?',
    aEs: 'El sábado 4 (día de la boda), habrá un autobús para invitados con salida desde Salamanca hacia el Castillo del Buen Amor antes de la ceremonia, y de regreso después de la fiesta. Puedes reservar tu plaza al completar el RSVP.',
    aEn: 'On Saturday Sep 4, the wedding day, there will be a guest shuttle from Salamanca to Castillo del Buen Amor before the ceremony, and return service after the party. You can reserve your seat when completing the RSVP.',
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
    aEs: 'Sí, el recinto del castillo cuenta con un amplio aparcamiento gratuito para todos los invitados que prefieran acudir en su propio coche.',
    aEn: 'Yes, the castle grounds have ample free parking for all guests who prefer to drive.',
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
  return (
    <section id="faq" className="faq-editorial-section">
      <div className="faq-editorial-photo" aria-hidden="true">
        <img src="/photos/faq-salamanca-smooth-sky-hires.png" alt="" loading="lazy" />
</div>

      <div className="faq-editorial-content">
        <motion.header
          className="faq-editorial-header"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="faq-editorial-kicker">
            06 / {lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}
          </p>
          <h2>{lang === 'es' ? 'Dudas. Respuestas.' : 'Questions. Answers.'}</h2>
          <div className="faq-editorial-rule" />
          <p>
            {lang === 'es'
              ? 'Aquí encontrarás respuestas a las preguntas más comunes sobre el viaje, el alojamiento y todo lo relacionado con nuestra boda.'
              : 'Here you will find answers to the most common questions about travel, lodging, and everything related to our wedding.'}
          </p>
        </motion.header>

        <div className="faq-editorial-list">
          {faqs.map((faq, idx) => (
            <article className="faq-editorial-item" key={idx}>
              <div className="faq-editorial-question">
                <span className="faq-editorial-number">{String(idx + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{lang === 'es' ? faq.qEs : faq.qEn}</h3>
                  <p>{lang === 'es' ? faq.aEs : faq.aEn}</p>
                </div>
                <ChevronDown className="faq-editorial-chevron" aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
