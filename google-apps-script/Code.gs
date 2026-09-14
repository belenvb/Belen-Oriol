function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  return SpreadsheetApp.openById('1ZkdZ-3q2289dkcgSHXFNm_ts4RsasEMAfiXuvYPtJ_8');
}

const RSVP_TAB = 'Respuestas web';
const GUESTS_TAB = 'Detalle por invitado';
const INVITATIONS_TAB = 'Invitaciones';
const RSVP_FORM_VERSION = 'rsvp-per-guest-v2';

function doPost(e) {
  let lock;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonReply({ ok: false, error: 'Empty payload' });
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
        guests: invitation.guests,
      });
    }

    const text = (val, max = 1000) => {
      if (val == null) return '';
      return String(val).slice(0, max).trim();
    };

    const literal = value =>
      typeof value === 'string' && /^[=+@\-\t\r]/.test(value) ? "'" + value : value;

    const id = text(data.submissionId || Utilities.getUuid(), 80);
    const code = text(data.invitationCode, 80).toUpperCase();

    const invitation = findInvitation(code);
    const people = validatePeople(data, invitation);

    const attendingPeople = people.filter(person => person.attendance === 'yes');
    const anyAttending = attendingPeople.length > 0;

    const fridayCount = people.filter(person => person.attendingFriday).length;
    const saturdayCount = people.filter(person => person.attendingSaturday).length;

    const titularName = text(data.fullName || people[0].fullName, 200);
    const titularEmail = text(data.email || people[0].email, 254).toLowerCase();

    if (!titularEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(titularEmail)) {
      throw Error('Invalid contact email');
    }

    const attendance = anyAttending ? 'Sí' : 'No';

    const attendingDays =
      fridayCount && saturdayCount
        ? 'both'
        : fridayCount
        ? 'sept3_only'
        : saturdayCount
        ? 'sept4_only'
        : '';

    const shuttle = anyAttending && data.shuttleBooking === true ? 'Sí' : 'No';
    const room = anyAttending ? text(data.roomBooking || 'none', 50) : 'none';
    const song = anyAttending ? text(data.songRequest, 500) : '';
    const message = text(data.blessingMessage, 3000);

    const plusOneNames = people
      .slice(1)
      .map(person => {
        const days = dayLabel(person);
        return person.fullName + ' (' + (person.attendance === 'yes' ? days : 'No asiste') + ')';
      })
      .join(', ');

    const clientSubmittedAt = text(data.clientSubmittedAt || data.submittedAt, 80);

    const language = ['es', 'en'].includes(String(data.language || '').toLowerCase())
      ? String(data.language).toLowerCase()
      : invitation.language || '';

    const formVersion = text(data.formVersion || RSVP_FORM_VERSION, 80);

    lock = LockService.getScriptLock();
    lock.waitLock(15000);

    const book = getSpreadsheet();

    let sheet = book.getSheetByName(RSVP_TAB);

    if (!sheet) {
      sheet = book.insertSheet(RSVP_TAB);
      sheet.appendRow([
        'ID de envío',
        'Fecha de recepción',
        'Fecha cliente',
        'Idioma',
        'Versión formulario',
        'Código invitación',
        'Titular',
        'Email',
        'Asistencia',
        'Jornadas',
        'Total asistentes',
        'Asistentes viernes',
        'Asistentes sábado',
        'Nombres grupo',
        'Autobús',
        'Habitación solicitada',
        'Canción',
        'Mensaje',
      ]);

      sheet.setFrozenRows(1);
      sheet
        .getRange(1, 1, 1, 18)
        .setFontWeight('bold')
        .setBackground('#5c141e')
        .setFontColor('#ffffff');

      sheet.setColumnWidths(1, 18, 170);
      sheet.setColumnWidth(2, 180);
      sheet.setColumnWidth(3, 180);
      sheet.setColumnWidth(14, 320);
      sheet.setColumnWidth(18, 420);
    }

    const last = sheet.getLastRow();
    let alreadyExists = false;

    if (last > 1 && id) {
      const finder = sheet
        .getRange(2, 1, last - 1, 1)
        .createTextFinder(id)
        .matchEntireCell(true)
        .findNext();

      if (finder) alreadyExists = true;
    }

    if (!alreadyExists) {
      const row = [
        id,
        new Date(),
        clientSubmittedAt,
        language,
        formVersion,
        code,
        titularName,
        titularEmail,
        attendance,
        attendingDays,
        attendingPeople.length,
        fridayCount,
        saturdayCount,
        plusOneNames,
        shuttle,
        room,
        song,
        message,
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
      attendingGuests: attendingPeople.length,
      fridayCount,
      saturdayCount,
    });
  } catch (error) {
    console.error(error);

    return jsonReply({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    if (lock && lock.hasLock()) {
      try {
        lock.releaseLock();
      } catch (e) {}
    }
  }
}

function findInvitation(code) {
  const key = String(code || '').trim().toUpperCase();

  if (!key || !/^[A-Z0-9-]{3,80}$/.test(key)) {
    throw Error('Invalid invitation');
  }

  const book = getSpreadsheet();
  const sheet = book.getSheetByName(INVITATIONS_TAB);

  if (!sheet || sheet.getLastRow() < 2) {
    throw Error('Invitation table not found');
  }

  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, lastColumn).getValues();

  const idx = makeHeaderIndex(headers);

  const codeIndex = findColumn(idx, [
    'codigo privado',
    'código privado',
    'codigo',
    'código',
    'invitation code',
  ]);

  const maxGuestsIndex = findColumn(idx, [
    'maximo de personas',
    'máximo de personas',
    'maximo personas',
    'máximo personas',
    'max guests',
    'maxguests',
  ]);

  const nameIndex = findOptionalColumn(idx, [
    'titular / familia',
    'titular',
    'familia',
    'guest name',
    'name',
  ]);

  const fridayIndex = findOptionalColumn(idx, [
    'viernes 3',
    'invitada viernes 3',
    'preboda',
    'friday',
  ]);

  const saturdayIndex = findOptionalColumn(idx, [
    'sabado 4',
    'sábado 4',
    'invitada sabado 4',
    'invitada sábado 4',
    'boda',
    'wedding',
    'saturday',
  ]);

  const languageIndex = findOptionalColumn(idx, [
    'idioma',
    'language',
  ]);

  const activeIndex = findOptionalColumn(idx, [
    'activa',
    'activa si no',
    'activa sí no',
    'active',
  ]);

  const match = rows.find(row => {
    return String(row[codeIndex] || '').trim().toUpperCase() === key;
  });

  if (!match) {
    throw Error('Invalid invitation');
  }

  const holderName = nameIndex === -1 ? '' : String(match[nameIndex] || '').trim();
  const maxGuests = Number(match[maxGuestsIndex]);
  const active = activeIndex === -1 ? true : yesNo(match[activeIndex], true);

  const invitedToPreboda = fridayIndex === -1 ? true : yesNo(match[fridayIndex], true);
  const invitedToWedding = saturdayIndex === -1 ? true : yesNo(match[saturdayIndex], true);

  const language =
    languageIndex !== -1 && ['es', 'en'].includes(String(match[languageIndex] || '').trim().toLowerCase())
      ? String(match[languageIndex]).trim().toLowerCase()
      : 'es';

  if (!active) {
    throw Error('Inactive invitation');
  }

  if (!Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 20) {
    throw Error('Invalid guest limit');
  }

  if (!invitedToPreboda && !invitedToWedding) {
    throw Error('Invitation has no active events');
  }

  const guests = buildPrefilledGuests(idx, match, maxGuests, holderName);

  return {
    holderName,
    maxGuests,
    invitedToPreboda,
    invitedToWedding,
    language,
    guests,
  };
}

