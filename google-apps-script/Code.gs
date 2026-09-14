function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  // Fallback if not container-bound
  return SpreadsheetApp.openById('1ZkdZ-3q2289dkcgSHXFNm_ts4RsasEMAfiXuvYPtJ_8');
}

const RSVP_TAB = 'Respuestas web';
const GUESTS_TAB = 'Detalle por invitado';

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonReply({ ok: false, error: 'Empty payload' });
    }
    const data = JSON.parse(e.postData.contents);

    // Handle lookup action
    if (data.action === 'lookup') {
      return jsonReply({ ok: true, maxGuests: 2 });
    }

    const text = (val, max = 1000) => {
      if (val == null) return '';
      return String(val).slice(0, max).trim();
    };

    const id = text(data.submissionId || Utilities.getUuid(), 80);
    const code = text(data.invitationCode, 80);
    const titularName = text(data.fullName, 200);
    const titularEmail = text(data.email, 254);
    const attendance = data.attendance === 'yes' ? 'Sí' : 'No';
    const attendingDays = text(data.attendingDays, 50);
    const shuttle = data.shuttleBooking === true ? 'Sí' : 'No';
    const shuttleLocation = text(data.shuttlePickupLocation, 100);
    const room = text(data.roomBooking, 50);
    const song = text(data.songRequest, 500);
    const message = text(data.blessingMessage, 3000);
    const plusOnes = Number(data.plusOneCount) || 1;
    const plusOneNames = text(data.plusOneNames, 500);
    const dietary = text(data.dietaryPreference, 50);
    const allergies = text(data.allergiesNote, 1000);

    const literal = value => (typeof value === 'string' && /^[=+@\-\t\r]/.test(value)) ? "'" + value : value;

    lock = LockService.getScriptLock();
    lock.waitLock(15000);

    const book = getSpreadsheet();
    let sheet = book.getSheetByName(RSVP_TAB);
    if (!sheet) {
      sheet = book.insertSheet(RSVP_TAB);
      sheet.appendRow([
        'ID de envío', 'Fecha de recepción', 'Código invitación', 'Titular', 'Email', 
        'Asistencia', 'Jornadas', 'Total personas', 'Nombres grupo', 'Menú', 
        'Alergias', 'Autobús', 'Habitación solicitada', 'Canción', 'Mensaje'
      ]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
      sheet.setColumnWidths(1, 15, 170);
      sheet.setColumnWidth(2, 180);
    }

    // Check duplicate
    const last = sheet.getLastRow();
    let exists = false;
    if (last > 1 && id) {
      const finder = sheet.getRange(2, 1, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
      if (finder) exists = true;
    }

    if (!exists) {
      const row = [
        id, new Date(), code, titularName, titularEmail,
        attendance, attendingDays, plusOnes, plusOneNames, dietary,
        allergies, shuttle, room, song, message
      ];
      sheet.appendRow(row.map(literal));
      sheet.getRange(sheet.getLastRow(), 2).setNumberFormat('dd/MM/yyyy HH:mm:ss');
      SpreadsheetApp.flush();
    }

    // Save individual guests detail if provided
    if (Array.isArray(data.guests) && data.guests.length > 0) {
      let gSheet = book.getSheetByName(GUESTS_TAB);
      if (!gSheet) {
        gSheet = book.insertSheet(GUESTS_TAB);
        gSheet.appendRow([
          'ID envío', 'Fecha', 'Código', 'Email titular', 'Nombre invitado', 
          'Email invitado', 'Asistencia', 'Viernes (Preboda)', 'Sábado (Boda)', 'Menú', 'Alergias'
        ]);
        gSheet.setFrozenRows(1);
        gSheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
        gSheet.setColumnWidths(1, 11, 180);
      }

      data.guests.forEach((g) => {
        const gName = text(g.fullName, 200);
        if (!gName) return;
        const gEmail = text(g.email, 254);
        const gAtt = g.attendance === 'yes' ? 'Sí' : 'No';
        const gFri = g.attendingFriday ? 'Sí' : 'No';
        const gSat = g.attendingSaturday ? 'Sí' : 'No';
        const gDiet = text(g.dietaryPreference, 50);
        const gAllergies = text(g.allergiesNote, 1000);

        const gRow = [
          id, new Date(), code, titularEmail, gName,
          gEmail, gAtt, gFri, gSat, gDiet, gAllergies
        ];
        gSheet.appendRow(gRow.map(literal));
      });
      SpreadsheetApp.flush();
    }

    return jsonReply({ ok: true, submissionId: id });
  } catch (error) {
    return jsonReply({ ok: false, error: String(error) });
  } finally {
    if (lock && lock.hasLock()) {
      try { lock.releaseLock(); } catch(e) {}
    }
  }
}

function jsonReply(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonReply({ service: 'RSVP Wedding Belén & Oriol', status: 'ready', ok: true });
}
