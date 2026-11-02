import {mkdirSync} from 'node:fs';
mkdirSync('test-results/envelope',{recursive:true});
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const [width,height,lang] of [[1440,900,'es'],[390,844,'en'],[320,568,'es'],[844,390,'en']]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:3000/?intro');await page.evaluate(()=>document.fonts.ready);
 await page.locator('.bo-intro__languages').getByRole('button',{name:lang.toUpperCase(),exact:true}).click();await page.locator('.bo-intro__envelope').click();
 await page.locator('.bo-intro__enter').waitFor();await page.waitForTimeout(width===1440?6000:1000);
 assert.equal(await page.locator('.bo-intro').count(),1,'must stay until clicked');
 const card=await page.locator('.bo-intro__letter').boundingBox(), button=await page.locator('.bo-intro__enter').boundingBox();
 assert(card.y>=0&&card.x>=0&&card.x+card.width<=width+1,'card in viewport');assert(card.y+card.height<button.y,'button must not overlap card');assert(button.y+button.height<=height,'button clipped');
 await page.screenshot({path:`test-results/envelope/${width}-reading.png`});
 await page.locator('.bo-intro__enter').click();await page.locator('.bo-intro').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>document.body.style.overflow),'');console.log(width,lang,'hold + click passed');
}
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:3000/?intro');await page.locator('.bo-intro__envelope').press('Enter');await page.locator('.bo-intro__enter').waitFor();await page.locator('.bo-intro__enter').press('Enter');await page.locator('.bo-intro').waitFor({state:'detached'});assert.equal(errors.length,0,errors.join('\n'));console.log('Reduced motion / keyboard passed');await browser.close();
