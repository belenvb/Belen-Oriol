/**
 * Belén & Oriol — private invitation dispatch console.
 * Existing guest columns A:M (including M = Invitado 4) MUST NOT be touched.
 * Sending fields begin at N or later if the sheet has additional custom fields.
 * Column locations are resolved by their headers, never by absolute positions.
 */
const SENDING_FIELDS = [
  'Teléfono internacional',
  'Canal envío',
  'Estado envío',
  'Fecha envío',
  'Enlace privado',
  'Abrir WhatsApp',
  'Abrir SMS',
  'Último intento',
  'Error envío',
  'Email enviado el',
  'WhatsApp enviado el',
  'SMS enviado el',
];
const SENDING_MIN_COL = 14; // N; M belongs to Invitado 4
const SENDING_MAX_EMAILS_PER_RUN = 40;

function onOpen() {
  SpreadsheetApp.getUi().createMenu('✉ Invitaciones')
    .addItem('Abrir panel de envíos', 'openInvitationSendingPanel')
    .addItem('Preparar columnas y enlaces', 'prepareInvitationSending')
    .addItem('Generar códigos cortos (6 caracteres)', 'prepareShortInvitationCodes')
    .addItem('Configurar URL de la web', 'promptWeddingWebsiteUrl')
    .addSeparator()
    .addItem('Actualizar estados RSVP', 'refreshInvitationSendingStatuses')
    .addToUi();
}

function openInvitationSendingPanel() {
  prepareSendingColumns_();
  SpreadsheetApp.getUi().showSidebar(
    HtmlService.createHtmlOutputFromFile('SendingPanel').setTitle('Belén & Oriol · Invitaciones')
  );
}

function promptWeddingWebsiteUrl() {
  const ui = SpreadsheetApp.getUi();
  const existing = getWeddingWebsiteUrl();
  const answer = ui.prompt('URL pública de vuestra web',
    'Introduce la URL que abrirán los invitados, sin códigos privados. Actual: ' + (existing || 'sin configurar'),
    ui.ButtonSet.OK_CANCEL);
  if (answer.getSelectedButton() !== ui.Button.OK) return;
  try { setWeddingWebsiteUrl(answer.getResponseText()); ui.alert('URL guardada. Prepara de nuevo los enlaces.'); }
  catch (error) { ui.alert('URL no válida: ' + error.message); }
}

function getWeddingWebsiteUrl() {
  return String(PropertiesService.getScriptProperties().getProperty('WEDDING_SITE_URL') || '').trim();
}

