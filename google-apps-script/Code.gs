const RSVP_SPREADSHEET_ID = '1ZkdZ-3q2289dkcgSHXFNm_ts4RsasEMAfiXuvYPtJ_8';
const RSVP_TAB = 'Respuestas web';

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || e.postData.contents.length > 50000) throw Error('Invalid payload');
    const data = JSON.parse(e.postData.contents);
    const invitation = findInvitation(data.invitationCode);
    if (data.action === 'lookup') return jsonReply({ ok: true, maxGuests: invitation.maxGuests });
    const people = validatePeople(data, invitation);
    const text = (key, max = 1000) => {
      if (data[key] == null) return '';
      if (typeof data[key] !== 'string' || data[key].length > max) throw Error('Invalid field');
      return data[key].trim();
    };
    const id = text('submissionId', 80);
    if (!/^[a-zA-Z0-9-]{20,80}$/.test(id)) throw Error('Invalid ID');
    const name = text('fullName', 200);
    const email = text('email', 254);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Invalid contact');
    if (!['yes', 'no'].includes(data.attendance)) throw Error('Invalid attendance');
    const yes = data.attendance === 'yes';
    if (yes && (!Number.isInteger(data.plusOneCount) || data.plusOneCount < 1 || data.plusOneCount > invitation.maxGuests)) throw Error('Invalid guests');
    if (yes && !['both', 'sept3_only', 'sept4_only'].includes(data.attendingDays)) throw Error('Invalid days');
    if (!['none', 'estandar', 'superior', 'deluxe', 'suite_guardia', 'suite_medieval'].includes(data.roomBooking)) throw Error('Invalid room');
    if (!['none', 'vegetarian', 'vegan', 'celiac', 'other'].includes(data.dietaryPreference)) throw Error('Invalid menu');
    if (typeof data.shuttleBooking !== 'boolean') throw Error('Invalid shuttle');
    // Treat all guest text as literal text, never as spreadsheet formulas.
    const literal = value => /^[=+@\-\t\r]/.test(value) ? "'" + value : value;
    const row = [id, new Date(), name, email, yes ? 'Sí' : 'No', yes ? data.attendingDays : '',
      yes ? data.plusOneCount : 0, yes ? text('plusOneNames') : '', yes ? data.dietaryPreference : '',
      yes ? text('allergiesNote') : '', yes && data.shuttleBooking ? 'Sí' : 'No',
      yes && data.shuttleBooking ? text('shuttlePickupLocation') : '', yes ? data.roomBooking : 'none',
      yes ? text('songRequest', 500) : '', text('blessingMessage', 3000)];
    lock = LockService.getScriptLock();
    lock.waitLock(15000);
    const book = SpreadsheetApp.openById(RSVP_SPREADSHEET_ID);
    let sheet = book.getSheetByName(RSVP_TAB);
    if (!sheet) {
      sheet = book.insertSheet(RSVP_TAB);
      sheet.appendRow(['ID de envío', 'Fecha de recepción', 'Nombre', 'Email', 'Asistencia', 'Jornadas',
        'Total invitados', 'Acompañantes', 'Menú', 'Alergias', 'Autobús', 'Recogida', 'Habitación solicitada', 'Canción', 'Mensaje']);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
      sheet.setColumnWidths(1, 15, 170);
      sheet.setColumnWidth(2, 190);
    }
    // Repeating an uncertain request returns its receipt without duplicating the row.
    const last = sheet.getLastRow();
    const exists = last > 1 && sheet.getRange(2, 1, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
    if (!exists) {
      sheet.appendRow(row.map(value => typeof value === 'string' ? literal(value) : value));
      sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('dd/MM/yyyy HH:mm:ss');
      SpreadsheetApp.flush();
    }
    savePeople(book, id, email, people);
    SpreadsheetApp.flush();
    return jsonReply({ ok: true, submissionId: id });
  } catch (error) {
    return jsonReply({ ok: false, error: 'Unable to record response' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function jsonReply(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

// No response data is exposed by this endpoint.
function doGet() {
  return jsonReply({ service: 'RSVP', ok: true });
}
