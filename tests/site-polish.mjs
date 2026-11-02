import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
mkdirSync('test-results/portada',{recursive:true});
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>sessionStorage.setItem('belen_oriol_invitation_opened','true'));
let submits=[],fail=true;
await page.route('**/script.google.com/**',async route=>{const body=route.request().postDataJSON();if(body.action==='lookup'){await route.fulfill({json:body.invitationCode==='BAD'?{ok:false,error:'INVALID'}:{ok:true,maxGuests:2,invitedToPreboda:true,guests:[{fullName:'Prueba Invitado',email:'test@example.com'}]}})}else{submits.push(body);await route.fulfill({json:fail?{ok:false,error:'TEST_FAIL'}:{ok:true,submissionId:body.submissionId}})}});
for(const [width,height] of [[1440,900],[390,844],[320,568],[844,390]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:3000/?no-intro');await page.evaluate(()=>document.fonts.ready);
 for(const lang of ['es','en']){
 await page.locator('.wedding-header__languages').getByRole('button',{name:lang.toUpperCase(),exact:true}).click();
 assert.equal(await page.locator('#hero .eyebrow').textContent(),'SAVE THE DATE');assert.equal(await page.getByText(/Hoteles en Salamanca Ciudad|Hotels in Salamanca City/).count(),0);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 if(width<1100){await page.locator('.wedding-header__toggle').click();await page.locator('#wedding-mobile-menu').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('#wedding-mobile-menu').count(),0);}
 if(width===1440||width===390)await page.screenshot({path:`test-results/portada/hero-${width}-${lang}.png`});
 console.log(`${width} ${lang}: layout/menu/SAVE THE DATE passed`);
 }
}
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:3000/?no-intro');await page.locator('.wedding-header__languages').getByRole('button',{name:'EN',exact:true}).click();
await page.locator('#hero .hero-quick-links button').last().click();await page.locator('#rsvp .rsvp-confirm-button').click();
await page.getByLabel('Your private invitation code').fill('BAD');await page.getByRole('button',{name:'Open my invitation',exact:true}).click();await page.getByRole('alert').waitFor();
await page.getByLabel('Your private invitation code').fill('TEST-ONLY');await page.getByRole('button',{name:'Open my invitation',exact:true}).click();await page.locator('#rsvp-questionnaire').waitFor();
assert.equal(await page.getByLabel('Full Name *',{exact:true}).inputValue(),'Prueba Invitado');await page.locator('#rsvp-questionnaire button[type=submit]').click();await page.getByRole('alert').waitFor();assert.equal(await page.getByLabel('Full Name *',{exact:true}).inputValue(),'Prueba Invitado');
fail=false;await page.locator('#rsvp-questionnaire button[type=submit]').click();await page.getByRole('status').waitFor();assert.equal(submits.length,2);assert.equal(submits[0].submissionId,submits[1].submissionId,'retry ID must be stable');await page.getByRole('status').screenshot({path:'test-results/portada/rsvp-confirmation-mobile.png'});
await page.getByRole('button',{name:'Edit RSVP',exact:true}).click();await page.locator('#rsvp-questionnaire').waitFor();assert.equal(await page.getByLabel('Full Name *',{exact:true}).inputValue(),'Prueba Invitado');
assert.equal(errors.length,0,errors.join('\n'));console.log('RSVP: invalid code, lookup, failed submit, retained data, retry idempotency, success and edit passed. All requests intercepted; none sent to live service.');
await browser.close();
