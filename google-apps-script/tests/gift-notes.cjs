const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
function setup({recipient='organizer@example.com',quota=100,fail=false}={}){
 const entries=new Map(),messages=[];let locked=false,spreadsheetReads=0;
 const context=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:()=>recipient})},Utilities:{getUuid:()=>crypto.randomUUID()},CacheService:{getScriptCache:()=>({get:k=>entries.get(k)||null,put:(k,v)=>entries.set(k,v)})},LockService:{getScriptLock:()=>({waitLock(){assert(!locked);locked=true},releaseLock(){locked=false}})},MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:mail=>{assert(locked);messages.push(mail);if(fail)throw Error('PRIVATE_SMTP_DETAIL')}},SpreadsheetApp:{getActiveSpreadsheet(){spreadsheetReads++;throw Error('Do not read Sheets for a note')}},console:{log(){},error(){}},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this}})}});
 vm.runInContext(fs.readFileSync('google-apps-script/Code.gs','utf8'),context);
 const token=()=>context.withWeddingGiftNoteAccess_({}).giftNoteToken;
 const base=()=>({action:'giftNote',token:token(),requestId:crypto.randomUUID(),language:'en',method:'venmo',senderName:'Example Guests',note:'We wish you a wonderful future!'});
 const post=data=>JSON.parse(context.doPost({postData:{contents:JSON.stringify(data)}}).text);
 return{context,entries,messages,base,post,reads:()=>spreadsheetReads};
}
{
 const h=setup(),data=h.base();assert.match(data.token,/^[a-f0-9]{64}$/);assert.equal(h.post({...data,to:'attacker@example.com'}).ok,true);assert.equal(h.messages.length,1);assert.equal(h.messages[0].to,'organizer@example.com');assert(h.messages[0].body.includes('does not confirm a payment'));assert(h.messages[0].htmlBody.includes('Example Guests'));assert.equal(h.post(data).ok,true);assert.equal(h.messages.length,1);assert.equal(h.post({...data,requestId:crypto.randomUUID()}).ok,false);assert.equal(h.reads(),0);
}
{
 const h=setup();for(const patch of[{token:'invalid'},{token:'a'.repeat(64)},{requestId:'bad'},{method:'other'},{language:'invalid'},{senderName:''},{senderName:'x'.repeat(121)},{note:''},{note:'x'.repeat(2001)},{note:'bad\u0000'}])assert.equal(h.post({...h.base(),...patch}).ok,false);assert.equal(h.messages.length,0);
}
{
 const h=setup();assert.equal(h.post({...h.base(),senderName:'<img onerror=alert(1)>\nHeader',note:'<script>alert(1)</script>\nA & B',language:'es'}).ok,true);const mail=h.messages[0];assert(!mail.htmlBody.includes('<script>'));assert(mail.htmlBody.includes('&lt;script&gt;'));assert(mail.htmlBody.includes('A &amp; B'));assert(!mail.subject.includes('\n'));assert(mail.htmlBody.includes('no confirma ningún pago'));
 fs.mkdirSync('output',{recursive:true});fs.writeFileSync('output/gift-note-card.html',h.context.weddingGiftNoteCard_({senderName:'Alex & Sam',note:'Wishing you a lifetime of adventures, laughter and a home full of love.\n\nWe can’t wait to celebrate with you!',method:'bank',language:'en'}).htmlBody);
}
{const h=setup({quota:0});assert.equal(h.post(h.base()).ok,false);assert.equal(h.messages.length,0)}
{const h=setup({recipient:''});assert.equal(h.context.withWeddingGiftNoteAccess_({}).giftNoteToken,undefined);assert.equal(h.post({...h.base(),token:'a'.repeat(64)}).ok,false);assert.equal(h.messages.length,0)}
{const h=setup({fail:true}),data=h.base();assert.equal(h.post(data).ok,false);assert.equal(h.post(data).ok,false);assert.equal(h.messages.length,1,'ambiguous failure is not automatically resent')}
{const h=setup();h.entries.set('gift_note_hour_'+Math.floor(Date.now()/3600000),'30');assert.equal(h.post(h.base()).ok,false);assert.equal(h.messages.length,0)}
console.log('Gift note access, validation, escaping, fixed recipient, retry deduplication, failure, quota and rate checks passed. All mail calls mocked.');
