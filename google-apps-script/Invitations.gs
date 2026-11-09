// Optional bound-sheet administration helpers. These functions are not HTTP endpoints.
// They assume Code.gs defines RSVP_SPREADSHEET_ID/getSpreadsheet() and INVITATIONS_TAB.

function setupInvitations() {
  const book = getSpreadsheet();
  let sheet = book.getSheetByName(INVITATIONS_TAB);
  const isNew = !sheet;
  if (!sheet) sheet = book.insertSheet(INVITATIONS_TAB);

  // Only A:H are the core fields. Existing guest names/custom columns I:M are preserved.
  sheet.getRange('A1:H1').setValues([[
    'Titular / familia',
    'Email del titular',
    'Máximo de personas',
    'Código privado',
    'Viernes 3',
    'Sábado 4',
    'Idioma',
    'Activa (Sí / No)'
  ]]);
  sheet.getRange('A1:H1').setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff').setWrap(true);
  if (isNew) {
    sheet.getRange('I1:M1').setValues([['Texto invitación', 'Invitado 1', 'Invitado 2', 'Invitado 3', 'Invitado 4']]);
    sheet.getRange('I1:M1').setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff').setWrap(true);
  }
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 52);
  sheet.setColumnWidth(1, 240);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 180);
  sheet.setColumnWidth(4, 240);
  sheet.setColumnWidth(5, 130);
  sheet.setColumnWidth(6, 130);
  sheet.setColumnWidth(7, 100);
  sheet.setColumnWidth(8, 150);
  if (isNew) sheet.setColumnWidths(9, 5, 220);

  sheet.getRange('C2:C1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireNumberBetween(1, 20).setAllowInvalid(false).build()
  );
  sheet.getRange('D2:D1000').setNumberFormat('@');
  sheet.getRange('E2:F1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No'], true).setAllowInvalid(false).build()
  );
  sheet.getRange('G2:G1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['es', 'en'], true).setAllowInvalid(false).build()
  );
  sheet.getRange('H2:H1000').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No'], true).setAllowInvalid(false).build()
  );
}

function onEdit(e) {
  if (!e || e.range.getSheet().getName() !== INVITATIONS_TAB) return;
  if (e.range.getRow() < 2) return;

  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);

  try {
    const sheet = e.range.getSheet();
    const start = Math.max(2, e.range.getRow());
    const end = Math.min(sheet.getLastRow(), e.range.getLastRow());

    for (let row = start; row <= end; row++) {
      const lastCol = sheet.getLastColumn();
      const values = sheet.getRange(row, 1, 1, Math.max(lastCol, 8)).getValues()[0];
      const headers = sheet.getRange(1, 1, 1, Math.max(lastCol, 8)).getValues()[0].map(h => String(h || '').trim().toLowerCase());
      const firstGuestIndex = headers.indexOf('invitado 1');
      const name = String(values[0] || '').trim();
      const maxGuests = Number(values[2]);

      if (name && Number.isInteger(maxGuests) && maxGuests >= 1 && maxGuests <= 20) {
        if (!values[3]) sheet.getRange(row, 4).setValue(Utilities.getUuid().replace(/-/g, '').slice(0, 24).toUpperCase());
        if (!values[4]) sheet.getRange(row, 5).setValue('No'); // Friday is opt-in, not granted to every guest
        if (!values[5]) sheet.getRange(row, 6).setValue('Sí');
        if (!values[6]) sheet.getRange(row, 7).setValue('es');
        if (!values[7]) sheet.getRange(row, 8).setValue('Sí');
        if (firstGuestIndex >= 8 && !values[firstGuestIndex]) sheet.getRange(row, firstGuestIndex + 1).setValue(name);
      }
    }
  } finally {
    lock.releaseLock();
  }
}
