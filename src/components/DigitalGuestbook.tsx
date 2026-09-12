import { useState, useEffect, type FormEvent } from 'react';
import { Heart, MessageSquare, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { GuestbookWish, Language } from '../types';

interface DigitalGuestbookProps {
  lang: Language;
}

const defaultWishes: Record<Language, GuestbookWish[]> = {
  es: [
    {
      id: 'gw-1',
      author: 'Familia Blázquez',
      city: 'Salamanca',
      message: '¡Qué orgullo veros dar este paso en una tierra tan querida! Os deseamos una vida llena de complicidad, risas y felicidad.',
      timestamp: 'Reciente',
    },
    {
      id: 'gw-2',
      author: 'Carlos & Marta',
      city: 'Barcelona',
      message: 'Contando ya los días para viajar a Salamanca. ¡Va a ser un fin de semana legendario en ese castillo!',
      timestamp: 'Reciente',
    },
    {
      id: 'gw-3',
      author: 'Los amigos del Pirineo',
      city: 'Girona',
      message: 'De la montaña al castillo medieval... ¡Felicidades pareja, os queremos infinito!',
      timestamp: 'Reciente',
    },
  ],
  en: [
    {
      id: 'gw-1',
      author: 'Blázquez Family',
      city: 'Salamanca',
      message: 'So proud and thrilled to see you unite your lives in such a magical castle. Endless joy to you both!',
      timestamp: 'Recent',
    },
    {
      id: 'gw-2',
      author: 'Carlos & Marta',
      city: 'Barcelona',
      message: 'Counting the days to journey from Barcelona to Salamanca. An unforgettable castle celebration awaits!',
      timestamp: 'Recent',
    },
    {
      id: 'gw-3',
      author: 'Friends from the Pyrenees',
      city: 'Girona',
      message: 'From mountain peaks to 15th-century castle towers... Congratulations Belén & Oriol!',
      timestamp: 'Recent',
    },
  ],
};

export function DigitalGuestbook({ lang }: DigitalGuestbookProps) {
  const [wishes, setWishes] = useState<GuestbookWish[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('belen_oriol_guestbook');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWishes([...parsed, ...defaultWishes[lang]]);
      } catch {
        setWishes(defaultWishes[lang]);
      }
    } else {
      setWishes(defaultWishes[lang]);
    }
  }, [lang]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish: GuestbookWish = {
      id: Date.now().toString(),
      author: name.trim(),
      city: city.trim() || undefined,
      message: message.trim(),
      timestamp: lang === 'es' ? 'Hace un momento' : 'Just now',
    };

    const userWishes = JSON.parse(localStorage.getItem('belen_oriol_guestbook') || '[]');
    userWishes.unshift(newWish);
    localStorage.setItem('belen_oriol_guestbook', JSON.stringify(userWishes));

    setWishes([newWish, ...wishes]);
    setName('');
    setCity('');
    setMessage('');
  };

  return (
    <section id="guestbook" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] relative border-t border-[rgba(92,20,30,0.12)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <span className="text-[11px] tracking-[0.32em] uppercase text-[#5c141e] font-semibold block mb-2">
            {lang === 'es' ? 'Palabras de Cariño' : 'Words of Love'}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl text-[#37080e] font-bold tracking-[0.03em] uppercase leading-tight">
            {lang === 'es' ? 'Libro de Firmas' : 'Guestbook of Wishes'}
          </h2>
          <p className="font-cormorant text-xl text-[#6e675f] italic mt-3">
            {lang === 'es'
              ? 'Deja un mensaje para el recuerdo que Belén y Oriol guardarán para siempre.'
              : 'Leave a wish for the couple that will be treasured in their keepsake journal.'}
          </p>
          <div className="w-16 h-[1.5px] bg-[#b89243] mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-5 bg-[#fdfbf7] p-6 sm:p-8 rounded-xl border border-[rgba(92,20,30,0.15)] shadow-xs">
            <h3 className="font-cinzel text-lg text-[#37080e] font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#b89243]" />
              <span>{lang === 'es' ? 'Dedicar unas Palabras' : 'Leave Your Wish'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-[#5c141e] mb-1">
                  {lang === 'es' ? 'Tu Nombre *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ej. Tía Carmen"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[rgba(92,20,30,0.2)] rounded focus:outline-none focus:border-[#5c141e]"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-[#5c141e] mb-1">
                  {lang === 'es' ? 'Ciudad o Procedencia' : 'Your City / Town'}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="ej. Salamanca / Barcelona"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[rgba(92,20,30,0.2)] rounded focus:outline-none focus:border-[#5c141e]"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider uppercase font-bold text-[#5c141e] mb-1">
                  {lang === 'es' ? 'Mensaje o Deseo *' : 'Your Wish *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === 'es'
                      ? 'Que la magia de este día os acompañe siempre en vuestro camino...'
                      : 'May this extraordinary celebration bring endless happiness to your shared life...'
                  }
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[rgba(92,20,30,0.2)] rounded focus:outline-none focus:border-[#5c141e]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded text-xs font-semibold tracking-wider uppercase bg-[#5c141e] text-white hover:bg-[#7a1d2b] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5 text-[#e5cb8f]" />
                <span>{lang === 'es' ? 'Publicar Mensaje' : 'Post Your Wish'}</span>
              </button>
            </form>
          </div>

          {/* Wishes List */}
          <div className="lg:col-span-7 space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {wishes.map((wish) => (
              <div
                key={wish.id}
                className="p-5 rounded-lg bg-[#fdfbf7] border border-[rgba(92,20,30,0.1)] shadow-xs relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-playfair text-base font-semibold text-[#37080e]">
                      {wish.author}
                    </span>
                    {wish.city && (
                      <span className="text-[10px] text-[#8c6d3b] tracking-wider uppercase font-medium">
                        · {wish.city}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8c6d3b]/80 italic">
                    {wish.timestamp}
                  </span>
                </div>

                <p className="font-cormorant text-base text-[#44403c] italic leading-relaxed">
                  "{wish.message}"
                </p>

                <div className="mt-2 text-right">
                  <Heart className="w-3 h-3 text-[#b89243] inline-block opacity-60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
