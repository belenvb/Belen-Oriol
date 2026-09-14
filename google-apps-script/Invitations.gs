// Bound-sheet administration. These functions are not HTTP endpoints.
const INVITATIONS_TAB = 'Invitaciones';

function setupInvitations() {
  const book = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
  let sheet = book.getSheetByName(INVITATIONS_TAB);
  if (!sheet) sheet = book.insertSheet(INVITATIONS_TAB);

  sheet.getRange('A1:I1').setValues([[
    'Titular / familia',
    'Email del titular',
    'Máximo de personas (incluye titular)',
    'Código privado (automático)',
    'Activa (Sí / No)',
    'Invitada viernes 3 (Sí / No)',
    'Invitada sábado 4 (Sí / No)',
    'Idioma preferido (es / en)',
    'Notas internas'
  ]]);

  sheet.getRange('A1:I1').setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff').setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 52);
  sheet.setColumnWidth(1, 240);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 210);
  sheet.setColumnWidth(4, 280);
  sheet.setColumnWidth(5, 140);
  sheet.setColumnWidth(6, 180);
  sheet.setColumnWidth(7, 180);
  sheet.setColumnWidth(8, 160);
  sheet.setColumnWidth(9, 360);

  sheet.getRange('A2:C1000').setFontColor('#174ea6');
  sheet.getRange('C2:C1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberBetween(1, 20).setAllowInvalid(false).build()
  );
  sheet.getRange('D2:D1000').setNumberFormat('@');
  sheet.getRange('E2:G1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No'], true).setAllowInvalid(false).build()
  );
  sheet.getRange('H2:H1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['es', 'en'], true).setAllowInvalid(false).build()
  );

  sheet.getRange('K1').setValue('Cómo rellenar').setFontWeight('bold');
  sheet.getRange('K2:K6').setValues([
    ['Una fila por invitación. Rellena titular, email y máximo total (1 a 20, contando al titular).'],
    ['El código se genera al completar titular, email y máximo. Compártelo en privado con esa familia.'],
    ['Usa las columnas de viernes y sábado para controlar qué eventos puede confirmar cada invitación.'],
    ['Para bloquear una invitación, cambia Activa a No. No cambies los títulos de las columnas.'],
    ['Los cambios de máximo, días permitidos o estado se consultan al abrir y enviar el RSVP. No hay que volver a publicar la web.']
  ]).setWrap(true);
  sheet.setColumnWidth(11, 500);
  sheet.setRowHeights(2, 5, 65);
}

function onEdit(e) {
  if (!e || e.range.getSheet().getName() !== INVITATIONS_TAB || e.range.getColumn() > 9) return;
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = e.range.getSheet();
    const start = Math.max(2, e.range.getRow());
    const end = Math.min(sheet.getLastRow(), e.range.getLastRow());

    for (let row = start; row <= end; row++) {
      const values = sheet.getRange(row, 1, 1, 9).getValues()[0];
      const name = String(values[0]).trim();
      const email = String(values[1]).trim();
      const maxGuests = Number(values[2]);

      if (name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && Number.isInteger(maxGuests) && maxGuests >= 1 && maxGuests <= 20) {
        if (!values[3]) sheet.getRange(row, 4).setValue(Utilities.getUuid().replace(/-/g, '').slice(0, 24).toUpperCase());
        if (!values[4]) sheet.getRange(row, 5).setValue('Sí');
        if (!values[5]) sheet.getRange(row, 6).setValue('Sí');
        if (!values[6]) sheet.getRange(row, 7).setValue('Sí');
        if (!values[7]) sheet.getRange(row, 8).setValue('es');
      }
    }
  } finally {
    lock.releaseLock();
  }
}

function findInvitation(code) {
  const key = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!/^[A-Z0-9-]{4,80}$/.test(key)) throw Error('Invalid invitation');

  const sheet = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID).getSheetByName(INVITATIONS_TAB);
  if (!sheet || sheet.getLastRow() < 2) throw Error('Invalid invitation');

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getValues();
  const matches = rows.filter(row => String(row[3]).trim().toUpperCase() === key);
  if (matches.length !== 1) throw Error('Invalid invitation');

  const row = matches[0];
  const holderName = String(row[0]).trim();
  const holderEmail = String(row[1]).trim().toLowerCase();
  const maxGuests = Number(row[2]);
  const active = yesNo(row[4], true);
  const invitedToPreboda = yesNo(row[5], true);
  const invitedToWedding = yesNo(row[6], true);
  const language = ['es', 'en'].includes(String(row[7]).trim().toLowerCase()) ? String(row[7]).trim().toLowerCase() : 'es';

  if (!active || !Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 20) throw Error('Invalid invitation');
  if (!holderName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(holderEmail)) throw Error('Invalid invitation');
  if (!invitedToPreboda && !invitedToWedding) throw Error('Invalid invitation');

  // Do not expose private names, emails, or previous answers to the website during lookup.
  return { maxGuests, email: holderEmail, invitedToPreboda, invitedToWedding, language };
}

