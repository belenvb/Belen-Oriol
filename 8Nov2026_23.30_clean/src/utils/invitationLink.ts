/**
 * Private invitation links are issued by the Sheets sending panel as
 * https://our-site/#invitacion=PRIVATE_CODE.
 * Keep the credential in the fragment; never add it to canonical or Open Graph tags.
 */
export function invitationCodeFromHash(hash: string): string {
  const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
  const code = new URLSearchParams(fragment).get('invitacion')?.trim().toUpperCase() ?? '';
  return /^[A-Z0-9-]{16,80}$/.test(code) ? code : '';
}
