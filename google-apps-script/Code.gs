const RSVP_SPREADSHEET_ID = '1ZkdZ-3q2289dkcgSHXFNm_ts4RsasEMAfiXuvYPtJ_8';

const RSVP_TAB = 'Respuestas web';
const GUESTS_TAB = 'Detalle por invitado';
const RSVP_FORM_VERSION = 'rsvp-per-guest-v2';

function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
}

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonReply({ ok: false, error: 'EMPTY_PAYLOAD' });
    }

    const data = JSON.parse(e.postData.contents);

    if (data.action === 'lookup') {
      const invitation = findInvitation(data.invitationCode);
      return jsonReply({
        ok: true,
        maxGuests: invitation.maxGuests,
        invitedToPreboda: invitation.invitedToPreboda,
        invitedToWedding: invitation.invitedToWedding,
        language: invitation.language,
      });
    }

    const text = (val, max = 1000) => {
      if (val == null) return '';
      return String(val).slice(0, max).trim();
    };

    const literal = value => (typeof value === 'string' && /^[=+@\-\t\r]/.test(value)) ? "'" + value : value;
    const dayLabel = person => {
      if (person.attendingFriday && person.attendingSaturday) return 'Viernes 3 + Sábado 4';
      if (person.attendingFriday) return 'Viernes 3';
      if (person.attendingSaturday) return 'Sábado 4';
      return '';
    };

    const id = text(data.submissionId || Utilities.getUuid(), 80);
    const code = text(data.invitationCode, 80).toUpperCase();
    const invitation = findInvitation(code);
    const people = validatePeople(data, invitation);
    const attendingPeople = people.filter(person => person.attendance === 'yes');
    const anyAttending = attendingPeople.length > 0;
    const fridayCount = people.filter(person => person.attendingFriday).length;
    const saturdayCount = people.filter(person => person.attendingSaturday).length;

    const titularName = people[0].fullName;
    const titularEmail = people[0].email;
    const attendance = anyAttending ? 'Sí' : 'No';
    const attendingDays = fridayCount && saturdayCount ? 'both' : fridayCount ? 'sept3_only' : saturdayCount ? 'sept4_only' : '';
    const shuttle = anyAttending && data.shuttleBooking === true ? 'Sí' : 'No';
    const shuttleLocation = anyAttending && data.shuttleBooking === true ? text(data.shuttlePickupLocation, 100) : '';
    const room = anyAttending ? text(data.roomBooking || 'none', 50) : 'none';
    const song = anyAttending ? text(data.songRequest, 500) : '';
    const message = text(data.blessingMessage, 3000);
    const plusOneNames = people.slice(1).map(person => person.fullName + ' (' + (person.attendance === 'yes' ? dayLabel(person) : 'No asiste') + ')').join(', ');
    const clientSubmittedAt = text(data.submittedAt || data.clientSubmittedAt, 80);
    const language = ['es', 'en'].includes(String(data.language || '').toLowerCase()) ? String(data.language).toLowerCase() : '';
    const formVersion = text(data.formVersion || RSVP_FORM_VERSION, 80);

    lock = LockService.getScriptLock();
    lock.waitLock(15000);

    const book = getSpreadsheet();
    let sheet = book.getSheetByName(RSVP_TAB);
    if (!sheet) {
      sheet = book.insertSheet(RSVP_TAB);
      sheet.appendRow([
        'ID de envío', 'Fecha de recepción', 'Fecha cliente', 'Idioma', 'Versión formulario',
        'Código invitación', 'Titular', 'Email', 'Asistencia', 'Jornadas',
        'Total asistentes', 'Asistentes viernes', 'Asistentes sábado', 'Nombres grupo', 'Autobús',
        'Recogida autobús', 'Habitación solicitada', 'Canción', 'Mensaje'
      ]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 19).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
      sheet.setColumnWidths(1, 19, 170);
      sheet.setColumnWidth(2, 180);
      sheet.setColumnWidth(3, 180);
      sheet.setColumnWidth(14, 300);
      sheet.setColumnWidth(19, 420);
    }

    const last = sheet.getLastRow();
    let exists = false;
    if (last > 1 && id) {
      const finder = sheet.getRange(2, 1, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
      if (finder) exists = true;
    }

    if (!exists) {
      const row = [
        id, new Date(), clientSubmittedAt, language, formVersion,
        code, titularName, titularEmail, attendance, attendingDays,
        attendingPeople.length, fridayCount, saturdayCount, plusOneNames, shuttle,
        shuttleLocation, room, song, message
      ];
      sheet.appendRow(row.map(literal));
      sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('dd/MM/yyyy HH:mm:ss');
      SpreadsheetApp.flush();
    }

    saveGuestDetails(book, id, code, titularEmail, people, literal);

    return jsonReply({
      ok: true,
      submissionId: id,
      receivedAt: new Date().toISOString(),
      guestsReceived: people.length,
      fridayCount,
      saturdayCount,
    });
  } catch (error) {
    return jsonReply({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    if (lock && lock.hasLock()) {
      try { lock.releaseLock(); } catch (e) {}
    }
  }
}

function saveGuestDetails(book, id, code, titularEmail, people, literal) {
  let gSheet = book.getSheetByName(GUESTS_TAB);
  if (!gSheet) {
    gSheet = book.insertSheet(GUESTS_TAB);
    gSheet.appendRow([
      'ID envío', 'ID persona', 'Fecha', 'Código', 'Email titular', 'Nombre invitado',
      'Email invitado', 'Asistencia', 'Viernes (Preboda)', 'Sábado (Boda)', 'Jornadas', 'Menú', 'Alergias'
    ]);
    gSheet.setFrozenRows(1);
    gSheet.getRange(1, 1, 1, 13).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
    gSheet.setColumnWidths(1, 13, 180);
    gSheet.setColumnWidth(6, 240);
    gSheet.setColumnWidth(13, 320);
  }

  people.forEach((person, index) => {
    const personId = id + ':' + index;
    const last = gSheet.getLastRow();
    if (last > 1 && gSheet.getRange(2, 2, last - 1, 1).createTextFinder(personId).matchEntireCell(true).findNext()) return;

    const days = person.attendingFriday && person.attendingSaturday
      ? 'Viernes 3 + Sábado 4'
      : person.attendingFriday
      ? 'Viernes 3'
      : person.attendingSaturday
      ? 'Sábado 4'
      : '';

    gSheet.appendRow([
      id,
      personId,
      new Date(),
      code,
      titularEmail,
      person.fullName,
      person.email,
      person.attendance === 'yes' ? 'Sí' : 'No',
      person.attendingFriday ? 'Sí' : 'No',
      person.attendingSaturday ? 'Sí' : 'No',
      days,
      person.dietaryPreference,
      person.allergiesNote,
    ].map(value => typeof value === 'string' ? literal(value) : value));
  });

  SpreadsheetApp.flush();
}

function jsonReply(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonReply({ service: 'RSVP Wedding Belén & Oriol', status: 'ready', ok: true });
}
