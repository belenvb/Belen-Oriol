import { GuestRsvp } from '../types';

export type RsvpSubmission = GuestRsvp & { submissionId: string };

export async function sendRsvp(record: RsvpSubmission): Promise<void> {
  const endpoint = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_RSVP_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyHE87sExq-w0tQoH0BzPekSGhU7FWU2dKZTBXFPxFSiJV2FJ8KRbseMv8uxijCkQIBJw/exec';
  if (!endpoint) throw new Error('RSVP_NOT_CONFIGURED');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(record),
      signal: controller.signal,
      redirect: 'follow',
      credentials: 'omit',
    });
    if (!response.ok) throw new Error('RSVP_SEND_FAILED');
    const receipt = await response.json();
    if (receipt.ok !== true || receipt.submissionId !== record.submissionId) {
      throw new Error('RSVP_NOT_CONFIRMED');
    }
  } finally {
    clearTimeout(timeout);
  }
}
