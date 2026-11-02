import { useEffect, useRef, useState } from 'react';
import { weddingInfo } from '../data/content';
import { Language } from '../types';
import './RegistrySection.css';

type PaymentMethod = 'bank' | 'bizum' | 'venmo';

export function RegistrySection({ lang }: { lang: Language }) {
  const [method, setMethod] = useState<PaymentMethod>('bank');
  const [copied, setCopied] = useState('');
  const [copyFailed, setCopyFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const es = lang === 'es';
  const bank = weddingInfo.bankInfo;
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (value: string, key: string) => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key); setCopyFailed(false);
      timer.current = setTimeout(() => setCopied(''), 2400);
    } catch { setCopied(''); setCopyFailed(true); }
  };
  const field = (label: string, value: string, key?: string) => (
    <div className="home-gift__field" key={label}>
      <dt>{label}</dt>
      <dd><span className={key ? 'home-gift__value' : ''}>{value}</span>
        {key && <button type="button" onClick={() => copy(value, key)} aria-label={`${es ? 'Copiar' : 'Copy'} ${label}`}>
          {copied === key ? (es ? 'Copiado ✓' : 'Copied ✓') : (es ? 'Copiar' : 'Copy')}
        </button>}
      </dd>
    </div>
  );
  return (
    <section id="registry" className="home-gift" aria-labelledby="home-gift-title">
      <div className="home-gift__art" aria-hidden="true"><svg viewBox="0 0 200 500" fill="none"><circle cx="100" cy="90" r="64"/><circle cx="100" cy="90" r="43"/><path d="M100 154v270h58v-30h-30v-35h30v-30h-58M86 169h28M86 182h28"/></svg></div><div className="home-gift__layout">
        <header className="home-gift__story">
          <p className="eyebrow">{es ? 'Lista de bodas' : 'Wedding registry'}</p>
          <h2 id="home-gift-title">{es ? 'Nuestro próximo' : 'Our next'}<br/><em>{es ? 'hogar.' : 'home.'}</em></h2>
          <p className="home-gift__lead">{es ? 'Una casa donde seguir escribiendo nuestra historia.' : 'A home for the next chapter of our story.'}</p>
          <p>{es
            ? 'Lo que más ilusión nos hace es celebrar este día con vosotros. Si además queréis hacernos un regalo, todas las aportaciones irán destinadas a la compra de nuestra casa.'
            : 'What means the most to us is celebrating this day with you. If you would also like to give us a gift, every contribution will go towards buying our home.'}</p>
          <p>{es ? 'Un lugar para los domingos sin prisa, las cenas que se alargan y muchas visitas vuestras.' : 'A place for slow Sundays, dinners that last all evening, and many visits from you.'}</p>
          <p className="home-gift__signature">{es ? 'Con todo nuestro cariño,' : 'With all our love,'}<br/><span>Belén & Oriol</span></p>
        </header>
        <div className="home-gift__details">
          <p className="home-gift__caption">{es ? 'Un regalo para nuestro hogar' : 'A gift towards our home'}</p>
          <p className="home-gift__intro">{es ? 'Si os apetece formar parte de este nuevo comienzo, podéis hacerlo de la forma que os resulte más cómoda.' : 'If you would like to be part of this new beginning, please choose whichever option suits you best.'}</p>
          <div className="home-gift__methods" role="group" aria-label={es ? 'Forma de aportar' : 'Ways to give'}>
            {(['bank', 'bizum', 'venmo'] as const).map(id => <button key={id} type="button" aria-pressed={method === id} aria-controls="home-gift-payment" onClick={() => {setMethod(id);setCopied('');setCopyFailed(false);}}>
              {id === 'bank' ? (es ? 'Transferencia' : 'Bank transfer') : id === 'bizum' ? 'Bizum' : 'Venmo'}
            </button>)}
          </div>
          <div id="home-gift-payment">
            <dl>
              {method === 'bank' && <>
                {field(es ? 'Titulares' : 'Account holders', bank.holders)}
                {field(`IBAN · ${bank.bankName}`, bank.iban, 'iban')}
                {field('BIC / SWIFT', bank.bic, 'bic')}
                {field(es ? 'Concepto sugerido' : 'Suggested reference', bank.conceptSample, 'reference')}
              </>}
              {method === 'bizum' && field(es ? 'Teléfono para Bizum' : 'Bizum phone number', bank.bizumPhone, 'bizum')}
              {method === 'venmo' && field(es ? 'Usuario de Venmo' : 'Venmo username', bank.venmoHandle, 'venmo')}
            </dl>
            {method !== 'bank' && <p className="home-gift__note">{method === 'bizum'
              ? (es ? 'Desde vuestra aplicación bancaria. Añadid vuestro nombre al mensaje para que sepamos a quién dar las gracias.' : 'From your Spanish banking app. Please add your name to the message so we know who to thank.')
              : (es ? 'Para quienes utilizan Venmo en Estados Unidos. Añadid vuestro nombre al mensaje.' : 'For guests using Venmo in the United States. Please include your name in the message.')}</p>}
          </div>
          <p className="home-gift__feedback" role="status">{copyFailed ? (es ? 'No se ha podido copiar. Podéis seleccionar el dato y copiarlo manualmente.' : 'Could not copy. Please select the details and copy them manually.') : copied ? (es ? 'Dato copiado.' : 'Details copied.') : ''}</p>
          <p className="home-gift__thanks">{es ? 'Gracias por acompañarnos en lo que viene.' : 'Thank you for being part of what comes next.'}</p>
        </div>
      </div>
    </section>
  );
}
