import { useRef, useState, type FormEvent } from 'react';
import type { Language } from '../types';
import { sendGiftNote } from '../utils/rsvp';

export function GiftNoteForm({ token, method, lang }: { token: string; method: 'bank' | 'bizum' | 'venmo' | 'zelle'; lang: Language }) {
  const es = lang === 'es';
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const requestId = useRef(crypto.randomUUID());
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || sent || !name.trim() || !note.trim()) return;
    pending.current = true; setSending(true); setError('');
    try {
      await sendGiftNote({ token, method, language: lang, senderName: name.trim(), note: note.trim(), requestId: requestId.current });
      setSent(true); setNote('');
    } catch {
      setError(es ? 'No hemos podido confirmar el envío de tu nota. Ponte en contacto con nosotros antes de volver a intentarlo.' : 'We couldn’t confirm delivery of your note. Please contact us before trying again.');
    } finally { pending.current = false; setSending(false); }
  }
  if (sent) return <p className="home-gift__note-sent" role="status">{es ? '¡Gracias! Tu nota se ha enviado.' : 'Thank you! Your note has been sent to us.'}</p>;
  return <form className="home-gift__note-form" onSubmit={submit} aria-busy={sending}>
    <h3>{es ? 'Una nota para Belén & Oriol' : 'A note for Belén & Oriol'}</h3>
    <p>{es ? 'Si te apetece, acompaña tu regalo con unas palabras. Nos llegarán directamente por email.' : 'If you’d like, add a few words to go with your gift. They’ll come straight to us by email.'}</p>
    <fieldset disabled={sending}>
      <label htmlFor="gift-note-name">{es ? 'De parte de' : 'From'}</label>
      <input id="gift-note-name" autoComplete="name" required maxLength={120} value={name} onChange={event=>setName(event.target.value)} placeholder={es ? 'Tu nombre o vuestros nombres' : 'Your name or names'}/>
      <label htmlFor="gift-note-message">{es ? 'Tu mensaje' : 'Your message'}</label>
      <textarea id="gift-note-message" required maxLength={2000} rows={3} value={note} onChange={event=>setNote(event.target.value)}/>
      <button type="submit" className="home-gift__access-button" disabled={!name.trim() || !note.trim()}>{sending ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Enviar nota' : 'Send note')}</button>
    </fieldset>
    {error && <p role="alert">{error}</p>}
    <p className="home-gift__note-disclaimer">{es ? 'Enviar esta nota no realiza ni confirma ningún pago.' : 'Sending a note does not make or confirm a payment.'}</p>
  </form>;
}
