import { useState } from 'react';
import { Plane, Train, MapPin } from 'lucide-react';
import { Language } from '../types';
export function TransportPassport({lang}: {lang: Language}) {
 const [currentPage,setCurrentPage]=useState(0);
 const isSpanish=lang==='es';
 const dateFormatted='04.09.2027';
  const pages = [
    {
      id: 'flights',
      num: '01',
      pageLabel: isSpanish ? 'VISADO AÉREO · PÁG. 01' : 'AIR TRAVEL VISA · PG. 01',
      icon: Plane,
      iconRotate: '-rotate-45',
      badge: isSpanish ? 'EN AVIÓN' : 'BY AIR',
      title: isSpanish ? 'Vuelos & Aeropuertos' : 'Flights & Airports',
      subtitle: isSpanish ? 'MADRID-BARAJAS & VALLADOLID' : 'MADRID-BARAJAS & VALLADOLID',
      card1Title: isSpanish ? 'Madrid-Barajas (MAD) → Salamanca:' : 'Madrid-Barajas (MAD) → Salamanca:',
      card1Distance: isSpanish ? '220 km (~2h en coche / 1h 35m en tren directo)' : '220 km (137 miles) · ~2h drive / 1h 35m direct train',
      card1Text: isSpanish
        ? 'El aeropuerto internacional de Madrid-Barajas se encuentra a 220 km de Salamanca. Desde la Terminal 4 existe tren directo de Cercanías hasta la estación de Madrid-Chamartín en solo 12-15 minutos.'
        : 'Madrid-Barajas Airport is 220 km (137 miles) from Salamanca. Ideal for international arrivals. From Terminal 4, commuter trains connect directly to Madrid-Chamartín station in just 12-15 minutes.',
      card2Title: isSpanish ? 'Barcelona ✈ Valladolid (VLL):' : 'Barcelona ✈ Valladolid (VLL):',
      card2Distance: isSpanish ? '115 km a Salamanca (~1h en coche / 45 min en tren)' : '115 km (71 miles) · ~1h drive / 45m train',
      card2Text: isSpanish
        ? 'Vuelos directos Barcelona (BCN) – Valladolid (VLL). Desde Valladolid a Salamanca hay tren directo en ~45 min o cómodo trayecto por autovía en ~1 hora.'
        : 'Direct flights Barcelona (BCN) to Valladolid (VLL). From Valladolid to Salamanca: direct train in ~45 min or easy highway drive in ~1 hour.',
      tagline: isSpanish
        ? 'Distancia Madrid-Salamanca: 220 km · Tren directo Alvia o autovía'
        : 'Madrid-Salamanca distance: 220 km (137 miles) · Direct Alvia train or highway',
      stampText: `AEROPUERTO · ${dateFormatted}`,
      stampSub: 'CONTROL DE ENTRADA / ENTRY',
    },
    {
      id: 'trains',
      num: '02',
      pageLabel: isSpanish ? 'TREN & CARRETERA · PÁG. 02' : 'TRAIN & DRIVING · PG. 02',
      icon: Train,
      iconRotate: '',
      badge: isSpanish ? 'TREN O COCHE' : 'TRAIN / DRIVING',
      title: isSpanish ? 'Llegada a Salamanca' : 'Arrival in Salamanca',
      subtitle: isSpanish ? 'TREN RÁPIDO ALVIA & AUTOVÍAS DIRECTAS' : 'DIRECT ALVIA TRAIN & HIGHWAY DRIVE',
      card1Title: isSpanish ? 'Madrid – Salamanca en Tren:' : 'Madrid – Salamanca by Train:',
      card1Distance: isSpanish ? '1h 35m trayecto directo' : '1h 35m direct high-speed journey',
      card1Text: isSpanish
        ? 'Tren Alvia (Renfe) directo desde la estación de Madrid-Chamartín hasta la estación de Salamanca en 1h 35m con varias frecuencias diarias.'
        : 'Direct high-speed Alvia train from Madrid-Chamartín Station to central Salamanca in 1h 35m with frequent daily departures.',
      card1Link: {
        url: 'https://www.renfe.com',
        text: isSpanish ? 'Consultar billetes y horarios en Renfe.com' : 'Check schedules & tickets on Renfe.com',
      },
      card2Title: isSpanish ? 'Barcelona / Trayecto en Coche:' : 'Barcelona / Driving Route:',
      card2Distance: isSpanish ? 'Autovía directa sin peajes' : 'Direct toll-free highway connection',
      card2Text: isSpanish
        ? 'En tren: Alvia directo o trenes con enlace en Madrid (Chamartín) en ~5h 30m. En coche: cómodo trayecto por autovía directa desde Madrid (~2 horas / 220 km).'
        : 'By train: direct Alvia or connecting train in Madrid (~5h 30m). By car: smooth, direct highway drive from Madrid (~2 hours / 137 miles) with easy signage.',
      tagline: isSpanish
        ? 'Trenes Alvia diarios y conexión directa por autovía'
        : 'Daily Alvia high-speed trains & direct highway routes',
      stampText: `ESTACIÓN SALAMANCA · ${dateFormatted}`,
      stampSub: 'TRÁNSITO FERROVIARIO',
    },
    {
      id: 'castle',
      num: '03',
      pageLabel: isSpanish ? 'DÍA DE LA BODA · PÁG. 03' : 'WEDDING DAY · PG. 03',
      icon: MapPin,
      iconRotate: '',
      badge: isSpanish ? 'DÍA DE LA BODA' : 'WEDDING DAY',
      title: isSpanish ? 'Castillo del Buen Amor' : 'Castillo del Buen Amor',
      subtitle: isSpanish ? 'SEDE DE LA CEREMONIA & BANQUETE' : 'CEREMONY & RECEPTION VENUE',
      card1Title: isSpanish ? 'Servicio de Autobús:' : 'Guest Shuttle Bus:',
      card1Distance: isSpanish ? 'Salamanca ⇄ Castillo (Incluido)' : 'Salamanca ⇄ Castle (Included)',
      card1Text: isSpanish
        ? 'Servicio de autobús el sábado 4 entre Salamanca y el castillo para la ceremonia y el banquete, con servicio de regreso al finalizar la fiesta.'
        : 'Complimentary guest shuttle bus on Saturday between Salamanca and the castle for the ceremony and reception, with return service after the party.',
      card2Title: isSpanish ? 'En Coche o Taxi:' : 'By Car or Taxi:',
      card2Distance: isSpanish ? '20 km al norte (~25 min)' : '20 km (12.5 miles) north · ~25 min',
      card2Text: isSpanish
        ? 'Situado a 20 km al norte de Salamanca (unos 25 minutos en coche o taxi). El castillo dispone de amplio aparcamiento privado gratuito para todos los invitados.'
        : 'Located 20 km (12.5 miles) north of central Salamanca (~25 minutes by car or taxi). Free private on-site parking is available for all wedding guests.',
      tagline: isSpanish
        ? 'A 25 minutos de Salamanca · Autobús de invitados y parking privado'
        : '25 minutes from Salamanca · Guest shuttle & free parking',
      stampText: `CASTILLO BUEN AMOR · ${dateFormatted}`,
      stampSub: 'SELLO OFICIAL DE ENTRADA',
    },
  ];

 const current=pages[currentPage];
 return <div className="travel-guide"><div className="travel-tabs">{pages.map((page,i)=><button key={page.id} aria-pressed={i===currentPage} onClick={()=>setCurrentPage(i)}>{page.badge}</button>)}</div><h3>{current.title}</h3><div className="travel-columns"><div><h4>{current.card1Title}</h4><p>{current.card1Distance}</p><p>{current.card1Text}</p>{current.card1Link&&<a className="editorial-link" href={current.card1Link.url} target="_blank" rel="noreferrer">{current.card1Link.text} ↗</a>}</div><div><h4>{current.card2Title}</h4><p>{current.card2Distance}</p><p>{current.card2Text}</p></div></div></div>;
}
