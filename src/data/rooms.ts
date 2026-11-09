export interface CastleRoomInfo {
  id: 'estandar' | 'superior' | 'deluxe' | 'suite_guardia' | 'suite_medieval' | 'suite_torreon';
  name: string;
  nameEn: string;
  total: number;
  area: string;
  image?: string; // Public path added when the actual hotel photo is available.
  photos?: string[];
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
    area: '30–34 m²',
    name: 'Habitación Estándar',
    nameEn: 'Standard Room',
    total: 9,
    description: '30–34 m² · Habitaciones más antiguas del castillo, ubicadas en las mazmorras. Muros del siglo XI.',
    descriptionEn: '30–34 m² · Oldest rooms in the castle, located in the dungeons. 11th-century walls.',
    features: ['Cama de matrimonio o dos camas', 'Desayuno incluido', 'Baño completo privado'],
    featuresEn: ['Double or twin beds', 'Breakfast included', 'Full private bathroom'],
    url: 'https://www.buenamor.net/en/habitaciones',
    photos: ['307819_0d93128286e9432a975d0471d672d609','307819_aecf130b5d924924bffe7cd7b0dbb0f9','307819_c19a73f477c1494082705fc2f4233d66'].map(id=>`https://static.wixstatic.com/media/${id}~mv2.jpg`),
  },
  {
    id: 'superior',
    area: '30–40 m²',
    name: 'Habitación Superior',
    nameEn: 'Superior Room',
    total: 8,
    description: '30–40 m² · Alojamiento amplio con cantería del siglo XV.',
    descriptionEn: '30–40 m² · Spacious accommodation with 15th-century stonework.',
    features: ['Cama King-size', 'Desayuno incluido', 'Zona de estar y reposo'],
    featuresEn: ['King-size bed', 'Breakfast included', 'Seating & relaxation area'],
    url: 'https://www.buenamor.net/en/habitaciones',
    photos: ['307819_a4ef802119ec4e379405ef4a1086e68f','307819_07a11ad6306a413285011f580515b8e7','307819_4306f4e33dea423d93012a84d87a0e9f'].map(id=>`https://static.wixstatic.com/media/${id}~mv2.jpg`),
  },
  {
    id: 'deluxe',
    area: '30–43 m²',
    name: 'Habitación Deluxe',
    nameEn: 'Deluxe Room',
    total: 13,
    description: '30–43 m² · Bóvedas o techos artesonados. Vistas a los jardines o a la terraza.',
    descriptionEn: '30–43 m² · Vaults or coffered ceilings. Views of the gardens or terrace.',
    features: ['Cama King con dosel', 'Desayuno incluido', 'Vistas privilegiadas'],
    featuresEn: ['Canopy King bed', 'Breakfast included', 'Prime castle views'],
    url: 'https://www.buenamor.net/en/habitaciones',
    photos: ['307819_b6580166b5ec4966a9d0150d9a2dcf97','307819_a8193e40484c46b68136076c0919f517','307819_dc39a573842649c3b24ae9c3904d1783'].map(id=>`https://static.wixstatic.com/media/${id}~mv2.jpg`),
  },
  {
    id: 'suite_guardia',
    area: '40–45 m²',
    name: 'Suite Paso de Guardia',
    nameEn: 'Paso de Guardia Suite',
    total: 3,
    badge: 'Exclusiva (3 únicas)',
    badgeEn: 'Exclusive (Only 3)',
    description: '40–45 m² · Suite más antigua del castillo, ubicada en las mazmorras. Muros del siglo XI y vistas al foso.',
    descriptionEn: '40–45 m² · Oldest suite in the castle, located in the dungeons. 11th-century walls and views over the moat.',
    features: ['Salón privado independiente', 'Desayuno incluido', 'Acceso directo a las almenas'],
    featuresEn: ['Private living salon', 'Breakfast included', 'Direct wall-walk access'],
    url: 'https://www.buenamor.net/en/habitaciones',
    photos: ['https://static.wixstatic.com/media/307819_bd2d196f2fdb4d1f80131d298952cbfc~mv2.jpg'],
  },
  {
    id: 'suite_medieval',
    area: '40–47 m²',
    name: 'Suite Medieval',
    nameEn: 'Medieval Suite',
    total: 3,
    badge: 'Exclusiva (3 únicas)',
    badgeEn: 'Exclusive (Only 3)',
    description: '40–47 m² · La joya del castillo: cúpulas de ladrillo mudéjar, vigas de madera o acceso privado a las torres.',
    descriptionEn: '40–47 m² · The castle crown jewel: Mudéjar brick domes, wooden beams or private access to the towers.',
    features: ['Chimenea gótica histórica', 'Desayuno incluido', 'Gran salón señorial y bañera de época'],
    featuresEn: ['Historic Gothic fireplace', 'Breakfast included', 'Grand salon & vintage tub'],
    url: 'https://www.buenamor.net/en/habitaciones',
    photos: ['https://static.wixstatic.com/media/307819_28180e5f1e2445668ed96851e210c101~mv2.jpg'],
  },
  {id: 'suite_torreon', name: 'Suite con Torreón', nameEn: 'Tower Suite', total: 2, area: '', description: '', descriptionEn: '', features: ['Desayuno incluido'], featuresEn: ['Breakfast included'], photos:['https://static.wixstatic.com/media/307819_4d8846ea77fe462f84ebabb2ad963e7a~mv2.jpg']},
];
