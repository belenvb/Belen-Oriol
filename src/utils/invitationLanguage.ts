import type { Language } from '../types';

export function invitationLanguageFromSearch(search: string): Language | null {
  const value = new URLSearchParams(search).get('lang')?.trim().toLowerCase();
  return value === 'en' || value === 'es' ? value : null;
}

export function isInvitationLanguagePending(code: string, resolvedCode: string, explicitLanguage: Language | null): boolean {
  return Boolean(code && code !== resolvedCode && !explicitLanguage);
}