function buildPrefilledGuests(idx, row, maxGuests, holderName) {
  const guests = [];

  for (let i = 1; i <= maxGuests; i++) {
    const guestIndex = findOptionalColumn(idx, [
      `invitado ${i}`,
      `nombre invitado ${i}`,
      `guest ${i}`,
      `guest name ${i}`,
    ]);

    guests.push({
      fullName: guestIndex === -1 ? '' : String(row[guestIndex] || '').trim(),
      email: '',
    });
  }

  if (guests.length > 0 && !guests[0].fullName && holderName) {
    guests[0].fullName = holderName;
  }

  return guests;
}

function validatePeople(data, invitation) {
  if (!Array.isArray(data.guests) || data.guests.length < 1) {
    throw Error('Invalid guests');
  }

  if (data.guests.length > invitation.maxGuests) {
    throw Error('Too many guests for this invitation');
  }

  const people = data.guests.map(person => {
    const field = (key, max) => {
      if (person[key] == null) return '';
      if (typeof person[key] !== 'string' || person[key].length > max) {
        throw Error('Invalid guest');
      }
      return person[key].trim();
    };

    const fullName = field('fullName', 200);
    const email = field('email', 254);
    const allergiesNote = field('allergiesNote', 1000);
    const dietaryPreference = String(person.dietaryPreference || 'none');

    if (!fullName) {
      throw Error('Invalid guest name');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw Error('Invalid guest email');
    }

    if (!['none', 'vegetarian', 'vegan', 'celiac', 'other'].includes(dietaryPreference)) {
      throw Error('Invalid dietary preference');
    }

    const rawDays = person.attendingDays;
    const daysArray = Array.isArray(rawDays) ? rawDays : [];
    const legacyDays = typeof rawDays === 'string' ? rawDays : '';

    const attendingFriday =
      person.attendingFriday === true ||
      daysArray.includes('sept3') ||
      legacyDays === 'both' ||
      legacyDays === 'sept3_only';

    const attendingSaturday =
      person.attendingSaturday === true ||
      daysArray.includes('sept4') ||
      legacyDays === 'both' ||
      legacyDays === 'sept4_only';

    if (attendingFriday && !invitation.invitedToPreboda) {
      throw Error('Friday not allowed for this invitation');
    }

    if (attendingSaturday && !invitation.invitedToWedding) {
      throw Error('Wedding not allowed for this invitation');
    }

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

  return people;
}

function saveGuestDetails(book, id, code, titularEmail, people, literal) {
  let gSheet = book.getSheetByName(GUESTS_TAB);

  if (!gSheet) {
    gSheet = book.insertSheet(GUESTS_TAB);
    gSheet.appendRow([
      'ID envío',
      'ID persona',
      'Fecha',
      'Código',
      'Email titular',
      'Nombre invitado',
      'Email invitado',
      'Asistencia',
      'Viernes (Preboda)',
      'Sábado (Boda)',
      'Jornadas',
      'Menú',
      'Alergias',
    ]);

    gSheet.setFrozenRows(1);
    gSheet
      .getRange(1, 1, 1, 13)
      .setFontWeight('bold')
      .setBackground('#5c141e')
      .setFontColor('#ffffff');

    gSheet.setColumnWidths(1, 13, 180);
    gSheet.setColumnWidth(6, 240);
    gSheet.setColumnWidth(13, 320);
  }

  people.forEach((person, index) => {
    const personId = id + ':' + index;
    const last = gSheet.getLastRow();

    if (
      last > 1 &&
      gSheet
        .getRange(2, 2, last - 1, 1)
        .createTextFinder(personId)
        .matchEntireCell(true)
        .findNext()
    ) {
      return;
    }

    const days = dayLabel(person);

    gSheet.appendRow(
      [
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
      ].map(value => (typeof value === 'string' ? literal(value) : value))
    );
  });

  SpreadsheetApp.flush();
}

function dayLabel(person) {
  if (person.attendingFriday && person.attendingSaturday) return 'Viernes 3 + Sábado 4';
  if (person.attendingFriday) return 'Viernes 3';
  if (person.attendingSaturday) return 'Sábado 4';
  return '';
}

function makeHeaderIndex(headers) {
  const index = {};

  headers.forEach((header, i) => {
    const key = normalizeHeader(header);
    if (key) index[key] = i;
  });

  return index;
}

function findColumn(index, candidates) {
  const found = findOptionalColumn(index, candidates);

  if (found === -1) {
    throw Error('Missing required column: ' + candidates[0]);
  }

  return found;
}

function findOptionalColumn(index, candidates) {
  for (const candidate of candidates) {
    const key = normalizeHeader(candidate);
    if (Object.prototype.hasOwnProperty.call(index, key)) {
      return index[key];
    }
  }

  return -1;
}

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function yesNo(value, defaultValue) {
  const clean = String(value == null ? '' : value).trim().toLowerCase();

  if (!clean) return defaultValue;

  return ['sí', 'si', 'yes', 'y', 'true', '1'].includes(clean);
}

function jsonReply(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonReply({
    service: 'RSVP Wedding Belén & Oriol',
    status: 'ready',
    ok: true,
  });
}
