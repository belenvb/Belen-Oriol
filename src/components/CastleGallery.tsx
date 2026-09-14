import { HandDrawnBotanicalVine } from './BotanicalVine';
import { Language } from '../types';

function GothicMotif() {
 return <svg className="gothic-motif" viewBox="0 0 260 90" aria-hidden="true">
  <path d="M8 80V54C8 28 27 10 50 10s42 18 42 44v26M92 80V54c0-26 18-44 38-44s38 18 38 44v26M168 80V54c0-26 19-44 42-44s42 18 42 44v26" />
  <path d="M8 80h244M50 10c-5 18-5 46 0 70M130 10c-4 18-4 46 0 70M210 10c-5 18-5 46 0 70" />
  <path d="M21 34l29-24 29 24M104 34l26-24 26 24M181 34l29-24 29 24" />
 </svg>;
}

export function CastleGallery({lang}: {lang: Language}) {
 return <section id="castle" className="castle-editorial invitation-inspired">
  <div className="castle-corner castle-corner-left" aria-hidden="true"/><div className="castle-corner castle-corner-right" aria-hidden="true"/>
  <p className="eyebrow">03 / {lang==='es'?'El lugar':'The place'}</p>
  <div className="castle-editorial-grid">
   <div><h2>Castillo<br/>del <em>Buen Amor.</em></h2><GothicMotif/><HandDrawnBotanicalVine className="castle-botanical" /></div>
   <div><p className="castle-intro">{lang==='es'?'Castillo del siglo XV · Villanueva de Cañedo, Salamanca':'15th-century castle · Villanueva de Cañedo, Salamanca'}</p><p>{lang==='es'?'La ceremonia, el banquete y la fiesta tendrán lugar en el castillo.':'The ceremony, dinner and party will all take place at the castle.'}</p><address>Villanueva de Cañedo<br/>37799 Topas, Salamanca</address><a className="editorial-link" href="https://maps.google.com/?q=Castillo+del+Buen+Amor+Topas+Salamanca" target="_blank" rel="noreferrer">{lang==='es'?'Cómo llegar':'Get directions'} ↗</a><p className="castle-travel">{lang==='es'?'A unos 25 minutos de Salamanca · aparcamiento privado · autobús para invitados':'Around 25 minutes from Salamanca · private parking · guest shuttle'}</p></div>
  </div>
 </section>;
}
