import type { Language } from '../types';
import type { RsvpPerson } from '../utils/rsvp';
export const emptyPerson = (): RsvpPerson => ({ fullName: '', email: '', attendance: 'yes', dietaryPreference: 'none', allergiesNote: '' });
export function RsvpGuests({ lang, guests, maxGuests, onChange }: { lang: Language; guests: RsvpPerson[]; maxGuests: number; onChange: (people: RsvpPerson[]) => void }) {
  const es = lang === 'es';
  const input = 'w-full mt-1 px-3 py-2.5 bg-white border border-[#5c141e]/25 rounded text-sm text-[#37080e]';
  const update = (index: number, patch: Partial<RsvpPerson>) => onChange(guests.map((person, i) => i === index ? { ...person, ...patch } : person));
  return <div className="space-y-6">
    <p className="text-sm text-[#5c141e]">{es ? `Tu invitación admite hasta ${maxGuests} personas, incluyéndote.` : `Your invitation allows up to ${maxGuests} people, including you.`}</p>
    {guests.map((person, index) => <fieldset key={index} className="border-t border-[#5c141e]/20 pt-4 space-y-4">
      <legend className="font-semibold text-[#5c141e] px-2">{index === 0 ? (es ? 'Titular de la invitación' : 'Invitation holder') : `${es ? 'Invitado' : 'Guest'} ${index + 1}`}</legend>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm">{es ? 'Nombre y apellidos *' : 'Full name *'}<input className={input} required maxLength={200} value={person.fullName} onChange={e => update(index, { fullName: e.target.value })} /></label>
        <label className="text-sm">{index === 0 ? (es ? 'Email del titular *' : 'Invitation holder email *') : (es ? 'Email (opcional)' : 'Email (optional)')}<input className={input} type="email" required={index === 0} maxLength={254} value={person.email} onChange={e => update(index, { email: e.target.value })} /></label>
      </div>
      <label className="block text-sm">{es ? 'Asistencia' : 'Attendance'}<select className={input} value={person.attendance} onChange={e => update(index, { attendance: e.target.value as 'yes' | 'no' })}><option value="yes">{es ? 'Sí, asistiré' : 'Yes, attending'}</option><option value="no">{es ? 'No podré asistir' : 'Unable to attend'}</option></select></label>
      {person.attendance === 'yes' && <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm">{es ? 'Menú' : 'Menu'}<select className={input} value={person.dietaryPreference} onChange={e => update(index, { dietaryPreference: e.target.value as RsvpPerson['dietaryPreference'] })}>
          <option value="none">{es ? 'Tradicional' : 'Traditional'}</option><option value="vegetarian">{es ? 'Vegetariano' : 'Vegetarian'}</option><option value="vegan">{es ? 'Vegano' : 'Vegan'}</option><option value="celiac">{es ? 'Sin gluten / celíaco' : 'Gluten-free / celiac'}</option><option value="other">{es ? 'Otro' : 'Other'}</option>
        </select></label>
        <label className="text-sm">{es ? 'Alergias e intolerancias' : 'Allergies and intolerances'}<textarea className={input} rows={2} maxLength={1000} value={person.allergiesNote} onChange={e => update(index, { allergiesNote: e.target.value })} placeholder={es ? 'Indica cuáles, o escribe «Ninguna»' : 'Specify, or write “None”'} /></label>
      </div>}
      {index > 0 && <button type="button" className="text-sm underline text-[#5c141e]" onClick={() => onChange(guests.filter((_, i) => i !== index))}>{es ? 'Quitar invitado' : 'Remove guest'}</button>}
    </fieldset>)}
    {guests.length < maxGuests && <button type="button" className="px-4 py-2 border border-[#5c141e] rounded text-[#5c141e] text-sm" onClick={() => onChange([...guests, emptyPerson()])}>{es ? 'Añadir invitado' : 'Add guest'}</button>}
    <p className="text-xs text-[#6e675f]">{es ? 'Estos datos se compartirán con Belén y Oriol para organizar la boda y los menús. Introduce los datos de tus acompañantes con su permiso.' : 'These details will be shared with Belén and Oriol to organise the wedding and meals. Enter your guests’ details with their permission.'}</p>
  </div>;
}
