import { useState } from 'react';
import type { Language } from '../types';
import type { GiftPaymentDetails } from '../utils/rsvp';
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

  // Actual payment identifiers are read from private Apps Script properties
  // after invitation lookup; they are never included in the public website.
  const bankGroups = [
    {
      id: 'us',
      title: es ? 'Transferencia desde Estados Unidos' : 'US bank transfer',
      rows: [
        { label: es ? 'Banco' : 'Bank', value: giftDetails?.usBank },
        { label: es ? 'Titular' : 'Account holder', value: giftDetails?.usHolder },
        { label: es ? 'Número de cuenta' : 'Account number', value: giftDetails?.usAccount },
        { label: 'Routing number', value: giftDetails?.usRouting },
      ],
    },
    {
      id: 'es',
      title: es ? 'Transferencia desde España' : 'Transfer from Spain',
      rows: [
        { label: es ? 'Titular' : 'Account holder', value: giftDetails?.esHolder },
        { label: 'IBAN', value: giftDetails?.esIban },
        { label: es ? 'BIC / SWIFT' : 'BIC / SWIFT', value: giftDetails?.esBic },
      ],
    },
  ];
  const paymentIdentifier = method === 'bizum' ? giftDetails?.bizum
    : method === 'venmo' ? giftDetails?.venmo
    : method === 'zelle' ? giftDetails?.zelle
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
            {!verified ? (
              <div className="home-gift__private-details">
                <p className="home-gift__note">{es
                  ? 'Para consultar los datos de transferencia y las demás opciones de regalo, abre tu invitación con el código privado en la sección RSVP.'
                  : 'To see bank transfer details and other gift options, please open your invitation using the private code in the RSVP section.'}</p>
                <button type="button" className="home-gift__access-button" onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  {es ? 'Introducir código de invitación' : 'Enter invitation code'}
                </button>
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
