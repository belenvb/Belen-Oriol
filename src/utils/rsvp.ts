import type { GuestRsvp } from '../types';
import { findGuestByInput } from '../data/guests';

export type RsvpPerson = {
  fullName: string;
  email: string;
  attendance: 'yes' | 'no';
  attendingFriday?: boolean;
  attendingSaturday?: boolean;
  attendingDays?: 'both' | 'sept3_only' | 'sept4_only';
  dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'celiac' | 'other';
  allergiesNote: string;
};

export type RsvpSubmission = GuestRsvp & { submissionId: string; guests: RsvpPerson[] };

async function request(payload: unknown) {
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
    const receipt = await response.json();
    if (receipt.ok !== true) throw new Error('RSVP_NOT_CONFIRMED');
    return receipt;
  } finally {
    clearTimeout(timeout);
  }
}

export async function lookupInvitation(invitationCode: string): Promise<{ maxGuests: number; guestName?: string; invitedToPreboda?: boolean }> {
  const trimmed = invitationCode.trim();
  try {
    const result = await request({ action: 'lookup', invitationCode: trimmed });
    if (Number.isInteger(result.maxGuests) && result.maxGuests >= 1 && result.maxGuests <= 20) {
      return { maxGuests: result.maxGuests };
    }
  } catch {
    // If backend isn't configured for this specific custom code or offline, match locally
  }

  const localGuest = findGuestByInput(trimmed);
  if (localGuest) {
    return {
      maxGuests: localGuest.partySize || 2,
      guestName: localGuest.name !== 'Invitado de Honor' ? localGuest.name : undefined,
      invitedToPreboda: localGuest.invitedToPreboda !== false,
    };
  }

  return { maxGuests: 2 };
}

export async function sendRsvp(record: RsvpSubmission, invitationCode: string): Promise<void> {
  try {
    const receipt = await request({ ...record, invitationCode });
    if (receipt.submissionId !== record.submissionId) throw new Error('RSVP_NOT_CONFIRMED');
  } catch (err) {
    // Save to localStorage as a fallback backup in all cases
    try {
      const stored = JSON.parse(localStorage.getItem('bo_wedding_rsvps') || '[]');
      stored.push({ ...record, invitationCode, savedLocallyAt: new Date().toISOString() });
      localStorage.setItem('bo_wedding_rsvps', JSON.stringify(stored));
    } catch {
      // ignore storage error
    }
    // If remote call failed, still allow graceful fallback if offline
    console.warn('Remote RSVP submission note:', err);
  }
}

