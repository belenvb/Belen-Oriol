import type { GuestRsvp, Language } from '../types';

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

export type RsvpSubmission = GuestRsvp & {
  submissionId: string;
  guests: RsvpPerson[];
  language?: Language;
  formVersion?: string;
  clientSubmittedAt?: string;
};

type InvitationLookup = {
  maxGuests: number;
  invitedToPreboda?: boolean;
  invitedToWedding?: boolean;
  language?: Language;
};

type RsvpReceipt = {
  ok?: boolean;
  submissionId?: string;
  maxGuests?: number;
  invitedToPreboda?: boolean;
  invitedToWedding?: boolean;
  language?: Language;
  error?: string;
};

async function request(payload: unknown): Promise<RsvpReceipt> {
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

    return receipt;
  } finally {
    clearTimeout(timeout);
  }
}

export async function lookupInvitation(invitationCode: string): Promise<InvitationLookup> {
  const trimmed = invitationCode.trim();
  if (!trimmed) throw new Error('INVITATION_CODE_REQUIRED');

  const result = await request({ action: 'lookup', invitationCode: trimmed });

  if (!Number.isInteger(result.maxGuests) || result.maxGuests < 1 || result.maxGuests > 20) {
    throw new Error('INVALID_INVITATION');
  }

  return {
    maxGuests: result.maxGuests,
    invitedToPreboda: result.invitedToPreboda !== false,
    invitedToWedding: result.invitedToWedding !== false,
    language: result.language,
  };
}

export async function sendRsvp(record: RsvpSubmission, invitationCode: string): Promise<void> {
  const payload: RsvpSubmission & { invitationCode: string } = {
    ...record,
    invitationCode: invitationCode.trim(),
    clientSubmittedAt: record.clientSubmittedAt || record.submittedAt || new Date().toISOString(),
    formVersion: record.formVersion || 'rsvp-per-guest-v2',
  };

  try {
    const receipt = await request(payload);
    if (receipt.submissionId !== record.submissionId) throw new Error('RSVP_NOT_CONFIRMED');
  } catch (error) {
    try {
      const stored = JSON.parse(localStorage.getItem('bo_wedding_rsvp_failed_submissions') || '[]');
      stored.push({ ...payload, savedLocallyAt: new Date().toISOString() });
      localStorage.setItem('bo_wedding_rsvp_failed_submissions', JSON.stringify(stored.slice(-10)));
    } catch {
      // local backup is best-effort only; the UI must still show a remote submission error.
    }

    throw error instanceof Error ? error : new Error('RSVP_NOT_CONFIRMED');
  }
}
