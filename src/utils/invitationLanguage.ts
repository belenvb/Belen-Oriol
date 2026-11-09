import type { Language } from '../types';

export function invitationLanguageFromSearch(search: string): Language | null {
  const value = new URLSearchParams(search).get('lang')?.trim().toLowerCase();
  return value === 'en' || value === 'es' ? value : null;
}

// Language is a display preference, never a prerequisite for opening the site.
export function initialInvitationLanguage(search: string, browserLanguage = 'es'): Language {
  return invitationLanguageFromSearch(search) ?? (/^en(?:-|$)/i.test(browserLanguage) ? 'en' : 'es');
}