function validatePeople(data, invitation) {
  if (String(data.email || '').trim().toLowerCase() !== invitation.email) throw Error('Invalid invitation');
  if (!Array.isArray(data.guests) || data.guests.length < 1 || data.guests.length > invitation.maxGuests) throw Error('Invalid guests');

  const people = data.guests.map(person => {
    const field = (key, max) => {
      if (person[key] == null) return '';
      if (typeof person[key] !== 'string' || person[key].length > max) throw Error('Invalid guest');
      return person[key].trim();
    };

    const fullName = field('fullName', 200);
    const email = field('email', 254);
    const allergiesNote = field('allergiesNote', 1000);
    const dietaryPreference = String(person.dietaryPreference || 'none');

    if (!fullName || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw Error('Invalid guest');
    if (!['none', 'vegetarian', 'vegan', 'celiac', 'other'].includes(dietaryPreference)) throw Error('Invalid guest');

    const legacyDays = String(person.attendingDays || '');
    const attendingFriday = Boolean(person.attendingFriday) || legacyDays === 'both' || legacyDays === 'sept3_only';
    const attendingSaturday = Boolean(person.attendingSaturday) || legacyDays === 'both' || legacyDays === 'sept4_only';

    if (attendingFriday && !invitation.invitedToPreboda) throw Error('Friday not allowed');
    if (attendingSaturday && !invitation.invitedToWedding) throw Error('Wedding not allowed');

    const attendance = attendingFriday || attendingSaturday ? 'yes' : 'no';

    return {
      fullName,
      email,
      attendance,
      attendingFriday,
      attendingSaturday,
      dietaryPreference: attendance === 'yes' ? dietaryPreference : 'none',
      allergiesNote: attendance === 'yes' ? allergiesNote : '',
    };
  });

  if (people[0].email.toLowerCase() !== invitation.email) throw Error('Invalid titular');
  if (people[0].fullName !== String(data.fullName || '').trim()) throw Error('Invalid titular');

  const attendingCount = people.filter(person => person.attendance === 'yes').length;
  if (attendingCount !== Number(data.plusOneCount)) throw Error('Invalid count');
  if ((attendingCount > 0 ? 'yes' : 'no') !== String(data.attendance || '')) throw Error('Invalid count');

  return people;
}

function savePeople(book, id, email, people) {
  let sheet = book.getSheetByName('Respuestas por invitado');
  if (!sheet) {
    sheet = book.insertSheet('Respuestas por invitado');
    sheet.appendRow([
      'ID de persona / envío', 'Fecha', 'Email del titular', 'Nombre del invitado', 'Email del invitado',
      'Asistencia', 'Viernes (Preboda)', 'Sábado (Boda)', 'Menú', 'Alergias'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:J1').setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
    sheet.setColumnWidths(1, 10, 220);
  }

  const literal = value => /^[=+@\-\t\r]/.test(value) ? "'" + value : value;

  people.forEach((person, index) => {
    const key = id + ':' + index;
    const last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2, 1, last - 1, 1).createTextFinder(key).matchEntireCell(true).findNext()) return;
    sheet.appendRow([
      key,
      new Date(),
      email,
      person.fullName,
      person.email,
      person.attendance === 'yes' ? 'Sí' : 'No',
      person.attendingFriday ? 'Sí' : 'No',
      person.attendingSaturday ? 'Sí' : 'No',
      person.dietaryPreference,
      person.allergiesNote
    ].map(value => typeof value === 'string' ? literal(value) : value));
  });
}

function yesNo(value, defaultValue) {
  const clean = String(value == null ? '' : value).trim().toLowerCase();
  if (!clean) return defaultValue;
  return ['sí', 'si', 'yes', 'y', 'true', '1'].includes(clean);
}
