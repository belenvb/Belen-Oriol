// Exercise the React component's transition handlers without a browser renderer.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { transformSync } = require('esbuild');
let states = [], cursor = 0;
const react = {
 useState(initial) { const id = cursor++; if (!(id in states)) states[id] = initial; return [states[id], value => { states[id] = typeof value === 'function' ? value(states[id]) : value; }]; },
 useRef(value) { const id = cursor++; return states[id] ||= { current: value }; },
 useMemo(fn) { return fn(); }, useEffect() {},
};
class ElementShim { closest() { return null; } }
const jsx = (type, props) => ({ type, props: props || {} });
const moduleShim = { exports: {} };
const source = transformSync(fs.readFileSync('src/components/TransportPassport.tsx','utf8'), { loader:'tsx', format:'cjs', jsx:'automatic' }).code;
vm.runInNewContext(source, { Element:ElementShim, module:moduleShim, exports:moduleShim.exports, require(name) {
 if(name==='react')return react;
 if(name==='react/jsx-runtime') return {jsx,jsxs:jsx,Fragment:'fragment'};
 if(name==='lucide-react')return new Proxy({}, {get:(_,key)=>String(key)});
 return {};
}});
function render(lang='es') { cursor=0; return moduleShim.exports.TransportPassport({lang}); }
function nodes(tree, predicate) { if(!tree)return [];if(Array.isArray(tree))return tree.flatMap(t=>nodes(t,predicate));if(typeof tree!=='object')return [];return [...(predicate(tree)?[tree]:[]),...nodes(tree.props.children,predicate)]; }
function cls(tree, text) { return nodes(tree,n=>n.props.className?.split(' ').includes(text))[0]; }
function click(tree,label) { const button=nodes(tree,n=>n.props['aria-label']===label)[0]; assert(button, label); assert(!button.props.disabled,label+' enabled');button.props.onClick(); }
function endTurn(tree) { const leaf=cls(tree,'passport-turning-sheet');assert(leaf,'real turning leaf mounted');const target={};leaf.props.onAnimationEnd({target,currentTarget:target}); }
for(const lang of ['es','en']) {
 states=[];let tree=render(lang);
 click(tree,lang==='es'?'Abrir pasaporte':'Open passport');tree=render(lang);
 assert(cls(tree,'is-open'));
 const spread = cls(tree, 'passport-spread');
 spread.props.onPointerDown({target:new ElementShim(),clientX:100,clientY:100});
 spread.props.onPointerUp({clientX:102,clientY:250});
 tree=render(lang);
 assert(!cls(tree,'is-flipping'),'vertical dragging must not turn the book');
 click(tree,lang==='es'?'Página siguiente':'Next page');tree=render(lang);
 assert(cls(tree,'is-flipping'));endTurn(tree);tree=render(lang);
 assert(!cls(tree,'is-flipping'));
 click(tree,lang==='es'?'Página siguiente':'Next page');tree=render(lang);
 assert(cls(tree,'is-closed'));assert(cls(tree,'is-back-cover'));
 click(tree,lang==='es'?'Volver a la portada':'Back to cover');tree=render(lang);
 assert(cls(tree,'is-closed'));assert(!cls(tree,'is-back-cover'),'cover control works from the end');
 click(tree,lang==='es'?'Abrir pasaporte':'Open passport');tree=render(lang);
 click(tree,lang==='es'?'Página siguiente':'Next page');tree=render(lang);endTurn(tree);tree=render(lang);
 click(tree,lang==='es'?'Página siguiente':'Next page');tree=render(lang);
 click(tree,lang==='es'?'Abrir pasaporte':'Open passport');tree=render(lang);
 click(tree,lang==='es'?'Página anterior':'Previous page');tree=render(lang);
 assert(cls(tree,'passport-turning-front').props.children.props.page.id === 'trains', 'reverse turn reveals the train page on its original face');
 endTurn(tree);tree=render(lang);
 assert(cls(tree,'is-open'));assert(!cls(tree,'is-flipping'));
}
assert(!source.includes('preventDefault'), 'passport must never cancel document scrolling');
console.log('PASS: ES/EN open, turn, direct closing, reopen, reverse, cover return and vertical gestures.');
