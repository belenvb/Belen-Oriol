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
const ROOMS_TAB = 'Habitaciones';
const RSVP_FORM_VERSION = 'rsvp-per-guest-v3-rooms';

const ROOM_CONFIG = [
  { id: 'estandar', label: 'Habitación Estándar', total: 9 },
  { id: 'superior', label: 'Habitación Superior', total: 8 },
  { id: 'deluxe', label: 'Habitación Deluxe', total: 13 },
  { id: 'suite_guardia', label: 'Suite Paso de Guardia', total: 3 },
  { id: 'suite_medieval', label: 'Suite Medieval', total: 3 },
  { id: 'suite_torreon', label: 'Suite con Torreón', total: 2 },
];

let rsvpSnapshot = null;

// Configure these values privately in Apps Script > Project Settings > Script Properties.
// They must never be hard-coded in website files or committed to GitHub.
function privateWeddingPaymentDetails_() {
  const p = PropertiesService.getScriptProperties();
  const value = (key) => String(p.getProperty(key) || '').trim().slice(0, 200);
  return {
    usBank: value('WEDDING_US_BANK'),
    usHolder: value('WEDDING_US_HOLDER'),
    usAccount: value('WEDDING_US_ACCOUNT'),
    usRouting: value('WEDDING_US_ROUTING'),
    esHolder: value('WEDDING_ES_HOLDER'),
    esIban: value('WEDDING_ES_IBAN'),
    esBic: value('WEDDING_ES_BIC'),
    bizum: value('WEDDING_BIZUM'),
    venmo: value('WEDDING_VENMO'),
    venmoQrDataUrl: privateWeddingPaymentQrDataUrl_(p.getProperty('WEDDING_VENMO_QR_FILE_ID')),

    zelle: value('WEDDING_ZELLE'),
    // The private payment QR is read from a non-public Drive file only after guest access validation.
    zelleQrDataUrl: privateWeddingPaymentQrDataUrl_(p.getProperty('WEDDING_ZELLE_QR_FILE_ID')),

  };
}


// Keep diagnostics separate from guest replies: never return Drive IDs or raw errors.
function readPrivateWeddingPaymentQr_(fileId) {
  const id = String(fileId || '').trim();
  if (!id) return { status: 'not_configured', dataUrl: '' };
  if (!/^[a-zA-Z0-9_-]{10,120}$/.test(id)) return { status: 'invalid_file_id', dataUrl: '' };
  try {
    const file = DriveApp.getFileById(id);
    if (file.getSize() > 600000) return { status: 'too_large', dataUrl: '' };
    const blob = file.getBlob();
    const mime = String(blob.getContentType() || '').toLowerCase();
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(mime)) {
      return { status: 'unsupported_type', dataUrl: '' };
    }
    const bytes = blob.getBytes();
    if (!bytes.length) return { status: 'empty_file', dataUrl: '' };
    if (bytes.length > 600000) return { status: 'too_large', dataUrl: '' };
    return { status: 'ready', dataUrl: 'data:' + mime + ';base64,' + Utilities.base64Encode(bytes) };
  } catch (error) {
    return { status: 'unreadable_or_unauthorized', dataUrl: '' };
  }
}

function privateWeddingPaymentQrDataUrl_(fileId) {
  return readPrivateWeddingPaymentQr_(fileId).dataUrl;
}

// Run manually in the Apps Script editor as the deploying organizer to authorize
// Drive and check configuration. Not exposed by doGet/doPost; no guest data logged.
function checkWeddingPaymentQrConfiguration() {
  const p = PropertiesService.getScriptProperties();
  const result = {};
  ['ZELLE', 'VENMO'].forEach(method => {
    result[method.toLowerCase()] = readPrivateWeddingPaymentQr_(
      p.getProperty('WEDDING_' + method + '_QR_FILE_ID')
    ).status;
  });
  console.log(JSON.stringify(result));
  return result;
}


