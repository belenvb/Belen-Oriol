export interface CastleRoomInfo {
  id: 'estandar' | 'superior' | 'deluxe' | 'suite_guardia' | 'suite_medieval';
  name: string;
  nameEn: string;
  price: number;
  total: number;
  description: string;
  descriptionEn: string;
  badge?: string;
  badgeEn?: string;
  features: string[];
  featuresEn: string[];
  url?: string;
}

export const CASTLE_ROOMS: CastleRoomInfo[] = [
  {
    id: 'estandar',
    name: 'Habitación Estándar',
    nameEn: 'Standard Room',
    price: 128,
    total: 10,
    description: 'Habitaciones más antiguas del castillo, ubicadas en las mazmorras. Muros del siglo XI.',
    descriptionEn: 'Oldest rooms in the castle located in the dungeons. 11th century walls. 30 - 34 M2',
    features: ['Cama de matrimonio o dos camas', 'Desayuno incluido', 'Baño completo privado'],
    featuresEn: ['Double or twin beds', 'Breakfast included', 'Full private bathroom'],
    url: 'https://buenamor.net/alojamiento/habitaciones/',
  },
  {
    id: 'superior',
    name: 'Habitación Superior',
    nameEn: 'Superior Room',
    price: 145,
    total: 10,
    description: 'Alojamiento amplio con cantería del siglo XV.',
    descriptionEn: 'Spacious accommodation with 15th-century stonework. 30-40 M2',
    features: ['Cama King-size', 'Desayuno incluido', 'Zona de estar y reposo'],
    featuresEn: ['King-size bed', 'Breakfast included', 'Seating & relaxation area'],
    url: 'https://buenamor.net/alojamiento/habitaciones/',
  },
  {
    id: 'deluxe',
    name: 'Habitación Deluxe',
    nameEn: 'Deluxe Room',
    price: 170,
    total: 10,
    description: 'Bóvedas o techos artesonados. Vistas a los jardines o a la terraza.',
    descriptionEn: 'Vaults or coffered ceilings. Views of the gardens or terrace. 30-43 M2',
    features: ['Cama King con dosel', 'Desayuno incluido', 'Vistas privilegiadas'],
    featuresEn: ['Canopy King bed', 'Breakfast included', 'Prime castle views'],
    url: 'https://buenamor.net/alojamiento/habitaciones/',
  },
  {
    id: 'suite_guardia',
    name: 'Suite Paso de Guardia',
    nameEn: 'Paso de Guardia Suite',
    price: 199,
    total: 3,
    badge: 'Exclusiva (3 únicas)',
    badgeEn: 'Exclusive (Only 3)',
    description: 'Suite más antigua del castillo, ubicada en las mazmorras. Muros del siglo XI y vistas al foso.',
    descriptionEn: 'Oldest suite in the castle located in the dungeons. 11th century walls and overlooking the moat. 40-45 M2',
    features: ['Salón privado independiente', 'Desayuno incluido', 'Acceso directo a las almenas'],
    featuresEn: ['Private living salon', 'Breakfast included', 'Direct wall-walk access'],
    url: 'https://buenamor.net/alojamiento/habitaciones/',
  },
  {
    id: 'suite_medieval',
    name: 'Suite Medieval',
    nameEn: 'Medieval Suite',
    price: 230,
    total: 3,
    badge: 'Exclusiva (3 únicas)',
    badgeEn: 'Exclusive (Only 3)',
    description: 'La joya del castillo: cúpulas de ladrillo mudéjar, vigas de madera o acceso privado a las torres.',
    descriptionEn: 'The castle crown jewel: Mudejar brick domes, wooden beams or private access to the towers. 40-47 M2',
    features: ['Chimenea gótica histórica', 'Desayuno incluido', 'Gran salón señorial y bañera de época'],
    featuresEn: ['Historic Gothic fireplace', 'Breakfast included', 'Grand salon & vintage tub'],
    url: 'https://buenamor.net/alojamiento/habitaciones/',
  },
];

const STORAGE_KEY = 'belen_oriol_room_reservations';

// Initial pre-booked count so guest sees live dynamic remaining rooms
const DEFAULT_BOOKINGS: Record<string, number> = {
  estandar: 2,
  superior: 3,
  deluxe: 2,
  suite_guardia: 1,
  suite_medieval: 1,
};

export function getCastleRoomBookings(): Record<string, number> {
  if (typeof window === 'undefined') return DEFAULT_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return DEFAULT_BOOKINGS;
}

export function recordRoomBooking(roomId: string): void {
  if (typeof window === 'undefined' || !roomId || roomId === 'none') return;
  try {
    const current = getCastleRoomBookings();
    const updated = {
      ...current,
      [roomId]: (current[roomId] || 0) + 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('room_reservations_changed'));
  } catch {
    // Fallback
  }
}

