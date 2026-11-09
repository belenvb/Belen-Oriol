import { useState } from 'react';
import { Language } from '../types';
import './RegistrySection.css';

type PaymentMethod = 'bank' | 'bizum' | 'venmo' | 'zelle';

export function RegistrySection({ lang }: { lang: Language }) {
  const [method, setMethod] = useState<PaymentMethod>('bank');
  const es = lang === 'es';
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
              <span className="home-gift__reveal-mark" aria-hidden="true">↗</span>
            </span>
          </summary>
          <div className="home-gift__payment-content">
          <div className="home-gift__methods" role="group" aria-label={es ? 'Forma de aportar' : 'Ways to give'}>
            {(['bank', 'bizum', 'venmo', 'zelle'] as const).map(id => <button key={id} type="button" aria-pressed={method === id} aria-controls="home-gift-payment" onClick={() => setMethod(id)}>
              {id === 'bank' ? (es ? 'Transferencia' : 'Bank transfer') : id === 'bizum' ? 'Bizum' : id === 'venmo' ? 'Venmo' : 'Zelle'}
            </button>)}
          </div>
          <div id="home-gift-payment" className="home-gift__private-details">
            <p className="home-gift__note">
              {es
                ? method === 'bank'
                  ? 'Si quieres hacer una transferencia desde España o Estados Unidos, escríbenos directamente y te compartiremos los datos bancarios por privado.'
                  : `Para regalarnos algo por ${method === 'bizum' ? 'Bizum' : method === 'venmo' ? 'Venmo' : 'Zelle'}, pídenos los datos por privado.`
                : method === 'bank'
                  ? 'If you would like to make a bank transfer from Spain or the United States, please contact us directly for the banking details.'
                  : `If you would like to use ${method === 'bizum' ? 'Bizum' : method === 'venmo' ? 'Venmo' : 'Zelle'}, please ask us privately for the details.`}
            </p>
            <p className="home-gift__note">
              {es ? 'Por privacidad, no publicamos números de cuenta, teléfonos ni identificadores de pago en esta web.' : 'For privacy, we do not publish bank account numbers, phone numbers or payment identifiers on this website.'}
            </p>
          </div>
          </div>
        </details>
      </div>
    </section>
  );
}