// Gift-only lookup, independent of RSVP. Name/email are convenience access,
// NOT authentication. Do not expose guest lists, personal codes or RSVP responses.
function normalizeGiftGuestName_(value) {
  return String(value || '').trim().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .replace(/['-]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function checkGiftAccessRate_() {
  // Coarse global throttle. Apps Script does not give reliable visitor IPs.
  const cache = CacheService.getScriptCache();
  const key = 'wedding_gift_access_' + Math.floor(Date.now() / 60000);
  const hits = Number(cache.get(key) || '0');
  if (hits >= 60) throw Error('Unable to verify guest');
  cache.put(key, String(hits + 1), 75);
}

function findGiftDetailsByGuestInput_(rawInput) {
  checkGiftAccessRate_();
  const input = String(rawInput == null ? '' : rawInput).trim();
  if (input.length < 3 || input.length > 254) throw Error('Unable to verify guest');
  const upper = input.toUpperCase();

  // Accept either existing long private codes or the 6-character short code.
  if (/^[A-Z0-9-]{16,80}$/.test(upper) || /^[A-HJ-NP-Z2-9]{6}$/.test(upper)) {
    findInvitation(upper); // Checks that the invitation exists and is active.
    return privateWeddingPaymentDetails_();
  }

  const isEmail = input.includes('@');
  const normalizedEmail = input.toLowerCase();
  if (isEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) || input.length > 254)) {
    throw Error('Unable to verify guest');
  }

  // A submitted "Nombre Apellidos" checks only the first given name,
  // because the sheet may not include surnames. No suggestions/autocomplete.
  const normalizedName = normalizeGiftGuestName_(input);
  const parts = normalizedName.split(' ').filter(Boolean);
  if (!isEmail && (input.length > 120 || parts.length < 2)) {
    throw Error('Unable to verify guest');
  }
  const firstName = parts[0];
  const familyLabel = /^(familia|padres|madres|hermanos|hermanas|amigos|primos|tios|tias|sr|sra)$/;

  const sheet = getSpreadsheet().getSheetByName(INVITATIONS_TAB);
  if (!sheet || sheet.getLastRow() < 2) throw Error('Unable to verify guest');
  const values = sheet.getDataRange().getValues();
  const idx = makeHeaderIndex(values[0]);
  const activeCol = findOptionalColumn(idx, ['activa','activa si no','activa sí no','active']);
  const emailCol = findOptionalColumn(idx, ['email','e-mail','correo electronico','correo electrónico','email invitado']);
  const holderCol = findOptionalColumn(idx, ['titular / familia','titular','familia','guest name','name']);
  const guestCols = [];
  for (let n = 1; n <= 20; n++) {
    const col = findOptionalColumn(idx, ['invitado ' + n, 'nombre invitado ' + n, 'guest ' + n, 'guest name ' + n]);
    if (col >= 0 && !guestCols.includes(col)) guestCols.push(col);
  }

  const allowed = values.slice(1).some(row => {
    if (activeCol >= 0 && !yesNo(row[activeCol], true)) return false;
    if (isEmail) {
      // The Invitations sheet always stores the invitation email in column B.
      const invitationEmail = String(row[emailCol >= 0 ? emailCol : 1] || '').trim().toLowerCase();
      return invitationEmail !== '' && invitationEmail === normalizedEmail;
    }
    const names = guestCols.map(col => normalizeGiftGuestName_(row[col]));
    if (holderCol >= 0) names.push(normalizeGiftGuestName_(row[holderCol]));
    return names.some(name => {
      const first = name.split(' ')[0];
      return first && !familyLabel.test(first) && first === firstName;
    });
  });
  if (!allowed) throw Error('Unable to verify guest');
  return privateWeddingPaymentDetails_();
}

