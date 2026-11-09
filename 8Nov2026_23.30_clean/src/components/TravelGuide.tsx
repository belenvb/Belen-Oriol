import { useState } from 'react';
import { Plane, Train } from 'lucide-react';
import type { Language } from '../types';
type Route = { id:string; num:string; icon:typeof Plane; badge:string; title:string; subtitle:string; card1Title:string; card1Distance:string; card1Text:string; card1Link?:{url:string;text:string}; card2Title:string; card2Distance:string; card2Text:string; tagline:string; stampText:string; stampSub:string };
export function TravelGuide({lang}: {lang: Language}) {
const [selected, setSelected] = useState('flights');
const isSpanish = lang === 'es'; const numericDate = '04.09.2027';
    const flights: Route = {
      id: 'flights',
      num: '01',
      icon: Plane,
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos' : 'Flights',
      subtitle: 'MADRID · VALLADOLID',
      card1Title: 'Madrid-Barajas (MAD)',
      card1Distance: isSpanish ? '220 km a Salamanca · ~2 h en coche / 1 h 35 min en tren' : '220 km / 137 miles to Salamanca · ~2 hr drive / 1 hr 35 min train',
      card1Text: isSpanish ? 'Madrid es el mejor aeropuerto internacional. Desde la T4, conecta con Chamartín y toma el tren directo a Salamanca.' : 'Madrid is the best international airport. From T4, connect to Chamartín and take the direct train to Salamanca.',
      card2Title: 'Valladolid (VLL)',
      card2Distance: isSpanish ? '115 km a Salamanca · ~1 h en coche / 45 min en tren' : '115 km / 71 miles to Salamanca · ~1 hr drive / 45 min train',
      card2Text: isSpanish ? 'Valladolid puede ser una alternativa cómoda para vuelos desde Barcelona y conexiones nacionales.' : 'Valladolid can be a convenient alternative for flights from Barcelona and domestic connections.',
      tagline: isSpanish ? 'Dos aeropuertos posibles según origen' : 'Two airport options depending on origin',
      stampText: `${isSpanish ? 'AEROPUERTO' : 'AIRPORT'} · ${numericDate}`,
      stampSub: 'ENTRY / ENTRADA',
    };

    const trains: Route = {
      id: 'trains',
      num: '02',
      icon: Train,
      badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING',
      title: isSpanish ? 'Trenes' : 'Trains',
      subtitle: isSpanish ? 'ALVIA · COCHE · CONEXIONES' : 'ALVIA · CAR · CONNECTIONS',
      card1Title: isSpanish ? 'Madrid → Salamanca en tren' : 'Madrid → Salamanca by train',
      card1Distance: isSpanish ? '1 h 35 min · trayecto directo' : '1 hr 35 min · direct journey',
      card1Text: isSpanish ? 'Renfe opera trenes Alvia directos desde Madrid-Chamartín a Salamanca con varias frecuencias diarias. Desde Barcelona también hay opciones ferroviarias con conexión.' : 'Renfe operates direct Alvia services from Madrid-Chamartín to Salamanca several times a day. From Barcelona, rail connections are also available.',
      card1Link: { url: 'https://www.renfe.com', text: isSpanish ? 'Consultar Renfe' : 'Check Renfe' },
      card2Title: isSpanish ? 'En coche' : 'By car',
      card2Distance: isSpanish ? 'Madrid → Salamanca · ~2 h' : 'Madrid → Salamanca · ~2 hr',
      card2Text: isSpanish ? 'La ruta en coche desde Madrid es sencilla y directa.' : 'The drive from Madrid is simple and direct.',
      tagline: isSpanish ? 'Salamanca por tren o carretera' : 'Salamanca by rail or road',
      stampText: `SALAMANCA · ${numericDate}`,
      stampSub: 'TRANSIT / TRÁNSITO',
    };




return <div className="fashion-travel">
<div className="fashion-travel__destination"><figure className="fashion-travel__photo"><img src="/castle-sketch-transparent.webp" alt={isSpanish ? 'Ilustración del Castillo del Buen Amor' : 'Illustration of Castillo del Buen Amor'} loading="lazy"/><figcaption>CASTILLO DEL BUEN AMOR <span>SALAMANCA</span></figcaption></figure><div className="fashion-travel__venue"><h3>Castillo del Buen Amor</h3><p>{isSpanish ? 'Ceremonia, banquete y fiesta' : 'Ceremony, dinner & party'} · Villanueva de Cañedo</p><a href="https://www.google.com/maps/search/?api=1&query=Castillo+del+Buen+Amor+Villanueva+de+Canedo+Salamanca" target="_blank" rel="noreferrer">{isSpanish ? 'Ver ubicación' : 'View location'} ↗</a></div></div>
<div className="fashion-travel__copy"><h2>{isSpanish ? <>Viaje<br/><em>&amp; estancia.</em></> : <>Travel<br/><em>&amp; stay.</em></>}</h2>

<div className="fashion-travel__tabs" role="group" aria-label={isSpanish ? 'Transporte' : 'Transport'}>{[flights,trains].map((route,index)=><button key={route.id} type="button" aria-pressed={selected === route.id} onClick={()=>setSelected(route.id)}><span>0{index+1}</span>{route.id === 'flights' ? (isSpanish ? 'Avión' : 'Flights') : (isSpanish ? 'Tren y coche' : 'Train & car')}</button>)}</div>
<div className="fashion-travel__information" aria-live="polite">{[flights,trains].filter(route=>route.id===selected).map(route=><div key={route.id} className="fashion-travel__columns"><article><h4>{route.card1Title}</h4><p className="fashion-travel__distance">{route.card1Distance}</p><p>{route.card1Text}</p>{route.card1Link && <a href={route.card1Link.url} target="_blank" rel="noreferrer">{route.card1Link.text} ↗</a>}</article><article><h4>{route.card2Title}</h4><p className="fashion-travel__distance">{route.card2Distance}</p><p>{route.card2Text}</p></article></div>)}</div>
<aside className="fashion-travel__wedding-shuttle"><h4>{isSpanish ? 'El día de la boda · Sábado 4' : 'Wedding day · Saturday 4'}</h4><p>{isSpanish ? 'Habrá un autobús gratuito para invitados entre Salamanca y el castillo, con regreso al finalizar la celebración.' : 'A complimentary guest shuttle will run between Salamanca and the castle, returning after the celebration.'}</p><p className="fashion-travel__castle-distance">{isSpanish ? 'El castillo está a 20 km de Salamanca (25 min), con aparcamiento privado.' : 'The castle is 20 km (12.5 miles; 25 min) from Salamanca, with private parking.'}</p></aside>
</div></div>;
}
