const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'InvitationSending.gs'), 'utf8'), ctx);
const parse = value => Array.from(ctx.invitationEmailAddresses_(value));
assert.deepEqual(parse(' first@example.com, second@example.com '), ['first@example.com', 'second@example.com']);
assert.deepEqual(parse('first@example.com; FIRST@example.com'), ['first@example.com']);
for (const bad of ['', 'bad', 'a@example.com,', 'a@example.com,,b@example.com', 'a@example.com\nBcc:x@example.com', 'Name <a@example.com>']) {
  assert.throws(() => parse(bad));
}
assert.throws(() => parse(Array.from({length:50}, (_, i) => `guest${i}@example.com`).join(',')));
assert.equal(ctx.invitationRecipientCount_('a@example.com,b@example.com', 'organizer@example.com'), 3);
assert.equal(ctx.invitationRecipientCount_('a@example.com,ORGANIZER@example.com', 'organizer@example.com'), 2);
assert.equal(ctx.invitationRecipientCount_('a@example.com,A@example.com', 'organizer@example.com'), 2);

// Exercise the real batch function without mail or spreadsheet access.
let quota = 2;
const sent = [], writes = [];
const record = {row:2,name:'Example group',email:'a@example.com, b@example.com',maxGuests:2,
  code:'EXAMPLE-CODE-12345678',language:'es',active:true,friday:true,saturday:true,
  fridaySpecified:true,saturdaySpecified:true,channels:['Email'],status:'Pendiente'};
Object.assign(ctx, {
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  sendingRows_:()=>({sheet:{getRange:(...args)=>({setValue:value=>writes.push([args,value]),clearContent(){}})},
    columns:{'Último intento':14,'Email enviado el':15,'Fecha envío':16,'Estado envío':17,'Error envío':18},records:[record]}),
  ensureUniqueCodes_(){},readRsvpCodes_:()=>({}),sendingLink_:code=>'https://example.com/#invitacion='+code,
  invitationBccRecipient_:()=>'organizer@example.com',
  invitationEmail_:(_r,url)=>({subject:'Invitation',body:url,htmlBody:url}),
  weddingEmailTopBlob_(){},weddingEmailBottomBlob_(){},weddingEmailGuestBlob_(){},
  MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:message=>sent.push(message)},
});
assert.throws(()=>ctx.sendInvitationEmailsByRows([2]), /cuota/);
assert.equal(sent.length,0);
assert.equal(writes.length,0);
quota=3;
assert.equal(ctx.sendInvitationEmailsByRows([2]).sent,1);
assert.equal(sent.length,1);
assert.equal(sent[0].to,'a@example.com,b@example.com');
assert.equal(sent[0].bcc,'organizer@example.com');
assert.equal(sent[0].body,'https://example.com/#invitacion='+record.code);
assert.equal(record.code,'EXAMPLE-CODE-12345678');
assert.equal(writes.filter(([args])=>args[1]===15).length,1);

// Each listed email still validates; unrelated emails do not.
vm.runInContext(fs.readFileSync(path.join(root,'Code.gs'),'utf8'),ctx);
Object.assign(ctx,{
  checkGiftAccessRate_(){},privateWeddingPaymentDetails_:()=>({ok:true}),
  normalizeGiftGuestName_:()=>'',makeHeaderIndex:()=>({}),findOptionalColumn:(_idx,names)=>names[0]==='email'?1:-1,
  getSpreadsheet:()=>({getSheetByName:()=>({getLastRow:()=>2,getDataRange:()=>({getValues:()=>[['Name','Email'],['Example','a@example.com; b@example.com']]})})}),
});
assert.equal(ctx.findGiftDetailsByGuestInput_('A@example.com').ok,true);
assert.equal(ctx.findGiftDetailsByGuestInput_('b@example.com').ok,true);
assert.throws(()=>ctx.findGiftDetailsByGuestInput_('other@example.com'),/Unable/);
console.log('Multiple-recipient validation, quota, mock dispatch and guest verification passed. No emails sent.');