function doPost(e) {
  rsvpSnapshot = null;
  const startedAt = Date.now();
  let lock;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonReply({ ok: false, error: 'Empty payload' });
    }

    const data = JSON.parse(e.postData.contents);

    // Gift-only access: validates name, email or code without returning RSVP data.
    if (data.action === 'giftAccess') {
      return jsonReply({ ok: true, giftDetails: findGiftDetailsByGuestInput_(data.guestInput) });
    }

    // Public room catalogue: exposes ONLY category, price, and availability,
    // never invitation names, RSVP replies, or private access codes.
    if (data.action === 'rooms') {
      return jsonReply({ ok: true, roomAvailability: getRoomAvailability(getSpreadsheet()) });
    }

    if (data.action === 'lookup') {
      const invitation = findInvitation(data.invitationCode);
      const book = getSpreadsheet();

      const previous = getPreviousRsvp(book, invitation.invitationCode || data.invitationCode);
      return jsonReply({
        previousRsvp: previous,
        ok: true,
        maxGuests: invitation.maxGuests,
        holderName: invitation.holderName,
        invitedToPreboda: invitation.invitedToPreboda,
        invitedToWedding: invitation.invitedToWedding,
        language: invitation.language,
        guests: invitation.guests,
        invitationText: invitation.invitationText,
        // Only sent after findInvitation has validated an active private code.
        giftDetails: privateWeddingPaymentDetails_(),
        roomAvailability: getRoomAvailability(book, previous && previous.submissionId),
      });
    }

    const text = (val, max = 1000) => {
      if (val == null) return '';
      return String(val).slice(0, max).trim();
    };

    const literal = value =>
      typeof value === 'string' && /^[=+@\-\t\r]/.test(value) ? "'" + value : value;

    const id = text(data.submissionId || Utilities.getUuid(), 80);
    const credential = text(data.invitationCode, 254);
    const invitation = findInvitation(credential);
    const code = invitation.invitationCode || credential.toUpperCase();
    const people = validatePeople(data, invitation);
    const roomBookings = normalizeRoomBookings(data);

    const returnShuttle = data.returnShuttleBooking === true;

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

    const outboundShuttle = anyAttending && data.shuttleBooking === true ? 'Sí' : 'No';
    const roomSummary = anyAttending ? formatRoomBookings(roomBookings) : '';
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
    const previous = getPreviousRsvp(book, code);
    const availabilityBefore = getRoomAvailability(book, previous ? previous.submissionId : id);
    Object.keys(roomBookings).forEach(roomId => {
      const room = availabilityBefore.find(item => item.id === roomId);
      if (!room || roomBookings[roomId] > room.remaining) throw Error('Room allocation unavailable');
    });
    const outboundCount = validatePassengerCount(data.outboundShuttleCount, data.shuttleBooking, saturdayCount);
    const returnCount = validatePassengerCount(data.returnShuttleCount, returnShuttle, saturdayCount);

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
        'Autobús ida Salamanca - Castillo',
        'Autobús vuelta Castillo - Salamanca',
        'Habitaciones solicitadas',
        'Habitaciones JSON',
        'Canción',
        'Mensaje',
      ]);

      sheet.setFrozenRows(1);
      sheet
        .getRange(1, 1, 1, 20)
        .setFontWeight('bold')
        .setBackground('#5c141e')
        .setFontColor('#ffffff');

      sheet.setColumnWidths(1, 20, 170);
      sheet.setColumnWidth(2, 180);
      sheet.setColumnWidth(3, 180);
      sheet.setColumnWidth(14, 320);
      sheet.setColumnWidth(17, 300);
      sheet.setColumnWidth(18, 260);
      sheet.setColumnWidth(20, 420);
    }

    if (sheet.getLastColumn() < 23) sheet.getRange(1, 21, 1, 3).setValues([['Personas autobús ida', 'Personas autobús vuelta', 'Respuesta JSON']]);
    const existingSnapshot = readRsvpSnapshot(book);
    const alreadyExists = existingSnapshot.rows.some(row => String(row[0]) === id);

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
        outboundCount ? outboundShuttle : 'No',
        returnCount ? 'Sí' : 'No',
        roomSummary,
        JSON.stringify(roomBookings),
        song,
        message,
        outboundCount,
        returnCount,
        JSON.stringify(Object.assign({}, data, {submissionId:id, invitationCode:code, code:code, guests:people, roomBookings:roomBookings, outboundShuttleCount:outboundCount, returnShuttleCount:returnCount})),
      ];

      const existingRow = findRsvpRow(sheet, code);
      if (existingRow) sheet.getRange(existingRow, 1, 1, row.length).setValues([row.map(literal)]);
      else sheet.appendRow(row.map(literal));
      sheet.getRange(existingRow || sheet.getLastRow(), 2).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    }

    saveGuestDetails(book, id, code, titularEmail, people, literal);
    SpreadsheetApp.flush();
    const availabilityAfter = availabilityBefore.map(room => ({...room,
      reserved: room.reserved + (roomBookings[room.id] || 0),
      remaining: Math.max(0, room.remaining - (roomBookings[room.id] || 0))
    }));
    console.log('RSVP processing ms: ' + (Date.now() - startedAt));

    return jsonReply({
      ok: true,
      submissionId: id,
      receivedAt: new Date().toISOString(),
      guestsReceived: people.length,
      attendingGuests: attendingPeople.length,
      fridayCount,
      saturdayCount,
      roomBookings,
      roomAvailability: availabilityAfter,
      processingMs: Date.now() - startedAt,
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

function checkShortInvitationRate_() {
  // Limit repeated six-character lookups for this public endpoint.
  // The longer per-family URL is recommended for accessing an invitation.
  if (typeof CacheService === 'undefined') return;
  const cache = CacheService.getScriptCache();
  const key = 'short_code_lookup_' + Math.floor(Date.now() / 60000);
  const attempts = Number(cache.get(key) || '0');
  if (attempts >= 60) throw Error('Too many attempts. Try again later.');
  cache.put(key, String(attempts + 1), 75);
}

function findInvitation(code) {
  // The private invitation code is the sole lookup credential.
  // Email-only lookup previously exposed guest responses and allergy information.
  const key = String(code || '').trim().toUpperCase();
  const isLongCode = /^[A-Z0-9-]{16,80}$/.test(key);
  const isShortCode = /^[A-HJ-NP-Z2-9]{6}$/.test(key);
  if (!isLongCode && !isShortCode) throw Error('Invalid invitation');
  // Short memorable codes are rate-limited and ONLY resolve to the existing
  // canonical long identifier. Previous RSVPs are still stored under the long code.
  if (isShortCode) checkShortInvitationRate_();

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

  const invitationTextIndex = findOptionalColumn(idx, [
    'texto invitacion',
    'texto invitación',
    'texto de invitacion',
    'texto de invitación',
    'texto mostrado invitacion',
    'texto mostrado invitación',
    'invitation text',
    'invitation label',
  ]);

  const shortCodeIndex = findOptionalColumn(idx, ['codigo corto', 'código corto', 'short code']);
  const matches = rows.filter(row =>
    String(row[codeIndex] || '').trim().toUpperCase() === key ||
    (isShortCode && shortCodeIndex !== -1 && String(row[shortCodeIndex] || '').trim().toUpperCase() === key)
  );

  if (matches.length !== 1) {
    throw Error(matches.length ? 'Duplicate invitation code' : 'Invalid invitation');
  }
  const match = matches[0];

  const resolvedCode = String(match[codeIndex] || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{16,80}$/.test(resolvedCode)) throw Error('Invalid invitation');
  const holderName = nameIndex === -1 ? '' : String(match[nameIndex] || '').trim();
  const maxGuests = Number(match[maxGuestsIndex]);
  const invitationText = invitationTextIndex === -1 ? '' : String(match[invitationTextIndex] || '').trim();
  const active = activeIndex === -1 ? true : yesNo(match[activeIndex], true);

  const invitedToPreboda = fridayIndex === -1 ? false : yesNo(match[fridayIndex], false);
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
    invitationCode: resolvedCode,
    holderName,
    maxGuests,
    invitedToPreboda,
    invitedToWedding,
    language,
    guests,
    invitationText,
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

function normalizeRoomBookings(data) {
  const result = {};
  const source = data.roomBookings && typeof data.roomBookings === 'object' ? data.roomBookings : {};

  ROOM_CONFIG.forEach(room => {
    const qty = Math.max(0, Math.floor(Number(source[room.id]) || 0));
    if (qty > 0) result[room.id] = qty;
  });

  if (Object.keys(result).length === 0 && data.roomBooking && data.roomBooking !== 'none') {
    const id = String(data.roomBooking);
    if (ROOM_CONFIG.some(room => room.id === id)) result[id] = 1;
  }

  return result;
}

function getRoomsSheet(book) {
  let sheet = book.getSheetByName(ROOMS_TAB);

  if (!sheet) {
    sheet = book.insertSheet(ROOMS_TAB);
    sheet.appendRow(['ID habitación', 'Tipo de habitación', 'Total habitaciones', 'Precio por noche (€)']);
    // Prices are intentionally NOT populated from the website. Enter them in Sheets.
    ROOM_CONFIG.forEach(room => sheet.appendRow([room.id, room.label, room.total, '']));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
    sheet.setColumnWidths(1, 4, 220);
  }

  return sheet;
}

function getRoomTotals(book) {
  const sheet = getRoomsSheet(book);
  const rows = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues() : [];
  const totals = {};

  ROOM_CONFIG.forEach(room => {
    totals[room.id] = 0;
  });

  rows.forEach(row => {
    const id = String(row[0] || '').trim();
    const total = Number(row[2]);
    if (ROOM_CONFIG.some(room => room.id === id) && Number.isInteger(total) && total >= 0) {
      totals[id] = total;
    }
  });

  return totals;
}

function getReservedRoomCounts(book, ignoreSubmissionId) {
  const counts = {};
  ROOM_CONFIG.forEach(room => {
    counts[room.id] = 0;
  });

  const sheet = book.getSheetByName(RSVP_TAB);
  if (!sheet || sheet.getLastRow() < 2) return counts;

  const snapshot = readRsvpSnapshot(book);
  const headers = snapshot.headers;
  const idx = makeHeaderIndex(headers);
  const idIndex = findOptionalColumn(idx, ['id de envio', 'id de envío']);
  const jsonIndex = findOptionalColumn(idx, ['habitaciones json', 'rooms json']);
  const roomTextIndex = findOptionalColumn(idx, ['habitaciones solicitadas', 'habitacion solicitada', 'habitación solicitada']);

  if (jsonIndex === -1 && roomTextIndex === -1) return counts;

  const rows = snapshot.rows;

  const latestByCode = {};
  rows.forEach((row, i) => { latestByCode[String(row[5] || row[0] || i).trim().toUpperCase()] = row; });
  Object.keys(latestByCode).map(key => latestByCode[key]).forEach(row => {
    if (ignoreSubmissionId && idIndex !== -1 && String(row[idIndex] || '') === String(ignoreSubmissionId)) return;

    if (jsonIndex !== -1 && row[jsonIndex]) {
      try {
        const parsed = JSON.parse(String(row[jsonIndex]));
        ROOM_CONFIG.forEach(room => {
          counts[room.id] += Math.max(0, Math.floor(Number(parsed[room.id]) || 0));
        });
        return;
      } catch (e) {}
    }

    if (roomTextIndex !== -1) {
      const value = String(row[roomTextIndex] || '').toLowerCase();
      ROOM_CONFIG.forEach(room => {
        if (value === room.id || value.indexOf(room.id.toLowerCase()) !== -1) counts[room.id] += 1;
      });
    }
  });

  return counts;
}

// Read prices and (optionally) a precomputed remaining-room count by HEADER,
// never by a hard-coded column letter. This preserves existing extra columns.
function parseRoomPrice(value) {
  if (typeof value === 'number') return Number.isFinite(value) && value >= 0 ? value : null;
  let raw = String(value == null ? '' : value).trim().replace(/[^0-9,.-]/g, '');
  if (!raw) return null;
  const comma = raw.lastIndexOf(',');
  const point = raw.lastIndexOf('.');
  if (comma >= 0 && point >= 0) {
    raw = comma > point ? raw.replace(/\./g, '').replace(',', '.') : raw.replace(/,/g, '');
  } else if (comma >= 0) {
    raw = raw.replace(',', '.');
  }
  const number = Number(raw);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function getRoomSheetPublicFields(book) {
  const sheet = getRoomsSheet(book);
  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(3, typeof sheet.getLastColumn === 'function' ? sheet.getLastColumn() : 3);
  const result = {};
  if (lastRow < 2) return result;
  const headings = sheet.getRange(1, 1, 1, lastCol).getValues()[0] || [];
  const index = makeHeaderIndex(headings);
  const idCol = findOptionalColumn(index, ['id habitacion', 'id habitación', 'id', 'room id']);
  const priceCol = findOptionalColumn(index, [
    'precio por noche', 'precio por noche euros', 'precio noche', 'precio noche euros',
    'precio', 'tarifa por noche', 'tarifa', 'tarifa especial',
    'price per night', 'nightly price', 'price', 'rate', 'euros noche',
  ]);
  const remainingCol = findOptionalColumn(index, [
    'disponibles', 'habitaciones disponibles', 'habitaciones libres', 'libres',
    'disponibilidad', 'quedan', 'quedan libres', 'habitaciones restantes',
    'habitaciones disponibles ahora', 'disponibles ahora', 'stock disponible', 'rooms available',
    'remaining rooms', 'remaining', 'open rooms',
  ]);
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  rows.forEach(row => {
    const id = String(row[idCol < 0 ? 0 : idCol] || '').trim();
    if (!ROOM_CONFIG.some(room => room.id === id)) return;
    const price = priceCol >= 0 ? parseRoomPrice(row[priceCol]) : null;
    const rawRemaining = remainingCol >= 0 ? row[remainingCol] : '';
    const remaining = rawRemaining !== '' && rawRemaining != null &&
      Number.isInteger(Number(rawRemaining)) && Number(rawRemaining) >= 0
        ? Number(rawRemaining) : null;
    result[id] = { price, remaining };
  });
  return result;
}

function getRoomAvailability(book, ignoreSubmissionId) {
  const totals = getRoomTotals(book);
  const reserved = getReservedRoomCounts(book, ignoreSubmissionId);
  const sheetFields = getRoomSheetPublicFields(book);

  return ROOM_CONFIG.map(room => {
    const count = reserved[room.id] || 0;
    const derivedRemaining = Math.max(0, totals[room.id] - count);
    const fromSheet = sheetFields[room.id];
    // A sheet-provided remaining count can LOWER availability, never increase it
    // beyond total minus outstanding RSVP requests. Updates are checked again
    // under the existing server lock when an RSVP is submitted.
    const remaining = fromSheet && fromSheet.remaining !== null
      ? Math.min(derivedRemaining, fromSheet.remaining) : derivedRemaining;
    return {
      id: room.id,
      total: totals[room.id],
      reserved: count,
      remaining,
      price: fromSheet ? fromSheet.price : null,
    };
  });
}

function assertRoomAvailability(book, roomBookings, submissionId) {
  const availability = getRoomAvailability(book, submissionId);

  Object.keys(roomBookings).forEach(roomId => {
    const requested = roomBookings[roomId];
    const room = availability.find(item => item.id === roomId);
    if (!room) throw Error('Invalid room request');
    if (requested > room.remaining) throw Error('Room allocation unavailable');
  });
}

function formatRoomBookings(roomBookings) {
  const parts = [];
  ROOM_CONFIG.forEach(room => {
    const qty = roomBookings[room.id] || 0;
    if (qty > 0) parts.push(qty + ' × ' + room.label);
  });
  return parts.length ? parts.join(', ') : 'none';
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

  const last = gSheet.getLastRow();
  const rows = last > 1 ? gSheet.getRange(2,1,last-1,13).getValues() : [];
  const positions = rows.map((row,i)=>String(row[3]).trim().toUpperCase()===code ? i+2 : 0).filter(Boolean);
  const values = people.map((person,index)=>[id,id+':'+index,new Date(),code,titularEmail,person.fullName,person.email,person.attendance==='yes'?'Sí':'No',person.attendingFriday?'Sí':'No',person.attendingSaturday?'Sí':'No',dayLabel(person),person.dietaryPreference,person.allergiesNote].map(literal));
  const reused = Math.min(positions.length, values.length);
  for(let i=0;i<reused;) {
    let end=i+1;
    while(end<reused && positions[end]===positions[end-1]+1) end++;
    gSheet.getRange(positions[i],1,end-i,13).setValues(values.slice(i,end));
    i=end;
  }
  if(values.length>reused) gSheet.getRange(last+1,1,values.length-reused,13).setValues(values.slice(reused));
  for(let i=positions.length-1;i>=reused;) {
    let start=i;
    while(start>reused && positions[start-1]===positions[start]-1) start--;
    gSheet.deleteRows(positions[start],i-start+1);
    i=start-1;
  }
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

function validatePassengerCount(value, enabled, maximum) {
  if (!enabled) return 0;
  const count = value == null ? maximum : Number(value);
  if (!Number.isInteger(count) || count < 0 || count > maximum) throw Error('Invalid shuttle passenger count');
  return count;
}
function readRsvpSnapshot(book) {
  if(rsvpSnapshot) return rsvpSnapshot;
  const sheet=book.getSheetByName(RSVP_TAB);
  if(!sheet || sheet.getLastRow()<1) return rsvpSnapshot={headers:[],rows:[]};
  const values=sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
  return rsvpSnapshot={headers:values[0]||[],rows:values.slice(1)};
}
function findRsvpRow(sheet, code) {
  if(!sheet) return 0;
  const rows=readRsvpSnapshot({getSheetByName:()=>sheet}).rows;
  for(let i=rows.length-1;i>=0;i--) if(String(rows[i][5]).trim().toUpperCase()===String(code).trim().toUpperCase()) return i+2;
  return 0;
}
function getPreviousRsvp(book, code) {
  const sheet=book.getSheetByName(RSVP_TAB);
  const rowNumber=findRsvpRow(sheet,code);
  if(!rowNumber) return null;
  const row=readRsvpSnapshot(book).rows[rowNumber-2];
  if(row[22]) {try{return JSON.parse(String(row[22]));}catch(e){}}
  const detail=book.getSheetByName(GUESTS_TAB);
  const people=detail && detail.getLastRow()>1 ? detail.getRange(2,1,detail.getLastRow()-1,13).getValues().filter(r=>String(r[0])===String(row[0])).map(r=>({fullName:String(r[5]||''),email:String(r[6]||''),attendance:r[7]==='Sí'?'yes':'no',attendingFriday:r[8]==='Sí',attendingSaturday:r[9]==='Sí',dietaryPreference:String(r[11]||'none'),allergiesNote:String(r[12]||'')})) : [];
  if(!people.length) return null;
  let rooms={};try{rooms=JSON.parse(String(row[17]||'{}'));}catch(e){}
  return {submissionId:String(row[0]),fullName:String(row[6]),email:String(row[7]),guests:people,roomBookings:rooms,shuttleBooking:row[14]==='Sí',returnShuttleBooking:row[15]==='Sí',outboundShuttleCount:(row[20]==null||row[20]==='')?(row[14]==='Sí'?Number(row[12]):0):Number(row[20]),returnShuttleCount:(row[21]==null||row[21]==='')?(row[15]==='Sí'?Number(row[12]):0):Number(row[21]),songRequest:String(row[18]||''),blessingMessage:String(row[19]||'')};
}