function setWeddingWebsiteUrl(input) {
  const raw = String(input || '').trim().replace(/\/+$/, '');
  if (!/^https:\/\/[a-z0-9][^\s#?]*$/i.test(raw) || /[\[\]<>]/.test(raw)) {
    throw Error('Utiliza la dirección https:// de tu web publicada, sin parámetros ni #.');
  }
  PropertiesService.getScriptProperties().setProperty('WEDDING_SITE_URL', raw);
  return getWeddingWebsiteUrl();
}

/** Find or safely create the sending columns without overwriting guest data. */
function prepareSendingColumns_() {
  const sheet = getSpreadsheet().getSheetByName(INVITATIONS_TAB);
  if (!sheet) throw Error('Primero crea la pestaña Invitaciones.');
  const lastCol = Math.max(sheet.getLastColumn(), 13);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(v => String(v || '').trim());
  if (headers[12] === 'Teléfono internacional') throw Error('La columna M debe ser Invitado 4. Revisa el historial de la hoja antes de continuar.');

  // Keep the 9 existing fields wherever they are. Never assume O is free.
  const cols = {};
  SENDING_FIELDS.forEach(name => {
    const indexes = [];
    for (let i = SENDING_MIN_COL - 1; i < headers.length; i++) if (headers[i] === name) indexes.push(i + 1);
    if (indexes.length > 1) throw Error('Cabecera duplicada: ' + name);
    if (indexes.length) cols[name] = indexes[0];
  });
  const legacy = SENDING_FIELDS.slice(0, 9);
  const foundOld = legacy.filter(name => !!cols[name]).length;
  if (foundOld > 0 && foundOld !== legacy.length) throw Error('Faltan columnas antiguas de envío. No se ha cambiado nada. Revisa las cabeceras.');
  if (foundOld === 0 && SENDING_FIELDS.slice(9).some(n => cols[n])) throw Error('Faltan columnas antiguas de envío. No se ha cambiado nada.');
  const missing = SENDING_FIELDS.filter(name => !cols[name]);
  if (missing.length) {
    // Append to the right of ALL existing headers/data (N may hold "Cómo rellenar").
    let col = Math.max(sheet.getLastColumn() + 1, SENDING_MIN_COL);
    const required = col + missing.length - 1;
    const max = sheet.getMaxColumns();
    if (max < required) sheet.insertColumnsAfter(max, required - max);
    sheet.getRange(1, col, 1, missing.length).setValues([missing]);
    missing.forEach(name => { cols[name] = col++; });
  }
  SENDING_FIELDS.forEach(name => {
    const c = cols[name];
    sheet.getRange(1, c).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff').setWrap(true);
    sheet.setColumnWidth(c, name === 'Error envío' ? 260 : 175);
  });
  sheet.getRange(2, cols['Teléfono internacional'], 999, 1).setNumberFormat('@');
  const combinations = ['Email', 'WhatsApp', 'SMS', 'Email + WhatsApp', 'Email + SMS', 'WhatsApp + SMS', 'Email + WhatsApp + SMS'];
  sheet.getRange(2, cols['Canal envío'], 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(combinations, true).setAllowInvalid(false).build());
  sheet.getRange(2, cols['Estado envío'], 999, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Pendiente','Enviada','RSVP recibido','Error'], true).setAllowInvalid(false).build());
  ['Fecha envío','Último intento','Email enviado el','WhatsApp enviado el','SMS enviado el'].forEach(n => sheet.getRange(2, cols[n], 999, 1).setNumberFormat('dd/MM/yyyy HH:mm'));
  return {sheet: sheet, columns: cols};
}

function selectedChannels_(raw) {
  const v = String(raw || '').trim();
  if (!v) return [];
  const selected = ['Email','WhatsApp','SMS'].filter(c => new RegExp('(^|\\W)' + c + '($|\\W)', 'i').test(v));
  return selected;
}

// Human-readable 6-character aliases; the original column D stays unchanged.
// Always append after the existing guest/sending columns, never overwrite I:M or N.
const SHORT_CODE_HEADER = 'Código corto';
const SHORT_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function createShortInvitationCode_() {
  const hex = typeof Utilities !== 'undefined'
    ? Utilities.getUuid().replace(/-/g, '').slice(0, 8)
    : Math.floor(Math.random() * 0x100000000).toString(16).padStart(8, '0');
  const bits = parseInt(hex, 16) >>> 0;
  let result = '';
  for (let i = 0; i < 6; i++) result += SHORT_CODE_ALPHABET[(bits >>> (25 - i * 5)) & 31];
  return result;
}

function prepareShortInvitationCodes_(sheet) {
  const last = Math.max(sheet.getLastColumn(), 13);
  const headers = sheet.getRange(1, 1, 1, last).getValues()[0].map(v => String(v || '').trim());
  let codeCol = headers.indexOf(SHORT_CODE_HEADER) + 1;
  if (!codeCol) {
    codeCol = last + 1;
    if (sheet.getMaxColumns() < codeCol) sheet.insertColumnsAfter(sheet.getMaxColumns(), 1);
    sheet.getRange(1, codeCol).setValue(SHORT_CODE_HEADER);
    sheet.getRange(1, codeCol).setFontWeight('bold').setBackground('#5c141e').setFontColor('#ffffff');
    sheet.setColumnWidth(codeCol, 145);
  }
  if (sheet.getLastRow() < 2) return codeCol;
  sheet.getRange(2, codeCol, sheet.getLastRow() - 1, 1).setNumberFormat('@');
  const codes = sheet.getRange(2, codeCol, sheet.getLastRow() - 1, 1).getValues().map(v => String(v[0] || '').trim().toUpperCase());
  const holders = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();
  const used = new Set(codes.filter(Boolean));
  if (used.size !== codes.filter(Boolean).length) throw Error('Hay códigos cortos duplicados. Revisa la columna Código corto.');
  codes.forEach((code, i) => {
    if (code) {
      if (!/^[A-HJ-NP-Z2-9]{6}$/.test(code)) throw Error('Código corto inválido en fila ' + (i + 2));
      return;
    }
    if (!String(holders[i][0] || '').trim() || !/^[A-Z0-9-]{16,80}$/.test(String(holders[i][3] || '').trim().toUpperCase())) return;
    let next = '';
    for (let tries = 0; tries < 30; tries++) {
      next = createShortInvitationCode_();
      if (!used.has(next)) break;
    }
    if (used.has(next)) throw Error('No se ha podido generar un código único.');
    used.add(next);
    sheet.getRange(i + 2, codeCol).setValue(next);
  });
  return codeCol;
}

function prepareShortInvitationCodes() {
  const {sheet} = prepareSendingColumns_();
  prepareShortInvitationCodes_(sheet);
  return {ok:true};
}

function sendingRows_() {
  const {sheet, columns} = prepareSendingColumns_();
  const shortCodeCol = prepareShortInvitationCodes_(sheet);
  if (sheet.getLastRow() < 2) return {sheet, columns, records:[]};
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const records = data.map((cells, idx) => {
    const field = name => cells[columns[name] - 1];
    const channel = String(field('Canal envío') || '').trim();
    const channelList = selectedChannels_(channel);
    const legacyDate = field('Fecha envío');
    const legacyChannel = channelList.length === 1 ? channelList[0] : '';
    const legacyStatus = String(field('Estado envío') || '').trim();
    function sentDate(name, channelName) {
      // Preserve existing records: a dated legacy send of a single channel is counted.
      // Never infer that a WhatsApp or SMS message was sent just because a draft was opened.
      return field(name) || (legacyChannel === channelName && legacyDate && (legacyStatus === 'Enviada' || legacyStatus === 'RSVP recibido') ? legacyDate : '');
    }
    return {
      row: idx + 2, name: String(cells[0] || '').trim(), email: String(cells[1] || '').trim(),
      maxGuests: Number(cells[2]), code: String(cells[3] || '').trim().toUpperCase(),
      shortCode: String(cells[shortCodeCol - 1] || '').trim().toUpperCase(),
      friday: yesNo(cells[4], false), saturday: yesNo(cells[5], false),
      fridaySpecified: ['sí','si','no','yes'].includes(String(cells[4] || '').trim().toLowerCase()),
      saturdaySpecified: ['sí','si','no','yes'].includes(String(cells[5] || '').trim().toLowerCase()),
      language: String(cells[6] || '').toLowerCase() === 'en' ? 'en' : 'es',
      active: yesNo(cells[7], true), phone: String(field('Teléfono internacional') || '').trim(),
      channel: channel, channels: channelList,
      status: legacyStatus || 'Pendiente',
      sentAt: legacyDate,
      emailSentAt: sentDate('Email enviado el','Email'),
      whatsappSentAt: sentDate('WhatsApp enviado el','WhatsApp'),
      smsSentAt: sentDate('SMS enviado el','SMS'),
      attemptsAt: field('Último intento'), error: String(field('Error envío') || '').trim(),
    };
  });
  return {sheet, columns, records: records.filter(r => r.name)};
}

function sendingLink_(code) {
  const base = getWeddingWebsiteUrl();
  if (!base) throw Error('Primero configura la URL de la web.');
  if (!/^[A-Z0-9-]{16,80}$/.test(code)) throw Error('Código privado ausente o inválido');
  return base + '/#invitacion=' + encodeURIComponent(code);
}

function normalizedPhone_(value) {
  const normalized = String(value || '').trim().replace(/[ ()\-.]/g, '');
  return /^\+[1-9]\d{6,14}$/.test(normalized) ? normalized : '';
}

/** Update only the phone column for one family. Never alter the guest list or RSVP. */
function updateInvitationPhone(rowNumber, phoneInput) {
  const normalized = normalizedPhone_(phoneInput);
  if (!normalized) throw Error('Escribe el número con prefijo internacional: +34... (España) o +1... (EE. UU.). Sin espacios ni extensiones.');
  const row = Number(rowNumber);
  if (!Number.isInteger(row) || row < 2) throw Error('Fila de invitación inválida.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const result = sendingRows_();
    const guest = result.records.find(r => r.row === row);
    if (!guest) throw Error('No encontramos esa familia.');
    const col = result.columns['Teléfono internacional'];
    if (!col || col < SENDING_MIN_COL) throw Error('Falta la columna de teléfono.');
    const cell = result.sheet.getRange(row, col);
    cell.setNumberFormat('@'); // Important: Sheets must not evaluate +34... as a numeric formula.
    cell.setValue(normalized);
    return {ok:true, phone:normalized};
  } finally {
    lock.releaseLock();
  }
}

function sendingCopy_(r, link) {
  const spanish = r.language !== 'en';
  const code = String(r.shortCode || r.code || '').trim().toUpperCase();
  const fridayEs = r.friday ? '\nTambién os esperamos en la preboda del viernes 3.' : '';
  const fridayEn = r.friday ? '\nWe hope to see you at the Friday, September 3 welcome celebration too.' : '';
  // Keep ONE URL at the END to give Messages/iMessage the best chance of a rich preview.
  // Social previews come from public Open Graph metadata and never contain a guest name or code.
  if (spanish) return {
    subject: 'Belén & Oriol | Nuestra invitación de boda',
    whatsapp: 'Hola, ' + r.name + '!\n\nEl 4 de septiembre de 2027 celebraremos nuestra boda en el Castillo del Buen Amor, Salamanca, y nos encantaría compartir ese día con vosotros. Hemos preparado una invitación muy especial para vosotros.' + fridayEs + '\n\nCódigo privado de acceso: ' + code + '\n\nAbre vuestro sobre aquí:\n' + link,
    sms: 'Belén y Oriol: ¡tenéis una invitación para nuestra boda! Código privado: ' + code + '\nAbre el sobre: ' + link,
  };
  return {
    subject: 'Belén & Oriol | Our Wedding Invitation',
    whatsapp: 'Hi ' + r.name + '!\n\nWe’re celebrating our wedding on September 4, 2027 at Castillo del Buen Amor in Salamanca, and we would love to share the day with you. We have a very special invitation for you.' + fridayEn + '\n\nPrivate access code: ' + code + '\n\nOpen your envelope:\n' + link,
    sms: 'Belén & Oriol: You are invited to our wedding! Private code: ' + code + '\nOpen your envelope: ' + link,
  };
}

function escapeInvitationHtml_(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function invitationEmail_(r, url) {
  // V5: The watercolor, olive shadows and calligraphy are part of the entire
  // artwork, not a top banner. Guest name and private URL remain LIVE content.
  const t = escapeInvitationHtml_;
  const es = r.language !== 'en';
  const button = es ? 'ABRIR EL SOBRE' : 'OPEN THE ENVELOPE';
  const date = es ? '4 de septiembre de 2027' : 'September 4, 2027';
  const subject = es ? 'Belén & Oriol · Tu invitación' : 'Belén & Oriol · Your invitation';
  const preheader = es ? 'Una invitación muy especial para ti.' : 'A very special invitation for you.';
  // The email shows the six-character alias. The one-click URL continues to
  // carry the strong original credential from column D.
  const accessCode = String(r.shortCode || r.code || '').trim().toUpperCase();
  const validAccessCode = /^[A-HJ-NP-Z2-9]{6}$/.test(accessCode) || /^[A-Z0-9-]{16,80}$/.test(accessCode);
  const accessCodeLabel = es ? 'TU CÓDIGO PRIVADO DE ACCESO' : 'YOUR PRIVATE ACCESS CODE';
  const accessCodeHint = es
    ? 'Guárdalo para acceder a tu invitación desde nuestra web. No lo compartas.'
    : 'Keep it to access your invitation directly from our website. Please do not share it.';
  // Intentionally no light box/border: this is a quiet footer, not a new card.
  const accessCodeRow = validAccessCode ? `<tr><td align="center" bgcolor="#fae8d5" style="padding:15px 24px 8px;background-color:#fae8d5;text-align:center;">
    <div style="font:normal 10px/18px Arial,Helvetica,sans-serif;letter-spacing:2px;color:#896a5c;">${t(accessCodeLabel)}</div>
    <div style="padding:8px 0 4px;font:normal 19px/27px Georgia,'Times New Roman',serif;letter-spacing:2px;color:#64232e;overflow-wrap:anywhere;word-break:break-word;">${t(accessCode)}</div>
    <div style="font:italic 12px/19px Georgia,'Times New Roman',serif;color:#896a5c;">${t(accessCodeHint)}</div>
    </td></tr>` : '';
  const altTop = es
    ? 'Belén y Oriol · 4 de septiembre de 2027 · Salamanca. Tenemos una invitación muy especial para ti. Para:'
    : 'Belén and Oriol · September 4, 2027 · Salamanca. We have something very special for you. For:';
  const altBottom = es
    ? 'Sobre burdeos con sello B | O, rosa y trigo. Abrir el sobre. Castillo del Buen Amor, Salamanca.'
    : 'Burgundy envelope with B | O wax seal, rose and wheat. Open the envelope. Castillo del Buen Amor, Salamanca.';
  const html = `<!doctype html><html lang="${es ? 'es' : 'en'}"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<style>
@media screen and (max-width:620px) {
 .email-art { width:100% !important; max-width:620px !important; height:auto !important; }
 .guest-name-text { font-size:5.8vw !important; line-height:1.28 !important; }
 .guest-cell { padding:1px 10px !important; }
 .guest-label-text { font-size:2vw !important; line-height:1.25 !important; margin-bottom:1px !important; }
}
</style></head>
<body style="margin:0;padding:0;background-color:#fae8d5;color:#602532;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#fae8d5;font-size:1px;line-height:1px;mso-hide:all;">${t(preheader)}</div>
<table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#fae8d5" style="border-collapse:collapse;width:100%;background-color:#fae8d5;">
<tr><td align="center" style="padding:0;">
<table role="presentation" width="620" border="0" cellspacing="0" cellpadding="0" bgcolor="#fae8d5" style="width:100%;max-width:620px;border-collapse:collapse;background-color:#fae8d5;">
<tr><td align="center" bgcolor="#fae8d5" style="padding:0;line-height:0;font-size:0;">
<img class="email-art" src="cid:weddingTop" width="620" alt="${t(altTop)}" style="width:100%;max-width:620px;display:block;border:0;height:auto;outline:none;text-decoration:none;" />
</td></tr>
<tr><td class="guest-cell" align="center" background="cid:weddingGuestPaper" bgcolor="#f9e4d0" style="text-align:center;padding:0 14px;background-color:#f9e4d0;background-image:url('cid:weddingGuestPaper');background-size:100% 100%;background-repeat:no-repeat;color:#64232e;overflow-wrap:anywhere;word-break:normal;">
<div class="guest-label-text" style="font:normal 12px/18px Georgia,'Times New Roman',serif;color:#80533f;letter-spacing:3px;margin:0 0 3px;">${es ? 'PARA' : 'FOR'}</div>
<div class="guest-name-text" style="font:italic 36px/45px Georgia,'Times New Roman',serif;color:#64232e;">${t(r.name)}</div>
</td></tr>
<tr><td align="center" bgcolor="#fae8d5" style="padding:0;line-height:0;font-size:0;">
<a href="${t(url)}" title="${t(button)}" style="display:block;text-decoration:none;" aria-label="${t(button)}">
<img class="email-art" src="cid:weddingBottom" width="620" alt="${t(altBottom)}" style="display:block;width:100%;max-width:620px;height:auto;border:0;outline:none;text-decoration:none;" />
</a>
</td></tr>
${accessCodeRow}
<tr><td align="center" bgcolor="#fae8d5" style="padding:5px 20px 23px;font:normal 11px/1.55 Arial,Helvetica,sans-serif;color:#855f50;">
${es ? '¿No ves la invitación? ' : 'Can’t see the invitation? '}<a href="${t(url)}" style="color:#64232e;text-decoration:underline;">${es ? 'Ábrela aquí' : 'Open it here'}</a>.
</td></tr>
</table></td></tr></table>
</body></html>`;
  const body = [
    'Belén & Oriol',
    (es ? 'Una invitación para ' : 'An invitation for ') + r.name,
    date + ' · Castillo del Buen Amor · Salamanca',
    (es ? 'Abre tu sobre: ' : 'Open your envelope: ') + url,
    ...(validAccessCode ? [(es ? 'Tu código privado de acceso: ' : 'Your private access code: ') + accessCode] : []),
  ].join('\n\n');
  return {subject:subject,htmlBody:html,body:body};
}

/** Read-only preview: does not require a dispatch channel and NEVER calls MailApp. */
function getInvitationEmailPreview(rowNumber) {
  const {records} = sendingRows_();
  const record = records.find(r => r.row === Number(rowNumber));
  if (!record) throw Error('No se ha encontrado la familia seleccionada.');
  // Non-functional placeholder when the live website/link has not been configured yet.
  let previewLink = 'https://example.invalid/vista-previa';
  try { previewLink = sendingLink_(record.code); } catch (e) { /* visual preview only */ }
  const message = invitationEmail_(record, previewLink);
  // Inline the local envelope image for read-only preview without email or image hosting.
  const es = record.language !== 'en';
  message.htmlBody = message.htmlBody.replace('cid:weddingTop', weddingEmailTopPreviewSrc_(es));
  message.htmlBody = message.htmlBody.replace('cid:weddingBottom', weddingEmailBottomPreviewSrc_(es));
  message.htmlBody = message.htmlBody.split('cid:weddingGuestPaper').join(weddingEmailGuestPreviewSrc_());
  return message;
}

/** Opens the email as it will look to the guest, without emailing anyone. */
function openInvitationEmailPreview(rowNumber) {
  const message = getInvitationEmailPreview(rowNumber);
  const t = escapeInvitationHtml_;
  const preview = `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:Arial,Helvetica,sans-serif;background:#fff;margin:0;color:#342a27}header{background:#fff;padding:15px 20px;border-bottom:1px solid #e4d8c9}h2{margin:0 0 5px;font-size:14px;color:#641b2a}.sub{font-size:12px;color:#786a60}.frame{height:calc(100vh - 82px);width:100%;border:0;display:block}</style></head>
<body><header><h2>Vista previa · No se envía ningún email</h2><div class="sub">Asunto: ${t(message.subject)} · No consume cuota ni cambia el estado del invitado.</div></header>
<iframe class="frame" title="Vista previa de la invitación" sandbox="" referrerpolicy="no-referrer" srcdoc="${t(message.htmlBody)}"></iframe>
</body></html>`;
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(preview).setWidth(730).setHeight(790),
    'Vista previa · Invitación de boda'
  );
  return {ok:true};
}

function ensureReadyToSend_(r, targetChannel) {
  if (!r.active) throw Error('Invitación desactivada');
  if (!r.name || !Number.isInteger(r.maxGuests) || r.maxGuests < 1 || r.maxGuests > 20) throw Error('Nombre o número de personas inválido');
  if (!r.fridaySpecified || !r.saturdaySpecified) throw Error('Revisa los permisos explícitos de viernes y sábado');
  if (!r.friday && !r.saturday) throw Error('Esta familia no está invitada a ninguna jornada');
  sendingLink_(r.code);
  if (targetChannel) {
    if (!r.channels.includes(targetChannel)) throw Error('Selecciona ' + targetChannel + ' en esta familia');
    if (targetChannel === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) throw Error('Email inválido');
    if (targetChannel !== 'Email' && !normalizedPhone_(r.phone)) throw Error('Escribe el teléfono en formato internacional (por ejemplo +34600123456 o +16175551234).');
  }
}

function sentChannels_(r) {
  return {Email: !!r.emailSentAt, WhatsApp: !!r.whatsappSentAt, SMS: !!r.smsSentAt};
}
function dateWire_(v) { return v instanceof Date ? v.toISOString() : String(v || ''); }

function setInvitationChannels(rowNumber, channelNames) {
  if (!Array.isArray(channelNames)) throw Error('Selecciona los canales de envío.');
  const names = ['Email','WhatsApp','SMS'];
  const selected = names.filter(name => channelNames.includes(name));
  if (channelNames.length !== selected.length) throw Error('Canal de envío inválido');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const {sheet,columns,records} = sendingRows_();
    const r = records.find(x => x.row === Number(rowNumber));
    if (!r) throw Error('Familia no encontrada');
    // If a legacy invite has a recorded send under a single channel, preserve
    // that channel BEFORE changing the former single-choice column.
    if (r.channels.length === 1 && r.sentAt && (r.status === 'Enviada' || r.status === 'RSVP recibido')) {
      const oldChannel = r.channels[0];
      const oldDate = oldChannel === 'Email' ? r.emailSentAt : oldChannel === 'WhatsApp' ? r.whatsappSentAt : r.smsSentAt;
      if (oldDate && !sheet.getRange(r.row, columns[oldChannel + ' enviado el']).getValue()) {
        sheet.getRange(r.row, columns[oldChannel + ' enviado el']).setValue(oldDate);
      }
    }
    // NEVER overwrite the code, RSVP, guest names or per-channel sent dates.
    sheet.getRange(r.row, columns['Canal envío']).setValue(selected.join(' + '));
    return {ok:true, channels:selected};
  } finally { lock.releaseLock(); }
}

function ensureUniqueCodes_(records) {
  const seen = {};
  records.forEach(r => {
    if (!r.code) return;
    if (seen[r.code]) throw Error('Código duplicado entre las filas ' + seen[r.code] + ' y ' + r.row);
    seen[r.code] = r.row;
  });
}

function richLink_(label, url) {
  return SpreadsheetApp.newRichTextValue().setText(label).setLinkUrl(url).build();
}

function prepareInvitationSending() {
  const result = sendingRows_();
  if (!getWeddingWebsiteUrl()) throw Error('Configura primero la URL de la web desde el menú ✉ Invitaciones.');
  ensureUniqueCodes_(result.records);
  let count = 0;
  result.records.forEach(r => {
    if (!r.code) return;
    const link = sendingLink_(r.code);
    result.sheet.getRange(r.row, result.columns['Enlace privado']).setRichTextValue(richLink_('Abrir invitación', link));
    const phone = normalizedPhone_(r.phone);
    const copy = sendingCopy_(r, link);
    if (phone) {
      result.sheet.getRange(r.row, result.columns['Abrir WhatsApp']).setRichTextValue(richLink_('Enviar por WhatsApp', 'https://wa.me/' + phone.slice(1) + '?text=' + encodeURIComponent(copy.whatsapp)));
      result.sheet.getRange(r.row, result.columns['Abrir SMS']).setRichTextValue(richLink_('Enviar por SMS', 'sms:' + phone + '?body=' + encodeURIComponent(copy.sms)));
    } else {
      result.sheet.getRange(r.row, result.columns['Abrir WhatsApp']).clearContent();
      result.sheet.getRange(r.row, result.columns['Abrir SMS']).clearContent();
    }
    count++;
  });
  return {prepared: count};
}

function readRsvpCodes_() {
  const sheet = getSpreadsheet().getSheetByName(RSVP_TAB);
  const codes = {};
  if (!sheet || sheet.getLastRow() < 2) return codes;
  // Column F is the invitation code. The response sheet holds the last RSVP per code.
  sheet.getRange(2, 6, sheet.getLastRow() - 1, 1).getValues().forEach(row => {
    const code = String(row[0] || '').trim().toUpperCase();
    if (code) codes[code] = true;
  });
  return codes;
}

function refreshInvitationSendingStatuses() {
  const {sheet, columns, records} = sendingRows_();
  const rsvpCodes = readRsvpCodes_();
  let updated = 0;
  records.forEach(r => {
    if (rsvpCodes[r.code] && r.status !== 'RSVP recibido') {
      sheet.getRange(r.row, columns['Estado envío']).setValue('RSVP recibido');
      updated++;
    }
  });
  return {updated: updated};
}

function getSendingDashboardData() {
  const {records} = sendingRows_();
  const rsvpCodes = readRsvpCodes_();
  const publicRows = records.map(r => {
    let link='', whatsappUrl='',smsUrl='',whatsappText='',smsText='',mainIssue='';
    const issues = {};
    try {
      ensureReadyToSend_(r);
      link=sendingLink_(r.code);
      const copy=sendingCopy_(r,link);
      whatsappText=copy.whatsapp; smsText=copy.sms;
      const phone=normalizedPhone_(r.phone);
      if (phone) {
        whatsappUrl='https://wa.me/'+phone.slice(1)+'?text='+encodeURIComponent(whatsappText);
        smsUrl='sms:'+phone+'?body='+encodeURIComponent(smsText);
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) issues.Email='Introduce un email válido';
      if (!phone) {issues.WhatsApp='Indica un teléfono con prefijo internacional (+34…, +1…).';issues.SMS='Indica un teléfono con prefijo internacional (+34…, +1…).';}
    } catch(e) { mainIssue=String(e.message||e); }
    return {
      row:r.row,name:r.name,email:r.email,phone:r.phone,channel:r.channel,channels:r.channels,shortCode:r.shortCode,
      language:r.language,maxGuests:r.maxGuests,friday:r.friday,saturday:r.saturday,active:r.active,
      status:rsvpCodes[r.code]?'RSVP recibido':r.status,responded:!!rsvpCodes[r.code],
      sentAtByChannel:{Email:dateWire_(r.emailSentAt),WhatsApp:dateWire_(r.whatsappSentAt),SMS:dateWire_(r.smsSentAt)},
      sentChannels:sentChannels_(r), link,whatsappUrl,smsUrl,whatsappText,smsText,
      channelIssues:issues,issue:mainIssue,error:r.error,
    };
  });
  return {websiteUrl:getWeddingWebsiteUrl(),hasUrl:!!getWeddingWebsiteUrl(),rows:publicRows};
}

function sendInvitationEmailsByRows(rowNumbers) {
  if (!Array.isArray(rowNumbers) || !rowNumbers.length) throw Error('Selecciona al menos una familia');
  const selected = [...new Set(rowNumbers.map(Number))];
  if (selected.length > SENDING_MAX_EMAILS_PER_RUN) throw Error('Máximo 40 emails por envío');
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const {sheet,columns,records}=sendingRows_();
    ensureUniqueCodes_(records);
    const byRow={};records.forEach(r=>{byRow[r.row]=r;});
    const list=selected.map(n=>byRow[n]).filter(Boolean);
    if (list.length!==selected.length) throw Error('Fila inexistente');
    const responded=readRsvpCodes_();
    const toSend=list.filter(r=>r.channels.includes('Email')&&!r.emailSentAt&&!responded[r.code]);
    toSend.forEach(r=>ensureReadyToSend_(r,'Email'));
    const quota=MailApp.getRemainingDailyQuota();
    if(toSend.length>quota)throw Error('La cuota permite solo '+quota+' destinatarios más hoy');
    const failures=[],success=[];
    toSend.forEach(r=>{
      const now=new Date();sheet.getRange(r.row,columns['Último intento']).setValue(now);
      try {
        const message=invitationEmail_(r,sendingLink_(r.code));
        MailApp.sendEmail({to:r.email,subject:message.subject,htmlBody:message.htmlBody,body:message.body,name:'Belén & Oriol',inlineImages:{weddingTop:weddingEmailTopBlob_(r.language!=='en'),weddingBottom:weddingEmailBottomBlob_(r.language!=='en'),weddingGuestPaper:weddingEmailGuestBlob_()}});
        // Record only the Email channel; other channels remain independently pending.
        sheet.getRange(r.row,columns['Email enviado el']).setValue(now);
        if(!r.sentAt)sheet.getRange(r.row,columns['Fecha envío']).setValue(now);
        if(r.status!=='RSVP recibido')sheet.getRange(r.row,columns['Estado envío']).setValue('Enviada');
        sheet.getRange(r.row,columns['Error envío']).clearContent();
        success.push(r.name);
      }catch(e){
        if(r.status!=='RSVP recibido')sheet.getRange(r.row,columns['Estado envío']).setValue('Error');
        sheet.getRange(r.row,columns['Error envío']).setValue(String(e.message||e).slice(0,220));
        failures.push(r.name+': '+String(e.message||e));
      }
    });
    return {sent:success.length,skipped:list.length-toSend.length,failed:failures};
  }finally{lock.releaseLock();}
}

