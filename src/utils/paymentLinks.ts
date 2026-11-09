// Accept a username or a profile URL pasted into the private Script Property.
// Never link to a supplied host, query string, sign-in route or payment action.
export function venmoProfileUrl(value?: string): string | null {
  let username = String(value || '').trim();
  if (/^https:\/\//i.test(username)) {
    try {
      const url = new URL(username);
      if (!['venmo.com', 'www.venmo.com', 'account.venmo.com'].includes(url.hostname)
        || url.port || url.username || url.password) return null;
      const match = url.pathname.match(/^\/(?:u\/)?([a-zA-Z0-9_-]{2,30})\/?$/);
      if (!match) return null;
      username = match[1];
    } catch { return null; }
  }
  username = username.replace(/^@/, '');
  if (!/^[a-zA-Z0-9_-]{2,30}$/.test(username)
    || /^(signin|sign-in|login|account|signup|home|u)$/i.test(username)) return null;
  return 'https://venmo.com/u/' + encodeURIComponent(username);
}
