import { Check, Plus, Trash2, Calendar, Utensils, X, Wine, Castle } from 'lucide-react';
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
  onChange: (people: RsvpPerson[]) => void;
}

export function RsvpGuests({
  lang,
  guests,
  maxGuests,
  invitedToPreboda = true,
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

  const menuOptions: { id: RsvpPerson['dietaryPreference']; labelEs: string; labelEn: string; icon: string }[] = [
    { id: 'none', labelEs: 'Tradicional', labelEn: 'Traditional', icon: '🍽️' },
    { id: 'vegetarian', labelEs: 'Vegetariano', labelEn: 'Vegetarian', icon: '🌱' },
    { id: 'vegan', labelEs: 'Vegano', labelEn: 'Vegan', icon: '🌿' },
    { id: 'celiac', labelEs: 'Sin Gluten / Celíaco', labelEn: 'Gluten-Free', icon: '🌾' },
    { id: 'other', labelEs: 'Otro menú especial', labelEn: 'Other Special', icon: '✨' },
  ];

  const prefilledNames = guests
    .map((guest) => guest.fullName.trim())
    .filter(Boolean);

  const formatNameList = (names: string[]) => {
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} ${es ? 'y' : 'and'} ${names[1]}`;

    return `${names.slice(0, -1).join(', ')} ${es ? 'y' : 'and'} ${names[names.length - 1]}`;
  };

  const invitationSummary = prefilledNames.length > 0
    ? es
      ? `Tu invitación incluye a ${formatNameList(prefilledNames)}.`
      : `Your invitation includes ${formatNameList(prefilledNames)}.`
    : es
    ? `Tu invitación incluye hasta ${maxGuests} ${maxGuests === 1 ? 'persona' : 'personas'}, incluyendo titular.`
    : `Your invitation includes up to ${maxGuests} ${maxGuests === 1 ? 'guest' : 'guests'}, including the invitation holder.`;

  return (
    <div className="space-y-7">
      {/* Maximum guests banner */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#f5efe3] border border-[#b89243]/40 text-[#371017]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b89243] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-[#371017]">
            {invitationSummary}
          </span>
        </div>
        <span className="text-xs font-mono text-[#5c141e] font-bold shrink-0 ml-2">
          {guests.length} / {maxGuests}
        </span>
      </div>

      {/* Guest Cards */}
      <div className="space-y-6">
        {guests.map((person, index) => {
          const isTitular = index === 0;
          const isAttending = person.attendance === 'yes';
          const isFriSelected = isAttending && (person.attendingFriday ?? false);
          const isSatSelected = isAttending && (person.attendingSaturday ?? false);
          const isDeclined = person.attendance === 'no' || (!isFriSelected && !isSatSelected);

          const guestDisplayName = person.fullName.trim() || (isTitular ? (es ? 'el titular' : 'the holder') : (es ? `el invitado ${index + 1}` : `Guest ${index + 1}`));

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-[#b89243]/30 p-5 sm:p-7 shadow-md relative transition-all"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#5c141e]/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#5c141e] text-white font-cinzel text-xs font-bold flex items-center justify-center shadow-xs shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#371017] uppercase tracking-wide">
                      {isTitular
                        ? es
                          ? 'Titular de la invitación'
                          : 'Invitation Holder'
                        : es
                        ? `Acompañante ${index + 1}`
                        : `Guest ${index + 1}`}
                    </h4>
                    {isTitular && (
                      <span className="text-[11px] text-[#6e675f] block font-sans">
                        {es ? 'Contacto principal del grupo' : 'Primary party contact'}
                      </span>
                    )}
                  </div>
                </div>

                {!isTitular && (
                  <button
                    type="button"
                    onClick={() => onChange(guests.filter((_, i) => i !== index))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{es ? 'Eliminar' : 'Remove'}</span>
                  </button>
                )}
              </div>

              {/* Name & Email Fields */}
              <div className="grid sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#371017] mb-1.5">
                    {es ? 'Nombre y apellidos *' : 'Full Name *'}
                  </label>
                  <input
                    required
                    maxLength={200}
                    placeholder={es ? 'Ej. María García López' : 'E.g. Jane Doe'}
                    value={person.fullName}
                    onChange={(e) => update(index, { fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#5c141e]/25 rounded-lg text-sm text-[#2c241e] placeholder:text-[#8c827a] focus:bg-white focus:outline-none focus:border-[#5c141e] focus:ring-1 focus:ring-[#5c141e] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#371017] mb-1.5">
                    {isTitular
                      ? es
                        ? 'Email del titular *'
                        : 'Holder Email *'
                      : es
                      ? 'Email (opcional)'
                      : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    required={isTitular}
                    maxLength={254}
                    placeholder={es ? 'ejemplo@correo.com' : 'example@email.com'}
                    value={person.email}
                    onChange={(e) => update(index, { email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#5c141e]/25 rounded-lg text-sm text-[#2c241e] placeholder:text-[#8c827a] focus:bg-white focus:outline-none focus:border-[#5c141e] focus:ring-1 focus:ring-[#5c141e] transition-all"
                  />
                </div>
              </div>

              {/* Dynamic 3-Option Attendance Choice: Friday / Saturday / Decline */}
              <div className="mb-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#371017] mb-2.5">
                  {es
                    ? `¿Asistirá ${guestDisplayName}? *`
                    : `Will ${guestDisplayName} attend? *`}
                </label>

                <div className={`grid gap-3 ${invitedToPreboda ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                  {/* Option 1: Friday Preboda */}
                  {invitedToPreboda && (
                    <div
                      onClick={() => handleToggleFriday(index, person)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                        isFriSelected
                          ? 'border-[#5c141e] bg-[#5c141e]/8 shadow-sm ring-1 ring-[#5c141e]/20'
                          : 'border-gray-200 bg-[#faf7f2] hover:border-[#b89243]/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#371017]">
                          <Wine className={`w-4 h-4 ${isFriSelected ? 'text-[#5c141e]' : 'text-[#8c6d4f]'}`} />
                          <span>{es ? 'Viernes 3' : 'Friday 3'}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isFriSelected ? 'bg-[#5c141e] border-[#5c141e] text-white' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isFriSelected && <Check className="w-3.5 h-3.5 text-[#dfc285]" />}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#5c141e] block leading-snug">
                          {es ? 'Preboda en Salamanca' : 'Welcome Cocktail'}
                        </span>
                        <span className="text-[11px] text-[#6e675f] block mt-0.5">
                          {es ? 'Salamanca' : 'Salamanca'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Option 2: Saturday Wedding Day */}
                  <div
                    onClick={() => handleToggleSaturday(index, person)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isSatSelected
                        ? 'border-[#5c141e] bg-[#5c141e]/8 shadow-sm ring-1 ring-[#5c141e]/20'
                        : 'border-gray-200 bg-[#faf7f2] hover:border-[#b89243]/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#371017]">
                        <Castle className={`w-4 h-4 ${isSatSelected ? 'text-[#5c141e]' : 'text-[#8c6d4f]'}`} />
                        <span>{es ? 'Sábado 4 Septiembre 2027' : 'Saturday 4 September 2027'}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isSatSelected ? 'bg-[#5c141e] border-[#5c141e] text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isSatSelected && <Check className="w-3.5 h-3.5 text-[#dfc285]" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#5c141e] block leading-snug">
                        {es ? 'Boda' : 'Wedding'}
                      </span>
                      <span className="text-[11px] text-[#6e675f] block mt-0.5">
                        {es ? 'Castillo del Buen Amor' : 'Castillo del Buen Amor'}
                      </span>
                    </div>
                  </div>

                  {/* Option 3: Decline / No podré asistir */}
                  <div
                    onClick={() => handleDecline(index)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isDeclined
                        ? 'border-[#371017] bg-[#371017]/8 shadow-sm ring-1 ring-[#371017]/20'
                        : 'border-gray-200 bg-[#faf7f2] hover:border-[#b89243]/60 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#371017]">
                        <X className={`w-4 h-4 ${isDeclined ? 'text-[#371017]' : 'text-gray-400'}`} />
                        <span>{es ? 'No podré asistir' : 'Unable to attend'}</span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isDeclined ? 'bg-[#371017] border-[#371017] text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {isDeclined && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#6e675f] block mt-0.5">
                        {es ? 'Gracias por avisarnos' : 'Thank you for letting us know'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attending Details: Menu Preferences & Allergies (Shown when attending any day) */}
              {!isDeclined && (
                <div className="space-y-4 pt-4 border-t border-[#5c141e]/15">
                  {/* Dietary Preference Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#371017] mb-1.5 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#b89243]" />
                      <span>{es ? `Preferencia de Menú de ${person.fullName.trim() || 'este invitado'}:` : 'Dietary Preference:'}</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-1.5">
                      {menuOptions.map((opt) => {
                        const isSelected = person.dietaryPreference === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => update(index, { dietaryPreference: opt.id })}
                            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer ${
                              isSelected
                                ? 'border-[#5c141e] bg-[#5c141e] text-white shadow-xs'
                                : 'border-gray-200 bg-[#faf7f2] text-[#371017] hover:border-[#b89243]/60 hover:bg-white'
                            }`}
                          >
                            <span className="text-base">{opt.icon}</span>
                            <span className="leading-tight text-[11.5px]">
                              {es ? opt.labelEs : opt.labelEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Allergies and Intolerances Note */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#371017] mb-1.5">
                      {es ? 'Alergias o Intolerancias Específicas' : 'Allergies & Intolerances'}
                    </label>
                    <input
                      type="text"
                      maxLength={1000}
                      value={person.allergiesNote}
                      onChange={(e) => update(index, { allergiesNote: e.target.value })}
                      placeholder={
                        es
                          ? 'Ej. Alergia a frutos secos, marisco, lactosa (o escribe "Ninguna")'
                          : 'E.g. Nut allergy, lactose, seafood (or write "None")'
                      }
                      className="w-full px-4 py-2.5 bg-[#faf7f2] border border-[#5c141e]/25 rounded-lg text-sm text-[#2c241e] placeholder:text-[#8c827a] focus:bg-white focus:outline-none focus:border-[#5c141e] transition-all"
                    />
                  </div>
                </div>
              )}

              {isDeclined && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-[#6e675f] italic">
                  {es
                    ? 'Sentiremos mucho no contar con tu presencia, pero te tendremos muy presente.'
                    : 'We will miss your presence dearly, but you will be with us in spirit.'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Companion Button */}
      {guests.length < maxGuests && (
        <button
          type="button"
          onClick={() => onChange([...guests, emptyPerson()])}
          className="w-full py-3.5 px-4 rounded-xl border-2 border-dashed border-[#b89243] bg-[#faf7f2] hover:bg-white text-[#5c141e] hover:border-[#5c141e] font-cinzel text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#b89243]" />
          <span>
            {es
              ? `Añadir acompañante (${guests.length + 1} de ${maxGuests} plazas autorizadas)`
              : `Add Guest (${guests.length + 1} of ${maxGuests} allowed)`}
          </span>
        </button>
      )}

      <p className="text-[11.5px] text-[#6e675f] italic text-center">
        {es
          ? 'Estos datos se guardarán con la máxima confidencialidad para organizar las mesas, menús y traslados.'
          : 'Your details will be kept in strict confidence to arrange tables, menus and transport.'}
      </p>
    </div>
  );
}
