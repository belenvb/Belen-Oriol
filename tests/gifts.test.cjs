const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const Module = require('node:module');
const path = require('node:path');
function loadTs(file) {
  const filename = path.resolve(file);
  const mod = new Module(filename, module);
  mod.paths = module.paths;
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX }
  }).outputText, filename);
  return mod.exports;
}
const { venmoProfileUrl } = loadTs('src/utils/paymentLinks.ts');
test('Venmo profile routing and untrusted values', () => {
  for (const input of ['@Example-Guest', 'Example-Guest', 'https://venmo.com/Example-Guest',
    'https://venmo.com/u/Example-Guest?ref=share', 'https://account.venmo.com/u/Example-Guest']) {
    assert.equal(venmoProfileUrl(input), 'https://venmo.com/u/Example-Guest');
  }
  for (const input of ['', 'https://evil.example/u/Example-Guest', 'javascript:alert(1)',
    'https://venmo.com/account/sign-in', 'sign-in', 'First Last', 'https://venmo.com@evil.example/u/Example-Guest']) {
    assert.equal(venmoProfileUrl(input), null);
  }
});
function backend({ id = 'example_file_id_123', size = 12, mime = 'image/png', bytes = [1,2,3], denied = false } = {}) {
  let reads = 0;
  const logs = [];
  const context = vm.createContext({
    console: { log: msg => logs.push(msg), error: msg => logs.push(msg) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => id }) },
    DriveApp: { getFileById: () => { reads++; if (denied) throw Error('SECRET_FILE_ID');
      return { getSize: () => size, getBlob: () => ({ getContentType: () => mime, getBytes: () => bytes }) }; } },
    Utilities: { base64Encode: b => Buffer.from(b).toString('base64') },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ text:s, setMimeType(){return this;} }) },
    CacheService: { getScriptCache: () => ({get:()=>null,put:()=>{}}) }
  });
  vm.runInContext(fs.readFileSync('google-apps-script/Code.gs','utf8'), context);
  return {context, logs, reads:()=>reads};
}
test('private QR validation and owner-only diagnostics never log image or file ID', () => {
  for (const [config, status] of [
    [{},'ready'],[{id:''},'not_configured'],[{id:'https://drive.google.com/file/d/example/view'},'invalid_file_id'],
    [{size:600001},'too_large'],[{mime:'application/pdf'},'unsupported_type'],
    [{bytes:[]},'empty_file'],[{denied:true},'unreadable_or_unauthorized']
  ]) {
    const {context:c, logs} = backend(config);
    assert.equal(c.readPrivateWeddingPaymentQr_(config.id ?? 'example_file_id_123').status,status);
    const result=c.checkWeddingPaymentQrConfiguration();
    assert.equal(result.zelle,status); assert.equal(result.venmo,status);
    assert(!logs.join('').includes('example_file_id')); assert(!logs.join('').includes('SECRET_FILE_ID'));
    assert(!logs.join('').includes('data:image'));
  }
});
test('invalid invitation never reads private Drive images; health check has no payment data', () => {
  const b=backend();
  const response=b.context.doPost({postData:{contents:JSON.stringify({action:'giftAccess',guestInput:'xx'})}});
  assert.equal(JSON.parse(response.text).ok,false); assert.equal(b.reads(),0);
  assert(!b.context.doGet().text.includes('giftDetails')); assert.equal(b.reads(),0);
});
test('QR UI handles missing and untrusted image URLs without exposing a broken image', () => {
  const React = require('react');
  const {renderToStaticMarkup} = require('react-dom/server');
  const {PaymentQr} = loadTs('src/components/PaymentQr.tsx');
  for (const src of [undefined, '', 'https://drive.google.com/private', 'data:image/svg+xml;base64,PHN2Zz4=']) {
    const html=renderToStaticMarkup(React.createElement(PaymentQr,{method:'zelle',lang:'es',src}));
    assert(!html.includes('<img')); assert(html.includes('no está disponible'));
  }
  const html=renderToStaticMarkup(React.createElement(PaymentQr,{method:'venmo',lang:'en',src:'data:image/png;base64,AQID'}));
  assert(html.includes('<img')); assert(html.includes('photo icon'));
});
