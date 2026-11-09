const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function setup({bcc='organizer@example.com',quota=10,sent=false}={}){
 const messages=[],writes=[];
 const c=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:key=>key==='WEDDING_INVITATION_BCC'?bcc:'https://wedding.example'})},MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:m=>messages.push(m)},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})}});
 vm.runInContext(fs.readFileSync('google-apps-script/InvitationSending.gs','utf8'),c);
 const record={row:2,name:'Example guest',email:'guest@example.com',code:'EXAMPLE-PRIVATE-CODE',language:'en',channels:['Email'],emailSentAt:sent,active:true,fridaySpecified:true,saturdaySpecified:true};
 c.sendingRows_=()=>({records:[record],columns:{},sheet:{getRange:()=>({setValue:v=>writes.push(v),clearContent(){}})}});
 c.ensureUniqueCodes_=()=>{};c.ensureReadyToSend_=()=>{};c.readRsvpCodes_=()=>({});
 c.invitationEmail_=()=>({subject:'Invitation',body:'Example body',htmlBody:'<p>Example body</p>'});
 c.weddingEmailTopBlob_=c.weddingEmailBottomBlob_=c.weddingEmailGuestBlob_=()=>({});
 return {c,messages,writes};
}
test('real invitation includes one hidden copy without exposing address in content or CC',()=>{const{c,messages}=setup();assert.equal(c.sendInvitationEmailsByRows([2]).sent,1);assert.equal(messages.length,1);assert.equal(messages[0].to,'guest@example.com');assert.equal(messages[0].bcc,'organizer@example.com');assert.equal(messages[0].cc,undefined);assert(!messages[0].body.includes('organizer@'));});
test('quota counts both recipients before sending or recording an attempt',()=>{const{c,messages,writes}=setup({quota:1});assert.throws(()=>c.sendInvitationEmailsByRows([2]),/cuota/);assert.equal(messages.length,0);assert.equal(writes.length,0);});
test('missing, multiple or malformed BCC blocks sending without logging the address',()=>{for(const bcc of ['', 'invalid','a@example.com,b@example.com','a@example.com\r\nBcc: b@example.com']){const{c,messages}=setup({bcc});assert.throws(()=>c.sendInvitationEmailsByRows([2]),/Configura WEDDING_INVITATION_BCC/);assert.equal(messages.length,0);}});
test('test emails also include BCC but never mark a family as sent',()=>{const{c,messages,writes}=setup();c.sendTestInvitationEmail(2,'test@example.com');assert.equal(messages[0].bcc,'organizer@example.com');assert.equal(writes.length,0);});
test('test addressed to organizer avoids duplicate copy and only uses one recipient',()=>{const{c,messages}=setup({quota:1});c.sendTestInvitationEmail(2,'ORGANIZER@example.com');assert.equal(messages[0].bcc,undefined);assert.equal(messages[0].to,'ORGANIZER@example.com');});
test('previously sent emails are skipped without requiring new setup',()=>{const{c,messages}=setup({bcc:'',sent:true});const result=c.sendInvitationEmailsByRows([2]);assert.equal(result.skipped,1);assert.equal(messages.length,0);});
