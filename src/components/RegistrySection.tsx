import { useState, type FormEvent } from 'react';
import type { Language } from '../types';
import { lookupGiftByName, type GiftPaymentDetails } from '../utils/rsvp';
import './RegistrySection.css';

type PaymentMethod = 'bank' | 'bizum' | 'venmo' | 'zelle';

interface Props {
  lang: Language;
  verified: boolean;
  giftDetails: GiftPaymentDetails | null;
}

export function RegistrySection({ lang, verified, giftDetails }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('bank');
  const es = lang === 'es';
  const [fullName, setFullName] = useState('');
  const [checkingName, setCheckingName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [detailsByName, setDetailsByName] = useState<GiftPaymentDetails | null>(null);
  const unlocked = verified || detailsByName !== null;
  const details = verified ? giftDetails : detailsByName;

  const confirmGuestName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (checkingName) return;
    setCheckingName(true);
    setNameError('');
    try {
      const result = await lookupGiftByName(fullName);
      setDetailsByName(result);
      setFullName('');
    } catch {
      setNameError(es
        ? 'No hemos podido verificar el nombre. Escríbelo tal como aparece en la invitación.'
        : 'We could not verify that name. Please enter it as written on the invitation.');
    } finally {
      setCheckingName(false);
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
                  ? 'Introduce tu nombre y apellidos para consultar los datos de transferencia y las opciones de regalo. No es necesario confirmar tu asistencia.'
                  : 'Enter your first and last name to see the transfer details and gift options. You do not need to complete the RSVP.'}</p>
                <form onSubmit={confirmGuestName} className="home-gift__name-form">
                  <label htmlFor="wedding-gift-name">{es ? 'Nombre y apellidos' : 'First and last name'}</label>
                  <input
                    id="wedding-gift-name"
                    type="text"
                    name="giftGuestName"
                    autoComplete="name"
                    autoCapitalize="words"
                    spellCheck={false}
                    maxLength={120}
                    placeholder={es ? 'Ej. María García López' : 'e.g. Maria Garcia'}
                    value={fullName}
                    onChange={event => { setFullName(event.target.value); setNameError(''); }}
                    required
                    aria-invalid={Boolean(nameError)}
                    aria-describedby={nameError ? 'gift-name-error' : undefined}
                  />
                  {nameError && <p id="gift-name-error" className="home-gift__note" role="alert">{nameError}</p>}
                  <button type="submit" className="home-gift__access-button" disabled={checkingName || fullName.trim().length < 5}>
                    {checkingName ? (es ? 'Comprobando…' : 'Checking…') : (es ? 'Ver datos para el regalo' : 'See gift details')}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="home-gift__methods" role="group" aria-label={es ? 'Forma de aportar' : 'Ways to give'}>
                  {(['bank', 'bizum', 'venmo', 'zelle'] as const).map(id => (
                    <button key={id} type="button" aria-pressed={method === id} aria-controls="home-gift-payment" onClick={() => setMethod(id)}>
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
                  ) : paymentIdentifier ? (
                    <dl className="home-gift__payment-identifier">
                      <dt>{method === 'bizum' ? 'Bizum' : method === 'venmo' ? 'Venmo' : 'Zelle'}</dt>
                      <dd className="home-gift__value">{paymentIdentifier}</dd>
                    </dl>
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
