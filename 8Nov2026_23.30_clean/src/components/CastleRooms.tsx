import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { CASTLE_ROOMS } from '../data/rooms';
import type { Language } from '../types';
import { roomAvailabilityStore } from '../utils/roomAvailability';
import { loadRoomCatalogue } from '../utils/rsvp';
import './CastleRooms.css';

export function CastleRooms({ lang }: { lang: Language }) {
  const es = lang === 'es';
  const availability = useSyncExternalStore(roomAvailabilityStore.subscribe, roomAvailabilityStore.getSnapshot);
  useEffect(() => { void loadRoomCatalogue().catch(() => { /* No fallback to stale prices. */ }); }, []);
  const sortedRooms = [...CASTLE_ROOMS].sort((a, b) => {
    const aPrice = availability?.find(item => item.id === a.id)?.price;
    const bPrice = availability?.find(item => item.id === b.id)?.price;
    return (aPrice ?? Infinity) - (bPrice ?? Infinity) || CASTLE_ROOMS.indexOf(a) - CASTLE_ROOMS.indexOf(b);
  });
  const [photoRoom, setPhotoRoom] = useState<(typeof CASTLE_ROOMS)[number] | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const openPhotos = (room: (typeof CASTLE_ROOMS)[number]) => { setPhotoRoom(room); setPhotoIndex(0); };
  useEffect(() => {
    if (!photoRoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPhotoRoom(null);
      if (event.key === 'ArrowRight') setPhotoIndex(i => (i + 1) % (photoRoom.photos?.length || 1));
      if (event.key === 'ArrowLeft') setPhotoIndex(i => (i - 1 + (photoRoom.photos?.length || 1)) % (photoRoom.photos?.length || 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photoRoom]);
  const selectRoom = (roomId: string) => {
    window.dispatchEvent(new CustomEvent('select_room_in_rsvp', { detail: { roomId } }));
  };
  return (
    <section id="castle-rooms" className="castle-stay" aria-labelledby="castle-stay-title">
      <div className="castle-stay__body">
        <aside className="castle-stay__aside">
      <header className="castle-stay__header">
        <h3 id="castle-stay-title">{es ? <>Habitaciones<br /> en el castillo.</> : <>Rooms<br /> at the castle.</>}</h3>
      </header>

          <p className="castle-stay__intro">{es ? 'Tenemos habitaciones a precios especiales para nuestros invitados en el Castillo del Buen Amor, para la noche del 4 al 5 de septiembre de 2027.' : 'We have rooms at special rates for our wedding guests at Castillo del Buen Amor for the night of September 4–5, 2027.'}</p>
          <p>{es ? 'Para el bloqueo preliminar, envíanos tu solicitud antes del 31 de diciembre.' : 'Please send us your request before December 31 for the preliminary room block.'}</p>
          <p>{es ? 'Las habitaciones del castillo se asignan por orden de confirmación en el formulario de RSVP. La selección de habitación es una solicitud y queda sujeta a confirmación.' : 'Castle rooms are allocated in order of confirmation in the RSVP form. Room selection is a request and remains subject to confirmation.'}</p>
          <a className="castle-stay__explore" href={es ? 'https://www.buenamor.net/habitaciones' : 'https://www.buenamor.net/en/habitaciones'} target="_blank" rel="noopener noreferrer">{es ? 'Ver fotos de las habitaciones' : 'View room photos'} <span aria-hidden="true">↗</span></a>
        </aside>
        <div className="castle-stay__catalogue">
          <div className="castle-stay__columns"><span>{es ? 'Categoría' : 'Category'}</span><span>{es ? '€ / noche' : '€ / night'}</span></div>
          <ul className="castle-stay__list">
            {sortedRooms.map((room) => {
              const live = availability?.find(item => item.id === room.id);
              const name = es ? room.name.replace('Habitación ', '') : room.nameEn.replace(' Room', '');
              return <li key={room.id} className="castle-stay__room">
                {room.image && <figure><img src={room.image} alt={es ? room.name : room.nameEn} loading="lazy" decoding="async" /></figure>}
                <div className="castle-stay__name"><div className="castle-stay__name-line"><h4><button className="castle-stay__photo-link" type="button" onClick={() => openPhotos(room)} title={es ? 'Ver fotos de esta habitación' : 'View photos of this room'}>{name} <span aria-hidden="true">↗</span></button></h4><p>{live ? (es ? `${live.remaining} disponibles` : `${live.remaining} available`) : (es ? 'Disponibilidad con tu código' : 'Availability with your code')}</p></div>

                </div>
                <span className="castle-stay__price">{live?.price != null
                  ? <>{new Intl.NumberFormat(es ? 'es-ES' : 'en-GB', { maximumFractionDigits: 2 }).format(live.price)} <small>€</small></>
                  : <span className="castle-stay__price-pending">{es ? 'Consultar tarifa' : 'Rate on request'}</span>}
                  <span className="castle-stay__breakfast">{es ? 'Desayuno incluido' : 'Breakfast included'}</span></span>
                <button type="button" disabled={live?.remaining === 0} onClick={() => selectRoom(room.id)} aria-label={`${es ? 'Solicitar' : 'Request'} ${name}`}><span>{live?.remaining === 0 ? (es ? 'Agotada' : 'Full') : (es ? 'Solicitar' : 'Request')}</span> <span aria-hidden="true">↗</span></button>
              </li>;
            })}
          </ul>
        </div>
      </div>
      {photoRoom && createPortal(<div className="castle-photos__overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setPhotoRoom(null); }}>
        <div className={`castle-photos__dialog${photoRoom.id === 'suite_medieval' ? ' castle-photos__dialog--medieval' : ''}`} role="dialog" aria-modal="true" aria-label={es ? `Fotos de ${photoRoom.name}` : `Photos of ${photoRoom.nameEn}`}>
          <button className="castle-photos__close" type="button" onClick={() => setPhotoRoom(null)} aria-label={es ? 'Cerrar fotos' : 'Close photos'}>×</button>
          <div className="castle-photos__image-wrap"><img src={photoRoom.photos?.[photoIndex]} alt={`${es ? photoRoom.name : photoRoom.nameEn} — ${photoIndex + 1}`} /></div>
          <div className="castle-photos__footer"><div><h3>{es ? photoRoom.name : photoRoom.nameEn}</h3><p>{es ? 'Fotografías del Castillo del Buen Amor' : 'Photos from Castillo del Buen Amor'} · {photoIndex + 1}/{photoRoom.photos?.length || 1}</p></div>
          <div className="castle-photos__actions">{(photoRoom.photos?.length || 0) > 1 && <><button type="button" onClick={() => setPhotoIndex(i => (i - 1 + photoRoom.photos!.length) % photoRoom.photos!.length)} aria-label={es ? 'Foto anterior' : 'Previous photo'}>←</button><button type="button" onClick={() => setPhotoIndex(i => (i + 1) % photoRoom.photos!.length)} aria-label={es ? 'Foto siguiente' : 'Next photo'}>→</button></>}</div></div>
          <p className="castle-photos__booking-note">{es ? 'Las habitaciones se solicitan exclusivamente desde el formulario de nuestra web.' : 'Please request rooms exclusively through the form on our wedding website.'}</p>
        </div>
      </div>, document.body)}
    </section>
  );
}