function sendTestInvitationEmail(rowNumber, testAddress) {
  const {records} = sendingRows_();
  const r = records.find(x => x.row === Number(rowNumber));
  if (!r) throw Error('No existe esa familia');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(testAddress || '').trim())) throw Error('Introduce un email válido para la prueba');
  if (!r.active || !r.code || !r.fridaySpecified || !r.saturdaySpecified) throw Error('Completa la invitación antes de probar');
  const message = invitationEmail_(r, sendingLink_(r.code));
  MailApp.sendEmail({to:String(testAddress).trim(),subject:'[PRUEBA] ' + message.subject,htmlBody:message.htmlBody,body:message.body,name:'Belén & Oriol',inlineImages:{weddingTop:weddingEmailTopBlob_(r.language !== 'en'),weddingBottom:weddingEmailBottomBlob_(r.language !== 'en'),weddingGuestPaper:weddingEmailGuestBlob_()}});
  // A test must never mark the real family as sent.
  return {ok:true};
}

function markInvitationManuallySent(rowNumber, channel) {
  if (!['WhatsApp','SMS'].includes(channel)) throw Error('Indica WhatsApp o SMS');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const {sheet, columns, records} = sendingRows_();
    const r = records.find(x => x.row === Number(rowNumber));
    if (!r) throw Error('Familia no encontrada');
    ensureReadyToSend_(r, channel);
    const old = channel === 'WhatsApp' ? r.whatsappSentAt : r.smsSentAt;
    if (old) return {ok:true, alreadySent:true};
    const now = new Date();
    sheet.getRange(r.row, columns[channel + ' enviado el']).setValue(now);
    if (!r.sentAt) sheet.getRange(r.row, columns['Fecha envío']).setValue(now);
    if (r.status !== 'RSVP recibido') sheet.getRange(r.row, columns['Estado envío']).setValue('Enviada');
    sheet.getRange(r.row, columns['Error envío']).clearContent();
    return {ok:true, channel};
  } finally { lock.releaseLock(); }
}

// Public wrapper used for the one-time setup in Google Apps Script's Run menu.
function prepararColumnasEnvio() {
  return prepareSendingColumns_();
}
