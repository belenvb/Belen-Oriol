// Bound-sheet administration. These functions are not HTTP endpoints.
function setupInvitations() {
  const book = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
  if (book.getSheetByName('Invitaciones')) return;
  const sheet = book.insertSheet('Invitaciones');
  sheet.getRange('A1:E1').setValues([['Titular / familia', 'Email del titular', 'Máximo de personas (incluye titular)', 'Código privado (automático)', 'Activa (Sí / No)']]);
  sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff').setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 48);
  sheet.setColumnWidth(1, 220); sheet.setColumnWidth(2, 280); sheet.setColumnWidth(3, 200); sheet.setColumnWidth(4, 280); sheet.setColumnWidth(5, 140);
  sheet.getRange('A2:C1000').setFontColor('#174ea6');
  sheet.getRange('C2:C1000').setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(1, 20).setAllowInvalid(false).build());
  sheet.getRange('D2:D1000').setNumberFormat('@');
  sheet.getRange('E2:E1000').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No'], true).setAllowInvalid(false).build());
  sheet.getRange('G1').setValue('Cómo rellenar').setFontWeight('bold');
  sheet.getRange('G2:G5').setValues([
    ['Una fila por invitación. Rellena titular, email y máximo total (1 a 20, contando al titular).'],
    ['El código se genera al completar esos tres campos. Compártelo en privado con esa familia. No se envían emails automáticamente.'],
    ['Los cambios de máximo o de estado se consultan al abrir y enviar el RSVP. No hay que volver a publicar la web.'],
    ['Para bloquear una invitación, cambia Activa a No. No cambies los títulos de las columnas.']
  ]).setWrap(true);
  sheet.setColumnWidth(7, 440); sheet.setRowHeights(2, 4, 65);
}

function onEdit(e) {
  if (!e || e.range.getSheet().getName() !== 'Invitaciones' || e.range.getColumn() > 5) return;
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    const sheet = e.range.getSheet();
    const start = Math.max(2, e.range.getRow());
    const end = Math.min(sheet.getLastRow(), e.range.getLastRow());
    for (let row = start; row <= end; row++) {
      const values = sheet.getRange(row, 1, 1, 5).getValues()[0];
      if (String(values[0]).trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values[1]).trim()) && Number.isInteger(Number(values[2])) && Number(values[2]) >= 1 && Number(values[2]) <= 20) {
        if (!values[3]) sheet.getRange(row, 4).setValue(Utilities.getUuid().replace(/-/g, '').slice(0, 24).toUpperCase());
        if (!values[4]) sheet.getRange(row, 5).setValue('Sí');
      }
    }
  } finally { lock.releaseLock(); }
}

function findInvitation(code) {
  const key = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!/^[A-Z0-9-]{16,80}$/.test(key)) throw Error('Invalid invitation');
  const sheet = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID).getSheetByName('Invitaciones');
  if (!sheet || sheet.getLastRow() < 2) throw Error('Invalid invitation');
  const matches = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues().filter(row => String(row[3]).trim().toUpperCase() === key);
  if (matches.length !== 1) throw Error('Invalid invitation');
  const row = matches[0];
  const maxGuests = Number(row[2]);
  if (!['sí', 'si'].includes(String(row[4]).trim().toLowerCase()) || !Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 20 || !String(row[0]).trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(row[1]).trim())) throw Error('Invalid invitation');
  // Never return names, emails, private codes or previous answers to callers.
  return { maxGuests, email: String(row[1]).trim().toLowerCase() };
}

function validatePeople(data, invitation) {
  if (String(data.email || '').trim().toLowerCase() !== invitation.email) throw Error('Invalid invitation');
  if (!Array.isArray(data.guests) || data.guests.length < 1 || data.guests.length > invitation.maxGuests) throw Error('Invalid guests');
  const people = data.guests.map(person => {
    const field = (key, max) => {
      if (typeof person[key] !== 'string' || person[key].length > max) throw Error('Invalid guest');
      return person[key].trim();
    };
    const fullName = field('fullName', 200), email = field('email', 254), allergiesNote = field('allergiesNote', 1000);
    if (!fullName || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) throw Error('Invalid guest');
    if (!['yes', 'no'].includes(person.attendance) || !['none', 'vegetarian', 'vegan', 'celiac', 'other'].includes(person.dietaryPreference)) throw Error('Invalid guest');
    return { fullName, email, attendance: person.attendance, dietaryPreference: person.attendance === 'yes' ? person.dietaryPreference : 'none', allergiesNote: person.attendance === 'yes' ? allergiesNote : '' };
  });
  if (people[0].fullName !== String(data.fullName).trim() || people[0].email.toLowerCase() !== invitation.email) throw Error('Invalid titular');
  const count = people.filter(person => person.attendance === 'yes').length;
  if (count !== data.plusOneCount || (count > 0 ? 'yes' : 'no') !== data.attendance) throw Error('Invalid count');
  return people;
}

function savePeople(book, id, email, people) {
  let sheet = book.getSheetByName('Respuestas por invitado');
  if (!sheet) {
    sheet = book.insertSheet('Respuestas por invitado');
    sheet.appendRow(['ID de persona / envío', 'Fecha', 'Email del titular', 'Nombre del invitado', 'Email del invitado', 'Asistencia', 'Menú', 'Alergias']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:H1').setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
    sheet.setColumnWidths(1, 8, 220);
  }
  const literal = value => /^[=+@\-\t\r]/.test(value) ? "'" + value : value;
  people.forEach((person, index) => {
    const key = id + ':' + index;
    const last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2, 1, last - 1, 1).createTextFinder(key).matchEntireCell(true).findNext()) return;
    sheet.appendRow([key, new Date(), email, person.fullName, person.email, person.attendance === 'yes' ? 'Sí' : 'No', person.dietaryPreference, person.allergiesNote].map(value => typeof value === 'string' ? literal(value) : value));
  });
}
