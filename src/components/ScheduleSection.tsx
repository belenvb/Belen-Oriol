import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { GlassWater, Utensils, Sparkles, Bus, Music, Heart, Wine, Crown, PartyPopper, Coffee } from 'lucide-react';
import { scheduleData } from '../data/content';
import { Language } from '../types';
import { generateGoogleCalendarUrl } from '../utils/calendar';
import { HandDrawnBotanicalVine } from './BotanicalVine';

const eventIcons = { GlassWater, Utensils, Sparkles, Bus, Music, Heart, Wine, Crown, PartyPopper, Coffee };
interface ScheduleSectionProps {
  lang: Language;
  selectedDay: 'sept3' | 'sept4';
  onSelectDay: (day: 'sept3' | 'sept4') => void;
  hasPrebodaAccess?: boolean;
}

export function ScheduleSection({ lang, selectedDay, onSelectDay, hasPrebodaAccess = true }: ScheduleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);
  const day = scheduleData[lang][selectedDay];
  const es = lang === 'es';

  return (
    <section ref={sectionRef} id="schedule" className="weekend-section weekend-cinematic">
      <figure className="schedule-art">
        <motion.img
          src="/photos/wedding-illustration.webp"
          alt={es ? 'Ilustración de Belén y Oriol' : 'Illustration of Belén and Oriol'}
          loading="lazy"
          style={{ y: reducedMotion ? 0 : imageY, scale: reducedMotion ? 1 : 1.08 }}
        />
      </figure>
      <div className="schedule-content">
        <div className="weekend-heading">
          <p className="eyebrow">{es ? 'Programa' : 'Schedule'}</p>
          <h2>{es ? <>3 & 4 de<br /><em>septiembre.</em></> : <>September<br /><em>3 & 4.</em></>}</h2>
          <div className="day-tabs">
            {(['sept3', 'sept4'] as const).filter(d => d === 'sept4' || hasPrebodaAccess).map(d => (
              <button key={d} aria-pressed={selectedDay === d} onClick={() => onSelectDay(d)}>
                {d === 'sept3' ? '03' : '04'} <span>{es ? 'Septiembre' : 'September'}</span>
              </button>
            ))}
          </div>
          <p>{day.subtitle}</p>
          <p>{day.location}</p>
          <a className="editorial-link" target="_blank" rel="noreferrer" href={generateGoogleCalendarUrl(day.calEvent)}>
            {es ? 'Añadir al calendario' : 'Add to calendar'} ↗
          </a>
        </div>
        <ol className="event-list">
          {day.events.map((event, index) => {
            const Icon = eventIcons[event.iconName as keyof typeof eventIcons] || Sparkles;
            return (
              <li key={event.id}>
                {index > 0 && <div className="schedule-olive" aria-hidden="true"><HandDrawnBotanicalVine /></div>}
                <div className="schedule-event">
                  <span className="event-emblem" aria-hidden="true"><Icon size={26} strokeWidth={1.2} /></span>
                  <div>
                    <p className="eyebrow">{es ? ({ Afternoon: 'Tarde', Evening: 'Tarde / noche', Night: 'Noche' }[event.time] || event.time) : event.time}</p>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="weekend-details">
          <p><strong>{day.dressCode.title}</strong><br />{day.dressCode.description}</p>
          <p><strong>{day.shuttleInfo.title}</strong><br />{day.shuttleInfo.description}</p>
        </div>
      </div>
    </section>
  );
}
