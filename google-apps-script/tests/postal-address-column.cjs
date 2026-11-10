const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ctx=vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../Code.gs'),'utf8'),ctx);
const headers=Array.from({length:24},(_,i)=>'Existing '+i);
headers[22]='Respuesta JSON';headers[23]='Custom column';
const rows=[headers];
for(const value of ['123 Example Street','', '=HYPERLINK("bad")','Already copied','Formula']){
 const row=Array(26).fill('');row[22]=JSON.stringify({postalAddress:value});row[23]='keep';rows.push(row);
}
let width=24;
const sheet={getLastColumn:()=>headers.length,getMaxColumns:()=>width,insertColumnsAfter:(_n,count)=>{width+=count},setColumnWidth(){},getLastRow:()=>rows.length,
 getRange:(r,c,n=1,m=1)=>({getValues:()=>rows.slice(r-1,r-1+n).map(row=>Array.from({length:m},(_,i)=>row[c-1+i]||'')),setValue:value=>{rows[r-1][c-1]=value},getFormula:()=>r===6?'=IF(TRUE,"","")':''})};
ctx.LockService={getScriptLock:()=>({waitLock(){},releaseLock(){}})};
ctx.getSpreadsheet=()=>({getSheetByName:()=>sheet});
assert.equal(ctx.ensurePostalAddressColumn_(sheet),25);
assert.equal(width,25);
assert.equal(headers[23],'Custom column');
assert.equal(headers[24],'Dirección postal');
rows[4][24]='Manually entered';
assert.equal(ctx.prepareRsvpPostalAddressColumn().restored,2);
assert.equal(rows[1][24],'123 Example Street');
assert.equal(rows[2][24],'');
assert.equal(rows[3][24],"'=HYPERLINK(\"bad\")");
assert.equal(rows[4][24],'Manually entered');
assert.equal(rows[5][24],'');
assert.equal(ctx.prepareRsvpPostalAddressColumn().restored,0);
assert.equal(headers.length,25);
assert(rows.slice(1).every(row=>row[23]==='keep'));
console.log('Postal column creation, repeat-safe recovery, formula escaping and custom-column preservation passed.');
