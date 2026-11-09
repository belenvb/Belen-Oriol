const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('google-apps-script/InvitationSending.gs','utf8');
const ctx=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'https://wedding.example'})}});
vm.runInContext(source,ctx);
const code='EXAMPLE-PRIVATE-CODE-ONLY';
test('personal links carry language before the private fragment',()=>{
 for(const [input,expected]of [['en','en'],['es','es'],[' EN ','en'],[undefined,'es'],['fr','es']]){
  const url=new URL(ctx.sendingLink_(code,input));
  assert.equal(url.searchParams.get('lang'),expected);
  assert.equal(url.hash,'#invitacion='+code);
  assert(!url.search.includes(code));
 }
 assert.throws(()=>ctx.sendingLink_('bad','en'));
});
test('email and WhatsApp preserve language in their destination links',()=>{
 for(const language of ['es','en']){
  const record={name:'Example guest',code,shortCode:'ABC234',language,friday:false};
  const link=ctx.sendingLink_(code,language);
  const email=ctx.invitationEmail_(record,link);
  const copy=ctx.sendingCopy_(record,link);
  assert(email.htmlBody.includes(link));
  assert(copy.whatsapp.endsWith(link));
  assert(copy.sms.endsWith(link));
 }
});
test('all delivery call sites pass the invitation language',()=>{
 const calls=[...source.matchAll(/sendingLink_\((r|record)\.code([^)]*)\)/g)];
 assert(calls.length>=6);
 for(const call of calls) assert.equal(call[2],', '+call[1]+'.language');
});
