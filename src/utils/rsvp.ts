import { roomAvailabilityStore } from './roomAvailability';
import type { GuestRsvp, Language } from '../types';

export type RsvpPerson = {
  fullName: string;
  email: string;
  attendance: 'yes' | 'no';
  attendingFriday?: boolean;
  attendingSaturday?: boolean;
  attendingDays?: 'both' | 'sept3_only' | 'sept4_only' | string[];
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'celiac' | 'other';
  allergiesNote: string;
};

export type RoomAvailability = {
  id: GuestRsvp['roomBooking'];
  total: number;
  reserved: number;
  remaining: number;
  price: number | null;
};

export type RsvpSubmission = GuestRsvp & {
  submissionId: string;
  guests: RsvpPerson[];
  language?: Language;
  formVersion?: string;
  clientSubmittedAt?: string;
};

// These values are received only after an invitation code is validated.
// Their actual contents are stored in Apps Script Script Properties, not the website.
export type GiftPaymentDetails = {
  usBank?: string;
  usHolder?: string;
  usAccount?: string;
  usRouting?: string;
  esHolder?: string;
  esIban?: string;
  esBic?: string;
  bizum?: string;
  venmo?: string;
  zelle?: string;
};

export type InvitationLookup = {
  previousRsvp?: RsvpSubmission;
  maxGuests: number;
  invitedToPreboda?: boolean;
  invitedToWedding?: boolean;
  language?: Language;
  guests?: {
    fullName: string;
    email?: string;
  }[];
  invitationText?: string;
  giftDetails?: GiftPaymentDetails;
  roomAvailability?: RoomAvailability[];
};

type RsvpReceipt = {
  previousRsvp?: RsvpSubmission;
  ok?: boolean;
  submissionId?: string;
  maxGuests?: number;
  invitedToPreboda?: boolean;
  invitedToWedding?: boolean;
  language?: Language;
  guests?: {
    fullName?: string;
    email?: string;
  }[];
  invitationText?: string;
  giftDetails?: GiftPaymentDetails;
  roomAvailability?: RoomAvailability[];
  error?: string;
};

function parseRooms(receipt: RsvpReceipt): RoomAvailability[] | undefined {
  if (!Array.isArray(receipt.roomAvailability)) return undefined;
  return receipt.roomAvailability.map(room => ({
    id: room.id,
    total: Math.max(0, Number(room.total) || 0),
    reserved: Math.max(0, Number(room.reserved) || 0),
    remaining: Math.max(0, Number(room.remaining) || 0),
    price: room.price !== null && room.price !== undefined &&
      Number.isFinite(Number(room.price)) && Number(room.price) >= 0 ? Number(room.price) : null,
  }));
}

async function request(payload: unknown, isPublicCatalogue = false): Promise<RsvpReceipt> {
  const endpoint = import.meta.env.VITE_RSVP_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyHE87sExq-w0tQoH0BzPekSGhU7FWU2dKZTBXFPxFSiJV2FJ8KRbseMv8uxijCkQIBJw/exec';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: 'follow',
      credentials: 'omit',
    });

    if (!response.ok) throw new Error('RSVP_SEND_FAILED');

    const receipt = (await response.json()) as RsvpReceipt;
    if (receipt.ok !== true) throw new Error(receipt.error || 'RSVP_NOT_CONFIRMED');

    const rooms = parseRooms(receipt);
    if (isPublicCatalogue) roomAvailabilityStore.publishPublic(rooms);
    else if (rooms) roomAvailabilityStore.publish(rooms);
    return receipt;
  } finally {
    clearTimeout(timeout);
  }
}

// Prices are public, but no guest details or private invitation codes are returned.
export async function loadRoomCatalogue(): Promise<void> {
  await request({ action: 'rooms' }, true);
}

// Gift-only access deliberately never retrieves RSVP answers, codes or guest names.
// Full-name matching is convenience access, not proof of identity.
export async function lookupGiftByName(fullName: string): Promise<GiftPaymentDetails> {
  const name = fullName.trim().replace(/\\s+/g, ' ');
  if (name.length < 5 || name.length > 120 || name.split(' ').length < 2) {
    throw new Error('GIFT_NAME_INVALID');
  }
  const result = await request({ action: 'giftByName', fullName: name });
  if (!result.giftDetails || typeof result.giftDetails !== 'object') {
    throw new Error('GIFT_NAME_NOT_FOUND');
  }
  return result.giftDetails;
}

export async function lookupInvitation(invitationCode: string): Promise<InvitationLookup> {
  const trimmed = invitationCode.trim();
  if (!trimmed) throw new Error('INVITATION_CODE_REQUIRED');

  const result = await request({ action: 'lookup', invitationCode: trimmed });

  if (!Number.isInteger(result.maxGuests) || result.maxGuests < 1 || result.maxGuests > 20) {
    throw new Error('INVALID_INVITATION');
  }

  return {
    previousRsvp: result.previousRsvp,
    maxGuests: result.maxGuests,
    invitedToPreboda: result.invitedToPreboda !== false,
    invitedToWedding: result.invitedToWedding !== false,
    language: result.language,
    guests: Array.isArray(result.guests)
      ? result.guests.map((guest) => ({
          fullName: typeof guest.fullName === 'string' ? guest.fullName : '',
          email: typeof guest.email === 'string' ? guest.email : '',
        }))
      : undefined,
    invitationText: typeof result.invitationText === 'string' ? result.invitationText.trim() : '',
    giftDetails: result.giftDetails && typeof result.giftDetails === 'object' ? result.giftDetails : undefined,
    roomAvailability: parseRooms(result),
  };
}

export async function sendRsvp(record: RsvpSubmission, invitationCode: string): Promise<void> {
  const payload: RsvpSubmission & { invitationCode: string } = {
    ...record,
    invitationCode: invitationCode.trim(),
    clientSubmittedAt: record.clientSubmittedAt || record.submittedAt || new Date().toISOString(),
    formVersion: record.formVersion || 'rsvp-per-guest-v3-rooms',
  };

  const receipt = await request(payload);
  if (receipt.submissionId !== record.submissionId) throw new Error('RSVP_NOT_CONFIRMED');
}
