import { CastleRooms } from './CastleRooms';
import { TravelGuide } from './TravelGuide';
import type { Language } from '../types';
export function JourneyMap({lang}: {lang: Language}) {return <section id="journey" className="magazine-journey"><TravelGuide lang={lang}/><div className="magazine-stay"><CastleRooms lang={lang}/></div></section>;}