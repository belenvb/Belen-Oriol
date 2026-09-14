import type { GuestRsvp } from '../types';
export type RsvpPerson = { fullName: string; email: string; attendance: 'yes' | 'no'; dietaryPreference: 'none' | 'vegetarian' | 'vegan' | 'celiac' | 'other'; allergiesNote: string };
export type RsvpSubmission = GuestRsvp & { submissionId: string; guests: RsvpPerson[] };
async function request(payload: unknown) {
  const endpoint = import.meta.env.VITE_RSVP_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyHE87sExq-w0tQoH0BzPekSGhU7FWU2dKZTBXFPxFSiJV2FJ8KRbseMv8uxijCkQIBJw/exec';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), signal: controller.signal, redirect: 'follow', credentials: 'omit' });
    if (!response.ok) throw new Error('RSVP_SEND_FAILED');
    const receipt = await response.json();
    if (receipt.ok !== true) throw new Error('RSVP_NOT_CONFIRMED');
    return receipt;
  } finally { clearTimeout(timeout); }
}
export async function lookupInvitation(invitationCode: string): Promise<{ maxGuests: number }> {
  const result = await request({ action: 'lookup', invitationCode });
  if (!Number.isInteger(result.maxGuests) || result.maxGuests < 1 || result.maxGuests > 20) throw new Error('INVALID_INVITATION');
  return { maxGuests: result.maxGuests };
}
export async function sendRsvp(record: RsvpSubmission, invitationCode: string): Promise<void> {
  const receipt = await request({ ...record, invitationCode });
  if (receipt.submissionId !== record.submissionId) throw new Error('RSVP_NOT_CONFIRMED');
}
