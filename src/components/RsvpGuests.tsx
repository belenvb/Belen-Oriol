import './RsvpAttendance.css';
import { Check, Plus, Trash2, Utensils } from 'lucide-react';
import type { Language } from '../types';
import type { RsvpPerson } from '../utils/rsvp';

export const emptyPerson = (): RsvpPerson => ({
  fullName: '',
  email: '',
  attendance: 'yes',
  attendingFriday: true,
  attendingSaturday: true,
  attendingDays: 'both',
  dietaryPreference: 'none',
  allergiesNote: '',
});

interface RsvpGuestsProps {
  lang: Language;
  guests: RsvpPerson[];
  maxGuests: number;
  invitedToPreboda?: boolean;
  invitationText?: string;
  onChange: (people: RsvpPerson[]) => void;
}

export function RsvpGuests({
  lang,
  guests,
  maxGuests,
  invitedToPreboda = true,
  invitationText = '',
  onChange,
}: RsvpGuestsProps) {
  const es = lang === 'es';

  const update = (index: number, patch: Partial<RsvpPerson>) => {
    onChange(
      guests.map((person, i) => {
        if (i !== index) return person;
        const updated = { ...person, ...patch };

        // Keep attendingDays and attendance strictly in sync
        if ('attendingFriday' in patch || 'attendingSaturday' in patch) {
          const fri = updated.attendingFriday ?? false;
          const sat = updated.attendingSaturday ?? false;
          if (fri || sat) {
            updated.attendance = 'yes';
            if (fri && sat) updated.attendingDays = 'both';
            else if (fri) updated.attendingDays = 'sept3_only';
            else if (sat) updated.attendingDays = 'sept4_only';
          } else {
            updated.attendance = 'no';
            updated.attendingDays = undefined;
          }
        } else if (patch.attendance === 'no') {
          updated.attendingFriday = false;
          updated.attendingSaturday = false;
          updated.attendingDays = undefined;
        }

        return updated;
      })
    );
  };

  const handleToggleFriday = (index: number, currentPerson: RsvpPerson) => {
    const newFri = !(currentPerson.attendingFriday && currentPerson.attendance === 'yes');
    const newSat = currentPerson.attendance === 'yes' ? (currentPerson.attendingSaturday ?? false) : false;
    
    if (newFri || newSat) {
      update(index, {
        attendance: 'yes',
        attendingFriday: newFri,
        attendingSaturday: newSat,
      });
    } else {
      update(index, {
        attendance: 'no',
        attendingFriday: false,
        attendingSaturday: false,
      });
    }
  };

  const handleToggleSaturday = (index: number, currentPerson: RsvpPerson) => {
    const newFri = currentPerson.attendance === 'yes' ? (currentPerson.attendingFriday ?? false) : false;
    const newSat = !(currentPerson.attendingSaturday && currentPerson.attendance === 'yes');
    
    if (newFri || newSat) {
      update(index, {
        attendance: 'yes',
        attendingFriday: newFri,
        attendingSaturday: newSat,
      });
    } else {
      update(index, {
        attendance: 'no',
        attendingFriday: false,
        attendingSaturday: false,
      });
    }
  };

  const handleDecline = (index: number) => {
    update(index, {
      attendance: 'no',
      attendingFriday: false,
      attendingSaturday: false,
    });
  };

  const menuOptions: { id: RsvpPerson['dietaryPreference']; es: string; en: string }[] = [
    { id: 'none', es: 'Tradicional', en: 'Traditional' },
    { id: 'vegetarian', es: 'Vegetariano', en: 'Vegetarian' },
    { id: 'vegan', es: 'Vegano', en: 'Vegan' },
    { id: 'celiac', es: 'Sin gluten', en: 'Gluten-free' },
    { id: 'other', es: 'Otro', en: 'Other' },
  ];
  const invitationSummary = invitationText.trim()
    ? (es ? 'Tu invitación incluye a ' : 'Your invitation includes ') + invitationText.trim() + '.'
    : es ? `Tu invitación incluye hasta ${maxGuests} ${maxGuests === 1 ? 'persona' : 'personas'}, incluyendo titular.`
    : `Your invitation includes up to ${maxGuests} ${maxGuests === 1 ? 'guest' : 'guests'}, including the invitation holder.`;

  return <div className="rsvp-guests">
    <div className="rsvp-guests__summary"><span>{invitationSummary}</span><span>{guests.length} / {maxGuests}</span></div>
    <div className="rsvp-guests-grid">
      {guests.map((person,index) => {
        const isTitular=index===0;
        const isFriSelected=person.attendance==='yes' && Boolean(person.attendingFriday);
        const isSatSelected=person.attendance==='yes' && Boolean(person.attendingSaturday);
        const isDeclined=!isFriSelected && !isSatSelected;
        const name=person.fullName.trim() || (isTitular ? (es ? 'el titular' : 'the holder') : (es ? `el invitado ${index+1}` : `Guest ${index+1}`));
        return <section key={index} className="rsvp-guest-sheet" aria-label={es ? `Datos de ${name}` : `Details for ${name}`}>
          <header className="rsvp-guest-heading"><span className="rsvp-guest-number">{String(index+1).padStart(2,'0')}</span><div>
            <h4>{isTitular ? (es ? 'Titular de la invitación' : 'Invitation holder') : (es ? `Acompañante ${index+1}` : `Guest ${index+1}`)}</h4>
            {isTitular && <span>{es ? 'Contacto principal del grupo' : 'Primary party contact'}</span>}
          </div>{!isTitular && <button type="button" className="rsvp-remove-guest" onClick={()=>onChange(guests.filter((_,i)=>i!==index))}><Trash2 aria-hidden="true"/><span>{es ? 'Eliminar' : 'Remove'}</span></button>}</header>
          <div className="rsvp-person-fields">
            <label className="rsvp-field" htmlFor={`rsvp-name-${index}`}><span>{es ? 'Nombre y apellidos *' : 'Full name *'}</span>
              <input id={`rsvp-name-${index}`} autoComplete="name" required maxLength={200} placeholder={es ? 'Nombre y apellidos' : 'Full name'} value={person.fullName} onChange={e=>update(index,{fullName:e.target.value})}/></label>
            <label className="rsvp-field" htmlFor={`rsvp-email-${index}`}><span>{isTitular ? (es ? 'Email del titular *' : 'Holder email *') : (es ? 'Email (opcional)' : 'Email (optional)')}</span>
              <input id={`rsvp-email-${index}`} type="email" autoComplete="email" required={isTitular} maxLength={254} placeholder={es ? 'ejemplo@correo.com' : 'example@email.com'} value={person.email} onChange={e=>update(index,{email:e.target.value})}/></label>
          </div>
          <fieldset className="rsvp-attendance-soft"><legend>{es ? `¿Asistirá ${name}?` : `Will ${name} attend?`}</legend>
            <div className={`rsvp-attendance-soft__events ${!invitedToPreboda ? 'rsvp-attendance-soft__events--single' : ''}`}>
              {invitedToPreboda && <button type="button" aria-label={es ? 'Viernes 3 de septiembre · Preboda' : 'Friday September 3 · Welcome cocktail'} aria-pressed={isFriSelected} onClick={()=>handleToggleFriday(index,person)}>
                <span className="rsvp-attendance-soft__date" aria-hidden="true">03</span><span className="rsvp-attendance-soft__copy"><span className="rsvp-attendance-soft__day">{es ? 'Viernes · Septiembre' : 'Friday · September'}</span><span className="rsvp-attendance-soft__event">{es ? 'Preboda' : 'Welcome cocktail'}</span></span><span className="rsvp-attendance-soft__mark" aria-hidden="true">{isFriSelected && <Check/>}</span>
              </button>}
              <button type="button" aria-label={es ? 'Sábado 4 de septiembre · Boda' : 'Saturday September 4 · The wedding'} aria-pressed={isSatSelected} onClick={()=>handleToggleSaturday(index,person)}>
                <span className="rsvp-attendance-soft__date" aria-hidden="true">04</span><span className="rsvp-attendance-soft__copy"><span className="rsvp-attendance-soft__day">{es ? 'Sábado · Septiembre' : 'Saturday · September'}</span><span className="rsvp-attendance-soft__event">{es ? 'Boda' : 'The wedding'}</span></span><span className="rsvp-attendance-soft__mark" aria-hidden="true">{isSatSelected && <Check/>}</span>
              </button>
            </div>
            <button type="button" className="rsvp-attendance-soft__decline" aria-pressed={isDeclined} onClick={()=>handleDecline(index)}>{es ? 'No podré asistir' : 'I’m unable to attend'}</button>
          </fieldset>
          {!isDeclined ? <div className="rsvp-dietary">
            <fieldset className="rsvp-menu-fieldset"><legend><Utensils aria-hidden="true"/><span>{es ? `Preferencia de menú de ${name}` : `Menu preference for ${name}`}</span></legend>
              <div className="rsvp-menu-grid">{menuOptions.map(option=><button key={option.id} type="button" aria-pressed={person.dietaryPreference===option.id} onClick={()=>update(index,{dietaryPreference:option.id})}>{es ? option.es : option.en}</button>)}</div>
            </fieldset>
            <label className="rsvp-field" htmlFor={`rsvp-allergies-${index}`}><span>{es ? 'Alergias o intolerancias específicas' : 'Allergies & intolerances'}</span><input id={`rsvp-allergies-${index}`} type="text" maxLength={1000} value={person.allergiesNote} onChange={e=>update(index,{allergiesNote:e.target.value})} placeholder={es ? 'Indica cuáles o escribe «Ninguna»' : 'Please specify or write “None”'}/></label>
          </div> : <p className="rsvp-declined-note">{es ? 'Sentiremos mucho no contar con tu presencia, pero te tendremos muy presente.' : 'We will miss your presence dearly, but you will be with us in spirit.'}</p>}
        </section>;
      })}
    </div>
    {guests.length<maxGuests && <button type="button" className="rsvp-add-guest" onClick={()=>onChange([...guests,emptyPerson()])}><Plus aria-hidden="true"/>{es ? `Añadir acompañante (${guests.length+1} de ${maxGuests} plazas autorizadas)` : `Add guest (${guests.length+1} of ${maxGuests} allowed)`}</button>}
    <p className="rsvp-privacy">{es ? 'Estos datos se guardarán con la máxima confidencialidad para organizar las mesas, menús y traslados.' : 'Your details will be kept in strict confidence to arrange tables, menus and transport.'}</p>
  </div>;
}
