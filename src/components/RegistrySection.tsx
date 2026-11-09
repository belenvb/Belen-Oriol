import { useState, type FormEvent } from 'react';
import type { Language } from '../types';
import { lookupGiftAccess, type GiftPaymentDetails } from '../utils/rsvp';
import './RegistrySection.css';

type PaymentMethod = 'bank' | 'bizum' | 'venmo' | 'zelle';

interface Props {
  lang: Language;
  verified: boolean;
  giftDetails: GiftPaymentDetails | null;
}

export function RegistrySection({ lang, verified, giftDetails }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('bank');
  const [copied, setCopied] = useState(false);
  const es = lang === 'es';
  const [guestAccess, setGuestAccess] = useState('');
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [accessError, setAccessError] = useState('');
  const [detailsByAccess, setDetailsByAccess] = useState<GiftPaymentDetails | null>(null);
  const unlocked = verified || detailsByAccess !== null;
  const details = verified ? giftDetails : detailsByAccess;

  const confirmGuestAccess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkingAccess) return;
    setCheckingAccess(true);
    setAccessError('');
    try {
      const result = await lookupGiftAccess(guestAccess);
      setDetailsByAccess(result);
      setGuestAccess('');
    } catch {
      setAccessError(es
        ? 'No hemos encontrado una invitación con esos datos. Compruébalos e inténtalo de nuevo.'
        : 'We could not find an invitation with those details. Please check and try again.');
    } finally {
      setCheckingAccess(false);
    }
  };

  // Actual payment identifiers are read from private Apps Script properties
  // after invitation lookup; they are never included in the public website.
  const bankGroups = [
    {
      id: 'us',
      title: es ? 'Transferencia desde Estados Unidos' : 'US bank transfer',
      rows: [
        { label: es ? 'Banco' : 'Bank', value: details?.usBank },
        { label: es ? 'Titular' : 'Account holder', value: details?.usHolder },
        { label: es ? 'Número de cuenta' : 'Account number', value: details?.usAccount },
        { label: 'Routing number', value: details?.usRouting },
      ],
    },
    {
      id: 'es',
      title: es ? 'Transferencia desde España' : 'Transfer from Spain',
      rows: [
        { label: es ? 'Titular' : 'Account holder', value: details?.esHolder },
        { label: 'IBAN', value: details?.esIban },
        { label: es ? 'BIC / SWIFT' : 'BIC / SWIFT', value: details?.esBic },
      ],
    },
  ];
  const paymentIdentifier = method === 'bizum' ? details?.bizum
    : method === 'venmo' ? details?.venmo
    : method === 'zelle' ? details?.zelle
    : undefined;
  const venmoName = String(details?.venmo || '').trim().replace(/^@/, '');
  const venmoProfile = /^[a-zA-Z0-9._-]{2,40}$/.test(venmoName)
    ? 'https://venmo.com/' + encodeURIComponent(venmoName)
    : null;
  const copyPayment = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="registry" className="home-gift" aria-labelledby="home-gift-title">
      <div className="home-gift__layout">
        <header className="home-gift__story">
          <p className="eyebrow">{es ? 'Un regalo para lo que viene' : 'A gift for what comes next'}</p>
          <h2 id="home-gift-title">{es ? 'Lista de bodas' : 'Wedding registry'}</h2>
          <p className="home-gift__lead">{es ? 'Nos hace mucha ilusión compartir este día con vosotros.' : 'We are so happy to share this day with you.'}</p>
          <p>{es
            ? 'Estamos ahorrando para comprar nuestra primera casa juntos. Si os apetece hacernos un regalo, podéis ayudarnos a dar ese paso. Gracias por acompañarnos en la boda y en todo lo que viene después.'
            : 'We are saving to buy our first home together. If you would like to give us a gift, we would love your help taking that next step. Thank you for being part of our wedding and everything that comes after.'}</p>
          <p className="home-gift__signoff">Belén &amp; Oriol</p>
        </header>
        <details className="home-gift__details">
          <summary className="home-gift__reveal">
            <span className="home-gift__photo">
              <img src="/photos/album/12.webp" alt={es ? 'Belén y Oriol en el banco gigante de Castelldefels' : 'Belén and Oriol on the giant bench in Castelldefels'} loading="lazy" decoding="async" />
            </span>
            <span className="home-gift__card-caption">
              <span className="home-gift__card-copy">
                <span className="home-gift__card-title">{es ? 'Nuestra primera casa' : 'Our first home'}</span>
                <span className="home-gift__card-action">{es ? 'Contribuir a nuestro hogar' : 'Contribute to our home'}</span>
              </span>
              <span className="home-gift__reveal-mark" aria-hidden="true">+</span>
            </span>
          </summary>
          <div className="home-gift__payment-content">
            {!unlocked ? (
              <div className="home-gift__private-details">
                <p className="home-gift__note">{es
                  ? 'Introduce tu nombre y apellidos, tu email o tu código de invitación para ver los datos de regalo. Si escribes tu nombre, solo comprobaremos el nombre de pila. No es necesario confirmar asistencia.'
                  : 'Enter your full name, email or invitation code to see gift details. For names, we only check the first name. You do not need to complete the RSVP.'}</p>
                <form onSubmit={confirmGuestAccess} className="home-gift__name-form">
                  <label htmlFor="wedding-gift-name">{es ? 'Nombre y apellidos, email o código de invitación' : 'Full name, email or invitation code'}</label>
                  <input
                    id="wedding-gift-name"
                    type="text"
                    name="giftAccess"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    maxLength={120}
                    placeholder={es ? 'Ej. María García, maria@email.com o ABC123' : 'e.g. Maria Garcia, maria@email.com or ABC123'}
                    value={guestAccess}
                    onChange={event => { setGuestAccess(event.target.value); setAccessError(''); }}
                    required
                    aria-invalid={Boolean(accessError)}
                    aria-describedby={accessError ? 'gift-name-error' : undefined}
                  />
                  {accessError && <p id="gift-name-error" className="home-gift__note" role="alert">{accessError}</p>}
                  <button type="submit" className="home-gift__access-button" disabled={checkingAccess || guestAccess.trim().length < 3}>
                    {checkingAccess ? (es ? 'Comprobando…' : 'Checking…') : (es ? 'Ver datos para el regalo' : 'See gift details')}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="home-gift__methods" role="group" aria-label={es ? 'Forma de aportar' : 'Ways to give'}>
                  {(['bank', 'bizum', 'venmo', 'zelle'] as const).map(id => (
                    <button key={id} type="button" aria-pressed={method === id} aria-controls="home-gift-payment" onClick={() => { setMethod(id); setCopied(false); }}>
                      {id === 'bank' ? (es ? 'Transferencia' : 'Bank transfer') : id === 'bizum' ? 'Bizum' : id === 'venmo' ? 'Venmo' : 'Zelle'}
                    </button>
                  ))}
                </div>
                <div id="home-gift-payment" className="home-gift__private-details">
                  {method === 'bank' ? (
                    <div className="home-gift__bank-groups">
                      {bankGroups.map(group => {
                        const available = group.rows.filter(row => Boolean(row.value));
                        return (
                          <section key={group.id} className="home-gift__bank-group" aria-label={group.title}>
                            <h3>{group.title}</h3>
                            {available.length ? (
                              <dl>{available.map(row => (
                                <div className="home-gift__bank-row" key={row.label}>
                                  <dt>{row.label}</dt>
                                  <dd className="home-gift__value">{row.value}</dd>
                                </div>
                              ))}</dl>
                            ) : (
                              <p className="home-gift__note">{es ? 'Datos pendientes de confirmar.' : 'Details to be confirmed.'}</p>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  ) : (paymentIdentifier || (method === 'zelle' && details?.zelleQrDataUrl)) ? (
                    <div className="home-gift__payment-link-area">
                      {method === 'zelle' && details?.zelleQrDataUrl && (
                        <div className="home-gift__zelle-qr">
                          <img src={details.zelleQrDataUrl} alt={es ? 'Código QR oficial para enviar el regalo mediante Zelle' : 'Official Zelle QR code for sending a gift'} loading="lazy" decoding="async" />
                          <p className="home-gift__note">{es ? 'Escanea este código desde la aplicación de tu banco compatible con Zelle. Comprueba el nombre del destinatario antes de enviar.' : 'Scan this code using your Zelle-enabled banking app. Confirm the recipient before sending.'}</p>
                        </div>
                      )}
                      {paymentIdentifier && <dl className="home-gift__payment-identifier">
                        <dt>{method === 'bizum' ? 'Bizum' : method === 'venmo' ? 'Venmo' : 'Zelle'}</dt>
                        <dd className="home-gift__value">{paymentIdentifier}</dd>
                      </dl>}
                      <div className="home-gift__payment-actions">
                        {method === 'venmo' && venmoProfile && (
                          <a className="home-gift__payment-link" href={venmoProfile} target="_blank" rel="noopener noreferrer">
                            {es ? 'Abrir perfil en Venmo' : 'Open Venmo profile'}
                          </a>
                        )}
                        {paymentIdentifier && <button type="button" className="home-gift__payment-copy" onClick={() => { void copyPayment(paymentIdentifier); }}>
                          {copied ? (es ? 'Copiado' : 'Copied') : (es ? 'Copiar identificador' : 'Copy payment details')}
                        </button>}
                      </div>
                      <p className="home-gift__note">{method === 'bizum'
                        ? (es ? 'Abre Bizum desde la aplicación de tu banco e introduce este número.' : 'Open Bizum in your banking app and enter this number.')
                        : method === 'zelle'
                        ? (es ? 'Abre Zelle desde tu banco e introduce este email o teléfono. Comprueba siempre el nombre antes de confirmar.' : 'Open Zelle in your banking app and enter this email or phone number. Confirm the recipient before sending.')
                        : (es ? 'Comprueba que el destinatario sea correcto antes de enviar el regalo.' : 'Please confirm the recipient before sending your gift.')}
                      </p>
                    </div>
                  ) : (
                    <p className="home-gift__note">{es ? 'Datos pendientes de confirmar.' : 'Details to be confirmed.'}</p>
                  )}
                  <p className="home-gift__note">{es
                    ? 'Estos datos son exclusivos para personas con invitación. Por favor, no compartas el enlace ni el código.'
                    : 'These details are for invited guests only. Please do not share your invitation link or code.'}</p>
                </div>
              </>
            )}
          </div>
        </details>
      </div>
    </section>
  );
}
