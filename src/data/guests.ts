export interface GuestData {
  id: string;
  code: string;
  name: string;
  tier: 'all' | 'wedding_only';
  invitedToPreboda?: boolean;
  partySize?: number;
  note?: string;
}

export type GuestProfile = GuestData;

export const KNOWN_GUESTS: GuestData[] = [
  {
    id: 'preboda-vip',
    code: 'BO-PREBODA',
    name: 'Invitado Preboda & Boda',
    tier: 'all',
    partySize: 2,
    note: 'Invitación completa para el fin de semana: Viernes 3 (Preboda Salamanca) y Sábado 4 (Castillo del Buen Amor).',
  },
  {
    id: 'boda-standard',
    code: 'BO-BODA',
    name: 'Invitado Boda',
    tier: 'wedding_only',
    partySize: 2,
    note: 'Invitación para la gran celebración del Sábado 4 de Septiembre en el Castillo del Buen Amor.',
  },
  {
    id: 'belen',
    code: 'BELEN',
    name: 'Belén Vicente Blázquez',
    tier: 'all',
    partySize: 2,
  },
  {
    id: 'oriol',
    code: 'ORIOL',
    name: 'Oriol',
    tier: 'all',
    partySize: 2,
  },
  {
    id: 'familia',
    code: 'FAMILIA',
    name: 'Familia',
    tier: 'all',
    partySize: 4,
  },
  {
    id: 'amigos-preboda',
    code: 'AMIGOS',
    name: 'Queridos Amigos',
    tier: 'all',
    partySize: 2,
  },
  {
    id: 'castillo-guest',
    code: 'CASTILLO',
    name: 'Invitado Castillo',
    tier: 'wedding_only',
    partySize: 2,
  },
  {
    id: 'general',
    code: 'BO2027',
    name: 'Invitado de Honor',
    tier: 'all',
    partySize: 2,
  },
];

export function findGuestByInput(input: string): GuestData {
  const clean = input.trim().toUpperCase();
  if (!clean) {
    return {
      id: 'default-all',
      code: 'BO2027',
      name: 'Invitado de Honor',
      tier: 'all',
      partySize: 2,
    };
  }

  // Exact code match
  const exact = KNOWN_GUESTS.find(
    (g) => g.code.toUpperCase() === clean || g.name.toUpperCase() === clean
  );
  if (exact) return { ...exact, invitedToPreboda: exact.tier === 'all' };

  // Partial match in known list
  const partial = KNOWN_GUESTS.find(
    (g) =>
      clean.includes(g.code.toUpperCase()) ||
      g.code.toUpperCase().includes(clean) ||
      clean.includes(g.name.toUpperCase()) ||
      g.name.toUpperCase().includes(clean)
  );
  if (partial) return { ...partial, invitedToPreboda: partial.tier === 'all' };

  // Keyword-based fallback: if code contains "PRE" or "VIP" -> 'all', else if contains "BODA" -> 'wedding_only'
  if (clean.includes('PRE') || clean.includes('VIP') || clean.includes('ALL')) {
    return {
      id: `custom-${clean}`,
      code: clean,
      name: input.trim(),
      tier: 'all',
      invitedToPreboda: true,
      partySize: 2,
    };
  }

  // All other codes and names default to full celebration access
  return {
    id: `guest-${clean}`,
    code: clean,
    name: input.trim(),
    tier: 'all',
    invitedToPreboda: true,
    partySize: 2,
  };
}
